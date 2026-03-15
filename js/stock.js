// js/stock.js
// Firebase Realtime Database — správa skladu utěrek a zástěr.
// Používá Firebase REST API (bez SDK) — kompatibilní s vanilla browser.
// Globální: currentStock, stockBadge(), decrementStock(), initStock()

const FIREBASE_DB_URL = 'https://misiksvet-e77ea-default-rtdb.europe-west1.firebasedatabase.app';

let currentStock = { uterky: 999, zastery: 999 }; // fail-open výchozí hodnoty

// ── Čtení skladu ─────────────────────────────────────────────────────────────

async function fetchStock() {
  try {
    const res = await fetch(FIREBASE_DB_URL + '/.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    return {
      uterky:  typeof data?.uterky  === 'number' ? data.uterky  : 999,
      zastery: typeof data?.zastery === 'number' ? data.zastery : 999
    };
  } catch {
    return { uterky: 999, zastery: 999 }; // při chybě neblokuj objednávky
  }
}

// ── Odečtení skladu po objednávce ─────────────────────────────────────────────

async function decrementStock(cart) {
  try {
    const uterkyQty = cart
      .filter(item => PRODUCTS.find(p => p.id === item.id)?.type === 'uterka')
      .reduce((sum, item) => sum + item.qty, 0);
    const zastery = cart
      .filter(item => PRODUCTS.find(p => p.id === item.id)?.type === 'zastera')
      .reduce((sum, item) => sum + item.qty, 0);

    const stock = await fetchStock();
    const updates = {};
    if (uterkyQty > 0) updates.uterky  = Math.max(0, stock.uterky  - uterkyQty);
    if (zastery  > 0) updates.zastery = Math.max(0, stock.zastery - zastery);
    if (Object.keys(updates).length === 0) return;

    await fetch(FIREBASE_DB_URL + '/.json', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    currentStock = { ...stock, ...updates };
    applyStockBadges(currentStock);
  } catch (err) {
    console.warn('decrementStock failed:', err);
  }
}

// ── Badge text + CSS třída ────────────────────────────────────────────────────

function stockBadge(stock, type) {
  if (type === 'uterka') {
    if (stock.uterky === 0)  return { text: 'Na objednání — delší dodací lhůta', cls: 'stock--unavailable' };
    if (stock.uterky <= 3)   return { text: 'Poslední kusy · expedice do 14 dní', cls: 'stock--low' };
    return { text: 'Expedice do 14 dní', cls: 'stock--ok' };
  } else {
    if (stock.zastery === 0) return { text: 'Na objednání — delší dodací lhůta', cls: 'stock--unavailable' };
    if (stock.zastery <= 1)  return { text: 'Poslední kus · expedice do 14 dní', cls: 'stock--low' };
    return { text: 'Expedice do 14 dní', cls: 'stock--ok' };
  }
}

// ── Aktualizace badge na kartách ──────────────────────────────────────────────

function applyStockBadges(stock) {
  document.querySelectorAll('[data-product-id]').forEach(card => {
    const product = PRODUCTS.find(p => p.id === card.dataset.productId);
    if (!product) return;
    const badge = stockBadge(stock, product.type);
    const span = card.querySelector('.product-card__avail span');
    if (span) { span.textContent = badge.text; span.className = badge.cls; }
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

async function initStock() {
  currentStock = await fetchStock();
  applyStockBadges(currentStock);
}
