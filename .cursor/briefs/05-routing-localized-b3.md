# Brief 05 — Routing localized (B3 full)

> **Prerequisites:**
> 1. Read `.cursor/briefs/00-context-mawt-overview.md` first.
> 2. **DEPENDS ON briefs 01 (Sanity multilingual) and 02 (services restructure)** — those must be done first so Sanity has the v18 catalog with FR + EN data.
> 3. Brief 04 (routes cleanup) should also be done before this — obsolete routes deleted.
> 4. Read `node_modules/next/dist/docs/` for current Next.js i18n routing API (this is Next.js 16+, NOT the version you remember from training).

## Context

MAWT uses **fully localized URLs** (decision B3). Every slug is translated FR ↔ EN:
- `/fr/projets` ↔ `/en/projects`
- `/fr/services/solutions-ia/crm-intelligent` ↔ `/en/services/ai-solutions/smart-crm`
- `/fr/clients` ↔ `/en/partners`

This is **not** the standard "[lang]/identical-slug" Next.js i18n pattern. It requires a routing layer that translates incoming URLs based on language.

## Decision: URL routing map + middleware rewrite

**Pattern chosen:** maintain a single TypeScript routing map (`src/lib/routing/url-map.ts`) that contains all FR/EN slug pairs. Middleware reads incoming URL, detects language, validates against the map, and renders the right page.

**Why this pattern (vs alternatives):**

| Approach | Pros | Cons | Verdict |
|---|---|---|---|
| Single map (chosen) | Single source of truth, type-safe, easy to add languages | Manual maintenance | ✅ Best for MAWT scale (~50 pages) |
| Sanity-driven map | No hardcoded slugs, full editor control | Runtime DB call per route, complex caching, fragile | ❌ Overkill for ~50 stable pages |
| File-system only | Native Next.js | Doesn't support translated slugs cleanly | ❌ Breaks B3 strategy |
| `next-intl` package | Established library | Adds dependency, learning curve | 🟡 Possible alternative — verify maintenance status |

→ Recommendation: **custom map + middleware**. Simple, type-safe, no extra deps. If you find `next-intl` matches B3 well, evaluate but default to custom.

## Full URL mapping (source of truth)

This map covers every route in v18. Cursor: implement this exactly as the routing map's data.

### Top-level pages

| FR | EN | Sanity content type |
|---|---|---|
| `/fr` | `/en` | (homepage, special) |
| `/fr/services` | `/en/services` | aggregate page |
| `/fr/projets` | `/en/projects` | aggregate page |
| `/fr/blog` | `/en/blog` | aggregate page |
| `/fr/a-propos` | `/en/about` | `aboutContent` singleton |
| `/fr/contact` | `/en/contact` | `contact` singleton |
| `/fr/faqs` | `/en/faqs` | `faq` collection |
| `/fr/clients` | `/en/partners` | `partner` collection |
| `/fr/notre-methode` | `/en/our-process` | static or singleton |
| `/fr/securite` | `/en/security` | static or singleton |
| `/fr/mentions-legales` | `/en/legal-notice` | static |
| `/fr/confidentialite` | `/en/privacy` | static |
| `/fr/conditions-utilisation` | `/en/terms` | static |
| `/fr/cookies` | `/en/cookies` | static |

### F1 — Sites & Branding

**Family:** `/fr/services/sites-et-branding` ↔ `/en/services/sites-and-branding`

| FR slug | EN slug |
|---|---|
| `site-internet` | `website` |
| `e-commerce-eshop` | `e-commerce` |
| `branding-identite` | `branding-identity` |
| `audit-ux-seo-performance` | `ux-seo-performance-audit` |
| `refonte-site-web` *(SEO only)* | `website-redesign` *(SEO only)* |

### F2 — Solutions IA

**Family:** `/fr/services/solutions-ia` ↔ `/en/services/ai-solutions`

| FR slug | EN slug |
|---|---|
| `crm-intelligent` | `smart-crm` |
| `agent-ia-assistant` | `ai-agent` |
| `rag-intelligence-embarquee` | `rag-enterprise` |
| `chatbots` | `chatbots` |
| `application-metier-logiciel-sur-mesure` | `custom-business-application` |
| `automatisations` | `ai-automation` |
| `integrations-apis` | `integrations-apis` |
| `application-mobile` | `mobile-app` |
| `portail-client-entreprise` *(SEO only)* | `client-business-portal` *(SEO only)* |

