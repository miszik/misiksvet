// js/main.js
// Phase 1: renderovani produktovych karet + inicializace navigace
// Phase 2: inicializace kosiku (cart.js) — initCart() pridano
// Phase 3 prida: inicializaci formulare (order.js)

function productCardHTML(p) {
  return `
    <article class="product-card" data-product-id="${p.id}" role="button" tabindex="0" aria-label="Zobrazit detail: ${p.name}">
      <img
        src="${p.image}"
        alt="${p.name} — ${p.material}"
        loading="lazy"
        width="600"
        height="600"
      >
      <div class="product-card__body">
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__desc">${p.description}</p>
        <p class="product-card__material">${p.material}</p>
        <p class="product-card__avail">Ušito na zakázku · <span>expedice do 14 dní</span></p>
        <p class="product-card__price">${p.price}&nbsp;Kč</p>
        <button class="btn btn--primary btn-add" data-id="${p.id}">Přidat do košíku</button>
      </div>
    </article>
  `;
}

function renderProductCards() {
  const gridUterky  = document.getElementById('product-grid-uterky');
  const gridDoplnky = document.getElementById('product-grid-doplnky');
  if (!gridUterky || !gridDoplnky) return;

  gridUterky.innerHTML  = PRODUCTS.filter(p => p.type === 'uterka').map(productCardHTML).join('');
  gridDoplnky.innerHTML = PRODUCTS.filter(p => p.type !== 'uterka').map(productCardHTML).join('');
}

function openProductModal(productId) {
  const p = PRODUCTS.find(p => p.id === productId);
  if (!p) return;

  const modal = document.getElementById('product-modal');
  const mainImg = modal.querySelector('.product-modal__img');
  const thumbsEl = modal.querySelector('.product-modal__thumbs');

  mainImg.src = p.images[0];
  mainImg.alt = p.name;
  modal.querySelector('.product-modal__name').textContent = p.name;
  modal.querySelector('.product-modal__desc').textContent = p.description;
  modal.querySelector('.product-modal__material').textContent = 'Materiál: ' + p.material;
  modal.querySelector('.product-modal__price').textContent = p.price + '\u00a0Kč';
  modal.querySelector('.btn-modal-add').dataset.id = p.id;

  const sizeEl = modal.querySelector('.product-modal__size');
  if (p.size) { sizeEl.textContent = 'Rozměr: ' + p.size; sizeEl.hidden = false; }
  else { sizeEl.hidden = true; }

  const propsEl = modal.querySelector('.product-modal__properties');
  if (p.properties?.length) {
    propsEl.innerHTML = p.properties.map(v => `<li>${v}</li>`).join('');
    propsEl.hidden = false;
  } else { propsEl.hidden = true; }

  const usesEl = modal.querySelector('.product-modal__uses');
  if (p.uses) { usesEl.textContent = 'Použití: ' + p.uses; usesEl.hidden = false; }
  else { usesEl.hidden = true; }

  const careEl = modal.querySelector('.product-modal__care');
  if (p.care?.length) {
    careEl.innerHTML = '<li class="care-heading">Péče:</li>' + p.care.map(c => `<li>${c}</li>`).join('');
    careEl.hidden = false;
  } else { careEl.hidden = true; }

  // Galerie thumbnailů
  if (p.images.length > 1) {
    thumbsEl.innerHTML = p.images.map((src, i) => `
      <button class="product-modal__thumb ${i === 0 ? 'active' : ''}" data-src="${src}" aria-label="Foto ${i + 1}">
        <img src="${src}" alt="${p.name} — foto ${i + 1}" width="80" height="80">
      </button>
    `).join('');
    thumbsEl.hidden = false;
    thumbsEl.querySelectorAll('.product-modal__thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        mainImg.src = btn.dataset.src;
        thumbsEl.querySelectorAll('.product-modal__thumb').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  } else {
    thumbsEl.innerHTML = '';
    thumbsEl.hidden = true;
  }

  modal.removeAttribute('hidden');
  document.body.classList.add('modal-open');
  modal.querySelector('.product-modal__close').focus();
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  modal.setAttribute('hidden', '');
  document.body.classList.remove('modal-open');
}

function initProductModals() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.btn-add')) return; // klik na "Přidat do košíku" — neotvírat modal
      openProductModal(card.dataset.productId);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProductModal(card.dataset.productId);
      }
    });
  });

  const modal = document.getElementById('product-modal');

  modal.querySelector('.product-modal__close').addEventListener('click', closeProductModal);
  modal.querySelector('.product-modal__overlay').addEventListener('click', closeProductModal);
  modal.querySelector('.btn-modal-add').addEventListener('click', e => {
    addToCart(e.currentTarget.dataset.id);
    closeProductModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProductModal();
  });
}

/**
 * Inicializuje navigaci:
 * - Hamburger toggle (klik otevira/zavira .nav-links pomoci tridy .open)
 * - Scroll shadow (.scrolled trida na nav po scrollu > 10px)
 */
function initNav() {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.setAttribute(
        'aria-expanded',
        navLinks.classList.contains('open') ? 'true' : 'false'
      );
    });

    // Zavreni menu po kliknuti na odkaz (UX na mobilu)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }
}

// Entry point
document.addEventListener('DOMContentLoaded', () => {
  renderProductCards();
  initProductModals();
  initNav();
  initCart();
  initOrderForm();
});
