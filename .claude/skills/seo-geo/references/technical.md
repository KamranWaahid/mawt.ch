# Technical SEO — Reference

> Deep source of truth for technical SEO: the 9 audit categories, Core Web Vitals (INP era), LCP subparts diagnosis, Speculation Rules + bfcache, IndexNow, SPA/JS rendering rules, agent-friendly pages, and SSRF-safe URL fetching.

## 1. The 9 Audit Categories

Score each category 0-100 with pass/warn/fail status; overall Technical Score = aggregate /100. Prioritize findings: Critical (fix immediately) → High (1 week) → Medium (1 month) → Low (backlog).

| # | Category | Core checks |
|---|----------|-------------|
| 1 | Crawlability | robots.txt valid + not blocking critical resources; XML sitemap exists + referenced in robots.txt; noindex intentional vs accidental; important pages within **3 clicks** of homepage; crawl budget matters for sites **>10k pages**; JS-dependency of critical content |
| 2 | Indexability | Self-referencing canonicals, no canonical+noindex conflicts; near-duplicates / parameter URLs / www vs non-www; thin content below per-type word minimums; pagination (rel=next/prev or load-more); hreflang for multi-locale; index bloat |
| 3 | Security | HTTPS enforced, valid SSL, zero mixed content; headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy; HSTS preload list for high-security sites |
| 4 | URL Structure | Descriptive hyphenated URLs, no query params for content; logical folder hierarchy; redirects **max 1 hop**, 301 for permanent; flag URLs **>100 chars**; consistent trailing slashes |
| 5 | Mobile | Viewport meta + responsive CSS; touch targets **min 48×48px with 8px spacing**; base font **min 16px**; no horizontal scroll |
| 6 | Core Web Vitals | LCP / INP / CLS — see §3 |
| 7 | Structured Data | JSON-LD preferred over Microdata/RDFa; validate against Google-supported types |
| 8 | JS Rendering | Content in initial HTML vs JS-required; CSR vs SSR; flag SPA frameworks — see §7 |
| 9 | IndexNow | Support for Bing/Yandex/Seznam/Naver instant indexing — see §8 |

**Mobile-first indexing is 100% complete since 2024-07-05**: Google crawls and indexes ALL sites exclusively with the mobile Googlebot UA. The mobile version must contain all critical content, structured data, and meta tags.

**Error-handling conventions**: URL unreachable → report status code, continue nothing; robots.txt missing → note + continue other categories; HTTPS missing → Critical issue; CrUX unavailable (low-traffic site) → fall back to Lighthouse lab data and say so.

## 2. AI Crawler Management (robots.txt)

~3-5% of websites use AI-specific robots.txt rules (2025-2026). Known crawlers:

| Crawler token | Company | Purpose |
|---------------|---------|---------|
| `GPTBot` | OpenAI | Model training |
| `ChatGPT-User` | OpenAI | Real-time browsing (citations) |
| `ClaudeBot` | Anthropic | Model training |
| `PerplexityBot` | Perplexity | Search index + training |
| `Bytespider` | ByteDance | Model training |
| `Google-Extended` | Google | Gemini training — **NOT** Search/AI Overviews (those use `Googlebot`) |
| `CCBot` | Common Crawl | Open dataset |

Key distinctions:
- Blocking `Google-Extended` does NOT affect Google Search indexing or AI Overviews.
- Blocking `GPTBot` does NOT stop ChatGPT citing you via `ChatGPT-User` browsing.
- Factory tier rule (GEO): Tier 1 (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot = 50% of AI_Visibility score) — **never block**. Tier 2 (Google-Extended, GoogleOther, Applebot-Extended, Amazonbot, FacebookBot = 25%) — case by case. Tier 3 (CCBot, anthropic-ai, Bytespider, cohere-ai = 15%) — optional. `AI_Visibility = Tier1×0.50 + Tier2×0.25 + NoBlanketBlocks×0.15 + AI_Files×0.10`.
- Weigh AI-visibility strategy before blocking: citations drive brand awareness + referral traffic.

