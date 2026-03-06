// js/order.js
// Objednavkovy formular: validace, Balíkovna widget (iframe + postMessage),
// PPL widget (JS event), EmailJS send.
// Zavisi na: cart.js (loadCart, calcTotal, clearCart — musi byt nacten drive)
// EmailJS je inicializovan v <head> index.html.

const MAPY_API_KEY = 'hRzqOVyudWJ2JpIpbNjCnk4WZ1ZL6zzpyZ6xk8QQ380';

const EMAILJS_SERVICE_ID = 'service_mxzi2lg';
const EMAILJS_CUSTOMER_TEMPLATE = 'template_1meyqyy';
const EMAILJS_OWNER_TEMPLATE = 'template_68460i9';

let selectedBalikovna = null; // { name, address, id }
let selectedPplPoint  = null; // { name, address, code }

// ── Balíkovna widget (iframe + postMessage) ───────────────────────────────────

function openBalikovnaModal() {
  const modal = document.getElementById('balikovna-modal');
  const overlay = document.getElementById('balikovna-overlay');
  if (modal) modal.hidden = false;
  if (overlay) overlay.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function closeBalikovnaModal() {
  const modal = document.getElementById('balikovna-modal');
  const overlay = document.getElementById('balikovna-overlay');
  if (modal) modal.hidden = true;
  if (overlay) overlay.classList.remove('is-active');
  document.body.style.overflow = '';
}

function handleBalikovnaMessage(event) {
  if (!event.origin.includes('cpost.cz') && !event.origin.includes('balikovna.cz')) return;

  const data = event.data;
  if (!data || data.message !== 'pickerResult') return;

  const point = data.point;
  if (!point || !point.name) return;

  selectedBalikovna = {
    name:    point.name,
    address: point.address || '',
    id:      point.id || ''
  };

  const nameEl = document.getElementById('balikovna-selected-name');
  if (nameEl) nameEl.textContent = point.name + (point.address ? ', ' + point.address : '');

  hideFieldError('balikovna-error');
  closeBalikovnaModal();
}

// ── PPL widget modal ──────────────────────────────────────────────────────────

function openPplModal() {
  const modal = document.getElementById('ppl-modal');
  const overlay = document.getElementById('ppl-overlay');
  if (modal) modal.classList.remove('ppl-modal--hidden');
  if (overlay) overlay.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function closePplModal() {
  const modal = document.getElementById('ppl-modal');
  const overlay = document.getElementById('ppl-overlay');
  if (modal) modal.classList.add('ppl-modal--hidden');
  if (overlay) overlay.classList.remove('is-active');
  document.body.style.overflow = '';
}

// ── PPL widget (JS event na document) ────────────────────────────────────────

function handlePplSelection(event) {
  console.log('[PPL] event.detail:', event.detail);

  const point = event.detail;
  if (!point) return;

  // PPL event.detail — ověříme klíče po prvním testu
  const name    = point.name || point.Name || '';
  const city    = point.city || point.City || '';
  const street  = point.street || point.Street || point.address || '';
  const code    = point.code || point.Code || point.id || '';

  if (!name) return;

  const addressParts = [street, city].filter(Boolean);
  selectedPplPoint = {
    name:    name,
    address: addressParts.join(', '),
    code:    code
  };

  const nameEl = document.getElementById('ppl-selected-name');
  if (nameEl) nameEl.textContent = name + (addressParts.length ? ', ' + addressParts.join(', ') : '');

  hideFieldError('ppl-error');
  closePplModal();
}

// ── Adresa autocomplete (Mapy.cz Suggest API) ────────────────────────────────

function initAddressAutocomplete(inputEl) {
  if (!inputEl) return;

  const wrapper = inputEl.closest('.form-group');
  if (!wrapper) return;
  wrapper.style.position = 'relative';

  const dropdown = document.createElement('ul');
  dropdown.className = 'address-suggestions';
  dropdown.hidden = true;
  wrapper.appendChild(dropdown);

  let debounceTimer = null;

  inputEl.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = inputEl.value.trim();
    if (query.length < 3) { dropdown.hidden = true; return; }
    debounceTimer = setTimeout(() => fetchAddressSuggestions(query, dropdown, inputEl), 300);
  });

  inputEl.addEventListener('blur', () => {
    setTimeout(() => { dropdown.hidden = true; }, 150);
  });
}

