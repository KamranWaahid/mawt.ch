# Content brief — Homepage (full, beyond hero)

> **STATUS : DRAFT — All copy below requires user validation phrase by phrase.**
>
> **Prerequisites :**
> 1. Read `.cursor/briefs/00-context-mawt-overview.md` first.
> 2. Read `.cursor/briefs/content/hero-variants.md` for the hero section (already FINAL).
> 3. Quality bar : `feedback_content_quality_bar.md` — every phrase data/voice-justified.

## Reading guide

- 🟢 = data-grounded / cross-validated decision
- 🟡 = first draft, user must validate before shipping
- 🔴 = placeholder, user must provide content

## Homepage structure (post-hero)

```
[Hero with A/B variants] — ✅ done
└──────────────────────────
[1. Trusted by]
[2. What we do — quick pitch / value props]
[3. Services overview — 5 families]
[4. Featured projects — 2-3 cases]
[5. Method snippet] — reuse from services-pillar-copy
[6. Testimonial]
[7. Bottom CTA]
└── Footer (already in dictionaries, brief 04)
```

---

## 1. Trusted by section

**Goal :** social proof immediate after hero. Logos qui établissent crédibilité range MAWT (international orgs + scale-ups + PMEs).

### 🟡 Layout

```
[H2 small / tagline]   Ils nous font confiance / Trusted by
[Logos grid]           UN · Sotheby's · Kouleta · Légumes Express · 
                       CIRO Trattoria · EMS Medical · Mellender · 
                       Crown · Diagora · SGP Security · Sartiyoon · 
                       Buzz Delivery · Phaam (à ajouter Sanity)
                       RS Detailing · Digital Admin · Swixit
```

### 🟢 FR
```
Tagline : Ils nous font confiance
```

### 🟢 EN
```
Tagline : Trusted by
```

