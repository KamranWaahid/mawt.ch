# MAWT Back-End Audit Report

**Date:** 2026-07-18  
**Scope:** API routes, Server Actions, Sanity clients/queries, auth, rate limiting, forms, mail, webhooks, env, headers  
**Status:** Critical/High code fixes implemented in this pass

---

## Summary

| Severity | Found | Fixed in code | Manual follow-up |
|----------|-------|---------------|------------------|
| Critical | 3 | 3 | Rotate secrets; Sanity ACL |
| High | 6 | 6 | Upstash in production |
| Medium | 6 | 5 | Full CSP later |
| Informational | 3 | Documented | — |

---

## Issues

### C1 — Revalidate auth bypass when secret unset
| Field | Detail |
|-------|--------|
| Area | Webhook / ISR |
| File | `src/app/api/revalidate/route.ts` |
| Severity | Critical |
| Problem | `undefined !== undefined` allowed unauthenticated revalidation |
| Cause | Missing fail-closed check on `SANITY_REVALIDATE_SECRET` |
| Security impact | Cache purge / DoS via ISR thrash |
| Fix | `verifyRevalidateToken` fails closed; Bearer preferred; timing-safe compare |
| Status | **Fixed** |

### C2 — Revalidate secret exposed as `NEXT_PUBLIC_*`
| Field | Detail |
|-------|--------|
| Area | Studio dashboard |
| File | `src/sanity/components/DashboardView.tsx` |
| Severity | Critical |
| Problem | Client bundle could contain revalidate secret |
| Fix | Server Action `triggerHomeRevalidate` (admin JWT only) |
| Status | **Fixed** — **rotate `SANITY_REVALIDATE_SECRET` if it was ever public** |

### C3 — Lead/subscriber PII via public Sanity client
| Field | Detail |
|-------|--------|
| Area | Admin stats |
| File | `src/app/[lang]/admin/page.tsx` |
| Severity | Critical |
| Problem | Counts fetched with CDN/public client |
| Fix | `getSanityPrivateReadClient()` with server-only token |
| Status | **Fixed in code** — **also lock Sanity ACL on `contactLead` / `newsletterSubscriber`** |

### H1 — Admin login without rate limit
| Area | Auth | File | `src/app/api/admin/login/route.ts` |
| Severity | High |
| Fix | `rateLimit("admin-login", 5, 15*60, { failClosed: true })` + digest `secureEqual` |
| Status | **Fixed** |

### H2 — Rate limiter fail-open / wrong revalidate window
| Area | Rate limiting | Files | `src/lib/rate-limit.ts`, `src/app/api/revalidate/route.ts` |
| Severity | High |
| Problem | `60 * 1000` treated as seconds (~16h lockout); Redis errors always allowed |
| Fix | Window `60`; `failClosed` for login/revalidate |
| Status | **Fixed** |

### H3 — Studio path `/login` substring bypass
| Area | Middleware | File | `src/proxy.ts` |
| Severity | High |
| Fix | Unauthenticated `/studio` and `/admin` always redirect; Studio layout re-checks JWT |
| Status | **Fixed** |

### H4 — GROQ null refs / `getServiceBySlug` empty object
| Area | Sanity | File | `src/lib/sanity.queries.ts` |
| Severity | High |
| Fix | `(featuredProjects[]->)[defined(_id) && !(hidden == true)]`; return `null` not `{}` |
| Status | **Fixed** |

### H5 — Project slug ignoring language
| Area | Sanity | File | `src/lib/sanity.queries.ts`, work detail page |
| Severity | High |
| Fix | `language == $lang` + pass `lang` from page |
| Status | **Fixed** |

### H6 — Newsletter mock success / no honeypot
| Area | Forms | Files | `src/lib/marketing.ts`, `src/lib/actions.ts`, newsletter form |
| Severity | High |
| Fix | Prod fails if provider unset; honeypot; redact logs |
| Status | **Fixed** |

### M1 — Incomplete webhook tag map
| Status | **Fixed** — posts, partners, pageContent, about, method, security, service |

### M2 — Untagged fetches
| Status | **Fixed** for posts, careers, related projects/docs, serviceBySlug |

### M3 — Email header injection
| Status | **Fixed** — `sanitizeHeaderValue` on notification subject |

### M4 — `.env.example` not tracked / incomplete
| Status | **Fixed** — `!.env.example` + full variable list (names only) |

### M5 — Weak security headers
| Status | **Partial** — added Permissions-Policy + DNS prefetch; full CSP deferred (Studio) |

### M6 — Layout over-fetch
| Status | **Deferred** — document only; split settings/home queries later |

---

## Manual checklist (Vercel / Sanity console)

1. **Rotate** `SANITY_REVALIDATE_SECRET` if `NEXT_PUBLIC_SANITY_REVALIDATE_SECRET` was ever deployed.
2. Remove any `NEXT_PUBLIC_SANITY_REVALIDATE_SECRET` from Vercel env.
3. Restrict public dataset access for `contactLead` and `newsletterSubscriber` (or use custom roles).
4. Set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in production (required for login/revalidate when `failClosed`).
5. Update Sanity webhook to send `Authorization: Bearer <SANITY_REVALIDATE_SECRET>` (query `?token=` still accepted temporarily).
6. Confirm webhook body includes `_type`, `slug.current`, and `language` where applicable.
7. Optionally set `SANITY_API_READ_TOKEN` (Viewer) instead of reusing the write token for admin counts.

---

## What was already solid

- JWT admin sessions (`jose`), httpOnly cookie, no hardcoded admin secret
- Contact form Zod + honeypot + rate limit
- Write token isolated in `sanity.write-client.ts`
- Published perspective on public CDN reads
- Baseline `nosniff` / Referrer-Policy / `frame-ancestors`
- No open redirects in `proxy.ts`

---

## Verification performed

- Unit tests: `npm test` — 6/6 passed (`tests/security.test.ts`: `secureEqual`, redact/sanitize)
- Typecheck: `npx tsc --noEmit` — clean
- Production build: `npm run build` — completed (all SSG service pages generated)

---

## Follow-ups (not blocking)

- `@sanity/webhook` HMAC verification
- Slimmer layout queries (nav-only settings)
- Shorter admin session TTL + logout endpoint
- Broader CSP (needs Studio-compatible allowlist)
- Paid error monitoring (Sentry) — not added without approval
