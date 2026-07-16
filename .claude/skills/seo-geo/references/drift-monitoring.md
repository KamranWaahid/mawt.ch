# SEO Drift Monitoring

> Git for SEO: capture a "known good" baseline of every SEO-critical element on a page, diff the live page against it with 17 severity-classified rules, keep full history in SQLite, and route each regression to the right re-audit.

## 1. Concept and commands

Drift monitoring answers "did anything break?" after a deploy, a CMS change, or an unexplained traffic drop — without waiting for Search Console to show the damage days later.

| Command | Purpose |
|---------|---------|
| `drift baseline <url>` | Capture current SEO state as a known-good snapshot |
| `drift compare <url>` | Diff current live page against the stored baseline (17 rules) |
| `drift history <url>` | Timeline of all baselines + comparisons for the URL |
| `drift report <comparison.json> --output report.html` | Stakeholder-shareable HTML report |

Options: `--skip-cwv` (skip Core Web Vitals fetch — faster, saves PageSpeed API quota), `--baseline-id N` (compare against a specific baseline instead of the most recent).

## 2. What a baseline captures

13 fields per snapshot:

| Element | Field | Notes |
|---------|-------|-------|
| Title tag | `title` | string |
| Meta description | `meta_description` | string |
| Canonical URL | `canonical` | string |
| Robots directives | `meta_robots` | string |
| H1 | `h1` | only the FIRST H1 text is stored |
| H2 headings | `h2` | full JSON array (order + text) |
| H3 headings | `h3` | full JSON array |
| JSON-LD schema | `schema` | full array of blocks |
| Open Graph tags | `open_graph` | dict |
| Core Web Vitals | `cwv` | PageSpeed mobile, `--psi-only`: performance score + lab metrics + field metrics; `null` if fetch fails or `--skip-cwv` |
| HTTP status code | `status_code` | defaults to 200 if not parseable from fetcher output |
| HTML content hash | `html_hash` | SHA-256 of full HTML body |
| Schema content hash | `schema_hash` | SHA-256 of JSON-LD serialized with sorted keys; `null` if no schema |

Capture pipeline: (1) SSRF-validate URL → (2) fetch page (60 s timeout) → (3) parse HTML (30 s timeout) → (4) optional CWV fetch (180 s timeout, strategy=mobile) → (5) hash HTML + schema → (6) insert into SQLite. A page returning 4xx/5xx is STILL captured as a baseline — status code is itself a tracked field.

### URL normalization (baseline matching key)

Applied before hashing so the same page always matches its baseline:
- Lowercase scheme and host
- Strip default ports (80 for http, 443 for https)
- Sort query parameters alphabetically
- Remove the 5 UTM parameters: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- Strip trailing slash (keep `/` for bare domain)
- Drop the fragment
- Matching key = SHA-256 of the normalized URL, truncated to 16 hex chars

## 3. Storage and history tracking

Local SQLite at `~/.cache/claude-seo/drift/baselines.db`, WAL journal mode, auto-created on first use.

| Table | Columns (essentials) | Purpose |
|-------|----------------------|---------|
| `baselines` | id (autoincrement), url, url_hash (indexed), timestamp (UTC ISO), title, meta_description, canonical, robots, h1, h2_json, h3_json, schema_json, og_json, cwv_json, html_hash, schema_hash, status_code | One row per snapshot; multiple baselines per URL allowed |
| `comparisons` | id, url, url_hash (indexed), baseline_id (FK → baselines), timestamp, results_json (full diff), critical_count, warning_count, info_count | One row per compare run; severity counts denormalized for fast history queries |

History rules:
- `compare` uses the MOST RECENT baseline unless `--baseline-id` is given.
- Every comparison is persisted with its full JSON result + counts; persistence failure is non-fatal (comparison output still returned, with a `db_warning`).
- All SQL uses parameterized placeholders (`?`) — never string interpolation.

## 4. The 17 comparison rules

### Severity levels

| Level | Meaning | Response time |
|-------|---------|---------------|
| CRITICAL | SEO-breaking change, likely traffic loss within days | Immediate |
| WARNING | Potential ranking/CTR impact, sometimes intentional | Within 1 week |
| INFO | Awareness only, often positive/neutral | At convenience |

### CRITICAL — rules 1-8 (immediate action)

