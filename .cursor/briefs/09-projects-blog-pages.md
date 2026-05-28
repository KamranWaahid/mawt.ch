# Brief 09 — Projects & Blog pages

> **Prerequisites:**
> 1. Read `.cursor/briefs/00-context-mawt-overview.md` first.
> 2. **DEPENDS ON briefs 01 (multilingue), 03 (post schema), 05 (routing B3), 06 (navbar)**.
> 3. Copy content (descriptions, intros) for `/projets` and `/blog` overview pages comes via Sanity content (per project / per post).

## Context

Two content hubs to build :
1. **Projects** : `/fr/projets` (FR) ↔ `/en/projects` (EN) + detail pages `/fr/projets/[slug]`
2. **Blog** : `/fr/blog` (FR) ↔ `/en/blog` (EN) + categories, tags, authors, individual posts

## Decisions

### Projects routes (3 pages)

| FR | EN | Page |
|---|---|---|
| `/fr/projets` | `/en/projects` | Overview (grid of all projects) |
| `/fr/projets/[slug]` | `/en/projects/[slug]` | Project detail (case study) |
| (no category/tag pages for projects in v18) | | |

### Blog routes (5 pages)

| FR | EN | Page |
|---|---|---|
| `/fr/blog` | `/en/blog` | Overview (latest + categories) |
| `/fr/blog/categorie/[slug]` | `/en/blog/category/[slug]` | Posts in a category |
| `/fr/blog/tag/[slug]` | `/en/blog/tag/[slug]` | Posts with a tag |
| `/fr/blog/auteur/[slug]` | `/en/blog/author/[slug]` | Posts by an author |
| `/fr/blog/[slug]` | `/en/blog/[slug]` | Individual post |

### Language fallback (from brief 01)

For project detail pages, if user requests `/fr/projets/breethr` but only EN version exists:
- Render the EN version with a notice banner : *"Cette étude de cas est disponible uniquement en anglais"* + link to `/en/projects/breethr`
- Don't 404
- Same logic for blog posts

## Technical spec

### `src/app/[lang]/projets/page.tsx` (overview)

Note: route folder is `projets/` even for EN (via routing translation in brief 05). Cursor: with Approach B from brief 05, the folder name must match. Two options :
- **Option a** : duplicate folders `projets/` AND `projects/` and use middleware rewrite. Annoying.
- **Option b (recommended)** : use a catch-all `[lang]/[...slug]/page.tsx` route just for these top-level page mismatches.
- **Option c (recommended for simplicity)** : keep the folder named after the canonical FR slug (`projets`, `a-propos`, etc.) — middleware rewrites `/en/projects` → `/en/projets` internally for the file router. URL displayed is `/en/projects` (rewritten back).

**Decision: Option c — internal rewrite in middleware.** Folder is `[lang]/projets/`. Middleware rewrites incoming `/en/projects` to `/en/projets` (internal). User sees `/en/projects`, server renders `[lang]/projets/page.tsx` with `lang=en`.

Update brief 05's middleware to add these rewrites.

```tsx
// src/app/[lang]/projets/page.tsx
import { sanityClient } from '@/lib/sanity';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { Locale } from '@/lib/routing/url-map';

interface Props { params: Promise<{ lang: Locale }>; }

export default async function ProjectsOverviewPage({ params }: Props) {
  const { lang } = await params;
  
  const projects = await sanityClient.fetch(`
    *[_type == "project" && language == $lang] | order(year desc, _createdAt desc){
      _id, title, slug, excerpt, coverImage, year, industry, workType, tags,
      services[]->{ _id, family, slug }
    }
  `, { lang });
  
  return <ProjectsGrid projects={projects} lang={lang} />;
}

export async function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const t = {
    fr: { title: 'Projets | MAWT', description: 'Nos cas clients : du site vitrine à la transformation IA complète.' },
    en: { title: 'Projects | MAWT', description: 'Our case studies : from websites to full AI transformations.' },
  }[lang];
  return t;
}
```

### `src/components/projects/ProjectsGrid.tsx`

Grid + filters by family (multi-select). Each project card shows :
- Cover image
- Title
- Year + industry
- Family chips (which families this project covers, derived from services[].family deduplicated)
- "Lire le cas" link

### `src/app/[lang]/projets/[slug]/page.tsx` (detail)

```tsx
import { sanityClient } from '@/lib/sanity';
import { ProjectDetailLayout } from '@/components/projects/ProjectDetailLayout';
import { LanguageFallback } from '@/components/i18n/LanguageFallback';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ lang: 'fr' | 'en'; slug: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  
  // Try current language first, then fallback
  let project = await sanityClient.fetch(
    `*[_type == "project" && slug.current == $slug && language == $lang][0]{...}`,
    { slug, lang }
  );
  
  let usingFallback = false;
  if (!project) {
    const otherLang = lang === 'fr' ? 'en' : 'fr';
    project = await sanityClient.fetch(
      `*[_type == "project" && slug.current == $slug && language == $otherLang][0]{...}`,
      { slug, otherLang }
    );
    if (!project) notFound();
    usingFallback = true;
  }
  
  return (
    <>
      {usingFallback && <LanguageFallback availableIn={project.language} lang={lang} />}
      <ProjectDetailLayout project={project} lang={lang} />
    </>
  );
}

export async function generateStaticParams() {
  const projects = await sanityClient.fetch<{ slug: { current: string }; language: 'fr' | 'en' }[]>(
    `*[_type == "project" && defined(slug.current)]{slug, language}`
  );
  return projects.map(p => ({ lang: p.language, slug: p.slug.current }));
}
```

