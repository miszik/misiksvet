# Mišik svět

## What This Is

Jednostránkový web s jednoduchým košíkem pro značku **Mišik svět** — ručně vyšívané lněné utěrky. Web slouží jako vizitka, galerie výrobků a objednávkové místo. Zákazníci si vybírají motivy a počet kusů, objednávku odešlou formulářem a Míša je kontaktuje s platebními instrukcemi (QR kód / bankovní převod).

## Core Value

Zákazník si musí být schopen vybrat utěrky, sestavit objednávku a odeslat ji — vše bez nutnosti opustit web nebo kontaktovat Míšu přes Instagram.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Web zobrazí produkty s fotkami, popisem a cenou
- [ ] Zákazník může přidat produkty do košíku a upravit množství
- [ ] Košík zobrazí celkovou cenu a akci 3+1
- [ ] Zákazník vyplní objednávkový formulář (jméno, email, adresa)
- [ ] Po odeslání formuláře dostane zákazník automatický potvrzovací email
- [ ] Míša dostane email s detaily objednávky
- [ ] Web je plně responzivní (priorita mobil)
- [ ] Web splňuje SEO základy (meta tagy, Open Graph)

### Out of Scope

- Platební brána (Stripe, GoPay) — zatím bez živnosti, přidá se později
- Přihlašování uživatelů — zbytečná složitost pro tento rozsah
- Správa skladu / admin panel — ruční sledování pro začátek
- Cookie banner — web nesleduje návštěvníky

## Context

- **Autorka:** Míša, maminka na rodičovské, prodává zatím neformálně, plánuje živnost
- **Instagram:** @misiksvet — hlavní prodejní kanál, odtud chodí zákazníci (= mobil priority)
- **Produkty:** 3 motivy — kopretina, vlčí mák, šiška s větvičkou (380 Kč/ks)
- **Akce:** 3+1 zdarma (kup 3, čtvrtou jako dárek)
- **Fotky:** 8 fotek ve složce `/fotky/` — je potřeba identifikovat a přejmenovat
- **Vizuální styl:** Skandinávský minimalismus, béžová/krémová/hnědá, fonty Cormorant Garamond + Josefin Sans
- **Platba:** QR kód / bankovní převod — Míša posílá platební instrukce ručně po objednávce

## Constraints

- **Hosting:** GitHub Pages — statický web, žádný serverový kód
- **Náklady:** Nulové měsíční poplatky — EmailJS free tier (200 emailů/měs), GitHub Pages (zdarma)
- **Tech stack:** Čistý HTML + CSS + JavaScript (bez frameworků) nebo React — oboje ok
- **Email:** EmailJS pro automatické potvrzení zákazníkovi + notifikaci Míše
- **Jazyk:** Čeština, správná diakritika, nezlomitelné mezery u předložek

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| QR platba místo platební brány | Zatím bez živnosti; ruční zpracování zvládnutelné pro malé objemy | — Pending |
| EmailJS pro emaily | Zdarma do 200/měs, funguje na statickém hostingu bez backendu | — Pending |
| GitHub Pages hosting | Nulové náklady, jednoduché nasazení | — Pending |
| Čistý HTML/CSS/JS | Nejjednodušší pro hosting bez buildu; žádné závislosti | — Pending |

---
*Last updated: 2026-03-04 after initialization*
