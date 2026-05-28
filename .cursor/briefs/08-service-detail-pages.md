# Brief 08 — Service detail pages (template)

> **Prerequisites:**
> 1. Read `.cursor/briefs/00-context-mawt-overview.md` first.
> 2. **DEPENDS ON briefs 01, 02, 05, 06, 07** (foundations).
> 3. Copy content per service comes via Sanity (`longDescription`, `description`, `features`) — schema already supports it. This brief is the **layout template only**.

## Context

After the pillar pages (brief 07), each service has its own detail page. ~32 service detail pages total (FR + EN combined, including SEO-only ones like `refonte-site-web` and `portail-client-entreprise`).

## Decisions

### Route pattern

`src/app/[lang]/services/[family]/[service]/page.tsx`

Generates ~64 pages (32 services × 2 langs) via `generateStaticParams`.

### Service detail page anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ NAVBAR                                                       │
├─────────────────────────────────────────────────────────────┤
│ BREADCRUMB                                                   │
│   Services › <Family> › <Service>                           │
├─────────────────────────────────────────────────────────────┤
│ HERO                                                         │
│   - H1 = service.title (slash-separated if applicable:      │
│     "Agent IA / Assistant IA")                              │
│   - H2 (optional) = service.h2SeoCapture (e.g., "Hire AI    │
│     developer" — for SEO of secondary intent)               │
│   - Subhead = service.description (or first paragraph of    │
│     longDescription)                                         │
│   - 2 CTAs : primary "Discutons ce besoin", secondary       │
│     "Voir les projets liés"                                 │
├─────────────────────────────────────────────────────────────┤
│ LONG DESCRIPTION                                             │
│   - Rich text from service.longDescription (Portable Text)  │
│   - Structured with H2/H3 within                            │
├─────────────────────────────────────────────────────────────┤
│ FEATURES / CAPABILITIES                                      │
│   - Bullet list from service.features                       │
│   - Format: checkmark + text                                │
├─────────────────────────────────────────────────────────────┤
│ FEATURED PROJECTS (where this service was used)              │
│   - Cards of 2-3 projects from service.featuredProjects     │
├─────────────────────────────────────────────────────────────┤
│ RELATED SERVICES (same family)                               │
│   - 3 other services from the same family                   │
│   - "Vous pourriez aussi avoir besoin de..."                │
├─────────────────────────────────────────────────────────────┤
│ FAQ (relevant subset)                                        │
│   - Filtered by tag matching the service slug or family     │
├─────────────────────────────────────────────────────────────┤
│ BOTTOM CTA                                                   │
│   - "Discutons de votre besoin sur <service title>"         │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└─────────────────────────────────────────────────────────────┘
```

### Special case: SEO-only services (`displayAsCard=false`)

Services like `refonte-site-web` and `portail-client-entreprise` :
- Reachable via URL → render full page
- NOT linked from pillar page card grid (filtered out)
- NOT in navbar mega-menu (filtered out via tier/displayAsCard)
- BUT linked from related services if applicable (case by case)

## Technical spec

### `src/app/[lang]/services/[family]/[service]/page.tsx`

```tsx
import { sanityClient } from '@/lib/sanity';
import { URL_MAP, Locale } from '@/lib/routing/url-map';
import { notFound } from 'next/navigation';
import { ServiceDetailLayout } from '@/components/services/ServiceDetailLayout';

interface Props {
  params: Promise<{ lang: Locale; family: string; service: string }>;
}

export default async function ServiceDetailPage({ params }: Props) {
  const { lang, family, service } = await params;
  
  // Canonicalize family + service slugs to query Sanity
  const canonicalFamily = canonicalizeFamily(family, lang);
  if (!canonicalFamily) notFound();
  
  // Query the service by slug + language
  const data = await sanityClient.fetch(`
    {
      "service": *[_type == "service" && family == $family && slug.current == $serviceSlug && language == $lang][0]{
        _id, title, slug, family, description, longDescription, features, icon, h2SeoCapture,
        featuredProjects[]->{ _id, title, slug, excerpt, coverImage, year, industry },
        seo
      },
      "relatedServices": *[_type == "service" && family == $family && slug.current != $serviceSlug && language == $lang && displayAsCard == true] | order(tier asc)[0..2]{
        _id, title, slug, family, description, icon
      },
      "faqs": *[_type == "faq" && language == $lang && ($serviceSlug in tags || $family in tags)][0..4]
    }
  `, { family: canonicalFamily, serviceSlug: service, lang });
  
  if (!data.service) notFound();
  
  return <ServiceDetailLayout lang={lang} service={data.service} relatedServices={data.relatedServices} faqs={data.faqs} family={canonicalFamily} />;
}

export async function generateStaticParams() {
  // Read all services from Sanity (both languages)
  const services = await sanityClient.fetch<{
    family: string;
    slug: { current: string };
    language: 'fr' | 'en';
  }[]>(`*[_type == "service" && defined(slug.current)]{family, slug, language}`);
  
  return services.map(svc => ({
    lang: svc.language,
    family: familySlugForLang(svc.family, svc.language),
    service: svc.slug.current,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { lang, family, service } = await params;
  const canonicalFamily = canonicalizeFamily(family, lang);
  const data = await sanityClient.fetch(`
    *[_type == "service" && family == $family && slug.current == $serviceSlug && language == $lang][0]{
      title, description, seo
    }
  `, { family: canonicalFamily, serviceSlug: service, lang });
  
  if (!data) return {};
  
  return {
    title: data.seo?.metaTitle ?? `${data.title} | MAWT`,
    description: data.seo?.metaDescription ?? data.description,
    alternates: {
      languages: {
        fr: translatePath(`/${lang}/services/${family}/${service}`, lang, 'fr'),
        en: translatePath(`/${lang}/services/${family}/${service}`, lang, 'en'),
      },
    },
  };
}
```

### `src/components/services/ServiceDetailLayout.tsx`

```tsx
import { PortableText } from '@portabletext/react';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { ServiceCard } from './ServiceCard';
import { ProjectCard } from '../projects/ProjectCard';
import { FaqAccordion } from '../shared/FaqAccordion';
import { Breadcrumb } from '../shared/Breadcrumb';
import { Locale } from '@/lib/routing/url-map';

interface Props {
  lang: Locale;
  family: string;
  service: any;
  relatedServices: any[];
  faqs: any[];
}

export function ServiceDetailLayout({ lang, family, service, relatedServices, faqs }: Props) {
  const labels = {
    fr: {
      breadServices: 'Services',
      ctaPrimary: 'Discutons ce besoin',
      ctaSecondary: 'Voir les projets liés',
      featuresH2: 'Ce que ça inclut',
      projectsH2: 'Projets concrets',
      relatedH2: 'Vous pourriez aussi avoir besoin de',
      faqH2: 'Questions fréquentes',
      bottomCtaH2: `Discutons de votre besoin sur ${service.title}`,
    },
    en: {
      breadServices: 'Services',
      ctaPrimary: 'Discuss this need',
      ctaSecondary: 'See related projects',
      featuresH2: 'What it includes',
      projectsH2: 'Real projects',
      relatedH2: 'You might also need',
      faqH2: 'Frequent questions',
      bottomCtaH2: `Let's talk about your ${service.title} need`,
    },
  }[lang];
  
  return (
    <main>
      <Breadcrumb
        items={[
          { label: labels.breadServices, to: 'services' },
          { label: getFamilyTitle(family, lang), to: `services/${family}` },
          { label: service.title, to: null },  // current page, no link
        ]}
        lang={lang}
      />
      
      {/* HERO */}
      <section className="service-hero">
        <h1>{service.title}</h1>
        {service.h2SeoCapture && <h2 className="seo-capture">{service.h2SeoCapture}</h2>}
        {service.description && <p className="subhead">{service.description}</p>}
        <div className="ctas">
          <LocalizedLink to="contact" lang={lang} className="cta-primary">{labels.ctaPrimary}</LocalizedLink>
          {service.featuredProjects?.length > 0 && (
            <LocalizedLink to="projets" lang={lang} className="cta-secondary">{labels.ctaSecondary}</LocalizedLink>
          )}
        </div>
      </section>
      
      {/* LONG DESCRIPTION */}
      {service.longDescription && (
        <section className="service-long">
          <PortableText value={service.longDescription} />
        </section>
      )}
      
      {/* FEATURES */}
      {service.features?.length > 0 && (
        <section className="service-features">
          <h2>{labels.featuresH2}</h2>
          <ul>
            {service.features.map((f, i) => (
              <li key={i}>
                <span className="checkmark">✓</span> {f}
              </li>
            ))}
          </ul>
        </section>
      )}
      
      {/* FEATURED PROJECTS */}
      {service.featuredProjects?.length > 0 && (
        <section className="service-projects">
          <h2>{labels.projectsH2}</h2>
          <div className="projects-grid">
            {service.featuredProjects.map(p => <ProjectCard key={p._id} project={p} lang={lang} />)}
          </div>
        </section>
      )}
      
      {/* RELATED SERVICES */}
      {relatedServices.length > 0 && (
        <section className="service-related">
          <h2>{labels.relatedH2}</h2>
          <div className="services-grid">
            {relatedServices.map(svc => <ServiceCard key={svc._id} service={svc} lang={lang} family={family} />)}
          </div>
        </section>
      )}
      
      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="service-faq">
          <h2>{labels.faqH2}</h2>
          <FaqAccordion items={faqs} />
        </section>
      )}
      
      {/* BOTTOM CTA */}
      <section className="service-cta-bottom">
        <h2>{labels.bottomCtaH2}</h2>
        <LocalizedLink to="contact" lang={lang} className="cta-primary">{labels.ctaPrimary}</LocalizedLink>
      </section>
    </main>
  );
}
```

### `getFamilyTitle(family, lang)` helper

```ts
const FAMILY_TITLES = {
  'sites-et-branding': { fr: 'Sites & Branding', en: 'Sites & Branding' },
  'solutions-ia': { fr: 'Solutions IA', en: 'AI Solutions' },
  'conseil-ia': { fr: 'Conseil IA', en: 'AI Consulting' },
  'formation-ia': { fr: 'Formation IA', en: 'AI Training' },
  'renfort-equipe': { fr: 'Renfort & Équipe', en: 'Team Augmentation' },
};
export function getFamilyTitle(family: string, lang: 'fr' | 'en'): string {
  return FAMILY_TITLES[family]?.[lang] ?? family;
}
```

## SEO considerations per service page

Each service page must have unique :
- `<title>` (60 chars max) — from `service.seo.metaTitle` or `${service.title} | MAWT`
- `<meta description>` (155 chars max) — from `service.seo.metaDescription` or `service.description`
- `<h1>` — exactly `service.title` (no slash, single text). If title has slash ("Agent IA / Assistant IA"), keep it
- `<h2>` from `h2SeoCapture` if set — captures secondary search intent
- Schema.org structured data : `Service` type, with provider=MAWT, areaServed=Switzerland
- hreflang annotations linking FR ↔ EN

Implement structured data in `generateMetadata` :
```ts
return {
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.description,
      provider: { '@type': 'Organization', name: 'MAWT', url: 'https://mawt.ch' },
      areaServed: { '@type': 'Country', name: 'Switzerland' },
    }),
  },
};
```

## Validation

1. `npm run build` passes — all service detail pages generated (~32-64 depending on translations)
2. Each page renders with the correct service data
3. SEO-only services (refonte-site-web, portail-client-entreprise) render but are NOT in any card grid
4. Breadcrumbs work (clicking back goes to family pillar → /services overview)
5. Related services are different from the current one + same family
6. Lighthouse SEO score 100 per service page
7. hreflang annotations present in `<head>`

## Hors scope

- Don't write the content for `longDescription`, `description`, `features` — that's per-service Sanity content (filled manually or via brief 02's creation script with placeholders)
- Don't style — designer
- Don't add per-service A/B testing — only homepage hero for now (brief 10)
- Don't implement structured data beyond Service type

## Commit instructions

```
feat(services): service detail page template (~32 services × 2 langs)

- Add /services/[family]/[service] route with generateStaticParams
- Standard layout: breadcrumb + hero + long description + features + 
  projects + related services + faq + bottom CTA
- SEO-only services render via URL but excluded from cards
- Per-page metadata with hreflang + schema.org Service structured data
- Query Sanity for service + related + faqs with language filter
```