### F3 — Conseil IA

**Family:** `/fr/services/conseil-ia` ↔ `/en/services/ai-consulting`

| FR slug | EN slug |
|---|---|
| `strategie-ia` | `ai-strategy` |
| `audit-operationnel` | `business-audit` |
| `conseil-organisationnel` | `organizational-consulting` |
| `transformation-numerique` | `digital-transformation` |
| `change-management` | `change-management` |
| `ai-change-management` | `ai-change-management` |
| `conseil-digitalisation` | `digital-transformation-consulting` |

### F4 — Renfort & Équipe

**Family:** `/fr/services/renfort-equipe` ↔ `/en/services/team-augmentation`

| FR slug | EN slug |
|---|---|
| `developpeur-dedie` | `dedicated-developer` |
| `expert-ia-dedie` | `dedicated-ai-expert` |
| `designer-ux-dedie` | `dedicated-ux-designer` |
| `qa-testing` | `qa-testing` |
| `pilotage-projet` | `project-management` |
| `accompagnement-design` | `design-coaching` |
| `maintenance-applicative` | `application-maintenance` |
| `cto-temps-partiel` | `fractional-cto` |
| `tech-lead-temps-partiel` | `fractional-tech-lead` |
| `engineering-as-a-service` | `engineering-as-a-service` |

### F5 — Formation IA

**Family:** `/fr/services/formation-ia` ↔ `/en/services/ai-training`

| FR slug | EN slug |
|---|---|
| `formation-chatgpt-entreprise` | `chatgpt-for-teams` |
| `formation-ia-equipes` | `ai-workshop` |
| `coaching-decideurs-ia` | `ai-coaching-for-leaders` |
| `accompagnement-adoption-ia` | `ai-implementation` |

### Dynamic routes

| FR pattern | EN pattern | Source |
|---|---|---|
| `/fr/projets/[slug]` | `/en/projects/[slug]` | Sanity `project` documents |
| `/fr/blog/[slug]` | `/en/blog/[slug]` | Sanity `post` documents |
| `/fr/blog/categorie/[slug]` | `/en/blog/category/[slug]` | Blog category pages |
| `/fr/blog/tag/[slug]` | `/en/blog/tag/[slug]` | Blog tag pages |
| `/fr/blog/auteur/[slug]` | `/en/blog/author/[slug]` | Author pages |

## Technical spec

### Step 1 — Create the routing map (`src/lib/routing/url-map.ts`)

