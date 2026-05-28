# MAWT — Project Context & Working Rules

> **Read this first.** Every brief in this folder assumes you've read this document.
> This is the source of truth for MAWT's positioning, voice, structure, and conventions.

---

## 1. What MAWT is

MAWT is a Swiss studio that builds AI-native systems, advises on AI adoption, and embeds dedicated experts into client organizations. The team is small, senior, and Geneva-based.

**Not an agency. Not a SaaS. Not a freelancer marketplace.** A studio of senior humans that selects and assigns experts to client businesses, builds intelligent custom systems (CRMs with RAG, AI agents, automations), and advises decision-makers on AI strategy.

Real clients span the spectrum: from international organizations (UN, Sotheby's) to Geneva PMEs (Légumes Express, Mellender, DG Expertise, CIRO) to scale-ups (Digital Admin, Swixit, EMS, Diagora) and transformation projects (Crown).

## 2. Positioning (strict)

**One sentence:** *MAWT — Senior humans building AI-native systems and advising on AI adoption. Geneva-based, hands-on, no intermediaries.*

**Differentiator:** MAWT does **both** organizational consulting AND technical build, with AI as the modern execution layer. This combination is rare — most consultancies don't ship code, most build shops don't reorganize companies.

**Audience split:**
- 🇫🇷 **Suisse romande PMEs** → ton local, direct, problem-solver
- 🇬🇧 **International tech / enterprise (UN, MNCs, scale-ups, EN-speaking CH)** → senior humans, premium, AI-fluent

These two audiences are **equally important**, not "FR primary + EN secondary". Each language has its own native voice — not translations.

## 3. Brand voice & vocabulary

### ❌ NEVER use (forbidden in copy)
- "PowerPoint" (cliché)
- "Usine à gaz" (cliché)
- "Petite équipe" / "small team" (diminishing). Use "team at human scale" / "senior team" instead
- "Agence digitale" / "digital agency" (explicitly rejected by founder)
- "Hire" + "freelance" in F4 services (MAWT curates and assigns experts. We don't rent freelancers)
- "MAWT for Enterprise / for Personal / for SMB" template segmentation (MAWT doesn't segment offer by client size)
- Word-for-word translations between FR and EN
- **DASHES of any kind in copy. ABSOLUTE RULE.** No `-`, no `–`, no `—`. Use periods, commas, colons, or parentheses instead. See `feedback_no_dashes.md` in user memory for replacement patterns. Exceptions : URLs/slugs, e-commerce/e-mail, dates (2024-2026), compound words (sur-mesure)

### ✅ VALIDATED vocabulary
**French:**
- "À taille humaine" (human scale)
- "Problem solver numérique"
- "Équipe à taille humaine"
- "Pas d'intermédiaires, pas de couches"
- "Genève / Suisse romande" (geographic anchoring)
- "Sur-mesure"
- "PME suisses"

**English:**
- "Senior humans" (signature)
- "Built by senior humans"
- "Geneva-based" (anchoring)
- "AI-native systems"
- "Custom AI"
- "No layers. No outsourcing. No PowerPoint." (only as full punchline)
- "Dedicated" (vs "hired/freelance")
- "Embedded experts"
- "Optimize" (positive — vs "cut", which is defensive)
- "From UN to scale-ups" (social proof pattern)

### Tone rules
- Direct, no fluff
- Anti-corporate without being aggressive
- Human and confident
- Specific (mention real clients, real outcomes) > vague
- Same tonal punch in both languages, expressed naturally per language

## 4. Catalog — 5 families (v18)

```
🌐 F1 Sites & Branding           🤖 F2 Solutions IA               🎯 F3 Conseil IA
   /sites-et-branding (FR)          /solutions-ia (FR)               /conseil-ia (FR)
   /sites-and-branding (EN)         /ai-solutions (EN)               /ai-consulting (EN)

🎓 F5 Formation IA               🤝 F4 Renfort & Équipe
   /formation-ia (FR)               /renfort-equipe (FR)
   /ai-training (EN)                /team-augmentation (EN)
```

**Detail per family:** see brief `02-services-restructure.md`.

**Strategic frame:**
- 2 families out of 5 explicitly carry AI (F2 + F3) → strong AI visibility without being "100% AI"
- F1 is the heritage (still revenue but in SEO decline)
- F4 is the recurring revenue stream (curated experts assigned to clients)
- F5 is the emerging offer (AI training/coaching)

## 5. URL strategy — Localized B3 (fully translated)

Every slug is translated FR ↔ EN. Examples:
- `/fr/projets` ↔ `/en/projects`
- `/fr/a-propos` ↔ `/en/about`
- `/fr/services/solutions-ia/crm-intelligent` ↔ `/en/services/ai-solutions/smart-crm`
- `/fr/clients` ↔ `/en/partners`
- `/fr/notre-methode` ↔ `/en/our-process`

**Implementation:** see brief `05-routing-localized-b3.md` for the full mapping table + middleware approach.

## 6. Multilingual content rule

**Everything bilingual, adapted per audience — never word-for-word translation.**

| Content type | FR + EN required? | Same content? |
|---|---|---|
| Pages services (pillar + detail) | ✅ Yes both | Adapted by audience |
| Homepage | ✅ Yes both | Different hero per audience |
| About, contact, faqs, legal | ✅ Yes both | Adapted, native |
| Case studies (/projets) | ✅ Yes both | Adapted, can emphasize different angles per language |
| Blog posts | ✅ Yes both | Adapted; EN-first or FR-first OK if topic warrants |
| Vocabulary in nav, buttons | ✅ Yes both | Translated |

**Schema implementation:** see brief `01-sanity-multilingual.md`.

## 7. Technical stack

- **Next.js 16+** (latest, NOT the Next.js you know from training data — read `node_modules/next/dist/docs/` for current APIs)
- **Sanity CMS** — Project ID `ewciugup`, dataset `production`, studio at `/studio`
- **Hosting** — Hostinger (NOT Vercel — Vercel-specific features unavailable)
- **i18n** — `[lang]` segment routing, dictionaries at `src/dictionaries/{en,fr}.json` for UI strings
- **A/B testing** — Statsig free tier (compatible Hostinger)
- **Analytics** — to be decided (Plausible recommended, self-hostable)

## 8. Working rules for Cursor

### Always
- Read this file at the start of every task
- Reference the relevant detailed brief (`01-*.md`, `02-*.md`, etc.)
- Use the validated vocabulary
- Ask user when a major architectural choice arises that isn't in a brief
- Match the bilingual rule (when adding/editing content, both FR and EN)

### Never
- Use forbidden vocabulary
- Translate word-for-word
- Add new services/pages outside v18 catalog without explicit permission
- Use SaaS templates (segmentation by size, status pages, help centers, community pages)
- Skip the brief — every task should map to a brief in this folder

### When in doubt
- Default to brand coherence over SEO mainstream
- Default to "less is more" — MAWT is human-scale, not a content factory
- Surface the doubt to user, don't silently make a call

## 9. Decision log

Strategic decisions made and locked (see also `~/.claude/projects/-Users-andrewawad-Documents-mawt-ch/memory/`):
- 5-family catalog (v18 final)
- Localized URL strategy (B3)
- Bilingual everywhere, adapted per audience
- Hero A/B testing via Statsig (FR 3-variant, EN 2-variant)
- 13 routes to delete + 3 to keep (partners→clients, process→notre-methode, security→securite)
- "Dedicated" instead of "freelance/hire" in F4 (brand coherence over SEO)
- F5 Formation IA as dedicated family (not service under F3)
- Compromise: dedicated in name, hire-* as H2 SEO capture in F4 pages

## 10. Index of detailed briefs

| # | Brief | Status |
|---|---|---|
| 01 | sanity-multilingual.md | To draft |
| 02 | services-restructure.md | To draft |
| 03 | post-schema-update.md | To draft |
| 04 | routes-cleanup.md | To draft |
| 05 | routing-localized-b3.md | To draft |
| 06 | navbar-from-siteSettings.md | To draft |
| 07 | pillar-pages-services.md | To draft |
| 08 | service-detail-pages.md | To draft |
| 09 | projects-blog-pages.md | To draft |
| 10 | ab-testing-statsig.md | To draft |
| content/homepage-hero-variants.md | A/B variants FR + EN | To draft |
| content/services-pillar-copy.md | Copy 5 pillar pages | To draft |
| content/about-page.md | Page /a-propos | To draft |

---

**Last updated:** 2026-05-27
