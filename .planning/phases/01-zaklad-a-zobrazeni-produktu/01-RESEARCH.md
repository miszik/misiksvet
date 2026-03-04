# Phase 1: Základ a zobrazení produktů — Research

**Researched:** 2026-03-04
**Domain:** Vanilla HTML5/CSS3/JS static site — greenfield build, GitHub Pages hosting
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Vizuální styl (LOCKED)**
- Barevná paleta: béžová (#f5f0e8), krémová (#faf8f4), teplá hnědá (#8b6914), tlumená zelená (#5a7a4a) jako akcent
- Nadpisy: Cormorant Garamond (Google Fonts) — elegantní, serifové
- Tělo textu: Josefin Sans (Google Fonts) — čisté, bezpatkové
- Atmosféra: skandinávský minimalismus + česká příroda, vzdušný layout, hodně bílého prostoru
- Žádné křiklavé barvy, žádné flashy animace

**Fonty (LOCKED)**
- Google Fonts CDN: `Cormorant+Garamond:ital,wght@0,400;0,600;1,400` + `Josefin+Sans:wght@300;400`
- Žádné lokální fonty — jednoduché CDN načítání

**Struktura stránky (LOCKED — dle zadání)**
1. **Hero** — velký název "Mišik svět", podtitulek "Ručně vyšívané lněné výrobky", poetický text, fade-in animace
2. **Příběh** — "Z lásky ke lnu a lučním květinám", text o Míše, fotka produktu vedle textu
3. **Galerie / Výrobky** — "Z mé dílny", 4 produktové karty (3 utěrky + zástěra)
4. **Hodnoty** — 3 bloky: 🌾 Český len / 🪡 Strojová výšivka / 🎁 Krásné balení
5. **Akce 3+1** — zvýrazněný banner (POUZE pro utěrky)
6. **Kontakt** — odkaz na Instagram @misiksvet
7. **Patička** — © 2025 Mišik svět · Vyrobeno s láskou v Čechách

**Produkty (LOCKED)**
- Utěrka Kopretina — 380 Kč — fotka: fotky/20251208_185910.jpg
- Utěrka Vlčí mák — 380 Kč — fotka: fotky/20251208_190226.jpg
- Utěrka Šiška s větvičkou — 380 Kč — fotka: fotky/20251208_190438.jpg
- Zástěra — 890 Kč — fotka: fotky/20251115_111917.jpg
- Hero/skupinová fotka: fotky/20251208_190557.jpg
- Fotky zatím NEJSOU optimalizovány (to je Phase 4) — v Phase 1 použít originály s `loading="lazy"`

**Navigace (LOCKED)**
- Fixní horní lišta (sticky)
- Logo "Mišik svět" vlevo, odkazy vpravo: Příběh · Výrobky · Kontakt
- Na scrollu: jemné pozadí/stín přidán CSS třídou via JS
- Mobil: hamburger menu (pure CSS nebo minimální JS)

**Animace (LOCKED)**
- Pouze fade-in na hero sekci při načtení stránky
- CSS animace (@keyframes fadeIn), žádná JS animační knihovna
- Žádné složité animace jinde

**Tech stack (LOCKED)**
- Čistý HTML5 + CSS3 + minimální vanilla JS
- Žádný framework, žádný build krok, žádné npm
- Soubory: index.html, css/style.css, js/main.js (Phase 1 — navigace JS)
- `.nojekyll` soubor v rootu (POVINNÉ pro GitHub Pages)

**Přístupnost a SEO v Phase 1 (LOCKED)**
- Alt texty u VŠECH obrázků (SEO je až Phase 4, ale alt texty patří do HTML)
- `lang="cs"` na `<html>` tagu
- `charset="UTF-8"` v meta
- Správná česká diakritika, nezlomitelné mezery (&nbsp;) u jednopísmenných předložek

**Legální texty (LOCKED)**
- Informace o 14denním právu na vrácení — v patičce nebo sekci kontakt
- GDPR poznámka — krátký odstavec (formulář je Phase 3, ale zmínka patří sem)

### Claude's Discretion
- Přesné CSS hodnoty (padding, margin, breakpointy) — dle dobrého designového úsudku
- Pořadí CSS breakpointů (mobile-first preferred)
- Hover efekty na produktových kartách
- Výška hero sekce (min-height, viewport)
- Hamburger menu implementace (pure CSS nebo JS toggle)

### Deferred Ideas (OUT OF SCOPE)
- Košík a interaktivita — Phase 2
- Objednávkový formulář — Phase 3
- Zásilkovna widget — Phase 3
- EmailJS integrace — Phase 3
- Optimalizace fotek do WebP — Phase 4
- SEO meta tagy a Open Graph — Phase 4
- GitHub Pages nasazení a vlastní doména — Phase 4
- Personalizace zástěry (vlastní text) — v2
- Sezónní motivy — v2
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DISP-01 | Návštěvník vidí hero sekci s názvem značky, podtitulem a poetickým textem | HTML `<section id="hero">` + CSS min-height + @keyframes fadeIn; exact text locked in CONTEXT.md specifics |
| DISP-02 | Návštěvník vidí příběh autorky (sekce "O mně") s fotkou produktu | HTML two-column layout (text + image); CSS Grid or Flexbox; image uses `loading="lazy"` |
| DISP-03 | Návštěvník vidí 4 produktové karty s fotkou, popisem, materiálem a cenou | JS renders cards from `PRODUCTS` array in `js/products.js`; card HTML template via `innerHTML`; `fotky/` path used directly |
| DISP-04 | Návštěvník vidí sekci hodnot (český len, strojová výšivka, krásné balení) | Static HTML — 3 feature blocks; CSS Grid three-column, collapses to one on mobile |
| DISP-05 | Návštěvník vidí banner akce 3+1 | Static HTML banner with highlighted styling; no JS logic needed in Phase 1 |
| NAV-01 | Fixní horní navigace s logem vlevo a odkazy vpravo | CSS `position: sticky; top: 0` nav; flexbox layout logo-left links-right |
| NAV-02 | Na mobilu navigace přejde do hamburger menu nebo zmenšených odkazů | JS class toggle on hamburger click; CSS hides links by default on mobile, shows when `.open` class active |
| NAV-03 | Web je plně responzivní, mobilní zobrazení je priorita | Mobile-first CSS: base styles for mobile, `@media (min-width: 768px)` for desktop |
| NAV-04 | Fade-in animace při načtení hero sekce | CSS `@keyframes fadeIn` + `animation: fadeIn 1s ease-in`; no JS required |
| LEGAL-01 | Stránka obsahuje informaci o 14denním právu na vrácení zboží | Static text in `<footer>` — "Máte právo vrátit zboží do 14 dnů bez udání důvodu." |
| LEGAL-02 | Stránka obsahuje stručné oznámení o zpracování osobních údajů (GDPR) | Static paragraph in footer/contact — "Vaše osobní údaje..." short notice |
</phase_requirements>

---

## Summary

Phase 1 is a greenfield static HTML/CSS/JS build with no dependencies, no build step, and no external services beyond Google Fonts CDN. The domain is extremely well-understood. The only technical decisions left to Claude's discretion are CSS values, breakpoints, hover effects, and hamburger implementation — all of which have clear best practices for mobile-first linen/artisan brand aesthetics.

The project files confirm photos are raw JPEGs in `fotky/` ranging from 3.0 MB to 5.5 MB. CONTEXT.md explicitly locks that Phase 1 uses originals with `loading="lazy"` — image optimization is Phase 4. This is the right call: it keeps Phase 1 scope clean and avoids blocking on tooling. The `fotky/` folder path must be used directly in `src` attributes (not `images/`) since that is where the files actually live.

Architecture research confirms Phase 1 produces only: `index.html`, `css/style.css`, `js/products.js`, `js/main.js`, and `.nojekyll`. No `cart.js` or `order.js` in Phase 1 — those are Phase 2 and 3 respectively. The product cards ARE rendered by JS from a `PRODUCTS` array in Phase 1 (to establish the data pattern future phases build on), but the "Přidat do košíku" button is a placeholder with no handler yet.

**Primary recommendation:** Build HTML structure first (all sections, correct Czech text, alt attributes), then CSS (design system tokens first, then mobile-first layout), then the two JS files (products.js data + main.js wiring for nav and hero fade). Write `.nojekyll` last as a deliberate checklist item.

---

## Standard Stack

### Core

| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| HTML5 | Living Standard | Page structure, semantic sections | No alternatives — locked by project constraint |
| CSS3 | Living Standard | All styling, animations, responsive layout | No alternatives — locked by project constraint |
| Vanilla JS (ES2022+) | Browser-native | Navigation toggle, scroll effects, product card rendering | No alternatives — locked by project constraint |
| Google Fonts CDN | Current | Cormorant Garamond + Josefin Sans delivery | Locked; preconnect pattern prevents render blocking |

### Supporting

| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| CSS Custom Properties | CSS3+ | Design system tokens (colors, spacing, fonts) | Define all design tokens at `:root` level — planner should NOT hardcode hex values in component styles |
| CSS Grid | CSS3+ | Product card grid, values section layout | Multi-column layouts; more readable than Flexbox for two-dimensional grids |
| CSS Flexbox | CSS3+ | Nav bar, hero text alignment, card internals | One-dimensional alignment — nav, single-row elements |
| CSS `position: sticky` | CSS3+ | Sticky navigation | Replaces JS scroll-position listeners for nav sticking; supported universally |
| `loading="lazy"` attribute | HTML5 | Deferred image loading | All `<img>` tags except hero image above the fold |

### Alternatives Considered

| Standard Approach | Alternative | Why Not Used |
|-------------------|-------------|--------------|
| Native CSS Grid | CSS Frameworks (Bootstrap, Tailwind) | Locked out by no-build-step constraint; also overkill for 7-section single page |
| CSS @keyframes for animation | JS animation library (GSAP, Anime.js) | Locked out explicitly in decisions; one fade-in does not justify a library |
| JS class toggle for hamburger | Pure CSS checkbox hack | Both are valid; JS toggle chosen as primary (cleaner aria-expanded handling) with CSS-only as fallback option |
| `fotky/` as-is | Pre-converted WebP in `images/` | Explicitly locked — Phase 1 uses originals; Phase 4 converts |

**Installation:** No installation. No npm. No package.json. Everything is native browser or Google Fonts CDN link in `<head>`.

---

## Architecture Patterns

### Recommended File Structure

```
web_misiksvet/                 # repo root = GitHub Pages root
├── index.html                 # Single page, all sections
├── css/
│   └── style.css              # All styles (design tokens → base → components → sections → responsive)
├── js/
│   ├── products.js            # PRODUCTS array — single source of truth for product data
│   └── main.js                # DOMContentLoaded entry: render cards, nav scroll, hamburger
├── fotky/                     # Raw photos (already here, used as-is in Phase 1)
│   ├── 20251208_185910.jpg    # Kopretina
│   ├── 20251208_190226.jpg    # Vlčí mák
│   ├── 20251208_190438.jpg    # Šiška
│   ├── 20251115_111917.jpg    # Zástěra
│   └── 20251208_190557.jpg    # Hero/group
└── .nojekyll                  # REQUIRED — disables Jekyll on GitHub Pages
```

Note: `js/cart.js` and `js/order.js` are NOT created in Phase 1. They appear in Phase 2 and 3 respectively.

### Pattern 1: CSS Design System Tokens at :root

**What:** Declare all colors, fonts, and spacing values as CSS custom properties at the top of `style.css`.
**When to use:** Always — every color/font reference in component styles uses `var(--token)`, never raw hex or pixel values.

```css
/* Source: CSS Custom Properties specification / locked CONTEXT.md palette */
:root {
  /* Colors */
  --color-bg:       #faf8f4;    /* krémová — page background */
  --color-surface:  #f5f0e8;    /* béžová — card/section backgrounds */
  --color-brown:    #8b6914;    /* teplá hnědá — headings, buttons, accents */
  --color-green:    #5a7a4a;    /* tlumená zelená — secondary accent */
  --color-text:     #3a3228;    /* warm dark — body text */
  --color-text-muted: #7a6e62; /* secondary text */

  /* Typography */
  --font-heading:   'Cormorant Garamond', Georgia, serif;
  --font-body:      'Josefin Sans', system-ui, sans-serif;

  /* Spacing scale */
  --space-xs:  0.5rem;
  --space-sm:  1rem;
  --space-md:  2rem;
  --space-lg:  4rem;
  --space-xl:  8rem;

  /* Layout */
  --max-width: 1200px;
  --nav-height: 64px;
}
```

### Pattern 2: Mobile-First Responsive Layout

**What:** Base CSS targets mobile (375px+), `@media (min-width: N)` expands for larger screens.
**When to use:** All layout rules. Instagram audience is mobile-first.

```css
/* Mobile base — product grid single column */
.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

/* Tablet+ — 2 columns */
@media (min-width: 600px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop — 4 columns */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

Recommended breakpoints (Claude's discretion — choosing standard values):
- `600px` — small tablet / large phone landscape
- `768px` — tablet portrait
- `1024px` — desktop

### Pattern 3: Product Cards Rendered from JS Data Array

**What:** `products.js` defines `const PRODUCTS = [...]`; `main.js` calls `renderProductCards()` on `DOMContentLoaded`.
**When to use:** Always — never hardcode product HTML in `index.html`. This pattern enables Phase 2 to add "Add to Cart" buttons without touching HTML.

```javascript
// js/products.js — no DOM access, pure data
const PRODUCTS = [
  {
    id: 'kopretina',
    name: 'Utěrka Kopretina',
    price: 380,
    image: 'fotky/20251208_185910.jpg',
    description: 'Luční kopretiny na přírodním lnu. Jemný motiv ve třech barvách.',
    material: '100% český len'
  },
  {
    id: 'vlci-mak',
    name: 'Utěrka Vlčí mák',
    price: 380,
    image: 'fotky/20251208_190226.jpg',
    description: 'Rudý květ vlčího máku s listy. Výrazný a elegantní.',
    material: '100% český len'
  },
  {
    id: 'siska',
    name: 'Utěrka Šiška s větvičkou',
    price: 380,
    image: 'fotky/20251208_190438.jpg',
    description: 'Detailní šiška s jehličím. Ideální dárek pro milovníky přírody.',
    material: '100% český len'
  },
  {
    id: 'zastera',
    name: 'Zástěra',
    price: 890,
    image: 'fotky/20251115_111917.jpg',
    description: 'Lněná zástěra s kopretinou a humorem. „Nemám šajnu co z toho bude."',
    material: '100% český len'
  }
];
```

```javascript
// js/main.js — card rendering (Phase 1 version — no Add to Cart handler)
function renderProductCards() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card">
      <img src="${p.image}" alt="${p.name} — ${p.material}" loading="lazy" width="400" height="400">
      <div class="product-card__body">
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__desc">${p.description}</p>
        <p class="product-card__material">${p.material}</p>
        <p class="product-card__price">${p.price} Kč</p>
        <!-- Phase 2 will add: <button class="btn-add" data-id="${p.id}">Přidat do košíku</button> -->
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderProductCards();
  initNav();
});
```

### Pattern 4: Sticky Nav with JS Scroll Class

**What:** `position: sticky` handles sticking. JS adds `.scrolled` class when `window.scrollY > 0` to apply shadow/background change.
**When to use:** This pattern avoids the `position: fixed` padding-top hack; sticky nav participates in normal flow until it sticks.

```javascript
// js/main.js
function initNav() {
  const nav = document.querySelector('nav');

  // Hamburger toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded',
      navLinks.classList.contains('open') ? 'true' : 'false'
    );
  });

  // Scroll shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}
