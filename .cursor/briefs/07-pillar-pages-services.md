# Brief 07 — Pillar pages (5 family pages + /services overview)

> **Prerequisites:**
> 1. Read `.cursor/briefs/00-context-mawt-overview.md` first.
> 2. **DEPENDS ON briefs 01, 02, 05, 06** (multilingue, services in Sanity, routing B3, navbar).
> 3. Copy content for these pages lives in `.cursor/briefs/content/services-pillar-copy.md` — draft separately, this brief is the **layout/structure spec only**.

## Context

5 family pillar pages + 1 services overview page need to be built. Each pillar page is a high-leverage SEO landing page (the page Google ranks for "création site internet", "solutions IA", "conseil IA", etc.).

## Decisions

### Pages to create (6 total)

| Route FR | Route EN | Family key | Page type |
|---|---|---|---|
| `/fr/services` | `/en/services` | (overview) | All 5 families grid |
| `/fr/services/sites-et-branding` | `/en/services/sites-and-branding` | `sites-et-branding` | F1 pillar |
| `/fr/services/solutions-ia` | `/en/services/ai-solutions` | `solutions-ia` | F2 pillar |
| `/fr/services/conseil-ia` | `/en/services/ai-consulting` | `conseil-ia` | F3 pillar |
| `/fr/services/formation-ia` | `/en/services/ai-training` | `formation-ia` | F5 pillar |
| `/fr/services/renfort-equipe` | `/en/services/team-augmentation` | `renfort-equipe` | F4 pillar |

### Family pillar page anatomy (standard template)

Each pillar page follows this structure :

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR (brief 06)                                           │
├─────────────────────────────────────────────────────────────┤
│ HERO SECTION                                                │
│   - H1 with family name + main SEO keyword                  │
│   - Sub-headline (value prop, 1-2 lines)                    │
│   - 2 CTAs (primary: "Discutons" → /contact,                │
│              secondary: "Voir nos projets" → /projets)      │
├─────────────────────────────────────────────────────────────┤
│ INTRO / NARRATIVE                                           │
│   - 2-3 paragraphs explaining what this family does         │
│   - Why MAWT specifically (the differentiator)              │
│   - For whom (audience cue)                                 │
├─────────────────────────────────────────────────────────────┤
│ SERVICES GRID                                               │
│   - Card per service where displayAsCard=true               │
│   - Ordered by tier (ASC)                                   │
│   - Each card: icon, title, 1-line description, "Explorer" │
│     link to /services/<family>/<service>                   │
├─────────────────────────────────────────────────────────────┤
│ HOW WE WORK (snippet)                                       │
│   - Short pitch on methodology                              │
│   - Link to /notre-methode (full version)                   │
├─────────────────────────────────────────────────────────────┤
│ FEATURED PROJECTS                                           │
│   - Cards of 2-3 projects where this family was used       │
│   - Query: project where services[] references include      │
│     this family's services                                  │
├─────────────────────────────────────────────────────────────┤
│ TESTIMONIAL                                                 │
│   - Optional: 1 testimonial relevant to this family        │
│   - Pull from Sanity `testimonial` documents                │
├─────────────────────────────────────────────────────────────┤
│ FAQ (relevant subset)                                       │
│   - 3-5 questions from `faq` documents                      │
│   - Filter by tag or family-relevance                       │
├─────────────────────────────────────────────────────────────┤
│ BOTTOM CTA                                                  │
│   - Final conversion push                                   │
│   - "Démarrer un projet" / "Start a conversation"           │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

### Services overview page (`/services`)

A grid showing the 5 families. Each family card :
- Family name + tagline (from copy brief)
- 3-4 featured services (same as mega-menu)
- "Voir tout" link to the family pillar page
- Background visual (designer will provide)

## Technical spec

### Folder structure (Next.js)

Using Approach B from brief 05 (`generateStaticParams`) :

```
src/app/[lang]/services/
├── page.tsx                       # /services overview
├── layout.tsx                     # shared layout for services pages
└── [family]/
    ├── page.tsx                   # /services/<family> pillar page
    └── [service]/
        └── page.tsx               # /services/<family>/<service> detail page (brief 08)
```

### `src/app/[lang]/services/page.tsx` — Overview

