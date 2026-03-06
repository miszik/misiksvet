# Roadmap: Mišik svět

## Overview

Ctyri faze od prazdneho repozitare az po fungujici e-shop na GitHub Pages. Kazda faze odevzdava jednu overitelnou schopnost: nejprve vizualni stranka s produkty, pak interaktivni kosik, pak kompletni objednavkovy tok s emaily a nakonec nasazeni a finalni QA. Kazda faze je testovatelna v prohlizeci pred zahajenim dalsi.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Zaklad a zobrazeni produktu** - Vizualne kompletni stranka s produktovymi kartami, hero, pribeh, hodnoty a promo banner — bez interaktivity
- [ ] **Phase 2: Kosik a akce 3+1** - Plne funkcni kosik s localStorage perzistenci, zivymi soucty a spravnym vypoctem akce 3+1
- [ ] **Phase 3: Objednavkovy formular a e-maily** - End-to-end objednavkovy tok: vyplneni formulare, vyber dopravy, Packeta widget, validace, odeslani a potvrzovaci emaily pres EmailJS
- [ ] **Phase 4: Nasazeni a finalni QA** - SEO meta tagy, Open Graph, optimalizace obrazku, nasazeni na GitHub Pages, vlastni domena a overeni na realnem telefonu

## Phase Details

### Phase 1: Zaklad a zobrazeni produktu
**Goal**: Navstevnik vidi vizualne kompletni stranku s produkty, pribehem autorky a informacemi o akci — stranka funguje spravne na mobilu
**Depends on**: Nothing (first phase)
**Requirements**: DISP-01, DISP-02, DISP-03, DISP-04, DISP-05, NAV-01, NAV-02, NAV-03, NAV-04, LEGAL-01, LEGAL-02
**Success Criteria** (what must be TRUE):
  1. Navstevnik vidi hero sekci s nazvem znacky a poetickym textem pri otevreni stranky
  2. Navstevnik vidi vsechny 3 produktove karty (kopretina, vlci mak, siska) s fotkou, popisem a cenou 380 Kc
  3. Navstevnik vidi sekci "O mne" s pribehem autorky a sekci hodnot (cesky len, vysivka, baleni)
  4. Navstevnik vidi banner akce 3+1 a informaci o 14dennim pravu na vraceni zbozi
  5. Navigace je funkci na mobilu (hamburger nebo zmensite odkazy) a stranka je plne responzivni
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — HTML kostra vsech sekci + kompletni CSS design system (mobile-first)
- [x] 01-02-PLAN.md — JS produktova data + navigace + .nojekyll
- [x] 01-03-PLAN.md — Finalni automatizovana kontrola + vizualni checkpoint s uzivatelkou

### Phase 2: Kosik a akce 3+1
**Goal**: Zakaznik muze sestavit objednavku — pridat produkty, upravit mnozstvi, videt spravnou celkovou cenu vcetne slevy 3+1, a kosik prezije obnoveni stranky
**Depends on**: Phase 1
**Requirements**: CART-01, CART-02, CART-03, CART-04, CART-05, CART-06, CART-07
**Success Criteria** (what must be TRUE):
  1. Zakaznik klikne na "Pridat do kosiku" na produktove karte a produkt se objevi v kosiku
  2. Zakaznik muze zvysit/snizit mnozstvi kazdeho produktu v kosiku nebo ho zcela odebrat
  3. Kosik zobrazuje spravny soucet — pri 4 kusech (nebo nasobcich 4) je jeden kus zdarma a soucet to odrazuje
  4. Ikona kosiku v navigaci ukazuje aktualni pocet kusu a kosik je pristupny kliknutim
  5. Po obnoveni stranky jsou produkty v kosiku stale pritomny (localStorage perzistence)
**Plans**: TBD