async function fetchAddressSuggestions(query, dropdown, inputEl) {
  if (MAPY_API_KEY === 'YOUR_MAPY_API_KEY') return;

  try {
    const url = 'https://api.mapy.com/v1/suggest?query=' + encodeURIComponent(query)
      + '&apikey=' + MAPY_API_KEY + '&lang=cs&limit=5&type=regional.address,regional.street';
    const res = await fetch(url);
    if (!res.ok) return;

    const data = await res.json();
    const items = (data.items || []).filter(i => i.name);

    dropdown.innerHTML = '';
    if (items.length === 0) { dropdown.hidden = true; return; }

    items.forEach(item => {
      // label = typ entity ("ulice", "obec") — pro zobrazení použijeme name + location
      const displayText = item.name + (item.location ? ', ' + item.location : '');
      const li = document.createElement('li');
      li.className = 'address-suggestions__item';
      li.textContent = displayText;
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        inputEl.value = displayText;
        inputEl.setCustomValidity('');
        dropdown.hidden = true;
      });
      dropdown.appendChild(li);
    });

    dropdown.hidden = false;
  } catch (err) {
    console.error('Mapy.cz suggest error:', err);
  }
}

// ── Delivery select handler ───────────────────────────────────────────────────

function handleDeliveryChange(value) {
  const sections = {
    'balikovna-vydejna': 'balikovna-section',
    'balikovna-domu':    'balikovna-domu-section',
    'ppl-box':           'ppl-box-section',
    'ppl-domu':          'home-delivery-section'
  };

  // Skryj všechny sekce
  Object.values(sections).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });

  // Zobraz relevantní sekci
  const activeId = sections[value];
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) el.hidden = false;
  }

  // Vycisti hodnoty skrytych poli
  if (value !== 'balikovna-vydejna') {
    selectedBalikovna = null;
    const el = document.getElementById('balikovna-selected-name');
    if (el) el.textContent = '';
  }
  if (value !== 'ppl-box') {
    selectedPplPoint = null;
    const el = document.getElementById('ppl-selected-name');
    if (el) el.textContent = '';
  }
  if (value !== 'balikovna-domu') {
    const input = document.querySelector('[name="balikovna_address"]');
    if (input) input.value = '';
  }
  if (value !== 'ppl-domu') {
    const input = document.querySelector('[name="home_address"]');
    if (input) input.value = '';
  }
}

// ── Form validation ──────────────────────────────────────────────────────────

function showFieldError(elId, message) {
  const el = document.getElementById(elId);
  if (el) { el.textContent = message; el.hidden = false; }
}

function hideFieldError(elId) {
  const el = document.getElementById(elId);
  if (el) el.hidden = true;
}

function showInputError(el, msg) {
  clearInputError(el);
  const err = document.createElement('p');
  err.className = 'form-error form-error--inline';
  err.textContent = msg;
  el.after(err);
  el.setAttribute('aria-invalid', 'true');
}

function clearInputError(el) {
  el.removeAttribute('aria-invalid');
  const next = el.nextElementSibling;
  if (next && next.classList.contains('form-error--inline')) next.remove();
}

