# Brief 01 — Sanity multilingual (foundation)

> **Prerequisites:**
> 1. Read `.cursor/briefs/00-context-mawt-overview.md` first.
> 2. Read `node_modules/sanity/dist/docs/` and the latest `@sanity/document-internationalization` plugin README — Sanity APIs change frequently, do NOT assume from training data.

## Context

MAWT's rule (from brief 00): **bilingual content everywhere, adapted per audience, never word-for-word translation**.

Current state of Sanity (project `ewciugup`, dataset `production`):
- All user-facing schemas store strings as single-language (e.g., `title: string`).
- Existing data is mostly English (services like "E-Commerce", "Custom Development", "Branding").
- No translations exist yet.
- 110 published documents + 2 drafts (~31 services, 3 projects, 3 posts, 20 FAQs, 11 partners, 3 testimonials, 1 siteSettings, 1 contact).

The need: each user-facing document needs **two independent versions** (FR + EN), each editable separately, linked together, with adapted (not translated) content.

## Decision: Document-level i18n via `@sanity/document-internationalization`

**Why document-level (Pattern A) and NOT field-level (Pattern B):**

| Criterion | Document-level (A) | Field-level (B) |
|---|---|---|
| Truly adapted content per lang (≠ translation) | ✅ Perfect | ❌ Awkward (same doc, parallel fields) |
| Independent publish/draft status per lang | ✅ Yes | ❌ No (one doc = one state) |
| Easy to add a 3rd language later (DE/IT) | ✅ Yes | 🟡 Possible but messy |
| Studio editor UX | ✅ Clear language switcher | 🟡 Two columns of fields |
| MAWT's "EN can be different from FR" rule (per brief 00) | ✅ Aligned | ❌ Encourages translation thinking |

**Plugin: `@sanity/document-internationalization`** (official Sanity plugin)
- Installs via `npm install @sanity/document-internationalization`
- Adds a `language` field to each schema (config-driven)
- Adds a `_i18n` reference linking translations together (`translationOf` pattern)
- Provides the "Translate" UI in Sanity Studio

**Verify the latest version + API** before implementing — the plugin had breaking changes around v3.

## Schemas to migrate (all user-facing)

These get the multilingual treatment:

| Schema | File | Reason |
|---|---|---|
| `service` | `src/sanity/schemaTypes/service.ts` | Service catalog pages |
| `project` | `src/sanity/schemaTypes/project.ts` | Case studies |
| `post` | `src/sanity/schemaTypes/post.ts` | Blog articles |
| `faq` | `src/sanity/schemaTypes/faq.ts` | FAQ items |
| `partner` | `src/sanity/schemaTypes/partner.ts` | Client logos / "trusted by" (name + description) |
| `testimonial` | `src/sanity/schemaTypes/testimonial.ts` | Client quotes |
| `author` | `src/sanity/schemaTypes/author.ts` | Author bios |
| `aboutContent` | `src/sanity/schemaTypes/about-content.ts` | About page (currently empty) |
| `contact` | `src/sanity/schemaTypes/contact.ts` | Contact page singleton |
| `siteSettings` | `src/sanity/schemaTypes/site-settings.ts` | Global site text |

These stay monolingual (internal data, no public display):
- `contact-lead` (form submissions)
- `newsletter-subscriber` (form submissions)
- `dictionary` (verify usage — may be obsolete with [lang] dictionaries in code)
- `career` (deleting route in brief 04 — verify if schema still useful)
- `pricing` (deleting route — verify if schema still useful)
- `doc` (deleting /docs route — schema can be removed entirely)

## Technical spec

### Step 1 — Backup the dataset

Before ANY migration:
```bash
npx sanity dataset export production ./backup-$(date +%Y%m%d-%H%M%S).tar.gz
```
Save the backup file somewhere safe. If anything goes wrong, restore with:
```bash
npx sanity dataset import ./backup-XXX.tar.gz production
```

### Step 2 — Install the plugin

```bash
npm install @sanity/document-internationalization
```

Verify version installed in `package.json`, check the README for that exact version.

### Step 3 — Configure the plugin in `sanity.config.ts`

```ts
import { documentInternationalization } from '@sanity/document-internationalization';

export default defineConfig({
  // ... existing config ...
  plugins: [
    structureTool({ structure: deskStructure }),
    codeInput(),
    documentInternationalization({
      supportedLanguages: [
        { id: 'fr', title: 'Français' },
        { id: 'en', title: 'English' },
      ],
      schemaTypes: [
        'service', 'project', 'post', 'faq',
        'partner', 'testimonial', 'author',
        'aboutContent', 'contact', 'siteSettings',
      ],
    }),
  ],
  // ...
});
```

### Step 4 — Update each schema with `language` field

For each multilingual schema, add the `language` field (the plugin auto-adds it but explicit is better). Example for `service.ts`:

```ts
defineField({
  name: 'language',
  type: 'string',
  readOnly: true,  // managed by the plugin
  hidden: true,    // hide from default form
}),
```

Don't break existing fields — just add `language` alongside.

### Step 5 — Migration script for existing data

