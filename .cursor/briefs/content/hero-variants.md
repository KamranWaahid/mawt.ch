# Content brief — Homepage hero variants (A/B testing)

> **Prerequisites:**
> 1. Read `.cursor/briefs/00-context-mawt-overview.md` first.
> 2. **DEPENDS ON brief 10** (ab-testing-statsig — variants are rendered via Statsig experiment).
> 3. These variants are FINAL — validated by user. Don't modify the copy.

## Context

Homepage hero A/B testing setup. 3 variants FR + 2 variants EN, served via Statsig.

The variants are **strategically different** (each tests a different positioning hypothesis), not minor wording changes. Don't merge or simplify them.

## Variants — FINAL COPY

### 🇫🇷 FRENCH — 3 variants (33/33/33 split)

#### V1 — Baseline : Équipe à taille humaine + accès direct

**Hypothesis tested :** "Le client veut un interlocuteur direct, valorise la relation humaine sans intermédiaires."

```
H1   : Une équipe à taille humaine pour vos enjeux numériques.
H2   : On construit. On conseille. On déploie l'IA. Vous parlez aux décideurs.
Body : CRM intelligents · Automatisations IA · Conseil opérationnel.
CTAs : [Discutons]  [Voir nos projets]
       └─ → /fr/contact   └─ → /fr/projets
```

**SEO targets (FR) :** consultant IA, conseil IA, équipe digitale, agence digitale alternative

---

#### V3 — Challenger : Gain temps / argent

**Hypothesis tested :** "Le client est motivé par le ROI mesurable (temps économisé, coûts réduits)."

```
H1   : Gagnez du temps. Économisez de l'argent. Avec une équipe à taille humaine.
H2   : On automatise vos process. On rend vos outils intelligents.
       Vous récupérez vos heures et votre marge.
Body : Pour les PME suisses qui veulent en faire plus avec moins.
CTAs : [Voir ce qu'on a fait]  [Discutons]
       └─ → /fr/projets         └─ → /fr/contact
```

**SEO targets (FR) :** automatisation entreprise, optimisation processus, gain de temps IA

---

#### V5 — Challenger : Problem solver positioning

**Hypothesis tested :** "Le client cherche un partenaire qui réfléchit avant de coder, pas un exécutant."

```
H1   : Problem solvers numériques pour PME et organisations.
H2   : On construit ce dont vous avez besoin. Quand c'est de l'IA, encore mieux.
Body : Équipe à taille humaine. Genève et Suisse romande.
CTAs : [Parlons-en]  [Nos projets]
       └─ → /fr/contact   └─ → /fr/projets
```

**SEO targets (FR) :** problem solver numérique, conseil IA PME, agence Genève

---

### 🇬🇧 ENGLISH — 2 variants (50/50 split)

#### V1 — Baseline : Senior humans + direct access

**Hypothesis tested :** "Buyer values seniority + direct relationship over scale/cheap."

```
H1   : Built by senior humans. Designed for serious work.
H2   : Custom AI systems, intelligent CRMs, automation, strategic advisory.
Body : Geneva-based. Direct access to the people who actually build.
CTAs : [Get in touch]  [Our work]
       └─ → /en/contact   └─ → /en/projects
```

**SEO targets (EN) :** AI agency Switzerland, custom AI solutions, AI consulting Geneva

---

#### ChallengerA — Optimize time/cost (with senior team)

**Hypothesis tested :** "Buyer is outcome-driven (ROI = time + money) before relationship."

```
H1   : Optimize your time and your costs. With a senior human team.
H2   : We automate your processes. We make your tools intelligent.
       You get hours and margin back.
Body : For organizations that want to do more with less. Geneva-based.
CTAs : [See what we built]  [Get in touch]
       └─ → /en/projects     └─ → /en/contact
```

**SEO targets (EN) :** AI automation business, time saving AI, AI for business

---

## Implementation mapping

These variants connect to Statsig experiments `mawt_hero_fr` and `mawt_hero_en` defined in brief 10. The component `<Hero lang={lang} />` reads the variant from Statsig and renders the matching copy.

### Variant IDs (must match Statsig dashboard)

| Lang | Variant ID | Copy block |
|---|---|---|
| FR | `v1_humain` | V1 above |
| FR | `v3_gain` | V3 above |
| FR | `v5_problem_solver` | V5 above |
| EN | `v1_senior_humans` | V1 EN above |
| EN | `challenger_a_optimize` | ChallengerA EN above |

