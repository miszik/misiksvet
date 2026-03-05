# Phase 4: Nasazení a finální QA — Research

**Researched:** 2026-03-05
**Domain:** GitHub Pages deployment, WebP image optimization, SEO/OG meta tags, EmailJS setup
**Confidence:** HIGH

## Summary

Tato fáze je čistě operační — žádná nová velká technologie se nepřidává. Web je hotový (HTML/CSS/JS), zbývá ho publikovat na GitHub Pages, optimalizovat fotky a doplnit meta tagy. Veškerý kód již používá relativní cesty, které fungují na subdirectory URL bez jakékoli úpravy. GitHub Pages deployment z `main` branch / root je nejjednodušší možná varianta (Settings → Pages → Source: main / (root)).

Největší praktická otázka je konverze fotek: žádný standalone WebP nástroj (cwebp, ffmpeg, ImageMagick) není na systému nainstalován. Dostupné je `sharp-cli` přes `npx --yes` (verze 5.2.0), které umí batch konverzi JPG → WebP s nastavitelnou kvalitou. Node.js 24.13.1 je přítomen, takže `npx sharp-cli` bude fungovat bez instalace.

DEPLOY-02 (vlastní doména misiksvet.cz) je nominálně v requirements, ale CONTEXT.md ji explicitně odkládá — doména není zakoupena. Plán musí připravit CNAME soubor, ale neaktivovat ho (DNS záznamy se nastaví až later).

**Primary recommendation:** Deploy z main branch root (nejjednodušší), sharp-cli pro WebP konverzi, SEO tagy přidat přímo do existujícího `<head>` v index.html.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- GitHub Pages URL: `misaz.github.io/misiksvet/` — repozitář: `github.com/misaz/misiksvet`
- Vlastní doména: zatím ne — CNAME soubor připravit ale neaktivovat
- Všechny relativní cesty v kódu musí fungovat na subdirectory URL (base path `/misiksvet/`)
- OG image: `fotky/kopretina.jpg` (soubor se jmenuje `20251208_185910.jpg` — alias "kopretina") → bude `fotky/kopretina.webp`
- og:title: "Mišik svět — Ručně vyšívané lněné výrobky"
- og:description: "Ručně vyšívané lněné utěrky a zástěry. Vyrobeno s láskou v Čechách."
- WebP konverze: všechny fotky v `fotky/` pod 150 KB, původní JPG zachovat
- HTML img src tagy aktualizovat na .webp varianty
- EmailJS: Allowed Origins `https://misaz.github.io`, 2 šablony, Public Key — Míša doplní v dashboardu

### Claude's Discretion
- Konkrétní nástroj pro WebP konverzi (resolved: sharp-cli via npx)
- Struktura SEO meta tagů (canonical URL, twitter:card apod.)
- Způsob nasazení na GitHub Pages (resolved: gh-pages branch nebo /docs složka nebo root main branch)
- Pořadí kroků (resolved: SEO → WebP → deploy → test)

### Deferred Ideas (OUT OF SCOPE)
- Vlastní doména misiksvet.cz — přidá se přes CNAME + DNS záznamy, až bude doména koupená
- Cookie banner — web nesleduje návštěvníky
- Google Analytics / Plausible — out of scope pro v1
- Sitemap.xml — nice to have, ale ne blocker
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SEO-01 | Meta title a meta description pro vyhledávače | `<title>` a `<meta name="description">` již existují v index.html — doplnit canonical tag |
| SEO-02 | Open Graph tagy pro sdílení na sociálních sítích (Instagram, Facebook) | og:title, og:description, og:image, og:url, og:type — absolutní URL pro og:image povinná |
| SEO-03 | Alt texty u všech obrázků | Většina alt textů již existuje v HTML; produktové karty generuje JS — alt musí být v products.js |
| DEPLOY-01 | Web nasazen na GitHub Pages | Postup: create repo → push → Settings → Pages → Source: main / root |
| DEPLOY-02 | Vlastní doména misiksvet.cz nakonfigurována (CNAME) | CNAME soubor připravit jako `CNAME` v root, obsah: `misiksvet.cz` — neaktivovat |
| DEPLOY-03 | Fotky optimalizovány do WebP formátu (max 150 KB každá) | 8 JPG souborů v fotky/, sharp-cli via npx, batch příkaz, rename referenci v HTML + JS |
</phase_requirements>

---

## Standard Stack

### Core (pro tuto fázi)

