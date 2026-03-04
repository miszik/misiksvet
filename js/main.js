// js/main.js
// Phase 1: renderovani produktovych karet + inicializace navigace
// Phase 2 prida: inicializaci kosiku (cart.js)
// Phase 3 prida: inicializaci formulare (order.js)

/**
 * Vyrenderuje produktove karty do #product-grid z PRODUCTS pole (products.js).
 * Phase 1: pouze vizualni karta — zadne tlacitko "Pridat do kosiku".
 * Phase 2 prida: <button class="btn-add" data-id="${p.id}">Pridat do kosiku</button>
 */
function renderProductCards() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card">
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
        <p class="product-card__price">${p.price}&nbsp;Kč</p>
      </div>
    </article>
  `).join('');
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
  initNav();
});
