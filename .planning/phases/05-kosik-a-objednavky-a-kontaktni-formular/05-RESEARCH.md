# Phase 5: Košík a objednávky a kontaktní formulář — Research

**Researched:** 2026-03-04
**Domain:** Vanilla JS cart state, localStorage, EmailJS CDN, Packeta widget, HTML5 form validation
**Confidence:** HIGH (cart/localStorage/EmailJS), MEDIUM (Packeta widget — API key acquisition requires action)

---

## Summary

Phase 5 is the interactive heart of the Mišik svět web. It covers everything that remains after the visual Phase 1: a shopping cart with the 3+1 promo logic, an order form with delivery selection (Zásilkovna pickup point map, Zásilkovna home delivery, personal pickup), and email notifications via EmailJS. The contact section is also replaced with the actual order form.

The entire stack remains vanilla HTML/CSS/JS with no build step, no npm, and no server. This is a strict constraint from Phase 1 — it must be preserved. The three major technical domains are: (1) cart state management with localStorage, (2) Packeta/Zásilkovna widget v6 integration, and (3) EmailJS CDN integration. All three have well-documented integration patterns for static sites.

The key blocker to identify upfront is the Packeta API key: Míša must register a Zásilkovna/Packeta account (or contact info@zasilkovna.cz for a test account) to obtain a real API key before the widget can be tested with live pickup points. During development, a placeholder/demo API key can be used to verify the widget loads. The EmailJS account also needs setup in the dashboard before JavaScript can call it.

**Primary recommendation:** Build in three JS files: `js/cart.js` (state + promo logic + nav badge), `js/order.js` (form, Packeta widget, EmailJS). Add both after `js/products.js` in `index.html` before `</body>`. Update `js/main.js` to call their init functions on `DOMContentLoaded`.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CART-01 | Zákazník může přidat produkt do košíku tlačítkem na produktové kartě | `renderProductCards()` in `main.js` must add `<button class="btn btn--primary btn-add" data-id="${p.id}">Přidat do košíku</button>`; `cart.js` attaches delegated click listener on `#product-grid` |
| CART-02 | Zákazník může v košíku upravit množství každého produktu (+ / -) | Cart drawer renders `<button class="qty-dec">−</button><span>${qty}</span><button class="qty-inc">+</button>` per item; handlers call `updateQty(id, delta)` which re-saves to localStorage and re-renders |
| CART-03 | Zákazník může produkt z košíku odebrat | Trash/remove button per cart item calls `removeItem(id)` which filters cart array, saves, re-renders |
| CART-04 | Košík zobrazuje průběžný součet a počet kusů | `renderCart()` computes totals from cart array each render; no stale state |
| CART-05 | Košík automaticky počítá akci 3+1 pro utěrky (při 3+ kusech je nejlevnější zdarma) | `products.js` must add `type: 'uterka'` (vs `'zastera'`) to each product; promo logic uses `Math.floor(uterkaCount / 4)` free cheapest items |
| CART-06 | Stav košíku se zachová při obnovení stránky (localStorage) | `loadCart()` = `JSON.parse(localStorage.getItem('misiksvet-cart') || '[]')`; save on every mutation |
| CART-07 | Košík je viditelný/přístupný z navigace (ikona s počtem kusů) | Nav `<a>` or `<button>` with SVG cart icon + `<span class="cart-count">0</span>`; `updateNavBadge()` updates count on every mutation |
| ORDER-01 | Zákazník vyplní jméno a příjmení | `<input type="text" name="full_name" required>` in order form |
| ORDER-02 | Zákazník vyplní e-mailovou adresu | `<input type="email" name="email" required>` |
| ORDER-03 | Zákazník vyplní telefonní číslo | `<input type="tel" name="phone" required>` with `pattern="[0-9+ ]{9,15}"` |
| ORDER-04 | Zákazník vybere způsob doručení | `<select name="delivery">` with 3 options; JS shows/hides conditional fields |
| ORDER-05 | Při výběru "Zásilkovna výdejní místo" se zobrazí Packeta widget | `Packeta.Widget.pick(apiKey, callback, options)` called on button click; script: `https://widget.packeta.com/v6/www/js/library.js` |
| ORDER-06 | Při výběru "Zásilkovna domů" se zobrazí pole pro doručovací adresu | Hidden `<div id="home-delivery-fields">` becomes visible when delivery option changes |
| ORDER-07 | Zákazník může přidat nepovinnou poznámku | `<textarea name="note">` not required |
| ORDER-08 | Zákazník musí odkliknout souhlas se zpracováním osobních údajů (GDPR) | `<input type="checkbox" name="gdpr" required>` — uses HTML5 native required validation |
| ORDER-09 | Formulář validuje povinná pole před odesláním | `novalidate` on `<form>` + manual `checkValidity()` + `setCustomValidity()` with Czech messages |
| ORDER-10 | Po odeslání se tlačítko deaktivuje | `submitBtn.disabled = true` before `emailjs.send()`; re-enabled only on error |
| EMAIL-01 | Zákazník obdrží automatický potvrzovací e-mail | EmailJS template "customer_confirmation" — to: `{{email}}`, subject: "Vaše objednávka Mišik svět" |
| EMAIL-02 | Míša obdrží e-mail s kompletními detaily objednávky | EmailJS template "owner_notification" — to: Míša's email (hardcoded in template), body: all order fields |
| EMAIL-03 | E-maily jsou odesílány přes EmailJS (CDN, bez backendu) | `emailjs.send()` called twice (customer + owner) in `order.js`; CDN: `@emailjs/browser@4` |
</phase_requirements>

