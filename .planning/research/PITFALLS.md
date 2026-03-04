# Domain Pitfalls

**Domain:** Static product landing page — vanilla JS cart, EmailJS, GitHub Pages, Czech market
**Project:** Mišik svět (hand-embroidered linen towels)
**Researched:** 2026-03-04
**Confidence:** MEDIUM (training data + domain expertise; web search unavailable during research session)

---

## Critical Pitfalls

Mistakes that cause rewrites, security incidents, or complete feature failure.

---

### Pitfall 1: EmailJS Public Key Exposed in Client-Side Code

**What goes wrong:** The EmailJS `publicKey` (and sometimes `serviceID`, `templateID`) are embedded directly in JavaScript that ships to the browser. Anyone who views source or opens DevTools can extract them and send unlimited emails using your account — burning through the 200/month free tier limit or triggering spam.

**Why it happens:** EmailJS is designed for client-side use; the key *must* be in the browser. Developers treat it like a backend secret and panic, or they don't think about it at all and just hardcode it.

**Consequences:**
- Free tier exhausted by a single malicious actor → legitimate orders stop sending
- EmailJS account flagged/suspended for abuse
- Míša stops receiving order notifications with no warning

**Prevention:**
- Understand the threat model: the `publicKey` is **intended to be public** — it identifies the account, not authenticates it. EmailJS's security model relies on domain allowlisting, not key secrecy.
- In EmailJS dashboard → "Email Services" → configure **Allowed Origins** to only permit `https://[username].github.io` and any custom domain. Requests from other origins will be rejected.
- Add email sending rate-limiting logic client-side (disable submit button after send, cooldown timer) to deter casual abuse.
- Do NOT hardcode keys in a public GitHub repo without at least using a GitHub Actions environment variable during build, OR accept that the key is public but mitigate via origin allowlisting.
- Treat `serviceID` and `templateID` as non-secret (they are); treat `publicKey` as "public but origin-restricted."

**Detection (warning signs):**
- Email count in EmailJS dashboard spikes unexpectedly
- Receiving test/garbage emails from unfamiliar addresses
- Monthly quota depleted before end of month

**Phase mapping:** Address in Phase 1 (EmailJS setup) — configure allowed origins before deploying to GitHub Pages. Do not skip this step.

---

### Pitfall 2: Cart State Lost on Page Refresh

**What goes wrong:** Cart items are stored only in JavaScript variables (in-memory state). When the user refreshes the page, navigates away, or the phone screen locks and browser reloads the tab, the entire cart is gone. On mobile (primary audience — Instagram visitors), this is especially common.

**Why it happens:** Beginners write `let cart = []` and update it directly. Works perfectly during development on desktop with the tab always open. Fails silently for real mobile users.

**Consequences:**
- Customer adds 3 items, gets distracted by Instagram, comes back to empty cart
- 3+1 promotion logic resets → customer confused about discount
- Lost sales, frustrated customers contacting Míša directly anyway

**Prevention:**
- Always persist cart state to `localStorage` on every modification
- On page load, read from `localStorage` first and restore cart before rendering
- Use a thin wrapper: `saveCart(cart)` calls `localStorage.setItem('misiksvet-cart', JSON.stringify(cart))` and `loadCart()` calls `JSON.parse(localStorage.getItem('misiksvet-cart') || '[]')`
- Handle JSON parse errors defensively (corrupted storage → reset to empty, never crash)
- Add `storage` event listener to sync across tabs if needed (nice-to-have)

**Detection (warning signs):**
- During testing: add items, press F5, check if cart is empty
- QA step: test on real mobile device with tab backgrounding

**Phase mapping:** Address in Phase 1 (cart implementation) — build localStorage persistence from the first line of cart code, not as an afterthought.

---

### Pitfall 3: Images Not Optimized for GitHub Pages — Slow Mobile Load

**What goes wrong:** The 8 photos in `/fotky/` are used directly as uploaded from camera/phone. Typical phone photos are 3–8 MB JPEG files at 4000px+ resolution. On mobile via Instagram → browser, a page with 3–4 product photos can take 15–30 seconds to load on a mediocre connection.

