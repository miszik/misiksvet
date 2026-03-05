// js/order.js
// Objednavkovy formular: validace, Balíkovna widget (iframe + postMessage),
// PPL widget (JS event), EmailJS send.
// Zavisi na: cart.js (loadCart, calcTotal, clearCart — musi byt nacten drive)
// EmailJS je inicializovan v <head> index.html.

const MAPY_API_KEY = 'YOUR_MAPY_API_KEY'; // Registrace zdarma: developer.mapy.com (Seznam účet)

const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_CUSTOMER_TEMPLATE = 'YOUR_CUSTOMER_TEMPLATE_ID';
const EMAILJS_OWNER_TEMPLATE = 'YOUR_OWNER_TEMPLATE_ID';

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

// ── PPL widget (JS event na document) ────────────────────────────────────────

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

function handlePplSelection(event) {
  // DEBUG — dočasně logujeme detail pro ověření struktury dat
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
      + '&apikey=' + MAPY_API_KEY + '&lang=cs&limit=5&type=regional';
    const res = await fetch(url);
    if (!res.ok) return;

    const data = await res.json();
    const items = (data.items || []).filter(i => i.label);

    dropdown.innerHTML = '';
    if (items.length === 0) { dropdown.hidden = true; return; }

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'address-suggestions__item';
      li.textContent = item.label;
      li.addEventListener('mousedown', (e) => {
        e.preventDefault(); // zabránit blur před klikem
        inputEl.value = item.label;
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

function validateForm() {
  let valid = true;

  const fieldValidations = [
    { el: document.querySelector('[name="full_name"]'), msg: 'Vyplňte prosím jméno a příjmení.' },
    { el: document.querySelector('[name="email"]'),     msg: 'Zadejte platnou e-mailovou adresu.' },
    { el: document.querySelector('[name="phone"]'),     msg: 'Zadejte telefonní číslo (např. +420 123 456 789).' },
    { el: document.querySelector('[name="delivery"]'),  msg: 'Vyberte způsob doručení.' },
    { el: document.querySelector('[name="gdpr"]'),      msg: 'Pro odeslání objednávky je nutný souhlas se zpracováním osobních údajů.' }
  ];

  fieldValidations.forEach(({ el, msg }) => {
    if (!el) return;
    el.setCustomValidity('');
    if (!el.checkValidity()) {
      el.setCustomValidity(msg);
      el.reportValidity();
      if (valid) el.focus();
      valid = false;
    }
  });

  const deliveryVal = document.querySelector('[name="delivery"]')?.value;

  if (deliveryVal === 'balikovna-vydejna' && !selectedBalikovna) {
    showFieldError('balikovna-error', 'Vyberte prosím pobočku Balíkovny.');
    valid = false;
  } else {
    hideFieldError('balikovna-error');
  }

  if (deliveryVal === 'balikovna-domu') {
    const input = document.querySelector('[name="balikovna_address"]');
    if (input && !input.value.trim()) {
      input.setCustomValidity('Vyplňte doručovací adresu.');
      input.reportValidity();
      valid = false;
    } else if (input) { input.setCustomValidity(''); }
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
      input.setCustomValidity('Vyplňte doručovací adresu.');
      input.reportValidity();
      valid = false;
    } else if (input) { input.setCustomValidity(''); }
  }

  const cart = loadCart();
  if (cart.length === 0) {
    showFieldError('cart-error', 'Košík je prázdný. Přidejte prosím produkty před odesláním.');
    valid = false;
  } else {
    hideFieldError('cart-error');
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
    'osobni-odber':      'Osobní odběr (Ostrava)'
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

  const params = {
    full_name:    document.querySelector('[name="full_name"]')?.value || '',
    email:        document.querySelector('[name="email"]')?.value || '',
    phone:        document.querySelector('[name="phone"]')?.value || '',
    delivery:     deliveryLabel,
    pickup_point: pickupPoint,
    home_address: homeAddress,
    note:         document.querySelector('[name="note"]')?.value || '—',
    cart_summary: cartSummary,
    total:        net + ' Kč'
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_OWNER_TEMPLATE, params);
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE, params);

    if (successEl) successEl.hidden = false;
    if (submitBtn) submitBtn.textContent = 'Odesláno ✓';
    clearCart();

  } catch (err) {
    console.error('EmailJS error:', err);
    if (errorEl) errorEl.hidden = false;
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Odeslat objednávku'; }
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────

function initOrderForm() {
  const form = document.getElementById('order-form');
  if (!form) return;

  form.addEventListener('submit', handleFormSubmit);

  const deliverySelect = document.querySelector('[name="delivery"]');
  if (deliverySelect) {
    deliverySelect.addEventListener('change', (e) => handleDeliveryChange(e.target.value));
  }

  // Balíkovna modal
  document.getElementById('balikovna-open-btn')?.addEventListener('click', openBalikovnaModal);
  document.getElementById('balikovna-modal-close')?.addEventListener('click', closeBalikovnaModal);
  document.getElementById('balikovna-overlay')?.addEventListener('click', closeBalikovnaModal);
  window.addEventListener('message', handleBalikovnaMessage);

  // Autocomplete pro adresní pole
  initAddressAutocomplete(document.getElementById('balikovna_address'));
  initAddressAutocomplete(document.getElementById('home_address'));

  // PPL modal
  document.getElementById('ppl-open-btn')?.addEventListener('click', openPplModal);
  document.getElementById('ppl-modal-close')?.addEventListener('click', closePplModal);
  document.getElementById('ppl-overlay')?.addEventListener('click', closePplModal);
  document.addEventListener('ppl-parcelshop-map', handlePplSelection);
}
