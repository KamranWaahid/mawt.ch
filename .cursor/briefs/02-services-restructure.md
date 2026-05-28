# Brief 02 — Services restructure (v18 catalog)

> **Prerequisites:**
> 1. Read `.cursor/briefs/00-context-mawt-overview.md` first.
> 2. **DEPENDS ON brief 01** (Sanity multilingual must be done first — `language` field needed).
> 3. Read `node_modules/sanity/dist/docs/` for current Sanity client API.

## Context

The current Sanity dataset has **27 services + 1 draft** that don't match MAWT's v18 catalog. Most current services are vague concepts ("Build the Right Website", "Generate Business", "Meeting Market Needs") or single-tech specialisations ("Moodle") that don't reflect what MAWT actually sells.

After detailed discovery (13 real client missions analyzed) + SEO research (~100 keywords tested in Google Ads CH), the catalog has been redefined into **5 families** with services aligned to real client demand AND validated search terms.

## Decision: v18 catalog (5 families)

### F1 — Sites & Branding

**FR family slug:** `sites-et-branding` · **EN family slug:** `sites-and-branding`

| FR slug | EN slug | Notes |
|---|---|---|
| `site-internet` | `website` | Service broad couvrant vitrine + sites avec listings (Mellender) |
| `e-commerce-eshop` | `e-commerce` | E-shop = pépite SEO Low comp 100-1K |
| `branding-identite` | `branding-identity` | Identité visuelle = 100-1K Low EN |
| `refonte-site-web` | `website-redesign` | **SEO only — pas affiché comme card** |
| `audit-ux-seo-performance` | `ux-seo-performance-audit` | Audit web (déplacé de F3) |

### F2 — Solutions IA

**FR family slug:** `solutions-ia` · **EN family slug:** `ai-solutions`

| FR slug | EN slug | Notes |
|---|---|---|
| `crm-intelligent` | `smart-crm` | 🔥 Pépite Low comp +∞ growth (FR: crm intelligent +∞+∞, EN: smart-crm validé) |
| `agent-ia-assistant` | `ai-agent` | Slash dans le titre H1. Agent IA = 1K-10K EN, niche IA majeure |
| `rag-intelligence-embarquee` | `rag-enterprise` | 🔥 +∞+∞ croissance EN. Signature MAWT (Mellender + Crown CRMs avec RAG) |
| `chatbots` | `chatbots` | Universel |
| `application-metier-logiciel-sur-mesure` | `custom-business-application` | Slash dans H1. Pourrait être aussi `business-application` (10-100 Low EN) |
| `automatisations` | `ai-automation` | 🔥 EN ai-automation = 100-1K Medium **+900% YoY** |
| `integrations-apis` | `integrations-apis` | Universel |
| `portail-client-entreprise` | `client-business-portal` | **SEO only — pas card** |
| `application-mobile` | `mobile-app` | ✅ **NEW** — confirmé par user. Application mobile native (iOS/Android) |

### F3 — Conseil IA

**FR family slug:** `conseil-ia` · **EN family slug:** `ai-consulting`

| FR slug | EN slug | Notes |
|---|---|---|
| `strategie-ia` | `ai-strategy` | 10-100 Medium |
| `audit-operationnel` | `business-audit` | ✅ Low comp + **+∞ YoY** EN. `operational-audit` était en chute -100% YoY, remplacé après recherche batch 7+8 |
| `conseil-organisationnel` | `organizational-consulting` | 10-100 Low EN stable |
| `transformation-numerique` | `digital-transformation` | 100-1K Low ⭐ pépite volume + low comp |
| `change-management` | `change-management` | Universel |
| `ai-change-management` | `ai-change-management` | **NEW page dédiée** — +∞ YoY niche IA. Existe en plus de `change-management` |
| `conseil-digitalisation` | `digital-transformation-consulting` | ✅ **NEW** — FR explose (+∞ +∞ Medium comp), EN Low comp stable. Confirmé batch 7 |

### F4 — Renfort & Équipe (dedicated experts, NOT freelancers)

**FR family slug:** `renfort-equipe` · **EN family slug:** `team-augmentation`

**Brand positioning rule (from brief 00):** Use "dedicated" / "embedded" — NEVER "freelance" / "hire" in the service NAMES. The compromise is: H2 subtitles on page can capture "hire X" SEO terms, but the slug + H1 stay positioned around "dedicated".

