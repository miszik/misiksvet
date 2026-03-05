---
phase: 05-kosik-a-objednavky-a-kontaktni-formular
verified: 2026-03-05T12:00:00Z
status: human_needed
score: 21/21 must-haves verified
human_verification:
  - test: "EmailJS live send: doplnit skutecne klice do index.html a js/order.js a odeslat testovaci objednavku"
    expected: "Misa obdrzi notifikaci (owner_notification) a zakaznik dostane potvrzeni (customer_confirmation) na zadany email"
    why_human: "EmailJS API vyzaduje registrovane sluzby a sablony — nelze overit programaticky bez credentials; kod je spravne zapojen, ale end-to-end email flow lze overit pouze live"
  - test: "Packeta widget: doplnit skutecny PACKETA_API_KEY do js/order.js a kliknout 'Vybrat vydejna misto'"
    expected: "Otevre se modalni mapa Zasilkovny, uzivatel vybere pobocku a jeji nazev se zobrazi v #packeta-selected-name"
    why_human: "Packeta.Widget.pick() vyzaduje platny API klic — nelze overit bez registrovaneho uctu na client.packeta.com"
  - test: "Mobilni zobrazeni: overit cart drawer, order form a validaci na realnem telefonu nebo DevTools mobile view"
    expected: "Cart drawer se otevre z prava, form je pouzitelny na dotykove obrazovce, validacni bublinky jsou citelne"
    why_human: "Vizualni a dotykove UX nelze overit programaticky"
---

# Phase 5: Kosik a objednavky a kontaktni formular — Verification Report

**Phase Goal:** Zakaznik muze pridat produkty do kosiku, sestavit objednavku s dorucenimi a odeslat ji — kosik je interaktivni, promo 3+1 se spravne pocita a emaily jsou odesilany pres EmailJS
**Verified:** 2026-03-05
**Status:** human_needed — vsechny automatizovane kontroly prosly; 3 polozky vyzaduji lidske overeni (live EmailJS, Packeta widget, mobilni UX)
**Re-verification:** No — pocatecni verifikace

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Zakaznik muze pridat produkt do kosiku tlacitkem na produktove karte | VERIFIED | `js/main.js` renderuje `.btn-add[data-id]` v sablone; `js/cart.js initCart()` registruje delegovany click listener na `#product-grid` zachytavajici `.btn-add` |
| 2 | Zakaznik muze v kosiku upravit mnozstvi (+/-) nebo odebrat polozku | VERIFIED | `js/cart.js`: `updateQty(id, delta)` a `removeItem(id)` implementovany; delegovany listener na `#cart-items` zpracovava `.qty-inc`, `.qty-dec`, `.cart-item__remove` |
| 3 | Kosik zobrazuje prubezny soucet vcetne slevy 3+1 | VERIFIED | `renderCart()` vola `calcTotal()`, aktualizuje `.cart-total` a `.cart-discount` s textem "Sleva akce 3+1: −X Kc"; verified programaticky |
| 4 | Promo 3+1 se pocita spravne — pouze pro uterky, zastera se nezapocita | VERIFIED | `calcPromo()` filtruje `product.type === 'uterka'`; testovano: 3 uterky=0 Kc sleva, 4 uterky=380 Kc sleva, 4 zastery=0 Kc sleva |
| 5 | Kosik prezije obnoveni stranky (localStorage perzistence) | VERIFIED | `loadCart()`/`saveCart()` pouzivaji `localStorage` pod klicem `misiksvet-cart`; `initCart()` nacita ulozeny stav pri startu; osetren try/catch pro privatni prohlizeni |
| 6 | Ikona kosiku v navigaci zobrazuje pocet kusu | VERIFIED | `updateNavBadge()` aktualizuje `.cart-count` textContent a `hidden` atribut; volano pri kazde zmene kosiku |
| 7 | Klik na cart ikonu otevre drawer; klik na X nebo overlay ho zavre | VERIFIED | `initCart()` registruje listenery na `#cart-nav-btn`, `.cart-drawer__close`, `#cart-overlay`; CSS `.cart-drawer.open` (translateX 0) a `.cart-overlay.visible` |
| 8 | Zakaznik vybere zpusob doruceni a zobrazi se patricna sekce | VERIFIED | `handleDeliveryChange()` toggleuje `hidden` na `#packeta-section` a `#home-delivery-section`; pri prepnuti cisti hodnoty skrytych poli |
| 9 | Odeslani prazdneho formulare zobrazi ceske chybove hlasky | VERIFIED | `validateForm()` pouziva `setCustomValidity()` + `reportValidity()` s ceskymi texty pro full_name, email, phone, delivery, gdpr; `e.preventDefault()` je prvni radek handleru |
| 10 | Prazdny kosik pri odeslani formulare zobrazi chybu | VERIFIED | `validateForm()` vola `loadCart()` a zobrazuje "Kosik je prazdny. Pridejte prosim produkty pred odeslanim." pres `showFieldError('cart-error', ...)` |
| 11 | Po uspesnem odeslani se tlacitko deaktivuje | VERIFIED | `handleFormSubmit()` nastavi `submitBtn.disabled = true` a text "Odesilam..." pred `emailjs.send()`; po uspechu text "Odeslano ✓" a tlacitko zustava deaktivovane |
| 12 | EmailJS odeslani: notifikace vlastnikovi + potvrzeni zakaznikovi | VERIFIED (code) | `emailjs.send()` volano 2x — `EMAILJS_OWNER_TEMPLATE` jako prvni, pak `EMAILJS_CUSTOMER_TEMPLATE`; `cart_summary` je JS-computed string; POTREBA HUMAN OVERENI pro live test |
| 13 | Packeta widget integrace | VERIFIED (code) | `openPacketaWidget()` vola `Packeta.Widget.pick()` s modalni volbou pro CZ pobocky; callback ukozuje nazev pobocky; POTREBA HUMAN OVERENI pro live test |
| 14 | CDN scripty nacitany ve spravnem poradi | VERIFIED | EmailJS v `<head>` pred `</head>`; Packeta synchronne v `<body>` na radku 189 pred `js/cart.js` (radek 190), `js/order.js` (191), `js/main.js` (192) |
| 15 | EmailJS CDN nacten pres CDN (bez backendu) | VERIFIED | `index.html <head>` obsahuje `https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js` s synchronni inicializaci |

