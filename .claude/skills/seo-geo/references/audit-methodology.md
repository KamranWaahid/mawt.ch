> Deep source of truth for running SEO audits: orchestration pipeline, subagent roster and spawn conditions, industry detection signals, health-score weights, 10-principle synthesis framework, falsifiability format, and content quality gates.

## 1. Full-audit orchestration pipeline

Sequence for a full site audit (`/seo audit` pattern):

1. **Render homepage** — capture raw HTML + rendered HTML + extracted text + SPA status (headless render; compare raw vs rendered to detect JS-blocked content).
2. **Detect business type** from homepage signals (see §2). If ambiguous, present the top 2 detected types with supporting signals and ask the user to confirm before industry-specific recommendations.
3. **Crawl site** — follow internal links, respect robots.txt.
4. **Delegate to specialist subagents in parallel** (if subagents unavailable, run the same analyses inline sequentially) — see roster in §1.2.
5. **Score** — aggregate into SEO Health Score 0-100 (§4).
6. **Persist artifacts** under `{domain}-audit/` (§1.4).
7. **Synthesize** via the 10-principle framework (§5) — walk PERCEIVE → ANALYZE → VALIDATE → ACT **before** bucketing findings into Critical/High/Medium/Low.
8. **Report** — prioritized action plan with dependency sequencing + a falsifiability check per recommendation (§6); offer PDF/HTML report generation.

### 1.1 Crawl configuration

| Parameter | Value |
|---|---|
| Max pages | 500 |
| Respect robots.txt | Yes |
| Follow redirects | Yes, max 3 hops |
| Timeout per page | 30 seconds |
| Concurrent requests | 5 |
| Delay between requests | 1 second |

### 1.2 Subagent roster — always vs conditional (up to 15 specialists: 8 always + 7 conditional)

**Always spawned (8):**

| Agent | Scope |
|---|---|
| seo-technical | robots.txt, sitemaps, canonicals, CWV, security headers, crawlability, indexability |
| seo-content | E-E-A-T, readability, thin content, AI citation readiness |
| seo-schema | Structured-data detection, validation, generation recommendations |
| seo-sitemap | Structure analysis, quality gates, missing pages |
| seo-performance | LCP, INP, CLS measurement (INP always — FID retired, never reference FID) |
| seo-visual | Screenshots, mobile testing, above-fold analysis |
| seo-geo | AI crawler access, llms.txt, citability, brand-mention signals |
| seo-sxo | Page-type mismatch, user stories, persona scoring — search experience applies to ALL sites |

**Conditionally spawned (7):**

| Agent | Spawn condition |
|---|---|
| seo-local | Local Service industry detected (brick-and-mortar, service-area business, or hybrid) |
| seo-maps | Local Service detected AND live-SERP data source (e.g. DataForSEO MCP) available |
| seo-google | Google API credentials detected (GSC, PageSpeed, CrUX, Indexing API, GA4) — CrUX field data replaces lab-only CWV estimates; Performance category score benefits most |
| seo-backlinks | Moz/Bing API keys detected; Common Crawl domain-level metrics can always be included |
| seo-cluster | Content-strategy signals detected: blog, pillar pages, topic clusters |
| seo-drift | A stored drift baseline exists for this URL |
| seo-ecommerce | E-commerce industry detected (product schema, marketplace intelligence) |

Extension enrichment (optional): full-site crawler MCP (use site-map discovery of all URLs **before** analysis), live SERP/keyword/backlink data MCP (real SERP positions, spam scores, Lighthouse on-page, AI-visibility/LLM-mention checks). FLOW framework prompts (CC BY 4.0) can be spawned for content-strategy workflows.

### 1.3 Error handling