```ts
// Single source of truth for all FR↔EN slug pairs
export type Locale = 'fr' | 'en';

export interface RouteMapping {
  fr: string;  // segment in FR
  en: string;  // segment in EN
  children?: RouteMapping[];  // nested routes
}

export const URL_MAP: RouteMapping[] = [
  // Top-level
  { fr: 'services', en: 'services', children: [
    { fr: 'sites-et-branding', en: 'sites-and-branding', children: [
      { fr: 'site-internet', en: 'website' },
      { fr: 'e-commerce-eshop', en: 'e-commerce' },
      { fr: 'branding-identite', en: 'branding-identity' },
      { fr: 'audit-ux-seo-performance', en: 'ux-seo-performance-audit' },
      { fr: 'refonte-site-web', en: 'website-redesign' },
    ]},
    { fr: 'solutions-ia', en: 'ai-solutions', children: [
      { fr: 'crm-intelligent', en: 'smart-crm' },
      { fr: 'agent-ia-assistant', en: 'ai-agent' },
      { fr: 'rag-intelligence-embarquee', en: 'rag-enterprise' },
      { fr: 'chatbots', en: 'chatbots' },
      { fr: 'application-metier-logiciel-sur-mesure', en: 'custom-business-application' },
      { fr: 'automatisations', en: 'ai-automation' },
      { fr: 'integrations-apis', en: 'integrations-apis' },
      { fr: 'application-mobile', en: 'mobile-app' },
      { fr: 'portail-client-entreprise', en: 'client-business-portal' },
    ]},
    { fr: 'conseil-ia', en: 'ai-consulting', children: [
      { fr: 'strategie-ia', en: 'ai-strategy' },
      { fr: 'audit-operationnel', en: 'business-audit' },
      { fr: 'conseil-organisationnel', en: 'organizational-consulting' },
      { fr: 'transformation-numerique', en: 'digital-transformation' },
      { fr: 'change-management', en: 'change-management' },
      { fr: 'ai-change-management', en: 'ai-change-management' },
      { fr: 'conseil-digitalisation', en: 'digital-transformation-consulting' },
    ]},
    { fr: 'renfort-equipe', en: 'team-augmentation', children: [
      { fr: 'developpeur-dedie', en: 'dedicated-developer' },
      { fr: 'expert-ia-dedie', en: 'dedicated-ai-expert' },
      { fr: 'designer-ux-dedie', en: 'dedicated-ux-designer' },
      { fr: 'qa-testing', en: 'qa-testing' },
      { fr: 'pilotage-projet', en: 'project-management' },
      { fr: 'accompagnement-design', en: 'design-coaching' },
      { fr: 'maintenance-applicative', en: 'application-maintenance' },
      { fr: 'cto-temps-partiel', en: 'fractional-cto' },
      { fr: 'tech-lead-temps-partiel', en: 'fractional-tech-lead' },
      { fr: 'engineering-as-a-service', en: 'engineering-as-a-service' },
    ]},
    { fr: 'formation-ia', en: 'ai-training', children: [
      { fr: 'formation-chatgpt-entreprise', en: 'chatgpt-for-teams' },
      { fr: 'formation-ia-equipes', en: 'ai-workshop' },
      { fr: 'coaching-decideurs-ia', en: 'ai-coaching-for-leaders' },
      { fr: 'accompagnement-adoption-ia', en: 'ai-implementation' },
    ]},
  ]},
  
  // Other top-level
  { fr: 'projets', en: 'projects' },  // dynamic [slug] inside
  { fr: 'blog', en: 'blog', children: [
    { fr: 'categorie', en: 'category' },
    { fr: 'tag', en: 'tag' },
    { fr: 'auteur', en: 'author' },
  ]},
  { fr: 'a-propos', en: 'about' },
  { fr: 'contact', en: 'contact' },
  { fr: 'faqs', en: 'faqs' },
  { fr: 'clients', en: 'partners' },
  { fr: 'notre-methode', en: 'our-process' },
  { fr: 'securite', en: 'security' },
  { fr: 'mentions-legales', en: 'legal-notice' },
  { fr: 'confidentialite', en: 'privacy' },
  { fr: 'conditions-utilisation', en: 'terms' },
  { fr: 'cookies', en: 'cookies' },
];
```

### Step 2 — Helper functions

In `src/lib/routing/url-helpers.ts`:

```ts
import { URL_MAP, RouteMapping, Locale } from './url-map';

/**
 * Given a path in one language, return the equivalent path in the other language.
 * Example: translatePath('/fr/services/solutions-ia/crm-intelligent', 'fr', 'en')
 *   → '/en/services/ai-solutions/smart-crm'
 */
export function translatePath(path: string, from: Locale, to: Locale): string {
  // Strip leading /{locale}/
  const stripped = path.replace(new RegExp(`^/${from}/?`), '');
  if (!stripped) return `/${to}`;
  
  const segments = stripped.split('/').filter(Boolean);
  const translated = translateSegments(segments, URL_MAP, from, to);
  return `/${to}/${translated.join('/')}`;
}

function translateSegments(
  segments: string[],
  level: RouteMapping[],
  from: Locale,
  to: Locale,
): string[] {
  if (segments.length === 0) return [];
  const [head, ...rest] = segments;
  const match = level.find(m => m[from] === head);
  if (!match) {
    // Dynamic segment (e.g., a slug from Sanity) — pass through unchanged
    return [head, ...rest];
  }
  const translatedHead = match[to];
  if (rest.length === 0) return [translatedHead];
  return [translatedHead, ...translateSegments(rest, match.children ?? [], from, to)];
}

/**
 * Normalize an incoming URL to canonical form.
 * Returns the locale detected, the segments, and the canonical pathname.
 */
export function parseRoute(pathname: string): { locale: Locale; segments: string[]; canonical: string } {
  const match = pathname.match(/^\/(fr|en)(\/.*)?$/);
  if (!match) {
    // Default to FR
    return { locale: 'fr', segments: [], canonical: '/fr' };
  }
  const locale = match[1] as Locale;
  const rest = (match[2] || '').split('/').filter(Boolean);
  return { locale, segments: rest, canonical: pathname };
}

/**
 * Generate a static link for a known route, with locale awareness.
 * Use this in components instead of <Link href="/projets">.
 */
export function localizedHref(canonicalRouteKey: string, locale: Locale): string {
  // canonicalRouteKey uses the FR slug as the canonical identifier
  // e.g., localizedHref('services/solutions-ia/crm-intelligent', 'en')
  //   → '/en/services/ai-solutions/smart-crm'
  const segments = canonicalRouteKey.split('/').filter(Boolean);
  const translated = translateSegments(segments, URL_MAP, 'fr', locale);
  return `/${locale}/${translated.join('/')}`;
}
```