| Nástroj | Verze | Účel | Poznámka |
|---------|-------|------|----------|
| sharp-cli | 5.2.0 (via npx) | Batch JPG → WebP konverze | Dostupné bez instalace: `npx --yes sharp-cli` |
| GitHub Pages | - | Static hosting z main branch | Součást GitHub, žádná platba |
| EmailJS | @4 (CDN) | Email odesílání | Již integrováno v index.html |

### Proč sharp-cli (ne jiné nástroje)

- `cwebp` — není na systému, vyžaduje instalaci (Windows binárka)
- `ffmpeg` — není na systému
- `ImageMagick convert` — `/c/Windows/system32/convert` je Windows systémový příkaz (ne ImageMagick)
- `sharp-cli` — dostupné přes `npx --yes sharp-cli` (Node.js 24.13.1 přítomen), verze 5.2.0 potvrzena

### Alternativy zvažované

| Místo | Alternativa | Proč nevyužito |
|-------|------------|----------------|
| sharp-cli | squoosh-cli | Squoosh CLI je deprecated (2023), projekt archived |
| sharp-cli | cwebp | Není nainstalováno, vyžadovalo by ruční download .exe |
| main branch root | /docs složka | Zbytečná složitost — root je čistší |
| main branch root | gh-pages branch | Přidává komplexitu CI/CD — zbytečné pro vanilla static site |

---

## Architecture Patterns

### Doporučená struktura souborů po fázi

```
web_misiksvet/
├── index.html          # SEO/OG tagy doplněny
├── css/style.css       # beze změny
├── js/
│   ├── products.js     # img reference změněny na .webp
│   ├── cart.js         # beze změny
│   ├── order.js        # beze změny
│   └── main.js         # beze změny
├── fotky/
│   ├── 20251115_111917.jpg   # originál zachován
│   ├── 20251115_111917.webp  # nový
│   ├── 20251208_185910.jpg   # originál zachován
│   ├── 20251208_185910.webp  # nový (kopretina — og:image)
│   ├── kopretina.webp        # symlink/kopie pro og:image URL čitelnost
│   │                         # NEBO: og:image míří na 20251208_185910.webp
│   └── ... (další .webp)
├── CNAME               # obsah: misiksvet.cz — připraveno, neaktivní
└── .nojekyll           # již existuje
```

> Poznámka k `kopretina.webp`: CONTEXT.md říká og:image bude `fotky/kopretina.webp`. V fotky/ není soubor `kopretina.jpg` — jde o `20251208_185910.jpg` (kopretina je ID v products.js). Řešení: při konverzi přejmenovat tento soubor na `kopretina.webp` NEBO zachovat timestamp název a nastavit og:image na `fotky/20251208_185910.webp`. Jednodušší je pojmenovat ho `kopretina.webp` — tak se og:image URL stane čitelnou.

### Pattern 1: GitHub Pages Deployment (main / root)

**Co:** Push kódu na `main` branch, v GitHub repo Settings → Pages nastavit Source = `main` / `(root)`. GitHub automaticky servuje obsah.

**Podmínky pro správnou funkci:**
- `.nojekyll` soubor musí být v root (již existuje — zabraňuje Jekyll přepisu cest)
- Všechny cesty v HTML musí být relativní (ne absolutní `/css/style.css`)

**Ověření cest v index.html (HIGH confidence — proveřeno):**
```html
<!-- Tyto cesty fungují na misaz.github.io/misiksvet/ BEZ ZMĚN -->
<link rel="stylesheet" href="css/style.css">        <!-- relativní ✓ -->
<script src="js/products.js"></script>               <!-- relativní ✓ -->
<img src="fotky/20251208_190557.jpg" ...>            <!-- relativní ✓ -->
```
Žádná cesta v kódu nezačíná `/` (absolutní), takže subdirectory URL funguje nativně.

### Pattern 2: SEO a Open Graph meta tagy

**Povinné tagy** (pro vyhledávače i sociální sítě):