function validateForm() {
  let valid = true;
  let firstInvalid = null;

  // Smaž předchozí inline errory
  document.querySelectorAll('.form-error--inline').forEach(el => el.remove());
  document.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));

  // Jméno
  const nameEl = document.querySelector('[name="full_name"]');
  if (nameEl && !nameEl.value.trim()) {
    showInputError(nameEl, 'Vyplňte prosím jméno a příjmení.');
    if (!firstInvalid) firstInvalid = nameEl;
    valid = false;
  }

  // Email — striktní regex validace
  const emailEl = document.querySelector('[name="email"]');
  if (emailEl) {
    const val = emailEl.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
    if (!val || !emailOk) {
      showInputError(emailEl, 'Zadejte platnou e-mailovou adresu (např. jan@gmail.com).');
      if (!firstInvalid) firstInvalid = emailEl;
      valid = false;
    }
  }

  // Telefon — jen required, žádná validace formátu
  const phoneEl = document.querySelector('[name="phone"]');
  if (phoneEl && !phoneEl.value.trim()) {
    showInputError(phoneEl, 'Vyplňte prosím telefonní číslo.');
    if (!firstInvalid) firstInvalid = phoneEl;
    valid = false;
  }

  // Doručení
  const deliveryEl = document.querySelector('[name="delivery"]');
  if (deliveryEl && !deliveryEl.value) {
    showInputError(deliveryEl, 'Vyberte způsob doručení.');
    if (!firstInvalid) firstInvalid = deliveryEl;
    valid = false;
  }

  // GDPR — chyba jde za celý label (checkbox je uvnitř labelu)
  const gdprEl = document.querySelector('[name="gdpr"]');
  if (gdprEl && !gdprEl.checked) {
    const gdprGroup = gdprEl.closest('.form-group--checkbox');
    const existing = gdprGroup?.querySelector('.form-error--inline');
    if (!existing) {
      const err = document.createElement('p');
      err.className = 'form-error form-error--inline';
      err.textContent = 'Pro odeslání objednávky je nutný souhlas se zpracováním osobních údajů.';
      gdprGroup ? gdprGroup.after(err) : gdprEl.after(err);
    }
    if (!firstInvalid) firstInvalid = gdprEl;
    valid = false;
  }

  const deliveryVal = deliveryEl?.value;

  if (deliveryVal === 'balikovna-vydejna' && !selectedBalikovna) {
    showFieldError('balikovna-error', 'Vyberte prosím pobočku Balíkovny.');
    valid = false;
  } else {
    hideFieldError('balikovna-error');
  }

  if (deliveryVal === 'balikovna-domu') {
    const input = document.querySelector('[name="balikovna_address"]');
    if (input && !input.value.trim()) {
      showInputError(input, 'Vyplňte doručovací adresu.');
      if (!firstInvalid) firstInvalid = input;
      valid = false;
    }
  }

  if (deliveryVal === 'ppl-box' && !selectedPplPoint) {
    showFieldError('ppl-error', 'Vyberte prosím PPL výdejní místo.');
    valid = false;
  } else {
    hideFieldError('ppl-error');
  }

  if (deliveryVal === 'ppl-domu') {
    const input = document.querySelector('[name="home_address"]');
    if (input && !input.value.trim()) {
      showInputError(input, 'Vyplňte doručovací adresu.');
      if (!firstInvalid) firstInvalid = input;
      valid = false;
    }
  }

  const cart = loadCart();
  if (cart.length === 0) {
    showFieldError('cart-error', 'Košík je prázdný. Přidejte prosím produkty před odesláním.');
    valid = false;
  } else {
    hideFieldError('cart-error');
  }

  if (firstInvalid) {
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valid;
}

// ── Cart summary formatter ────────────────────────────────────────────────────

function formatCartSummary(cart) {
  const lines = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return '';
    return product.name + ' x' + item.qty + ' = ' + (product.price * item.qty) + ' Kč';
  }).filter(Boolean);

  const { discount, net } = calcTotal(cart);
  if (discount > 0) lines.push('Sleva akce 3+1: −' + discount + ' Kč');
  lines.push('CELKEM: ' + net + ' Kč');
  return lines.join('\n');
}

// ── Form submit handler ───────────────────────────────────────────────────────

