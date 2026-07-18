# MAWT

Premium bilingual (EN/FR) agency website for [MAWT](https://mawt.ch) — AI systems, automation, software, branding, and digital experiences.

Built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, **Sanity**, **GSAP**, **Framer Motion**, and **Lenis**.

---

## Documentation

| Doc | Audience | Contents |
|-----|----------|----------|
| [**Site overview**](./docs/site-overview.md) | Everyone | How the site works, pages, CMS, forms, SEO, day-to-day editing |
| [**Production server setup**](./docs/production-server-setup.md) | Ops / client | Hostinger, Upstash, env vars, admin login, Sanity webhook |
| [**Backend audit report**](./docs/backend-audit-report.md) | Technical | Security findings and remediation checklist |

Start with the site overview if you are new to the project. Use the production setup guide for go-live and Hostinger configuration.

---

## Stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`src/app/globals.css`) |
| CMS | Sanity v5 — Studio at `/studio` |
| i18n | Localized EN/FR routing + dictionaries |
| Motion | Lenis, GSAP (`@gsap/react`), Motion (`motion/react`) |
| Auth | Access-key login → JWT session (`jose`) |
| Rate limits | Upstash Redis (required in production) |

---

## Features

- Bilingual public URLs (e.g. `/en/about` ↔ `/fr/a-propos`)
- Sanity-powered work, services, news, FAQs, partners, and page content
- Cinematic homepage hero with scroll-driven video / logo experience
- Contact + newsletter flows (validation, honeypots, rate limits)
- Protected Studio and admin routes
- Tag-based ISR revalidation via Sanity webhook
- SEO: metadata, sitemap, robots, hreflang-aware helpers

---

## Quick start

**Requirements:** Node.js `>= 20.9.0`

```bash
npm install
cp .env.example .env
# Fill Sanity + admin secrets (see .env.example comments)
npm run dev
```

| URL | Purpose |
|-----|---------|
| [http://localhost:3000/en](http://localhost:3000/en) | Site |
| [http://localhost:3000/en/login](http://localhost:3000/en/login) | Admin login |
| [http://localhost:3000/studio](http://localhost:3000/studio) | Sanity Studio (after login) |

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Security helper unit tests |
| `npm run deploy` | Sanity deploy helper |

---

## Environment variables

Names only are listed in [`.env.example`](./.env.example).

**Minimum for local admin + Studio:**

- Sanity: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`
- Auth: `ADMIN_SECRET`, `SESSION_SECRET`

**Also required in production:**

- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `SANITY_API_WRITE_TOKEN` (forms)
- Email / newsletter vars for live contact & subscribe

Full production checklist: [docs/production-server-setup.md](./docs/production-server-setup.md).

> Never commit real secrets. Never prefix secrets with `NEXT_PUBLIC_`.

---

## Project structure

```
src/
  app/[lang]/          # Localized pages (about, work, services, news, …)
  app/api/              # admin/login, revalidate
  app/studio/           # Embedded Sanity Studio
  components/sections/  # Page sections (hero, work, approach, footer, …)
  components/ui/        # Reusable UI
  components/providers/ # Lenis, page transitions
  dictionaries/         # en.json / fr.json UI copy
  lib/                  # Sanity, mail, session, rate-limit, actions
  lib/routing/          # EN↔FR URL map and helpers
  sanity/               # Schemas, desk structure
  proxy.ts              # Locale routing + auth gate
docs/                   # Client & ops documentation
public/                 # Static media
tests/                  # Unit tests
```

---

## Routing (EN / FR)

Localized public slugs are rewritten to shared filesystem routes via `src/proxy.ts` and `src/lib/routing/url-map.ts`.

Examples:

| English | French |
|---------|--------|
| `/en/work` | `/fr/projets` |
| `/en/about` | `/fr/a-propos` |
| `/en/our-process` | `/fr/notre-methode` |
| `/en/news` | `/fr/blog` |
| `/en/partners` | `/fr/clients` |

When adding or renaming a public page, update the URL map, helpers, navigation, and both dictionaries.

---

## Deployment

Production is configured for **Hostinger** (Node.js) with:

- **Sanity** for content
- **Upstash Redis** for production rate limiting (admin login + revalidate)

After changing environment variables on the host, **redeploy or restart** the app.

Step-by-step ops guide: [docs/production-server-setup.md](./docs/production-server-setup.md).

---

## Contributing notes

- Prefer targeted changes; preserve approved homepage hero and design system rules (`AGENTS.md` / `CLAUDE.md`).
- Keep EN and FR copy in sync via dictionaries.
- Do not weaken auth, rate limiting, or session handling.
- Run `npm run typecheck` and `npm test` before shipping security-sensitive changes.

---

## License

Private — MAWT Solutions AG. All rights reserved.