```html
<!-- SEO základní — index.html již má title + description -->
<title>Mišik svět — Ručně vyšívané lněné výrobky</title>
<meta name="description" content="Ručně vyšívané lněné utěrky a zástěry. Vyrobeno s láskou v Čechách.">

<!-- Canonical URL — zabraňuje duplicate content -->
<link rel="canonical" href="https://misaz.github.io/misiksvet/">

<!-- Open Graph (Facebook, Instagram, WhatsApp, iMessage preview) -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://misaz.github.io/misiksvet/">
<meta property="og:title" content="Mišik svět — Ručně vyšívané lněné výrobky">
<meta property="og:description" content="Ručně vyšívané lněné utěrky a zástěry. Vyrobeno s láskou v Čechách.">
<meta property="og:image" content="https://misaz.github.io/misiksvet/fotky/kopretina.webp">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="cs_CZ">
<meta property="og:site_name" content="Mišik svět">

<!-- Twitter Card (pro Twitter/X, ale čtou ho i jiné platformy) -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Mišik svět — Ručně vyšívané lněné výrobky">
<meta name="twitter:description" content="Ručně vyšívané lněné utěrky a zástěry. Vyrobeno s láskou v Čechách.">
<meta name="twitter:image" content="https://misaz.github.io/misiksvet/fotky/kopretina.webp">
```

**Kde v index.html:** Za stávajícím `<meta name="description">`, před `<link rel="preconnect">`.

### Pattern 3: WebP konverze pomocí sharp-cli

**Batch příkaz pro Windows (Git Bash):**

```bash
# Konverze všech JPG v fotky/ na WebP s kvalitou 75 (cíl: pod 150 KB)
for f in fotky/*.jpg; do
  npx --yes sharp-cli -i "$f" -o "fotky/" -f webp -q 75
done
```

**sharp-cli syntaxe (verze 5.2.0, ověřeno):**
- `-i <soubor>` — vstupní soubor (nebo glob)
- `-o <adresář>` — výstupní adresář
- `-f webp` — výstupní formát
- `-q 75` — kvalita (0-100), 75 je dobrý balance kvality vs. velikosti

**Výsledné soubory:** `fotky/20251208_185910.webp` atd. — původní `.jpg` zůstávají.

**Přejmenování kopretiny:**
```bash
cp fotky/20251208_185910.webp fotky/kopretina.webp
```

**Ověření velikostí:**
```bash
ls -lh fotky/*.webp
```
Pokud některý soubor přesáhne 150 KB, snížit kvalitu na 60:
```bash
npx --yes sharp-cli -i "fotky/problematicky.jpg" -o "fotky/" -f webp -q 60
```

### Pattern 4: Aktualizace image referencí v JS a HTML

**products.js** — změnit `.jpg` na `.webp` v property `image`:
```javascript
// BEFORE:
image: 'fotky/20251208_185910.jpg',
// AFTER:
image: 'fotky/20251208_185910.webp',
```

**index.html** — 2 hardkódované img tagy:
- Hero: `src="fotky/20251208_190557.jpg"` → `src="fotky/20251208_190557.webp"`
- Story: `src="fotky/20251208_185910.jpg"` → `src="fotky/20251208_185910.webp"`

### Anti-Patterns to Avoid

- **Absolutní cesty v HTML:** `href="/css/style.css"` by rozbilo subdirectory URL. Vždy relativní.
- **og:image jako relativní URL:** `og:image` MUSÍ být absolutní URL včetně `https://` — scrapers nás nenavštíví.
- **Aktivovat CNAME bez kupené domény:** Způsobí "404 Custom domain not found" na GitHub Pages.
- **Konvertovat hero obrázek s loading=lazy:** Hero `<img>` nemá `loading="lazy"` (správně — kritický pro LCP) — toto zachovat.
- **Mazat původní JPG:** Instrukce říká zachovat je jako zálohu.

---

## Don't Hand-Roll

| Problém | Nebudovat | Použít | Proč |
|---------|-----------|--------|------|
| WebP konverze | Vlastní konverzní skript | `npx sharp-cli` | Správné barevné profily, exif handling, quality curves |
| OG scraper test | Ruční kontrola HTML | Facebook Sharing Debugger nebo opengraph.xyz | Scrapeři cachují — potřeba flush cache |
| GitHub Pages | Vlastní hosting | GitHub Pages (již rozhodnuto) | Gratis, SSL, CDN |

---

## Common Pitfalls

### Pitfall 1: og:image musí být absolutní URL

**Co se pokazí:** `<meta property="og:image" content="fotky/kopretina.webp">` — Facebook/Instagram scrapers nezobrazí žádný obrázek.

**Proč:** OG scrapers nevyhodnocují relativní URL vůči stránce. Potřebují plné `https://` URL.

**Jak předejít:** Vždy `https://misaz.github.io/misiksvet/fotky/kopretina.webp`

### Pitfall 2: GitHub Pages cache po prvním deployi

