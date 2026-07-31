# MAWT — Production server & environment setup

**Audience:** Client / ops team  
**Hosting:** Hostinger (Node.js / Next.js)  
**CMS:** Sanity  
**Date:** 2026-07-18  

This guide explains what runs in production, which services are required, and how to configure environment variables so admin login, Studio, forms, and cache updates work correctly.

---

## How the stack fits together

| Piece | Role |
|-------|------|
| **Hostinger** | Hosts the Next.js website (public pages + API routes) |
| **Sanity** | Content management (projects, pages, news, etc.) and Studio UI |
| **Upstash Redis** | Rate limiting for sensitive actions (admin login, cache revalidation) |

Hostinger and Sanity do **not** replace Upstash. Without Upstash in production, admin login and the revalidate webhook are blocked by design (security).

```
Visitor → Hostinger (website)
                ↓
         Sanity (content)
                ↓
         Upstash (rate limits for login / webhooks)
```

---

## Required services

### 1. Hostinger

- Deploy / restart the Node.js app after **any** environment variable change.
- Environment variables are set in the Hostinger panel for this project (exact UI name may vary: *Environment variables*, *App settings*, etc.).
- Production URL: `https://mawt.ch` (formerly `https://beta.mawt.ch`)

### 2. Sanity

- Project ID and dataset (usually `production`)
- Write token for contact / newsletter form submissions
- Optional read token for admin stats
- Webhook (recommended) to refresh the site when content is published

**Studio URL (after login):** `https://mawt.ch/studio`  
**Login URL:** `https://mawt.ch/en/login` (French: `/fr/login`)

#### CORS origins (required for Studio on mawt.ch)

