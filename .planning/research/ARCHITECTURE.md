# Architecture Patterns

**Project:** Mišik svět — static product landing page with vanilla JS cart and EmailJS
**Domain:** Static e-commerce landing page (no server)
**Researched:** 2026-03-04
**Confidence:** HIGH — well-established patterns for GitHub Pages + EmailJS; not dependent on rapidly-changing ecosystem

---

## Recommended Architecture

Single-file HTML deployment with logically separated JS modules loaded as plain `<script>` tags. No bundler, no build step, no npm. The entire site is one directory that GitHub Pages serves as-is.

```
web_misiksvet/
├── index.html          # All page structure, all <script> and <link> tags
├── style.css           # All styles (split into logical sections with comments)
├── js/
│   ├── products.js     # Product data (catalog — single source of truth)
│   ├── cart.js         # Cart state machine + DOM rendering
│   ├── order.js        # Order form handling + EmailJS integration
│   └── main.js         # Initialization, event wiring, scroll effects
├── images/
│   ├── kopretina.jpg
│   ├── vlci-mak.jpg
│   └── siska.jpg
└── .nojekyll           # Prevents GitHub Pages from running Jekyll
```

**Why this structure (not a single JS file):**
Each JS file has one clear responsibility. If Míša needs to add a product, she touches only `products.js`. If EmailJS keys change, only `order.js`. This is the minimum viable separation that avoids spaghetti without requiring a build tool.

**Why not a single `index.html` with everything inline:**
A common beginner pattern that works but makes future edits error-prone. Separating concerns costs nothing extra on GitHub Pages.

---

## Component Boundaries

| Component | File | Responsibility | Does NOT touch |
|-----------|------|---------------|----------------|
| Product catalog | `js/products.js` | Defines product objects (id, name, price, image, description) | DOM, cart state |
| Cart state | `js/cart.js` | Manages cart array in memory; renders cart UI; computes 3+1 promotion | EmailJS, form |
| Order form | `js/order.js` | Validates form fields; builds order summary string; calls EmailJS | Cart internals |
| Orchestrator | `js/main.js` | Initializes all modules; wires DOM events; scroll/nav effects | Business logic |
| Email service | EmailJS CDN | Sends two emails (customer confirmation + owner notification) | All other state |

### Why module separation matters here

The 3+1 promotion logic lives exclusively in `cart.js`. If Míša changes the promo (e.g., "4+1" for Christmas), the change is one number in one file. If the EmailJS service ID changes, only `order.js` is touched. `main.js` imports nothing except to call `init()` functions — it is a wiring harness, not a logic container.

---

## Component Details

### products.js — Product Catalog

```javascript
// Single source of truth for all product data.
// No DOM access. Pure data.
const PRODUCTS = [
  {
    id: 'kopretina',
    name: 'Kopretina',
    price: 380,
    image: 'images/kopretina.jpg',
    description: 'Luční kopretiny na přírodním lnu. Jemný motiv ve třech barvách.',
    material: '100% český len'
  },
  {
    id: 'vlci-mak',
    name: 'Vlčí mák',
    price: 380,
    image: 'images/vlci-mak.jpg',
    description: 'Rudý květ vlčího máku s listy. Výrazný a elegantní.',
    material: '100% český len'
  },
  {
    id: 'siska',
    name: 'Šiška s větvičkou',
    price: 380,
    image: 'images/siska.jpg',
    description: 'Detailní šiška s jehličím. Ideální dárek pro milovníky přírody.',
    material: '100% český len'
  }
];
```

### cart.js — Cart State Machine

The cart is a plain JavaScript array of `{ productId, quantity }` objects held in module scope (not localStorage — cart state does not need to survive page reload for this use case). The module exposes:

- `Cart.add(productId)` — adds one unit, or increments if already present
- `Cart.remove(productId)` — removes item entirely
- `Cart.updateQuantity(productId, qty)` — sets exact quantity; if qty < 1, removes
- `Cart.getItems()` — returns copy of cart array with product details joined from `PRODUCTS`
- `Cart.getTotal()` — returns `{ subtotal, discountedItems, freeItems, total }`
- `Cart.render()` — updates the cart DOM panel; called after every mutation
- `Cart.toOrderSummary()` — returns a formatted string for email body

**3+1 promotion logic (inside `Cart.getTotal()`):**

```
Total items = sum of all quantities
Free items  = Math.floor(totalQuantity / 4)
Paid items  = totalQuantity - freeItems
Total price = paidItems * 380
```

This is deterministic, requires no external state, and is easy to unit-test manually.

### order.js — Form Handling + EmailJS

Responsibilities:
1. Validate required fields (name, email, address) before submission
2. Build order summary from `Cart.toOrderSummary()`
3. Send two EmailJS messages: owner notification + customer confirmation
4. Show success/error feedback to user
5. Reset cart and form on success

EmailJS integration pattern (CDN, no build step):

```html
<!-- In index.html, before closing </body> -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

```javascript
// In order.js
emailjs.init('YOUR_PUBLIC_KEY');

async function submitOrder(formData, cartSummary) {
  const templateParams = {
    customer_name: formData.name,
    customer_email: formData.email,
    customer_address: formData.address,
    order_summary: cartSummary,
    order_total: Cart.getTotal().total + ' Kč'
  };

  // 1. Notify Míša
  await emailjs.send('SERVICE_ID', 'TEMPLATE_OWNER', templateParams);

  // 2. Confirm to customer (reply_to = customer email)
  await emailjs.send('SERVICE_ID', 'TEMPLATE_CUSTOMER', {
    ...templateParams,
    reply_to: formData.email
  });
}
```

**Two EmailJS templates required:**
- `TEMPLATE_OWNER` — sent to Míša's email; contains full order detail, customer contact
- `TEMPLATE_CUSTOMER` — sent to customer; confirms receipt, instructs to await payment details

### main.js — Initialization and Wiring

```javascript
// Entry point. Wires DOM events to module functions.
// No business logic here.

document.addEventListener('DOMContentLoaded', () => {
  renderProductCards();      // Build product grid from PRODUCTS data
  Cart.render();             // Initialize empty cart display
  initScrollEffects();       // Navbar shadow on scroll
  initHamburgerMenu();       // Mobile nav toggle
  document.getElementById('order-form')
    .addEventListener('submit', handleOrderSubmit);
});
```

---

## Data Flow

```
PRODUCTS array (products.js)
        |
        v
renderProductCards() → Product cards in DOM
        |
  [User clicks "Přidat do košíku"]
        |
        v
Cart.add(productId) → cart[] mutated
        |
Cart.render() → Cart UI updated (items, quantities, total, 3+1 badge)
        |
  [User fills order form]
        |
        v
handleOrderSubmit() → validate fields
        |
Cart.toOrderSummary() → formatted order string
        |
        v
emailjs.send() x2 → Owner email + Customer confirmation email
        |
        v
Success state: cart cleared, form reset, thank-you message shown
```

**State lives in:** `cart[]` array in `cart.js` module scope
**State does NOT live in:** DOM, localStorage, URL params
**DOM is a view:** cart.js reads state and renders DOM; DOM never drives state

---

## Patterns to Follow

### Pattern 1: Data → State → DOM (one-way flow)

**What:** User interaction mutates state (cart array). State mutation always triggers a render. DOM is never read back to determine state.

**Why:** Avoids the classic bug where `qty = parseInt(input.value)` can return `NaN` if the input is empty or manipulated, corrupting cart totals.

**Example:**
```javascript
// GOOD: state → render
function updateQuantity(id, qty) {
  const item = cart.find(i => i.productId === id);
  item.quantity = Math.max(1, parseInt(qty) || 1);
  Cart.render(); // always re-render from state
}