**Score:** 15/15 truths verified (12 plne programaticky, 3 potrebuji live overeni — viz Human Verification Required)

---

### Required Artifacts

| Artifact | Provides | Exists | Substantive | Wired | Status |
|----------|----------|--------|-------------|-------|--------|
| `index.html` | HTML struktura: CDN scripty, cart drawer, order form | Yes | Yes — 196 radku, vsechny selektory pritomny | Yes — scripty nacitany v poradi | VERIFIED |
| `css/style.css` | Cart drawer CSS (translateX), form styly, stavove zpravy | Yes | Yes — PHASE 5 sekce od radku 503, vsechny klicove tridy | Yes — pouzivany elementech v index.html | VERIFIED |
| `js/products.js` | PRODUCTS pole s `type` polem pro promo logiku | Yes | Yes — 43 radku, 3x `type: 'uterka'`, 1x `type: 'zastera'` | Yes — globalni promenna pouzivana v cart.js a order.js | VERIFIED |
| `js/cart.js` | 13 plain-global funkci: loadCart, saveCart, clearCart, addToCart, updateQty, removeItem, calcPromo, calcTotal, renderCart, updateNavBadge, openDrawer, closeDrawer, initCart | Yes | Yes — 219 radku, vsechny funkce implementovany | Yes — volano pres `initCart()` v main.js | VERIFIED |
| `js/order.js` | 6 plain-global funkci: openPacketaWidget, handleDeliveryChange, validateForm, formatCartSummary, handleFormSubmit, initOrderForm | Yes | Yes — 252 radku, vsechny funkce implementovany | Yes — volano pres `initOrderForm()` v main.js | VERIFIED |
| `js/main.js` | Entry point: renderProductCards(), initNav(), initCart(), initOrderForm() v DOMContentLoaded | Yes | Yes — 75 radku, vsechna 4 volani pritomna ve spravnem poradi | Yes — je poslednim skriptem v index.html | VERIFIED |

---

### Key Link Verification

