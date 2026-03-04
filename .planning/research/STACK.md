# Technology Stack

**Project:** Mišik svět — static e-shop landing page with cart
**Researched:** 2026-03-04
**Confidence:** HIGH for core choices (stable, well-established domain); MEDIUM for specific version numbers (verify at install time)

---

## Recommended Stack

### Core: Vanilla HTML + CSS + JavaScript (No Framework)

**Verdict: Vanilla, no build step.**

This is a one-page site with a shopping cart and a contact form. The feature surface is small and well-defined. A framework (React, Vue, Svelte) adds a build pipeline that must be configured, maintained, and deployed — all of which conflict with the GitHub Pages zero-config constraint and the owner's zero-maintenance requirement. Vanilla avoids this entirely.

### Core Layer

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| HTML5 | — | Structure, semantic markup | Native browser support, no compilation, SEO-friendly |
| CSS3 + Custom Properties | — | Styling, layout, responsive design | CSS Grid + Flexbox handle all layout needs; Custom Properties (variables) replace pre-processors for theming |
| Vanilla JavaScript (ES2022+) | — | Cart logic, form handling, EmailJS integration | Supported by all modern browsers; no transpilation needed for the feature set required |

**Why NOT a framework:**
- React requires a build step (Vite/CRA). GitHub Pages can host the build output, but every change requires a local build + push. No benefit for a site this small.
- Vue/Svelte: Same problem. Build pipeline complexity with no gain.
- The cart state for 3 products + quantity tracking is ~50 lines of vanilla JS. No framework needed.

### Fonts

| Technology | Source | Purpose | Why |
|------------|--------|---------|-----|
| Cormorant Garamond | Google Fonts | Headings, product names | Already specified in design brief; free, high quality, suits the artisan aesthetic |
| Josefin Sans | Google Fonts | Body text, UI labels | Already specified; clean, geometric, legible at small sizes |

**Loading strategy:** Use `<link rel="preconnect" href="https://fonts.googleapis.com">` + `display=swap` to prevent FOUT (Flash of Unstyled Text) and avoid render blocking.

**Why NOT self-hosted fonts:** Google Fonts CDN is cached across sites (user likely already has it). For a free static site, the CDN dependency is acceptable. If privacy becomes a concern later, self-hosting is a one-line switch.

### Email: EmailJS

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| EmailJS Browser SDK | v4.x (CDN) | Send emails from client-side JS without a backend | Purpose-built for this exact use case; free tier (200 emails/month) matches expected order volume; works on static hosting |

**Free tier (verified as of research date):** 200 emails/month, 2 email services, unlimited templates. Sufficient for a craft business starting out.

**Integration approach:**

```html
<!-- Load via CDN — no npm, no build step -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js">
</script>
<script type="text/javascript">
  emailjs.init({ publicKey: 'YOUR_PUBLIC_KEY' });
</script>
```

**Two templates required:**
1. `order_notification` — sent to Míša with full order details (items, quantities, total, 3+1 discount applied, customer name/email/address)
2. `order_confirmation` — sent to customer acknowledging their order and explaining the next step (Míša will contact them with payment QR code)

**Key EmailJS constraint:** The public key is visible in client-side HTML. This is by design — EmailJS is meant for client-side use. Protect against abuse by enabling domain restrictions in the EmailJS dashboard (lock the key to your GitHub Pages domain only).

**Why NOT alternatives:**
- Formspree: Good alternative, but EmailJS gives more control over email content and two-recipient logic (customer + owner) within the free tier.
- Netlify Forms: Requires Netlify hosting, not GitHub Pages.
- Sendgrid/Mailgun: Require a backend — incompatible with static hosting.
- mailto: links: No server-side processing, no automation, terrible UX.

### Hosting

| Technology | Purpose | Why |
|------------|---------|-----|
| GitHub Pages | Static hosting | Free, zero monthly cost, integrates with existing GitHub workflow, suitable for static HTML/CSS/JS |