// BAD: reading DOM as state
function getTotal() {
  const inputs = document.querySelectorAll('.qty-input');
  // Never do this — DOM can drift from truth
}
```

### Pattern 2: Product cards generated from data, not hardcoded HTML

**What:** `renderProductCards()` loops over `PRODUCTS` and builds card HTML programmatically.

**Why:** Adding a fourth product means adding one object to `products.js`. No HTML editing required.

### Pattern 3: EmailJS public key in HTML, not in JS module

**What:** `emailjs.init('PUBLIC_KEY')` is called in `main.js` after the CDN script loads.

**Why:** The public key is visible in browser source regardless — it is designed to be public. Documenting its location makes it easy for Míša to update without searching through JS files. Never put EmailJS Service ID or Template IDs in a config file that might accidentally be treated as secret — they are not secret, they are just identifiers.

### Pattern 4: .nojekyll file in repo root

**What:** Empty file named `.nojekyll` in the repository root.

**Why:** GitHub Pages runs Jekyll by default, which ignores files and folders starting with `_`. This can silently break assets. `.nojekyll` disables Jekyll entirely, serving the directory as static files.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Storing EmailJS credentials in a separate config file committed to GitHub

**What:** Creating `config.js` with `const EMAILJS_KEY = '...'` and committing it.

**Why bad:** The public key is already intentionally public, so committing it is fine. But labeling it "config" creates a false security expectation and may lead to accidentally committing a private key if the project grows.

**Instead:** Keep the public key directly in `main.js` with a comment: `// EmailJS public key — intentionally visible, safe to commit`.

### Anti-Pattern 2: Mixing cart state and rendering

**What:** Modifying cart quantities by reading `input.value` from DOM at form submission time.

**Why bad:** Cart total and 3+1 logic would depend on DOM state rather than JS state, making the promo calculation order-dependent and fragile.

**Instead:** Every quantity input change immediately calls `Cart.updateQuantity()` and `Cart.render()`.

### Anti-Pattern 3: Single `index.html` with all JS inline

**What:** All JavaScript written inside `<script>` tags in `index.html`.

**Why bad:** The file becomes 500+ lines and unmaintainable. Browser caching cannot cache JS separately from HTML. Finding where cart logic ends and form logic begins requires scrolling.

**Instead:** Separate JS files as described. GitHub Pages serves them identically.

### Anti-Pattern 4: Using `fetch()` to POST order data to an API

**What:** Writing a form submit handler that POSTs to a custom API endpoint.

**Why bad:** GitHub Pages serves only static files. There is no server to receive POST requests. Any `fetch()` to a non-existent endpoint will fail with CORS or 404 errors.

**Instead:** All server-side-seeming behavior (email sending) goes through EmailJS's client-side SDK, which calls EmailJS servers from the browser.

### Anti-Pattern 5: Loading product images from external URLs

**What:** Using Instagram CDN links or Google Drive links for product photos.

**Why bad:** External URLs can expire, change, or be rate-limited. Instagram CDN links in particular expire within hours.

**Instead:** Commit optimized images directly to the repository in `images/`. GitHub Pages serves them reliably and they are versioned with the code.

---

## Page Structure (HTML Sections)

```html
index.html
├── <head>
│   ├── Meta (charset, viewport, description, Open Graph)
│   ├── Google Fonts (Cormorant Garamond + Josefin Sans)
│   └── <link rel="stylesheet" href="style.css">
│
└── <body>
    ├── <nav>                    # Fixed top navigation
    │   ├── Logo / brand name
    │   └── Nav links (Příběh, Výrobky, Objednat)
    │
    ├── <section id="hero">      # Full-height hero
    │   ├── Headline
    │   ├── Subheadline
    │   └── CTA button → #produkty
    │
    ├── <section id="pribeh">    # About / story
    │   ├── Text block
    │   └── Product image
    │
    ├── <section id="produkty">  # Product grid
    │   └── #product-grid        # JS renders cards here
    │
    ├── <section id="proc">      # Why Mišik svět (values)
    │   └── 3 feature blocks
    │
    ├── <section id="akce">      # 3+1 promo banner
    │
    ├── <section id="objednat">  # Order section
    │   ├── #cart-panel          # JS renders cart here
    │   └── <form id="order-form">
    │       ├── Name, email, address inputs
    │       └── Submit button
    │
    ├── <footer>
    │
    ├── EmailJS CDN script
    ├── <script src="js/products.js">
    ├── <script src="js/cart.js">
    ├── <script src="js/order.js">
    └── <script src="js/main.js">
```