| Scenario | Action |
|---|---|
| URL unreachable (DNS fail, connection refused) | Report the error; NEVER guess site content; ask user to verify URL |
| robots.txt blocks crawling | Report which paths are blocked; analyze only accessible pages; note the limitation in the report |
| Rate limiting (429) | Back off, reduce concurrency; report partial results noting incomplete sections |
| Timeout on large sites (500+ pages) | Cap crawl at limit; report findings for crawled pages + estimate total site scope |
| Page behind auth (401/403) | Report; ask user for rendered HTML or a public URL |
| JS-rendered content (empty HTML body) | Analyze available HTML, flag results as incomplete, suggest a browser-rendered snapshot |
| One subagent fails mid-audit | Report partial results from successful subagents; name which failed and why; suggest re-running it individually |
| Ambiguous business type | Present top 2 types + signals; ask user to confirm |
| Unrecognized command | List available commands; suggest closest match |

### 1.4 Output artifacts

- `{domain}-audit/FULL-AUDIT-REPORT.md` — comprehensive findings
- `{domain}-audit/ACTION-PLAN.md` — Critical > High > Medium > Low
- `{domain}-audit/audit-data.json` — structured envelope for report generation
- `{domain}-audit/findings/*.md` — per-category specialist findings (technical.md, content.md, schema.md, performance.md, visual.md, …)
- `{domain}-audit/screenshots/` — desktop + mobile captures (if Playwright available)

`audit-data.json` envelope shape: `summary` (health_score, business_type, top_findings, quick_wins) · `categories[]` (name, score, what_works[], findings[] each with title / severity `Critical|High|Medium|Low|Info` / evidence-backed description / specific recommendation) · `action_plan.phases[]` (4 phases: "Critical Fixes — Week 1", "High-Impact Improvements — Weeks 2-3", "Content & Authority — Month 2", "Monitoring & Iteration — Ongoing") · `artifacts` (findings_dir, screenshots_dir).

Report sections: Executive Summary (health score, business type, top 5 critical issues, top 5 quick wins) → Technical SEO → Content Quality → On-Page SEO → Schema → Performance (LCP/INP/CLS) → Images → AI Search Readiness (citability score, structural improvements, authority signals).

## 2. Industry detection — homepage signals

| Business type | Signals |
|---|---|
| SaaS | pricing page, /features, /integrations, /docs, "free trial", "sign up" |
| Local Service | phone number, address, service area, "serving [city]", Google Maps embed → auto-suggest deeper local-SEO analysis |
| E-commerce | /products, /collections, /cart, "add to cart", product schema |
| Publisher | /blog, /articles, /topics, article schema, author pages, publication dates |
| Agency | /case-studies, /portfolio, /industries, "our work", client logos |

Detection drives: conditional subagent spawns (§1.2), industry-tailored recommendations and plan templates. On ambiguity: top-2 + confirm (never silently pick).

## 3. Single-page deep audit checks

| Check | Threshold / rule |
|---|---|
| Title tag | 50-60 chars optimal (hard floor 30, Google truncates ~60); primary keyword near the beginning; brand at end if included; unique per page |
| Meta description | 150-160 chars optimal (hard floor 120, Google truncates ~155-160); CTA; keyword naturally; unique per page |
| H1 | Exactly one; matches page intent; includes keyword |
| H2-H6 | Logical hierarchy, no skipped levels, descriptive |
| URL | Short, descriptive, hyphenated, no parameters, < 60 chars |
| Keyword density | Natural 1-3% total incl. semantic variations (Factory prior guidance: 0.5-1.5% for the primary exact-match term); keyword in title, H1, first 100 words |
| E-E-A-T signals | Author bio, credentials, first-hand experience markers, publication + last-updated dates |
| Canonical | Present, self-referencing or correct |
| Meta robots | index/follow unless intentionally blocked |
| Social meta | og:title, og:description, og:image, og:url + twitter:card, twitter:title, twitter:description |
| Image file size | Flag > 200 KB (Warning), > 500 KB (Critical); recommend WebP/AVIF over JPEG/PNG; width/height set (CLS prevention) |
| Image alt text | 10-125 chars, describes content (not "image"/filename), keywords only where natural; decorative → `alt=""` or `role="presentation"` |
| Lazy loading | Report method per image: native \| perfmatters \| ewww \| js-generic \| none. Do NOT flag "not lazy-loaded" when a JS lazy-loader (Perfmatters, EWWW, lazysizes) is detected — they intentionally strip native `loading="lazy"` and use `data-src` placeholders |
| CWV from HTML | Reference-only flags: potential LCP (huge hero images, render-blocking resources), potential INP (heavy JS, no async/defer), potential CLS (missing image dimensions, injected content) — real values need lab/field measurement |

