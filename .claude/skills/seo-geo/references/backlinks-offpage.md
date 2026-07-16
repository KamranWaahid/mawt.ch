# Backlinks & Off-Page SEO

> Deep reference for backlink profile analysis: free data sources with confidence weighting, quality/toxicity scoring, anchor distribution benchmarks, live link verification, and expired-domain heritage checks.

## 1. Data Sources — Comparison & Confidence Weights

| Source | Auth | Any domain? | Quality | Coverage vs commercial | Rate limit | Confidence weight |
|--------|------|-------------|---------|------------------------|------------|-------------------|
| DataForSEO (paid) | API key | Yes | ★★★★★ | ~90%+ | Per plan | **1.00** |
| Verification crawler | None | Yes | ★★★★★ (binary) | N/A (checks known links) | 1 req/s per domain | **0.95** |
| Moz API | Free signup (CC required, not charged) | Yes | ★★★★☆ | ~70% for DA/PA | 1 req / 10 s, 2,500 rows/mo | **0.85** |
| Bing Webmaster | Free (Microsoft account) | Verified sites only | ★★★☆☆ | ~15% (Bing index) | Generous | **0.70** |
| Common Crawl web graph | None (public S3) | Yes | ★★★☆☆ | ~25-40% of domains | N/A | **0.50** |

Composite formula when merging sources:
`weighted_score = Σ(source_score × confidence × factor_weight) / Σ(confidence × factor_weight)`

### Source details

- **Moz API** — endpoint `https://api.moz.com/jsonrpc` (JSON-RPC 2.0). Data: Domain Authority (0-100), Page Authority, Spam Score (1-17% scale, **>11% = high risk**), link counts, referring domains, anchor distribution. Index: 45.5T links. **3-day update lag**. Blind spots: no link velocity, no toxic patterns beyond Spam Score. Signup: moz.com/products/api (verify current free-tier limits — they may change).
- **Bing Webmaster** — endpoint `https://ssl.bing.com/webmaster/api.svc/json/`. Data: inbound links with anchor text, source URL, discovery date. **Unique feature: built-in competitor backlink comparison — the only free tool that offers this.** Blind spots: Bing-indexed pages only (~15% of web), verified sites only, no authority metrics, no spam scoring. Near-realtime freshness.
- **Common Crawl web graph** — `s3://commoncrawl/projects/hyperlinkgraph/`, quarterly releases (e.g. cc-main-2025-18). Data: domain-level in-degree (referring domain count), PageRank, harmonic centrality, top referring domains. Cache locally with **90-day TTL**. Blind spots: no anchor text, no page-level data ("nytimes.com links to example.com" but not which page), quarterly freshness.
- **Verification crawler** — no auth; binary observation (link exists / lost / moved), anchor text, rel attributes. Polite crawling: **1-second delay between requests to the same domain**. Best for confirming known backlinks and monitoring link health.

### Fallback cascade
1. DataForSEO available → primary (1.00)
2. Moz configured → DA/PA/spam/anchors (0.85)
3. Bing configured → links + competitor comparison (0.70)
4. Always: Common Crawl domain-level metrics (0.50)
5. Always: verification crawler for known links (0.95)
6. Nothing → report "no backlink data", instruct setup of free APIs

When DataForSEO and Moz disagree, trust DataForSEO but note the discrepancy.

### Free-data reality check
- Commercial tools index **35-45 trillion links** across 500M+ referring domains.
- Free sources combined capture **20-40% of raw backlink data** but **60-70% of actionable intelligence** (highest-authority links surface in free samples).
- Sites with **<500 backlinks**: free sources capture **50%+** of the meaningful profile.
- **Referring domain count matters more than raw backlink count**; top 50-100 referring domains carry the majority of link authority.

### Five systematic biases in free data
1. **Popularity bias** — popular sites over-crawled, niche sites underrepresented.
2. **Truncation bias** — free tools cap at 100-1,000 links, hiding the long tail.
3. **Own-site restriction** — GSC and Ahrefs Webmaster Tools work only for verified properties.
4. **Missing quality metrics** — raw Common Crawl lacks authority/toxicity scores.
5. **Freshness lag** — free sources update monthly at best vs minutes for commercial.

## 2. Profile Overview — Scoring Thresholds

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Referring domains | >100 | 20-100 | <20 |
| Follow ratio | >60% | 40-60% | <40% |
| Domain diversity | No single domain >5% of links | 1 domain >10% | 1 domain >25% |
| Trend | Growing or stable | Slow decline | Rapid decline (>20%/quarter) |

