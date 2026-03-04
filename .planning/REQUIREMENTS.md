# Requirements: Mišik svět

**Defined:** 2026-03-04
**Core Value:** Zákazník si vybere utěrky, sestaví objednávku a odešle ji — vše bez nutnosti opustit web nebo kontaktovat Míšu přes Instagram.

## v1 Requirements

### Prezentace produktů

- [ ] **DISP-01**: Návštěvník vidí hero sekci s názvem značky, podtitulem a poetickým textem
- [ ] **DISP-02**: Návštěvník vidí příběh autorky (sekce "O mně") s fotkou produktu
- [ ] **DISP-03**: Návštěvník vidí 3 produktové karty (kopretina, vlčí mák, šiška) s fotkou, popisem, materiálem a cenou
- [ ] **DISP-04**: Návštěvník vidí sekci hodnot (český len, strojová výšivka, krásné balení)
- [ ] **DISP-05**: Návštěvník vidí banner akce 3+1

### Košík

- [ ] **CART-01**: Zákazník může přidat produkt do košíku tlačítkem na produktové kartě
- [ ] **CART-02**: Zákazník může v košíku upravit množství každého produktu (+ / -)
- [ ] **CART-03**: Zákazník může produkt z košíku odebrat
- [ ] **CART-04**: Košík zobrazuje průběžný součet a počet kusů
- [ ] **CART-05**: Košík automaticky počítá akci 3+1 (při 3+ kusech je nejlevnější zdarma — de facto každý 4. kus zdarma, všechny stojí 380 Kč)
- [ ] **CART-06**: Stav košíku se zachová při obnovení stránky (localStorage)
- [ ] **CART-07**: Košík je viditelný/přístupný z navigace (ikona s počtem kusů)

### Objednávkový formulář

- [ ] **ORDER-01**: Zákazník vyplní jméno a příjmení
- [ ] **ORDER-02**: Zákazník vyplní e-mailovou adresu
- [ ] **ORDER-03**: Zákazník vyplní telefonní číslo
- [ ] **ORDER-04**: Zákazník vybere způsob doručení: Zásilkovna výdejní místo / Zásilkovna domů / Osobní odběr
- [ ] **ORDER-05**: Při výběru "Zásilkovna výdejní místo" se zobrazí Packeta widget pro výběr pobočky z mapy
- [ ] **ORDER-06**: Při výběru "Zásilkovna domů" se zobrazí pole pro doručovací adresu
- [ ] **ORDER-07**: Zákazník může přidat nepovinnou poznámku k objednávce
- [ ] **ORDER-08**: Zákazník musí odkliknout souhlas se zpracováním osobních údajů (GDPR) před odesláním
- [ ] **ORDER-09**: Formulář validuje povinná pole před odesláním a zobrazí srozumitelné chybové hlášky
- [ ] **ORDER-10**: Po odeslání se tlačítko deaktivuje (prevence duplicitních objednávek)

### E-mailové notifikace

- [ ] **EMAIL-01**: Zákazník obdrží automatický potvrzovací e-mail se shrnutím objednávky
- [ ] **EMAIL-02**: Míša obdrží e-mail s kompletními detaily objednávky (jméno, email, telefon, produkty, doručení, poznámka)
- [ ] **EMAIL-03**: E-maily jsou odesílány přes EmailJS (CDN, bez backendu)

### Navigace a UX

- [ ] **NAV-01**: Fixní horní navigace s logem vlevo a odkazy vpravo (Příběh · Výrobky · Kontakt)
- [ ] **NAV-02**: Na mobilu navigace přejde do hamburger menu nebo zmenšených odkazů
- [ ] **NAV-03**: Web je plně responzivní, mobilní zobrazení je priorita
- [ ] **NAV-04**: Fade-in animace při načtení hero sekce

### SEO a nasazení

- [ ] **SEO-01**: Meta title a meta description pro vyhledávače
- [ ] **SEO-02**: Open Graph tagy pro sdílení na sociálních sítích (Instagram, Facebook)
- [ ] **SEO-03**: Alt texty u všech obrázků
- [ ] **DEPLOY-01**: Web je nasazen na GitHub Pages
- [ ] **DEPLOY-02**: Vlastní doména misiksvet.cz nakonfigurována (CNAME)
- [ ] **DEPLOY-03**: Fotky optimalizovány do WebP formátu (max 150 KB každá)

### Právní náležitosti

- [ ] **LEGAL-01**: Stránka obsahuje informaci o 14denním právu na vrácení zboží
- [ ] **LEGAL-02**: Stránka obsahuje stručné oznámení o zpracování osobních údajů (GDPR)

## v2 Requirements

### Doprava

- **SHIP-01**: Podpora PPL ParcelBox / dalších dopravců (až bude poptávka)

### Platba

- **PAY-01**: Online platba kartou přes Stripe nebo GoPay (po získání živnosti)

### Rozšíření katalogu

- **CAT-01**: Sezónní motivy (vánoční, jarní, velikonoční)
- **CAT-02**: Sekce "Personalizace" — vyšití jména na objednávku

### Admin

- **ADM-01**: Jednoduché označení produktu jako "vyprodáno" (třída v HTML)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Platební brána v1 | Zatím bez živnosti; přidá se v v2 po registraci |
| Přihlašování uživatelů | Zbytečná složitost pro tento rozsah |
| Admin panel / správa skladu | Ruční sledování dostačuje pro začátek |
| Cookie banner | Web nesleduje návštěvníky, žádné cookies třetích stran |
| Zásilkovna full API (label tisk) | Míša odesílá přes app jako soukromá osoba |
| PPL v1 | Zásilkovna pokrývá výdejní místa i doručení domů |

## Traceability

Bude doplněno během tvorby roadmapy.

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-04 after initial definition*