Page score card output: Overall /100 + per-dimension bars for On-Page SEO, Content Quality, Technical, Schema, Images. Issues by priority, recommendations with expected impact, ready-to-paste JSON-LD for detected schema opportunities.

## 4. SEO Health Score (0-100) and prioritization

### Category weights

| Category | Weight |
|---|---|
| Content Quality | 23% |
| Technical SEO | 22% |
| On-Page SEO | 20% |
| Schema / Structured Data | 10% |
| Performance (CWV) | 10% |
| AI Search Readiness | 10% |
| Images | 5% |

(Separate GEO_Score and Citability formulas live in the GEO reference file.)

### Priority levels — with deadlines

| Priority | Definition | Fix window |
|---|---|---|
| Critical | Blocks indexing or causes penalties | Immediately |
| High | Significantly impacts rankings | Within 1 week |
| Medium | Optimization opportunity | Within 1 month |
| Low | Nice to have | Backlog |
| Info | No action required; context only (e.g. existing FAQPage schema post-retirement) | — |

## 5. Synthesis methodology — 10-principle framework

Findings ≠ recommendations. A recommendation that has not passed all four phases is only a finding. Priority bucketing (Critical/High/Medium/Low) is the **output** of validation, never a substitute for it.

| Phase | Principles |
|---|---|
| PERCEIVE | OBSERVE-external · OBSERVE-internal · LISTEN |
| ANALYZE | THINK · CONNECT-lateral · CONNECT-system |
| VALIDATE | FEEL · ACCEPT |
| ACT | CREATE · GROW |

**Scope rule:** full audits (site + deep-page) walk ALL 10 principles. Narrow single-purpose commands (schema check, image check…) may skip the loop but must still pass at minimum **THINK + ACCEPT** before emitting (sound first principle + surfaced falsifiability).

### PERCEIVE
1. **OBSERVE-external** — collect without interpreting: raw + rendered HTML, actual schema present, SERP visibility, backlink + brand-mention landscape, CrUX field data, AI-citation patterns, competitor pages on primary keywords. Discipline: do not score or classify yet.
2. **OBSERVE-internal** — audit your own assumptions. Named traps: homepage ≠ the site (programmatic/category pages often drive traffic); "low traffic" ≠ "low value" (intent-matched low-volume can outconvert); the brand may not want "best practice" (voice/legal/trade-off constraints); a CMS limitation is often fixable; an old finding may be stale after a Google update. Discipline: for each major recommendation ask "what assumption does this rest on?" — surface surprising assumptions in the report so the user can reject them explicitly.
3. **LISTEN** — the existing copy is data (read before recommending rewrites); the SERP is Google's revealed preference for an intent (read before choosing page type); reviews/Reddit reveal what customers actually ask; prior user conversations may have ruled out approaches. Discipline: if a recommendation contradicts the SERP for the same intent, **the SERP wins** unless you can explain why this site is the exception.

