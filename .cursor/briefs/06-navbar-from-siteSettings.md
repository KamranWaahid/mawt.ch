# Brief 06 — Navbar piloted by Sanity siteSettings

> **Prerequisites:**
> 1. Read `.cursor/briefs/00-context-mawt-overview.md` first.
> 2. **DEPENDS ON briefs 01 (multilingual) and 02 (services restructure)** — siteSettings must be bilingual and services must exist with the v18 structure.
> 3. **DEPENDS ON brief 05** (routing-localized-b3) — use `<LocalizedLink>` and `localizedHref()` helpers.

## Context

The current navbar is hardcoded or reads from dictionaries. The schema `siteSettings` has 2 unused fields (`mainNav` and `servicesNav`) that should drive the navbar dynamically.

Goal: edit the navbar from Sanity Studio without touching code, with full B3 i18n support.

## Decisions

### Navbar structure (v18)

```
[MAWT logo]  Services ▾  Projets  Blog  À propos  Contact  [FR ↔ EN]
```

The `Services ▾` opens a mega-menu showing the 5 families + featured services.

**Mega-menu layout :**
```
┌──────────────────────────────────────────────────────────────┐
│ Sites & Branding      Solutions IA      Conseil IA           │
│ ─ Site internet       ─ CRM intelligent  ─ Stratégie IA      │
│ ─ E-commerce          ─ Agent IA         ─ Transformation    │
│ ─ Branding            ─ RAG enterprise   ─ AI change mgmt    │
│ → Tous les services   → Toutes solutions → Tout le conseil   │
│                                                              │
│ Formation IA          Renfort & Équipe                       │
│ ─ ChatGPT for teams   ─ Développeur dédié                    │
│ ─ AI workshop         ─ Expert IA dédié                      │
│ ─ AI coaching         ─ Fractional CTO                       │
│ → Toutes formations   → Tous les renforts                    │
└──────────────────────────────────────────────────────────────┘
```

Per family: 3-4 featured services + a "voir tout" link to the family pillar page.

## Schema update (`src/sanity/schemaTypes/site-settings.ts`)

The existing schema has `mainNav` and `servicesNav` fields. They need restructure to support B3 (each item knows its canonical key, the URL is generated per language).

```ts
// Inside siteSettings schema
defineField({
  name: 'mainNav',
  title: 'Main Navigation Links',
  type: 'array',
  of: [
    {
      type: 'object',
      name: 'navLink',
      fields: [
        defineField({
          name: 'label',
          type: 'string',
          validation: (Rule) => Rule.required(),
          // Note: this label is in the document's language (FR or EN)
          // The plugin from brief 01 handles language per doc
        }),
        defineField({
          name: 'routeKey',
          title: 'Route key (canonical FR path)',
          type: 'string',
          description: 'Canonical FR-style key. Examples: "services", "projets", "blog", "a-propos", "contact". The page resolves to the right language automatically via URL_MAP.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'hasMegaMenu',
          type: 'boolean',
          initialValue: false,
          description: 'If true, this link triggers the services mega-menu (use only for the "Services" link).',
        }),
      ],
      preview: {
        select: { title: 'label', subtitle: 'routeKey' },
      },
    },
  ],
}),

defineField({
  name: 'megaMenuFeatured',
  title: 'Mega-menu featured services',
  type: 'array',
  of: [
    {
      type: 'object',
      name: 'familyFeature',
      fields: [
        defineField({
          name: 'family',
          type: 'string',
          options: {
            list: [
              { title: 'Sites & Branding', value: 'sites-et-branding' },
              { title: 'Solutions IA', value: 'solutions-ia' },
              { title: 'Conseil IA', value: 'conseil-ia' },
              { title: 'Renfort & Équipe', value: 'renfort-equipe' },
              { title: 'Formation IA', value: 'formation-ia' },
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'featuredServices',
          title: 'Featured services (max 4)',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'service' }] }],
          validation: (Rule) => Rule.max(4),
          description: 'Select 3-4 services from this family to highlight in the mega-menu.',
        }),
      ],
      preview: {
        select: { title: 'family' },
      },
    },
  ],
}),
```

Remove the old `servicesNav` field (replaced by `megaMenuFeatured` which links to real `service` documents).

## Initial Sanity content (populate siteSettings)