Small/new domains may legitimately have <10 backlinks — note it, don't auto-fail.

## 3. Anchor Text Distribution

### General benchmarks

| Anchor type | Target range | Over-optimization signal |
|-------------|--------------|--------------------------|
| Branded (company/domain name) | 30-50% | <15% (under-branded) |
| URL / naked link | 15-25% | N/A |
| Generic ("click here", "learn more") | 10-20% | N/A |
| Exact-match keyword | 3-10% | **>15% = Google Penguin risk — flag immediately** |
| Partial-match keyword | 5-15% | >25% |
| Long-tail / natural | 5-15% | N/A |

### Industry benchmarks

| Industry | Branded | URL | Generic | Exact match | Partial match |
|----------|---------|-----|---------|-------------|---------------|
| SaaS | 40-55% | 15-20% | 10-15% | 3-8% | 10-15% |
| E-commerce | 35-45% | 15-25% | 10-15% | 5-10% | 10-20% |
| Local service | 45-60% | 10-15% | 15-20% | 5-10% | 5-10% |
| Publisher/Blog | 30-40% | 20-30% | 10-15% | 3-8% | 10-20% |
| Agency | 40-50% | 15-20% | 10-15% | 5-10% | 10-15% |

## 4. Referring Domain Quality

- **TLD distribution**: .edu / .gov / .org = high authority; excessive .xyz / .info = low quality.
- **Country distribution**: must match target market; **80%+ links from irrelevant countries = PBN signal**.
- **Domain rank distribution**: healthy profiles have links from all authority tiers, not one band.
- **Follow/nofollow per domain**: domains that only nofollow = limited SEO value.

## 5. Toxic Link Detection — 30 Patterns

Moz Spam Score >11% (on 1-17% scale) = high risk trigger for deeper review.

### Definite spam (auto-flag)
1. Domain with 10,000+ outbound links per page (link farm)
2. Domain with no pages indexed in Google
3. Domain registered <30 days ago with 100+ outbound links
4. Exact-match anchor from 5+ unrelated domains
5. Doorway pages (thin, keyword-stuffed)
6. Hacked sites (pharma/casino injections)
7. Known link networks / PBN lists
8. Footer/sidebar site-wide links from unrelated domains
9. Auto-generated content (spun articles)
10. Domains with manual Google penalties

### Likely spam (manual review)
11. Domains with >90% outbound-link ratio
12. Foreign-language domain linking to other-language content (either direction)
13. Expired/auctioned domains repurposed for link building
14. Pages with >50 outbound links
15. Sites with no real traffic (parked domains)
16. Reciprocal link patterns across 10+ domains
17. Web 2.0 properties with thin content
18. Article directories (EzineArticles, ArticleBase)
19. Low-quality guest-post networks
20. Unrelated niches (e.g. pet site linking to SaaS)

### Potentially problematic (monitor)
21. Social bookmarking sites at scale
22. Forum profiles (not discussions)
23. Press-release syndication networks
24. Coupon/deal aggregators
25. Generic directories (not industry-specific)
26. Hidden/invisible anchor text
27. Pages with cloaked content
28. Thin affiliate content
29. Comment-section links without editorial context
30. Nofollow-only domains (limited SEO value)

Additional high-risk signals from profile shape: unnatural anchors (100% exact match from a domain), mass directory submissions (**50+ directory links**), paid-link patterns (footer/sidebar link on every page of a domain). Medium-risk: links from thin pages (**<100 words**), **>50 backlinks from a single domain**, reciprocal patterns (A links B AND B links A — check outbound links against verified inbound sources).

## 6. Link Velocity Red Flags

| Pattern | Signal | Action |
|---------|--------|--------|
| 10x normal new links in 1 week | Possible negative SEO | Investigate source, prepare disavow |
| 50%+ links lost in 1 month | Penalty or site issues | Check GSC for manual actions |
| Zero new links for 3+ months | Content not attracting links | Review content strategy |
| All new links from same TLD | Coordinated link building | Diversify sources |
| Spike from a single country | Link-network activity | Review geographic sources |

Free sources cannot track new/lost links over time — velocity requires a commercial index (DataForSEO); free sources give point-in-time snapshots only. The verification crawler can re-check *known* links for current status.

## 7. Disavow Criteria