### ANALYZE
4. **THINK** — reduce to first principles: page type (informational / transactional / navigational / local / commercial-investigation) vs current layout; AI-feature eligibility floor (indexed + snippet-eligible — if not indexed, no AI work matters yet); the single highest-leverage constraint (often one technical defect — non-indexable, slow LCP, missing canonical — gating everything); Google primary-source guidance beats community claims when they contradict. Discipline: the highest-leverage constraint goes FIRST in the action plan even if boring.
5. **CONNECT-lateral** — pair findings across specialists. High-value known combos: thin-content × SERP-overlap → consolidate 3 weak pages into one cluster hub; missing Product schema × commerce-protocol not declared → one bundled agent-era fix; low AI-citation rate × brand-mention underweight → mentions matter ~3× more than backlinks for AI citations, reframe link budget into PR/Reddit/YouTube; SPA detected × missing main content → JS-blocking is the upstream cause. Discipline: a single-specialist finding that survives connection unchanged is suspect — likely a symptom, not a cause.
6. **CONNECT-system** — the action plan is a **dependency graph, not a list**: which item unblocks the most others (do first); which items depend on each other (sequence); which are parallelizable (say so, so the user can dispatch); which need an uninstalled tool (flag the gap).

### VALIDATE
7. **FEEL** — pressure-test against: user experience (would it make the page worse for humans? e.g. stuffing FAQ schema when no rich result exists); brand voice (answer-first rewrites can break a luxury brand using suspense); operator capacity (never recommend 30 new location pages to a 2-person team); vertical intuition when data is ambiguous. Discipline: if you can't articulate the human cost of a recommendation, it isn't validated.
8. **ACCEPT** — intellectual humility: define what would prove the hypothesis wrong (measurable check); don't re-recommend what the user already tried and failed; if a constraint is immovable (legal/brand/technical), pivot rather than double down; explicitly retract stale recommendations after Google guidance shifts. Discipline: every recommendation gets a "how would we know this failed?" line — no invisible bets.

### ACT
9. **CREATE** — ship the artifact: prioritized markdown report with dependencies + measurable outcomes, ready-to-paste JSON-LD, content brief (keywords/outline/internal links), the smallest implementation of the highest-leverage item first. Discipline: analysis paralysis is the enemy.
10. **GROW** — the audit is a snapshot: capture a drift baseline so the next audit can prove what changed; define 1-2 leading indicators monitorable without re-auditing (CrUX trend, GSC impressions for a target cluster, brand-mention growth on Reddit/YouTube); set re-audit cadence to site velocity (weekly for high-churn e-commerce, quarterly for B2B SaaS); name what the audit could NOT measure (offline conversion, brand lift) so the human closes those loops. Discipline: the last paragraph of every audit names what the next audit should look for.

**Escalate to the user when:** a recommendation requires an assumption you'd rather not own (frequent with CONNECT-lateral — surface the link, let the user confirm); validation flagged a brand-voice/capacity/hard constraint you see but cannot resolve; no upstream constraint was found and the optimization may be premature.

## 6. Falsifiability format — required per recommendation

Every emitted recommendation carries four fields:

1. **First principle** (THINK) — the observation it rests on.
2. **Dependency** (CONNECT-system) — what it depends on / what it unblocks.
3. **Falsifiability** (ACCEPT) — explicit "how would we know this failed?" with a measurable check.
4. **Leading indicator** (GROW) — a metric the user monitors without re-running the audit.

## 7. Content quality gates

### 7.1 Minimum word counts by page type

| Page type | Min words | Unique content | Notes |
|---|---|---|---|
| Homepage | 500 | 100% | Clear value proposition |
| Service / Feature page | 800 | 100% | Detailed offering explanation |
| Location (primary) | 600 | 60%+ | HQ or main service area |
| Location (secondary) | 500 | 40%+ | Satellite locations |
| Blog post | 1,500 | 100% | In-depth |
| Product page | 400 | 80%+ | Unique descriptions, specs |
| Category page | 400 | 100% | Unique intro, not just listings |
| About page | 400 | 100% | Story, team, values |
| Landing page | 600 | 100% | Focused conversion content |
| FAQ page | 800 | 100% | Comprehensive Q&A |

