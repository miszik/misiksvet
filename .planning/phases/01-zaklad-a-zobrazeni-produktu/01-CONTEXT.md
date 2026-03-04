# Phase 1: Základ a zobrazení produktů — Context

**Gathered:** 2026-03-04
**Status:** Ready for planning
**Source:** Conversation context + zadani-web-misiksvet.md

<domain>
## Phase Boundary

Fáze 1 dodá vizuálně kompletní statickou stránku s hero sekcí, příběhem autorky, produktovými kartami (4 produkty), sekcí hodnot, bannerem 3+1 a patičkou. Žádná interaktivita (košík, formulář) — jen HTML + CSS + responzivní navigace.

</domain>

<decisions>
## Implementation Decisions

### Vizuální styl (LOCKED)
- Barevná paleta: béžová (#f5f0e8), krémová (#faf8f4), teplá hnědá (#8b6914), tlumená zelená (#5a7a4a) jako akcent
- Nadpisy: Cormorant Garamond (Google Fonts) — elegantní, serifové
- Tělo textu: Josefin Sans (Google Fonts) — čisté, bezpatkové
- Atmosféra: skandinávský minimalismus + česká příroda, vzdušný layout, hodně bílého prostoru
- Žádné křiklavé barvy, žádné flashy animace

### Fonty (LOCKED)
- Google Fonts CDN: `Cormorant+Garamond:ital,wght@0,400;0,600;1,400` + `Josefin+Sans:wght@300;400`
- Žádné lokální fonty — jednoduché CDN načítání

### Struktura stránky (LOCKED — dle zadání)
1. **Hero** — velký název "Mišik svět", podtitulek "Ručně vyšívané lněné výrobky", poetický text, fade-in animace
2. **Příběh** — "Z lásky ke lnu a lučním květinám", text o Míše, fotka produktu vedle textu
3. **Galerie / Výrobky** — "Z mé dílny", 4 produktové karty (3 utěrky + zástěra)
4. **Hodnoty** — 3 bloky: 🌾 Český len / 🪡 Strojová výšivka / 🎁 Krásné balení
5. **Akce 3+1** — zvýrazněný banner (POUZE pro utěrky)
6. **Kontakt** — odkaz na Instagram @misiksvet
7. **Patička** — © 2025 Mišik svět · Vyrobeno s láskou v Čechách

### Produkty (LOCKED)
- Utěrka Kopretina — 380 Kč — fotka: fotky/20251208_185910.jpg
- Utěrka Vlčí mák — 380 Kč — fotka: fotky/20251208_190226.jpg
- Utěrka Šiška s větvičkou — 380 Kč — fotka: fotky/20251208_190438.jpg
- Zástěra — 890 Kč — fotka: fotky/20251115_111917.jpg
- Hero/skupinová fotka: fotky/20251208_190557.jpg
- Fotky zatím NEJSOU optimalizovány (to je Phase 4) — v Phase 1 použít originály s `loading="lazy"`

### Navigace (LOCKED)
- Fixní horní lišta (sticky)
- Logo "Mišik svět" vlevo, odkazy vpravo: Příběh · Výrobky · Kontakt
- Na scrollu: jemné pozadí/stín přidán CSS třídou via JS
- Mobil: hamburger menu (pure CSS nebo minimální JS)

### Animace (LOCKED)
- Pouze fade-in na hero sekci při načtení stránky
- CSS animace (@keyframes fadeIn), žádná JS animační knihovna
- Žádné složité animace jinde

### Tech stack (LOCKED)
- Čistý HTML5 + CSS3 + minimální vanilla JS
- Žádný framework, žádný build krok, žádné npm
- Soubory: index.html, css/style.css, js/main.js (Phase 1 — navigace JS)
- `.nojekyll` soubor v rootu (POVINNÉ pro GitHub Pages)

### Přístupnost a SEO v Phase 1 (LOCKED)
- Alt texty u VŠECH obrázků (SEO je až Phase 4, ale alt texty patří do HTML)
- `lang="cs"` na `<html>` tagu
- `charset="UTF-8"` v meta
- Správná česká diakritika, nezlomitelné mezery (&nbsp;) u jednopísmenných předložek

### Legální texty (LOCKED)
- Informace o 14denním právu na vrácení — v patičce nebo sekci kontakt
- GDPR poznámka — krátký odstavec (formulář je Phase 3, ale zmínka patří sem)

### Claude's Discretion
- Přesné CSS hodnoty (padding, margin, breakpointy) — dle dobrého designového úsudku
- Pořadí CSS breakpointů (mobile-first preferred)
- Hover efekty na produktových kartách
- Výška hero sekce (min-height, viewport)
- Hamburger menu implementace (pure CSS nebo JS toggle)

</decisions>

<specifics>
## Specific Ideas

### Hero text (z zadání — použít přesně)
- Nadpis: "Mišik svět"
- Podtitulek: "Ručně vyšívané lněné výrobky"
- Text: "Každý steh vypráví příběh. Vyšívám na český len, aby krása lučního kvítí zůstala s vámi napořád."

### Příběh — text (z zadání — použít přesně)
"Jmenuji se Míša a za značkou Mišik svět stojím já – maminka na rodičovské, která objevila kouzlo vyšívacího stroje. Co začalo jako koníček, proměnilo se v malinké podnikání s velkým srdcem.

Vyšívám na 100% lněné utěrky z české tkalcovské dílny. Každý motiv – kopretina, vlčí mák, šiška s větvičkou – je inspirovaný přírodou, kterou mám za oknem. Věřím, že krásné věci mají být i praktické, a proto mé utěrky neslouží jen jako dekorace, ale jako každodenní pomocníci v kuchyni.

Každý kus je vyšitý s péčí, zabalený s láskou a připravený udělat radost – vám nebo někomu blízkému."

### Produktové popisy (z zadání)
- Kopretina: "Luční kopretiny na přírodním lnu. Jemný motiv ve třech barvách." — Materiál: 100% český len
- Vlčí mák: "Rudý květ vlčího máku s listy. Výrazný a elegantní." — Materiál: 100% český len
- Šiška: "Detailní šiška s jehličím. Ideální dárek pro milovníky přírody." — Materiál: 100% český len
- Zástěra: "Lněná zástěra s kopretinou a humorem. „Nemám šajnu co z toho bude."" — Materiál: 100% český len

### Hodnoty (z zadání)
- 🌾 Český len — "Utěrky z prémiového 100% lnu z české tkalcovské dílny."
- 🪡 Strojová výšivka — "Precizní stehy, které vydrží roky praní."
- 🎁 Krásné balení — "Jutový provázek, visačka. Připraveno jako dárek."

### Akce 3+1 banner
"Objednáte tři utěrky a čtvrtou dostanete jako dárek." (Jen pro utěrky, nikoliv zástěru)

### Kontakt
- "Napište mi na Instagram – domluvíme motiv, počet kusů i termín."
- Velké tlačítko: odkaz na https://www.instagram.com/misiksvet/

### Patička
"© 2025 Mišik svět · Vyrobeno s láskou v Čechách"

</specifics>

<deferred>
## Deferred Ideas

- Košík a interaktivita — Phase 2
- Objednávkový formulář — Phase 3
- Zásilkovna widget — Phase 3
- EmailJS integrace — Phase 3
- Optimalizace fotek do WebP — Phase 4
- SEO meta tagy a Open Graph — Phase 4
- GitHub Pages nasazení a vlastní doména — Phase 4
- Personalizace zástěry (vlastní text) — v2
- Sezónní motivy — v2

</deferred>

---

*Phase: 01-zaklad-a-zobrazeni-produktu*
*Context gathered: 2026-03-04 from conversation + zadani-web-misiksvet.md*
