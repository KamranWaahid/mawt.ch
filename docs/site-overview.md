# MAWT website — how it works

**Audience:** Client, editors, and developers  
**Site:** [mawt.ch](https://mawt.ch)  
**Related docs:**
- [Production server setup](./production-server-setup.md) — Hostinger, Upstash, env vars, login
- [Backend audit report](./backend-audit-report.md) — security remediation notes

This document explains what the MAWT site is, how content and pages fit together, and how the main systems behave in production.

---

## 1. What this site is

MAWT is a bilingual (English / French) agency website for a Geneva-based studio focused on AI systems, automation, software, branding, and digital experiences.

It includes:

- A public marketing site (home, services, work, process, news, contact, legal pages)
- An embedded **Sanity Studio** CMS at `/studio`
- A protected **admin** area for light operational views
- Contact and newsletter forms that write into Sanity and send email where configured

---

## 2. High-level architecture

```
Browser
   │
   ▼
Hostinger (Next.js app)
   ├── Public pages (EN / FR)
   ├── /api/admin/login
   ├── /api/revalidate  ◄── Sanity webhook (optional but recommended)
   └── /studio          ◄── Sanity Studio (after login)
          │
          ├── Sanity CMS (content)
          ├── Upstash Redis (rate limits)
          └── SMTP / Resend + newsletter provider (forms)
```

| Layer | Responsibility |
|-------|----------------|
| **Next.js (App Router)** | Pages, SEO, server rendering, API routes, Studio shell |
| **Sanity** | Editable content (projects, services, posts, settings, leads) |
| **Dictionaries** | UI copy in `en.json` / `fr.json` (plus optional Sanity dictionary overrides) |
| **Upstash** | Rate limiting for login and cache revalidation in production |
| **Hostinger** | Hosts the Node/Next.js process and environment variables |

---

## 3. Languages and URLs

The site supports **English** (`en`, default) and **French** (`fr`).

- Visitors can open `/en/...` or `/fr/...`
- French public URLs use localized slugs (e.g. `/fr/a-propos`, `/fr/projets`)
- Internally, Next.js serves shared route folders; `src/proxy.ts` rewrites localized paths
- Canonical slug pairs live in `src/lib/routing/url-map.ts`

### Common public routes

| English | French | Purpose |
|---------|--------|---------|
| `/en` | `/fr` | Homepage |
| `/en/about` | `/fr/a-propos` | About |
| `/en/work` | `/fr/projets` | Case studies index |
| `/en/work/[slug]` | `/fr/projets/[slug]` | Case study detail |
| `/en/our-process` | `/fr/notre-methode` | Method / process |
| `/en/services/...` | `/fr/services/...` | Service families & pages |
| `/en/news` | `/fr/blog` | Insights / blog |
| `/en/partners` | `/fr/clients` | Clients / partners |
| `/en/contact` | `/fr/contact` | Contact |
| `/en/faqs` | `/fr/faqs` | FAQs |
| `/en/geneva` | `/fr/geneve` | Geneva hub |
| `/en/login` | `/fr/login` | Admin access-key login |
| `/studio` | `/studio` | Sanity Studio (not locale-prefixed) |

Service family/child slugs are also localized (for example EN `ai-solutions/smart-crm` ↔ FR `solutions-ia/crm-intelligent`).

**Editing UI strings:** update both `src/dictionaries/en.json` and `src/dictionaries/fr.json`. Do not hardcode marketing copy inside components when a dictionary key exists.

---

## 4. Content model (Sanity)

Editors work in **Studio** at `/studio` after signing in.

Typical document types:

| Type | Used for |
|------|----------|
| `siteSettings` | Navigation, global site settings |
| `project` | Work / case studies |
| `service` | Service pages (families and detail pages) |
| `post` | News / blog articles |
| `aboutContent`, `methodPage`, `securityPage`, `pageContent` | Structured page content |
| `contact`, `partner`, `faq`, `testimonial` | Contact info, logos, FAQs, quotes |
| `author`, `doc`, `dictionary`, `career`, `pricingPlan` | Supporting content |
| `contactLead`, `newsletterSubscriber` | Form submissions (not public marketing pages) |

**Queries** live in `src/lib/sanity.queries.ts`.  
**Schemas** live in `src/sanity/schemaTypes/`.

When content is published, a Sanity webhook can call `/api/revalidate` so the live site refreshes tagged caches without a full redeploy. See [production-server-setup.md](./production-server-setup.md).

---

## 5. Main pages and experience

### Homepage

- Unique cinematic hero (`HomepageHeroSection`): scroll-driven logo / video experience, ASCII layer, then gradient statement transition into the rest of the page
- Sections below typically include logos, selected work, approach / process, services, testimonials, and footer CTAs
- Motion uses **Lenis** (desktop smooth scroll), **Framer Motion** (`motion/react`), and **GSAP** where timelines are needed

### Internal pages

- Share a calmer **subpage hero** pattern (consistent typography and spacing)
- Work, services, news, about, contact, FAQs, legal pages follow the same design system (fluid type, site container, premium editorial tone)

### Page transitions

- Curtain / transition providers give continuity when navigating between routes
- Reduced-motion preferences are respected where implemented

---

## 6. Admin access and Studio

1. Go to `/en/login` (or `/fr/login`)
2. Enter **`ADMIN_SECRET`** (set on the server)
3. On success, a signed JWT cookie is stored (`SESSION_SECRET`)
4. You are redirected to **`/studio`**

Protected paths:

- `/studio` — Sanity Studio
- `/admin` — light admin dashboard (stats / ops views)

Without a valid session, the proxy redirects to the login page.

**Production requirements for login to work:**

- `ADMIN_SECRET`
- `SESSION_SECRET`
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`

Details and troubleshooting: [production-server-setup.md](./production-server-setup.md).

---

## 7. Forms

### Contact

- Multi-step contact experience on the contact page
- Validated on the server (Zod)
- Honeypot field against bots
- Rate limited
- Creates a `contactLead` in Sanity (write token)
- Sends notification / confirmation email when SMTP or Resend is configured

### Newsletter

- Footer (and related) newsletter form
- Honeypot + rate limit
- Requires a configured newsletter provider in production
- Also stores a `newsletterSubscriber` document in Sanity when configured

If production email/newsletter env vars are missing, those flows will fail closed rather than pretending to succeed.

---

## 8. Caching and revalidation

- Pages/data fetches use Next.js cache tags
- Sanity webhook → `POST /api/revalidate` with `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`
- Endpoint maps document `_type` (and slug/language when present) to the right tags
- Fail-closed if the secret is unset; rate-limited via Upstash

Editors normally only need to **publish in Studio**. Developers configure the webhook once on go-live.

---

## 9. Design system notes

- **Styling:** Tailwind CSS v4 + tokens in `src/app/globals.css`
- **Tone:** premium, calm, editorial (Inter for UI; Instrumental Serif as a light accent)
- **Layout:** consistent site container, fluid spacing/typography
- **Motion philosophy:** native scroll stability first; Lenis on desktop; avoid scroll locking / heavy hijacking
- **Copy:** short, human, SEO-aware; keep acronyms (AI, SEO, UX, etc.) as-is; sentence case

Homepage hero and certain approved sections should not be casually redesigned — treat them as locked design unless there is an explicit brief.

---

## 10. SEO and localization

- Per-page metadata from Sanity and/or dictionaries
- Sitemap / robots routes under `src/app`
- Hreflang-aware helpers for EN/FR alternate URLs
- Localized public slugs for major sections
- Structured data helpers under `src/components/seo/`

---

## 11. Security (summary)

| Control | Behavior |
|---------|----------|
| Admin secret | Env-only; constant-time compare |
| Session | JWT cookie, httpOnly, signed with `SESSION_SECRET` |
| Login / revalidate | Rate limited; fail-closed in production without Upstash |
| Secrets | Never use `NEXT_PUBLIC_` for tokens or passwords |
| Forms | Validation, honeypots, rate limits, email redaction in logs |
| Headers | Baseline security headers in `next.config.ts` |

See [backend-audit-report.md](./backend-audit-report.md) for the full checklist (including rotating secrets and Sanity ACL recommendations).

---

## 12. Local development (developers)

```bash
npm install
cp .env.example .env   # or .env.local — fill real values
npm run dev
```

| URL | Purpose |
|-----|---------|
| `http://localhost:3000/en` | Site |
| `http://localhost:3000/en/login` | Admin login |
| `http://localhost:3000/studio` | Studio (after login) |

Useful scripts:

| Script | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Start built app | `npm run start` |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Security unit tests | `npm test` |

**Node:** `>= 20.9.0`

On local development, Upstash is optional for login. In **production** it is required.

---

## 13. Repository map

| Path | What lives there |
|------|------------------|
| `src/app/[lang]/` | Localized pages |
| `src/app/api/` | Login + revalidate APIs |
| `src/app/studio/` | Embedded Studio route |
| `src/components/sections/` | Large page sections |
| `src/components/ui/` | Reusable UI |
| `src/components/providers/` | Lenis, transitions, cursor |
| `src/dictionaries/` | EN/FR UI copy |
| `src/lib/` | Sanity, mail, session, rate limit, actions |
| `src/lib/routing/` | Localized URL map and helpers |
| `src/sanity/` | Schemas, desk structure, Studio widgets |
| `src/proxy.ts` | Locale routing + auth gate |
| `public/` | Static media (videos, logos, assets) |
| `docs/` | This documentation set |
| `tests/` | Automated security helper tests |

---

## 14. Day-to-day for the client

| Task | Where |
|------|--------|
| Edit pages, projects, news, FAQs | `/studio` after login |
| Change nav / site settings | Sanity `siteSettings` (and related docs) |
| Update button labels / UI microcopy | Ask a developer to update `en.json` / `fr.json` (or use Sanity dictionary if configured) |
| Publish content live | Publish in Studio (+ webhook revalidate if configured) |
| Change admin access key | Update `ADMIN_SECRET` on Hostinger → restart app |
| Contact form leads | Sanity `contactLead` documents / notification email |

---

## 15. Go-live essentials (short)

1. Hostinger running the Next.js app  
2. Sanity project connected (IDs + write token)  
3. `ADMIN_SECRET` + `SESSION_SECRET` set  
4. Upstash REST URL + token set  
5. App restarted after env changes  
6. Login → Studio verified  
7. Contact / newsletter tested  
8. Revalidate webhook pointed at `/api/revalidate` (recommended)

Full env checklist: [production-server-setup.md](./production-server-setup.md).

---

## 16. Support contacts (fill in)

| Role | Contact |
|------|---------|
| Development / hosting | _add agency contact_ |
| Content / Studio questions | _add editor owner_ |
| Domain / DNS (Hostinger) | _add ops contact_ |

---

*Last updated: 2026-07-18*
