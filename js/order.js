// js/order.js
// Objednavkovy formular: validace, Packeta widget, EmailJS send.
// Zavisi na: cart.js (loadCart, calcTotal, clearCart — musi byt nacten drive)
// EmailJS je inicializovan v <head> index.html.
// Packeta.Widget je dostupny pres synchronni CDN script v <body> pred timto souborem.

const PACKETA_API_KEY = 'YOUR_PACKETA_API_KEY'; // Doplni Misa z client.packeta.com
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';   // Doplni Misa z EmailJS dashboard
const EMAILJS_CUSTOMER_TEMPLATE = 'YOUR_CUSTOMER_TEMPLATE_ID'; // "customer_confirmation"
const EMAILJS_OWNER_TEMPLATE = 'YOUR_OWNER_TEMPLATE_ID';       // "owner_notification"

let selectedPickupPoint = null; // Ulozi vybrany Packeta bod

// ── Packeta widget ────────────────────────────────────────────────────────────

function openPacketaWidget() {
  const options = {
    language: 'cs',
    country: 'cz',
    view: 'modal',
    valueFormat: '"Packeta",id,name,city,street',
    vendors: [{ country: 'cz' }]
  };

  Packeta.Widget.pick(PACKETA_API_KEY, function(point) {
    if (point) {
      selectedPickupPoint = point;
      const nameEl = document.getElementById('packeta-selected-name');
      if (nameEl) nameEl.textContent = point.name + ', ' + point.city;
      const errEl = document.getElementById('packeta-error');
      if (errEl) errEl.hidden = true;
    }
  }, options);
}

// ── Delivery select handler ───────────────────────────────────────────────────

function handleDeliveryChange(value) {
  const packetaSection = document.getElementById('packeta-section');
  const homeSection = document.getElementById('home-delivery-section');
  const homeAddressInput = document.querySelector('[name="home_address"]');

  if (packetaSection) packetaSection.hidden = value !== 'packeta-vydejna';
  if (homeSection) homeSection.hidden = value !== 'packeta-domu';

  // Vycisti hodnoty skrytych poli — jinak by se dostaly do emailu
  if (value !== 'packeta-vydejna') {
    selectedPickupPoint = null;
    const nameEl = document.getElementById('packeta-selected-name');
    if (nameEl) nameEl.textContent = '';
  }
  if (value !== 'packeta-domu' && homeAddressInput) {
    homeAddressInput.value = '';
  }
}

// ── Form validation ──────────────────────────────────────────────────────────
// Pouzivame novalidate na formu + manualni validaci pro ceske hlasky.
// setCustomValidity() + reportValidity() zobrazi browser bublinu s ceskou zpravou.

function showFieldError(elId, message) {
  const el = document.getElementById(elId);
  if (el) {
    el.textContent = message;
    el.hidden = false;
  }
}

function hideFieldError(elId) {
  const el = document.getElementById(elId);
  if (el) el.hidden = true;
}