---

## Standard Stack

### Core

| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| Vanilla JS (ES2022+) | Browser-native | Cart logic, form handling, EmailJS calls | Locked — no frameworks allowed |
| localStorage API | Browser-native | Cart persistence across page reloads | Only client-side storage that survives reload without server |
| EmailJS | CDN `@emailjs/browser@4` | Send emails from browser without backend | Locked decision; free tier 200/month; works on static hosting |
| Packeta Widget v6 | CDN `widget.packeta.com/v6/www/js/library.js` | Pickup point map selector | Official Zásilkovna embed; works in any JS environment |
| HTML5 Constraint Validation API | Browser-native | Form validation with Czech error messages | Native; no extra library; `setCustomValidity()` enables Czech strings |

### Supporting

| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| CSS Custom Properties | Existing design system | Cart drawer, form styling | Re-use existing `--color-*`, `--space-*` tokens from Phase 1 |
| CSS `position: fixed` | Browser-native | Cart drawer overlay on mobile | Drawer must overlay page content; sticky/relative won't work here |

### Alternatives Considered

| Standard Approach | Alternative | Why Not Used |
|-------------------|-------------|--------------|
| Vanilla JS + localStorage | Vuex, Redux, Zustand | Build step forbidden; overkill for 4-item store |
| EmailJS CDN | Resend, Nodemailer, Sendgrid | Need server for all alternatives; EmailJS locked decision |
| Packeta widget v6 CDN | Packeta API direct calls | Widget is the official embed for pickup selection; API requires backend |
| HTML5 Constraint API | Joi, Yup, Zod | All require build steps or Node.js; native is sufficient |

**Installation:**
```html
<!-- In index.html before </body> — ORDER MATTERS -->
<script src="js/products.js"></script>
<script src="js/cart.js"></script>
<script src="js/order.js"></script>
<script src="js/main.js"></script>

<!-- Packeta widget — load before order.js OR at top of order.js dynamically -->
<script src="https://widget.packeta.com/v6/www/js/library.js"></script>

<!-- EmailJS CDN — in <head> BEFORE other scripts that call emailjs.* -->
<script type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js">
</script>
<script type="text/javascript">
  (function(){ emailjs.init({ publicKey: "YOUR_PUBLIC_KEY" }); })();
</script>
```

---

## Architecture Patterns

### Recommended Project Structure After Phase 5

```
web_misiksvet/
├── index.html           # Updated: cart icon in nav, cart drawer, order form section
├── css/
│   └── style.css        # Updated: cart drawer, cart items, order form, form errors
├── js/
│   ├── products.js      # Updated: add `type` field ('uterka' | 'zastera') per product
│   ├── cart.js          # NEW: cart state, promo logic, localStorage, nav badge, drawer
│   ├── order.js         # NEW: form validation, Packeta widget, EmailJS send
│   └── main.js          # Updated: call initCart(), initOrderForm() on DOMContentLoaded
├── fotky/               # Unchanged
└── .nojekyll            # Unchanged
```

### Pattern 1: Cart State Module (cart.js)

