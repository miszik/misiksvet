---
phase: 05-kosik-a-objednavky-a-kontaktni-formular
plan: 01
subsystem: ui
tags: [emailjs, packeta, cart, order-form, html, css, vanilla-js]

# Dependency graph
requires:
  - phase: 01-zaklad-a-zobrazeni-produktu
    provides: index.html zakladni struktura, css/style.css design tokeny, js/products.js produktova data

provides:
  - HTML kontrakt pro cart.js (cart-drawer, cart-overlay, cart-nav-btn, cart-items, cart-total, cart-discount)
  - HTML kontrakt pro order.js (order-form, full_name, email, phone, delivery, packeta-section, home-delivery-section, gdpr, submit-btn, form-success, form-error)
  - EmailJS CDN inicializace v <head> s placeholderem pro public key
  - Packeta widget CDN synchronne nacten pred cart.js/order.js
  - CSS styly pro cart drawer (translateX animace, overlay, polozky, footer)
  - CSS styly pro order form (form-group, inputy, select, textarea, checkbox, stavove zpravy)
  - products.js s polem type pro promo logiku akce 3+1

affects:
  - 05-02 (cart.js — pouziva vsechny cart-* HTML selektor y definovane zde)
  - 05-03 (order.js — pouziva vsechny order-form HTML selektory definovane zde)

# Tech tracking
tech-stack:
  added:
    - EmailJS browser@4 (CDN, inicializace s placeholderem publicKey)
    - Packeta widget v6 (CDN, synchronni load)
  patterns:
    - CDN scripty v <head> (EmailJS) + konci <body> synchronne (Packeta) pred application JS
    - HTML kontrakt nejdrive — JS logika az v nasledujicich planech
    - CSS pridavano na konec existujiciho souboru (bez prepisu)

key-files:
  created: []
  modified:
    - index.html
    - css/style.css
    - js/products.js

key-decisions:
  - "EmailJS CDN v <head> — musi byt inicializovan pred cart.js a order.js (tyto scripty ho pouzivaji)"
  - "Packeta widget sync (bez defer/async) v <body> pred order.js — required by Packeta API"
  - ".btn--secondary pridano do style.css (nebyl v puvodnim design systemu) — potreba pro Packeta 'Vybrat vydejna' tlacitko"
  - "placeholder YOUR_EMAILJS_PUBLIC_KEY ponechan — Misa doda klic pozdeji pred nasazenim"

patterns-established:
  - "HTML-first pattern: vsechny selektory definovany v Plan 01 pred jakymkoli JS"
  - "Script load order: EmailJS (head) → Packeta sync (body) → products.js → cart.js → order.js → main.js"

requirements-completed: [CART-01, CART-05, CART-06, CART-07, ORDER-01, ORDER-02, ORDER-03, ORDER-04, ORDER-05, ORDER-06, ORDER-07, ORDER-08, ORDER-09, ORDER-10, EMAIL-03]

# Metrics
duration: 3min
completed: 2026-03-04
---

# Phase 5 Plan 01: HTML/CSS Scaffold pro Kosik a Objednavky Summary

**HTML/CSS scaffold s EmailJS + Packeta CDN integraci, cart drawer strukturou a kompletnim order formularem pro Plans 02 a 03**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-04T19:14:30Z
- **Completed:** 2026-03-04T19:17:17Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Kompletni HTML kontrakt pro cart.js (Plan 02): cart-drawer, cart-overlay, cart-nav-btn s SVG ikonou a odznakem
- Kompletni HTML kontrakt pro order.js (Plan 03): order-form se vsemi povinnymi poli, podminenou sekci pro Packeta a home-delivery
- CDN scripty ve spravnem poradi: EmailJS v head, Packeta synchronne v body pred cart.js/order.js
- CSS styly pro cart drawer (translateX slide animace, overlay) a order form (form-group, stavove zpravy)
- products.js rozsiren o pole type ('uterka'/'zastera') pro promo logiku akce 3+1 v Plan 02

## Task Commits

Each task was committed atomically:

1. **Task 1: CDN scripty, cart ikona v nav, cart drawer HTML, script load order** - `ea30615` (feat)
2. **Task 2: CSS styly pro cart drawer, formular, stavove zpravy + type pole v products.js** - `f6ee8f3` (feat)

**Plan metadata:** committed with docs commit below

## Files Created/Modified

- `index.html` - EmailJS CDN v head, cart tlacitko v nav, cart drawer po nav, kompletni order form v #kontakt, spravny script load order
- `css/style.css` - Phase 5 sekce: cart drawer CSS (translateX, overlay, items, footer), order form CSS (form-group, inputs, checkbox, form-error, form-success), btn--secondary
- `js/products.js` - type pole pridano ke kazdemu produktu (uterka/zastera)

## Decisions Made

- EmailJS CDN umisten do `<head>` (musi byt inicializovan drive nez cart.js a order.js ho zavola)
- Packeta widget nacten synchronne (bez defer/async) v `<body>` pred ostatnimi scripty — required by Packeta API
- `.btn--secondary` pridano do CSS — nebyl v puvodnim design systemu, ale potrebny pro Packeta "Vybrat vydejna" tlacitko
- Placeholder `YOUR_EMAILJS_PUBLIC_KEY` ponechan v kodu — Misa doda real klic pred nasazenim (viz blocker v STATE.md)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Pridano .btn--secondary CSS**
- **Found during:** Task 2 (CSS styly)
- **Issue:** index.html obsahuje `class="btn btn--secondary"` na Packeta tlacitku, ale .btn--secondary nebyl v puvodnim design systemu ani v plan specifikaci CSS
- **Fix:** Pridano .btn--secondary (transparent background, border var(--color-brown)) a hover stav na konec style.css
- **Files modified:** css/style.css
- **Verification:** Trida existuje v CSS, konzistentni s design systemy (pouziva color tokeny)
- **Committed in:** f6ee8f3 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 2 - missing critical CSS class)
**Impact on plan:** Auto-fix nutny pro spravne zobrazeni Packeta tlacitka. Zadny scope creep.

## Issues Encountered

- Node.js bash escape problem pri spousteni inline verifikace s `!` — reseno vytvorenim docasnych .cjs souboru (odstraneny po verifikaci)

## User Setup Required

None - zadna externi sluzba neni konfigurována v tomto planu (EmailJS klice budou v Plan 03, Packeta credentials v Plan 03).

## Next Phase Readiness

- Plan 02 (cart.js): Vsechny HTML selektory pripraveny — `#cart-nav-btn`, `#cart-drawer`, `#cart-overlay`, `#cart-items`, `.cart-total`, `.cart-discount`, `.cart-drawer__close`, `.cart-checkout-btn`, `.cart-count`
- Plan 03 (order.js): Vsechny HTML selektory pripraveny — `#order-form`, `#full_name`, `#email`, `#phone`, `#delivery`, `#packeta-section`, `#packeta-open-btn`, `#packeta-selected-name`, `#packeta-error`, `#home-delivery-section`, `#home_address`, `#note`, `[name="gdpr"]`, `#cart-error`, `#submit-btn`, `#form-success`, `#form-error`
- Blocker stale plati: EmailJS public key a sablony musi byt vytvoreny pred Plan 03 live testem

---
*Phase: 05-kosik-a-objednavky-a-kontaktni-formular*
*Completed: 2026-03-04*