```tsx
import { sanityClient } from '@/lib/sanity';
import { Locale } from '@/lib/routing/url-map';
import { ServicesOverviewSection } from '@/components/services/ServicesOverviewSection';

interface Props { params: Promise<{ lang: Locale }>; }

export default async function ServicesOverviewPage({ params }: Props) {
  const { lang } = await params;
  
  // Fetch all families' featured services from siteSettings.megaMenuFeatured
  const data = await sanityClient.fetch(`
    *[_type == "siteSettings" && language == $lang][0]{
      megaMenuFeatured[]{
        family,
        featuredServices[]->{ _id, title, slug, description, family, icon }
      }
    }
  `, { lang });
  
  return <ServicesOverviewSection lang={lang} families={data.megaMenuFeatured} />;
}

export async function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  // Title + meta description from copy brief
  // FR: "Tous nos services | MAWT"
  // EN: "All our services | MAWT"
  return { /* ... */ };
}
```

### `src/app/[lang]/services/[family]/page.tsx` — Pillar page

```tsx
import { sanityClient } from '@/lib/sanity';
import { URL_MAP, Locale } from '@/lib/routing/url-map';
import { notFound } from 'next/navigation';
import { PillarPageLayout } from '@/components/services/PillarPageLayout';

interface Props { params: Promise<{ lang: Locale; family: string; }>; }

export default async function FamilyPillarPage({ params }: Props) {
  const { lang, family } = await params;
  
  // Map family slug back to canonical family key (FR slug)
  const canonicalFamily = canonicalizeFamily(family, lang);
  if (!canonicalFamily) notFound();
  
  // Fetch family data + services + featured projects
  const data = await sanityClient.fetch(`
    {
      "services": *[_type == "service" && family == $family && language == $lang && displayAsCard == true] | order(tier asc),
      "projects": *[_type == "project" && language == $lang && count(services[@->family == $family]) > 0] | order(year desc)[0..2],
      "testimonials": *[_type == "testimonial" && language == $lang][0..0],
      "faqs": *[_type == "faq" && language == $lang && $family in tags][0..4],
      "siteSettings": *[_type == "siteSettings" && language == $lang][0]{ctaLabel, ctaHref}
    }
  `, { family: canonicalFamily, lang });
  
  return (
    <PillarPageLayout
      lang={lang}
      family={canonicalFamily}
      services={data.services}
      projects={data.projects}
      testimonial={data.testimonials[0]}
      faqs={data.faqs}
    />
  );
}

export async function generateStaticParams() {
  // Generate all 5 families × 2 langs = 10 combinations
  const families = URL_MAP.find(m => m.fr === 'services')?.children ?? [];
  const params = [];
  for (const family of families) {
    params.push({ lang: 'fr', family: family.fr });
    params.push({ lang: 'en', family: family.en });
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { lang, family } = await params;
  // Pull H1 + meta description from Sanity OR from copy brief
  // Each family has its own SEO-optimized title + description
  return { /* ... */ };
}

function canonicalizeFamily(slug: string, lang: Locale): string | null {
  const families = URL_MAP.find(m => m.fr === 'services')?.children ?? [];
  const match = families.find(f => f[lang] === slug);
  return match?.fr ?? null;  // canonical = FR slug
}
```

### `src/components/services/PillarPageLayout.tsx`

```tsx
'use client';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { ServiceCard } from './ServiceCard';
import { ProjectCard } from '../projects/ProjectCard';
import { TestimonialBlock } from '../shared/TestimonialBlock';
import { FaqAccordion } from '../shared/FaqAccordion';
import { Locale } from '@/lib/routing/url-map';

interface Props {
  lang: Locale;
  family: string;
  services: any[];
  projects: any[];
  testimonial?: any;
  faqs: any[];
}

export function PillarPageLayout({ lang, family, services, projects, testimonial, faqs }: Props) {
  // Family-specific copy lives in a copy module (loaded based on family key)
  const copy = getFamilyCopy(family, lang);
  
  return (
    <main>
      {/* HERO */}
      <section className="pillar-hero">
        <h1>{copy.h1}</h1>
        <p className="subhead">{copy.subhead}</p>
        <div className="ctas">
          <LocalizedLink to="contact" lang={lang} className="cta-primary">{copy.ctaPrimary}</LocalizedLink>
          <LocalizedLink to="projets" lang={lang} className="cta-secondary">{copy.ctaSecondary}</LocalizedLink>
        </div>
      </section>
      
      {/* INTRO */}
      <section className="pillar-intro">
        {copy.introParagraphs.map((p, i) => <p key={i}>{p}</p>)}
      </section>
      
      {/* SERVICES GRID */}
      <section className="pillar-services">
        <h2>{copy.servicesH2}</h2>
        <div className="services-grid">
          {services.map(svc => <ServiceCard key={svc._id} service={svc} lang={lang} family={family} />)}
        </div>
      </section>
      
      {/* HOW WE WORK */}
      <section className="pillar-method">
        <h2>{copy.methodH2}</h2>
        <p>{copy.methodPitch}</p>
        <LocalizedLink to="notre-methode" lang={lang}>{copy.methodCta}</LocalizedLink>
      </section>
      
      {/* FEATURED PROJECTS */}
      {projects.length > 0 && (
        <section className="pillar-projects">
          <h2>{copy.projectsH2}</h2>
          <div className="projects-grid">
            {projects.map(p => <ProjectCard key={p._id} project={p} lang={lang} />)}
          </div>
        </section>
      )}
      
      {/* TESTIMONIAL */}
      {testimonial && <TestimonialBlock testimonial={testimonial} />}
      
      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="pillar-faq">
          <h2>{copy.faqH2}</h2>
          <FaqAccordion items={faqs} />
        </section>
      )}
      
      {/* BOTTOM CTA */}
      <section className="pillar-cta-bottom">
        <h2>{copy.bottomCtaH2}</h2>
        <p>{copy.bottomCtaPitch}</p>
        <LocalizedLink to="contact" lang={lang} className="cta-primary">{copy.ctaPrimary}</LocalizedLink>
      </section>
    </main>
  );
}
```