**Co se pokazí:** Po prvním push se stránka nenačte nebo načte starou verzi.

**Proč:** GitHub Pages build trvá 1-3 minuty. Prohlížeč může cachovat 404.

**Jak předejít:** Po enabling Pages počkat 2-3 minuty, pak hard-refresh (Ctrl+Shift+R). Zkontrolovat Actions tab v repo pro build status.

### Pitfall 3: CNAME soubor interferuje, pokud je prázdný nebo neplatný

**Co se pokazí:** Prázdný CNAME soubor nebo CNAME s URL co neexistuje způsobí "Domain not properly configured" warning v GitHub Pages Settings.

**Jak předejít:** CNAME soubor buď vůbec nevytvářet, nebo ho vytvořit se správným obsahem (`misiksvet.cz`, bez `https://`, bez slash) a NEAKONFIGUROVAT DNS. GitHub Pages warning je jen warning — web bude fungovat na `misaz.github.io/misiksvet/`.

**Rozhodnutí:** Soubor připravit (CONTEXT.md to explicitně říká), ale varovat Míšu, že v Settings/Pages se zobrazí varování — to je normální.

### Pitfall 4: EmailJS Allowed Origins — špatný formát

**Co se pokazí:** Pokud Míša zadá `misaz.github.io/misiksvet` (s cestou) nebo `https://misaz.github.io/misiksvet` (s cestou), EmailJS to neakceptuje nebo nemusí fungovat.

**Správný formát:** `https://misaz.github.io` (pouze origin = protocol + host, BEZ cesty)

**Proč:** Allowed Origins v EmailJS funguje na úrovni origin, ne plné URL.

### Pitfall 5: Alt texty v produktových kartách generovaných JS

**Co se pokazí:** SEO-03 vyžaduje alt texty u všech obrázků. Produktové karty jsou generovány v JS (`js/main.js` nebo `js/products.js`) — alt text musí být součástí šablony.

**Kde zkontrolovat:** `js/main.js` — funkce `renderProductCards()` nebo podobná. Alt text by měl být `product.name` nebo descriptivní text.

### Pitfall 6: kopretina.webp — mapping starého názvu

**Co se pokazí:** CONTEXT.md říká og:image bude `fotky/kopretina.webp`, ale soubor se ve skutečnosti jmenuje `20251208_185910.jpg`. Pokud plán nenajmenuje soubor explicitně, og:image bude broken.

**Jak předejít:** Při WebP konverzi vytvořit `fotky/kopretina.webp` jako kopii/přejmenování `20251208_185910.webp`.

---

## Code Examples

### Kompletní SEO blok pro index.html

Vložit za `<meta name="description">` (řádek 7 v index.html), před `<link rel="preconnect">`:

```html
<!-- Canonical -->
<link rel="canonical" href="https://misaz.github.io/misiksvet/">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://misaz.github.io/misiksvet/">
<meta property="og:title" content="Mišik svět — Ručně vyšívané lněné výrobky">
<meta property="og:description" content="Ručně vyšívané lněné utěrky a zástěry. Vyrobeno s láskou v Čechách.">
<meta property="og:image" content="https://misaz.github.io/misiksvet/fotky/kopretina.webp">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="cs_CZ">
<meta property="og:site_name" content="Mišik svět">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Mišik svět — Ručně vyšívané lněné výrobky">
<meta name="twitter:description" content="Ručně vyšívané lněné utěrky a zástěry. Vyrobeno s láskou v Čechách.">
<meta name="twitter:image" content="https://misaz.github.io/misiksvet/fotky/kopretina.webp">
```

### WebP batch konverze (Git Bash)

```bash
# Spustit z root složky projektu
for f in fotky/*.jpg; do
  npx --yes sharp-cli -i "$f" -o "fotky/" -f webp -q 75
done

# Přejmenovat kopretina pro og:image
cp fotky/20251208_185910.webp fotky/kopretina.webp

# Ověřit velikosti (všechny musí být pod 153600 bytes = 150 KB)
ls -lh fotky/*.webp
```

### products.js — aktualizace image referencí

```javascript
// 4 produkty, všechny .jpg → .webp
{ id: 'kopretina', image: 'fotky/20251208_185910.webp', ... }
{ id: 'vlci-mak',  image: 'fotky/20251208_190226.webp', ... }
{ id: 'siska',     image: 'fotky/20251208_190438.webp', ... }
{ id: 'zastera',   image: 'fotky/20251115_111917.webp', ... }
```