### Phase 3: Objednavkovy formular a e-maily
**Goal**: Zakaznik muze odeslat objednavku, automaticky dostane potvrzovaci e-mail a Misa dostane notifikaci s detaily — bez nutnosti rucniho zpracovani
**Depends on**: Phase 2
**Requirements**: ORDER-01, ORDER-02, ORDER-03, ORDER-04, ORDER-05, ORDER-06, ORDER-07, ORDER-08, ORDER-09, ORDER-10, EMAIL-01, EMAIL-02, EMAIL-03
**Success Criteria** (what must be TRUE):
  1. Zakaznik vyplni jmeno, email, telefon a vybere zpusob doruceni; pri vyberu "Zasilkovna vydejna" se zobrazi mapa pro vyber pobocky, pri "domici" se zobrazi pole pro adresu
  2. Zakaznik nemuze odeslat formular bez povinnych poli a GDPR souhlasu — formular zobrazi srozumitelne chybove hlasky
  3. Po odeslani zakaznik dostane potvrzovaci e-mail se shrnutim objednavky
  4. Misa dostane e-mail s uplnymi detaily objednavky (jmeno, email, telefon, produkty, doruceni, poznamka)
  5. Tlacitko odeslat se po kliknuti deaktivuje (zadne duplicitni objednavky) a stranka zobrazuje stav uspech/chyba
**Plans**: TBD

### Phase 4: Nasazeni a finalni QA
**Goal**: Web je zive na GitHub Pages s vlastni domenou, obrazky jsou optimalizovane, SEO a Open Graph funguje a stranka je overena na realnem telefonu
**Depends on**: Phase 3
**Requirements**: SEO-01, SEO-02, SEO-03, DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. Web je dostupny na misiksvet.cz (nebo GitHub Pages URL) a nacita se spolehlive
  2. Sdileni odkazu na Instagramu nebo Facebooku zobrazuje spravny nahled (og:title, og:description, og:image)
  3. Vsechny obrazky maji alt texty a jsou ve WebP formatu pod 150 KB — stranka se nacte rychle na mobilnim pripojeni
  4. Stranka projde zakladnim mobilnim testem na realnem zarizeni (dotykovatelne prvky, spravne pismo, formular funguje)
**Plans**: 2 plans

Plans:
- [ ] 04-01-PLAN.md — SEO/OG meta tagy + WebP konverze vsech fotek + aktualizace img src
- [ ] 04-02-PLAN.md — CNAME soubor + GitHub Pages deploy checklist + EmailJS konfigurace + mobilni verifikace

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Zaklad a zobrazeni produktu | 3/3 | Complete | 2026-03-04 |
| 2. Kosik a akce 3+1 | 0/TBD | Not started | - |
| 3. Objednavkovy formular a e-maily | 0/TBD | Not started | - |
| 4. Nasazeni a finalni QA | 0/2 | Planned | - |

### Phase 5: Kosik a objednavky a kontaktni formular

**Goal:** Zakaznik muze pridat produkty do kosiku, sestavit objednavku s dorucenimi a odeslat ji — kosik je interaktivni, promo 3+1 se spravne pocita a emaily jsou odesilany pres EmailJS
**Requirements**: CART-01, CART-02, CART-03, CART-04, CART-05, CART-06, CART-07, ORDER-01, ORDER-02, ORDER-03, ORDER-04, ORDER-05, ORDER-06, ORDER-07, ORDER-08, ORDER-09, ORDER-10, EMAIL-01, EMAIL-02, EMAIL-03
**Depends on:** Phase 1 (implementace), Phase 4 (pro EmailJS/Packeta klice pred spustenim)
**Plans:** 4/4 plans complete — KOMPLETNI (schvaleno Misou 2026-03-05)

Plans:
- [x] 05-01-PLAN.md — HTML/CSS scaffold: CDN scripty, cart ikona, cart drawer, order form, products.js type pole
- [x] 05-02-PLAN.md — js/cart.js: cart state modul (localStorage, promo 3+1, drawer, nav badge)
- [x] 05-03-PLAN.md — js/order.js: formularova validace, Packeta widget, EmailJS send
- [x] 05-04-PLAN.md — Automatizovana kontrola + vizualni checkpoint (schvaleno Misou 2026-03-05)