(Prior Factory shorthand "thin content = < 300 words" is superseded by this per-page-type table.)

### 7.2 Location-page thresholds (doorway-page protection)

- **WARNING at 30+ location pages** — enforce 60%+ unique content per page; each page must have: unique local info (landmarks, neighborhoods), location-specific services, local team/staff info, genuine local testimonials.
- **HARD STOP at 50+ location pages** — require explicit user justification demonstrating: legitimate business presence per location, unique content strategy per page, local signals (GBP, local reviews).
- Doorway-page red flags Google penalizes: only city/state swapped between pages, no unique local information, no local business signals, keyword-stuffed URLs.

### 7.3 Programmatic pages — safe vs risky at scale

| Safe ✅ | Why |
|---|---|
| Integration pages | Real setup docs, unique technical content |
| Template/tool pages | Downloadable assets, unique functionality |
| Glossary pages | 200+ word unique definitions |
| Product pages | Unique specs, images, reviews |
| User profile pages | User-generated unique content |

| Penalty risk ❌ | Why |
|---|---|
| Location pages with only city swapped | Duplicate/doorway |
| "Best [tool] for [industry]" | Thin, no industry-specific value |
| "[Competitor] alternative" | Needs genuine comparison data |
| AI-generated mass content | No unique value, E-E-A-T failure |

### 7.4 Internal linking targets

| Page type | Internal links |
|---|---|
| Blog post (1,500+ words) | 5-10 |
| Service page | 3-5 |
| Category page | Links to ALL child pages |
| Product page | 2-4 |

Anchor rules: descriptive (never "click here"), varied (not always exact-match), relevant targets, zero orphan pages (every page linked from ≥ 1 other page).

### 7.5 Content freshness

| Content type | Update frequency |
|---|---|
| News/current events | Within hours/days |
| Evergreen blog posts | Review annually |
| Product pages | When specs change |
| Service pages | Review quarterly |
| Company info | On change |

Required: visible publication date (articles/blogs), last-updated date if significantly revised, `dateModified` in schema; stats > 2 years old → update; examples > 3 years old → replace.

### 7.6 Hard rules (never violate)

| Rule | Value |
|---|---|
| HowTo schema | NEVER recommend — deprecated by Google Sept 2023 |
| FAQ schema | Google retired FAQ rich results for ALL sites **2026-05-07** (supersedes the Aug 2023 gov/health-only restriction). Flag existing FAQPage at **Info** (not Critical) for its AI/LLM-citation benefit; do NOT recommend removal; do NOT recommend new FAQPage for Google SERP benefit; use QAPage for genuine user Q&A |
| Core Web Vitals metric | Always INP, never FID (FID retired) |
| Location pages | 30+ = WARNING (60%+ unique), 50+ = HARD STOP (user justification) |

## 8. Sources

- claude-seo (AgriciDaniel, MIT, v2.2.0): `skills/seo/SKILL.md`, `skills/seo/references/thinking-framework.md`, `skills/seo/references/quality-gates.md`, `docs/ARCHITECTURE.md`, `skills/seo-audit/SKILL.md`, `skills/seo-page/SKILL.md`
- Existing `consolidated-seo-geo` Factory skill (audit checklist, keyword density, thin-content threshold — merged/reconciled)
- FLOW framework referenced by claude-seo is CC BY 4.0 (content not reproduced here beyond attribution)

## Addenda — completeness pass