**What:** Single module owns the cart array, all mutations, localStorage sync, and UI rendering. No cart state lives in the DOM.
**When to use:** Always — never read cart state from the DOM (e.g., reading `innerText` of a counter to infer quantity).

```javascript
// js/cart.js
// Source: localStorage API + standard cart SPA pattern

const CART_KEY = 'misiksvet-cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

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

function updateNavBadge(cart) {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.querySelector('.cart-count');
  if (badge) {
    badge.textContent = total;
    badge.hidden = total === 0;
  }
}

function initCart() {
  const cart = loadCart();
  renderCart(cart);
  updateNavBadge(cart);

  // Delegated listener for "Přidat do košíku" buttons on product cards
  document.getElementById('product-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add');
    if (btn) addToCart(btn.dataset.id);
  });
}
```

### Pattern 2: Promo 3+1 Logic

**What:** When the cart contains 3+ utěrky (type: 'uterka'), every 4th piece is free. The cheapest-per-price utěrky get the discount. Zástěra never participates.
**When to use:** In `renderCart()` totals calculation — never in `addToCart()` (promo is display-only, not stored).

```javascript
// Source: Requirements CART-05 + project decision Math.floor(totalQty / 4)
function calcPromo(cart) {
  // Get all uterka items expanded to individual units sorted by price asc
  const uterkyItems = cart
    .filter(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return product && product.type === 'uterka';
    })
    .flatMap(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return Array(item.qty).fill(product.price);
    })
    .sort((a, b) => a - b); // cheapest first

  const freeCount = Math.floor(uterkyItems.length / 4);
  const discount = uterkyItems.slice(0, freeCount).reduce((sum, price) => sum + price, 0);
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
```

**Critical note:** All 4 products currently have `price: 380` — with homogeneous prices the "cheapest first" sort is a no-op. However the logic must still be implemented correctly for when products have different prices in the future. The zástěra (890 Kč) is excluded by `type === 'uterka'` check.

**Update required in products.js:** Add `type` field:
```javascript
// kopretina, vlci-mak, siska:
type: 'uterka'
// zastera:
type: 'zastera'
```

### Pattern 3: Cart Drawer

**What:** A `<div id="cart-drawer">` injected into HTML (or created by JS) that slides in from the right. Uses `position: fixed` to overlay content.
**When to use:** Standard pattern for single-page cart without navigation away.

```html
<!-- Added to index.html, after <nav> -->
<div id="cart-drawer" class="cart-drawer" aria-hidden="true">
  <div class="cart-drawer__header">
    <h2>Košík</h2>
    <button class="cart-drawer__close" aria-label="Zavřít košík">✕</button>
  </div>
  <div id="cart-items" class="cart-drawer__items"></div>
  <div class="cart-drawer__footer">
    <p class="cart-total"></p>
    <p class="cart-discount" hidden></p>
    <a href="#objednavka" class="btn btn--primary cart-checkout-btn">Přejít k objednávce</a>
  </div>
</div>
<div id="cart-overlay" class="cart-overlay"></div>
```

```css
/* New CSS additions to style.css */
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: min(400px, 100vw);
  height: 100vh;
  background: var(--color-bg);
  box-shadow: -4px 0 24px rgba(0,0,0,0.15);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 200;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.cart-drawer.open {
  transform: translateX(0);
}

.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 199;
  display: none;
}

.cart-overlay.visible {
  display: block;
}
```

### Pattern 4: Packeta Widget Integration

**What:** Official Zásilkovna/Packeta embeddable pickup-point map. Opens as a modal overlay. Returns selected point via callback.
**When to use:** When user selects "Zásilkovna výdejní místo" delivery option.

**Prerequisites:** Míša must obtain API key from `client.packeta.com` (requires Zásilkovna account registration). Test/development can use a placeholder string to verify widget script loads.

```html
<!-- index.html — load Packeta widget library before order.js -->
<script src="https://widget.packeta.com/v6/www/js/library.js"></script>
```

