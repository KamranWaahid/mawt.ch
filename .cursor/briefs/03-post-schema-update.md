# Brief 03 — Post schema update (categories + tags)

> **Prerequisites:**
> 1. Read `.cursor/briefs/00-context-mawt-overview.md` first.
> 2. **DEPENDS ON brief 01** (Sanity multilingual must be done first — `language` field needed on `post`).

## Context

The blog (Sanity `post` schema) has 3 posts and uses categories `technical/strategic/operational/culture` — these are template defaults that don't match MAWT's editorial strategy.

Decision (from brief 00): hybrid taxonomy — **4 editorial categories** + **free-form tags** that link to services.

## Decisions

### New categories (fixed list of 4)

| Value (slug) | Title FR | Title EN | Usage |
|---|---|---|---|
| `cas-clients` | Cas clients | Case studies | Posts qui racontent une mission MAWT (Crown, Mellender, Légumes, etc.) |
| `tendances-ia` | Tendances IA | AI trends | Veille, analyses, retours sur ce qui bouge dans l'IA business |
| `guides-pratiques` | Guides pratiques | Practical guides | How-to, tutorials, frameworks réutilisables |
| `opinions` | Opinions | Opinions | POV, thought leadership, prises de position |

The 3 existing posts (*The Hidden Cost of Poor Digital Infrastructure*, *The Future of Business...*, *Why Most Businesses Struggle...*) all fit in `opinions` — migrate them there.

### Tags (free-form)

Tags = strings, librement créables, mais idéalement alignés sur :
- Les **slugs des services** (ex: `crm-intelligent`, `agent-ia`, `rag-enterprise`, `formation-chatgpt`)
- Les **secteurs** (ex: `immobilier`, `restauration`, `medical`, `ecommerce`, `pme-romande`)
- Les **technos** (ex: `nextjs`, `sanity`, `n8n`, `odoo`)

Au moment d'écrire un post, l'auteur choisit 2-5 tags pertinents. Les pages `/blog/tag/[slug]` listent tous les posts avec ce tag.

## Schema spec (`src/sanity/schemaTypes/post.ts`)

Replace the existing `categories` field with the new one. Add a `tags` field. Keep all other fields.

```ts
import { defineField, defineType, defineArrayMember } from 'sanity';

export const postType = defineType({
  name: 'post',
  title: 'Blog & Insights',
  type: 'document',
  fields: [
    // ... existing fields: title, slug, author, mainImage ...
    
    defineField({
      name: 'category',  // RENAMED from "categories" (singular now)
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Cas clients / Case studies', value: 'cas-clients' },
          { title: 'Tendances IA / AI trends', value: 'tendances-ia' },
          { title: 'Guides pratiques / Practical guides', value: 'guides-pratiques' },
          { title: 'Opinions', value: 'opinions' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags',
      },
      description: 'Free-form tags. Suggested: service slugs (crm-intelligent, agent-ia...), sectors (immobilier, ecommerce...), or technologies (nextjs, sanity...). 2-5 tags ideal.',
    }),
    
    // Keep: publishedAt, excerpt, body, seo, language (from brief 01)
  ],
  // ... existing preview config ...
});
```

**Note:** the previous field was `categories` (array). The new field is `category` (single string). Be careful in the migration to handle existing data.

## Migration script (`scripts/migrate-posts-to-v18.ts`)

```ts
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'ewciugup',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function migrate() {
  const posts = await client.fetch<{
    _id: string;
    slug: { current: string };
    categories?: string[];
  }[]>(`*[_type == "post"]{_id, slug, categories}`);
  
  console.log(`Found ${posts.length} posts to migrate`);
  
  for (const post of posts) {
    // The 3 existing posts are all opinion pieces — assign 'opinions' category
    // If you have new posts that don't fit, update this logic
    const newCategory = 'opinions';
    
    await client
      .patch(post._id)
      .set({ category: newCategory })
      .unset(['categories'])  // remove the old array field
      .commit();
    
    console.log(`✏️  Migrated: ${post.slug.current} → category=${newCategory}`);
  }
}

migrate().catch(console.error);
```

Run: `SANITY_WRITE_TOKEN=xxx npx tsx scripts/migrate-posts-to-v18.ts`

**Manual step after script:** open Sanity Studio, edit each of the 3 posts, add 2-5 relevant tags (e.g., the "Hidden Cost" post might get tags: `transformation-numerique`, `pme-romande`, `digitalisation`).

## Update GROQ queries in `src/`

Anywhere posts are queried:
- Filter by `language` (added in brief 01)
- Replace `categories` references with `category`
- Add tag-based queries for `/blog/tag/[slug]` pages

Examples:
```ts
// Blog index
const posts = await sanityClient.fetch(
  `*[_type == "post" && language == $lang] | order(publishedAt desc)`,
  { lang: locale }
);

// Category page /blog/categorie/cas-clients
const posts = await sanityClient.fetch(
  `*[_type == "post" && language == $lang && category == $cat] | order(publishedAt desc)`,
  { lang: locale, cat: 'cas-clients' }
);

// Tag page /blog/tag/crm-intelligent
const posts = await sanityClient.fetch(
  `*[_type == "post" && language == $lang && $tag in tags] | order(publishedAt desc)`,
  { lang: locale, tag: 'crm-intelligent' }
);
```

## Validation

1. `npm run build` passes
2. Sanity Studio shows the new category dropdown (4 options) + tags field
3. 3 existing posts have `category == "opinions"` and `categories` field removed
4. Query `*[_type == "post" && language == "en" && category == "opinions"]` returns the 3 posts (after brief 01 tagged them with `language='en'`)
5. Studio "Translate" works to create FR versions of the 3 posts (or leave as TODO for content adaptation)

## Hors scope

- Don't write blog post content
- Don't create the blog pages (`/blog`, `/blog/categorie/[slug]`, etc.) — that's brief 09
- Don't translate existing posts to FR — that's content work

## Commit instructions

```
feat(sanity): post schema with v18 categories + free-form tags

- Replace template categories (technical/strategic/...) with 4 editorial cats
  (cas-clients, tendances-ia, guides-pratiques, opinions)
- Add tags field (free-form, layout: tags) for service/sector/techno linking
- Migrate 3 existing posts to category='opinions'
- Update GROQ queries in src/ for new field shape + language filter
```