### Step 3 — Middleware (`src/middleware.ts`)

Update the existing middleware to use the URL map:

```ts
import { NextResponse, NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { URL_MAP, RouteMapping } from './lib/routing/url-map';

const SUPPORTED_LOCALES = i18n.locales;

/**
 * Validate that the given segments match a real route in URL_MAP for the given locale.
 * Returns true if valid, false otherwise.
 */
function isValidRoute(segments: string[], locale: 'fr' | 'en'): boolean {
  // Allow empty (locale homepage)
  if (segments.length === 0) return true;
  
  // Match segments against URL_MAP
  let level: RouteMapping[] = URL_MAP;
  for (const segment of segments) {
    const match = level.find(m => m[locale] === segment);
    if (!match) {
      // Could be a dynamic segment (Sanity slug for project/post)
      // Check if the parent route allows dynamic children
      // For now: pass through (let the page handler 404 if invalid)
      return true;
    }
    level = match.children ?? [];
  }
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip API, static files, internal
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/studio') || pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Detect locale from URL
  const localeMatch = pathname.match(/^\/(fr|en)(\/.*)?$/);
  if (!localeMatch) {
    // No locale prefix — redirect to default locale
    const url = request.nextUrl.clone();
    url.pathname = `/${i18n.defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }
  
  const locale = localeMatch[1] as 'fr' | 'en';
  const rest = (localeMatch[2] || '').split('/').filter(Boolean);
  
  // Validate route (optional — currently let 404 happen at page level)
  if (!isValidRoute(rest, locale)) {
    // 404 will be handled by Next
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|studio).*)'],
};
```

### Step 4 — Folder structure for the pages

For each B3-localized route, you CANNOT use a single `src/app/[lang]/...` folder because slugs differ per language. Three approaches:

**Approach A — Catch-all + page logic (recommended)**
- Use `src/app/[lang]/[[...slug]]/page.tsx` as a catch-all
- The page reads `params.lang` and `params.slug`, uses `URL_MAP` to determine what content to render
- Pros: single page file, all routing logic in one place
- Cons: less Next.js-idiomatic, dynamic rendering everywhere

**Approach B — Generate all routes at build time via `generateStaticParams`**
- Use `src/app/[lang]/services/[family]/[service]/page.tsx`
- `generateStaticParams` returns BOTH FR and EN slug combinations
- Pros: idiomatic, static
- Cons: requires page templates per route shape, doesn't enforce slug uniqueness per language

**Approach C — Duplicate folders per language**
- `src/app/[lang]/services/sites-et-branding/page.tsx` (only renders on `/fr`)
- `src/app/[lang]/services/sites-and-branding/page.tsx` (only renders on `/en`)
- Each page checks `params.lang` and bails if wrong
- Pros: file structure matches URL structure
- Cons: a LOT of duplicate folders, hard to maintain

**Decision: APPROACH B.** Use `generateStaticParams` to produce all FR+EN slug pairs at build time. The page templates are: `[lang]/services/[family]/[service]/page.tsx`. The `generateStaticParams` function reads `URL_MAP` and outputs:
```ts
[
  { lang: 'fr', family: 'solutions-ia', service: 'crm-intelligent' },
  { lang: 'en', family: 'ai-solutions', service: 'smart-crm' },
  // ... all combinations
]
```

This requires that the family + service slugs in `URL_MAP` exactly match the directory structure. Folder is `[family]` and `[service]` — Next.js dynamic segments, but only the values from `URL_MAP` are generated.

### Step 5 — `<LocalizedLink>` component

Wrap Next.js `<Link>` to handle B3-localization automatically:

```ts
// src/components/ui/LocalizedLink.tsx
import Link from 'next/link';
import { localizedHref } from '@/lib/routing/url-helpers';
import { Locale } from '@/lib/routing/url-map';

