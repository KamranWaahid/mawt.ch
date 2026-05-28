# Content brief — Homepage (full, beyond hero)

> **STATUS : ✅ VALIDATED 2026-05-28. All sections final.**
> Cleanup pass applied : no dashes in copy, no UN/Sotheby's mentions, deleted sections removed.
>
> **Prerequisites :**
> 1. `.cursor/briefs/00-context-mawt-overview.md`
> 2. `.cursor/briefs/content/hero-variants.md` (hero is in a separate brief)
> 3. Voice rules : NO dashes (-, –, —) in copy, NO international orgs mentions, NO inflated stats.

## Homepage structure (post hero)

```
[Hero with A/B variants]  → see content/hero-variants.md
└──────────────────────────
1. Trusted by (logos band)
2. What we do (5 family cards, merged value props + services)
3. Featured projects (Crown, Mellender, Légumes Express)
4. Method snippet (A/B FR + EN single)
5. Bottom CTA (A/B both languages)
└── Footer (already in dictionaries)
```

---

## 1. Trusted by section

**Goal :** social proof immediate after hero. Logos that establish MAWT credibility across PME suisses and scale-ups commerciales.

### Layout
```
[H2 small / tagline]   Ils nous font confiance / Trusted by
[Logos grid]           Mellender, Crown, Légumes Express, Kouleta,
                       CIRO, EMS, SGP Security, Sartiyoon, Buzz Delivery,
                       rs detailing, Diagora, Digital Admin, Swixit, phaam.ch
```

### 🇫🇷
```
Tagline : Ils nous font confiance
```

### 🇬🇧
```
Tagline : Trusted by
```

### Implementation note
Pull logos from Sanity `partner` collection. Display 8 to 12 max (rotate or carousel if more). Order : mix of PME suisses and scale-ups commerciales. No international organisations in this band (brand positioning decision).

---

## 2. What we do (5 family cards)

**Status :** ✅ VALIDATED 2026-05-27. Single section (merged the redundant "value props" and "services overview"). 5 cards = value prop + link to family pillar page.

### 🇫🇷

**H2 :** *"Ce qu'on fait"*

```
🌐 Présence
Site, branding, e-commerce qui ressemble à votre boîte.
→ Découvrir Sites et Branding   [/fr/services/sites-et-branding]

🤖 Outils
CRM intelligent, agents IA, RAG, automatisations qui font gagner du temps.
→ Découvrir Solutions IA   [/fr/services/solutions-ia]

🎯 Stratégie
Conseil IA, audit, change management. On pense avant de coder.
→ Découvrir Conseil IA   [/fr/services/conseil-ia]

🤝 Équipe
Renfort technique et expert dédié, choisis par nous pour votre business.
→ Découvrir Renfort et Équipe   [/fr/services/renfort-equipe]

🎓 Autonomie IA
Formation ChatGPT, ateliers IA, coaching décideurs.
Vos équipes deviennent autonomes sur l'IA.
→ Découvrir Formation IA   [/fr/services/formation-ia]
```

### 🇬🇧

**H2 :** *"What we do"*

```
🌐 Presence
Websites, branding, e-commerce that look like your business.
→ Explore Sites and Branding   [/en/services/sites-and-branding]

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

---

## 3. Featured projects (3 cases)

**Status :** ✅ VALIDATED 2026-05-27.

**H2 :** *"Nos cas concrets"* (FR) / *"Real cases"* (EN)

**3 projects :** Crown, Mellender, Légumes Express (in this order, picked for storytelling impact and range coverage).

### 🇫🇷 Teasers
```
🏛️ Crown. Transformation 360.
Restructuration org, refonte tech, CRM intelligent avec RAG.
Le patron déchargé, l'équipe autonome.
→ Lire le cas

🤖 Mellender. Lancement complet et CRM intelligent.
Branding, site avec listings, CRM intelligent avec RAG.
Tout par une même équipe.
→ Lire le cas

🛒 Légumes Express. Commandes multicanal centralisées.
Web, partenaires, téléphone. Tout regroupé dans un seul tableau de bord.
Plus une marque rafraîchie.
→ Lire le cas
```

### 🇬🇧 Teasers
```
🏛️ Crown. 360 transformation.
Org restructuring, tech rebuild, smart CRM with embedded RAG.
Owner unblocked, team empowered.
→ Read the case

🤖 Mellender. End to end launch and smart CRM.
Brand, listings website, smart CRM with RAG on properties.
All by the same senior team.
→ Read the case