async function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Odesílám…'; }

  const successEl = document.getElementById('form-success');
  const errorEl   = document.getElementById('form-error');
  if (successEl) successEl.hidden = true;
  if (errorEl) errorEl.hidden = true;

  const cart = loadCart();
  const { net } = calcTotal(cart);
  const cartSummary = formatCartSummary(cart);

  const deliveryEl = document.querySelector('[name="delivery"]');
  const deliveryLabels = {
    'balikovna-vydejna': 'Balíkovna — výdejní místo (75 Kč)',
    'balikovna-domu':    'Balíkovna — domů (89 Kč)',
    'ppl-box':           'PPL — výdejní místo (79 Kč)',
    'ppl-domu':          'PPL — domů (106 Kč)',
    'osobni-odber':      'Osobní odběr (Struhařov)'
  };
  const deliveryLabel = deliveryLabels[deliveryEl?.value] || deliveryEl?.value || '';

  const pickupPoint = selectedBalikovna
    ? selectedBalikovna.name + ', ' + selectedBalikovna.address
    : selectedPplPoint
      ? selectedPplPoint.name + ', ' + selectedPplPoint.address
      : '—';

  const homeAddress = document.querySelector('[name="balikovna_address"]')?.value
    || document.querySelector('[name="home_address"]')?.value
    || '—';

  const now = new Date();
  const vs = String(now.getFullYear()).slice(2)
    + String(now.getMonth() + 1).padStart(2, '0')
    + String(now.getDate()).padStart(2, '0')
    + String(Math.floor(Math.random() * 9000) + 1000);
  const orderNumber = 'MS-' + vs;

  const params = {
    full_name:       document.querySelector('[name="full_name"]')?.value || '',
    email:           document.querySelector('[name="email"]')?.value || '',
    phone:           document.querySelector('[name="phone"]')?.value || '',
    delivery:        deliveryLabel,
    pickup_point:    pickupPoint,
    home_address:    homeAddress,
    note:            document.querySelector('[name="note"]')?.value || '—',
    cart_summary:    cartSummary,
    total:           net,
    order_number:    orderNumber,
    variable_symbol: vs
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_OWNER_TEMPLATE, params);
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE, params);

    if (successEl) successEl.hidden = false;
    if (submitBtn) submitBtn.textContent = 'Odesláno ✓';
    clearCart();

  } catch (err) {
    console.error('EmailJS error:', err);
    const detail = err?.text || err?.message || JSON.stringify(err);
    if (errorEl) {
      errorEl.textContent = 'Něco se nepovedlo: ' + detail + '. Kontaktujte nás na Instagramu.';
      errorEl.hidden = false;
    }
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Odeslat objednávku'; }
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────

function initOrderForm() {
  const form = document.getElementById('order-form');
  if (!form) return;

  form.addEventListener('submit', handleFormSubmit);

  // Blur validace — real-time feedback při vyplňování
  const nameEl = document.querySelector('[name="full_name"]');
  if (nameEl) nameEl.addEventListener('blur', () => {
    if (!nameEl.value.trim()) showInputError(nameEl, 'Vyplňte prosím jméno a příjmení.');
    else clearInputError(nameEl);
  });

  const emailEl = document.querySelector('[name="email"]');
  if (emailEl) emailEl.addEventListener('blur', () => {
    const val = emailEl.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
    if (!val || !ok) showInputError(emailEl, 'Zadejte platnou e-mailovou adresu (např. jan@gmail.com).');
    else clearInputError(emailEl);
  });

  const phoneEl = document.querySelector('[name="phone"]');
  if (phoneEl) phoneEl.addEventListener('blur', () => {
    if (!phoneEl.value.trim()) showInputError(phoneEl, 'Vyplňte prosím telefonní číslo.');
    else clearInputError(phoneEl);
  });

  const deliverySelect = document.querySelector('[name="delivery"]');
  if (deliverySelect) {
    deliverySelect.addEventListener('change', (e) => handleDeliveryChange(e.target.value));
  }

  // Balíkovna modal
  document.getElementById('balikovna-open-btn')?.addEventListener('click', openBalikovnaModal);
  document.getElementById('balikovna-modal-close')?.addEventListener('click', closeBalikovnaModal);
  document.getElementById('balikovna-overlay')?.addEventListener('click', closeBalikovnaModal);
  window.addEventListener('message', handleBalikovnaMessage);

  // PPL modal
  document.getElementById('ppl-open-btn')?.addEventListener('click', openPplModal);
  document.getElementById('ppl-modal-close')?.addEventListener('click', closePplModal);
  document.getElementById('ppl-overlay')?.addEventListener('click', closePplModal);

  // Autocomplete pro adresní pole
  initAddressAutocomplete(document.getElementById('balikovna_address'));
  initAddressAutocomplete(document.getElementById('home_address'));

  document.addEventListener('ppl-parcelshop-map', handlePplSelection);
}
