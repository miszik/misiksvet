# Research Summary

**Project:** Mišik svět — static e-shop landing page with cart
**Synthesized:** 2026-03-04
**Research files:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md

---

## Executive Summary

Mišik svět is a personal artisan brand selling hand-embroidered linen towels (3 motifs, 380 Kč each) via an Instagram-driven audience in the Czech market. The expert approach for this project is deliberate minimalism: a single static HTML page with no build step, no framework, and no backend — hosted on GitHub Pages for zero cost and zero ongoing maintenance. This is the right call. The feature surface is small and well-defined (product gallery, quantity-aware cart with 3+1 promotion, email-based checkout via EmailJS), and every layer of added complexity — React, npm, a CMS, a payment gateway — would impose build pipeline maintenance burdens on someone who is not a developer. Vanilla HTML + CSS + JavaScript with EmailJS via CDN is not a fallback; it is the architecturally correct choice for this scope.

The recommended approach delivers a fully functional ordering experience in a single deployment: optimized product photos, a JavaScript cart module that persists to localStorage and calculates the 3+1 promotion in real time, and an EmailJS integration that sends dual confirmation emails (to Míša and to the customer) without requiring any server. The Scandinavian aesthetic specified in the brief (Cormorant Garamond + Josefin Sans, béžová/krémová palette) maps cleanly to a custom CSS implementation — no utility framework needed. The site is a pure static artifact; every commit to `main` is a deployment.

The primary risks are operational, not technical. EmailJS public keys must be origin-restricted in the dashboard before the first deploy to prevent quota abuse. Images from the `/fotky/` directory are currently raw camera files (3–8 MB each) and must be converted to WebP and resized before committing — unoptimized images would cause near-100% mobile bounce rates. The 3+1 promotion rule must be clarified with Míša in writing before a single line of cart code is written (the spec is ambiguous). GDPR compliance requires a data processing checkbox and privacy notice on the order form — this is not optional even for an informal business collecting Czech customer data. These pitfalls are all avoidable with deliberate sequencing during Phase 1.

---

## Key Findings

### From STACK.md

| Technology | Rationale |
|------------|-----------|
| Vanilla HTML5 + CSS3 + ES2022+ JS | No build step; GitHub Pages serves raw files; full feature set implementable in ~200 lines |
| EmailJS Browser SDK v4 (CDN) | Purpose-built for client-side email; free tier (200/month) matches expected order volume; dual-template pattern covers owner notification + customer confirmation |
| Google Fonts (Cormorant Garamond + Josefin Sans) | Already specified in brief; CDN delivery with `display=swap` prevents render blocking |
| GitHub Pages | Free, zero-maintenance, zero-config for static HTML; auto-deploys on push |
| WebP images + native lazy loading | 25-35% smaller than JPEG; universally supported; no JS library needed |

Critical version note: EmailJS public key must have domain restrictions set in the EmailJS dashboard before any deployment to GitHub Pages.

No framework, no npm, no package.json. Everything CDN or local file.

---

### From FEATURES.md

**Table stakes (must ship to MVP — missing any causes the site to fail its purpose):**
- Large product photos with names, descriptions, prices (prominently displayed)
- 3+1 promotion explained clearly near the cart
- Cart with quantity controls and live running total including discount
- Order form (name, email, address) with on-page and email confirmation
- Mobile-first layout (Instagram audience is nearly 100% mobile at first visit)
- Contact/seller info — "who is making this?" is a trust anchor for artisan buyers

**Differentiators (high leverage, low effort — do not defer):**
- Personal brand story section ("maminka na rodičovské" hook converts significantly better than faceless shops)
- QR payment explanation near the checkout form (removes the biggest checkout barrier for Czech buyers unfamiliar with non-gateway shops)
- Gift framing for the 3+1: "čtvrtou jako dárek" not "sleva 25%" — emotionally resonant for handmade brand
- Open Graph tags (`og:image`, `og:title`, `og:description`) — one-time setup for Instagram/WhatsApp link preview amplification
- Czech-native copy with correct diacritics — signals authentic personal brand, not a template shop