**Disavow when:**
- Manual penalty received from Google
- Clear evidence of a negative SEO attack
- Toxic link ratio **>10%** of total profile
- Specific domains identified as PBN or link farms

**Do NOT disavow when:**
- Low-quality links Google likely ignores anyway
- Nofollow links (already devalued)
- Legitimate but low-authority sites
- Small spam volume (**<2%** of profile)

**Disavow file format** (domain-level lines, dated header comment):
```
# Toxic domains identified by backlink analysis
# Date: YYYY-MM-DD
# Total domains disavowed: X
domain:spamsite1.com
domain:linkfarm2.net
```

## 8. Backlink Health Score (0-100)

| Factor | Weight | Sources (preference order → confidence) |
|--------|--------|------------------------------------------|
| Referring domain count | 20% | DataForSEO 1.0 > Moz 0.85 > CC in-degree 0.50 |
| Domain quality distribution | 20% | DataForSEO 1.0 > Moz DA distribution 0.85 |
| Anchor text naturalness | 15% | DataForSEO 1.0 > Moz 0.85 > Bing 0.70 |
| Toxic link ratio | 20% | DataForSEO 1.0 > Moz Spam Score 0.85 > verify crawler |
| Link velocity trend | 10% | DataForSEO only 1.0 |
| Follow/nofollow ratio | 5% | DataForSEO 1.0 > Bing details 0.70 |
| Geographic relevance | 10% | DataForSEO 1.0 > Bing country 0.70 |

Rules:
- Missing factor → redistribute its weight proportionally across the factors that have data; always list scored vs skipped factors.
- **Data sufficiency gate: 4+ of 7 factors with data → numeric score. Fewer than 4 → report `INSUFFICIENT DATA (X/7 factors scored)`, never a numeric score** (a low-data numeric score misleadingly implies poor health). Show available per-factor scores with source + confidence.
- **Common Crawl only → cap maximum score at 70/100** and note "limited to domain-level metrics".
- Every metric in the report carries a source label + confidence, e.g. "Moz (0.85)", "CC (0.50)", "Verify (0.95)", plus freshness (Moz ~3 days, Bing near-realtime, CC quarterly).

Tiers: Tier 0 = CC + verify (always available, always INSUFFICIENT DATA for the numeric score); Tier 1 = +Moz; Tier 2 = +Bing; Tier 3 = +DataForSEO.

## 9. Backlink Verification Workflow

Verifies whether known backlinks still exist by fetching each source page and looking for the target in its outbound links.

**Pipeline per link:**
1. SSRF-validate the source URL (block private/internal targets; never fetch user-supplied URLs without safety checks).
2. Polite delay: **1.0 s between requests to the same domain**.
3. **HTTP HEAD** first (timeout ≤15 s, UA identifies the verifier): 404 → `lost`; 3xx → `moved` (record redirect URL); error/timeout → `error`.
4. If page exists and full check requested: **GET + HTML parse** (default timeout 30 s).
5. URL normalization for matching: lowercase, strip trailing slash, strip fragment. Match tiers: `exact_url` > `domain_match` (www-stripped) > `subdomain_match` (`*.target-domain`).
6. On match → `verified`; capture anchor text (truncate 200 chars) and rel attributes. **No rel attribute = dofollow** (record as `follow`).

**JS false-negative guard (critical):** if the target is NOT found, check whether the page is JS-rendered before declaring `link_removed`:
- Shell indicators: `<div id="root">`, `<div id="app">`, `<div id="__next">`, `__NEXT_DATA__`, `__nuxt`, `ng-app=`, `ng-version=`, `react-root`, `data-reactroot`, `_reactListening`
- Low-text ratio: HTML **>5,000 chars** but visible word count **<50**

Either signal → status `unverifiable_js` ("link may exist but cannot be confirmed via plain HTTP GET") — **never report a JS-rendered page as `link_removed`**. Social-media pages are typically `unverifiable_js`.

**Status vocabulary:** `verified | lost (404) | moved (3xx) | link_removed | unverifiable_js | exists (HEAD-only) | error`. `--head-only` mode = existence check only (fast bulk triage; target_found unknown).

For bulk verification, raw HTML fetch (no browser render) is correct and fastest: outbound `<a>` tags are reliably present pre-JS. Only spin up a headless render when an SPA shell is detected and a definitive answer is required.

## 10. Expired-Domain Heritage Check (Google QRG Jan 2025 §4.6.7)

