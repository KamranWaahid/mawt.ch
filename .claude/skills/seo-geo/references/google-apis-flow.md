<!-- markdownlint-disable -->
> Google's free SEO APIs (GSC, PSI, CrUX, Indexing, Keyword Planner) with their exact quotas, credential tiers, and data pitfalls — plus the FLOW evidence-led SEO framework (CC BY 4.0).

## 1. Credential system — 4 tiers

Two credential types serve everything; both are free. Config file: `~/.config/claude-seo/google-api.json` (keys: `service_account_path`, `api_key`, `default_property`, `ga4_property_id`) or env vars `GOOGLE_API_KEY`, `GOOGLE_APPLICATION_CREDENTIALS`, `GA4_PROPERTY_ID`, `GSC_PROPERTY`. Always detect and announce the tier before running commands.

| Tier | Requires | Unlocks |
|------|----------|---------|
| **0** | API key only | PageSpeed Insights, CrUX, CrUX History, Knowledge Graph, Web Risk, YouTube, NLP |
| **1** | + OAuth token or service account | Tier 0 + GSC Search Analytics, URL Inspection, Sitemaps, Indexing API |
| **2** | + `ga4_property_id` configured | Tier 1 + GA4 organic traffic reports |
| **3** | + `ads_developer_token` + `ads_customer_id` | Tier 2 + Keyword Planner (ideas, volume) |

### Setup essentials
- **GCP project** → enable per-API: Google Search Console API, PageSpeed Insights API, Chrome UX Report API, Web Search Indexing API, Google Analytics Data API, Knowledge Graph Search API.
- **API key**: restrict to PSI + CrUX + Knowledge Graph APIs.
- **Service account**: create JSON key; the `client_email` field is what gets added to GSC/GA4.
- **GSC access**: Settings > Users and permissions > Add user with the `client_email`. Permission **Full** = read-only APIs; **Owner** = required for Indexing API.
- **GA4 access**: Admin > Property Access Management > add `client_email` as **Viewer** (minimum). Property ID is numeric, from Admin > Property Details (format `properties/123456789`).
- **OAuth scopes**: `webmasters.readonly` (GSC read), `webmasters` (GSC read/write, needed for sitemap submission), `indexing` (Indexing API), `analytics.readonly` (GA4).
- **Property formats**: `sc-domain:example.com` (domain property, covers all URLs — recommended) vs `https://example.com/` (URL-prefix, trailing slash required). Wrong format = 404.

## 2. GSC Search Analytics

`POST https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query`

| Field | Values / limits |
|-------|-----------------|
| `startDate`/`endDate` | Required, YYYY-MM-DD |
| `dimensions` | `query`, `page`, `country`, `device`, `date`, `searchAppearance` |
| `type` | `web` (default), `image`, `video`, `news`, `discover`, `googleNews` |
| `aggregationType` | `auto` (default), `byPage`, `byProperty`, `byNewsShowcasePanel` |
| `rowLimit` | 1–25,000 (default 1,000); paginate via `startRow` += `rowLimit` until fewer rows return; cap loops at 100,000 rows |
| `dataState` | `final` (default), `all`, `hourly_all` |
| Filter operators | `contains`, `equals`, `notContains`, `notEquals`, `includingRegex`, `excludingRegex` — regex is RE2, max 4,096 chars |