**Why it happens:** "It looks fine on my laptop" — developer tests on fast WiFi with cached images. Real customers are on mobile data.

**Consequences:**
- Bounce rate near 100% for mobile visitors on slow connections
- Core Web Vitals (LCP) fails → poor Google ranking
- Product photos are the entire sales pitch — if they don't load, nothing works

**Prevention:**
- Resize all product images to max 1200px width (sufficient for mobile screens, 2x density for retina)
- Export as WebP format with quality 75–85; fall back to JPEG for older Safari
- Target file size: under 150KB per image
- Use `<img loading="lazy">` for images below the fold
- Use `srcset` for responsive sizes: `srcset="img-600.webp 600w, img-1200.webp 1200w"`
- Use CSS `aspect-ratio` on image containers to prevent layout shift (CLS)
- Tools: Squoosh (free, browser-based), ImageOptim (Mac), or `sharp` CLI

**Detection (warning signs):**
- File size over 500KB for any single product image
- PageSpeed Insights (mobile) score below 70
- LCP over 4 seconds

**Phase mapping:** Address in Phase 1 (image preparation) before any deployment. Renaming and optimizing images should happen before they're referenced in HTML.

---

### Pitfall 4: GDPR Non-Compliance for Czech Market — Personal Data in Emails

**What goes wrong:** The order form collects name, email, and delivery address. This personal data is transmitted via EmailJS (US company) and stored in Míša's email inbox. Without a privacy notice, this violates GDPR — even for a one-person informal business in Czech Republic.

**Why it happens:** "I'm not a real business yet" — but GDPR applies to anyone who processes personal data of EU residents, regardless of business registration status. Unawareness is not a defense.

**Consequences:**
- UOOU (Czech data protection authority) can fine individuals, not just companies
- EmailJS transmits data to US servers — requires data processing transparency
- Customers asking "what do you do with my data?" with no answer is a trust issue