Detects expired-domain abuse: a domain registered long ago for topic A now hosting unrelated topic B (canonical example: 18-year-old veterinary domain now a crypto-signals hub).

**Method:**
1. WHOIS lookup (system `whois` binary; fallback: raw TCP/43 query to `whois.iana.org` following the `refer:` referral). Extract creation / updated / expiry dates + registrar; compute `years_registered = days/365.25`.
2. Determine baseline topic from the **earliest Wayback Machine snapshot**; classify current content topic; compare (topical shift = topics differ, case-insensitive).

**Risk matrix:**

| Years registered | Topical shift | Risk | Reading |
|------------------|---------------|------|---------|
| <2 | Yes | **HIGH** | Fresh registration + declared shift |
| ≥5 | Yes | **HIGH** | Old registration + topical drift = classic expired-domain abuse |
| 2-5 | Yes | MEDIUM | Drift at moderate age |
| ≥1 | No | LOW | Stable heritage |
| Unknown creation date | Any | UNKNOWN | WHOIS gave no creation date |
| Any | Unknown (no baseline) | UNKNOWN | Need baseline topic to detect shift |

Use this check both on the audited site itself and on suspicious *referring* domains (pattern #13 in the toxic list: expired/auctioned domains repurposed for link building).

## 11. Competitor Gap & Top Pages

**Gap analysis** (Bing `compare` is the only free built-in; otherwise diff referring-domain sets from Moz/DataForSEO):
- Domains linking to competitor but NOT to target = link-building opportunities (output top 20 with authority scores)
- Domains linking to both = relationships to reinforce
- Domains linking only to target = competitive advantage

**Top pages by backlinks:**
- Link magnets (pages with high-authority links) → replicate the format
- Pages with zero backlinks → internal-linking opportunities
- **404 pages that still have backlinks → 301 redirect to reclaim link equity**

## 12. Pre-Delivery Review (mandatory before reporting)

- [ ] Every metric has a source label + confidence; no claim without a backing source
- [ ] "Not found" results distinguish: not crawled vs below threshold vs error
- [ ] No `link_removed` verdict on a JS-rendered page (must be `unverifiable_js`)
- [ ] JSON-LD without top-level `@type` may use a `@graph` wrapper — valid, not malformed
- [ ] Suspicious H1s (counters/stats) not treated as semantic headings
- [ ] Reciprocal patterns flagged (outbound links cross-checked against verified inbound)
- [ ] Health score: 4+ of 7 factors scored, else INSUFFICIENT DATA
- [ ] Summary referring-domain count matches the verified links list
- [ ] Platform detection backed by actual HTML signals (wp-content, Shopify CDN…), not guessed
- [ ] Never present inferred data as fact

**Error-handling contract:** Moz rate-limit mid-run → return partial data flagged `rate_limited: true`; Common Crawl timeout → skip CC metrics and note it; never fail silently — always report what succeeded and what failed.

## 13. GEO Context (cross-reference)

For AI-platform visibility, E-E-A-T signals correlate **3x more strongly than traditional backlinks** (Ahrefs study, Dec 2025, 75K brands). Backlink work remains foundational for Google organic, but for GEO prioritize entity recognition (sameAs), citations on YouTube (correlation 0.737), Reddit, and Wikipedia — see the E-E-A-T/GEO reference.

## Sources

- `claude-seo/skills/seo-backlinks/SKILL.md` (AgriciDaniel/claude-seo, MIT)
- `claude-seo/skills/seo/references/backlink-quality.md` (MIT)
- `claude-seo/skills/seo/references/free-backlink-sources.md` (MIT)
- `claude-seo/agents/seo-backlinks.md` (MIT)
- `claude-seo/scripts/domain_history.py` (MIT — concepts extracted, no code copied)
- `claude-seo/scripts/verify_backlinks.py` (MIT — concepts extracted, no code copied)
- Existing `consolidated-seo-geo` SKILL.md (E-E-A-T vs backlinks correlation, Ahrefs Dec 2025)


## Addenda — completeness pass

### scripts/commoncrawl_graph.py
Free backlink-authority methodology (no API key): parse Common Crawl domain-level web graph (s3://commoncrawl/projects/hyperlinkgraph/, quarterly cc-main-YYYY-WW releases) to extract in-degree, out-degree, PageRank + rank, harmonic centrality + rank from the domain-ranks file; distinguishes 'domain in crawl but below ranking threshold' (too small/new) from 'not crawled'; results cached per domain+release.
