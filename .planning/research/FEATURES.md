# Feature Landscape

**Domain:** Small artisan handmade product landing page with simple cart — Czech market
**Researched:** 2026-03-04
**Confidence note:** Based on PROJECT.md context + domain knowledge of artisan e-commerce, Czech payment norms, and Instagram-to-web conversion patterns. External search tools unavailable during this session; marked confidence accordingly.

---

## Table Stakes

Features users expect on arrival from Instagram. Missing any of these = users leave or message Míša on Instagram instead (which defeats the site's purpose).

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Product photos — large, high quality | Instagram users arrive with visual expectations; they've already seen photos but need to confirm quality up close | Low | Already have 8 photos in `/fotky/`; main work is layout |
| Product name + short description | Users need to know what they're ordering (material, size, care) — linen has specific properties worth stating | Low | 3 motifs: kopretina, vlčí mák, šiška s větvičkou |
| Price displayed prominently | Czech buyers are price-sensitive; hiding price creates friction and distrust | Low | 380 Kč/ks — must be visible without scrolling on mobile |
| 3+1 promotion clearly explained | This is the main buying incentive; if it's buried, conversion drops | Low | "Kup 3, čtvrtou dostaneš zdarma" — must be near cart/product |
| Add to cart / quantity selector | Core shopping action; without this the site is just a lookbook | Medium | Simple +/- controls; mobile-friendly tap targets (min 44px) |
| Cart summary with running total | User needs to see what they've selected and the total before committing | Medium | Live update; must recalculate 3+1 discount in real time |
| Order form (name, email, address) | Checkout; the entire purpose of the site | Medium | Must feel safe and professional for trust |
| Confirmation of order sent | Without feedback, users don't know if it worked — they'll message on Instagram | Low | On-page success message + email confirmation |
| Mobile-first layout | Instagram audience is nearly 100% mobile at first visit; desktop is secondary | Medium | Touch targets, readable font sizes, no hover-only interactions |
| Contact/seller info | Establishes trust and humanity for a personal brand — who is making this? | Low | Brief "O mně" section; Instagram handle link |

---

## Differentiators

Features that set this brand apart from generic e-shops. Not universally expected, but highly valued for handmade/artisan brand positioning.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Personal brand storytelling | Handmade buyers pay a premium when they feel connected to the maker; "maminka na rodičovské" is a compelling, authentic hook | Low | 2-3 sentences with photo of Míša or her hands at work; converts better than faceless shops |
| Handmade process transparency | Show that these are genuinely hand-embroidered — differentiates from printed/mass-produced; builds trust in price | Low | Could be a single sentence + close-up photo of embroidery detail |
| Scandinavian aesthetic consistency | Matches Instagram feed; signals taste and intentionality; premium feel without premium price | Low | Already planned: béžová/krémová/hnědá, Cormorant Garamond + Josefin Sans |
| QR payment explanation | Czech buyers are very familiar with QR platba (ČNB standard); explaining the payment flow upfront removes the biggest barrier to checkout for buyers unfamiliar with non-gateway shops | Low | Short line: "Po odeslání objednávky dostanete platební QR kód" near form |
| Gift framing for 3+1 | Frame the 4th towel as a gift, not a discount — emotionally resonant for a handmade brand, matches gift-giving use case | Low | Word choice matters: "čtvrtou jako dárek" not "sleva 25%" |
| Fast mobile order flow | Instagram users have short attention spans; if checkout takes more than 3 taps + form fill, conversion drops sharply | Medium | Sticky cart summary or visible cart icon; no multi-page checkout |
| Czech-native copy with correct diacritics | Immediately signals "this is a real Czech person, not a template shop" — builds trust in the personal brand | Low | Already specified in PROJECT.md: diakritika, nezlomitelné mezery |
| Open Graph / link preview | When shared on Instagram Stories or WhatsApp, the link unfurls with product image and brand name — free organic reach amplification | Low | `og:image`, `og:title`, `og:description` — one-time setup |

---

## Anti-Features

Features to explicitly NOT build for this phase. Each one adds complexity, cost, or maintenance burden that is not justified at this scale.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Payment gateway (Stripe, GoPay, Comgate) | Requires živnostenský list (Míša doesn't have one yet); adds monthly fees, PCI compliance surface, and integration complexity | Manual QR platba / bank transfer; add gateway when živnost is registered |
| User accounts / login | No purchase history to show; adds password management, security surface, and cookie/GDPR scope; zero benefit at this scale | Anonymous order form is enough |
| Inventory / stock management | 3 product SKUs; Míša knows her stock personally | Míša tracks manually; "vyprodáno" can be a quick CSS class on the card if needed |
| Admin panel / CMS | Would require a backend, database, or a SaaS subscription — incompatible with GitHub Pages static hosting | Edit HTML directly when products change (rare) |
| Cookie consent banner | Web doesn't track users (no analytics cookies, no ad pixels) — GDPR does not require a banner if you don't set non-essential cookies | Don't add analytics in Phase 1; if added later, use cookie-free analytics (e.g., Plausible) |
| Wishlist / save for later | Adds persistent state complexity; Instagram audience buys or doesn't; wishlists are for large catalogs | Not needed for 3 SKUs |
| Product filtering / search | 3 products; filtering is absurd overhead | Let users scroll; visual card layout is navigation enough |
| Multi-language version | Czech-only audience; Instagram followers are local; translation adds content maintenance burden | Czech only |
| Reviews / ratings system | Requires moderation, database, and social proof content that doesn't yet exist; could add static testimonials later | Collect via Instagram DMs; manually add 2-3 quotes as static HTML if desired |
| Newsletter / email list | Adds GDPR consent checkbox, unsubscribe flow, mailing service subscription | Instagram already serves as the communication channel; link to Instagram from site |

---

## Feature Dependencies

```
Product photos (good quality) → Brand credibility → Order form conversion

Cart quantity controls → Running total → 3+1 discount calculation → Order summary

Order form submit → EmailJS send → Customer confirmation email
                                 → Míša notification email

Open Graph tags → Instagram/WhatsApp link preview → Organic sharing amplification
```

---

## Mobile-First Specifics

Czech Instagram audience arrives almost exclusively on mobile (iOS and Android). Key UX constraints:

| Concern | Requirement | Note |
|---------|-------------|------|
| Tap targets | Min 44x44px for all interactive controls | +/- quantity buttons are the most common failure point |
| Font sizes | Min 16px body text to prevent iOS auto-zoom on form inputs | Form inputs especially must be ≥ 16px |
| Cart visibility | Cart state must be visible without scrolling (sticky header or visible counter) | Users abandon if they can't confirm cart contents |
| Form fields | Large inputs, native date/number pickers where possible | Avoid custom dropdowns that fight mobile keyboards |
| Images | Lazy load below fold; WebP format; responsive `srcset` | Instagram users expect fast-loading images |
| Single column layout | All content in one column on mobile; no side-by-side product cards on small screens | 2-column grid ok at 480px+ |

---

## Czech Market Specifics

| Feature / Norm | Czech-Specific Detail | Implementation |
|----------------|----------------------|----------------|
| QR platba | Czech National Bank standardized QR code format; buyers under 40 use this natively via banking apps | Explain in order confirmation email; display static example in FAQ or payment info section |
| Bankovní převod | Still expected as alternative; older buyers prefer it | Include IBAN + VS (variabilní symbol = order number or name) in confirmation |
| Doručení poštou / Zásilkovna | Buyers will ask about shipping; clarify upfront | State shipping cost and carrier in product/cart area (e.g., "Doprava Zásilkovna 79 Kč") |
| Czech SEO basics | Correct Czech meta title/description; structured data not critical at this scale | `<title>` and `<meta name="description">` in Czech; include location if relevant (e.g., "Praha") |
| GDPR / personal data | Order form collects name, email, address — must include brief privacy notice and data processing statement | One sentence near form: "Vaše údaje použijeme pouze pro vyřízení objednávky" + odkaz na zpracování |
| Spotřebitelské právo | Czech consumer law requires 14-day return right for distance sales; must be stated | Brief legal notice: "Máte právo odstoupit od smlouvy do 14 dní" — one line in footer suffices for now |

---

## MVP Recommendation

Prioritize for Phase 1 (the entire site is essentially MVP):

1. Product gallery with photos, names, prices (table stakes)
2. Cart with quantity controls and 3+1 calculation (table stakes)
3. Order form with EmailJS confirmation (table stakes)
4. Mobile-first layout (table stakes — audience is Instagram)
5. Personal brand story section (strongest differentiator for conversion)
6. QR payment explanation near checkout (Czech market differentiator)
7. Open Graph tags for link sharing (low effort, high leverage)

Defer to post-launch:
- Static testimonials — collect real ones first via Instagram DMs, add as static HTML later
- Shipping cost display — confirm carrier/cost with Míša before hardcoding
- Cookie-free analytics (Plausible) — useful eventually, not needed to launch

---

## Sources

**Confidence levels:**

| Claim | Confidence | Basis |
|-------|------------|-------|
| Czech QR platba prevalence | HIGH | Established ČNB standard; widely used by all major Czech banks as of 2024 |
| Instagram audience = mobile-first | HIGH | Platform design is mobile-native; this is not in question |
| 44px minimum tap targets | HIGH | Apple HIG and Google Material guidelines, both longstanding |
| 14-day return right Czech consumer law | HIGH | Established in Czech law (§ 1829 OZ / zákon č. 89/2012 Sb.) for distance contracts |
| GDPR notice requirement | HIGH | EU GDPR Article 13 — disclosure required at point of data collection |
| Artisan buyer conversion via personal story | MEDIUM | Industry consensus in DTC/Etsy seller communities; not independently verified via search this session |
| 3+1 gift framing vs. discount framing | MEDIUM | Behavioral economics principle (loss aversion / gift salience); well-documented but not verified via search this session |

*External search tools were unavailable during this research session. Claims are based on established standards, Czech law, and domain knowledge of artisan e-commerce patterns. Critical legal claims (GDPR, consumer law) should be validated with a Czech legal source before launch.*
