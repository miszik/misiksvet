// js/cart.js
// Cart state modul pro Mišik svět.
// Vsechna data ziji v localStorage a cart poli — ZADNY cart state v DOMu.
// Vsechny funkce jsou plain globals (zadny export) — kompatibilni s vanilla browser.
// Funkce loadCart(), calcTotal(), clearCart() jsou pouzivany v order.js (Plan 03).

const CART_KEY = 'misiksvet-cart';

// ── Storage helpers ──────────────────────────────────────────────────────────

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return []; // Soukrome prohlizeni nebo quota — prace v pameti
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // Ticha chyba — kosik funguje v pameti pro tuto session
  }
}

function clearCart() {
  try {
    localStorage.removeItem(CART_KEY);
  } catch {}
  renderCart([]);
  updateNavBadge([]);
}

// ── Mutations ────────────────────────────────────────────────────────────────

function addToCart(productId) {
  const cart = loadCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  renderCart(cart);
  updateNavBadge(cart);
  openDrawer();
}

function updateQty(productId, delta) {
  const cart = loadCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(0, item.qty + delta);
  const filtered = cart.filter(i => i.qty > 0);
  saveCart(filtered);
  renderCart(filtered);
  updateNavBadge(filtered);
}

function removeItem(productId) {
  const cart = loadCart().filter(i => i.id !== productId);
  saveCart(cart);
  renderCart(cart);
  updateNavBadge(cart);
}

// ── Promo 3+1 logika ─────────────────────────────────────────────────────────
// Pravidlo: kazde 4 kusy uterek = 1 kus nejlevnejsi uterky zdarma.
// Zastera (type: 'zastera') NIKDY nevstupuje do akce.
// Vypocet je pouze pro zobrazeni — NESKLADUJEME discount v localStorage.

function calcPromo(cart) {
  // Expanduj vsechny uterky na jednotlive kusy, serazene od nejlevnejsi
  const uterkyPrices = cart
    .filter(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return product && product.type === 'uterka';
    })
    .flatMap(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return Array(item.qty).fill(product.price);
    })
    .sort((a, b) => a - b); // nejlevnejsi prvni

  const freeCount = Math.floor(uterkyPrices.length / 4);
  const discount = uterkyPrices.slice(0, freeCount).reduce((sum, price) => sum + price, 0);
  return discount;
}

function calcTotal(cart) {
  const gross = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  const discount = calcPromo(cart);
  return { gross, discount, net: gross - discount };
}

// ── UI rendering ─────────────────────────────────────────────────────────────

function renderCart(cart) {
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.querySelector('.cart-total');
  const discountEl = document.querySelector('.cart-discount');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Košík je prázdný.</p>';
    if (totalEl) totalEl.textContent = '';
    if (discountEl) { discountEl.textContent = ''; discountEl.hidden = true; }
    return;
  }

  itemsEl.innerHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return '';
    const lineTotal = product.price * item.qty;
    return `
      <div class="cart-item" data-id="${item.id}">
        <span class="cart-item__name">${product.name}</span>
        <span class="cart-item__qty">
          <button class="qty-dec" aria-label="Snížit množství">−</button>
          <span>${item.qty}</span>
          <button class="qty-inc" aria-label="Zvýšit množství">+</button>
        </span>
        <span class="cart-item__price">${lineTotal}&nbsp;Kč</span>
        <button class="cart-item__remove" aria-label="Odebrat z košíku">✕</button>
      </div>
    `;
  }).join('');

  const { gross, discount, net } = calcTotal(cart);
  if (totalEl) totalEl.textContent = `Celkem: ${net} Kč`;
  if (discountEl) {
    if (discount > 0) {
      discountEl.textContent = `Sleva akce 3+1: −${discount} Kč`;
      discountEl.hidden = false;
    } else {
      discountEl.textContent = '';
      discountEl.hidden = true;
    }
  }
}

function updateNavBadge(cart) {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.querySelector('.cart-count');
  if (badge) {
    badge.textContent = total;
    badge.hidden = total === 0;
  }
}

// ── Drawer open/close ────────────────────────────────────────────────────────

function openDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer) { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
  if (overlay) overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
  if (overlay) overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

// ── Init ─────────────────────────────────────────────────────────────────────

function initCart() {
  // Nacti a zobraz ulozeny kosik
  const cart = loadCart();
  renderCart(cart);
  updateNavBadge(cart);

  // "Pridat do kosiku" — delegovany listener na product-grid
  const grid = document.getElementById('product-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-add');
      if (btn) addToCart(btn.dataset.id);
    });
  }

  // Otevrit drawer kliknutim na nav ikonu
  const navBtn = document.getElementById('cart-nav-btn');
  if (navBtn) navBtn.addEventListener('click', openDrawer);

  // Zavrit drawer
  const closeBtn = document.querySelector('.cart-drawer__close');
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Qty +/- a remove — delegovane na cart-items
  const itemsEl = document.getElementById('cart-items');
  if (itemsEl) {
    itemsEl.addEventListener('click', (e) => {
      const cartItem = e.target.closest('.cart-item');
      if (!cartItem) return;
      const id = cartItem.dataset.id;

      if (e.target.closest('.qty-inc')) updateQty(id, 1);
      else if (e.target.closest('.qty-dec')) updateQty(id, -1);
      else if (e.target.closest('.cart-item__remove')) removeItem(id);
    });
  }
}