| From | To | Via | Status | Evidence |
|------|----|-----|--------|---------|
| `js/main.js renderProductCards()` | `.btn-add[data-id]` v product kartach | innerHTML sablona obsahuje `btn-add` a `data-id` | WIRED | Radek 28 main.js: `<button class="btn btn--primary btn-add" data-id="${p.id}">` |
| `js/cart.js initCart()` | `#product-grid` delegovany click | `addEventListener('click')` s `e.target.closest('.btn-add')` | WIRED | Radky 183-188 cart.js |
| `js/cart.js renderCart()` | `#cart-items innerHTML` | `document.getElementById('cart-items').innerHTML = ...` | WIRED | Radek 116 cart.js |
| `js/cart.js updateNavBadge()` | `.cart-count textContent + hidden` | `badge.textContent = total; badge.hidden = total === 0` | WIRED | Radky 149-152 cart.js |
| `js/cart.js calcPromo()` | `PRODUCTS[].type === 'uterka'` | `.filter(item => product.type === 'uterka')` | WIRED | Radky 77-79 cart.js |
| `js/order.js handleFormSubmit()` | `loadCart()` + `calcTotal()` | Prima volani globalnich funkci z cart.js | WIRED | Radky 182-183 order.js |
| `js/order.js handleFormSubmit()` | `emailjs.send()` x2 | `await emailjs.send(SERVICE_ID, OWNER_TEMPLATE, params)` + `await emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE, params)` | WIRED | Radky 210-212 order.js; 2 volani potvrzena |
| `delivery select onChange` | `#packeta-section` a `#home-delivery-section` | `handleDeliveryChange()` toggleuje `.hidden` | WIRED | Radky 43-44 order.js |
| `js/cart.js clearCart()` | po uspesnem emailjs.send() | `clearCart()` volano v try bloku po druhem send | WIRED | Radek 221 order.js |
| `index.html <head>` | EmailJS CDN | `https://cdn.jsdelivr.net/npm/@emailjs/browser@4/...` s okamzitou inicializaci | WIRED | Radky 12-21 index.html |
| `index.html <body>` | Packeta widget CDN | `https://widget.packeta.com/v6/www/js/library.js` sync pred cart.js | WIRED | Radek 189 index.html (pred cart.js na radku 190) |

---

### Requirements Coverage

