---
phase: 05-kosik-a-objednavky-a-kontaktni-formular
plan: 02
subsystem: ui
tags: [cart, localStorage, promo, vanilla-js, drawer]

# Dependency graph
requires:
  - phase: 05-01
    provides: HTML/CSS scaffold pro cart drawer, nav badge, product grid — selektory ktere cart.js pouziva
provides:
  - loadCart/saveCart/clearCart: localStorage perzistence cart stavu
  - calcPromo: promo 3+1 logika (type=uterka filtr, Math.floor/4)
  - calcTotal: gross/discount/net vypocet
  - renderCart: HTML generovani cart items do #cart-items
  - updateNavBadge: .cart-count badge update
  - openDrawer/closeDrawer: drawer interaktivita
  - initCart: delegovane event listenery pro celou cart
  - btn-add tlacitka v renderProductCards s data-id
affects: [05-03, order.js bude volat loadCart/calcTotal/clearCart]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Plain globals (zadny ES module export) — kompatibilni s vanilla browser bez bundleru"
    - "Delegovany event listener na product-grid — listenery se neregistruji na dynamicke elementy"
    - "Cart state pouze v localStorage — ZADNY cart state v DOM atributech"
    - "calcPromo vypocet pri renderovani — discount se neukozuje v localStorage"

key-files:
  created:
    - js/cart.js
  modified:
    - js/main.js

key-decisions:
  - "Cart state je pouze v localStorage + JS poli — DOM je jen vykreslovaci vrstva"
  - "calcPromo filtruje PRODUCTS[].type === 'uterka' — zastera (type: zastera) nikdy nevstupuje do promo"
  - "Math.floor(totalUterkyQty / 4) = pocet free kusu; nejlevnejsi kusy jsou zdarma (sort ascending)"
  - "initCart() musi byt volano az po renderProductCards() — btn-add tlacitka musi existovat v DOMu"

patterns-established:
  - "Cart mutations (addToCart/updateQty/removeItem): vzdy loadCart -> zmena -> saveCart -> renderCart -> updateNavBadge"
  - "Delegovany click listener pres e.target.closest() pro dynamicky renderovane prvky"

requirements-completed: [CART-01, CART-02, CART-03, CART-04, CART-05, CART-06, CART-07]

# Metrics
duration: 7min
completed: 2026-03-04
---

# Phase 5 Plan 02: Cart State Module Summary

**Kompletni cart state modul s LocalStorage perzistenci, promo 3+1 logikou pro uterky a drawer interaktivitou — ready pro Plan 03 (order.js)**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-04T19:22:06Z
- **Completed:** 2026-03-04T19:29:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- js/cart.js vytvoren s 13 plain global funkcemi pokryvajicimi vsechnu cart logiku
- Promo 3+1 implementovana: Math.floor(uterkyQty / 4) free kusu — nejlevnejsi uterky zdarma, zastera vyrazena
- main.js aktualizovan: btn-add tlacitka generovana v renderProductCards(), initCart() volano v DOMContentLoaded
- localStorage perzistence — kosik prezije refresh stranky

## Task Commits

Kazdy ukol commitovan atomicky:

1. **Task 1: Vytvorit js/cart.js** - `c8570c3` (feat)
2. **Task 2: Aktualizovat js/main.js** - `8075968` (feat)

## Files Created/Modified

- `js/cart.js` — Kompletni cart state modul: storage helpers, mutations, promo logika, UI rendering, drawer, init
- `js/main.js` — Pridano btn-add tlacitko do renderProductCards() a initCart() do DOMContentLoaded

## Decisions Made

- Cart state je pouze v localStorage + JS poli — DOM je jen vykreslovaci vrstva (zadny cart state v data atributech)
- calcPromo filtruje PRODUCTS[].type === 'uterka' — zastera (type: zastera) nikdy nevstupuje do promo vypoctu
- Math.floor(totalUterkyQty / 4) — kazde 4 kusy uterek = 1 nejlevnejsi kus zdarma; sort ascending zajisti spravny vyber
- initCart() musi byt volano az po renderProductCards() aby btn-add tlacitka existovala v DOMu pro delegovany listener

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- cart.js je plne funkcni jako standalone modul
- loadCart(), calcTotal(), clearCart() jsou globalni a pripravene pro volani z order.js (Plan 03)
- Plan 03 (order.js) muze pouzivat cart state okamzite — zadne dalsi zavislosti
- Potencialni konzolovy warning "ReferenceError: initOrderForm is not defined" do dokonceni Planu 03 — to je v poradku

## Self-Check: PASSED

- js/cart.js: FOUND
- js/main.js: FOUND
- 05-02-SUMMARY.md: FOUND
- Commit c8570c3 (cart.js): FOUND
- Commit 8075968 (main.js): FOUND

---
*Phase: 05-kosik-a-objednavky-a-kontaktni-formular*
*Completed: 2026-03-04*