**Deployment approach:** Push HTML/CSS/JS files to `main` branch (or `gh-pages` branch). GitHub Pages serves them directly. No CI/CD pipeline needed — the site has no build step.

**Custom domain:** Optional. GitHub Pages supports custom domains with automatic HTTPS via Let's Encrypt. Can be added later when Míša registers a domain.

**GitHub Pages constraints to respect:**
- No server-side code (PHP, Node.js, Python) — already excluded
- No `.htaccess` for URL rewriting — not needed for single-page site
- File size limits: 1GB repo, 100MB per file — photos must be optimized before commit
- Bandwidth: 100GB/month soft limit — irrelevant at this traffic scale

### Image Optimization

| Technology | Purpose | Why |
|------------|---------|-----|
| WebP format | Product photos | 25-35% smaller than JPEG at equivalent quality; supported by all modern browsers |
| Native `<img loading="lazy">` | Deferred image loading | Browser-native, no JS library needed |

**Photo pipeline (one-time):** The 8 photos in `/fotky/` should be converted to WebP and sized to max 1200px wide before committing. No automated pipeline needed — this is a one-time task.

**Why NOT a CDN for images:** At this traffic scale, GitHub Pages serves images fine. Cloudinary/imgix add complexity and potential cost with no benefit here.

### Supporting Libraries

| Library | CDN Version | Purpose | When to Use |
|---------|-------------|---------|-------------|
| None required | — | — | The feature set (cart, form, email) is implementable in ~200 lines of vanilla JS |

**Explicitly excluded libraries:**
- jQuery: Unnecessary in 2025. All DOM operations it simplifies are native in ES6+.
- Lodash/Underscore: Overkill for 3-product cart logic.
- Bootstrap/Tailwind: The design is custom (Scandinavian minimal). Utility frameworks fight custom design systems and add unused CSS weight.
- Alpine.js: Tempting for reactivity without a build step, but the cart state here is simple enough that vanilla JS is cleaner and has zero dependency risk.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Vanilla HTML/CSS/JS | React + Vite | Build step required; complexity with no benefit for 3-product site |
| Framework | Vanilla HTML/CSS/JS | Vue 3 (CDN) | CDN Vue is viable but adds complexity; vanilla is sufficient |
| Framework | Vanilla HTML/CSS/JS | Astro | Excellent for static sites but overkill; requires Node.js build pipeline |
| Email | EmailJS | Formspree | EmailJS gives finer control over dual-recipient email templates |
| Email | EmailJS | Netlify Forms | Requires Netlify hosting, not GitHub Pages |
| CSS | Plain CSS | Sass/SCSS | Requires build step; CSS Custom Properties replace variables; no preprocessor needed |
| CSS | Plain CSS | Tailwind | Fights the custom Scandinavian design system; build step required for PurgeCSS |
| Hosting | GitHub Pages | Netlify | Both are free; GitHub Pages simpler for Git-native workflow with no build step |
| Hosting | GitHub Pages | Vercel | Vercel excels with frameworks; unnecessary here |

---

## File Structure

```
web_misiksvet/
├── index.html          # Single page — all sections
├── css/
│   └── style.css       # All styles, organized by section
├── js/
│   └── main.js         # Cart logic + EmailJS integration
├── fotky/              # Product photos (WebP, optimized)
│   ├── kopretina-1.webp
│   ├── kopretina-2.webp
│   ├── vlci-mak-1.webp
│   ├── vlci-mak-2.webp
│   └── siska-1.webp
└── .planning/          # Project planning files
```

**Why a single `index.html`:** GitHub Pages serves `index.html` at the root by default. No routing configuration needed. All sections (hero, products, cart, order form) are sections within one page, navigated by anchor links or JS scroll.

---

## Installation

No package manager. No `node_modules`. No `package.json`.

Everything loads either from local files or CDN:

```html
<!-- In <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Josefin+Sans:wght@300;400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">

<!-- Before </body> -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script src="js/main.js"></script>
```

**Deployment:**

```bash
git add .
git commit -m "update site"
git push origin main
# GitHub Pages auto-deploys within ~60 seconds
```