| Requirement | Zdrojovy plan | Popis | Status | Dukaz |
|-------------|---------------|-------|--------|-------|
| CART-01 | 05-01, 05-02, 05-04 | Zakaznik muze pridat produkt do kosiku | SATISFIED | `.btn-add[data-id]` v main.js + `addToCart()` v cart.js + delegovany listener na `#product-grid` |
| CART-02 | 05-02 | Zakaznik muze upravit mnozstvi (+/-) | SATISFIED | `updateQty(id, delta)` + delegovany listener na `#cart-items` pro `.qty-inc`/`.qty-dec` |
| CART-03 | 05-02 | Zakaznik muze produkt odebrat | SATISFIED | `removeItem(id)` + listener na `.cart-item__remove` |
| CART-04 | 05-02 | Kosik zobrazuje prubezny soucet a pocet kusu | SATISFIED | `calcTotal()` + `renderCart()` aktualizuje `.cart-total`; `updateNavBadge()` aktualizuje `.cart-count` |
| CART-05 | 05-02 | Automaticky pocita akci 3+1 pouze pro uterky | SATISFIED | `calcPromo()` filtruje `type === 'uterka'`; `Math.floor(count/4)` free kusu; zastera (type='zastera') vyrazena |
| CART-06 | 05-02 | Stav kosiku se zachova pri obnoveni stranky | SATISFIED | `saveCart()`/`loadCart()` pres localStorage `misiksvet-cart`; `initCart()` nacita ulozeny stav |
| CART-07 | 05-01, 05-02 | Kosik pristupny z navigace s poctem kusu | SATISFIED | `#cart-nav-btn` v nav s SVG ikonou a `.cart-count` badge; `initCart()` registruje click listener |
| ORDER-01 | 05-01, 05-03 | Zakaznik vyplni jmeno a prijmeni | SATISFIED | `<input name="full_name" required>` v index.html; `validateForm()` kontroluje s ceskou hlaskou |
| ORDER-02 | 05-01, 05-03 | Zakaznik vyplni e-mail | SATISFIED | `<input type="email" name="email" required>`; validovano v `validateForm()` |
| ORDER-03 | 05-01, 05-03 | Zakaznik vyplni telefonni cislo | SATISFIED | `<input type="tel" name="phone" required>`; validovano v `validateForm()` |
| ORDER-04 | 05-01, 05-03 | Zakaznik vybere zpusob doruceni | SATISFIED | `<select name="delivery">` s 3 moznostmi (packeta-vydejna, packeta-domu, osobni-odber) |
| ORDER-05 | 05-01, 05-03 | Packeta widget pro vyber pobocky z mapy | SATISFIED (code) | `#packeta-section` s `#packeta-open-btn`; `openPacketaWidget()` vola `Packeta.Widget.pick()`; POTREBA HUMAN pro live test |
| ORDER-06 | 05-01, 05-03 | Pole pro dorucovaci adresu kdyz "Zasilkovna domu" | SATISFIED | `#home-delivery-section` s `[name="home_address"]`; `handleDeliveryChange()` zobrazuje/skryva sekci |
| ORDER-07 | 05-01 | Nepovinná poznamka k objednavce | SATISFIED | `<textarea name="note" rows="3">` v index.html; zahr do EmailJS params jako `note` |
| ORDER-08 | 05-01, 05-03 | GDPR souhlas pred odeslanim | SATISFIED | `<input type="checkbox" name="gdpr" required>`; `validateForm()` kontroluje pres `checkValidity()` |
| ORDER-09 | 05-03 | Formular validuje povinne pole s chybovymi hlasky | SATISFIED | `validateForm()` pouziva `setCustomValidity()` + `reportValidity()` s ceskymi texty; `e.preventDefault()` je prvni radek |
| ORDER-10 | 05-03 | Po odeslani se tlacitko deaktivuje | SATISFIED | `submitBtn.disabled = true` okamzite po validateForm(); zustava deaktivovane po uspechu; re-aktivuje se pouze pri chybe |
| EMAIL-01 | 05-03 | Zakaznik obdrzi potvrzovaci email | SATISFIED (code) | `emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE, params)` s `cart_summary`, `full_name`, `email`, `total`; POTREBA HUMAN pro live test |
| EMAIL-02 | 05-03 | Misa obdrzi email s detaily objednavky | SATISFIED (code) | `emailjs.send(SERVICE_ID, OWNER_TEMPLATE, params)` jako prvni volani; params obsahuje vsechny pole | POTREBA HUMAN pro live test |
| EMAIL-03 | 05-01, 05-03 | Emaily odesilany pres EmailJS (CDN, bez backendu) | SATISFIED | EmailJS `@4` CDN v index.html `<head>`; `emailjs.init()` s placeholder klicem; `emailjs.send()` (ne `sendForm`) |

**Orphaned requirements:** Zadne — vsechny CART-01/07, ORDER-01/10, EMAIL-01/03 pokryty plany 05-01 az 05-04.

**Poznamka k traceability tabulce v REQUIREMENTS.md:** Tabulka uvadi CART-* jako "Phase 2" a ORDER-*/EMAIL-* jako "Phase 3", ale implementace probehla v Phase 5. Vsechny polozky jsou spravne oznaceny jako `[x]` a "Complete" — jde o pojmenovaci nesoulad v dokumentaci, nikoliv o chybejici implementaci.

---

### Anti-Patterns Found

| Soubor | Radek | Pattern | Zavaznost | Dopad |
|--------|-------|---------|-----------|-------|
| `index.html` | 137 | `placeholder="+420 123 456 789"` | Info | Toto je legitimni HTML `placeholder` atribut na telefonnim inputu s ukazkovym cislem — NE content stub. Zadny dopad. |
| `js/order.js` | 7-10 | `YOUR_PACKETA_API_KEY`, `YOUR_SERVICE_ID`, `YOUR_CUSTOMER_TEMPLATE_ID`, `YOUR_OWNER_TEMPLATE_ID` | Info — ocekavano | Znamerne placeholdery pro konfiguraci uzivatelem pred nasazenim. Dokumentovane v PLAN a SUMMARY. |
| `index.html` | 19 | `YOUR_EMAILJS_PUBLIC_KEY` | Info — ocekavano | Zamerny placeholder pro EmailJS inicializaci — Misa doplni pred nasazenim. |