```

```css
nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

nav.scrolled {
  background: var(--color-bg);
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
```

### Pattern 5: Hero Fade-in via CSS @keyframes

**What:** CSS animation on the hero content container. No JS.
**When to use:** The one animation locked in decisions.

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero__content {
  animation: fadeIn 1s ease-out both;
}
```

### Pattern 6: Google Fonts Preconnect

**What:** Two `<link rel="preconnect">` tags before the font stylesheet link.
**When to use:** Always when using Google Fonts — prevents render-blocking DNS lookup.

```html
<!-- In <head>, before font stylesheet -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Josefin+Sans:wght@300;400&display=swap" rel="stylesheet">
```

### Anti-Patterns to Avoid

- **Hardcoding colors inline:** Never use `color: #8b6914` in component styles. Use `var(--color-brown)`. Enables global theming for Phase 4.
- **Absolute asset paths:** Never `/fotky/image.jpg`. Use `fotky/image.jpg` (relative). GitHub Pages deploys to a subdirectory URL; absolute paths break.
- **`position: fixed` for nav with no body padding-top:** Creates content hidden under the nav. Use `position: sticky` instead.
- **Reading scrollY in every frame without passive listener:** Causes jank. Always `{ passive: true }` on scroll listeners.
- **Hardcoding product HTML in index.html:** Makes Phase 2 (adding cart buttons) require editing HTML instead of just JS.
- **`<script>` in `<head>` without `defer`:** Blocks HTML parsing. All scripts should be at end of `<body>` or use `defer` attribute.
- **Missing `lang="cs"`:** Screen readers default to wrong language. Must be on `<html>` tag.
- **Missing `charset="UTF-8"` as first `<head>` element:** Czech diacritics display as garbled characters if charset is declared late or missing.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading | Manual @font-face with self-hosted files | Google Fonts CDN with preconnect | Already locked; CDN has global edge caching, WOFF2 delivery, `display=swap` built in |
| Sticky nav positioning | JS scroll position detection + `position: fixed` + body padding | CSS `position: sticky` | Native CSS; no JS needed for the stick behavior itself; JS only adds the shadow class |
| Image lazy loading | Intersection Observer API custom code | `loading="lazy"` attribute | Native browser attribute; universally supported since 2020; zero JS |
| CSS animations | JS-driven style mutations | CSS `@keyframes` | Locked explicitly; GPU-composited, no JS execution on animation tick |
| Responsive grid | Custom JS layout engine | CSS Grid with `@media` queries | Native CSS; no JS for layout |

**Key insight:** For a Phase 1 static display page, almost everything that needs "building" is actually just correct HTML attribute usage and CSS. The only JS in Phase 1 is nav toggle and scroll class — roughly 30 lines.

---

## Common Pitfalls

### Pitfall 1: Missing charset or wrong charset position

**What goes wrong:** Czech diacritics (á, č, ě, í, ř, š, ž, ů) display as `?` or garbled box characters in the browser.
**Why it happens:** Browser begins parsing before charset is declared; defaults to ASCII or Latin-1.
**How to avoid:** `<meta charset="UTF-8">` must be the VERY FIRST element inside `<head>`, before title, before favicon, before anything else.
**Warning signs:** If you see `Ã¡` instead of `á` — charset is declared too late or missing.

### Pitfall 2: Absolute asset paths breaking on GitHub Pages subdirectory

**What goes wrong:** Images and CSS load fine on localhost but 404 on GitHub Pages at `username.github.io/web_misiksvet/`.
**Why it happens:** `/fotky/image.jpg` resolves from the domain root (`username.github.io/fotky/`), not the repo subdirectory.
**How to avoid:** Use relative paths everywhere. `fotky/image.jpg` not `/fotky/image.jpg`. `css/style.css` not `/css/style.css`.
**Warning signs:** Works on `127.0.0.1` (opens from filesystem) but breaks when deployed. Check browser DevTools Network tab for 404s on assets.

### Pitfall 3: Missing .nojekyll file

**What goes wrong:** Files or folders starting with `_` (if any are ever added) become invisible to GitHub Pages. Jekyll preprocessing can corrupt or ignore certain files silently.
**Why it happens:** GitHub Pages runs Jekyll by default on all repositories.
**How to avoid:** Create an empty `.nojekyll` file in the repository root before first push. It is a zero-byte file — just its presence disables Jekyll.
**Warning signs:** Assets that work locally fail to serve from GitHub Pages URL.

### Pitfall 4: Hero image loading eagerly + no width/height attributes

**What goes wrong:** Large LCP (Largest Contentful Paint) because hero image takes 10+ seconds on mobile. Cumulative Layout Shift (CLS) because browser doesn't reserve space before image loads.
**Why it happens:** Hero image is 4.6 MB raw JPEG. Even with `loading="lazy"`, the hero image should NOT be lazy — it is above the fold.
**How to avoid:** Hero image (`fotky/20251208_190557.jpg`) must NOT have `loading="lazy"`. All other product images DO use `loading="lazy"`. Add `width` and `height` attributes to all `<img>` tags to prevent layout shift.
**Warning signs:** Page jumps as images load. Chrome DevTools Lighthouse shows high CLS score.

### Pitfall 5: Hamburger menu breaking on iOS Safari

**What goes wrong:** Menu toggles work on Android but clicks don't register on iOS Safari for non-interactive elements.
**Why it happens:** iOS Safari does not fire click events on non-anchor, non-button elements by default.
**How to avoid:** Make the hamburger a `<button>` element (not a `<div>` or `<span>`). Buttons are natively clickable on all platforms and get keyboard focus for free.
**Warning signs:** Works in Chrome DevTools mobile simulation but fails on an actual iPhone.

### Pitfall 6: Missing &nbsp; before single-letter prepositions in Czech

**What goes wrong:** Single-letter Czech prepositions (v, z, k, s, a, i, o, u) appear orphaned at end of line — typographically incorrect and visually jarring.
**Why it happens:** HTML wraps normally; Czech typography rules require non-breaking space after single-letter words.
**How to avoid:** Replace spaces after single-letter words with `&nbsp;` throughout all Czech text content. Example: `v&nbsp;Čechách`, `z&nbsp;lásky`.
**Warning signs:** Proofread on narrow mobile screen — look for single letter hanging at line end.

### Pitfall 7: nav links without smooth scroll

**What goes wrong:** Clicking "Příběh", "Výrobky", "Kontakt" in nav jumps abruptly to section — poor UX.
**Why it happens:** Default anchor link behavior is instant jump.
**How to avoid:** Add `scroll-behavior: smooth` to the `html` element in CSS. This one line handles all anchor scrolling without JS.
**Warning signs:** Users experience jarring jump when clicking nav links.

---

## Code Examples

### Complete `<head>` Template

```html
<!-- Source: HTML spec + locked CONTEXT.md decisions -->
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">  <!-- MUST be first -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mišik svět — Ručně vyšívané lněné výrobky</title>
  <meta name="description" content="Ručně vyšívané lněné utěrky a zástěry. Vyrobeno s láskou v&nbsp;Čechách.">
  <!-- Google Fonts preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Josefin+Sans:wght@300;400&display=swap" rel="stylesheet">
  <!-- Stylesheet -->
  <link rel="stylesheet" href="css/style.css">
</head>
```

### Section ID Map (for nav anchor links)

```html
<!-- Matches locked page structure -->
<nav> ... </nav>
<section id="hero"> ... </section>
<section id="pribeh"> ... </section>
<section id="produkty"> ... </section>
<section id="hodnoty"> ... </section>
<section id="akce"> ... </section>
<section id="kontakt"> ... </section>
<footer> ... </footer>
```

Nav links: `<a href="#pribeh">Příběh</a>`, `<a href="#produkty">Výrobky</a>`, `<a href="#kontakt">Kontakt</a>`

### Footer Legal Text

```html
<!-- LEGAL-01 and LEGAL-02 — placed in footer -->
<footer>
  <p>© 2025 Mišik svět · Vyrobeno s&nbsp;láskou v&nbsp;Čechách</p>
  <p class="legal">
    Máte právo vrátit zakoupené zboží bez udání důvodu do 14&nbsp;dnů od převzetí.
    Kontaktujte nás na Instagramu <a href="https://www.instagram.com/misiksvet/" target="_blank" rel="noopener">@misiksvet</a>.
  </p>
  <p class="legal">
    Pro vyřízení objednávky zpracováváme Vaše jméno, e-mail a doručovací adresu.
    Údaje jsou použity výhradně k&nbsp;doručení zboží a nejsou předávány třetím stranám.
  </p>
</footer>
```

### Script Load Order in index.html

```html
<!-- Before </body> — ORDER MATTERS for Phase 2+ compatibility -->
<script src="js/products.js"></script>
<!-- Phase 2 will add: <script src="js/cart.js"></script> -->
<!-- Phase 3 will add: EmailJS CDN + <script src="js/order.js"></script> -->
<script src="js/main.js"></script>
```

### CSS Style.css Section Order

```css
/* 1. Design tokens (:root) */
/* 2. CSS reset / base */
/* 3. Typography */
/* 4. Navigation */
/* 5. Hero section */
/* 6. Příběh (story) section */
/* 7. Products section + cards */
/* 8. Hodnoty (values) section */
/* 9. Akce 3+1 banner */
/* 10. Kontakt section */
/* 11. Footer */
/* 12. Responsive overrides (@media queries) */
```

---

## State of the Art

| Old Approach | Current Approach | Impact for This Project |
|--------------|------------------|------------------------|
| `position: fixed` nav + `padding-top: body` | `position: sticky; top: 0` on `<nav>` | No JS needed for stick behavior; no body offset calculation |
| JS-based lazy loading (IntersectionObserver) | `loading="lazy"` HTML attribute | Zero JS for image deferral — just add the attribute |
| `@font-face` with self-hosted WOFF2 | Google Fonts CDN with `display=swap` | Simpler; CDN handles compression/caching; `display=swap` prevents FOIT |
| Hamburger menu checkbox hack | `<button>` + JS `classList.toggle` + `aria-expanded` | More accessible; works on iOS Safari; keyboard navigable |
| `scroll-behavior` via JS | `scroll-behavior: smooth` on `html` in CSS | One CSS line handles all anchor scroll animation |

**Deprecated/outdated:**
- CSS `float` for layout: replaced by Flexbox and Grid; do not use for any layout in this project
- `<font>` tags, inline `style=""` for colors: HTML4 patterns; never use
- `document.write()`: blocking, deprecated; never use
- `var` for JS variables: use `const`/`let` exclusively

---

## Open Questions

1. **Photo aspect ratios and composition**
   - What we know: Files exist in `fotky/`, sizes 3–5 MB, shot on smartphone (landscape orientation likely for some)
   - What's unclear: Exact pixel dimensions and whether all photos are portrait/landscape consistently
   - Recommendation: Planner should include a task step to check dimensions before writing CSS `aspect-ratio` or `object-fit` values for product cards. `object-fit: cover` on a fixed-ratio card container is the safe default regardless.

2. **Hero image as CSS background vs. `<img>`**
   - What we know: Hero is a full-width section with text overlay
   - What's unclear: Whether hero photo should be CSS `background-image` (easier overlay) or `<img>` with CSS overlay (better for LCP/alt text)
   - Recommendation: Use `<img>` with `position: absolute` overlay text for better LCP score and alt text accessibility. Claude's discretion covers this.

3. **Nav text on mobile — links vs. hamburger**
   - What we know: CONTEXT.md locks hamburger as the mobile nav pattern; implementation detail is discretion
   - What's unclear: Nothing blocking — hamburger `<button>` + JS toggle is well-defined
   - Recommendation: `<button class="hamburger" aria-label="Otevřít menu" aria-expanded="false">` with 3-line SVG or CSS bars; `.nav-links` hidden by default on mobile, shown when `.open`

---

## Sources

### Primary (HIGH confidence)
- CSS Custom Properties specification (MDN) — `:root` token pattern, `var()` usage
- HTML Living Standard — `loading="lazy"`, `lang`, `charset`, `<meta viewport>`
- CSS specification — `position: sticky`, `scroll-behavior: smooth`, `@keyframes`, CSS Grid, Flexbox
- CONTEXT.md locked decisions — colors (#f5f0e8, #faf8f4, #8b6914, #5a7a4a), font names, page structure, product data, exact Czech text
- Project file listing (`ls fotky/`) — confirmed 8 photos present, filenames and sizes verified
- ARCHITECTURE.md (project research) — file structure, script load order, product data pattern, JS module separation

### Secondary (MEDIUM confidence)
- Google Fonts documentation — preconnect pattern, `display=swap` parameter in URL
- GitHub Pages documentation — `.nojekyll` behavior, relative path requirement for subdirectory deployments
- Apple Human Interface Guidelines / Material Design — 44px minimum touch target (used for nav hamburger sizing)

### Tertiary (LOW confidence — flag for validation)
- Czech typography rules for non-breaking spaces — established convention, but review final text with Míša before launch
- Legal text for LEGAL-01/LEGAL-02 — directionally correct per Czech consumer law §1829 OZ and GDPR Art.13; should be reviewed by Míša before publish

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — Vanilla HTML/CSS/JS with Google Fonts is a fully settled domain; no version churn possible (no packages)
- Architecture: HIGH — File structure and JS patterns verified against project ARCHITECTURE.md research; all patterns are standard browser behavior
- Pitfalls: HIGH for technical pitfalls (charset, paths, nojekyll, iOS button); MEDIUM for legal text wording

**Research date:** 2026-03-04
**Valid until:** 2026-06-04 (stable domain — HTML/CSS/JS patterns do not change on 90-day cycles)