---

## Cart Implementation Approach

**State:** Plain JS object stored in memory (and optionally `localStorage` for persistence across page refreshes).

```javascript
// Cart state — sufficient for 3-product site
const cart = {
  items: {},        // { productId: { name, price, qty } }
  get total() { return Object.values(this.items).reduce((sum, i) => sum + i.price * i.qty, 0); },
  get itemCount() { return Object.values(this.items).reduce((sum, i) => sum + i.qty, 0); }
};
```

**3+1 promotion logic:**

```javascript
// For every 3 items purchased, 1 is free (cheapest, or any — clarify with Míša)
function calculateDiscount(cart) {
  const totalQty = cart.itemCount;
  const freeItems = Math.floor(totalQty / 3);    // 3 => 1 free, 6 => 2 free, etc.
  const cheapestPrice = Math.min(...Object.values(cart.items).map(i => i.price));
  return freeItems * cheapestPrice;
}
```

**Why localStorage:** If the user accidentally closes the browser, their cart survives. Trivial to implement, meaningful UX improvement.

---

## EmailJS Configuration

**Required setup (in EmailJS dashboard):**

1. Create account at emailjs.com
2. Add email service (Gmail personal account works; free tier)
3. Create two templates:

**Template 1: `order_notification` (to Míša)**
```
Subject: Nova objednavka - {{customer_name}}

Ahoj Míšo,
prijde ti nova objednavka!

Zakaznik: {{customer_name}}
Email: {{customer_email}}
Adresa: {{customer_address}}

Polozky:
{{order_items}}

Mezisouce: {{subtotal}} Kc
Sleva 3+1: -{{discount}} Kc
Celkem: {{total}} Kc

Kontaktuj zakaznika s platoebnimi instrukcemi.
```

**Template 2: `order_confirmation` (to customer)**
```
Subject: Potvrzeni objednavky - Misik svet

Ahoj {{customer_name}},
dekujeme za tvoji objednavku!

{{order_items}}
Celkem: {{total}} Kc

Mihsa te brzy kontaktuje s platebnimi instrukcemi (QR kod / bankovni prevod).

Tesi se na tebe,
Mihsa z Misik svet
```

4. Note down: Public Key, Service ID, Template IDs
5. Enable domain restriction: lock public key to `[username].github.io`

---

## Security Notes

| Concern | Risk Level | Mitigation |
|---------|------------|------------|
| EmailJS public key exposed in HTML | LOW | Key is scoped to send-only; lock to specific domain in EmailJS dashboard |
| Form spam / bot submissions | MEDIUM | Add honeypot field (hidden input bots fill in); EmailJS rate limits per public key |
| No HTTPS | N/A | GitHub Pages enforces HTTPS automatically |
| XSS via order form inputs | LOW | Sanitize inputs before including in email template; use `textContent` not `innerHTML` for user data |

---

## Sources

**Note:** External research tools were unavailable during this session. Findings are based on training knowledge (cutoff August 2025) for stable, well-established technologies. Confidence levels reflect this.

| Claim | Confidence | Basis |
|-------|------------|-------|
| EmailJS free tier: 200 emails/month | MEDIUM | Training knowledge; verify at emailjs.com/pricing before committing |
| EmailJS SDK v4 CDN via jsDelivr | MEDIUM | Training knowledge; check cdn.jsdelivr.net/npm/@emailjs/browser for latest |
| GitHub Pages constraints (1GB, 100GB BW) | HIGH | Stable, documented limits; well-known |
| CSS Grid/Flexbox browser support | HIGH | Universally supported since 2017+ |
| WebP browser support | HIGH | Universally supported in all modern browsers |
| Google Fonts Cormorant Garamond + Josefin Sans availability | HIGH | Both are established Google Fonts catalog entries |

**Verify before building:**
- https://www.emailjs.com/pricing — confirm free tier limits
- https://cdn.jsdelivr.net/npm/@emailjs/browser — confirm latest version
- https://pages.github.com — confirm deployment steps