| FR slug | EN slug | Notes |
|---|---|---|
| `developpeur-dedie` | `dedicated-developer` | 🔥 EN dedicated-developer = +∞+∞ Low comp |
| `expert-ia-dedie` | `dedicated-ai-expert` | NEW — capture "hire ai developer" SEO via H2 (Medium comp +∞ YoY) |
| `designer-ux-dedie` | `dedicated-ux-designer` | Frame en H2 "hire UX designer" pour SEO (mais freelance-ux-designer décline -100% YoY) |
| `qa-testing` | `qa-testing` | Universel |
| `pilotage-projet` | `project-management` | Universel |
| `accompagnement-design` | `design-coaching` | Sparring/coaching design continu |
| `maintenance-applicative` | `application-maintenance` | 10-100 Low EN (vs software-maintenance qui décline) |
| `cto-temps-partiel` | `fractional-cto` | 🔥 EN +∞+∞ Medium comp — premium senior |
| `tech-lead-temps-partiel` | `fractional-tech-lead` | 🔥 EN +∞+∞ Low comp — premium senior |
| `engineering-as-a-service` | `engineering-as-a-service` | ✅ **Confirmé par user** — pépite SEO (Low comp +∞ 3M). Page tech-focused pour cibler CTOs scale-ups |

### F5 — Formation IA

**FR family slug:** `formation-ia` · **EN family slug:** `ai-training`

| FR slug | EN slug | Notes |
|---|---|---|
| `formation-chatgpt-entreprise` | `chatgpt-for-teams` | 10-100 Medium EN intent achat fort |
| `formation-ia-equipes` | `ai-workshop` | 10-100 Medium EN |
| `coaching-decideurs-ia` | `ai-coaching-for-leaders` | Pas testé directement, à valider |
| `accompagnement-adoption-ia` | `ai-implementation` | EN ai-adoption en chute, ai-implementation 10-100 Medium |

## Existing 27 services — fate per service

For each existing service in Sanity, decide DELETE, RENAME, or MIGRATE.

### KEEP & RENAME (reuse the doc, change title/slug/category to v18)

| Existing slug | → New FR slug | → New family | Action |
|---|---|---|---|
| `e-commerce` | `e-commerce-eshop` | F1 | Rename slug, update category to `sites-et-branding`, EN translation needed |
| `branding` | `branding-identite` | F1 | Rename slug, update category, EN translation |
| `cms` | (merge into `site-internet` page content) | — | DELETE this doc, content goes into the website service description |
| `seo` | (merge into `audit-ux-seo-performance` description) | F1 | DELETE doc, mentioned in audit service |
| `analytics` | (merge into `audit-ux-seo-performance` description) | F1 | DELETE doc, mentioned in audit service |
| `mobile-application` | (delete — not in v18) | — | DELETE (was draft `open-data` based on this) |
| `ui-design` | (merge into `branding-identite` or `site-internet`) | — | DELETE |
| `ux-design` | (merge into `site-internet` description) | — | DELETE |
| `ux-audit` | `audit-ux-seo-performance` | F1 | RENAME this doc |
| `user-research` | (delete — included in conseil-organisationnel narrative) | — | DELETE |
| `service-design` | (delete — included in conseil-organisationnel) | — | DELETE |
| `artificial-intelligence` | (split into multiple F2 services) | — | DELETE — content goes into `agent-ia-assistant` + `crm-intelligent` etc. |
| `custom-development` | (delete — split into F2 services) | — | DELETE |
| `digital-responsibility` | (delete — too abstract) | — | DELETE |

### DELETE without merge (vague concepts not in v18)