Existing documents are unmarked. Write a one-time migration script that:
1. Tags every existing document with `language: 'en'` (since current content is English)
2. Does NOT create FR translations yet (user will translate manually via Studio UI, content is adapted per audience)

Script template (`scripts/migrate-add-language-en.ts`):

```ts
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'ewciugup',
  dataset: 'production',
  apiVersion: '2024-01-01',  // use latest stable
  token: process.env.SANITY_WRITE_TOKEN,  // need a write token from sanity.io/manage
  useCdn: false,
});

const SCHEMAS = ['service', 'project', 'post', 'faq', 'partner', 'testimonial', 'author', 'aboutContent', 'contact', 'siteSettings'];

async function migrate() {
  for (const type of SCHEMAS) {
    const docs = await client.fetch(`*[_type == $type && !defined(language)]`, { type });
    console.log(`${type}: ${docs.length} docs to update`);
    for (const doc of docs) {
      await client
        .patch(doc._id)
        .set({ language: 'en' })
        .commit();
    }
  }
}

migrate().catch(console.error);
```

Run with:
```bash
SANITY_WRITE_TOKEN=xxx npx tsx scripts/migrate-add-language-en.ts
```

**IMPORTANT:** Test on a small subset first. Maybe run dry-run by adding a `if (process.env.DRY === '1') { continue; }` then commenting out for real run.

### Step 6 — Update GROQ queries in the app

Anywhere the Next.js app queries Sanity, queries need to filter by language. Pattern:

**Before:**
```ts
const services = await sanityClient.fetch(`*[_type == "service"] | order(title)`);
```

**After:**
```ts
const services = await sanityClient.fetch(
  `*[_type == "service" && language == $lang] | order(title)`,
  { lang: locale }  // 'fr' or 'en' from the [lang] route segment
);
```

Audit `src/` for `sanityClient.fetch` calls and add the `language` filter to every one that fetches multilingual content.

### Step 7 — Update Sanity Studio structure

In `src/sanity/structure/deskStructure.ts`, group documents by language for cleaner editing. Pattern (verify exact API in plugin docs):

```ts
S.list()
  .title('Content')
  .items([
    S.listItem()
      .title('Services (FR)')
      .child(S.documentTypeList('service').filter('language == "fr"')),
    S.listItem()
      .title('Services (EN)')
      .child(S.documentTypeList('service').filter('language == "en"')),
    // ... same for each multilingual type
  ])
```

This is optional polish, can be deferred if Studio UX is acceptable without it.

### Step 8 — Delete obsolete schemas

After confirming nothing references them, delete:
- `src/sanity/schemaTypes/doc.ts` (if exists) — `/docs` is deleted
- `src/sanity/schemaTypes/career.ts` if NOT used anywhere — `/careers` is deleted
- `src/sanity/schemaTypes/pricing.ts` if NOT used — `/pricing` is deleted

Then remove their imports from `src/sanity/schemaTypes/index.ts`.

## Validation

1. **Backup confirmed** — backup file exists and is readable
2. **Plugin installed** — check `package.json` lists `@sanity/document-internationalization`
3. **Schemas updated** — `language` field present in all 10 multilingual schemas
4. **Migration ran** — query `*[!defined(language) && _type in ['service','project','post','faq','partner','testimonial','author','aboutContent','contact','siteSettings']]` returns 0 documents
5. **Studio works** — open `/studio`, can see language selector, can create a translation copy of a service from EN to FR
6. **App queries work** — start dev server, `/en/...` pages load with English content, `/fr/...` pages load with French content (where FR exists) or fallback gracefully (where FR doesn't exist yet — show EN with a notice, or hide)
7. **No regressions** — `npm run build` passes
8. **Existing data intact** — `*[_type == "service" && language == "en"]` returns the original ~31 services

## Fallback behavior (important)

For pages where the FR translation doesn't exist yet:
- **Services / pillar pages**: show EN content + an info banner `"Cette page est disponible uniquement en anglais pour le moment"` with a CTA "View in English" linking to `/en/...`. Don't 404.
- **Blog posts**: same pattern. If a post is EN-only and user is on `/fr/blog`, show it in the FR blog list but with a language badge `🇬🇧 in English`.
- **Case studies (/projets)**: same pattern.

Implement this as a `<LanguageFallback>` component or via a server component that fetches both languages and chooses gracefully.

## Hors scope (DO NOT do here)

- Do NOT create FR content/translations yet — that comes in content briefs (`content/*.md`)
- Do NOT restructure the service catalog — that's brief 02
- Do NOT set up the localized URL middleware — that's brief 05
- Do NOT touch the blog category/tags schema — that's brief 03
- Do NOT touch the Next.js routes — briefs 04, 07, 08

## Commit instructions

After validation:
```
feat(sanity): add document-level i18n (FR/EN) via @sanity/document-internationalization

- Install + configure @sanity/document-internationalization plugin
- Add language field to 10 user-facing schemas
- Migration script tags existing 110 docs with language='en'
- Update GROQ queries in src/ to filter by language
- Group Studio deskStructure by language
- Delete obsolete schemas (doc, career, pricing if unused)
- Add <LanguageFallback> component for missing translations
```

DO NOT push without user approval. Backup file should NOT be committed (add to `.gitignore` if not already).
