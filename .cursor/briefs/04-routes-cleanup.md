# Brief 04 — Routes cleanup

> **Prerequisite:** Read `.cursor/briefs/00-context-mawt-overview.md` first.

## Context

The site `src/app/[lang]/` contains 16 routes inherited from a template that don't match MAWT's v18 catalog. After review with the founder, 13 routes are to be deleted, 3 are kept (with renamed slugs for B3 localization).

Footer in `fr.json` has 5 columns that don't match `en.json` (4 columns). This needs to be aligned during cleanup.

## Decisions taken

### Routes to DELETE (13)

Delete the directory `src/app/[lang]/<route>/` for each:
- `careers`
- `community`
- `cookie-policy` (merged into existing `/cookies` — keep `/cookies` if it exists or create it)
- `docs` (full dir including `[slug]`, `layout.tsx`, `page.tsx`)
- `enterprise`
- `help`
- `integrations` — **set up 301 redirect** to `/services/solutions-ia/integrations-apis` (FR) and `/services/ai-solutions/integrations-apis` (EN). Use Next.js redirects config or middleware.
- `personal`
- `pricing`
- `results`
- `small-business`
- `solutions` (NO redirect — conflicts with future F2 family `/services/solutions-ia` so just delete)
- `status`

### Routes to KEEP — rename with B3 localization (3)

| Old route | New FR slug | New EN slug |
|---|---|---|
| `/partners` | `/clients` | `/partners` |
| `/process` | `/notre-methode` | `/our-process` |
| `/security` | `/securite` | `/security` |

These should be renamed to the new slugs and the URL routing config updated accordingly. (URL localization full spec coming in brief `05-routing-localized-b3.md` — for now, just rename the directories in `src/app/[lang]/`.)

### Components to DELETE

The following components reference `/docs` and become unused:
- `src/components/ui/help-search.tsx`
- `src/components/ui/docs-sidebar.tsx`
- `src/components/ui/docs-search.tsx`

