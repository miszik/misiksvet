---
phase: 05-kosik-a-objednavky-a-kontaktni-formular
plan: 03
subsystem: ui
tags: [emailjs, packeta, zasilkovna, form-validation, vanilla-js]

# Dependency graph
requires:
  - phase: 05-02
    provides: loadCart, calcTotal, clearCart globals z cart.js
  - phase: 05-01
    provides: HTML struktury, order-form, packeta-section, home-delivery-section selektory; emailjs CDN init v head

provides:
  - js/order.js: validateForm, handleDeliveryChange, openPacketaWidget, handleFormSubmit, formatCartSummary, initOrderForm jako plain globals
  - initOrderForm() registrovano v main.js DOMContentLoaded entry pointu
  - Ceske validacni hlasky pro vsechna povinne pole formulare
  - Packeta widget integrace s modalem pro vyber vydejna bodu
  - EmailJS dvou-emailova integrace: notifikace vlastnika + potvrzeni zakaznikovi
affects:
  - 05-04 (checkpoint plan) ktery verifikuje browser funkcnost

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Formularova validace pres novalidate + setCustomValidity() + reportValidity() pro native browser validacni bubliny s vlastnim textem"
    - "emailjs.send() s rucne sestavenym params objektem (ne sendForm) — cart_summary je JS-computed string"
    - "e.preventDefault() vzdy jako prvni radek submit handleru — kriticke pro GitHub Pages (bez server-side handling)"

key-files:
  created:
    - js/order.js
  modified:
    - js/main.js

key-decisions:
  - "emailjs.send() volan dvakrat (owner first, customer second) — owner notification ma prioritu kdyby druhý send selhal"
  - "Submit tlacitko zusatva deaktivovane po uspesnem odeslani — zabranna duplicitnich objednavek"
  - "Re-aktivace tlacitka POUZE pri chybe — uzivatel muze zkusit znovu bez page reload"
  - "handleDeliveryChange cisti home_address a selectedPickupPoint pri prepnuti — ciste EmailJS params bez ghost hodnot"
  - "validateForm vola loadCart() pro kontrolu prazdneho kosiku — objednavku nelze odeslat bez produktu"

patterns-established:
  - "Podminena validace: home_address validovana pouze kdyz delivery === 'packeta-domu'"
  - "Packeta bod ulozen v module-level promenne selectedPickupPoint — sdileny stav mezi widget callback a form submit"
  - "Chybove zpravy zobrazeny pres showFieldError/hideFieldError helpers s hidden atributem"

requirements-completed: [ORDER-01, ORDER-02, ORDER-03, ORDER-04, ORDER-05, ORDER-06, ORDER-07, ORDER-08, ORDER-09, ORDER-10, EMAIL-01, EMAIL-02, EMAIL-03]

# Metrics
duration: 2min
completed: 2026-03-04
---

# Phase 5 Plan 03: Formularova validace, Packeta widget a EmailJS dvou-emailova integrace Summary

**Objednavkovy formular s ceskou validaci, Packeta widget modalem a emailjs.send() pro notifikaci vlastnika i potvrzeni zakaznikovi — posledni JS vrstva pred browser verifikaci**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-04T19:26:06Z
- **Completed:** 2026-03-04T19:28:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- js/order.js vytvoreno se vsemi 6 pozadovanymi plain-global funkcemi
- Packeta widget integrace s modalem, callbackem a zobrazenim vybrane pobocky
- EmailJS dvou-emailova integrace: owner notification + customer confirmation pres rucne sestaveny params objekt
- Ceske validacni hlasky pro vsechna pole vcetne podminenych (home_address, packeta vyber, prazdny kosik)
- main.js aktualizovan — initOrderForm() pridano jako ctvrte volani v DOMContentLoaded

## Task Commits

Each task was committed atomically:

1. **Task 1: Vytvorit js/order.js — validace, Packeta widget, EmailJS send** - `ae5bf11` (feat)
2. **Task 2: Aktualizovat js/main.js — pridat initOrderForm() volani** - `7bb9dd8` (feat)

**Plan metadata:** (docs commit — viz nize)

## Files Created/Modified
- `js/order.js` - Objednavkovy formular: openPacketaWidget, handleDeliveryChange, validateForm, formatCartSummary, handleFormSubmit, initOrderForm
- `js/main.js` - Pridano initOrderForm() volani, odebran placeholder komentar

## Decisions Made
- emailjs.send() volan dvakrat sequentially: owner first, customer second — owner notification ma prioritu
- Submit tlacitko zusatva deaktivovane po uspesnem odeslani (zabranna duplicit), re-aktivuje se pouze pri chybe
- Packeta vydejna validace zobrazuje inline error pres showFieldError() helper (ne browser bublinu)
- Prazdny kosik validovan v handleFormSubmit pres loadCart() — user-friendly error bez browser bubliny

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None — oba soubory vytvoreny/modifikovany dle specifikace, vsechny verifikace prosly.

## User Setup Required
**Externi sluzby vyzaduji manualni konfiguraci pred nasazenim:**

### EmailJS
1. Registrovat ucet na emailjs.com
2. Pridat email sluzbu (Gmail nebo Seznam) v EmailJS Dashboard -> Email Services
3. Vytvorit sablonu `customer_confirmation` pro zakaznika
4. Vytvorit sablonu `owner_notification` pro Misu
5. Nastavit Allowed Origins na `https://misiksvet.cz` v Account -> Security
6. Doplnit do `js/order.js`:
   - `EMAILJS_SERVICE_ID` (EmailJS Dashboard -> Email Services -> Service ID)
   - `EMAILJS_CUSTOMER_TEMPLATE` (template ID pro customer_confirmation)
   - `EMAILJS_OWNER_TEMPLATE` (template ID pro owner_notification)

### Packeta/Zasilkovna
1. Registrovat ucet na client.packeta.com nebo kontaktovat info@zasilkovna.cz pro testovaci klic
2. Doplnit `PACKETA_API_KEY` do `js/order.js`

### EmailJS Public Key
- Uz inicializovano v `index.html <head>` z Planu 01 s placeholderem `YOUR_EMAILJS_PUBLIC_KEY`
- Doplnit v EmailJS Dashboard -> Account -> Public Key

## Next Phase Readiness
- Vsechna JS funkcnost hotova: products.js, cart.js, order.js, main.js
- Phase 5 Plan 04 (checkpoint) pripravena pro browser verifikaci celeho objednavkoveho flow
- Pred live nasazenim: doplnit EmailJS klice a Packeta API klic, nastavit Allowed Origins

---
*Phase: 05-kosik-a-objednavky-a-kontaktni-formular*
*Completed: 2026-03-04*

## Self-Check: PASSED

- FOUND: js/order.js
- FOUND: js/main.js
- FOUND: .planning/phases/05-kosik-a-objednavky-a-kontaktni-formular/05-03-SUMMARY.md
- FOUND commit: ae5bf11 (feat(05-03): vytvorit js/order.js)
- FOUND commit: 7bb9dd8 (feat(05-03): aktualizovat js/main.js)