```javascript
// js/order.js — Packeta integration
// Source: https://old.docs.packeta.com/01-pickup-point-selection/02-widget-v6.html

const PACKETA_API_KEY = 'YOUR_PACKETA_API_KEY'; // from client.packeta.com

const packetaOptions = {
  language: 'cs',
  country: 'cz',
  view: 'modal',
  valueFormat: '"Packeta",id,name,city,street',
  vendors: [{ country: 'cz' }]
};

let selectedPickupPoint = null;

function openPacketaWidget() {
  Packeta.Widget.pick(PACKETA_API_KEY, function(point) {
    if (point) {
      selectedPickupPoint = point;
      document.getElementById('packeta-selected-name').textContent =
        `${point.name}, ${point.city}`;
    }
  }, packetaOptions);
}

// Called when delivery select changes
function handleDeliveryChange(value) {
  const packetaSection = document.getElementById('packeta-section');
  const homeSection = document.getElementById('home-delivery-section');

  packetaSection.hidden = value !== 'packeta-vydejna';
  homeSection.hidden = value !== 'packeta-domu';

  if (value !== 'packeta-vydejna') selectedPickupPoint = null;
}
```

### Pattern 5: EmailJS Two-Email Send

**What:** On form submit, send two emails via `emailjs.send()`: one to the customer (confirmation), one to Míša (notification).
**When to use:** ORDER-10 requires button disabled before first send; only re-enable on error.

```javascript
// js/order.js
// Source: https://www.emailjs.com/docs/tutorial/overview/

const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // from EmailJS dashboard
const EMAILJS_CUSTOMER_TEMPLATE = 'customer_confirmation';
const EMAILJS_OWNER_TEMPLATE    = 'owner_notification';

async function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Odesílám…';

  const cart = loadCart(); // from cart.js
  const { gross, discount, net } = calcTotal(cart);
  const cartSummary = formatCartSummary(cart, gross, discount, net);

  const params = {
    full_name:     document.querySelector('[name="full_name"]').value,
    email:         document.querySelector('[name="email"]').value,
    phone:         document.querySelector('[name="phone"]').value,
    delivery:      document.querySelector('[name="delivery"]').value,
    pickup_point:  selectedPickupPoint ? `${selectedPickupPoint.name}, ${selectedPickupPoint.city}` : '—',
    home_address:  document.querySelector('[name="home_address"]')?.value || '—',
    note:          document.querySelector('[name="note"]').value,
    cart_summary:  cartSummary,
    total:         `${net} Kč`
  };

  try {
    // 1. Notify Míša
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_OWNER_TEMPLATE, params);
    // 2. Confirm to customer
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE, params);

    showSuccessMessage();
    clearCart(); // wipe localStorage
  } catch (err) {
    console.error('EmailJS error:', err);
    showErrorMessage();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Odeslat objednávku';
  }
}
```

### Pattern 6: Form Validation with Czech Error Messages

**What:** Use `novalidate` on `<form>` to suppress browser-default validation bubbles. Check `validity` manually on submit. Set `setCustomValidity()` for Czech messages.
**When to use:** ORDER-09 — all validation must show Czech-language errors.

```javascript
// js/order.js — Czech validation
function validateForm() {
  const fields = [
    { el: document.querySelector('[name="full_name"]'),  msg: 'Vyplňte prosím jméno a příjmení.' },
    { el: document.querySelector('[name="email"]'),      msg: 'Zadejte platnou e-mailovou adresu.' },
    { el: document.querySelector('[name="phone"]'),      msg: 'Zadejte telefonní číslo (např. +420 123 456 789).' },
    { el: document.querySelector('[name="delivery"]'),   msg: 'Vyberte způsob doručení.' },
    { el: document.querySelector('[name="gdpr"]'),       msg: 'Pro odeslání objednávky je nutný souhlas se zpracováním údajů.' },
  ];

  let valid = true;
  fields.forEach(({ el, msg }) => {
    if (!el) return;
    el.setCustomValidity('');
    if (!el.checkValidity()) {
      el.setCustomValidity(msg);
      el.reportValidity();
      valid = false;
    }
  });

  // Packeta pickup: if delivery=packeta-vydejna but no point selected
  if (document.querySelector('[name="delivery"]').value === 'packeta-vydejna' && !selectedPickupPoint) {
    showFieldError('packeta-error', 'Vyberte prosím výdejní místo Zásilkovny.');
    valid = false;
  }

  // Must have items in cart
  if (loadCart().length === 0) {
    showFieldError('cart-error', 'Košík je prázdný. Přidejte prosím produkty před odesláním.');
    valid = false;
  }

  return valid;
}
```

### Anti-Patterns to Avoid