Delete them. Also grep for any imports of these and remove the import statements (don't leave dead imports).

### Dictionary cleanup

In both `src/dictionaries/en.json` and `src/dictionaries/fr.json`:

1. **Remove all keys under `help.*`** entirely (badge, headline, searchPlaceholder, noResults, articles, quickLinks, categories.*). The Help Center is gone.

2. **Footer alignment** — currently `fr.json` has 5 columns with different structure than `en.json` (4 columns). Align both to the **same 4-column structure** after removing obsolete links.

**New unified footer structure (4 columns):**

```json
"footer": {
  "rights": "...",
  "cookieSettings": "...",
  "columns": [
    {
      "title": "Company / Entreprise",
      "links": [
        { "label": "About / À propos", "href": "/about (or /a-propos)" },
        { "label": "Contact", "href": "/contact" },
        { "label": "Clients / Partners", "href": "/clients (FR) | /partners (EN)" }
      ]
    },
    {
      "title": "Services",
      "links": [
        { "label": "All services / Tous les services", "href": "/services" },
        { "label": "Our process / Notre méthode", "href": "/notre-methode (FR) | /our-process (EN)" },
        { "label": "Projects / Projets", "href": "/projets (FR) | /projects (EN)" }
      ]
    },
    {
      "title": "Resources / Ressources",
      "links": [
        { "label": "Blog", "href": "/blog" },
        { "label": "FAQs / FAQ", "href": "/faqs" }
      ]
    },
    {
      "title": "Legal / Légal",
      "links": [
        { "label": "Privacy / Confidentialité", "href": "/privacy (EN) | /confidentialite (FR)" },
        { "label": "Terms / Conditions", "href": "/terms (EN) | /conditions-utilisation (FR)" },
        { "label": "Cookies", "href": "/cookies" },
        { "label": "Security / Sécurité", "href": "/security (EN) | /securite (FR)" }
      ]
    },
    "newsletter": { ... existing newsletter object ... }
  ]
}
```

**Remove obsolete labels from both dictionaries:**
- Careers / Carrières
- Community / Communauté
- Cookie Policy / Paramètres des cookies (kept as `cookieSettings`)
- Documentation
- Enterprise / Entreprise (as standalone link, not as column title)
- Integrations / Intégrations (link only — the redirect handles the URL)
- Partners / Programmes partenaires (replaced by Clients/Partners)
- Personal / Personnel
- Pricing / Tarification
- Process / Comment ça marche (replaced by Our process / Notre méthode — same target, new slug)
- Results / Résultats
- Security (existing — KEEP, just update href to new slug)
- Small Business / Petite Entreprise
- Status / Statut
- Systems / Systèmes (was /solutions, now gone)

## Technical spec

### Step-by-step execution order

1. **Read current state**
   - `git status` to confirm clean working tree
   - Verify the routes exist before deleting

2. **Delete obsolete route directories**
   - `rm -rf` each of the 13 listed `src/app/[lang]/<route>/` directories

3. **Rename the 3 kept routes**
   - `git mv src/app/[lang]/partners` → 2 directories: one for FR (`/clients`), one for EN (`/partners`)
   - Same pattern for `/process` → `/notre-methode` (FR) + `/our-process` (EN)
   - Same for `/security` → `/securite` (FR) + `/security` (EN)
   - **Note:** This requires the localized routing setup (brief 05). For now, just create both directories with the page content duplicated, marked TODO for proper i18n routing.

4. **Delete obsolete components**
   - `rm src/components/ui/help-search.tsx src/components/ui/docs-sidebar.tsx src/components/ui/docs-search.tsx`
   - `grep -r "help-search\|docs-sidebar\|docs-search" src/` — fix any remaining imports

5. **Set up 301 redirect for /integrations**
   - In `next.config.ts`, add to the `redirects()` async function:
   ```ts
   {
     source: '/:lang(en|fr)/integrations',
     destination: '/:lang/services/ai-solutions/integrations-apis',  // EN destination
     permanent: true,
   }
   ```
   - **Note:** when FR slug for ai-solutions exists (brief 05), make this language-aware. For now, redirect both to the EN slug.

6. **Clean up dictionaries**
   - Edit `src/dictionaries/en.json`: remove `help` block, restructure `footer.columns` to the 4-column unified structure above
   - Edit `src/dictionaries/fr.json`: same — remove `help` block, restructure `footer.columns` matching FR translations

7. **Run typecheck & build**
   - `npm run typecheck` (or `tsc --noEmit`)
   - `npm run build` to catch any remaining broken references

## Content to use

For the footer labels, use these exact translations:

| Slot | EN | FR |
|---|---|---|
| Column 1 title | "Company" | "Entreprise" |
| Column 2 title | "Services" | "Services" |
| Column 3 title | "Resources" | "Ressources" |
| Column 4 title | "Legal" | "Légal" |
| Link: About | "About us" | "À propos" |
| Link: Contact | "Contact" | "Contact" |
| Link: Clients/Partners | "Clients & partners" | "Clients & partenaires" |
| Link: All services | "All services" | "Tous nos services" |
| Link: Our process | "Our process" | "Notre méthode" |
| Link: Projects | "Projects" | "Projets" |
| Link: Blog | "Blog" | "Blog" |
| Link: FAQs | "FAQs" | "FAQ" |
| Link: Privacy | "Privacy" | "Confidentialité" |
| Link: Terms | "Terms of service" | "Conditions d'utilisation" |
| Link: Cookies | "Cookies" | "Cookies" |
| Link: Security | "Security" | "Sécurité" |

## Validation

After execution, verify:

1. **Build passes** — `npm run build` returns 0 errors
2. **No dead links** — `grep -r "/help\|/docs\|/careers\|/community\|/enterprise\|/personal\|/pricing\|/process\b\|/results\|/security\b\|/small-business\|/solutions\b\|/status\|/partners\b\|/integrations" src/` shows only intentional references (renamed slugs)
3. **Routes file structure** — `ls src/app/[lang]/` shows ONLY: `about, admin, blog, clients OR partners, contact, cookies, faqs, login, notre-methode OR our-process, projects, securite OR security, services, layout.tsx, page.tsx`
4. **Dictionaries valid JSON** — `node -e "JSON.parse(require('fs').readFileSync('src/dictionaries/en.json'))"` succeeds for both files
5. **Footer renders** — start dev server, check footer renders 4 columns identically structured in both `/en` and `/fr`
6. **301 redirect works** — visit `/en/integrations` → redirected to `/en/services/ai-solutions/integrations-apis` (page may 404 if not yet built — that's expected for now, the redirect itself should work)

## Hors scope (DO NOT do here)

- Don't create the new `/services/<family>/<service>` routes yet — those come in brief `07-pillar-pages-services.md` and `08-service-detail-pages.md`
- Don't implement the full B3 localized middleware — only the basic directory renames. Full middleware in brief `05-routing-localized-b3.md`
- Don't touch any Sanity schemas
- Don't add new pages (the `/clients`, `/notre-methode`, `/securite` pages should be the SAME content as their old counterparts, just relocated)

## Commit instructions

After validation passes, commit with:

```
chore: cleanup obsolete routes, align footer, prep B3 routing

- Delete 13 obsolete routes (template residue: careers, community, docs, enterprise, help, etc.)
- Rename /partners → /clients (FR), /process → /notre-methode (FR), /security → /securite (FR)
- Add 301 redirect /integrations → /services/ai-solutions/integrations-apis
- Remove help-search, docs-sidebar, docs-search components
- Clean up help.* keys in dictionaries
- Align footer FR + EN to unified 4-column structure
```

DO NOT push without user approval.