After schema update, populate the `mainNav` field in both FR and EN versions of `siteSettings`:

**FR `siteSettings.mainNav` :**
```json
[
  { "label": "Services", "routeKey": "services", "hasMegaMenu": true },
  { "label": "Projets", "routeKey": "projets" },
  { "label": "Blog", "routeKey": "blog" },
  { "label": "À propos", "routeKey": "a-propos" },
  { "label": "Contact", "routeKey": "contact" }
]
```

**EN `siteSettings.mainNav` :**
```json
[
  { "label": "Services", "routeKey": "services", "hasMegaMenu": true },
  { "label": "Projects", "routeKey": "projets" },
  { "label": "Blog", "routeKey": "blog" },
  { "label": "About", "routeKey": "a-propos" },
  { "label": "Contact", "routeKey": "contact" }
]
```

Note: `routeKey` is the CANONICAL FR slug (always). `localizedHref('projets', 'en')` returns `/en/projects` — the helper from brief 05 handles the translation.

**`megaMenuFeatured`** — for each of the 5 families, pick the 3-4 most strategic services to feature:
- Sites & Branding: site-internet, e-commerce-eshop, branding-identite
- Solutions IA: crm-intelligent, agent-ia-assistant, rag-intelligence-embarquee, automatisations
- Conseil IA: strategie-ia, transformation-numerique, ai-change-management
- Renfort & Équipe: developpeur-dedie, fractional-cto, engineering-as-a-service
- Formation IA: formation-chatgpt-entreprise, formation-ia-equipes, coaching-decideurs-ia

These are pre-loaded suggestions — the user can change them in Studio anytime.

## Component spec

### `<Navbar>` component (`src/components/layout/Navbar.tsx`)

```tsx
import { sanityClient } from '@/lib/sanity';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { Locale } from '@/lib/routing/url-map';

interface Props { lang: Locale; }

export async function Navbar({ lang }: Props) {
  const data = await sanityClient.fetch(`
    *[_type == "siteSettings" && language == $lang][0]{
      title,
      mainNav,
      megaMenuFeatured[]{
        family,
        featuredServices[]->{ _id, title, slug, family }
      }
    }
  `, { lang });
  
  if (!data) return null;
  
  return (
    <nav className="...">
      <LocalizedLink to="" lang={lang}>
        <MawtLogo />
      </LocalizedLink>
      
      <ul>
        {data.mainNav.map((link, i) => (
          <li key={i}>
            {link.hasMegaMenu ? (
              <ServicesMegaMenu lang={lang} items={data.megaMenuFeatured} label={link.label} routeKey={link.routeKey} />
            ) : (
              <LocalizedLink to={link.routeKey} lang={lang}>
                {link.label}
              </LocalizedLink>
            )}
          </li>
        ))}
      </ul>
      
      <LanguageSwitcher currentLocale={lang} />
    </nav>
  );
}
```

### `<ServicesMegaMenu>` component

Renders the 5 families with their featured services. Each service item uses `localizedHref('services/<family>/<service-slug>', lang)`.

### Footer

Update the footer to also pull from `siteSettings` if structure decision is made. For now, leave footer reading from dictionaries (per brief 04). Decision deferred.

## Validation

1. `npm run build` passes
2. Navbar renders correctly on both `/fr` and `/en`
3. Mega-menu opens on Services hover/click, shows 5 families with featured services
4. Clicking a service link goes to the correct B3 URL (`/fr/services/solutions-ia/crm-intelligent` ↔ `/en/services/ai-solutions/smart-crm`)
5. Editing `mainNav` or `megaMenuFeatured` in Studio reflects on the site after rebuild/revalidation
6. Mobile menu (hamburger) works with same data

## Hors scope

- Don't touch the footer (still uses dictionaries from brief 04)
- Don't design the mega-menu visuals beyond functional rendering (designer will style)
- Don't implement search in navbar — not planned
- Don't implement breadcrumbs — not in v18 scope

## Commit instructions

```
feat(navbar): Sanity-driven navigation with B3 i18n

- Replace mainNav/servicesNav schema with structured navLink + megaMenuFeatured
- Reference real service documents in mega-menu (no hardcoded titles)
- Render via <Navbar> + <ServicesMegaMenu> components
- Use <LocalizedLink> for all internal navigation
- Populate FR + EN siteSettings with initial v18 nav structure
```