### data/google-updates.json
Verified Google algorithm-update timeline (Mar 2024 → May 2026), every entry citing a Google-owned URL; governance policy: third-party-only claims quarantined in unverified[] and 'audit scripts MUST NOT encode unverified claims'. Key facts: Helpful Content System merged into core ranking 2024-03-05; site reputation abuse enforcement 2024-05-05 (Forbes/CNN/WSJ hit) + Nov 2024 clarification ('no amount of first-party involvement changes third-party nature'); QRG Jan 2025 adds generative-AI definition — Lowest rating when all/almost all main content is copied/paraphrased/AI-generated; June 2025 structured-data purge; FAQ rich results retired 2026-05-07 (Rich Results Test support drops Jun 2026, Search Console API Aug 2026); AI Mode timeline: Mar 2025 Labs → May 2025 US GA → Aug 2025 180+ countries → May 2026 Gemini 3.5 Flash default, 1B+ monthly users, agentic checkout summer 2026; core updates: Aug/Nov/Dec 2024, Mar/Jun/Dec 2025, Mar 2026 (12-day rollout), May 2026.

### extensions/bing-webmaster/skills/seo-bing/SKILL.md
Non-Google indexing surface: Google still REJECTS IndexNow (Gary Illyes, 2024-2025) — IndexNow only nudges Bing/Yandex/Seznam/Naver. Microsoft Copilot AI citations are fed by the Bing index → submitting fresh URLs to Bing = Copilot citation eligibility. Bing Webmaster link data surfaces backlinks Google's API doesn't. IndexNow host key: 32+ chars published at declared INDEXNOW_KEY_LOCATION.

### extensions/seranking/skills/seo-seranking/SKILL.md
AI Share-of-Voice metric definition: % of sampled prompts where the brand appears in the response, per platform — chatgpt_sov, gemini_sov, perplexity_sov, ai_overviews_sov, ai_mode_sov (US English first). SE Ranking is the only single API covering all 5 AI platforms (v2 gap analysis: highest-impact extension). Report each SoV as percentage with confidence note based on sample size. ~5 units per AI-visibility query (1/platform).

### extensions/profound/skills/seo-profound/SKILL.md
LLM brand-citation tracking pattern: Profound continuously polls so time-series trends (WoW/MoM deltas) are first-class vs SE Ranking's on-demand sampling; covers ChatGPT + Perplexity natively (defer Gemini/AI Overviews/AI Mode to SE Ranking); spike/drop alerts vs 7-day baseline; label every metric with source + confidence ('Profound (live, confidence 0.90)').

### extensions/ahrefs/skills/seo-ahrefs/SKILL.md
Multi-source data-conflict rules: when Ahrefs and Moz disagree on the same metric, trust Ahrefs and note the discrepancy; cite source + confidence on every metric ('Ahrefs (live, confidence 1.00)'); toxic-link assessment combines Ahrefs Spam Score with Common Crawl + live verify-crawler signals; cost guardrail — any batch >=50 URLs requires cost estimate surfaced to orchestrator BEFORE running, log actual cost after.

### extensions/firecrawl/skills/seo-firecrawl/SKILL.md
Site-crawl orchestration methodology: (1) firecrawl_map for all URLs (0.5 credits/URL, fast) → (2) filter to top ~50 important pages → (3) crawl with content → (4) feed to technical/content/schema/geo subagents. Decision table scrape vs raw fetch: static HTML or need headers = fetch_page.py (free); JS-rendered SPA, anti-bot, or clean markdown = Firecrawl. Audit patterns: sitemap coverage % (crawled pages in sitemap), orphan pages (crawled but not in sitemap / in sitemap returning 404), redirect chains flagged >2 hops, thin content <300 words at scale, parameter bloat via URL-pattern breakdown. Free tier 500 credits/mo, 1 credit = 1 page; always estimate credits before large crawls.

### extensions/unlighthouse/skills/seo-unlighthouse/SKILL.md
Free site-wide Lighthouse alternative when PSI's 25k queries/day quota can't cover every URL: Unlighthouse (MIT) crawls up to 200 routes (configurable), outputs median performance/accessibility/best-practices/seo scores across routes + per-route ci-result.json; use for post-deploy site-wide CWV regression checks and offline/CI environments; single-URL field data still via CrUX.