## 3. Core Web Vitals (thresholds current as of Feb 2026)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤2.5s | 2.5–4.0s | >4.0s |
| INP (Interaction to Next Paint) | ≤200ms | 200–500ms | >500ms |
| CLS (Cumulative Layout Shift) | ≤0.1 | 0.1–0.25 | >0.25 |

Hard facts:
- **INP replaced FID on 2024-03-12. FID fully removed from all Chrome tools (CrUX API, PSI, Lighthouse) on 2024-09-09.** INP is the sole interactivity metric — never reference FID in any output.
- Evaluation = **75th percentile** of real-user (CrUX field) data; assessed at **page level AND origin level**. 75% of visits must meet "good" to pass.
- CWV is a **tiebreaker** ranking signal — matters most when content quality is comparable.
- **Thresholds unchanged since original definitions** — ignore SEO-blog claims of "tightened thresholds".
- December 2025 core update appeared to weight **mobile CWV more heavily**.
- Pass rates, Oct 2025: **57.1% desktop / 49.7% mobile** pass all three. Per the claude-seo v2 gap analysis (2025, mobile): **77% pass INP, 62% pass LCP, 48% pass all three** → **LCP is the binding constraint**.
- Field data (CrUX, PSI, Search Console CWV report — 28-day Chrome average) is what Google uses for ranking; lab data (Lighthouse, WebPageTest, DevTools) is for debugging only. When CrUX returns 404 (insufficient traffic), fall back to lab data explicitly.
- Optimization priority: 1. LCP (most impact on perceived performance), 2. CLS (most common issue), 3. INP (matters most for interactive apps).

### Common bottlenecks per metric
- **LCP**: unoptimized hero images (compress, WebP/AVIF, preload), render-blocking CSS/JS (defer/async/critical-CSS inline), TTFB >200ms server response (edge CDN, caching), third-party blocking scripts, web-font delay (`font-display: swap` + preload).
- **INP**: long main-thread JS tasks (break into **<50ms** chunks), heavy event handlers (debounce, requestAnimationFrame), DOM size **>1,500 elements** is concerning, third-party main-thread hijack, synchronous XHR/localStorage, layout thrashing (forced reflows).
- **CLS**: images/iframes without width/height, content injected above existing content, font FOIT/FOUT, ads/embeds without reserved space, late-loading elements.

## 4. LCP Subparts (CrUX, added Feb 2025)

`Total LCP = TTFB + Resource Load Delay + Resource Load Time + Element Render Delay`

| Subpart | CrUX metric name | Measures | Target |
|---------|------------------|----------|--------|
| TTFB | `largest_contentful_paint_image_time_to_first_byte` | Server response | **<800ms** |
| Resource Load Delay | `..._resource_load_delay` | TTFB → LCP resource request start | Minimize |
| Resource Load Time | `..._resource_load_duration` | Downloading the LCP resource | Depends on size |
| Element Render Delay | `..._element_render_delay` | Resource loaded → rendered | Minimize |

**Dominance heuristic**: a subpart is "dominant" (worth remediation effort) when it contributes **≥40% of overall p75 LCP**. Query via CrUX API (`https://chromeuxreport.googleapis.com/v1/records:queryRecord`, formFactor PHONE default). Remediation per dominant subpart:

| Dominant subpart | Fix |
|------------------|-----|
| TTFB | Origin response time, server-side compute, CDN edge cache hit rate; aim TTFB <0.8s |
| Resource load delay | LCP element discovered late → preload hero with `fetchpriority="high"`, move ahead of blocking resources |
| Resource load duration | LCP image too large → `srcset` responsive sizes, AVIF/WebP, async decoding hints |
| Element render delay | Painting blocked → reduce render-blocking CSS/JS above the fold, avoid font-blocking layout shifts |

## 5. Speculation Rules, bfcache, Preload (score /100, 4×25 pts)