Script load order matters: `products.js` must load before `cart.js` (cart references `PRODUCTS`), `cart.js` before `order.js` (order calls `Cart.toOrderSummary()`), all before `main.js` (wires events). Plain `<script>` tags in this order, no `type="module"` needed.

---

## GitHub Pages Deployment

### Repository Setup

```
Branch: main (or gh-pages — either works)
Source: / (root) — GitHub Pages serves index.html from root
Custom domain: optional (CNAME file in root)
```

### Deployment Steps

1. Push all files to GitHub repository (public or private — Pages works on both with free tier)
2. Go to repo Settings → Pages → Source → "Deploy from a branch" → `main` → `/ (root)`
3. GitHub Pages publishes at `https://[username].github.io/[repo-name]/`
4. Site updates automatically on every push to `main`

### No Build Step Required

Because there is no bundler, no npm, no TypeScript transpilation — the working directory IS the deployment artifact. What is in the repo root is exactly what GitHub Pages serves. This is a deliberate architectural constraint that keeps the project maintainable by someone who is not a developer.

### Image Optimization Consideration

The raw photos in `/fotky/` are 3–5 MB each (confirmed from directory listing). These must be compressed before committing to `images/`. Target: under 200 KB per image at web display resolution (800×600 px). Tools: Squoosh (browser-based, no install), or ImageMagick CLI. This is a one-time step during initial build, not an ongoing concern.

---

## Scalability Considerations

This site is intentionally not designed to scale — it is designed to be simple, maintainable, and zero-cost.

| Concern | At current scale (< 200 orders/month) | If scale grows |
|---------|----------------------------------------|----------------|
| EmailJS limit | Free tier: 200 emails/month = sufficient | Upgrade to €10/month plan (1,000/month) |
| Cart state | In-memory JS — fine for single-session use | Add localStorage if multi-page needed |
| Product catalog | 3 products in JS array — instant | Up to ~20 products still fine; beyond that consider JSON file |
| Hosting | GitHub Pages — unlimited bandwidth | CDN already included in GitHub Pages |
| Payment | Manual (QR code via email) — suitable now | Add Stripe Checkout (redirect-based, no server needed) later |

---

## Build Order Recommendation for Roadmap

Based on dependencies between components:

1. **HTML structure + CSS** — scaffolding everything else hangs on (sections, nav, form skeleton)
2. **Product catalog** (`products.js` + card rendering) — visible progress, validates photos
3. **Cart state + UI** (`cart.js`) — core interactive feature; 3+1 promo logic lives here
4. **Order form + EmailJS** (`order.js`) — depends on cart being complete; needs EmailJS account setup
5. **Polish** — mobile responsiveness, scroll effects, SEO meta tags, image optimization
6. **Deployment** — `.nojekyll`, GitHub Pages configuration, smoke test on live URL

Each step produces a testable artifact. Never proceed to step N+1 until step N works in the browser.

---

## Sources

- EmailJS Browser SDK: https://www.emailjs.com/docs/sdk/installation/ (HIGH confidence — stable API, in production since 2016; CDN path and `init()`/`send()` API have not changed across v3/v4)
- GitHub Pages static hosting behavior: https://docs.github.com/en/pages (HIGH confidence — `.nojekyll` behavior, branch/root configuration are stable GitHub features)
- Vanilla JS module pattern without bundler: well-established browser-native pattern; `<script>` load order for globals is standard HTML spec behavior (HIGH confidence)
- PROJECT.md and zadani-web-misiksvet.md (project-specific requirements, no external verification needed)