**Prevention:**
- Add a minimal privacy notice paragraph on the page (not a full cookie banner — the project explicitly has no tracking cookies)
- Required disclosures: who collects data (Míša's name/contact), what data (name, email, address), why (to process the order), how long kept (until order is fulfilled), EmailJS as a processor (with link to their privacy policy)
- Add a required checkbox on the order form: "Souhlasím se zpracováním osobních údajů za účelem vyřízení objednávky" (unchecked by default)
- This is NOT a cookie banner — no analytics, no tracking → no cookie consent needed per the project scope
- Note: PROJECT.md says "Cookie banner — web nesleduje návštěvníky" — correct, but GDPR for order data still applies

**Detection (warning signs):**
- Order form has no mention of data usage
- No privacy policy link anywhere on the page
- Form can be submitted without any data processing acknowledgment

**Phase mapping:** Address in Phase 1 (form implementation) — add the checkbox and privacy text at the same time as the form, not as a post-launch fix.

---

## Moderate Pitfalls

---

### Pitfall 5: 3+1 Promotion Logic Incorrectly Calculated

**What goes wrong:** The "buy 3, get 1 free" promotion is applied incorrectly — either: (a) applied per product type (3 kopretina = 1 free kopretina) instead of across the whole cart total, or (b) applied multiple times for 6 items (2 free) when it should only apply once per 3 items, or (c) shown in UI but not actually deducted from the total.

**Why it happens:** Informal description "3+1 zdarma" is ambiguous. Does it mean: for every 3 items you add 1 free? For every 4 items one is free? Mixed motifs count? Cheapest item is free?

**Consequences:**
- Customers expect a discount they don't get → angry messages to Míša
- Míša manually adjusts prices creating inconsistency
- Trust damage

**Prevention:**
- Clarify the exact rule with Míša before writing a single line of cart logic: "For every 3 paid items, what exactly is free? The cheapest? The 4th item added? Same product type or any?"
- Document the agreed rule as a code comment
- Implement as a pure function that takes `cartItems[]` and returns `totalAfterDiscount` — easy to unit test
- Show the discount as a separate line item in the cart UI ("Akce 3+1: -380 Kč") not just a reduced total

**Detection (warning signs):**
- Cart shows "3+1 akce" but discount amount is 0 or wrong
- Adding 6 items gives 2 free instead of 1 (or vice versa)
- Promotion applies to carts of any size

**Phase mapping:** Clarify rule before Phase 1 implementation; test edge cases (1, 2, 3, 4, 5, 6, 7 items) before shipping.

---

### Pitfall 6: EmailJS Template Missing Required Order Fields

**What goes wrong:** The EmailJS email template is set up once and then forgotten. When the order form gains new fields (or the template uses wrong variable names), emails arrive with empty fields or [undefined]. Míša receives "Order from: undefined" with no address.

**Why it happens:** EmailJS templates use `{{variable_name}}` syntax matched to JavaScript parameter names. A typo in either place silently sends blank fields.

**Consequences:**
- Míša cannot fulfill orders (missing address, unclear what was ordered)
- Customer gets a confirmation email with garbled content
- Manual follow-up required, defeating the purpose of automation

**Prevention:**
- Create EmailJS templates with ALL required fields before writing any JavaScript: customer name, email, phone (if collected), delivery address, ordered items (formatted list), total amount including discount
- Test the template by sending a manual test email from the EmailJS dashboard before wiring up JavaScript
- Log the `emailjs.send()` response to console during development to catch errors
- Keep the template variable names simple and match them exactly in the JS `templateParams` object

**Detection (warning signs):**
- Test order email has "[undefined]" or blank sections
- EmailJS dashboard shows 200 status (sent) but email looks wrong
- Form submits without error but Míša reports empty emails

**Phase mapping:** Phase 1 — create and test both email templates (customer confirmation + Míša notification) before connecting the form.

---

### Pitfall 7: GitHub Pages Deployment Gotchas — Paths and Cache

**What goes wrong:** Several GitHub Pages-specific issues catch developers off-guard:
1. **Base path issues:** If the repo is named anything other than `[username].github.io`, the site deploys to `[username].github.io/[repo-name]/`. All absolute paths (`/fotky/img.jpg`) break. Relative paths (`./fotky/img.jpg`) work.
2. **404 on reload:** Single-page apps with client-side routing break on reload (GitHub Pages returns 404). Not applicable if the project is a true single HTML file.
3. **Cache headers:** GitHub Pages sets aggressive cache headers. After deploying an update, visitors see stale CSS/JS for hours. No way to control this without cache-busting query strings.

**Prevention:**
- Use relative paths for ALL assets (images, CSS, JS, fonts)
- Add cache-busting to CSS/JS links: `<link rel="stylesheet" href="style.css?v=2">` — bump the version on each deploy
- Keep it a genuine single-page site (one `index.html`) — no routing needed, no 404 problem
- Decide repo name before building: name it `misiksvet` (deploys to `/misiksvet/`) or use a custom domain with CNAME

**Detection (warning signs):**
- Images work locally but 404 on GitHub Pages
- After deploying CSS change, visitors still see old styles
- The site URL has an unexpected path prefix

**Phase mapping:** Phase 1 (deployment setup) — decide and test the GitHub Pages config before adding any content.

---

### Pitfall 8: Mobile Touch Targets Too Small — Form and Cart Controls

**What goes wrong:** Quantity increment/decrement buttons (`+` / `-`) in the cart, the submit button, and the "Add to cart" buttons are sized for desktop mouse clicks (16–24px). On mobile with thumbs, these are impossible to hit accurately, especially the `-` button next to a product image.

**Why it happens:** Developer tests with browser DevTools responsive mode but uses a mouse, not a real touchscreen. Desktop-sized click targets feel fine.

**Consequences:**
- Mobile users accidentally increment/decrement wrong items
- Frustration leads to abandonment
- Primary audience (Instagram → mobile) has the worst experience

**Prevention:**
- Minimum touch target: 44x44px (Apple HIG) or 48x48dp (Material Design / Google)
- The visual element can be smaller, but the clickable `padding` must make the total tappable area ≥ 44px
- Test on a real phone, not just browser DevTools, before declaring done
- Cart quantity controls: consider large `+` and `-` buttons with the quantity displayed between them in a clear font
- Use `min-height: 48px; min-width: 48px` with `display: flex; align-items: center; justify-content: center;` on interactive elements

**Detection (warning signs):**
- Buttons are less than 44px in any dimension including padding
- On real phone, fingers miss buttons regularly
- Google Lighthouse accessibility audit flags small tap targets

**Phase mapping:** Phase 1 (CSS/component design) — set the touch target standard upfront as a CSS variable or rule, not per-component later.

---

### Pitfall 9: Czech Typography and Encoding Errors

**What goes wrong:** Czech text requires proper diacritics (á, č, ě, í, ó, ř, š, ú, ů, ž) and typographic rules. Common failures:
1. `<meta charset="UTF-8">` missing → garbled Czech characters in some browsers
2. Non-breaking spaces missing after single-letter prepositions (`v`, `s`, `k`, `z`, `a`, `i`, `o`, `u`) — required by Czech typographic rules and affects readability
3. Apostrophes (`'`) used instead of proper Czech quotation marks (`„"`) — looks unprofessional
4. Month names in Czech are lowercase (`března`, not `Března`)

**Prevention:**
- First line in `<head>`: `<meta charset="UTF-8">`
- Use `&nbsp;` or the Unicode non-breaking space (`\u00A0`) after single-letter prepositions
- Proofread all Czech text with a native speaker (Míša should review all copy)
- Use proper Czech quotation marks in product descriptions

**Detection (warning signs):**
- Characters like `Ä`, `Å¡`, `Ä` appear instead of Czech letters → charset missing
- Single-letter prepositions appear at end of lines
- Project name "Mišik svět" renders correctly only confirms UTF-8 but doesn't guarantee all text is correct

**Phase mapping:** Phase 1 (HTML scaffold) — add charset declaration as the very first action. Czech copy review before launch.

---

### Pitfall 10: Form Submission UX — Double Submits and Missing Feedback

**What goes wrong:** After the customer clicks "Odeslat objednávku":
1. No visual feedback → customer clicks again → duplicate orders sent
2. EmailJS `send()` is async; UI doesn't wait → customer sees nothing for 2-3 seconds then nothing
3. On success, form doesn't clear → customer is unsure if it worked
4. On failure (network error, quota exceeded), no error message → customer assumes it worked but Míša never receives the order

**Prevention:**
- Disable the submit button immediately on click, change text to "Odesílám..."
- Show a visible loading state (spinner or text change)
- On `emailjs.send()` success: clear the form, clear the cart, show a prominent success message ("Objednávka odeslána! Míša vás brzy kontaktuje.")
- On failure: re-enable the button, show a clear error message with fallback contact (Instagram or email)
- Never silently fail — the customer MUST know if something went wrong

**Detection (warning signs):**
- Submit button remains active after click
- No success/error message after submission
- Duplicate test emails arriving in inbox

**Phase mapping:** Phase 1 (form + EmailJS integration) — build success/error handling before testing, not after.

---

## Minor Pitfalls

---

### Pitfall 11: Open Graph / Meta Tags Not Tested With Social Previews

**What goes wrong:** Open Graph tags (`og:image`, `og:title`, `og:description`) are added to HTML but never tested. When Míša shares the link on Instagram or in a WhatsApp message, the preview shows the wrong image (or no image), wrong title, or truncated description. Since Instagram is the primary traffic source, this is the first impression many customers see.

**Prevention:**
- Test with Facebook Sharing Debugger (free tool) after deploying to GitHub Pages
- `og:image` must be an absolute URL (e.g., `https://misiksvet.github.io/web/fotky/cover.jpg`), not a relative path
- Image must be at least 1200x630px for proper social preview
- Use one of the best product photos as the OG image

**Phase mapping:** Phase 1 (HTML scaffold + deployment) — add OG tags early and test with the debugger before announcing the site.

---

### Pitfall 12: EmailJS Free Tier Quota With No Monitoring

**What goes wrong:** The free tier allows 200 emails/month. No automatic alerts exist when approaching the limit. If quota is exhausted mid-month, orders silently fail to send — Míša doesn't know, customers think their order was placed.

**Prevention:**
- EmailJS dashboard shows monthly usage — check it weekly or after any promotion/spike
- Add a note in operational documentation: "Check EmailJS quota at start of each month"
- If business grows, upgrade plan (paid plans start at ~$15/month for 1000 emails)
- Consider adding a fallback `mailto:` link in the order confirmation page as a safety net

**Phase mapping:** Post-launch operational concern; document the monitoring step in the project README.

---

### Pitfall 13: Cormorant Garamond + Josefin Sans Font Loading Performance

**What goes wrong:** Loading two Google Fonts families with multiple weights and the `@import` CSS method blocks rendering. The page appears unstyled for the first 1-2 seconds on slow connections — called Flash of Unstyled Text (FOUT) or Flash of Invisible Text (FOIT).

**Prevention:**
- Use `<link rel="preconnect" href="https://fonts.googleapis.com">` in `<head>` before the font link
- Add `&display=swap` to the Google Fonts URL: ensures text is visible immediately in fallback font, swaps when loaded
- Load only the weights actually used (e.g., Cormorant Garamond 400 + 600 italic; Josefin Sans 300 + 400)
- Define CSS `font-family` stacks with good fallbacks: `'Cormorant Garamond', Georgia, serif` and `'Josefin Sans', Arial, sans-serif`

**Phase mapping:** Phase 1 (CSS foundation) — set up fonts correctly from the start.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| EmailJS setup | Public key in committed JS file | Configure allowed origins in EmailJS dashboard before first deploy |
| Cart implementation | State lost on refresh | Implement localStorage persistence from line 1 of cart code |
| Image preparation | Raw camera photos (3-8MB) used directly | Optimize all images before first commit: WebP, max 1200px, <150KB |
| Form + EmailJS integration | No error handling, duplicate submissions | Build submit-disable, loading state, success/error feedback before testing |
| GDPR checkbox | Added as afterthought post-launch | Include checkbox and privacy text in the initial form HTML |
| GitHub Pages deploy | Absolute paths breaking on subdomain | Audit all asset references for relative paths before first push |
| 3+1 promo logic | Ambiguous rule → wrong calculation | Clarify exact rule with Míša in writing before coding |
| Mobile testing | DevTools only, no real device | Test on actual phone (Android + iOS) before announcing launch |
| Czech copy | Missing diacritics, charset issues | `<meta charset="UTF-8">` as first tag; native speaker review of all text |
| Social sharing | OG image uses relative URL | Test with Facebook Sharing Debugger post-deploy |

---

## Sources

**Confidence levels:**

- EmailJS public key / security model: MEDIUM confidence (training data through August 2025; EmailJS documentation consistently states public key is client-side by design, security via domain allowlisting — web verification unavailable during this session)
- localStorage cart persistence: HIGH confidence (standard web platform API, widely documented)
- GitHub Pages path behavior: HIGH confidence (well-documented, consistent behavior)
- Image optimization thresholds: HIGH confidence (Core Web Vitals documentation, standard practice)
- GDPR for Czech market / UOOU: MEDIUM confidence (general GDPR knowledge; specific Czech enforcement patterns from training data)
- Touch target sizing (44px / 48px): HIGH confidence (Apple HIG and Material Design specifications are authoritative and stable)
- EmailJS free tier limit (200/month): MEDIUM confidence (training data; verify at emailjs.com/pricing as tiers change)
- Czech typography rules: HIGH confidence (standard Czech language guidelines)

**Reference sources (verify current):**
- EmailJS documentation: https://www.emailjs.com/docs/
- EmailJS security FAQ: https://www.emailjs.com/docs/faq/
- GitHub Pages documentation: https://docs.github.com/en/pages
- GDPR compliance for small businesses (Czech): https://www.uoou.cz/
- Core Web Vitals: https://web.dev/vitals/
- Apple Human Interface Guidelines — touch targets: https://developer.apple.com/design/human-interface-guidelines/
- Google Fonts performance best practices: https://developers.google.com/fonts/docs/getting_started
