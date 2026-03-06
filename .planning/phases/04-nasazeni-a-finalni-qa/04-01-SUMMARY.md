---
phase: 04-nasazeni-a-finalni-qa
plan: "01"
subsystem: seo-webp
tags: [seo, open-graph, webp, images, meta-tags]
dependency_graph:
  requires: []
  provides: [seo-og-meta, webp-images]
  affects: [index.html, js/products.js, fotky/]
tech_stack:
  added: [sharp-cli@5.2.0]
  patterns: [WebP image conversion with resize, Open Graph meta tags, Twitter Card]
key_files:
  created:
    - fotky/kopretina.webp
    - fotky/vlci-mak.webp
    - fotky/siska.webp
    - fotky/zastera.webp
    - fotky/kolekce.webp
  modified:
    - index.html
    - js/products.js
decisions:
  - "WebP konverze: q=60 + resize 900px sirky — original q=75 bez resize produkoval 1.5 MB soubory; 900px/q60 dava ~120 KB"
  - "Originalni JPG zachovany — zmeneno pouze pojmenovani WebP kopii (timestamp -> citatelny nazev)"
metrics:
  duration: "3 min"
  completed_date: "2026-03-06"
  tasks_completed: 2
  files_created: 5
  files_modified: 2
---

# Phase 04 Plan 01: SEO/WebP konverze Summary

**One-liner:** Open Graph + Twitter Card meta tagy v index.html s absolutnimi URL; 5 fotek WebP pod 150 KB (900px/q60).

## What Was Built

### WebP soubory (fotky/)

| Soubor | Velikost | Pouziti |
|--------|----------|---------|
| kopretina.webp | 126 KB | OG image + story img + product card |
| vlci-mak.webp | 132 KB | product card |
| siska.webp | 131 KB | product card |
| zastera.webp | 21 KB | product card |
| kolekce.webp | 92 KB | hero img |

Vsechny pod limitem 150 KB (153 600 B). Originalni JPG zachovany.

### SEO/OG blok pridany do index.html (za `<meta name="description">`)

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

### Zmeny img src v index.html

| Sekce | Pred | Po |
|-------|------|----|
| Hero (#hero) | fotky/20251208_190557.jpg | fotky/kolekce.webp |
| Story (#pribeh) | fotky/20251208_185910.jpg | fotky/kopretina.webp |

### Zmeny v js/products.js (pred/po)

| id | Pred | Po |
|----|------|----|
| kopretina | fotky/20251208_185910.jpg | fotky/kopretina.webp |
| vlci-mak | fotky/20251208_190226.jpg | fotky/vlci-mak.webp |
| siska | fotky/20251208_190438.jpg | fotky/siska.webp |
| zastera | fotky/20251115_111917.jpg | fotky/zastera.webp |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] WebP konverze s q=75 bez resize produkovala soubory 1.5 MB**
- **Found during:** Task 1 — overeni velikosti po konverzi
- **Issue:** sharp-cli s -q 75 bez zmeny rozliseni produkoval soubory 1.2-1.6 MB (fotky jsou 5 MP+). Limit je 150 KB.
- **Fix:** Pridana `resize 900` (max sirka 900px) + snizena kvalita na q=60. Vysledek: 21-132 KB.
- **Files modified:** fotky/kopretina.webp, vlci-mak.webp, siska.webp, zastera.webp, kolekce.webp
- **Commit:** 54babe9

## Commits

| Task | Commit | Popis |
|------|--------|-------|
| Task 1 | 54babe9 | chore(04-01): konverze fotek do WebP formatu pod 150 KB |
| Task 2 | 3beed70 | feat(04-01): SEO/OG meta tagy a .webp img src v index.html a products.js |

## Smoke Check Results

| Check | Vysledek |
|-------|----------|
| 5 WebP souboru existuje | OK |
| Vsechny WebP pod 150 KB | OK (max 132 KB) |
| 9+ og: shod v index.html | OK (9) |
| Canonical tag pritomen | OK |
| Zadny img tag s .jpg v index.html | OK |
| 4 produkty s .webp v products.js | OK |