function validateForm() {
  let valid = true;

  // Standardni povinne fieldy s Czech hlasky
  const fieldValidations = [
    {
      el: document.querySelector('[name="full_name"]'),
      msg: 'Vyplňte prosím jméno a příjmení.'
    },
    {
      el: document.querySelector('[name="email"]'),
      msg: 'Zadejte platnou e-mailovou adresu.'
    },
    {
      el: document.querySelector('[name="phone"]'),
      msg: 'Zadejte telefonní číslo (např. +420 123 456 789).'
    },
    {
      el: document.querySelector('[name="delivery"]'),
      msg: 'Vyberte způsob doručení.'
    },
    {
      el: document.querySelector('[name="gdpr"]'),
      msg: 'Pro odeslání objednávky je nutný souhlas se zpracováním osobních údajů.'
    }
  ];

  fieldValidations.forEach(({ el, msg }) => {
    if (!el) return;
    el.setCustomValidity('');
    if (!el.checkValidity()) {
      el.setCustomValidity(msg);
      el.reportValidity();
      if (valid) el.focus(); // fokus na prvni chybne pole
      valid = false;
    }
  });

  // Podmínena validace: home_address kdyz delivery = packeta-domu
  const deliveryVal = document.querySelector('[name="delivery"]')?.value;
  if (deliveryVal === 'packeta-domu') {
    const homeInput = document.querySelector('[name="home_address"]');
    if (homeInput && !homeInput.value.trim()) {
      homeInput.setCustomValidity('Vyplňte doručovací adresu.');
      homeInput.reportValidity();
      valid = false;
    } else if (homeInput) {
      homeInput.setCustomValidity('');
    }
  }

  // Packeta bod: vybran kdyz delivery = packeta-vydejna
  if (deliveryVal === 'packeta-vydejna' && !selectedPickupPoint) {
    showFieldError('packeta-error', 'Vyberte prosím výdejní místo Zásilkovny.');
    valid = false;
  } else {
    hideFieldError('packeta-error');
  }

  // Prazdny kosik
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
// Generuje textovy prehled kosiku pro emailjs params.

function formatCartSummary(cart) {
  const lines = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return '';
    return product.name + ' x' + item.qty + ' = ' + (product.price * item.qty) + ' Kč';
  }).filter(Boolean);

  const { gross, discount, net } = calcTotal(cart);
  if (discount > 0) {
    lines.push('Sleva akce 3+1: −' + discount + ' Kč');
  }
  lines.push('CELKEM: ' + net + ' Kč');
  return lines.join('\n');
}

// ── Form submit handler ───────────────────────────────────────────────────────

async function handleFormSubmit(e) {
  e.preventDefault(); // MUSI byt prvni — zabranni reload stranky na GitHub Pages

  if (!validateForm()) return;

  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Odesílám…';
  }

  // Schovej predchozi stavove zpravy
  const successEl = document.getElementById('form-success');
  const errorEl = document.getElementById('form-error');
  if (successEl) successEl.hidden = true;
  if (errorEl) errorEl.hidden = true;

  const cart = loadCart();
  const { net } = calcTotal(cart);
  const cartSummary = formatCartSummary(cart);

  const deliveryEl = document.querySelector('[name="delivery"]');
  const deliveryLabels = {
    'packeta-vydejna': 'Zásilkovna — výdejní místo',
    'packeta-domu': 'Zásilkovna — doručení domů',
    'osobni-odber': 'Osobní odběr (Ostrava)'
  };
  const deliveryLabel = deliveryLabels[deliveryEl?.value] || deliveryEl?.value || '';

  const params = {
    full_name:    document.querySelector('[name="full_name"]')?.value || '',
    email:        document.querySelector('[name="email"]')?.value || '',
    phone:        document.querySelector('[name="phone"]')?.value || '',
    delivery:     deliveryLabel,
    pickup_point: selectedPickupPoint
      ? selectedPickupPoint.name + ', ' + selectedPickupPoint.city
      : '—',
    home_address: document.querySelector('[name="home_address"]')?.value || '—',
    note:         document.querySelector('[name="note"]')?.value || '—',
    cart_summary: cartSummary,
    total:        net + ' Kč'
  };

  try {
    // 1. Notifikace Mise
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_OWNER_TEMPLATE, params);
    // 2. Potvrzeni zakaznikovi
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE, params);

    // Uspech
    if (successEl) successEl.hidden = false;
    if (submitBtn) {
      submitBtn.textContent = 'Odesláno ✓';
      // Tlacitko zusatva deaktivovano po uspesnem odeslani — zabranna duplicit
    }

    clearCart(); // Smaze localStorage a re-renderuje prazdny kosik

  } catch (err) {
    console.error('EmailJS error:', err);
    if (errorEl) errorEl.hidden = false;
    // Re-aktivuj tlacitko pouze pri chybe — uzivatel muze zkusit znovu
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Odeslat objednávku';
    }
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

  const packetaBtn = document.getElementById('packeta-open-btn');
  if (packetaBtn) {
    packetaBtn.addEventListener('click', openPacketaWidget);
  }
}