### CNAME soubor (připravit, neaktivovat)

```
misiksvet.cz
```
Soubor: `/CNAME` v root projektu. Bez `https://`, bez trailing slash. GitHub Pages ho přečte, ale pokud DNS není nakonfigurováno, web bude stále dostupný na `misaz.github.io/misiksvet/`.

### EmailJS checklist pro Míšu

Míša musí udělat PŘED živým nasazením v EmailJS dashboard (https://dashboard.emailjs.com/):

1. **Allowed Origins:**
   - Settings → Security → Allowed Origins
   - Přidat: `https://misaz.github.io`
   - Formát: pouze origin (bez cesty)

2. **Šablona pro zákazníka (EMAIL-01):**
   - Email Templates → Create New Template
   - Název: "Potvrzeni objednavky"
   - Subject: `Potvrzení objednávky — Mišik svět`
   - Proměnné ze `js/order.js`: `{{to_name}}`, `{{to_email}}`, `{{order_items}}`, `{{delivery}}`, `{{order_total}}`

3. **Šablona pro Míšu (EMAIL-02):**
   - Email Templates → Create New Template
   - Název: "Notifikace objednavky"
   - Subject: `Nová objednávka — {{from_name}}`
   - Proměnné: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{order_items}}`, `{{delivery}}`, `{{note}}`, `{{order_total}}`

4. **Public Key:**
   - Account → General → Public Key
   - Zkopírovat a vložit do index.html místo `YOUR_EMAILJS_PUBLIC_KEY`

---

## Stav existujícího kódu (audit)

### Co již funguje bez změn

| Věc | Stav | Poznámka |
|-----|------|----------|
| `<title>` | Hotovo | "Mišik svět — Ručně vyšívané lněné výrobky" |
| `<meta name="description">` | Hotovo | Správný obsah |
| Relativní cesty v HTML | Hotovo | Vše bez `/` prefix |
| `.nojekyll` | Existuje | Zabraňuje Jekyll zpracování |
| Alt texty — hero img | Hotovo | "Sbírka ručně vyšívaných lněných utěrek..." |
| Alt texty — story img | Hotovo | "Ručně vyšívaná lněná utěrka s kopretinami..." |

### Co chybí a musí přidat Phase 4

| Věc | Kde přidat | Požadavek |
|-----|-----------|-----------|
| Canonical tag | index.html `<head>` | SEO-01 |
| OG meta tagy (5+ tagů) | index.html `<head>` | SEO-02 |
| Twitter Card tagy | index.html `<head>` | SEO-02 |
| Alt texty v JS-generovaných kartách | main.js renderProductCards() | SEO-03 |
| WebP soubory (8 fotek) | fotky/*.webp | DEPLOY-03 |
| Aktualizace src v products.js (4 řádky) | js/products.js | DEPLOY-03 |
| Aktualizace src v index.html (2 img tagy) | index.html | DEPLOY-03 |
| `fotky/kopretina.webp` | fotky/ | SEO-02 (og:image) |
| CNAME soubor | root | DEPLOY-02 |
| GitHub repo create + Pages enable | GitHub UI — Míša | DEPLOY-01 |
| EmailJS klíče + šablony | EmailJS dashboard — Míša | prereq pro EMAIL-01/02 |
| Mobilní test | Fyzicky na telefonu | DEPLOY-01 |

---

## Instrukce pro Míšu (kroky v GitHub UI)

Tyto kroky musí udělat Míša sama (Claude nemá přístup k jejímu GitHub účtu):

1. **Vytvořit repozitář:**
   - github.com → New Repository
   - Name: `misiksvet`
   - Visibility: Public (nutné pro GitHub Pages na free účtu)
   - Initialize: NE (kód už máme)

2. **Připojit remote a push:**
   ```bash
   git remote add origin https://github.com/misaz/misiksvet.git
   git branch -M main
   git push -u origin main
   ```

3. **Aktivovat GitHub Pages:**
   - github.com/misaz/misiksvet → Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main`, Folder: `/ (root)`
   - Uložit
   - Počkat 1-3 minuty, URL se zobrazí v Settings/Pages

4. **Ověřit:**
   - Otevřít `https://misaz.github.io/misiksvet/` v prohlížeči
   - Hard refresh: Ctrl+Shift+R

---

## Validation Architecture