The fastest large LCP win without a content rewrite: make next-navigation paint effectively instant via bfcache + Speculation Rules. Static audit signals (score 25 pts each):

| Signal (+25) | Detail |
|--------------|--------|
| Speculation Rules present | `<script type="speculationrules">` inline blocks (**Chrome 121+**) or `Speculation-Rules` HTTP response header (**Chrome 122+**); actions = `prefetch` and/or `prerender` on top user-paths |
| LCP resource hinted | `<img>`/`<video>`/`<source>` with `fetchpriority="high"` on the hero (preloads ahead of other resources) |
| No bfcache killers | No `Cache-Control: no-store` (or scope it to authenticated routes only) AND no `unload` listener (switch to `pagehide` / `visibilitychange`); flag `beforeunload` too |
| No deprecated prerender | Zero `<link rel="prerender">` — **sunset in Chrome 120**; migrate to Speculation Rules |

Also count `<link rel="preload">` hints (legacy but still useful for LCP). Passing bar in the claude-seo audit script: **score ≥75/100**. Full bfcache eligibility needs a headless run with the `NotRestoredReasons` API — static signals above catch the high-value fixes.

## 6. Measurement Tooling (2025-2026)

- **Lighthouse 13.0** (Oct 2025): major audit restructuring, reorganized performance categories, updated scoring weights. Lab tool — always cross-check with CrUX field data.
- **CrUX Vis** (cruxvis.withgoogle.com) replaced the CrUX Looker Studio Dashboard (**deprecated Nov 2025**); or use the CrUX API directly.
- **Search Console Dec 2025 features**: AI-powered configuration, branded vs non-branded query filter, hourly data in API, custom chart annotations, social channels tracking.
- PSI API: `GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=URL` with `X-Goog-Api-Key` header (header-based key handling, never key-in-URL).

## 7. JavaScript / SPA Rendering

**SSR is a binary requirement for AI visibility**: AI crawlers do NOT execute JavaScript — a client-side-only site is invisible to AI platforms. Serve critical SEO elements (canonical, meta robots, structured data, title, meta description) in the initial server-rendered HTML.

Google's JavaScript SEO documentation update (**December 2025**):
1. **Canonical conflicts**: if raw-HTML canonical differs from a JS-injected one, Google may use EITHER. Keep them identical.
2. **noindex + JS**: if raw HTML has `<meta name="robots" content="noindex">` and JS removes it, Google MAY still honor the raw-HTML noindex. Serve correct robots directives in the initial response.
3. **Non-200 status codes**: Google does NOT render JavaScript on non-200 pages — JS-injected content/meta on error pages is invisible to Googlebot.
4. **JS-injected structured data** (esp. e-commerce Product markup) faces delayed processing — put time-sensitive markup in server-rendered HTML.

**Soft Navigations API** (SPA CWV measurement): Chrome **139+ Origin Trial, July 2025**. Detects URL changes without full page load. Experimental — **no ranking impact yet**. When auditing React/Vue/Angular/Svelte SPAs, warn about the current CWV measurement blind spot.

**SPA-aware fetching workflow**: raw-fetch first; only spin up a headless render (Playwright) when an SPA shell is detected (`is_spa` heuristic); extract boilerplate-stripped text (trafilatura) and publication date (htmldate) from the rendered output.

## 8. IndexNow Protocol

Instant-indexing push for **Bing, Yandex, Seznam, Naver** — one POST to the umbrella endpoint `https://api.indexnow.org/indexnow` dispatches to all participating engines. **Google does NOT consume IndexNow as of 2026** (Gary Illyes, multiple Search Off the Record episodes) — it is strictly a non-Google signal.

Spec rules (indexnow.org/documentation):
- Key: **8-128 chars** (generate 32+); publish it as `https://example.com/<key>.txt` whose body is the key itself (one-time host-ownership proof).
- Batch cap: **10,000 URLs per POST**. Payload: `{host, key, keyLocation, urlList}`, `Content-Type: application/json; charset=utf-8`.
- Every submitted URL must belong to the declared host — cross-host submissions rejected.
- Success = HTTP **200 or 202**.
- **Pre-flight the key file before every batch**: fetch keyLocation, require status 200 and body exactly equal to key — a missing/mismatched key file **silently rejects all later submissions**. keyLocation host must match declared host.