### Pitfall #1 — site totals: NEVER sum per-query rows
GSC **anonymizes low-volume ("rare") queries**: their clicks/impressions are hidden from query-dimension rows. Summing rows undercounts — often producing a false **"0 clicks"** site total (claude-seo issue #130). **Correct method**: run a second query with `"dimensions": []` — it returns one aggregate row carrying the true site totals. Fall back to row-sum only if the aggregate query fails.

### Other GSC facts
- Data lag **2–3 days** (set default `endDate` = today − 3 days); retention ≈ **16 months**.
- `discover` and `googleNews` types support neither the `query` dimension nor the `position` metric.
- Country codes are **ISO 3166-1 alpha-3** (`USA`, `GBR`, `DEU`), not alpha-2.
- `ctr` is returned as a fraction (0.03 = 3%); `position` is an average, round to 1 decimal.
- **Quick-win heuristic**: queries at **position 4–10 with > 50 impressions** (scan top 200 by impressions, report top 20) — small ranking gains yield outsized traffic.
- GSC search-appearance data includes AI Overview references (GEO signal).
- Default useful query: 28 days, `dimensions=["query","page"]`, `type=web`, limit 1,000.
- Errors: 403 = service account email not added to the property; 404 = wrong property URL format.

## 3. URL Inspection API

`POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect` — body: `inspectionUrl`, `siteUrl`, `languageCode`. This is the **indexation truth**: the Sitemaps report shows *submitted* counts only, never whether URLs are actually indexed.

| Field | Values |
|-------|--------|
| `verdict` | `PASS`, `FAIL`, `NEUTRAL`, `PARTIAL`, `VERDICT_UNSPECIFIED` |
| `robotsTxtState` | `ALLOWED`, `DISALLOWED` |
| `indexingState` | `INDEXING_ALLOWED`, `BLOCKED_BY_META_TAG`, `BLOCKED_BY_HTTP_HEADER` |
| `pageFetchState` | `SUCCESSFUL`, `SOFT_404`, `BLOCKED_ROBOTS_TXT`, `NOT_FOUND`, `ACCESS_DENIED`, `SERVER_ERROR`, `REDIRECT_ERROR`, `ACCESS_FORBIDDEN`, `BLOCKED_4XX`, `INTERNAL_CRAWL_ERROR`, `INVALID_URL` |
| Canonicals | `googleCanonical` (Google's pick) vs `userCanonical` (page's claim) — mismatch = canonical issue |
| Other | `lastCrawlTime` (ISO 8601), `crawledAs` (`DESKTOP`/`MOBILE`), `richResultsResult` (verdict + detected types) |

Quota: **2,000/day + 600 QPM per site** (10M QPD / 15,000 QPM per project) — batch inspections must budget against the 2,000/day site cap.

### Sitemaps & Sites APIs (v3, same base URL)
- Sitemaps: GET list / GET one / PUT submit / DELETE. Resource fields: `isPending`, `isSitemapsIndex`, `type` (`sitemap`, `atomFeed`, `rssFeed`, `urlList`, `notSitemap`), `warnings`/`errors` counts, `contents[]` with per-type (`web`, `image`, `video`, `news`) `submitted` counts.
- Sites: list/get/add/delete properties; `permissionLevel` ∈ `siteOwner`, `siteFullUser`, `siteRestrictedUser`, `siteUnverifiedUser`.

## 4. PageSpeed Insights v5 + CrUX + CrUX History

### CWV thresholds (p75 of field data)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** | ≤ 2,500 ms | 2,500–4,000 ms | > 4,000 ms |
| **INP** | ≤ 200 ms | 200–500 ms | > 500 ms |
| **CLS** | ≤ 0.1 | 0.1–0.25 | > 0.25 |
| **FCP** | ≤ 1,800 ms | 1,800–3,000 ms | > 3,000 ms |
| **TTFB** | ≤ 800 ms | 800–1,800 ms | > 1,800 ms |

- **INP replaced FID on 2024-03-12**; FID was fully removed from Chrome tools (CrUX, PSI, Lighthouse) on **2024-09-09**. Never reference FID.
- Field metric keys in PSI `loadingExperience`: `LARGEST_CONTENTFUL_PAINT_MS`, `INTERACTION_TO_NEXT_PAINT`, `CUMULATIVE_LAYOUT_SHIFT_SCORE`, `FIRST_CONTENTFUL_PAINT_MS`, `EXPERIMENTAL_TIME_TO_FIRST_BYTE`; each carries `percentile` (p75), `distributions[]`, `category` (FAST/AVERAGE/SLOW/NONE).

### PSI v5
`GET .../pagespeedonline/v5/runPagespeed` — params `url`, `category` (PERFORMANCE, ACCESSIBILITY, BEST_PRACTICES, SEO — multiple allowed), `strategy` (`MOBILE` default / `DESKTOP`), `locale`, `key`. Lighthouse category scores are 0–1 floats. Key audit IDs: `first-contentful-paint`, `largest-contentful-paint`, `total-blocking-time`, `cumulative-layout-shift`, `speed-index`, `interactive`. **Google is migrating CrUX field data out of PSI** — use PSI for Lighthouse lab data, CrUX API directly for field data. CrUX lookup tries URL-level first, falls back to origin-level.

### CrUX API (daily)
`POST https://chromeuxreport.googleapis.com/v1/records:queryRecord` — **API key goes in the `X-Goog-Api-Key` header, not the URL**. Body: `origin` XOR `url`, optional `formFactor` (`DESKTOP`/`PHONE`/`TABLET`; omit = all), optional `metrics` list.

| Quirk | Rule |
|-------|------|
| CLS encoding | p75 is a **string** (`"0.05"`) — always parse as float from string; LCP/INP/FCP/TTFB are ints (ms) |
| Histogram | last bin has **no `end`** (infinity); densities sum ≈ 1.0 |
| 404 | = insufficient Chrome traffic, **not an auth error** — fall back to PSI lab data |
| Freshness | updated daily ~04:00 UTC with ~2-day lag; data window = trailing 28 days |
| `round_trip_time` | replaced `effectiveConnectionType` in **Feb 2025** |
| Extra metrics | `navigation_types` and `form_factors` return fraction distributions |

### CrUX History API (weekly trends)
`POST .../v1/records:queryHistoryRecord` (same key-in-header rule). Returns up to **25 weekly collection periods**: `histogramTimeseries` (per-bin `densities[]`) + `percentilesTimeseries.p75s[]`. Each period = **28-day rolling average ending on a Sunday**; updated **Mondays ~04:00 UTC**. Ineligible periods contain `"NaN"` strings (densities) and `null` (percentiles) — check before any numeric operation. Use for trend verdicts: improving / stable / degrading per metric with % change.

## 5. Indexing API v3

**Officially restricted to pages with JobPosting or BroadcastEvent/VideoObject structured data.** Google may process other types but guarantees nothing — always tell the user. For large-scale indexing, use XML sitemaps + GSC instead.

- Publish: `POST https://indexing.googleapis.com/v3/urlNotifications:publish` with `{url, type}`; `type` ∈ `URL_UPDATED` (added/changed), `URL_DELETED` (only for pages permanently returning 404/410).
- Metadata: `GET /v3/urlNotifications/metadata?url={ENCODED_URL}` → `latestUpdate` + `latestRemove`.
- Batch: `POST https://indexing.googleapis.com/batch`, `multipart/mixed`, max **100 URLs per batch** — each URL still counts individually against the daily quota.
- Auth: scope `https://www.googleapis.com/auth/indexing`; the service account must be **Owner** in GSC for the domain (Full is not enough).
- Quotas: **200 publish/day** per project (resets **midnight Pacific Time**; increase via Google's quota form), 180 read/min, 380 total requests/min.
- Errors: 400 malformed URL; 403 = not Owner in GSC or quota exhausted; 429/5xx = exponential backoff.
- Only submit URLs with real content changes — don't spam updates.

## 6. Keyword Planner (Google Ads API) — Tier 3

Gold-standard volume source — DataForSEO resells this data. Prerequisites are heavier than other Google APIs: Google Ads **Manager account** (free), **developer token** (Basic access approval required), OAuth 2.0 client, and — critically — **exact volumes require an active campaign (~$5–10/day spend); without spend, volumes come as bucketed ranges ("1K–10K") instead of exact numbers like 14,800**. Uses the separate `google-ads` Python library. Config keys: `ads_developer_token`, `ads_customer_id`, `ads_login_customer_id`.

| Method | Returns |
|--------|---------|
| `GenerateKeywordIdeas` | suggestions from seeds: `text`, `avg_monthly_searches`, `competition` (LOW/MEDIUM/HIGH), `competition_index` (0–100), `low/high_top_of_page_bid_micros` (~p20/p80 CPC), `monthly_search_volumes[]` (last 12 months) |
| `GenerateKeywordHistoricalMetrics` | same fields for an exact keyword list |
| `GenerateKeywordForecastMetrics` | predicted clicks, impressions, cost |

Caveats: `competition` measures **advertiser** competition, not organic difficulty. CPC bids proxy commercial value. Location targeting uses IDs (2840 = US, 2826 = UK); language IDs (1000 = English, 1003 = Spanish). Keyword Planning is more strictly rate-limited than other Ads services (exact QPM undocumented) — cache results.

## 7. Consolidated quotas, errors, backoff

| API | Per-minute | Per-day | Auth | Scope |
|-----|-----------|---------|------|-------|
| GSC Search Analytics | 1,200 QPM/user + 1,200 QPM/site | 30M QPD/project (40,000 QPM/project) | Service account | user + site |
| GSC URL Inspection | 600 QPM/site (15,000 QPM/project) | 2,000 QPD/site (10M QPD/project) | Service account | site |
| PSI v5 | 240 QPM | 25,000 QPD | API key | project |
| CrUX + CrUX History | **150 QPM shared between both** | unlimited | API key | project |
| Indexing API | 380 RPM total, 180 read/min | 200 publish/day | Service account (GSC Owner) | project |
| GA4 Data API | 10 concurrent | 25,000 tokens/day + 5,000 tokens/hour per property | Service account | property/project |
| Knowledge Graph | — | 100,000 QPD | API key | project |
| YouTube Data | — | 10,000 units/day (search = 100 units; video details+comments = 2) | API key | project |
| NLP (Natural Language) | — | 5,000 units/month free — **requires billing enabled** | API key | project |
| Web Risk | 6,000 QPM | 100K/month free tier | API key | project |
| Custom Search JSON | — | 10,000 QPD max; 100 free then $5/1K — **closed to new customers (2025)** | API key | project |

- "Per site" = one GSC property; "per project" = shared across all properties in the GCP project.
- GA4 token costs: simple 1-dim/1-metric report ≈ 1–5 tokens; complex multi-dim ≈ 10–100. Set `returnPropertyQuota: true` to monitor.
- **Backoff on 429/5xx**: waits 1 s → 2 s → 4 s → 8 s → 16 s, give up after 5 retries, add 0–500 ms random jitter. If a `Retry-After` header is present on 429, use it (seconds) instead.
- Error map: 400 bad request; 401 refresh credentials; 403 permissions (add service account to GSC/GA4) or quota; 404 = insufficient traffic (CrUX) or invalid property (GSC); 429/500/503 = backoff.
- YouTube relevance: YouTube mentions carry the strongest AI-visibility correlation (**0.737**) — see consolidated-seo-geo E-E-A-T section.

## 8. FLOW framework — evidence-led SEO loop

> Framework and prompts © Daniel Agrici, CC BY 4.0 — github.com/AgriciDaniel/flow. Attribution must be output before any FLOW-derived analysis; never omit or modify it.

FLOW = **Find → Leverage → Optimize → Win**: a search-and-conversion loop treating rankings, AI citations, local visibility, and sales evidence as connected surfaces. Evidence base for why (all retrieved 2026-04-25):
- Ahrefs (Dec 2025 dataset): **58% lower average CTR** for position-one content when an AI Overview is present.
- seoClarity: **25% of top 1,000 ChatGPT-cited URLs have zero Google organic visibility**.
- Pew (2025-07-22): users click links in **8%** of searches with an AI summary vs **15%** without.
- SEJ State of SEO 2026: **77.9%** of SEOs worry about AI reducing website clicks.
- Alphabet 10-K FY2025: **73.2%** of revenue from Google advertising ($294.691B / $402.836B).

### Stage diagnosis rule (which stage is blocking?)
| Symptom | Stage |
|---------|-------|
| Demand/buyer language unclear | **Find** — keyword research, gap analysis, SERP intent mapping |
| Brand not corroborated off-site | **Leverage** — backlinks, distributed evidence, entity consistency |
| Owned asset hard to extract or trust | **Optimize** — extraction-friendly structure, E-E-A-T, schema |
| Traffic exists but business impact weak | **Win** — BOFU pages, conversion measurement |

### Operating workflow (5 steps)
1. Define the business outcome before choosing tactics (a lead-gen page is not judged by impressions).
2. Inventory existing evidence: customer language, query data, reviews, analytics, call notes, sales objections.
3. Diagnose the blocking stage (table above).
4. Rewrite/rebuild only after evidence is organized — strongest assets come from a source table, not blank-page brainstorming.
5. Review against **three readers**: the buyer, the search engine, and the AI agent that will summarize/compare the business.

### Rules & failure modes
- Name the search surface before writing: organic result, AI answer, local pack, community discussion, paid landing page, or sales-assisted page.
- Every numeric claim must trace to a dated source or be removed; contradicted/unverifiable statistics are excluded.
- Measurement = balanced scorecard: visibility (rankings, impressions, local-pack presence, citations, AI mentions) **connected to** business (qualified leads, calls, form completions, opportunities, recurring objections). No measurement event = don't judge performance yet.
- Failure modes: publishing familiar-sounding stats without loading the source; treating AI visibility as a formatting trick while ignoring entity consistency and off-site corroboration; writing around company preferences instead of buyer decision risk; optimizing traffic without a defined next qualified action.

### Prompt library (41 prompts, CC BY 4.0)
Distribution: **find 5, leverage 1, optimize 21, win 3, local 11**. Never dump all 21 optimize prompts — select exactly **2–3** by priority: (1) industry vertical (SaaS → on-page + technical; local → citations + GBP; publisher → E-E-A-T + freshness), (2) prior audit output (crawl issues → technical prompts; E-E-A-T gaps → content prompts), (3) URL signals (product pages → conversion; blog → freshness + authority). State which prompts were chosen and why.

**Pattern A — evidence-led scaffold** (backbone of most FLOW prompts):
```text
Act as a senior SEO strategist using the FLOW model.
Task: create a [stage] deliverable for: [BUSINESS OR ASSET].
Use only the supplied inputs and clearly label any assumption. Do not invent
statistics. Do not reuse private examples. Build the answer around:
1. Searcher or buyer intent.  2. Evidence available now.
3. Gaps that block trust, extraction, or conversion.
4. Recommended changes in priority order.
5. Measurement events and review cadence.
6. Claims that require source verification before publication.
Return a concise working document the team can execute.
```

**Pattern B — Dual-Surface Content Scorecard** (Win stage): score a page for traditional search AND AI-assisted answers on 7 axes — original usefulness/specificity; audience/decision-stage alignment; evidence/firsthand insight; clear answers to buyer questions; conversion support (CTA, proof, objection handling, next step); refresh need; measurement readiness (traffic, engagement, qualified leads, ROI). Return three scores (traditional / AI-discovery / conversion-readiness), gaps, risks, and the highest-impact next three actions — in business-impact language, not traffic-only language.

**Pattern C — BOFU Page Brief Generator** (Win stage): from offer + audience + known objections + customer language (calls, chats, reviews), analyze the visitor's immediate problem, decision factors, hesitation points, customer-language phrases, required proof, and friction-reducing CTA/sections. Return: page goal, intent, buyer questions, objections, recommended H1, section outline, proof points, CTA strategy, FAQ topics, and tracking notes for form/call/chat/qualified-lead measurement. Flag missing inputs.

Universal FLOW prompt hygiene: separate observations / assumptions / recommended actions / claims needing verification; long-context models get the full scaffold, smaller models get narrower inputs one section at a time.

## Sources
- claude-seo: `skills/seo-google/SKILL.md`
- claude-seo: `skills/seo-google/references/search-console-api.md`
- claude-seo: `skills/seo-google/references/pagespeed-crux-api.md`
- claude-seo: `skills/seo-google/references/indexing-api.md`
- claude-seo: `skills/seo-google/references/rate-limits-quotas.md`
- claude-seo: `skills/seo-google/references/auth-setup.md`
- claude-seo: `skills/seo-google/references/keyword-planner-api.md`
- claude-seo: `scripts/gsc_query.py` + `CHANGELOG.md` (aggregate-totals fix, issue #130)
- claude-seo: `skills/seo-flow/SKILL.md`
- claude-seo: `skills/seo-flow/references/flow-framework.md`, `references/bibliography.md`, `references/prompts/` (index + win/find/optimize samples)
- existing consolidated-seo-geo (CWV thresholds, YouTube 0.737 correlation — cross-referenced)

FLOW framework and prompt content: © Daniel Agrici, licensed CC BY 4.0 — github.com/AgriciDaniel/flow.

## Addenda — completeness pass

### pdf/google-seo-reference.md
Google SEO quick reference for subagents: crawl→index→serve model; full spam-policy list (cloaking, doorway, hidden text, keyword stuffing, link spam, scraped/auto-generated content, sneaky redirects, thin affiliate); E-E-A-T definitions + YMYL note; KEY DATED FACT: Dec 2025 — E-E-A-T evaluation extends to ALL competitive queries, not just YMYL; CWV at p75 field data (LCP 2.5s/4s, INP 200/500ms, CLS 0.1/0.25), INP replaced FID 2024-03-12, FID fully removed from Chrome tools 2024-09-09 — never reference FID; mobile-first indexing 100% complete 2024-07-05 (mobile Googlebot only); manual actions vs algorithmic demotions + 5-step recovery; official doc links.

### agents/seo-google.md
Tiered Google-API audit workflow: Tier 0 (API key) = PSI + CrUX homepage + CrUX History origin; Tier 1 (+service account) = GSC top queries/pages 28d, URL Inspection, sitemap status; Tier 2 (+GA4) = organic traffic + top landing pages. Data freshness rules to note in reports: CrUX 28-day rolling, GSC 2-3 day lag, GA4 1 day lag; always label 'Google API (field data)' vs static analysis. Error handling: CrUX 404 = insufficient Chrome traffic → fall back to PSI lab data; GSC 403 → report service-account email to add. INP replaced FID 2024-03-12, never reference FID.

### scripts/gsc_query.py
Quick-win detection algorithm: among top 200 queries by impressions, flag those at position 4-10 with >50 impressions (cap 20) — 'small ranking improvement yields significant traffic gain'. Default GSC window: 28 days ending 3 days ago (accounts for GSC data lag). Default dimensions query+page with auto-pagination.

### scripts/crux_history.py
CWV trend-detection methodology: fetch up to 25 weekly p75 points from CrUX History API; require >=8 valid points else 'insufficient_data'; compare avg of first 4 vs last 4 valid weeks; |change| < 5% = stable, negative = improving, positive = degrading (lower is better for all CWV); also extracts good/needs-improvement/poor histogram density percentages per week.

### scripts/pagespeed_check.py
Adds two thresholds beyond LCP/INP/CLS: FCP good <=1800ms / poor >3000ms; TTFB good <=800ms / poor >1800ms. Failed-audit rule: any Lighthouse audit score <0.9 flagged, sorted worst-first; diagnostics set includes total-byte-weight, mainthread-work-breakdown, bootup-time. Merges PSI lab + CrUX field into one report.

### skills/seo-google/references/dma-consent-mode-v2.md
EU data-quality diagnostics for audits: DMA in force since 2024-03-07 — GSC CTR comparisons across that boundary are not apples-to-apples (attach note, don't lecture on cookie UX); GA4 EU organic counts systematically under-reported when consent-mode v2 denies ad_storage (typical EU default) — counts are conservative, conversion-modelled uplift applies. Check for: gtag('consent','default',...) before any pageview + ads_data_redaction on EU traffic. Google ABANDONED third-party cookie deprecation July 2024 (confirmed Apr 2025 no Chrome prompt) — do NOT recommend 'cookieless attribution' as a priority; recommend consent-mode v2 + server-side tagging instead. Last verified 2026-05-17.

### skills/seo-google/references/nlp-api.md
Google Cloud NLP for objective E-E-A-T/content scoring: analyzeEntities returns per-entity salience 0-1 (topic coverage depth) + Wikipedia URL + Knowledge Graph MID (entity verification); sentiment score -1..+1 with magnitude (mixed content = score ~0 but HIGH magnitude); classifyText maps content to 700+ Google categories (verify topical relevance using Google's own taxonomy); moderateText for quality flags. Free tiers: 5k units/mo entities+sentiment, 30k classification (1 unit = 1000 chars). API key in X-Goog-Api-Key header, not URL.

### skills/seo-google/references/supplementary-apis.md
Three overlooked Google APIs: Knowledge Graph Search API (kgsearch.googleapis.com) to verify brand Knowledge Panel presence / entity disambiguation, 100k reads/day free, API key only; Custom Search JSON API is CLOSED to new customers as of 2025 (existing must migrate by Jan 2027, max 100 results/query) — prefer DataForSEO for SERP data; Web Risk API to check Safe Browsing flags (MALWARE, SOCIAL_ENGINEERING) — a flagged page can explain sudden deindexing; 100k/month free.

### skills/seo-google/references/keyword-planner-api.md
Keyword Planner = gold-standard volume source ('DataForSEO gets its volume data from Google Ads — this cuts out the middleman'). Gotchas: without active ad spend (~$5-10/day) volumes come as bucketed ranges (1K-10K) not exact numbers; competition/competition_index measure ADVERTISER competition, NOT organic ranking difficulty; low/high_top_of_page_bid_micros = ~20th/80th percentile CPC (commercial value proxy); monthly_search_volumes[] gives 12-month seasonality; location IDs (2840=US, 2826=UK), language IDs (1000=EN).

### skills/seo-google/references/youtube-api.md
YouTube mentions have the STRONGEST correlation with AI visibility (0.737 per GEO research) — justifies YouTube presence as a GEO tactic. YouTube Data API v3: 10,000 units/day free; search.list costs 100 units (~100 searches/day), video/channel lookups 1 unit; API-key only, no OAuth, no billing.

### skills/seo-flow/references/prompts/ (40 files) + agents/seo-flow.md
FLOW operational prompt library (© Daniel Agrici, CC BY 4.0, attribution REQUIRED when reproducing — github.com/AgriciDaniel/flow): 40 fill-in prompt templates organized by stage — find (keyword research, audience avatar, content prioritization, topical-relevance planning), leverage (backlink competition), optimize (23 prompts: Core 30 content audit, CTR audit, PAA question rewording, blog outline/writing, schema, technical audit, ChatGPT discovery + qualifying follow-ups, AI-detector test, Reddit), win (BOFU page brief generator, conversion audit, Dual-Surface Content Scorecard = judge page for traditional search + AI discovery + conversion simultaneously), local (GBP categories/description/services, title-tag + meta-description generators, homepage/service-page rewrites). Agent selection rules: max 5 prompts per call; optimize stage = read filenames first, select 2-3 by industry/gap/technical signals from the fetched page; each template separates observations / assumptions / recommended actions / claims needing verification.