| # | Rule | Trigger condition (exact) | Action |
|---|------|---------------------------|--------|
| 1 | Schema/JSON-LD completely removed | Baseline `schema` array non-empty AND current empty | Restore structured data immediately — rich results lost within hours |
| 2 | Canonical URL changed | Both non-null AND values differ (after normalization) | Verify intentional; wrong canonical redirects ranking signals to the wrong page |
| 3 | Canonical URL removed | Baseline had value, current is null/empty | Restore — Google will guess, often wrong for parameterized URLs |
| 4 | Noindex added | `noindex` substring absent in baseline robots, present now (case-insensitive) | If unintentional, remove immediately — page dropped from index within days |
| 5 | H1 removed entirely | Baseline first-H1 non-empty AND current H1 array empty | Restore H1 — primary topic signal gone |
| 6 | H1 changed significantly | SequenceMatcher similarity ratio of first H1s **< 0.5** (>50% different); skipped if either side empty | Verify change aligns with target keyword strategy |
| 7 | Title tag removed entirely | Baseline title non-empty, current null/empty | Restore immediately — Google auto-generates one, often poorly |
| 8 | Status code changed to error | Baseline status **200-399** AND current **≥ 400** | Investigate server error / missing page — rankings drop within days |

### WARNING — rules 9-14 (investigate within 1 week)

| # | Rule | Trigger condition (exact) | Action |
|---|------|---------------------------|--------|
| 9 | Title text changed | Both non-empty (trimmed) AND differ — removal is Rule 7 | Verify target keywords kept; monitor CTR in GSC over **2 weeks** |
| 10 | Meta description changed | Both non-empty (trimmed) AND differ | Verify keywords + CTA present; monitor CTR |
| 11 | CWV metric regressed >20% | Any of LCP / CLS / TBT **lab** values: `(new − old)/old > 0.20` (higher = worse for all three); skipped if either side lacks CWV data | Check recent code changes and third-party scripts |
| 12 | Performance score dropped 10+ pts | Lighthouse performance score: `old − new ≥ 10` (e.g. 85 → 74) | Run full PageSpeed analysis for new bottlenecks |
| 13 | OG tags removed | Baseline OG dict non-empty AND current empty | Restore — social shares fall back to generic/missing previews |
| 14 | Schema content modified | `schema_hash` differs AND schema exists on BOTH sides (removal is Rule 1, addition is Rule 15) | Validate: type changes, removed properties, new validation errors |

### INFO — rules 15-17 (awareness)

| # | Rule | Trigger condition (exact) | Action |
|---|------|---------------------------|--------|
| 15 | New schema added | Baseline schema empty, current non-empty | Positive — validate the new schema |
| 16 | H2 structure changed | H2 arrays differ in ANY way (count, text, or order) | Review heading hierarchy vs target topics |
| 17 | Content hash changed | `html_hash` differs (catch-all for any body change) | If no other rule fired, inspect manually to understand what changed |

### Rule-engine guards and known gaps

- Rules are mutually scoped: title change (9) never double-fires with title removal (7); schema modified (14) never double-fires with removed (1) or added (15); H1-change (6) is skipped when either side is empty (removal handled by 5).
- CWV rules 11-12 silently skip (untriggered, "data unavailable") when either baseline or current CWV is null — no false positives without data.
- **Gap**: meta description REMOVAL triggers no dedicated rule (Rule 10 requires both sides non-empty) — only Rule 17's content hash catches it. Check manually when Rule 17 fires alone.
- **Doc/code conflict resolved**: the rule docs claim Rule 11 compares field p75 LCP/INP/CLS; the implementation compares **lab** metrics LCP, CLS, TBT. Trust the implementation (lab metrics are what the comparison actually runs on); field metrics are stored in the baseline but unused by rules.

## 5. Comparison output contract

Each compare run returns JSON with:
1. `summary`: `total_rules` (17), `triggered`, and counts per severity (`critical` / `warning` / `info`)
2. `triggered_findings` + `untriggered_findings`: each finding = `{rule, severity, triggered, old_value, new_value, message}`
3. `baseline_id` + `baseline_timestamp` + `comparison_timestamp` (UTC ISO)
4. `current_status_code`, `cwv_compared` (bool)

Presentation order for the user: (1) one summary line "N CRITICAL / N WARNING / N INFO", (2) table of triggered rules with severity + old/new values + action, (3) re-audit recommendations for every CRITICAL and WARNING finding, (4) offer HTML report generation.