**Zadne blokujici anti-patterny.** Vsechny nalezene "placeholdery" jsou bud legitimni HTML atributy nebo zamericke konfiguracni placeholdery pro externi sluzby.

---

### Human Verification Required

#### 1. EmailJS Live Send Test

**Test:** Doplnit skutecne EmailJS hodnoty do souboru a odeslat testovaci objednavku:
1. V `index.html` nahradit `YOUR_EMAILJS_PUBLIC_KEY` skutecnym klicem
2. V `js/order.js` nahradit `YOUR_SERVICE_ID`, `YOUR_CUSTOMER_TEMPLATE_ID`, `YOUR_OWNER_TEMPLATE_ID` skutecnymi hodnotami z EmailJS dashboardu
3. Pridat produkty do kosiku, vyplnit formular, kliknout "Odeslat objednavku"

**Expected:** Misa obdrzi email s detaily objednavky (owner_notification) a zakaznik dostane potvrzovaci email se shrnuti (customer_confirmation). Tlacitko se zmeni na "Odeslano ✓" a kosik se vyprazdni.

**Why human:** EmailJS vyzaduje registrovane ucty, vytvorene emailove sablony a nastavene Allowed Origins. Kod je spravne zapojen (2x `emailjs.send()`, spravne params, clearCart po uspechu), ale end-to-end flow lze overit pouze s platnym credentials.

---

#### 2. Packeta Widget Live Test

**Test:** Doplnit platny `PACKETA_API_KEY` do `js/order.js`, vybrat "Zasilkovna — vydejna misto" v select, kliknout "Vybrat vydejna misto".

**Expected:** Otevre se modalni mapa Zasilkovny (Packeta widget), uzivatel muze kliknout na pobocku, po vyberu se zobrazi nazev pobocky v `#packeta-selected-name` a `#packeta-error` zustava skryty.

**Why human:** `Packeta.Widget.pick()` vyzaduje platny API klic z client.packeta.com. Bez nej widget bud neotevre nebo zobrazi chybu. Kod je spravne zapojen (modal options, callback s `point.name + ', ' + point.city`).

---

#### 3. Mobilni UX Test

**Test:** Otevrit index.html v DevTools mobile view (napr. iPhone 12) nebo na realnem telefonu:
1. Kliknout "Pridat do kosiku" — cart drawer se otevre z prava
2. Pouzivat +/- tlacitka v draweru na dotykove obrazovce
3. Scrollovat dolu k formulari a vyplnit vsechna pole
4. Odeslat s prazdnym kosik — zkontrolovat ze error hlaska je viditelna

**Expected:** Drawer je plne pouzitelny na mobilnim zarizeni; form fieldy jsou dostatecne velke pro dotykovy vstup; validacni bublinky (`reportValidity()`) jsou citelne; zadne vizualni rozbiti existujicich sekci.

**Why human:** Vizualni a dotykove UX nelze overit programaticky.

---

### Gaps Summary

Zadne gapy — phase goal je dosazeno. Vsechny automatizovane kontroly (15/15) prosly. Vsechny 20 requirements (CART-01/07, ORDER-01/10, EMAIL-01/03) jsou implementovany a overeny na urovni kodu.

Tri polozky vyzaduji lidske overeni pred produktivnim nasazenim:
1. Live EmailJS odeslani (vyzaduje credentials — planovano v Phase 4)
2. Packeta widget live test (vyzaduje API klic — planovano v Phase 4)
3. Mobilni UX test (doporuceno pro Phase 4 QA)

Tyto polozky nejsou blokujici pro Phase 5 cil ("kosik je interaktivni, promo 3+1 se spravne pocita a emaily jsou odesilany pres EmailJS") — EmailJS integrace existuje a je spravne zapojeny; live test je castí Phase 4 nasazeni.

---

*Verified: 2026-03-05*
*Verifier: Claude (gsd-verifier)*