- `build-the-right-website` (vague — replaced by site-internet)
- `generate-business` (marketing speak)
- `meeting-market-needs` (vague)
- `improve-iteratively` (méthodologie, pas service)
- `understand-users` (= user-research, already deleted)
- `content-audit` (not in v18)
- `content-governance` (not in v18)
- `strategic-storytelling` (not in v18)
- `ux-writing` (not in v18)
- `design-governance` (not in v18)
- `trainings-and-sparring` (vague — F4/F5 have specific services)
- `moodle` (single-tech, MAWT doesn't push Moodle)
- Draft `open-data` (= renamed mobile-application that was abandoned — delete the draft, the published mobile-application is also deleted)

### CREATE new (most F2-F5 services are new)

Everything in the v18 tables above that doesn't have an existing match needs to be CREATED.

## Schema updates (`service.ts`)

The current schema has a `category: string` field with values like "Strategy", "Performance", "Design". Replace with a `family` field aligned to v18:

```ts
defineField({
  name: 'family',
  title: 'Famille / Family',
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

// New optional fields
defineField({
  name: 'displayAsCard',
  title: 'Show as card on family page',
  type: 'boolean',
  initialValue: true,
  description: 'Uncheck for SEO-only pages (refonte-site-web, portail-client-entreprise) that should be reachable via URL but not displayed as cards.',
}),

defineField({
  name: 'tier',
  title: 'Tier (priority on family page)',
  type: 'number',
  description: 'Lower number = displayed first. Use 1 for flagship services, 99 for legacy.',
  initialValue: 50,
}),

defineField({
  name: 'h2SeoCapture',
  title: 'H2 SEO capture (optional)',
  type: 'string',
  description: 'Secondary headline that targets a different search intent. Example: "Dedicated AI Expert" service can have H2 "Hire AI developer" to capture both queries.',
}),
```

**Migration of existing data:** the current `category` field can be deleted after migration. Write a migration script that maps:
- `Strategy` → DELETE (these services are being deleted)
- `Design` → mostly DELETE except branding-identite → `sites-et-branding`
- `Development` → DELETE most, e-commerce → `sites-et-branding`, CRMs → `solutions-ia`
- `Content` → DELETE all
- `Performance` → DELETE (analytics/seo merged into audit service)

## Technical spec — step-by-step

### Step 1 — Backup
Already done in brief 01. If not: `npx sanity dataset export production ./backup-services-$(date +%Y%m%d).tar.gz`

### Step 2 — Schema update
Edit `src/sanity/schemaTypes/service.ts`:
- Add `family` field (with the 5 v18 options)
- Add `displayAsCard` boolean
- Add `tier` number
- Add `h2SeoCapture` string
- KEEP existing fields (title, slug, description, icon, longDescription, features, seo, featuredProjects)
- The plugin from brief 01 adds `language` field

### Step 3 — Migration script (`scripts/migrate-services-to-v18.ts`)

```ts
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'ewciugup',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Map: old slug → action
const ACTIONS: Record<string, { action: 'delete' | 'rename'; newSlug?: string; newFamily?: string; newTitle?: string }> = {
  // KEEP & RENAME
  'e-commerce': { action: 'rename', newSlug: 'e-commerce-eshop', newFamily: 'sites-et-branding', newTitle: 'E-commerce / E-shop' },
  'branding': { action: 'rename', newSlug: 'branding-identite', newFamily: 'sites-et-branding', newTitle: 'Branding & identité' },
  'ux-audit': { action: 'rename', newSlug: 'audit-ux-seo-performance', newFamily: 'sites-et-branding', newTitle: 'Audit UX / SEO / performance' },

  // DELETE (vague concepts or replaced by new structure)
  'cms': { action: 'delete' },
  'seo': { action: 'delete' },
  'analytics': { action: 'delete' },
  'mobile-application': { action: 'delete' },
  'ui-design': { action: 'delete' },
  'ux-design': { action: 'delete' },
  'user-research': { action: 'delete' },
  'service-design': { action: 'delete' },
  'artificial-intelligence': { action: 'delete' },
  'custom-development': { action: 'delete' },
  'digital-responsibility': { action: 'delete' },
  'build-the-right-website': { action: 'delete' },
  'generate-business': { action: 'delete' },
  'meeting-market-needs': { action: 'delete' },
  'improve-iteratively': { action: 'delete' },
  'understand-users': { action: 'delete' },
  'content-audit': { action: 'delete' },
  'content-governance': { action: 'delete' },
  'strategic-storytelling': { action: 'delete' },
  'ux-writing': { action: 'delete' },
  'design-governance': { action: 'delete' },
  'trainings-and-sparring': { action: 'delete' },
  'moodle': { action: 'delete' },
  'open-data': { action: 'delete' },  // the draft
};

async function migrate() {
  const existingServices = await client.fetch<{_id: string; slug: {current: string}; title: string}[]>(
    `*[_type == "service" && language == "en"]{_id, slug, title}`
  );
  console.log(`Found ${existingServices.length} services to process`);

  for (const svc of existingServices) {
    const action = ACTIONS[svc.slug.current];
    if (!action) {
      console.log(`⚠️  No action for slug "${svc.slug.current}" — leaving untouched`);
      continue;
    }
    if (action.action === 'delete') {
      // Check for references before deleting
      const refs = await client.fetch<{_id: string}[]>(
        `*[references($id)]{_id}`,
        { id: svc._id }
      );
      if (refs.length > 0) {
        console.log(`⚠️  Cannot delete "${svc.slug.current}" — referenced by ${refs.length} docs (likely projects). Removing references first.`);
        for (const ref of refs) {
          await client.patch(ref._id).unset([`services[_ref == "${svc._id}"]`]).commit();
        }
      }
      await client.delete(svc._id);
      console.log(`🗑️  Deleted: ${svc.slug.current}`);
    } else if (action.action === 'rename') {
      await client.patch(svc._id)
        .set({
          'slug.current': action.newSlug!,
          title: action.newTitle!,
          family: action.newFamily!,
        })
        .unset(['category'])
        .commit();
      console.log(`✏️  Renamed: ${svc.slug.current} → ${action.newSlug}`);
    }
  }
}

migrate().catch(console.error);
```

Run with: `SANITY_WRITE_TOKEN=xxx npx tsx scripts/migrate-services-to-v18.ts`

### Step 4 — Create the NEW v18 services

After deletion + renames, create the remaining v18 services as new docs.

Use either:
- **Sanity Studio UI** (manual, slower, gives editorial control)
- **OR a creation script** (faster, idempotent)

Recommended: script for the bulk creation, then manual editing for the H1/H2/description content in Studio.

Creation script template (`scripts/create-v18-services.ts`):

```ts
const V18_SERVICES = [
  // F1 Sites & Branding
  { family: 'sites-et-branding', slug: 'site-internet', title: 'Site internet', tier: 1 },
  { family: 'sites-et-branding', slug: 'refonte-site-web', title: 'Refonte de site web', tier: 99, displayAsCard: false },
  // (e-commerce and branding-identite + audit already migrated from existing)
  
  // F2 Solutions IA
  { family: 'solutions-ia', slug: 'crm-intelligent', title: 'CRM intelligent', tier: 1 },
  { family: 'solutions-ia', slug: 'agent-ia-assistant', title: 'Agent IA / Assistant IA', tier: 2 },
  { family: 'solutions-ia', slug: 'rag-intelligence-embarquee', title: 'RAG / Intelligence embarquée', tier: 3 },
  { family: 'solutions-ia', slug: 'chatbots', title: 'Chatbots', tier: 4 },
  { family: 'solutions-ia', slug: 'application-metier-logiciel-sur-mesure', title: 'Application métier / Logiciel sur mesure', tier: 5 },
  { family: 'solutions-ia', slug: 'automatisations', title: 'Automatisations', tier: 6 },
  { family: 'solutions-ia', slug: 'integrations-apis', title: 'Intégrations & APIs', tier: 7 },
  { family: 'solutions-ia', slug: 'application-mobile', title: 'Application mobile', tier: 8 },
  { family: 'solutions-ia', slug: 'portail-client-entreprise', title: 'Portail client & entreprise', tier: 99, displayAsCard: false },

  // F3 Conseil IA
  { family: 'conseil-ia', slug: 'strategie-ia', title: 'Stratégie IA', tier: 1 },
  { family: 'conseil-ia', slug: 'audit-operationnel', title: 'Audit opérationnel', tier: 2 },
  { family: 'conseil-ia', slug: 'conseil-organisationnel', title: 'Conseil organisationnel', tier: 3 },
  { family: 'conseil-ia', slug: 'transformation-numerique', title: 'Transformation numérique', tier: 4 },
  { family: 'conseil-ia', slug: 'change-management', title: 'Change management', tier: 5 },
  { family: 'conseil-ia', slug: 'ai-change-management', title: 'AI change management', tier: 6 },
  { family: 'conseil-ia', slug: 'conseil-digitalisation', title: 'Conseil digitalisation', tier: 7 },

  // F4 Renfort & Équipe
  { family: 'renfort-equipe', slug: 'developpeur-dedie', title: 'Développeur dédié', tier: 1, h2SeoCapture: 'Hire freelance developer' },
  { family: 'renfort-equipe', slug: 'expert-ia-dedie', title: 'Expert IA dédié', tier: 2, h2SeoCapture: 'Hire AI developer' },
  { family: 'renfort-equipe', slug: 'designer-ux-dedie', title: 'Designer UX dédié', tier: 3, h2SeoCapture: 'Hire UX designer' },
  { family: 'renfort-equipe', slug: 'qa-testing', title: 'QA & testing', tier: 4 },
  { family: 'renfort-equipe', slug: 'pilotage-projet', title: 'Pilotage de projet', tier: 5 },
  { family: 'renfort-equipe', slug: 'accompagnement-design', title: 'Accompagnement design / Design coaching', tier: 6 },
  { family: 'renfort-equipe', slug: 'maintenance-applicative', title: 'Maintenance applicative', tier: 7 },
  { family: 'renfort-equipe', slug: 'cto-temps-partiel', title: 'CTO à temps partiel / Fractional CTO', tier: 8 },
  { family: 'renfort-equipe', slug: 'tech-lead-temps-partiel', title: 'Tech Lead à temps partiel / Fractional Tech Lead', tier: 9 },
  { family: 'renfort-equipe', slug: 'engineering-as-a-service', title: 'Engineering as a Service', tier: 10 },

  // F5 Formation IA
  { family: 'formation-ia', slug: 'formation-chatgpt-entreprise', title: 'Formation ChatGPT en entreprise', tier: 1 },
  { family: 'formation-ia', slug: 'formation-ia-equipes', title: 'Formation IA pour équipes', tier: 2 },
  { family: 'formation-ia', slug: 'coaching-decideurs-ia', title: 'Coaching décideurs IA', tier: 3 },
  { family: 'formation-ia', slug: 'accompagnement-adoption-ia', title: 'Accompagnement adoption IA', tier: 4 },
];

async function create() {
  for (const svc of V18_SERVICES) {
    // Check if already exists
    const existing = await client.fetch(`*[_type == "service" && slug.current == $slug && language == "fr"][0]`, { slug: svc.slug });
    if (existing) {
      console.log(`⏭️  Already exists: ${svc.slug}`);
      continue;
    }
    await client.create({
      _type: 'service',
      title: svc.title,
      slug: { _type: 'slug', current: svc.slug },
      family: svc.family,
      tier: svc.tier ?? 50,
      displayAsCard: svc.displayAsCard ?? true,
      h2SeoCapture: svc.h2SeoCapture,
      language: 'fr',
    });
    console.log(`✅ Created: ${svc.slug}`);
  }
}

create().catch(console.error);
```

### Step 5 — EN translations

For each FR service created, create an EN version using the Sanity Studio "Translate" button (from `@sanity/document-internationalization` plugin installed in brief 01). The EN slugs follow the table in the v18 catalog above.

DO NOT auto-translate titles via script — the user wants adapted, not translated content. Use the Studio UI.

For NOW, you can create the EN counterparts with placeholder slugs + titles to unblock the routing work. Content adaptation comes via the `content/services-pillar-copy.md` brief.

### Step 6 — Update deskStructure for the new families

Edit `src/sanity/structure/deskStructure.ts` to group services by family + language for cleaner Studio editing.

## Validation

1. `npm run build` passes
2. Query check: `*[_type == "service" && language == "fr"]` returns the new ~28 v18 services (no `category` field, all have `family` field, no obsolete slugs)
3. Query check: `*[_type == "service" && family == "solutions-ia" && language == "fr"]` returns the 8 F2 services
4. No orphan references: `*[references(*[_type == "service" && language == "en" && slug.current in ["build-the-right-website", "generate-business", ...]]._id)]` returns empty
5. Studio "Translate" works on a service — can create EN version
6. Old slugs return 404 (or 301 if we set up redirects — out of scope here)

## Items confirmed (2026-05-27)

All ambiguities have been resolved with the user. Status:

1. ✅ **`engineering-as-a-service` (F4)** — INCLUDED. Tech-focused service for scale-up CTOs (Low comp + +∞ 3M growth).
2. ✅ **`audit-operationnel` EN slug** — `business-audit` selected after Google Ads research (batch 7+8). Low comp + +∞ YoY. `operational-audit` rejected (-100% YoY).
3. ✅ **`conseil-digitalisation` in F3** — INCLUDED. FR explodes (+∞+∞ Medium), EN slug = `digital-transformation-consulting` (Low comp stable).
4. ✅ **App mobile in F2** — INCLUDED. New service `application-mobile` / `mobile-app`.
5. ❌ **CMS sur-mesure** — NOT included as distinct service. Covered conceptually by `application-metier-logiciel-sur-mesure` (avoid fragmentation).

## Hors scope

- Don't write the service descriptions (`longDescription`, `description`) — that comes in `content/services-pillar-copy.md`
- Don't link to projects via `featuredProjects` yet
- Don't create the Next.js pages — that's briefs 07 + 08
- Don't set up the URL routing — that's brief 05

## Commit instructions

```
feat(sanity): restructure services catalog to v18 (5 families, 28 services)

- Add family/displayAsCard/tier/h2SeoCapture fields to service schema
- Migrate 14 existing services: rename 3, delete 11
- Create 25 new services across F1-F5 families
- Update deskStructure to group by family + language
- Remove obsolete category field
```

DO NOT push without user approval.
