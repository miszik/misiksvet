# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-04)

**Core value:** Zakaznik si vybere uterky, sestavi objednavku a odesle ji — vse bez nutnosti opustit web nebo kontaktovat Misu pres Instagram.
**Current focus:** Phase 1 — Zaklad a zobrazeni produktu

## Current Position

Phase: 1 of 4 (Zaklad a zobrazeni produktu)
Plan: 1 of 3 in current phase
Status: In progress
Last activity: 2026-03-04 — Plan 01-01 completed (HTML kostra + CSS design system)

Progress: [█░░░░░░░░░] 10%

## Performance Metrics

**Velocity:**
- Total plans completed: 1
- Average duration: 4 min
- Total execution time: 0.1 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-zaklad-a-zobrazeni-produktu | 1 | 4 min | 4 min |

**Recent Trend:**
- Last 5 plans: 4 min
- Trend: Baseline established

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: Vanilla HTML/CSS/JS, zadny framework ani build step
- [Init]: EmailJS pres CDN pro oba emaily (zakaznik + Misa)
- [Init]: GitHub Pages hosting, relativni cesty vsude (stranka muze bezet na subdirectory URL)
- [Init]: Akce 3+1 = Math.floor(totalQty / 4) bezplatnych kusu — potreba overit pravidlo s Misou pred fazi 2
- [01-01]: GDPR text obsahuje "osobni udaje" — spravne pojmenovane zpracovani dat pro soulad s verifikaci
- [01-01]: CSS tokeny (var(--color-bg)) pouzivany v promo-banner a btn misto raw hex #faf8f4 — konzistentni design system
- [01-01]: Hero obrazek bez loading=lazy (kriticky pro LCP, je nad zalomem stranky)

### Pending Todos

None yet.

### Blockers/Concerns

- [Pre-Phase 2]: Presna pravidla akce 3+1 musi byt potvrzena s Misou pisemne pred zahajenim faze 2 (kod kosiku na tom zavisi)
- [Pre-Phase 3]: EmailJS public key musi mit nastavene omezeni domeny (Allowed Origins) v dashboardu PRED prvnim live nasazenim — bez toho muze nekdo vycerpat 200 emailu/mesic
- [Pre-Phase 3]: Oba EmailJS sablony musi byt vytvoreny a otestovany v dashboardu pred pripojenim JavaScriptu

## Session Continuity

Last session: 2026-03-04
Stopped at: Completed 01-01-PLAN.md (HTML kostra + CSS design system + .nojekyll)
Resume file: None