## 9. Agent-Friendly Pages (forward-looking, verified 2026-05-18)

The next wave of AI search is **agents acting on the user's behalf** (search, compare, buy, book). Per Google's AI optimization guide + web.dev, agents read sites through 3 channels:
1. **Screenshots + vision model** — visual hierarchy, button prominence (slow, token-expensive)
2. **Raw HTML/DOM** — nesting, IDs, classes, data attributes
3. **Accessibility tree** — roles/names/states; **the cleanest signal and the single highest-leverage optimization target**

### Checklist (7 rules)
1. **Real interactive elements**: `<button>` for actions, `<a href>` for navigation, native `<input>/<select>/<textarea>` — never `<div onclick>` (appears roleless in the a11y tree → agents skip it). If unavoidable: `role="button|link"` + `tabindex="0"` + Enter/Space handlers.
2. **Label associations**: every input needs `<label for>` or `aria-label`/`aria-labelledby` — unlabeled inputs are a void to a11y-tree readers.
3. **Target size**: vision pipelines filter out interactive elements below **~8 square px** unobscured; any clickable element **<24×24px** (WCAG AA min; Apple HIG 44×44) is a candidate for agent invisibility.
4. **No transparent overlays** covering interactive nodes: full-card click handlers, persisting cookie-consent layers, dismissed modals with `pointer-events: auto`, ghost tracking pixels with `position:absolute; inset:0`.
5. **Cross-template layout stability**: keep functionally identical actions (e.g. "Add to cart") in the same screen quadrant across templates — broader than CLS (page-to-page, not just within-page).
6. **`cursor: pointer` correctness**: keep it on interactive elements (agents read it as an actionability hint); never apply it to non-interactive elements.
7. **Stable, meaningful selectors**: semantic landmarks (`<nav> <main> <article> <section> <aside>`), stable ids on layout containers, purpose-describing `data-*`. Auto-generated classes (`__sc_a4b7d9e2`) as sole handle = targetable but meaningless.

### Agent-UX score (0-100, deduction-based)
| Finding | Deduction |
|---------|-----------|
| `<div onclick>` widgets | −5 each, cap −20 |
| Zero semantic landmarks | −10 |
| Inputs without `label[for]` | −4 each, cap −20 |
| Interactive a11y nodes without accessible name | −3 each, cap −20 |
| `role="generic"` >50% of a11y-tree nodes | −10 |

Interactive roles counted: button, link, textbox, checkbox, radio, combobox, menuitem, tab. Capture the tree with Playwright `page.accessibility.snapshot(interesting_only=False)` on a forced render. **Audit posture: report findings as opportunities, not failures** — do not gate audits on a sub-100 score.

**WebMCP**: proposed standard for direct site-to-agent interaction (page-level MCP analog), name-dropped in Google's AI optimization guide. Early preview; **broad adoption not expected before 2027**. Mention as forward-looking signal; never flag its absence as a finding. Re-verify this section when WebMCP goes stable or Google publishes an agent-UX scoring framework.

## 10. SSRF-Safe URL Fetching (concepts)

Any audit tooling that fetches user-supplied URLs must route through a central URL-safety layer — never call HTTP libraries directly on raw input. The claude-seo `url_safety` model:

- **Scheme allowlist**: http/https only. No userinfo (`user@host`), no backslash or percent-encoding in the authority, refuse `#@` fragment/userinfo parser-confusion forms.
- **Hard-blocked hostnames** (pre-DNS): `localhost`, `0.0.0.0`, `127.0.0.1`, `::1`, and every documented cloud metadata endpoint — `169.254.169.254` (AWS/Azure/GCP/Oracle/Alibaba IPv4), `fd00:ec2::254` (AWS IMDS IPv6), `metadata.google.internal`, `metadata.goog`, `metadata.azure.com`, `metadata.ec2.internal`, `metadata.oraclecloud.com`.
- **Hostname normalization** before policy: lowercase; strip trailing FQDN dot (`metadata.google.internal.` must not bypass the blocklist); canonicalize obfuscated IPv4 (decimal `2130706433`, hex `0x7f000001`, octal `0177.0.0.1`, leading zeros, 2/3-part short forms) via inet_aton to dotted-quad so it hits the IP-range check.
- **Safe IP predicate**: reject private, loopback, reserved, link-local, multicast, unspecified — for IPv4 AND IPv6 (incl. IPv4-mapped `::ffff:127.0.0.1`, unique-local `fc00::/7`, link-local `fe80::/10`).
- **Strict mode = resolve then pin**: resolve DNS, require **every** A record public (one public + one private record = refuse — anti-resolver-race), pin the connection to the pre-validated IP for the request duration (Host header + TLS SNI keep the original hostname).
- **Redirect rebinding guard**: while pinned, any OTHER hostname resolved (30x redirect targets, subresources) is also validated — a single non-public record fails the lookup.
- **Browser-based fetches (Playwright/Chromium) cannot be DNS-pinned** at the host-language layer (Chromium resolves internally). Required instead: (1) strict pre-flight validation, (2) a `page.route("**/*")` handler that re-resolves each request hostname (AF_UNSPEC dual-stack — any single non-public record aborts), aborts blocked hostnames pre-DNS, passes non-DNS schemes (data:, blob:), and **fails closed** on any handler exception. Residual rebinding risk must be documented.
- IndexNow submissions also validate every URL through this layer so private-IP links never ship to the API.

## Sources

- claude-seo (AgriciDaniel, MIT): `skills/seo-technical/SKILL.md`, `skills/seo-technical/references/agent-friendly-pages.md`, `skills/seo/references/cwv-thresholds.md`, `agents/seo-technical.md`, `agents/seo-performance.md`, `scripts/lcp_subparts.py`, `scripts/preload_check.py`, `scripts/agent_ux_check.py`, `scripts/indexnow_submit.py`, `scripts/url_safety.py`
- Existing `consolidated-seo-geo` SKILL.md (§4 AI crawler tiers, §7 Technical SEO) — merged


## Addenda — completeness pass

### scripts/analyze_visual.py
Programmatic visual checks (Playwright): desktop 1920x1080 — H1 above fold if bounding-box y<1080; CTA above fold via selector list (a[href*='signup'|'contact'|'demo'], button:has-text('Get Started'/'Sign Up'), .cta, [class*='cta']); hero image via .hero img/[class*='hero'] img/header img/main img:first-of-type. Mobile 375x812 — viewport meta present; horizontal scroll = scrollWidth > innerWidth; readable = computed body font-size >= 16px. SSRF guard blocks private/loopback/reserved IPs.

### agents/seo-visual.md
Visual audit agent spec: 4 test viewports (Desktop 1920x1080, Laptop 1366x768, Tablet 768x1024, Mobile 375x812); above-fold checklist (H1 visible, main CTA visible, hero loads, no layout shift); mobile checklist (hamburger/nav accessible, touch targets >=48x48px, no horizontal scroll, 16px+ base font); persistence contract: output_dir/screenshots/{desktop,mobile}.png + findings/visual.md + JSON findings under Visual category.

### scripts/render_page.py
Shared SPA-aware renderer used by ALL fetching subagents: --mode auto does raw fetch and only launches Playwright Chromium when an SPA shell is detected (--mode always/never to force); returns is_spa flag, extracted_text (boilerplate-stripped via trafilatura), publication_date (via htmldate); every user-supplied URL must route through url_safety.safe_requests_get (SSRF + DNS-rebinding protection) — never requests.get directly. Pattern: compare raw vs rendered HTML to detect JS-dependent SEO elements.