- **Storing cart state in the DOM:** Never read `innerText` of displayed quantities to reconstruct cart state. State lives in the `cart` array and localStorage only.
- **Calling `emailjs.send()` without disabling submit button first:** Users who click twice create duplicate orders. Disable immediately on first click.
- **Opening Packeta widget before `library.js` is loaded:** Widget script must be loaded synchronously before any call to `Packeta.Widget.pick()`.
- **Using `emailjs.sendForm()` for the order form:** The order form data includes the cart summary (computed from JS, not a form field) — use `emailjs.send()` with a hand-built params object instead.
- **Hardcoding EmailJS public key in a comment or version-controlled file without domain restriction:** Set Allowed Origins in EmailJS dashboard to `https://misiksvet.cz` before going live.
- **Re-enabling the submit button after success:** After a successful order, the cart should be cleared and the button should show "Odesláno" — not re-enable (prevents duplicate orders).
- **Storing discount in localStorage:** Promo 3+1 is calculated fresh on every render from the cart array. Never persist the calculated discount — it must reflect current cart state.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pickup point map | Custom Google Maps implementation with Zásilkovna API | Packeta Widget v6 CDN | Widget handles search, filtering, map, and point data — building it from scratch would be weeks of work |
| Email sending | Custom SMTP relay or serverless function | EmailJS CDN | Static hosting has no server; EmailJS is locked decision; handles delivery, retries, templates |
| Cart persistence | Cookies, IndexedDB, custom serialization | `localStorage` with JSON.stringify/parse | localStorage is universal, synchronous, zero-setup; IndexedDB is async overkill for a 4-item cart |
| Form validation translation | i18n library (i18next, FormatJS) | `setCustomValidity()` with hardcoded Czech strings | No library needed for single-language site; Constraint API is native |
| Cart quantity math | Complex state machine | Plain array with `find()` + `filter()` | 4 products, max hundreds of items — simple array operations are O(n) and n is tiny |

**Key insight:** The biggest trap in this domain is over-engineering. A 4-product Czech handcraft shop does not need Redux, a backend, or a complex state library. Every feature has a native browser solution that works perfectly at this scale.

---

## Common Pitfalls

### Pitfall 1: Packeta Widget API Key — Registration Required

**What goes wrong:** Widget does not open or shows error if API key is invalid or empty string.
**Why it happens:** Packeta requires a registered account to get a real API key. There is no public demo key.
**How to avoid:** Míša must register at `client.packeta.com` or email `info@zasilkovna.cz` for a test account. This is a blocker that must be resolved before the Packeta integration can be tested live. During development, the widget script can still be loaded to verify it parses; but `Packeta.Widget.pick()` requires a valid key to show points.
**Warning signs:** Widget opens but shows no points, or console shows auth error.

### Pitfall 2: EmailJS Free Tier Exhaustion

**What goes wrong:** Emails stop sending after 200 messages/month. Both customer confirmation AND owner notification count against the 200 limit — so effective order capacity is 100 orders/month.
**Why it happens:** Each `emailjs.send()` call consumes one credit.
**How to avoid:** Set up Allowed Origins in EmailJS dashboard to `https://misiksvet.cz` BEFORE going live. This prevents external abuse. Monitor usage in EmailJS dashboard.
**Warning signs:** Emails stop arriving after ~100 orders. EmailJS dashboard shows quota consumed.

### Pitfall 3: Cart Promo Logic — Zástěra Must Not Participate

**What goes wrong:** Discount gets applied to the zástěra (890 Kč) instead of only utěrky.
**Why it happens:** If `type` field is missing from `products.js`, all products get counted in the promo pool.
**How to avoid:** `products.js` MUST be updated to add `type: 'uterka'` to the 3 utěrky and `type: 'zastera'` to the zástěra. The promo function filters by `type === 'uterka'` before computing free units.
**Warning signs:** Cart shows discount on zástěra order. Test: add 3 zástěry — no discount should appear.

### Pitfall 4: localStorage Silently Fails in Private Browsing