**Explicitly excluded (anti-features for Phase 1):**
- Payment gateway (requires živnostenský list Míša doesn't have)
- User accounts, wishlists, inventory system, admin panel
- Cookie consent banner (no tracking = no banner required under GDPR)
- Reviews, newsletter, multi-language, product filtering

**Defer to post-launch:**
- Static testimonials (collect real ones via Instagram DMs first)
- Shipping cost display (confirm carrier/cost with Míša before hardcoding)
- Cookie-free analytics (Plausible — useful eventually, not needed to launch)

---

### From ARCHITECTURE.md

**Major components and responsibilities:**

| Component | File | Responsibility |
|-----------|------|----------------|
| Product catalog | `js/products.js` | Single source of truth for product data (id, name, price, image, description) — pure data, no DOM access |
| Cart state machine | `js/cart.js` | Manages cart array in module scope; computes 3+1 promotion; renders cart UI; exposes `Cart.add/remove/updateQuantity/getTotal/render/toOrderSummary` |
| Order form handler | `js/order.js` | Validates form fields; builds order summary string from cart; calls `emailjs.send()` twice; handles success/error states |
| Initialization + wiring | `js/main.js` | `DOMContentLoaded` entry point; calls `renderProductCards()`; wires all DOM events; scroll/nav effects; initializes EmailJS public key |
| EmailJS CDN | external | Client-side email delivery — the only "server-side" behavior on a static site |

**Key patterns:**
- One-way data flow: user interaction mutates JS state → state triggers DOM render. DOM is never read back to determine state.
- Product cards generated from `PRODUCTS` array, not hardcoded HTML — adding a 4th product requires touching only `products.js`
- Script load order in `index.html` is critical: `products.js` → `cart.js` → `order.js` → `main.js` (each file depends on the previous)
- `.nojekyll` file in repo root prevents GitHub Pages from running Jekyll (which would silently break underscore-prefixed assets)
- All asset paths must be relative (not absolute) because the repo deploys to a subdirectory URL (`/web_misiksvet/`)

**Page sections (HTML structure):**
`<nav>` → `#hero` → `#pribeh` (story) → `#produkty` (product grid) → `#proc` (values) → `#akce` (3+1 promo banner) → `#objednat` (cart + order form) → `<footer>`

**3+1 logic (inside `Cart.getTotal()`):**
```
freeItems = Math.floor(totalQuantity / 4)
total = (totalQuantity - freeItems) * 380
```
This is deterministic, pure, and easy to manually verify.

---

### From PITFALLS.md

**Top 5 critical/high-priority pitfalls:**

| Pitfall | Severity | Prevention |
|---------|----------|------------|
| EmailJS public key not origin-restricted | CRITICAL | Configure Allowed Origins in EmailJS dashboard before first deploy; without this, anyone can exhaust the 200/month free tier |
| Raw camera images (3-8 MB) deployed unoptimized | CRITICAL | Convert all `/fotky/` images to WebP, max 1200px, under 150KB before committing; unoptimized = 15-30s mobile load = 100% bounce rate |
| GDPR non-compliance — no data processing notice or checkbox | CRITICAL | Add required checkbox ("Souhlasím se zpracováním...") and privacy notice to order form before launch; applies to individuals, not just businesses |
| Cart state lost on page refresh | HIGH | Implement `localStorage` persistence from the first line of cart code — primary audience is mobile where tab reload is frequent |
| 3+1 promotion rule ambiguous | HIGH | Clarify exact rule with Míša in writing before coding — "buy 3 get 1 free" has multiple interpretations (per-type vs. cross-cart, cheapest vs. 4th) |

**Additional pitfalls to build around:**
- Form double-submit / no feedback: disable submit button immediately on click; show loading state; display explicit success or error message
- GitHub Pages relative paths: all CSS, JS, and image src attributes must use relative paths (not `/path/from/root`)
- Czech charset: `<meta charset="UTF-8">` must be the first tag in `<head>`; missing = garbled diacritics
- Touch targets: all interactive elements must be min 44x44px including padding — test on a real phone, not just DevTools
- EmailJS templates with `{{undefined}}` fields: build and test both templates in EmailJS dashboard before connecting JavaScript

---

## Implications for Roadmap

The research strongly suggests a 4-phase build. Each phase produces a testable, shippable artifact. No phase begins until the previous one is verified in the browser.

### Suggested Phase Structure

**Phase 1: Foundation + Product Display**
- Rationale: Everything else depends on the HTML scaffold, CSS system, and image assets. Image optimization must happen before images are referenced in HTML.
- Delivers: A navigable, visually complete page that looks right on mobile — no interactivity yet
- Includes: `index.html` skeleton with all sections; `style.css` with Scandinavian design system and responsive layout; Google Fonts integration with preconnect; all images converted to WebP and committed; `<meta charset="UTF-8">` and Open Graph tags; `products.js` with product data; `renderProductCards()` rendering the product grid; `.nojekyll` file; GitHub Pages configured and tested at live URL
- Features from FEATURES.md: Product photos, names, descriptions, prices; personal brand story section; `#proc` values section; `#akce` promo banner copy
- Pitfalls to avoid: Missing charset; unoptimized images; absolute paths breaking on GitHub Pages subdirectory; OG image using relative URL

**Phase 2: Cart + 3+1 Promotion**
- Rationale: The cart is the core interactive feature and the 3+1 promotion is the primary buying incentive. Building this cleanly before connecting EmailJS means the cart can be fully verified before any async email complexity is introduced.
- Delivers: Fully functional cart with localStorage persistence, live totals, and correct 3+1 discount display
- Includes: `cart.js` with full state machine; `Cart.add/remove/updateQuantity/getTotal/render/toOrderSummary`; 3+1 promotion calculated as `Math.floor(totalQty / 4)` free items; discount shown as separate line item in cart UI ("Akce 3+1: -380 Kč"); localStorage persistence (`saveCart`/`loadCart`); quantity controls at 44x44px minimum touch targets; `main.js` wiring
- Features from FEATURES.md: Cart quantity controls; running total with 3+1 calculation; gift framing for promotion; mobile-first cart UX
- Pitfalls to avoid: State lost on refresh (localStorage from line 1); wrong 3+1 calculation (clarify rule with Míša before this phase); reading cart totals from DOM instead of JS state; touch targets too small

**Phase 3: Order Form + EmailJS Integration**
- Rationale: Depends on cart being complete (uses `Cart.toOrderSummary()`). EmailJS setup requires out-of-band account configuration (creating templates, setting origin restrictions) that should be done as a focused task.
- Delivers: End-to-end order flow — customer submits form, receives confirmation email, Míša receives notification email
- Includes: `order.js` with form validation, `emailjs.send()` dual-email pattern, submit-disable + loading state + success/error feedback; GDPR consent checkbox and privacy notice on form; both EmailJS templates created and tested in dashboard; EmailJS public key origin-restricted to GitHub Pages domain; QR payment explanation near form; form reset and cart clear on success
- Features from FEATURES.md: Order form; email confirmation flow; QR payment explanation; on-page success message; GDPR notice
- Pitfalls to avoid: EmailJS public key not origin-restricted (configure before first live test); template fields with `{{undefined}}`; double-submit; silent failures; missing GDPR checkbox

**Phase 4: Polish + Pre-launch QA**
- Rationale: Final quality pass before announcing the site. These items cannot be checked until the full site is deployed and testable at its live URL.
- Delivers: Launch-ready site with verified mobile UX, correct Czech typography, confirmed social sharing previews, and documented operational procedures
- Includes: Real-device mobile testing (Android + iOS, not just DevTools); Google Lighthouse mobile audit; Czech copy review by Míša (diacritics, non-breaking spaces, quotation marks); Open Graph social preview tested with Facebook Sharing Debugger; cache-busting query strings on CSS/JS links (`style.css?v=1`); EmailJS quota monitoring documented; font fallback stacks verified; PageSpeed score target 70+ on mobile
- Features from FEATURES.md: Mobile-first polish; Czech-native copy; social sharing via OG tags
- Pitfalls to avoid: DevTools-only testing (touch targets feel fine with mouse); OG image at relative URL; Czech charset errors visible only with non-UTF-8 test

### Research Flags

| Phase | Needs Research Phase? | Rationale |
|-------|----------------------|-----------|
| Phase 1 | No | Vanilla HTML/CSS/JS static site on GitHub Pages is a fully documented, stable pattern with no unknowns |
| Phase 2 | No | Vanilla JS cart with localStorage is a well-documented pattern; 3+1 logic is simple arithmetic |
| Phase 3 | Maybe | EmailJS dual-template pattern is documented in ARCHITECTURE.md; the only unknown is specific template syntax behavior — test in dashboard before coding, not via research phase |
| Phase 4 | No | QA checklist, not new research; standard pre-launch verification steps |

Recommendation: No formal `/gsd:research-phase` calls needed. The research is thorough and the domain is stable. Phase 3 EmailJS template setup should be verified interactively in the EmailJS dashboard during build, not researched further.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Vanilla HTML/CSS/JS + GitHub Pages is a settled domain; no rapidly-changing dependencies; all choices are well-established |
| Features | HIGH | Table stakes derived from Instagram e-commerce patterns + Czech market norms; Czech legal requirements (GDPR, consumer law) are established law |
| Architecture | HIGH | Static site module separation pattern with `<script>` load order is standard browser behavior; EmailJS CDN API is stable since v3 |
| Pitfalls | MEDIUM-HIGH | Critical pitfalls (images, EmailJS security, GDPR) are HIGH confidence; EmailJS free tier limit (200/month) is MEDIUM — verify at emailjs.com/pricing before launch as pricing tiers change |

**Overall confidence: HIGH**

---

## Gaps to Address During Build

These items could not be resolved by research and require direct input from Míša or verification during setup:

1. **3+1 promotion rule:** The exact mechanics must be confirmed with Míša before writing cart logic. Assumed: for every 4 items total, 1 is free (cross-cart, not per-product). If the rule is different (e.g., cheapest item free, or per-product), `Cart.getTotal()` logic changes.

2. **EmailJS free tier current limit:** Documented as 200 emails/month in training data. Verify at https://www.emailjs.com/pricing before committing to EmailJS as the solution.

3. **Shipping cost and carrier:** FEATURES.md notes buyers will ask about shipping. Míša must confirm the carrier (Zásilkovna assumed) and cost before Phase 1 can include this in the product/cart area.

4. **Custom domain:** The site will initially deploy to `[username].github.io/web_misiksvet/`. All relative paths must account for this base URL. If Míša registers a custom domain later, paths don't change (relative paths work under both), but the EmailJS allowed origin list must be updated.

5. **Czech legal copy:** The GDPR notice and 14-day return right statement need to be reviewed by Míša or a Czech legal source before launch. The text proposed in FEATURES.md is directionally correct but not a legal opinion.

---

## Aggregated Sources

| Source | Confidence | Files |
|--------|------------|-------|
| EmailJS documentation (emailjs.com/docs) | MEDIUM (training data; verify before build) | STACK.md, ARCHITECTURE.md, PITFALLS.md |
| GitHub Pages documentation (docs.github.com/en/pages) | HIGH | STACK.md, ARCHITECTURE.md, PITFALLS.md |
| CSS Grid/Flexbox, WebP, lazy loading browser support | HIGH | STACK.md |
| Google Fonts performance best practices | HIGH | PITFALLS.md |
| Czech consumer law § 1829 OZ (14-day return right) | HIGH | FEATURES.md |
| EU GDPR Article 13 (disclosure at point of data collection) | HIGH | FEATURES.md, PITFALLS.md |
| Czech QR platba (ČNB standard) | HIGH | FEATURES.md |
| Apple HIG touch targets (44px) / Material Design (48dp) | HIGH | FEATURES.md, PITFALLS.md |
| Core Web Vitals / image optimization thresholds | HIGH | PITFALLS.md |
| PROJECT.md and zadani-web-misiksvet.md (project requirements) | HIGH — primary source | All files |

*External web search tools were unavailable during all research sessions. All claims are based on training knowledge (cutoff August 2025) for stable, well-established technologies and Czech legal standards. Verify EmailJS pricing and any Czech legal text before launch.*