🛒 Légumes Express. Multichannel orders centralised.
Web, partner platforms, phone. All in one dashboard.
Plus a refreshed brand.
→ Read the case
```

### CTA below the 3 cards
```
FR : Voir tous nos projets →  (link to /fr/projets)
EN : See all our projects →   (link to /en/projects)
```

### Implementation note
These teasers replace `project.cardTeaser` when displayed on homepage. The full case study text lives on the individual project page (see `content/projects-case-studies.md`).

---

## 4. Method snippet

**Source :** drafted in `content/services-pillar-copy.md`. A/B FR (V4 + V5) and EN single.

**Reuse on homepage :** YES. Same `<MethodSnippet>` component, same Statsig experiment. Avoids duplication and benefits from the same A/B learnings.

### Section H2
```
FR : Notre méthode
EN : Our method
```

The snippet body is served via Statsig (variant A/B FR).

---

## 5. Bottom CTA (A/B test)

**Status :** ✅ VALIDATED 2026-05-27.

### Experiment `mawt_bottom_cta_fr` (50/50)

**V1 baseline `v1_30min` :**
```
H2   : Discutons de votre projet
Body : 30 minutes pour comprendre votre besoin. Pas de devis bâclé, pas de pression. Juste un échange direct avec ceux qui vont construire.
CTAs : [Démarrer]  [Voir nos projets]
```

**V3 challenger `v3_specific_process` :**
```
H2   : Décrivez nous votre besoin
Body : En 5 lignes. On vous répond en 24h avec une première analyse honnête. Si c'est pour nous, on vous le dit. Sinon aussi.
CTAs : [Démarrer]  [Voir nos projets]
```

### Experiment `mawt_bottom_cta_en` (50/50)

**V1 baseline `v1_30min` :**
```
H2   : Let's talk about your project
Body : 30 minutes to understand your needs. No rushed quote, no pressure. Just a direct conversation with the people who will build it.
CTAs : [Get started]  [See our work]
```

**V3 challenger `v3_specific_process` :**
```
H2   : Tell us about your need
Body : In 5 lines. We respond in 24h with an honest first take. If it's for us, we say so. If not, also.
CTAs : [Get started]  [See our work]
```

### Metrics
- Primary : `bottom_cta_click` (clic sur Démarrer / Get started)
- Secondary : `contact_form_submit`
- Allocation : 50/50 sticky bucketing
- Duration : 4 weeks or 95% confidence

### Implementation
Add to `src/content/bottom-cta-copy.ts`. Component `<BottomCta lang={lang} />` reads the Statsig variant. Brief 10 already includes these 2 experiments.

---

## SEO meta (homepage, A/B test FR + EN single)

**Status :** ✅ VALIDATED 2026-05-28. FR meta runs as edge experiment.

### Implementation note

SEO meta A/B testing requires edge level variant assignment (server side, deterministic per visitor) + careful monitoring of organic CTR from Google SERPs.

How it works :
- Visitor lands on `/fr` from Google
- Edge middleware reads visitor `mawt_uid` cookie (set in brief 05)
- Hash the UID, determine variant (50/50)
- Set the meta tag in the HTML response accordingly
- Statsig logs `meta_variant_assigned` event for attribution
- After 8 to 12 weeks, compare organic CTR per variant via Google Search Console

Risks :
- Google might index different metas alternately, leading to noisy SERP behaviour
- CTR signal noisy on low organic volume
- Don't change other on page SEO during the test or attribution breaks

Recommendation : run this LAST after other A/B experiments are settled.

### Experiment `mawt_meta_home_fr` (50/50, edge)

**V1 `v1_short` :**
```
Title       : MAWT. Solutions IA et conseil à Genève
Description : Équipe à taille humaine basée à Genève. CRM intelligents, agents IA, conseil et renfort d'équipe pour PME suisses et scale-ups commerciales.
```

**V2 `v2_longer` :**
```
Title       : MAWT. Solutions IA, conseil et développement à Genève
Description : Équipe à taille humaine basée à Genève. CRM intelligents, agents IA, conseil et renfort d'équipe pour PME suisses et scale-ups commerciales.
```

### EN meta (single, no A/B)
```
Title       : MAWT. AI solutions, consulting and development from Geneva
Description : Senior human team based in Geneva. Smart CRMs, AI agents, consulting and dedicated talent for ambitious businesses across Europe.
```

### Metric
Organic CTR from Google SERPs over 8 to 12 weeks (measured in Search Console).

---

## Schema.org structured data (homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MAWT",
  "url": "https://mawt.ch",
  "logo": "https://mawt.ch/logo.svg",
  "description": "Studio à taille humaine basé à Genève. Solutions IA sur mesure, conseil IA, sites web et branding, renfort d'équipe, formation IA pour PME suisses et scale-ups commerciales.",
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

## Implementation note

Cursor : save the homepage copy in `src/content/homepage-copy.ts` (similar structure to `HERO_COPY` + `METHOD_COPY`). Component file is `src/app/[lang]/page.tsx`.

The homepage component composes :
1. `<Hero lang={lang} />` (uses A/B Statsig, brief 10)
2. `<TrustedBy lang={lang} />` (pulls logos from Sanity partner)
3. `<HomeWhatWeDo lang={lang} />` (5 family cards)
4. `<HomeFeaturedProjects lang={lang} />` (3 cards from Sanity)
5. `<MethodSnippet lang={lang} />` (uses A/B Statsig, brief 10)
6. `<HomeBottomCTA lang={lang} />` (uses A/B Statsig, brief 10)

Each component reads from `homepage-copy.ts` for text and Sanity for dynamic data.