**What goes wrong:** Cart items added by user silently disappear on page reload when browser is in private/incognito mode (some browsers throw on `localStorage.setItem`).
**Why it happens:** Some browsers (older iOS Safari) throw `SecurityError` or `QuotaExceededError` on `localStorage` access in private mode.
**How to avoid:** Wrap all `localStorage` access in try/catch. Gracefully fall back to in-memory cart (cart works for session, just doesn't persist on reload).
**Warning signs:** Cart empties on reload for some users. No JS error in console unless try/catch is missing.

### Pitfall 5: Packeta Widget Loaded After `Packeta.Widget.pick()` Called

**What goes wrong:** `Uncaught ReferenceError: Packeta is not defined` when user clicks "Vybrat výdejní místo".
**Why it happens:** `library.js` loaded after `order.js` in script order, or loaded with `defer`/`async` attribute.
**How to avoid:** Load `https://widget.packeta.com/v6/www/js/library.js` synchronously in `<body>` BEFORE the `order.js` script tag. Do NOT add `defer` or `async` to the Packeta script.

### Pitfall 6: EmailJS `sendForm()` Can't Include Cart Summary

**What goes wrong:** Email Míša receives has no product details — only form field values.
**Why it happens:** `emailjs.sendForm()` only reads `name` attributes from HTML input elements. The cart summary string is computed in JavaScript, not in a form field.
**How to avoid:** Use `emailjs.send()` with a manually constructed params object. Inject the cart summary as a JS-computed string: `cart_summary: formatCartSummary(cart)`. The EmailJS template uses `{{cart_summary}}` as a variable.

### Pitfall 7: Form Submit Reloads Page on GitHub Pages

**What goes wrong:** Form submits and browser navigates to `?full_name=...` URL or reloads the page, showing a blank form.
**Why it happens:** Missing `e.preventDefault()` in the submit event handler, or `<button type="submit">` inside a `<form>` without a submit handler.
**How to avoid:** Always call `e.preventDefault()` as the first line of the form submit handler.

### Pitfall 8: Delivery Conditional Fields UX

**What goes wrong:** User changes delivery from "Zásilkovna domů" to "Osobní odběr" but home address field value is still present and gets sent in the email.
**Why it happens:** Hiding a field with CSS/`hidden` attribute does not clear its value.
**How to avoid:** When `delivery` select changes, not only show/hide fields but also clear the values of hidden fields: `homeAddressInput.value = ''` when switching away from home delivery.

---

## Code Examples

### Nav Cart Icon (HTML addition to index.html)

```html
<!-- Source: Phase 5 design — added to <ul class="nav-links"> -->
<li>
  <button class="cart-nav-btn" aria-label="Otevřít košík" id="cart-nav-btn">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
    <span class="cart-count" hidden>0</span>
  </button>
</li>
```

### Order Form Section (HTML — replaces old #kontakt content)

```html
<!-- id="kontakt" section in index.html — Phase 5 replaces Instagram link with form -->
<section id="kontakt" class="section section--surface">
  <h2>Objednat</h2>
  <p>Vyplňte formulář a objednávku odeslete. Platební instrukce vám pošleme e-mailem.</p>

  <form id="order-form" novalidate>
    <div class="form-group">
      <label for="full_name">Jméno a příjmení *</label>
      <input type="text" id="full_name" name="full_name" required autocomplete="name">
    </div>
    <div class="form-group">
      <label for="email">E-mail *</label>
      <input type="email" id="email" name="email" required autocomplete="email">
    </div>
    <div class="form-group">
      <label for="phone">Telefon *</label>
      <input type="tel" id="phone" name="phone" required autocomplete="tel" placeholder="+420 123 456 789">
    </div>
    <div class="form-group">
      <label for="delivery">Způsob doručení *</label>
      <select id="delivery" name="delivery" required>
        <option value="">— Vyberte —</option>
        <option value="packeta-vydejna">Zásilkovna — výdejní místo</option>
        <option value="packeta-domu">Zásilkovna — doručení domů</option>
        <option value="osobni-odber">Osobní odběr (Ostrava)</option>
      </select>
    </div>

    <!-- Conditionally shown: Packeta pickup -->
    <div id="packeta-section" hidden>
      <button type="button" onclick="openPacketaWidget()" class="btn btn--secondary">
        Vybrat výdejní místo
      </button>
      <p id="packeta-selected-name" class="packeta-selected"></p>
    </div>

    <!-- Conditionally shown: Home delivery address -->
    <div id="home-delivery-section" hidden>
      <div class="form-group">
        <label for="home_address">Doručovací adresa *</label>
        <input type="text" id="home_address" name="home_address" autocomplete="street-address">
      </div>
    </div>

    <div class="form-group">
      <label for="note">Poznámka (nepovinné)</label>
      <textarea id="note" name="note" rows="3"></textarea>
    </div>

    <div class="form-group form-group--checkbox">
      <label>
        <input type="checkbox" name="gdpr" required>
        Souhlasím se zpracováním osobních údajů pro účely vyřízení objednávky. *
      </label>
    </div>

    <button type="submit" id="submit-btn" class="btn btn--primary">
      Odeslat objednávku
    </button>
    <p id="form-success" hidden>Objednávka odeslána! Potvrzení dorazí na váš e-mail.</p>
    <p id="form-error" hidden>Něco se nepovedlo. Zkuste to prosím znovu nebo nás kontaktujte na Instagramu.</p>
  </form>
</section>
```

### localStorage Cart Helper (complete, defensive)

```javascript
// Source: localStorage API — MDN + standard defensive pattern
const CART_KEY = 'misiksvet-cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return []; // private browsing or quota exceeded — fall back to empty
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // Fail silently — cart works in-memory for this session
  }
}

function clearCart() {
  try {
    localStorage.removeItem(CART_KEY);
  } catch {}
  renderCart([]);
  updateNavBadge([]);
}
```

### EmailJS Init Pattern (head, before other scripts use emailjs)

```html
<!-- Source: https://www.emailjs.com/docs/sdk/installation/ -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js">
</script>
<script type="text/javascript">
  (function(){
    emailjs.init({ publicKey: "YOUR_EMAILJS_PUBLIC_KEY" });
  })();
</script>
```

### EmailJS Template Variables (both templates need these)

Template variables used in `emailjs.send()` params object:

| Variable | Value Source | Template Use |
|----------|-------------|--------------|
| `{{full_name}}` | Form field | Greeting: "Dobrý den, {{full_name}}" |
| `{{email}}` | Form field | "To" field in customer template |
| `{{phone}}` | Form field | Owner notification body |
| `{{delivery}}` | Form select value | Both templates |
| `{{pickup_point}}` | Packeta callback | Both templates |
| `{{home_address}}` | Form field (conditionally shown) | Both templates |
| `{{note}}` | Form textarea | Both templates |
| `{{cart_summary}}` | JS-computed string | Both templates |
| `{{total}}` | JS-computed string | Both templates |

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| form `action="mailto:"` | EmailJS CDN send | mailto: requires email client, unreliable; EmailJS sends server-side with user's browser triggering it |
| `position: absolute` cart overlay | `position: fixed` cart drawer | fixed stays in viewport during scroll; absolute scroll-dependent |
| `var` for JS variables | `const` / `let` | Scope safety; no accidental re-assignments |
| Packeta Widget v5 | Packeta Widget v6 | v6 is current supported version; v5 deprecated |
| `emailjs.sendForm()` | `emailjs.send()` with params object | sendForm() only reads form fields; send() allows computed JS values (cart summary) |

**Deprecated/outdated:**
- `form action="mailto:"`: Do not use — unreliable, client-dependent, exposes email address
- Packeta Widget v5 script URL: Use v6 at `widget.packeta.com/v6/www/js/library.js`
- EmailJS SDK v3 CDN (`cdn.emailjs.com/sdk/3.x/emailjs.min.js`): Use `@emailjs/browser@4` on jsdelivr

---

## Open Questions

1. **Packeta API Key — Míša's account**
   - What we know: Packeta API key required for widget; must be obtained from `client.packeta.com`
   - What's unclear: Whether Míša already has a Zásilkovna sender account (she sends via app as private person per STATE.md blocker note) or needs to register
   - Recommendation: Planner must include a task that explicitly states "Míša obtains API key from client.packeta.com — this is a human blocker before Packeta widget can be tested live." During development, use `'demoapikey'` as placeholder string to verify widget script loads without JS error.

2. **EmailJS credentials — Service ID, Template IDs, Public Key**
   - What we know: EmailJS account must be set up with email service connected and 2 templates created
   - What's unclear: Whether Míša has an EmailJS account already
   - Recommendation: Planner must include a task for "Míša creates EmailJS account, connects Gmail/Seznam, creates 2 templates, sets Allowed Origins to misiksvet.cz, and provides Service ID + Template IDs + Public Key." This is a human blocker. Planner should note STATE.md [Pre-Phase 3] blockers already document this.

3. **3+1 Promo Rule — Confirmation Required**
   - What we know: STATE.md [Pre-Phase 2] blocker: "Přesná pravidla akce 3+1 musí být potvrzena s Míšou písemně před zahájením fáze 2". REQUIREMENTS.md says: "při 3+ kusech utěrek je nejlevnější zdarma; zástěra do akce nevstupuje." The formula in STATE.md decisions: `Math.floor(totalQty / 4)` free pieces.
   - What's unclear: With all utěrky at 380 Kč, "nejlevnější zdarma" is equivalent to "jeden kus zdarma za každé 4 kusy." But the exact formula for mixed-price utěrky (future-proofing) needs one more confirm.
   - Recommendation: Use the requirements as specified — `Math.floor(uterkaCount / 4)` free pieces at the cheapest price in the cart. This handles current all-380-Kč state and future differently-priced utěrky.

4. **Cart UI — Drawer vs. Dedicated Section**
   - What we know: CART-07 says accessible from navigation (icon with count). No locked constraint on drawer vs. separate section.
   - What's unclear: Whether Míša prefers a slide-out drawer or a collapsible section just above the order form
   - Recommendation: Slide-out drawer (right side) is standard UX for e-commerce mobile — matches the Instagram mobile-first audience. Claude's discretion. The research pattern documented above uses drawer.

5. **Contact section — replace or supplement?**
   - What we know: Current `#kontakt` section says "Napište mi na Instagram". Phase 5 adds an order form.
   - What's unclear: Does the form fully replace the Instagram link, or do both coexist?
   - Recommendation: Keep Instagram link as fallback (in case form fails or user prefers). Replace section heading with "Objednat / Kontakt". Claude's discretion.

---

## Validation Architecture

> Note: `workflow.nyquist_validation` is not set in config.json — skipping automated test framework section. Manual browser testing applies.

Manual verification approach for this phase:
- Cart: add product → verify appears in drawer → add 4 utěrky → verify 1 is shown as free → refresh page → verify cart persists
- Promo: add 3 utěrky + 1 zástěra → verify zástěra not discounted, no free item (only 3 utěrky < 4)
- Order form: submit with empty fields → verify Czech error messages appear on each field
- Packeta: select "Zásilkovna výdejní místo" → click "Vybrat výdejní místo" → widget opens → select point → name shown in form
- EmailJS: submit complete form → Míša's email receives order notification → customer email receives confirmation
- Mobile: entire flow on real phone from product → cart → order → submit

---

## Sources

### Primary (HIGH confidence)
- EmailJS official documentation — `https://www.emailjs.com/docs/sdk/installation/` and `https://www.emailjs.com/docs/tutorial/overview/` — CDN URL, init pattern, send() API
- Mailtrap EmailJS tutorial 2026 — `https://mailtrap.io/blog/emailjs/` — sendForm vs send(), Allowed Origins setup, template variables
- Packeta official widget docs — `https://old.docs.packeta.com/01-pickup-point-selection/02-widget-v6.html` — library.js URL, Packeta.Widget.pick() signature, callback structure
- MDN Web Docs — Constraint Validation API, localStorage API, CSS position:fixed — browser-native behavior
- Existing project files (index.html, products.js, main.js, style.css) — confirmed Phase 1 patterns, existing CSS tokens, script load order

### Secondary (MEDIUM confidence)
- WebSearch results for Packeta widget integration examples — `https://codepen.io/Packeta/pen/qBvvyQR` — confirms v6 library.js URL and callback structure
- EmailJS FAQ — Allowed Origins domain restriction setup — confirms security feature available on free tier

### Tertiary (LOW confidence — flag for validation)
- Packeta API key acquisition for private individuals — search results suggest account required; test/demo key availability unclear — verify by contacting info@zasilkovna.cz
- EmailJS 200/month limit applying to both template sends (effectively 100 orders/month) — inferred from "each send() call = 1 credit" documentation, not explicitly stated per dual-send scenario

---

## Metadata

**Confidence breakdown:**
- Cart state + localStorage: HIGH — standard browser APIs, verified patterns, no external dependencies
- EmailJS integration: HIGH — verified against official docs and current tutorial (2026)
- Packeta widget v6: MEDIUM — library.js URL and Packeta.Widget.pick() confirmed; API key acquisition process for non-registered private persons is LOW confidence (requires Míša action)
- HTML5 form validation: HIGH — native browser API, well-documented
- Promo 3+1 logic: HIGH — formula locked in REQUIREMENTS.md and STATE.md decisions

**Research date:** 2026-03-04
**Valid until:** 2026-06-04 (EmailJS and Packeta widget APIs are stable; localStorage is permanent browser standard)