In [sanity.io/manage](https://www.sanity.io/manage) → project `ewciugup` → **API** → **CORS origins**:

1. Add `https://mawt.ch` with **Allow credentials** enabled.
2. Keep `http://localhost:3000` for local Studio.
3. Remove `https://beta.mawt.ch` if it is still listed (domain retired).

Without `https://mawt.ch` in CORS, login may succeed but Studio will fail to load content.

### 3. Upstash Redis (required in production)

Used only as a small Redis database for rate limiting — not for storing website content.

1. Create a free account at [https://console.upstash.com](https://console.upstash.com)
2. Create a **Redis** database
3. Open the database → copy:
   - **REST URL** → `UPSTASH_REDIS_REST_URL`
   - **REST Token** → `UPSTASH_REDIS_REST_TOKEN`
4. Paste both into Hostinger environment variables
5. Redeploy / restart the app

You do **not** need to add Upstash sample Node.js code (`import { Redis } from '@upstash/redis'`) into the MAWT project. The site already uses the REST URL and token.

---

## Environment variables checklist

Set these on **Hostinger** for Production. Never commit real values to Git. Names only are listed in the repo’s `.env.example`.

### Critical for admin / Studio

| Variable | What it is | How to create |
|----------|------------|----------------|
| `ADMIN_SECRET` | Access key typed on the login page | Choose a long, unique password-like string |
| `SESSION_SECRET` | Signs the admin cookie (JWT) | Run locally: `openssl rand -base64 32` — store the output |
| `UPSTASH_REDIS_REST_URL` | Upstash REST endpoint | From Upstash console |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash REST token | From Upstash console |

If any of these four are missing or wrong in production, login will fail.

### Sanity (content & forms)

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Public project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | e.g. `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | e.g. `2024-01-01` |
| `SANITY_API_WRITE_TOKEN` | Yes | Server-only; used for contact / newsletter saves |
| `SANITY_API_READ_TOKEN` | Recommended | Viewer token for admin stats; falls back to write token |
| `SANITY_REVALIDATE_SECRET` | Recommended | Shared secret for the publish webhook |

**Important:** Never use a `NEXT_PUBLIC_` prefix for secrets (`ADMIN_SECRET`, `SESSION_SECRET`, Sanity tokens, Upstash token, revalidate secret). `NEXT_PUBLIC_` values are exposed to the browser.

### Email & newsletter (for contact / subscribe)

| Variable | Notes |
|----------|--------|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Preferred for contact notifications |
| `CONTACT_NOTIFY_TO`, `CONTACT_NOTIFY_FROM` | Where notifications go / from address |
| `RESEND_API_KEY` | Optional fallback if SMTP is unused |
| `NEWSLETTER_PROVIDER`, `NEWSLETTER_API_KEY` | Required in production for newsletter signup to succeed |

### Optional contact fallbacks

Used only if Sanity has no contact document:

`CONTACT_FALLBACK_HEADLINE`, `CONTACT_FALLBACK_EMAIL`, `CONTACT_FALLBACK_PHONE`, `CONTACT_FALLBACK_CITY`, `CONTACT_FALLBACK_ADDRESS`

---

## Admin login — how it works

1. Open `/en/login` (or `/fr/login`).
2. Enter the value of **`ADMIN_SECRET`** exactly (as set on Hostinger).
3. On success, you are redirected to **`/studio`**.
4. The session cookie is signed with **`SESSION_SECRET`** (you never type this).

### If login says “access key was not recognised”

That message is generic. Check the browser Network tab for `/api/admin/login`:

| HTTP status | Meaning | What to do |
|-------------|---------|------------|
| **401** | Key does not match `ADMIN_SECRET` | Fix the value or what you type; redeploy if you changed env |
| **429** | Rate limiter blocked the request | Wait 15 minutes, or clear the `rl:admin-login:*` keys in Upstash |
| **503** | Upstash missing/down (fail-closed) | Set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` on Hostinger for **mawt.ch**, then restart |
| **500** | Server misconfiguration | Ensure `ADMIN_SECRET` and `SESSION_SECRET` are both set |

Then: fix env → **redeploy/restart** → try again.

After moving from `beta.mawt.ch` → `mawt.ch`, re-check that the **production Hostinger app** for `mawt.ch` has the full env checklist below (Upstash is the most common miss).

---

## Sanity webhook (cache refresh)

So published content appears on the live site without a full redeploy:

1. Generate a strong secret → set as `SANITY_REVALIDATE_SECRET` on Hostinger.
2. In Sanity → API → Webhooks (or equivalent), create a webhook that `POST`s to:

   `https://mawt.ch/api/revalidate`

   If an old webhook still targets `https://beta.mawt.ch/api/revalidate`, update or replace it.

3. Prefer auth header:

   `Authorization: Bearer <same value as SANITY_REVALIDATE_SECRET>`

4. Include document `_type`, `slug.current`, and `language` in the payload when possible.

Without a valid secret, revalidation is refused (fail-closed).

---

## After every env change

1. Save variables on Hostinger.  
2. **Redeploy or restart** the Node app.  
3. Hard-refresh the site and test login / forms.  
4. Do not share secrets in Slack/email if avoidable; use a password manager.

---

## Security recommendations

- Use different `ADMIN_SECRET` / `SESSION_SECRET` in production than on a developer laptop.
- Rotate `SANITY_REVALIDATE_SECRET` if it was ever exposed as a public (`NEXT_PUBLIC_`) variable.
- Restrict Sanity dataset permissions for lead/subscriber document types if possible.
- Keep Upstash on the free tier unless traffic grows — it is only used for rate limits.

---

## Quick go-live checklist

- [ ] Hostinger app deployed and running on `https://mawt.ch`  
- [ ] `ADMIN_SECRET` + `SESSION_SECRET` set on that Hostinger app  
- [ ] Upstash Redis created; REST URL + token set  
- [ ] Sanity public IDs + write token set  
- [ ] Sanity CORS includes `https://mawt.ch` (Allow credentials)  
- [ ] App **restarted** after env changes  
- [ ] Login works at `https://mawt.ch/en/login` → `/studio`  
- [ ] Contact / newsletter tested (email + provider vars)  
- [ ] Sanity revalidate webhook points to `https://mawt.ch/api/revalidate`  

---

## Support notes for developers

- Env template (names only): `.env.example` in the repo  
- Rate limiting implementation: `src/lib/rate-limit.ts`  
- Admin login API: `src/app/api/admin/login/route.ts`  
- Session / JWT: `src/lib/session.ts`  
- Technical security audit notes: `docs/backend-audit-report.md`