### `getFamilyCopy(family, lang)` — Copy module

Copy lives in `src/content/services-pillar-copy.ts` — a typed object keyed by `[family][lang]`. The structure is :

```ts
export const PILLAR_COPY = {
  'sites-et-branding': {
    fr: {
      h1: '...',
      subhead: '...',
      ctaPrimary: 'Discutons',
      ctaSecondary: 'Voir nos projets',
      introParagraphs: ['...', '...'],
      servicesH2: '...',
      methodH2: '...',
      methodPitch: '...',
      methodCta: '...',
      projectsH2: '...',
      faqH2: '...',
      bottomCtaH2: '...',
      bottomCtaPitch: '...',
      metaTitle: '...',
      metaDescription: '...',
    },
    en: { /* ... */ },
  },
  'solutions-ia': { fr: {...}, en: {...} },
  // ... all 5 families
};
```

**Important :** The actual copy text comes from brief `content/services-pillar-copy.md`. Cursor : create the file structure with placeholders, the user will fill the copy content via that brief separately.

### `src/components/services/ServiceCard.tsx`

```tsx
import { LocalizedLink } from '@/components/ui/LocalizedLink';

export function ServiceCard({ service, lang, family }) {
  const familySlug = service.family;  // canonical FR family key
  const slugCurrent = service.slug.current;
  const routeKey = `services/${familySlug}/${slugCurrent}`;
  
  return (
    <LocalizedLink to={routeKey} lang={lang} className="service-card">
      {service.icon && <Icon name={service.icon} />}
      <h3>{service.title}</h3>
      {service.description && <p>{service.description}</p>}
      <span className="explore-link">{lang === 'fr' ? 'Explorer →' : 'Explore →'}</span>
    </LocalizedLink>
  );
}
```

## Validation

1. `npm run build` passes — all 12 pages (overview FR/EN + 5 families × 2 langs) generated
2. Visit each pillar page, verify :
   - H1 displays correctly per family
   - Services grid shows only `displayAsCard=true` services for that family
   - Services sorted by `tier` ASC
   - Featured projects show (where Sanity has linked projects)
   - Links go to correct B3 URLs (`/fr/...` ↔ `/en/...`)
3. SEO check :
   - View page source — verify `<h1>`, meta title, meta description
   - One H1 per page (not multiple)
   - H2/H3 hierarchy clean
4. Lighthouse score (mobile) on a pillar page : target 90+ performance, 100 SEO, 100 accessibility

## Hors scope

- Don't write the copy content (`PILLAR_COPY` values) — that's in `content/services-pillar-copy.md`
- Don't style the pages (designer will provide)
- Don't create the service detail pages (`[service]/page.tsx`) — that's brief 08
- Don't implement search/filter on services overview — not in v18 scope
- Don't add breadcrumbs (out of v18 scope)

## Commit instructions

```
feat(services): pillar pages (5 families + overview)

- Add /services overview page (lists 5 families with featured services)
- Add 5 pillar pages: sites-et-branding, solutions-ia, conseil-ia, 
  formation-ia, renfort-equipe (FR + EN via generateStaticParams)
- Standard layout: hero + intro + services grid + method + projects + testimonial + faq + bottom CTA
- Copy module placeholder at src/content/services-pillar-copy.ts (filled separately)
- Use <LocalizedLink>, <ServiceCard>, <PillarPageLayout> components
- Query Sanity for services/projects/testimonials/faqs per family with lang filter
```