Long values are truncated for display: meta descriptions at 120 chars, hashes at 12 hex chars.

## 6. Re-audit workflow — route each finding

When drift is detected, do NOT stop at the diff — chain into the specialized audit. Original claude-seo routing with Factory command equivalents:

| Finding | claude-seo route | Factory equivalent |
|---------|-----------------|--------------------|
| Schema removed/modified/added (rules 1, 14, 15) | `/seo schema <url>` | `/audit-seo` schema volet |
| CWV regression / perf score drop (rules 11, 12) | `/seo technical` or `/seo google psi` | `/perf` (Lighthouse + CWV) |
| Title / meta description changed (rules 7, 9, 10) | `/seo page <url>` | `/audit-seo` on-page volet |
| Canonical changed/removed (rules 2, 3) | `/seo technical <url>` | `/audit-tech` indexability |
| Noindex added (rule 4) | `/seo technical <url>` | `/audit-tech` crawlability |
| H1 / heading structure changed (rules 5, 6, 16) | `/seo content <url>` | `/audit-seo` content + E-E-A-T |
| OG tags removed (rule 13) | `/seo page <url>` | `/audit-seo` social volet |
| Status code error (rule 8) | `/seo technical <url>` | `/audit-tech` full diagnostics |

### Typical workflows

**Pre/post deployment check** (the highest-value use):
```
drift baseline <url>    # before deploy
# ... deploy ...
drift compare <url>     # after deploy — any CRITICAL = rollback candidate
```

**Ongoing monitoring**: baseline once, then `compare` on a schedule (weekly fits the WARNING response window); `history` to review the timeline.

**Traffic drop investigation**: `compare` answers WHAT changed; `history` answers WHEN it changed — correlate the comparison timestamps with the GSC drop date.

**Post-fix verification**: after remediating a CRITICAL finding, capture a NEW baseline so the fixed state becomes the reference — never keep comparing against a pre-incident baseline.

### Interaction with content refresh (Factory)

Drift monitoring detects UNINTENDED change; the Factory content-refresh methodology handles INTENDED decay (HIGH = >3 positions lost / obsolete info → fix immediately; MEDIUM = 6+ months stagnant → this month). When a Rule 9/10/16 WARNING corresponds to a planned refresh, mark it intentional and re-baseline instead of reverting. Baseline CWV context = Factory green thresholds: LCP < 2.5 s, INP < 200 ms, CLS < 0.1, TTFB < 800 ms (75th percentile) — a page can regress >20% (Rule 11) yet still be green, and vice versa; report both facts.

## 7. Error handling

| Scenario | Behavior |
|----------|----------|
| URL unreachable | Report fetch error verbatim. Never guess page state. |
| No baseline for URL | Tell user to run `baseline` first. |
| SSRF blocked (private IP, loopback, reserved ranges, cloud metadata endpoints) | Report rejection. Never bypass. Only public http/https accepted. |
| SQLite DB missing | Auto-create silently. |
| CWV fetch fails (no API key / timeout 180 s) | Store `null`; rules 11-12 skip without error. |
| Page returns 4xx/5xx at baseline time | Still capture — status code is a tracked field. |
| Multiple baselines exist | Most recent wins unless `--baseline-id`. |
| Fetch/parse timeout (60 s / 30 s) | Fail the run with explicit timeout error. |

## 8. Security invariants

- All fetching via a validated fetch pipeline with SSRF protection — no curl, wget, or raw subprocess HTTP.
- TLS always verified (no `verify=False` anywhere).
- Parameterized SQL only.
- Drift agent profile (claude-seo): Sonnet-class model, maxTurns 15, tools Read/Bash/Write/Glob/Grep; only spawned when a baseline already exists for the URL. When an audit orchestrator passes `output_dir`, persist findings to `output_dir/findings/drift.md` + JSON-compatible entries for `audit-data.json`.

## Sources

- `claude-seo/skills/seo-drift/SKILL.md` (AgriciDaniel/claude-seo, MIT; original concept Dan Colta)
- `claude-seo/skills/seo-drift/references/comparison-rules.md`
- `claude-seo/agents/seo-drift.md`
- `claude-seo/scripts/drift_baseline.py` (thresholds/heuristics extracted, no code copied)
- `claude-seo/scripts/drift_compare.py` (thresholds/heuristics extracted, no code copied)
- existing consolidated-seo-geo (CWV green thresholds, content-refresh priorities merged into §6)