### Code structure suggestion

`src/content/hero-copy.ts` :

```ts
export const HERO_COPY = {
  fr: {
    v1_humain: {
      h1: 'Une équipe à taille humaine pour vos enjeux numériques.',
      h2: 'On construit. On conseille. On déploie l\'IA. Vous parlez aux décideurs.',
      body: 'CRM intelligents · Automatisations IA · Conseil opérationnel.',
      ctaPrimary: { label: 'Discutons', href: 'contact' },
      ctaSecondary: { label: 'Voir nos projets', href: 'projets' },
    },
    v3_gain: {
      h1: 'Gagnez du temps. Économisez de l\'argent. Avec une équipe à taille humaine.',
      h2: 'On automatise vos process. On rend vos outils intelligents.\nVous récupérez vos heures et votre marge.',
      body: 'Pour les PME suisses qui veulent en faire plus avec moins.',
      ctaPrimary: { label: 'Voir ce qu\'on a fait', href: 'projets' },
      ctaSecondary: { label: 'Discutons', href: 'contact' },
    },
    v5_problem_solver: {
      h1: 'Problem solvers numériques pour PME et organisations.',
      h2: 'On construit ce dont vous avez besoin. Quand c\'est de l\'IA, encore mieux.',
      body: 'Équipe à taille humaine. Genève et Suisse romande.',
      ctaPrimary: { label: 'Parlons-en', href: 'contact' },
      ctaSecondary: { label: 'Nos projets', href: 'projets' },
    },
  },
  en: {
    v1_senior_humans: {
      h1: 'Built by senior humans. Designed for serious work.',
      h2: 'Custom AI systems, intelligent CRMs, automation, strategic advisory.',
      body: 'Geneva-based. Direct access to the people who actually build.',
      ctaPrimary: { label: 'Get in touch', href: 'contact' },
      ctaSecondary: { label: 'Our work', href: 'projets' },
    },
    challenger_a_optimize: {
      h1: 'Optimize your time and your costs. With a senior human team.',
      h2: 'We automate your processes. We make your tools intelligent.\nYou get hours and margin back.',
      body: 'For organizations that want to do more with less. Geneva-based.',
      ctaPrimary: { label: 'See what we built', href: 'projets' },
      ctaSecondary: { label: 'Get in touch', href: 'contact' },
    },
  },
};
```

Note that `ctaPrimary.href` and `ctaSecondary.href` use canonical FR keys (e.g., `projets`, `contact`). The `<LocalizedLink>` component (brief 05) translates per language.

## Validation criteria (per Statsig)

| Metric | Target | Why |
|---|---|---|
| Primary CTA click rate | Track per variant | The conversion event |
| Scroll past hero | Track per variant | Did the hero hold attention? |
| Contact form completion | Track per variant | Downstream conversion attribution |
| Sample size minimum | 200 unique visitors per variant | Below this = unreliable |
| Statistical confidence | 95% | Standard A/B testing threshold |
| Max duration | 4 weeks | After this, stop and analyze regardless |

## Sequential testing plan

If MAWT traffic is too low for a 3-way test (FR needs 600+ unique visitors over 4 weeks for meaningful results), fall back to sequential :

1. **Round 1** : V1 baseline vs V3 (50/50) for 4 weeks
2. **Round 2** : Winner round 1 vs V5 (50/50) for 4 weeks
3. Final winner runs as default

EN test (2-variant) doesn't need sequential — just run V1 vs ChallengerA.

## Hors scope

- Don't add a 4th FR variant or 3rd EN variant — these were strategically chosen
- Don't change the copy — it's final per user validation
- Don't merge variants ("V1 + V3 hybrid") — defeats the test purpose
- Don't translate FR variants to EN or vice versa — each language has its native set

## Why these variants

All 3 FR variants share the "équipe à taille humaine" thread (per brief 00 voice rules) but vary on the angle:
- V1 = relationship-first
- V3 = ROI-first
- V5 = expertise-first (problem-solving)

EN variants both use "senior humans" thread but vary :
- V1 = relationship + access
- ChallengerA = ROI (optimize time/cost)

The hypotheses tested let MAWT know which messaging angle converts best with each audience.

**Forbidden vocabulary checked (per brief 00) :** ✅ No "PowerPoint", no "usine à gaz", no "petite équipe", no "agence digitale", no "hire/freelance" in F4 context.
