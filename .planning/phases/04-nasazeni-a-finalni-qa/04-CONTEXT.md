# Phase 4: Nasazení a finální QA — Context

**Gathered:** 2026-03-05
**Status:** Ready for planning
**Source:** User discussion

<domain>
## Phase Boundary

Tato fáze dostane hotový, funkční web (košík + formulář + emaily) a připraví ho pro veřejné spuštění:
- SEO meta tagy a Open Graph pro správné sdílení na sociálních sítích
- Optimalizace obrázků do WebP formátu pod 150 KB
- Nasazení na GitHub Pages s URL misaz.github.io/misiksvet/
- Nastavení EmailJS (Allowed Origins, šablony, klíče)
- Manuální ověření na reálném telefonu

Vlastní doména misiksvet.cz není nyní připravena — web poběží na GitHub Pages URL. Doména se přidá později přes CNAME bez změny kódu.

</domain>

<decisions>
## Implementation Decisions

### Hosting URL (Locked)
- GitHub Pages: `misaz.github.io/misiksvet/`
- Repozitář: `github.com/misaz/misiksvet`
- Vlastní doména: zatím ne — CNAME připravit do souboru ale neaktivovat
- Všechny relativní cesty v kódu musí fungovat na subdirectory URL (base path `/misiksvet/`)

### Open Graph obrázek (Locked)
- Použít `fotky/kopretina.jpg` (detail utěrky s kopretinou) jako og:image
- og:title: "Mišik svět — Ručně vyšívané lněné výrobky"
- og:description: "Ručně vyšívané lněné utěrky a zástěry. Vyrobeno s láskou v Čechách."

### WebP konverze (Locked)
- Všechny fotky v `fotky/` konvertovat do WebP pod 150 KB
- Claude provede konverzi automaticky (ffmpeg / cwebp / sharp)
- Zachovat původní JPG soubory jako zálohu (nebo přejmenovat)
- HTML img src tagy aktualizovat na .webp varianty

### EmailJS prerekvizity (před spuštěním)
- Míša musí v EmailJS dashboardu:
  1. Nastavit Allowed Origins: `https://misaz.github.io`
  2. Vytvořit šablonu pro zákazníka (potvrzení objednávky)
  3. Vytvořit šablonu pro Míšu (notifikace s detaily)
  4. Zkopírovat Public Key do index.html (nahradit YOUR_EMAILJS_PUBLIC_KEY)
- Plán fáze zahrne checklist s instrukcemi

### Claude's Discretion
- Konkrétní nástroj pro WebP konverzi (cwebp, sharp, nebo jiný dostupný)
- Struktura SEO meta tagů (canonical URL, twitter:card apod.)
- Způsob nasazení na GitHub Pages (gh-pages branch nebo /docs složka nebo root main branch)
- Pořadí kroků (SEO → WebP → deploy → test)

</decisions>

<specifics>
## Specific Ideas

- GitHub Pages nejjednodušší deploy: push na `main` branch, v repo Settings → Pages → Source: main / root
- .nojekyll soubor již existuje v projektu (zabraňuje Jekyll zpracování)
- og:image URL musí být absolutní: `https://misaz.github.io/misiksvet/fotky/kopretina.webp`
- canonical tag: `<link rel="canonical" href="https://misaz.github.io/misiksvet/">`
- Mobilní test: ověřit košík, formulář, doprava, odeslání — na reálném Android/iOS zařízení

</specifics>

<deferred>
## Deferred Ideas

- Vlastní doména misiksvet.cz — přidá se přes CNAME + DNS záznamy, až bude doména koupená
- Cookie banner — out of scope (web nesleduje návštěvníky)
- Google Analytics / Plausible — out of scope pro v1
- Sitemap.xml — nice to have, ale ne blocker

</deferred>

---

*Phase: 04-nasazeni-a-finalni-qa*
*Context gathered: 2026-03-05*