interface Props {
  to: string;  // canonical FR-style key (e.g., "services/solutions-ia/crm-intelligent")
  lang: Locale;
  children: React.ReactNode;
  className?: string;
}

export function LocalizedLink({ to, lang, children, className }: Props) {
  return (
    <Link href={localizedHref(to, lang)} className={className}>
      {children}
    </Link>
  );
}
```

Use this everywhere instead of raw `<Link href="/services/...">`. The component handles the FR↔EN translation automatically based on the current locale.

### Step 6 — Language switcher

Update the language switcher to use `translatePath`:

```tsx
// In the navbar or wherever the FR/EN toggle lives
import { usePathname, useRouter } from 'next/navigation';
import { translatePath } from '@/lib/routing/url-helpers';

function LanguageSwitcher({ currentLocale }: { currentLocale: 'fr' | 'en' }) {
  const pathname = usePathname();
  const router = useRouter();
  const otherLocale = currentLocale === 'fr' ? 'en' : 'fr';
  
  function switchTo(target: 'fr' | 'en') {
    const newPath = translatePath(pathname, currentLocale, target);
    router.push(newPath);
  }
  
  return (
    <button onClick={() => switchTo(otherLocale)}>
      {otherLocale.toUpperCase()}
    </button>
  );
}
```

When user is on `/fr/services/solutions-ia/crm-intelligent` and clicks EN, they go to `/en/services/ai-solutions/smart-crm`. Not just `/en/services/solutions-ia/crm-intelligent` (which would 404).

### Step 7 — Sanity slug coordination

Sanity stores its own slug per service document. The slug stored in Sanity for a service in FR (`language='fr'`) must match the FR slug in `URL_MAP`. The slug in the EN version (`language='en'`) must match the EN slug.

→ Update the `generateStaticParams` in service pages to read **the Sanity slug** for the matching language, not just the URL_MAP. Pattern:

```ts
// src/app/[lang]/services/[family]/[service]/page.tsx
import { sanityClient } from '@/lib/sanity';

export async function generateStaticParams() {
  const services = await sanityClient.fetch<{
    family: string;
    slug: { current: string };
    language: 'fr' | 'en';
  }[]>(`*[_type == "service"]{family, slug, language}`);
  
  return services.map(svc => ({
    lang: svc.language,
    family: getFamilySlug(svc.family, svc.language),  // helper that maps 'solutions-ia' → 'ai-solutions' for EN
    service: svc.slug.current,
  }));
}
```

The `getFamilySlug` helper translates the family key (stored in Sanity as a stable identifier like `solutions-ia`) to the language-appropriate slug (`solutions-ia` for FR, `ai-solutions` for EN).

## Validation

1. **Type safety** — `URL_MAP` typed correctly, no `any`
2. **Build passes** — `npm run build` returns 0 errors
3. **Language switch works** — visit `/fr/services/solutions-ia/crm-intelligent`, click EN, lands on `/en/services/ai-solutions/smart-crm`
4. **Invalid routes 404** — `/en/services/solutions-ia/...` (FR slug on EN locale) returns 404 (not silent confusion)
5. **Dynamic routes pass through** — `/fr/projets/breethr` works, `/en/projects/breethr` works (slug is the same — Sanity project slug doesn't change per language for now)
6. **Sitemap** — generate sitemap.xml with all FR + EN URLs from URL_MAP. Submit to Search Console (separate hreflang annotations).

## Hors scope

- Don't create the pillar pages content — that's brief 07
- Don't create service detail pages — that's brief 08
- Don't set up the canonical/alternate hreflang headers in metadata — note as TODO for later
- Don't handle FR-only or EN-only content fallback — that's in brief 01's `<LanguageFallback>` component

## Commit instructions

```
feat(routing): localized B3 URL mapping (FR↔EN)

- Add URL_MAP source of truth in src/lib/routing/url-map.ts
- Add translatePath/localizedHref/parseRoute helpers
- Update middleware to validate routes against URL_MAP
- Use generateStaticParams (Approach B) for service pages
- Add <LocalizedLink> component for type-safe locale-aware links
- Update language switcher to translate paths
```

DO NOT push without user approval.
