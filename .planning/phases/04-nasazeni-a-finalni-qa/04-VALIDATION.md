---
phase: 4
slug: nasazeni-a-finalni-qa
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-05
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser + CLI scripts (no test framework — static HTML site) |
| **Config file** | none |
| **Quick run command** | `npx --yes sharp-cli --version` (ověří nástroj) |
| **Full suite command** | Manuální checklist v prohlížeči + `git push` + GitHub Pages URL |
| **Estimated runtime** | ~5 minut manuální verifikace |

---

## Sampling Rate

- **Po každém task commitu:** Otevřít index.html lokálně, ověřit změnu
- **Po každé vlně:** Zkontrolovat relevantní sekci checklistu
- **Před `/gsd:verify-work`:** Celý manuální checklist zelený, web dostupný na GitHub Pages URL

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | SEO-01 | manual | otevřít index.html, zkontrolovat `<head>` | ✅ | ⬜ pending |
| 4-01-02 | 01 | 1 | SEO-02 | manual | Facebook Sharing Debugger nebo ručně | ✅ | ⬜ pending |
| 4-01-03 | 01 | 1 | SEO-03 | CLI | `npx --yes sharp-cli -i fotky/*.jpg -o fotky/ -f webp -q 75` | ✅ W0 | ⬜ pending |
| 4-02-01 | 02 | 2 | DEPLOY-01 | manual | otevřít misaz.github.io/misiksvet/ v prohlížeči | ❌ W0 | ⬜ pending |
| 4-02-02 | 02 | 2 | DEPLOY-02 | manual | sdílet URL, ověřit OG náhled | ❌ W0 | ⬜ pending |
| 4-02-03 | 02 | 2 | DEPLOY-03 | manual | otevřít na reálném telefonu, projít košík + formulář | ❌ W0 | ⬜ pending |

---

## Wave 0 Requirements

- [ ] GitHub repozitář `misaz/misiksvet` vytvořen (Míša v GitHub UI)
- [ ] Kód pushnut na `main` branch
- [ ] GitHub Pages aktivován v Settings → Pages → Source: main / root

*Wave 0 je manuální akce Míši — nutná prerekvizita před Wave 2 (deploy ověření).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Web dostupný na GitHub Pages URL | DEPLOY-01 | Vyžaduje GitHub repo + Pages setup | Otevřít misaz.github.io/misiksvet/ po push |
| OG náhled při sdílení | DEPLOY-02 | Vyžaduje živou URL | Sdílet odkaz na FB nebo použít opengraph.xyz |
| Mobilní test košík + formulář | DEPLOY-03 | Vyžaduje reálné zařízení | Projít celý tok na telefonu |
| EmailJS funkčnost | ORDER-01 | Vyžaduje správně nakonfigurované klíče | Odeslat testovací objednávku |

---

## Validation Sign-Off

- [ ] Všechny tasky mají manuální verify instrukce nebo Wave 0 závislosti
- [ ] SEO tagy ověřeny v `<head>` před deployem
- [ ] WebP soubory existují a jsou < 150 KB
- [ ] GitHub Pages URL funguje
- [ ] `nyquist_compliant: true` nastavit v frontmatter po dokončení

**Approval:** pending