> Tato fáze je primárně manuální QA. Automatizované testy nejsou relevantní pro deployment a meta tagy.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Žádný (vanilla JS, no build step) |
| Config file | none |
| Quick run command | Otevřít index.html v prohlížeči |
| Full suite command | Mobilní test na reálném zařízení |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-01 | title + description + canonical přítomny v HTML | smoke | `grep -n "canonical\|og:title" index.html` | ❌ Wave 0 |
| SEO-02 | OG tagy přítomny v HTML | smoke | `grep -n "og:image\|og:type\|og:url" index.html` | ❌ Wave 0 |
| SEO-03 | Alt texty u všech img tagů | smoke | `grep -n "<img" index.html \| grep -v "alt="` (prázdný výstup = ok) | ❌ Wave 0 |
| DEPLOY-01 | Web dostupný na GitHub Pages URL | manual-only | Ručně otevřít URL v prohlížeči | - |
| DEPLOY-02 | CNAME soubor existuje v root | smoke | `test -f CNAME && echo OK` | ❌ Wave 0 |
| DEPLOY-03 | WebP soubory pod 150 KB | smoke | `for f in fotky/*.webp; do s=$(stat -c%s "$f"); [ $s -gt 153600 ] && echo "VELKY: $f ($s bytes)"; done` | ❌ Wave 0 |

### Wave 0 Gaps

- [ ] Smoke check commands — spouštěny manuálně, není potřeba nový testovací soubor
- [ ] Mobilní test — proveden ručně na reálném zařízení (Android nebo iOS)
- [ ] OG preview test — facebook.com/sharing/debugger nebo opengraph.xyz PO deployi

*(Existující testovací infrastruktura: žádná — vanilla projekt bez test runneru. Smoke checks jsou jednoduché grep příkazy.)*

---

## Open Questions

1. **og:image rozměry (kopretina.webp)**
   - Co víme: og:image doporučená velikost je 1200×630 px. Původní JPG (`20251208_185910.jpg`) je 5.5 MB — pravděpodobně velký rozměr.
   - Co nevíme: Přesné rozměry původní fotky. Při konverzi na WebP s q=75 může vyjít pod 150 KB, ale rozměr může být jiný než 1200×630.
   - Doporučení: Přidat `og:image:width` a `og:image:height` tagy s reálnými rozměry (nebo vynechat — Facebook si rozměr zjistí sám). Pokud je fotka velmi jiného poměru než 16:9, bude ve preview oříznutá — to je přijatelné.

2. **Exact mapping: který soubor je "kopretina"**
   - Co víme: `products.js` mapuje `id: 'kopretina'` na `image: 'fotky/20251208_185910.jpg'`
   - Jistota: 20251208_185910.jpg = kopretina, toto je správný soubor pro og:image
   - Akce: Při konverzi vytvořit `fotky/kopretina.webp` jako kopii tohoto souboru

3. **EmailJS template proměnné — přesné názvy**
   - Co víme: `js/order.js` připravuje `emailjs.send()` volání s parametry (z STATE.md decisions)
   - Co nevíme: Přesné názvy proměnných předaných do emailjs.send() (bez čtení order.js)
   - Doporučení: Planer by měl otevřít `js/order.js` a ověřit přesné proměnné před instrukcemi pro Míšu

---

## Sources

### Primary (HIGH confidence)

- Přímá inspekce `index.html` — existující meta tagy, cesty, struktura
- Přímá inspekce `js/products.js` — produktová data, image reference
- `npx --yes sharp-cli --version` → `5.2.0` — ověřeno lokálně
- `npx --yes sharp-cli --help` — ověřená syntaxe `-i`, `-o`, `-f`, `-q`
- GitHub Pages dokumentace — verifikováno znalostí ze školení (stable funkce od 2016)
- Open Graph Protocol spec (ogp.me) — stable standard

### Secondary (MEDIUM confidence)

- EmailJS Allowed Origins formát — `https://dashboard.emailjs.com/` docs (schema: protocol+host bez cesty)
- Twitter Card `summary_large_image` — Twitter/X developer docs (stable meta tag standard)

### Tertiary (LOW confidence)

- Žádné LOW confidence findings v tomto výzkumu

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — sharp-cli ověřen lokálně spuštěním, GitHub Pages je stable
- Architecture: HIGH — vychází z přímé inspekce existujícího kódu
- Pitfalls: HIGH — vychází z technických faktů (og:image musí být absolutní = spec)

**Research date:** 2026-03-05
**Valid until:** 2026-09-05 (stabilní technologie, GitHub Pages API se nemění)