### Implementation note
Pull logos from Sanity `partner` collection where applicable. Display 8-12 max (rotate or carousel if more). Order : 50% institutional (UN, Sotheby's) + 50% local PME (Kouleta, Légumes, etc.) — signals MAWT's range.

---

## 2. What we do — UNIFIED (value props + services link)

**Status :** ✅ VALIDATED 2026-05-27. Single section (merged the redundant "value props" + "services overview"). 5 cards = value prop + link to family pillar page.

### 🇫🇷 FINAL

**H2 :** *"Ce qu'on fait"*

```
🌐 Présence
Site, branding, e-commerce qui ressemble à votre boîte.
→ Découvrir Sites & Branding   [/fr/services/sites-et-branding]

🤖 Outils
CRM intelligent, agents IA, RAG, automatisations qui font gagner du temps.
→ Découvrir Solutions IA   [/fr/services/solutions-ia]

🎯 Stratégie
Conseil IA, audit, change management. On pense avant de coder.
→ Découvrir Conseil IA   [/fr/services/conseil-ia]

🤝 Équipe
Renfort technique et expert dédié, choisis par nous pour votre business.
→ Découvrir Renfort & Équipe   [/fr/services/renfort-equipe]

🎓 Autonomie IA
Formation ChatGPT, ateliers IA, coaching décideurs.
Vos équipes deviennent autonomes sur l'IA.
→ Découvrir Formation IA   [/fr/services/formation-ia]
```

### 🇬🇧 FINAL

**H2 :** *"What we do"*

```
🌐 Presence
Websites, branding, e-commerce that look like your business.
→ Explore Sites & Branding   [/en/services/sites-and-branding]

🤖 Tools
Smart CRMs, AI agents, RAG, automation that frees your hours.
→ Explore AI Solutions   [/en/services/ai-solutions]

🎯 Strategy
AI consulting, business audit, change management. We think before we code.
→ Explore AI Consulting   [/en/services/ai-consulting]

🤝 Team
Dedicated tech talent we curate for your business.
→ Explore Team Augmentation   [/en/services/team-augmentation]

🎓 AI Autonomy
ChatGPT training, AI workshops, leader coaching.
Your team becomes autonomous on AI.
→ Explore AI Training   [/en/services/ai-training]
```

### Layout

3+2 grid desktop (3 cards row 1, 2 cards row 2 centered), stack vertical mobile.

### ⚠️ Section 3 (Services overview) — DELETED

Previously this brief had a separate "Section 3 — Services overview" with 5 family cards. **It's been merged into section 2 above.** The homepage no longer has a duplicate services section. Visitors who want service depth click into the family pillar pages.

---

## ~~3. Services overview~~ — DELETED (merged into section 2)

**Goal :** 30-second elevator pitch right after social proof. Tell visitor WHAT MAWT does in plain language, in 3-4 props.

### Strategic angle

The hero is positioning ("équipe à taille humaine / senior humans"). This section is **WHAT** : the 4 things you actually deliver, framed as outcomes. Each one teases a family.

### 🟡 FR — 4 value props

**Section H2 :** *"Ce qu'on construit pour vous"*

```
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ 🌐 Présence      │ 🤖 Outils        │ 🎯 Stratégie     │ 🤝 Équipe        │
│ Site, branding,  │ CRM intelligent, │ Conseil IA,      │ Renfort technique│
│ e-commerce qui   │ agents IA, RAG,  │ audit, change    │ et expert dédié, │
│ convertit.       │ automatisations  │ management. On   │ choisis par nous │
│                  │ qui font gagner  │ pense avant      │ pour votre       │
│                  │ du temps.        │ de coder.        │ business.        │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘
            (Link)             (Link)             (Link)             (Link)
       → Sites & Branding  → Solutions IA    → Conseil IA     → Renfort & Équipe
```

**Note :** Formation IA (F5) n'est PAS dans les 4 value props home page principales — peut être ajoutée en 5ème ou intégrée dans Conseil IA (formation = sous-set du conseil). Cf. décisions UX à valider.

### 🟡 EN — 4 value props

**Section H2 :** *"What we build for you"*

```
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ 🌐 Presence      │ 🤖 Tools         │ 🎯 Strategy      │ 🤝 Team          │
│ Websites,        │ Smart CRMs, AI   │ AI consulting,   │ Dedicated tech   │
│ branding,        │ agents, RAG,     │ business audit,  │ talent we curate │
│ e-commerce that  │ automation that  │ change mgmt. We  │ for your         │
│ actually convert.│ frees your hours.│ think before we  │ business.        │
│                  │                  │ code.            │                  │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘
       → Sites & Branding  → AI Solutions    → AI Consulting  → Team Augmentation
```

### 🔴 Question pour toi

5 familles vs 4 value props — comment on gère Formation IA en page d'accueil ?
- Option A : 5ème value prop (égalité avec les autres familles, mais charge visuelle ++)
- Option B : Inclus dans Conseil IA (formation = formation au conseil)
- Option C : Pas visible en home, accessible via menu services uniquement
- Option D : Mentionné textuellement dans le bloc Conseil IA ("...y compris formation IA")

### 🟢 SEO note
H2 capture "ce qu'on construit / what we build" — pas SEO directly. Le SEO est dans les liens vers les familles (qui ont chacune leur keyword propre).

---

## 3. Services overview — 5 family cards

**Goal :** redirect visitor vers la famille pertinente. Visuel + court.

### 🟡 Layout

```
[H2] Toutes nos offres / All our services

[5 cards (or 4 if Formation merged) — same structure as /services overview page]

For each card :
  - Icon
  - Family name (H3)
  - 1-line value prop (different from value props above — more specific)
  - 3-4 featured services bullets
  - Link → /services/<family-slug>
```

### 🟡 FR — Section copy

**H2 :** *"Toutes nos offres"* (ou *"Découvrir tous nos services"* — à choisir)

Card descriptions (différentes des value props pour ne pas répéter) :

| Card | 1-line value prop |
|---|---|
| Sites & Branding | *"Du site vitrine au e-commerce, avec une identité qui colle à votre business."* |
| Solutions IA | *"CRM intelligent, agents IA, automatisations — construits dans vos outils, pas à côté."* |
| Conseil IA | *"On vous aide à décider où l'IA crée vraiment de la valeur. Avant de coder."* |
| Renfort & Équipe | *"Un développeur, designer ou tech lead dédié à votre projet. Choisi par nous."* |
| Formation IA | *"ChatGPT en entreprise, ateliers IA, coaching décideurs. Sur vos vrais cas."* |

### 🟡 EN — Section copy

**H2 :** *"All our services"*

| Card | 1-line value prop |
|---|---|
| Sites & Branding | *"From websites to e-commerce, with brand identity that fits your business."* |
| AI Solutions | *"Smart CRMs, AI agents, automations — built into your tools, not next to them."* |
| AI Consulting | *"We help you decide where AI actually creates value. Before any code."* |
| Team Augmentation | *"A developer, designer, or tech lead dedicated to your project. We curate."* |
| AI Training | *"ChatGPT for teams, AI workshops, leader coaching. On your real cases."* |

---

## 4. Featured projects — 3 cases (VALIDATED)

**Status :** ✅ VALIDATED 2026-05-27.

**H2 :** *"Nos cas concrets"* (FR) / *"Real-world cases"* (EN)

**3 projects :** Crown · Mellender · Légumes Express (in this order, ordered by storytelling impact)

### 🇫🇷 Teasers

```
🏛️ Crown — Transformation 360
Transformation 360 d'une PME : restructuration org, design de process, CRM intelligent.
Le patron déchargé, l'équipe autonome.
→ Lire le cas

🤖 Mellender — Lancement complet + CRM intelligent
Lancement complet d'une activité immo : branding, site avec listings, CRM intelligent avec RAG.
Tout par une même équipe.
→ Lire le cas

🛒 Légumes Express — Centralisation opérationnelle
Commandes par WhatsApp, papier, voice notes : on a tout centralisé.
App commerçant + e-shop + Odoo intégrés. Plus un site repensé.
→ Lire le cas
```

### 🇬🇧 Teasers

```
🏛️ Crown — 360° transformation
A full PME transformation: org redesign, process design, smart CRM with RAG.
Owner unblocked, team empowered.
→ Read the case

🤖 Mellender — End-to-end launch + smart CRM
Real estate from scratch: brand, listings website, smart CRM with RAG on properties.
All by the same senior team.
→ Read the case

🛒 Légumes Express — Operational centralization
WhatsApp, paper, voice-note orders: all centralized. Merchant app + e-shop + Odoo integrated.
Plus a refreshed brand.
→ Read the case
```

### CTA below the 3 cards

```
FR : Voir tous nos projets →  (link to /fr/projets)
EN : See all our projects →   (link to /en/projects)
```

### Implementation note

These teasers replace `project.excerpt` when displayed on homepage. The full case study text lives on the individual project page (Sanity content). Cursor : either override `excerpt` for these 3 in Sanity, OR hardcode the homepage teasers in `homepage-copy.ts` and use them only on home.

---

## ~~OLD Section 4 — replaced by validated content above~~

**Goal :** prouver par l'exemple. Showcase 2-3 projets variés qui montrent ton range.

### 🟡 Section H2

```
FR : Nos cas concrets    OU    Projets sélectionnés
EN : Real-world cases    OR    Selected projects
```

### 🔴 Question : quels 3 projets en homepage ?

Recommandation basée sur le portfolio actuel :
- **Crown** (transformation 360 — démontre ton offre la plus premium + différenciante)
- **Mellender** (multi-familles : branding + site listings + CRM+RAG — montre le range)
- **Légumes Express** (centralisation opérationnelle — show un cas concret PME romande)

Alternative incluant l'angle EN :
- **UN** (institutional credibility) — si tu as droit de citer le cas
- **Crown**
- **Mellender**

### 🔴 USER MUST PROVIDE
- Quels 3 projets en home (cf. options ci-dessus)
- Pour chaque : 1-line teaser (sera affichée sur la card)

### 🟡 CTA below

```
FR : Voir tous nos projets →  (link to /fr/projets)
EN : See all our projects →   (link to /en/projects)
```

---

## 5. Method snippet

**Source :** déjà drafté dans `content/services-pillar-copy.md` — A/B FR (V4 + V5) + EN single (V5).

**Réutilisation pour la homepage :** OUI — même composant `<MethodSnippet>`, même expérience Statsig. Évite la duplication et bénéficie du même apprentissage A/B.

### 🟢 Section H2

```
FR : Notre méthode
EN : Our method
```

Le snippet body lui-même est servi via Statsig (variant A/B FR).

---

## ~~6. Testimonial~~ — SECTION SUPPRIMÉE (2026-05-27)

**Decision :** Pas de section testimonial dédiée. Le bandeau "Trusted by" (section 1) + les 3 project cards (section 4) couvrent le social proof.

À reconsidérer plus tard quand des testimonials écrits formels sont collectés.

## ~~Old section 6 below — kept for reference~~

**Goal :** social proof qualitative après les projets quantifiés.

### 🔴 USER MUST PROVIDE
Au moins 1-2 testimonials authentiques :
- Citation (en langue d'origine du client)
- Auteur (nom + titre + entreprise)
- Optionnel : photo

### 🟡 Si pas encore de testimonials écrits

Tu peux contacter Mellender, Crown, Légumes, etc. avec un draft de témoignage qu'ils valident/ajustent. Pattern qui marche :

```
"Avec MAWT, on a [résultat concret en chiffres si possible]. 
On savait qu'on parlait à des décideurs, pas à des chefs de projet. 
[Mention du différenciateur perçu : qualité / vitesse / partnership]."

— [Prénom Nom], [Titre], [Entreprise]
```

À récupérer comme données Sanity `testimonial` documents.

### 🟡 Section layout

```
[H2 small / no H2 — directly the quote]
"..." (large quote)
— Author, Title, Company
[Optional avatar circle]
```

---

## 7. Bottom CTA — A/B TEST (VALIDATED)

**Status :** ✅ VALIDATED 2026-05-27. A/B test via Statsig.

### Experiment : `mawt_bottom_cta_fr` (50/50)

**V1 baseline `v1_30min` :**
```
H2   : Discutons de votre projet
Body : 30 minutes pour comprendre votre besoin. Pas de devis bâclé, pas de pression.
       Juste un échange direct avec ceux qui vont construire.
CTAs : [Démarrer]  [Voir nos projets]
```

**V3 challenger `v3_specific_process` :**
```
H2   : Décrivez-nous votre besoin
Body : En 5 lignes. On vous répond en 24h avec une première analyse honnête —
       si c'est pour nous, on vous le dit. Sinon aussi.
CTAs : [Démarrer]  [Voir nos projets]
```

### Experiment : `mawt_bottom_cta_en` (50/50)

**V1 baseline `v1_30min` :**
```
H2   : Let's talk about your project
Body : 30 minutes to understand your needs. No rushed quote, no pressure.
       Just a direct conversation with the people who will build it.
CTAs : [Get started]  [See our work]
```

**V3 challenger `v3_specific_process` :**
```
H2   : Tell us about your need
Body : In 5 lines. We respond in 24h with an honest first take —
       if it's for us, we say so. If not, also.
CTAs : [Get started]  [See our work]
```

### Metrics

- Primary : `bottom_cta_click` (clic sur Démarrer/Get started)
- Secondary : `contact_form_submit`
- Allocation : 50/50 sticky bucketing
- Duration : 4 weeks ou 95% confidence

### Implementation

Ajout dans `src/content/bottom-cta-copy.ts`. Component `<BottomCta lang={lang} />` lit le variant Statsig. Brief 10 doit ajouter ces 2 experiments.

## ~~Old Bottom CTA section below~~

**Goal :** dernière fenêtre de conversion avant le footer.

### 🟡 FR
```
H2   : Discutons de votre projet
Body : 30 minutes pour comprendre votre besoin. Pas de devis bâclé, 
       pas de pression. Juste un échange direct avec ceux qui vont construire.
CTAs : [Démarrer]  [Voir nos projets]
        → /fr/contact   → /fr/projets
```

### 🟡 EN
```
H2   : Let's talk about your project
Body : 30 minutes to understand your needs. No rushed quote, no pressure. 
       Just a direct conversation with the people who will build it.
CTAs : [Get started]  [See our work]
        → /en/contact   → /en/projects
```

---

## SEO meta — homepage — A/B TEST (VALIDATED + edge experiment)

**Status :** ✅ VALIDATED 2026-05-27. User insisted on A/B testing the FR meta title via edge experiment.

### ⚠️ Implementation note

SEO meta A/B testing requires **edge-level variant assignment** (server-side, deterministic per visitor) + careful monitoring of organic CTR from Google SERPs.

**How it works :**
- Visitor lands on `/fr` from Google
- Edge middleware reads visitor's `mawt_uid` cookie (set in brief 05)
- Hash the UID → determine variant (50/50)
- Set the meta tag in the HTML response accordingly
- Statsig logs the `meta_variant_assigned` event for attribution
- After 8-12 weeks, compare organic CTR per variant via Google Search Console (filter by start_date when test launched)

**Risks :**
- Google might index different metas alternately, leading to noisy SERP behavior
- CTR signal noisy on low organic volume
- Don't change OTHER on-page SEO during the test or you can't attribute

**Recommendation :** Run this LAST after other A/B experiments are settled, to avoid attribution confusion.

### Experiment : `mawt_meta_home_fr` (50/50, edge)

**V1 `v1_short` :**
```
Title       : MAWT — Solutions IA & conseil à Genève
Description : Équipe à taille humaine basée à Genève. CRM intelligents, agents IA, 
              conseil & renfort d'équipe pour PME suisses et organisations internationales.
```

**V2 `v2_longer` :**
```
Title       : MAWT — Solutions IA, conseil & développement à Genève
Description : Équipe à taille humaine basée à Genève. CRM intelligents, agents IA, 
              conseil & renfort d'équipe pour PME suisses et organisations internationales.
```

### EN meta — SINGLE (no A/B)

```
Title       : MAWT — AI solutions, consulting & development from Geneva
Description : Senior human team based in Geneva. Smart CRMs, AI agents, consulting & 
              dedicated talent for ambitious organizations across Europe.
```

### Metric
Organic CTR from Google SERPs over 8-12 weeks (measured in Search Console).

---

## ~~Old SEO meta section below~~

### 🟡 FR
```
Title       : MAWT — Solutions IA, conseil & développement à Genève
Description : Équipe à taille humaine basée à Genève. CRM intelligents, agents IA, 
              conseil & renfort d'équipe pour PME suisses et organisations internationales.
```

(155 chars max — à raccourcir si besoin)

### 🟡 EN
```
Title       : MAWT — AI solutions, consulting & development from Geneva
Description : Senior human team based in Geneva. Smart CRMs, AI agents, consulting 
              & dedicated talent for ambitious organizations across Europe.
```

---

## Schema.org structured data (homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MAWT",
  "url": "https://mawt.ch",
  "logo": "https://mawt.ch/logo.svg",
  "description": "...",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Carouge",
    "addressRegion": "Geneva",
    "postalCode": "1227",
    "addressCountry": "CH"
  },
  "sameAs": [
    "https://linkedin.com/company/mawt",
    "https://instagram.com/mawt.ch",
    "https://github.com/mawt"
  ]
}
```

---

## What still needs user input (consolidated)

| Item | Why |
|---|---|
| 🔴 Decision : 4 ou 5 value props (Formation IA en home ?) | Affects layout AND value prop copy |
| 🔴 Choix des 3 projets en home + teasers | Critical : showcases your range |
| 🔴 Testimonial(s) — au moins 1 réel | Otherwise this section is empty or fake |
| 🟡 All hero variants — DÉJÀ FINAL | OK, déjà validé |
| 🟡 4 value props copy | Each needs sign-off — propose validation phrase par phrase |
| 🟡 5 family card teasers | Each ~1 line, easy to validate |
| 🟡 Bottom CTA copy | Easy validation |
| 🟡 Meta title + description | SEO-critical, ≤60 / ≤155 chars |

## Implementation note

Cursor : when this brief is validated, save the homepage copy in `src/content/homepage-copy.ts` (similar structure to `HERO_COPY` + `METHOD_COPY`). Component file is `src/app/[lang]/page.tsx`.

The homepage component composes :
1. `<Hero lang={lang} />` (uses A/B Statsig — brief 10)
2. `<TrustedBy lang={lang} />` (pulls logos from Sanity partner)
3. `<HomeValueProps lang={lang} />` (4 or 5 cards)
4. `<HomeServicesOverview lang={lang} />` (5 family cards)
5. `<HomeFeaturedProjects lang={lang} />` (3 cards from Sanity)
6. `<MethodSnippet lang={lang} />` (uses A/B Statsig — brief 10)
7. `<HomeTestimonial lang={lang} />` (1-2 from Sanity)
8. `<HomeBottomCTA lang={lang} />`

Each component reads from `homepage-copy.ts` for text + Sanity for dynamic data.