### `ProjectDetailLayout` anatomy

```
HERO
  - H1 = project.title
  - Subhead = project.excerpt
  - Cover image
  - Year · Industry · Work type · Family chips

OVERVIEW (project.overview)
  - 1-2 paragraphs

PROBLEM STATEMENT (project.problemStatement + problemImage)
SOLUTION (project.solution + solutionImage)

PHASES (project.phases — accordion or timeline)
  - For each phase: title, description, deliverables

DELIVERABLES (project.deliverables — bullet list)

TECHNOLOGIES USED (project.technologies — tags)

GALLERY (project.gallery — image grid)

VIDEO (project.videoUrl — embed if present)

TESTIMONIAL (project.testimonialQuote + author)

SERVICES INVOLVED
  - Links to services that powered this project
  - Use service.family to link to /services/<family>/<service-slug>

BOTTOM CTA
  - "Démarrer un projet similaire" → /contact
```

### Blog overview `src/app/[lang]/blog/page.tsx`

```tsx
import { sanityClient } from '@/lib/sanity';
import { BlogOverview } from '@/components/blog/BlogOverview';

export default async function BlogOverviewPage({ params }) {
  const { lang } = await params;
  
  const data = await sanityClient.fetch(`{
    "latest": *[_type == "post" && language == $lang] | order(publishedAt desc)[0..8]{
      _id, title, slug, mainImage, excerpt, publishedAt, category, tags,
      author->{ _id, name, slug, image }
    },
    "byCategory": {
      "cas-clients": *[_type == "post" && language == $lang && category == "cas-clients"] | order(publishedAt desc)[0..2],
      "tendances-ia": *[_type == "post" && language == $lang && category == "tendances-ia"] | order(publishedAt desc)[0..2],
      "guides-pratiques": *[_type == "post" && language == $lang && category == "guides-pratiques"] | order(publishedAt desc)[0..2],
      "opinions": *[_type == "post" && language == $lang && category == "opinions"] | order(publishedAt desc)[0..2],
    }
  }`, { lang });
  
  return <BlogOverview data={data} lang={lang} />;
}
```

### Blog overview layout

```
HERO
  - H1 = "Blog" / "Insights" / "Le blog MAWT"
  - Sub-headline tagline

LATEST POSTS (top 6-9 in grid)

BY CATEGORY (one row per category)
  - "Cas clients" : 2-3 cards + "Voir tous"
  - "Tendances IA" : 2-3 cards + "Voir tous"
  - "Guides pratiques" : 2-3 cards + "Voir tous"
  - "Opinions" : 2-3 cards + "Voir tous"

TAGS CLOUD (optional) — top 20 most used tags

NEWSLETTER CTA
  - Use existing newsletter form
```

### Category/Tag/Author pages

```tsx
// src/app/[lang]/blog/categorie/[slug]/page.tsx
// Same pattern but filtered: *[_type == "post" && language == $lang && category == $slug]

// src/app/[lang]/blog/tag/[slug]/page.tsx
// Same pattern: *[_type == "post" && language == $lang && $tag in tags]

// src/app/[lang]/blog/auteur/[slug]/page.tsx
// Filter by author reference: *[_type == "post" && language == $lang && author->slug.current == $slug]
```

All three use the same component shell (`<PostsList>`) with header showing what's being filtered.

### Individual post `src/app/[lang]/blog/[slug]/page.tsx`

Standard blog post layout :
```
HERO
  - H1 = post.title
  - Author + date + category chip + read time estimate
  - Cover image

BODY (Portable Text)

TAGS (chip links)

AUTHOR CARD (bio + other posts)

RELATED POSTS (same category or tags)

NEWSLETTER CTA
```

Use `<LanguageFallback>` if post doesn't exist in current lang.

### Schema.org for blog posts

```ts
{
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  image: post.mainImage,
  author: { '@type': 'Person', name: post.author.name },
  datePublished: post.publishedAt,
  publisher: { '@type': 'Organization', name: 'MAWT', logo: '...' },
}
```

For projects :
```ts
{
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: project.title,
  // ...
}
```

## Validation

1. `npm run build` passes — all overview + dynamic pages generated
2. `/fr/projets` shows 3 existing projects (Mellender, Crown if added, etc.)
3. `/fr/blog` shows latest posts grouped by 4 categories
4. Tag pages work : `/fr/blog/tag/crm-intelligent` lists posts tagged with that
5. Language fallback works : if a project exists only in EN, visiting `/fr/projets/<slug>` shows EN with banner
6. SEO : each page has unique title + description, schema.org for blog posts and projects
7. Lighthouse 90+ on overview and detail pages

## Hors scope

- Don't write blog post or project content — that's Sanity editorial work
- Don't implement search — not in v18 scope
- Don't add comments — not in v18 scope
- Don't implement RSS feed — TODO for later
- Don't style — designer

## Commit instructions

```
feat(content): projects + blog pages

- Add /projets overview + /projets/[slug] detail (with i18n fallback)
- Add /blog overview + /blog/categorie/[slug] + /blog/tag/[slug] + /blog/auteur/[slug] + /blog/[slug]
- Use middleware rewrite for /en/projects → /en/projets (internal)
- Schema.org for BlogPosting (posts) and CreativeWork (projects)
- LanguageFallback banner when content missing in current lang
- All routes use language filter on Sanity queries
```
