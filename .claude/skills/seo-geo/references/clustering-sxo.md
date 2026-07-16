> Deep source of truth for semantic keyword clustering (SERP-overlap methodology, hub-spoke architecture, execution scorecard) and SXO (page-type taxonomy, user-story derivation, persona scoring). Consolidated from AgriciDaniel/claude-seo (MIT).

## 1. SERP-Overlap Clustering — Core Principle

Group keywords by how Google actually ranks them (shared top-10 organic results), never by text similarity or stemming. Two keywords returning the same results belong on the same page; completely different results need separate pages.

### Data collection (per keyword)
- Retrieve top 10 **organic** results only — ignore ads, featured snippets, PAA, knowledge panels.
- Normalize URLs: strip protocol, trailing slash, query parameters (except meaningful ones). Store as a set of 10 URLs per keyword.
- **Data source priority**: (1) DataForSEO `serp_organic_live_advanced` with `location_code: 2840` (US), `language_code: "en"` — most consistent; run cost check before each batch, fall back on `"blocked"`. (2) WebSearch fallback — results vary by session, so run multiple searches per keyword and use the most common result set.
- **Cache** all SERP results within a session: reusing keyword A's results across the A-B and A-C comparisons halves total fetches.

### Overlap thresholds (pairwise score = |urls_A ∩ urls_B|)

| Shared top-10 URLs | Relationship | Action |
|---|---|---|
| 7-10 | Same post | Merge into one target page; higher-volume keyword becomes primary |
| 4-6 | Same cluster | Same spoke cluster; separate posts or same post depending on volume gap |
| 2-3 | Interlink | Adjacent clusters + cross-cluster internal links |
| 0-1 | Separate | Different clusters, or exclude from this pillar topic |

Overlap matrix is symmetric; diagonal is always 10 (keyword vs itself). Store as `serp_matrix` (keywords array + scores matrix) in `cluster-plan.json`.

### Ambiguous scores (3-4 range) — tiebreakers, in order
1. Domain overlap: same domains but different pages = closer relationship.
2. Intent alignment: same intent category → lean same cluster.
3. Volume ratio: one keyword with **10x+ volume** likely deserves its own post.
4. When in doubt: same cluster, separate posts (err toward cohesion).

### Cost optimization
Full pairwise on N keywords = N(N-1)/2 fetch pairs; 40 keywords = 780 comparisons. Reduce:
- Pre-group by intent + shared head term: 4 groups of ~10 = 4 × 45 = **180 comparisons**.
- Only cross-check boundary keywords (highest-volume keyword of each group) across groups.
- Skip rule A: two long-tail variants of the same head term with same intent → assume overlap 4-6 (same cluster) without fetching.
- Skip rule B: different intent categories and no shared head term → assume overlap 0-2.
- Verify assumptions by spot-checking **20% of skipped pairs** with real SERP comparisons.

### Anti-patterns (never do)
1. Cluster by text similarity alone — "dog training tips" vs "dog training classes" can have entirely different SERPs.
2. Stemming-only grouping — "run" vs "running" may target different intents.
3. Assume related searches share a cluster — always verify with SERP data.
4. Ignore SERP feature differences — keyword A triggering a local pack vs keyword B a featured snippet likely need different content types even with moderate URL overlap.
5. Treat all domains equally — filter out the top 5 most ubiquitous domains (Wikipedia, Reddit, etc.) before scoring, or weight niche-specific results higher.

## 2. Keyword Expansion (pre-clustering)

Expand seed into **30-50 unique variants** via 5 methods:

| Method | Source / modifiers |
|---|---|
| Related searches | SERP "related searches" + "people also search for" |
| PAA mining | All People Also Ask questions on the SERP |
| Long-tail modifiers | best, how to, vs, for beginners, tools, examples, guide, template, mistakes, checklist |
| Question mining | who / what / when / where / why / how variants |
| Commercial modifiers | pricing, review, alternative, comparison, free, top |

Dedup: lowercase, strip articles, remove exact duplicates. If under 30 variants → second expansion pass using top PAA questions as seeds. Under 15 after expansion = error, re-expand.

## 3. Intent Classification

| Intent | Signals | In clusters? |
|---|---|---|
| Informational | how, what, why, guide, tutorial, learn | Yes |
| Commercial | best, top, review, comparison, vs, alternative | Yes |
| Transactional | buy, price, discount, coupon, order, sign up | Yes |
| Navigational | brand names, product names, login | **No — exclude** |

Mixed-intent keywords (e.g. "best CRM software" = commercial + informational): classify by dominant intent; flag borderline cases for manual review.

## 4. Hub-and-Spoke Architecture

### Pillar page (hub)
| Attribute | Requirement |
|---|---|
| Word count | 2,500-4,000 |
| Keyword | Broadest, highest-volume, most SERP overlap with the rest of the set |
| Template | `ultimate-guide` (default) |
| Internal links | Links to EVERY spoke in every cluster (mandatory) |
| Structure | Table of contents, one section per cluster, summary per subtopic |
| Schema | Article + BreadcrumbList + ItemList (listing all cluster pages) |
| Refresh | Quarterly, or whenever new spokes are added |

### Spoke pages
| Attribute | Requirement |
|---|---|
| Word count | 1,200-1,800 |
| Keyword | Unique subtopic keyword per post (never shared) |
| Internal links | Pillar (mandatory, in body) + 2-3 sibling spokes |
| Schema | Article (`isPartOf` → pillar URL) + BreadcrumbList |
| Depth | Deeper than the pillar's coverage of the same subtopic |

### Cluster constraints
| Constraint | Value |
|---|---|
| Clusters per pillar | 2-5 |
| Posts per cluster | 2-4 |
| Total posts incl. pillar | 5-21 |
| Max total estimated words | ~50,000 (pillar + 20 spokes at max) |

### Template auto-selection by intent
| Intent pattern | Template |
|---|---|
| Informational (broad) | ultimate-guide |
| Informational (how) | how-to |
| Informational (list) | listicle |
| Informational (concept) | explainer |
| Commercial (compare) | comparison |
| Commercial (evaluate) | review |
| Commercial (rank) | best-of |
| Transactional | landing-page |

Selection logic: (1) match classified intent; (2) if several templates fit, prefer the format dominating the actual SERP (all listicles → listicle); (3) avoid duplicate templates within one cluster unless intent justifies it.

## 5. Internal Link Matrix

| Link type | Direction | Requirement |
|---|---|---|
| Spoke → pillar | mandatory | Every spoke, at least once in body content |
| Pillar → spoke | mandatory | Every spoke, in its relevant pillar section |
| Spoke ↔ spoke (same cluster) | recommended | 2-3 per post |
| Cross-cluster spoke → spoke | optional | 0-1 per post, only with a genuine topical bridge |

Hard rules:
- Minimum **3 incoming internal links** per post.
- Zero orphan pages — every post reachable from the pillar within **2 clicks**.
- Anchor text = target keyword or close variant; never "click here".
- Anchor diversity: no single anchor text on more than **40%** of links to a page.
- Links placed in body paragraphs, not only navigation/sidebar/"related posts".
- Matrix stored as JSON adjacency list: `{from, to, type: mandatory|recommended|optional, anchor}`.

## 6. Cannibalization — Prevention & Resolution

Prevention (merged with existing Factory rules):
1. **One primary keyword = one page.** Strict keyword → URL mapping; no two posts ever share a primary keyword.
2. SERP overlap **7+** between two keywords → merge into a single post targeting both.
3. Post-clustering uniqueness check: list all primary keywords, flag near-duplicates ("best CRM" vs "top CRM software").
4. Near-duplicates → merge, or differentiate by intent (one `best-of`, one `comparison`) with differentiated metadata and unique angles.
5. Pre-publication check: is this keyword already targeted anywhere on the site?

Resolution on existing sites (from consolidated-seo-geo):
- Merge similar content into the best-performing URL; **301 redirect** the weaker pages.
- Rewrite one page for a distinct intent (informational vs transactional).
- Canonical tag to the main page where merge isn't possible.
- Rebuild internal links/anchors toward the winner; or restructure as hub/spoke (pillar + satellites).
- Audit quarterly.

## 7. Execution Workflow & Scorecard

### Priority order (strict)
1. Pillar first (spokes need a hub to link to).
2. Spokes by search volume, descending (fastest compounding traffic).
3. Same volume → by cluster index; same cluster → by post index.

### Context injection per post
Pass to the writer: role (pillar|spoke), pillar title/URL, cluster name + indexes, primary + secondary keywords, template, word-count target (guideline not hard limit), mandatory/recommended outgoing links with anchors, incoming-link placeholder, and a differentiation note vs sibling posts.

### Backward link injection
During writing, insert placeholder `<!-- cluster-link:cluster-0-post-1 -->` at a contextually relevant spot. When the target post is later written, replace the placeholder with a real contextual link; if no placeholder exists, append the link in the most relevant section. Log every backward link added.

### Resume rules
- Match existing files against plan via slug patterns + primary keyword in frontmatter/first H1; mark as `written`.
- Spoke file under **50% of target word count** = treated as unwritten, recreate.
- Pillar missing but spokes exist → write pillar first, then inject backward links into existing spokes.
- Plan modified since last run → re-validate before resuming.

### Scorecard metrics
| Metric | Formula | Target |
|---|---|---|
| Coverage | written / planned × 100 | 100% |
| Link density | total internal links / total posts | ≥ 3.0 per post |
| Orphan pages | posts with 0 incoming links | 0 |
| Pillar connectivity | spokes linking to pillar / total spokes | 100% |
| Reverse pillar links | spokes linked from pillar / total spokes | 100% |
| Cross-links | implemented / recommended cross-links | ≥ 80% |
| Cannibalization | posts sharing a primary keyword | 0 |
| Image count | posts with ≥ 1 image / total posts | ≥ 90% |
| Content gaps | planned posts not written | 0 |
| Avg word count | mean vs targets | within 10% |

### Quality gates before marking execution complete
1. Every spoke links to pillar; 2. pillar links to every spoke; 3. no post under 3 incoming links; 4. no shared primary keywords; 5. no orphans; 6. every post ≥ **80% of word-count target**. Any failing gate → flag with remediation, never silently pass. Additional pre-delivery check: no spoke with SERP overlap < 4 to its cluster peers.

## 8. SXO — Reading the SERP Backwards

**Core insight**: a page can score 95/100 on technical SEO and still never rank because it is the wrong page type for the keyword — if Google shows 8 product pages, a blog post won't break through regardless of optimization. SXO Gap Score is **separate** from the SEO Health Score; always report both, labeled distinctly (e.g. "95 SEO + 30 SXO = technically perfect, strategically misaligned").

### SERP backwards analysis (top 10 organic)
Per result record: domain authority tier (brand / niche authority / unknown), page type (taxonomy §9), content format, word-count estimate, schema signals, media signals. Record SERP features: featured snippet (paragraph/list/table/video), all PAA questions, ad count + copy themes, related searches, knowledge panel / local pack / shopping, AI Overview presence + source types.

**SERP consensus**: dominant page type share > **60%** = strong consensus; **40-60%** = mixed; < **40%** = fragmented (= differentiation opportunity). Minimum **5 SERP results** analyzed or note the limited sample.

### Page-type mismatch severity
| Target type | SERP expects | Severity | Fix |
|---|---|---|---|
| Blog post | Product pages | CRITICAL | Create dedicated product page |
| Blog post | Comparison | HIGH | Restructure as comparison with matrix |
| Product | Informational | HIGH | Add educational content layer |
| Landing page | Tool/calculator | HIGH | Build interactive tool component |
| Service page | Local results | MEDIUM | Add location signals + local schema |
| Type matches | — | ALIGNED | Focus on depth and UX |

A detected mismatch is the PRIMARY finding — lead with it.

### SXO Gap Score (0-100, higher = better aligned)
| Dimension | Compares | Points |
|---|---|---|
| Page type | target vs SERP dominant type | 0-15 |
| Content depth | word count, heading depth, topic coverage | 0-15 |
| UX signals | CTA clarity, above-fold content, mobile layout | 0-15 |
| Schema markup | present vs SERP-expected types | 0-15 |
| Media richness | images/video/interactive vs SERP norm | 0-15 |
| Authority signals | E-E-A-T markers, social proof, credentials | 0-15 |
| Freshness | last-updated, date signals | 0-10 |

Scoring must use the **rendered DOM** (post-JavaScript), because personas see what JS produces — raw HTML underestimates above-the-fold reality on SPAs.

## 9. Page-Type Taxonomy (classify into exactly 1 of 8)

| # | Type | Primary on-page signals | SERP indicators | Required elements / schema |
|---|---|---|---|---|
| 1 | Landing page | Hero + single value prop, prominent CTA, pricing link, social proof, minimal nav | Branded queries, high top-ad density, sitelinks to /pricing, "\| Product Name" titles | CTA above fold, trust badges, ≥1 testimonial; WebSite or SoftwareApplication schema |
| 2 | Blog post | Author byline, publish date, body > 800 words, /blog/ breadcrumb, related posts | Featured snippets, PAA with 4+ questions, diverse domains, dates in snippets, low ads | Article/BlogPosting schema, author entity, datePublished + dateModified, ≥1 image with alt |
| 3 | Product page | Price, buy button, multi-angle images, specs, star-rated reviews, SKU | Shopping carousel, price/availability/rating rich snippets, "buy/shop" titles | Product schema (name, price, availability, review), purchase CTA |
| 4 | Hybrid (service+content) | Educational sections mixed with CTAs (SaaS pattern), both /blog/ and /product/ nav links | Mixed branded + informational results, FAQ + SoftwareApplication schema mix, moderate ads | FAQPage or HowTo + product schema, dual CTAs (educational + commercial) |
| 5 | Service page | Process/methodology, case studies, team credentials, consultation CTA | Local pack, "near me" related, agency domains, "[Service] \| [Company]" titles, cost/process PAA | Service/ProfessionalService schema, process description, ≥1 case study, contact mechanism |
| 6 | Comparison page | "vs" in title/URL, feature matrix, pros/cons, "best X for use case" | "vs" related searches, alternatives PAA, G2/Capterra/TrustRadius results, "10 Best…" titles, affiliate disclosures | Comparison table with criteria, pros/cons per option, "best for" verdict; ItemList/Table schema |
| 7 | Local page | Address, map embed, consistent NAP, service area, hours | Local pack (map + 3), "near me", GBP cards, Yelp/BBB results | LocalBusiness schema (correct subtype), full NAP, geo coordinates, openingHoursSpecification, embedded map |
| 8 | Tool / interactive | Input fields, calculator/generator UI, results area, "free [tool]" title, minimal marketing copy | Tool-first sites, "calculator/generator/checker" related, minimal PAA (users want to DO) | WebApplication/SoftwareApplication schema, functional tool above fold, no login wall for basic use |

**Classification priority when signals overlap**: 1 functional tool → Tool; 2 address + map → Local; 3 comparison table + "vs" → Comparison; 4 price + buy button → Product; 5 CTA-heavy + minimal nav → Landing; 6 process + case studies → Service; 7 educational + CTA mix → Hybrid; 8 default → Blog post.

## 10. User-Story Framework (SERP signals → intent)

Every story must cite the specific SERP signal that generated it — no invented stories.

### 5 signal sources
| Signal | Reveals | Reading rules |
|---|---|---|
| PAA questions | Knowledge gaps + concerns | Cluster by theme: definitional = awareness, evaluative = consideration, comparative = decision |
| Ad copy (top + bottom) | Commercial triggers + objections | Free-trial emphasis = commitment barrier; trusted-by counts = trust barrier; price anchoring = cost; speed claims = time. **No ads = informational keyword** |
| Related searches | Journey before/after | Added qualifiers = narrowing; "[kw] alternatives" = dissatisfaction; "[kw] vs [competitor]" = active comparison; "[kw] reviews" = trust-seeking pre-purchase |
| Featured snippet format | Expected answer structure | Paragraph = definition; list = steps/ranking; table = structured comparison; video = demonstration; none = Google uncertain (opportunity) |
| AI Overview | Google's authoritative synthesis | Cited sources = trusted authorities; target not cited = content doesn't match Google's synthesis model |

### Story format
`As a [persona], I want to [goal], because [emotional driver], but I'm blocked by [barrier].`

### Emotional-state mapping
| Signal pattern | State |
|---|---|
| "Is X safe/legitimate/scam" in PAA | Skeptical |
| Many comparison queries in related | Overwhelmed by choices |
| "How to [basic task]" dominating PAA | Confused / frustrated |
| High ad density + shopping results | Ready to buy |
| "Best X for [use case]" results | Evaluating carefully |
| "[X] not working / problems" in PAA | Frustrated with current solution |

### Barrier types → page-level fix
| Barrier | SERP signal | Page must provide |
|---|---|---|
| Information gap | PAA unanswered by snippet | Complete answer in first scroll |
| Trust gap | Ads emphasize badges/reviews | Social proof, credentials, guarantees |
| Comparison fatigue | Many "vs"/"best" related searches | Clear differentiation or recommendation |
| Price sensitivity | Cost/free-alternative PAA | Transparent pricing, value justification |
| Technical confusion | "How to"/setup PAA | Step-by-step guide, demo, or tool |
| Time pressure | "instant/today/fast" in ads | Quick-win content, speed of resolution |

Quality bar: **3-5 stories**, no duplicates, spanning **≥ 2 journey stages** (awareness/consideration/decision); persona names reflect signal sources.

## 11. Persona Scoring (4-7 personas, 100 pts each)

Derive **4-7 personas**, each traceable to a signal cluster: PAA cluster about cost = Budget-Conscious Buyer; setup PAA = Technical Evaluator; trust-heavy ads = Risk-Averse Decision Maker; "for small business" related = SMB Owner; "enterprise" related = Enterprise Buyer. Persona card documents: role, goal, emotional state, journey stage, 2-3 key questions, SERP evidence.

### 4-dimension rubric (25 pts each)
| Band | Relevance (addresses need?) | Clarity (answer in 10s?) | Trust (adequate signals?) | Action (clear next step?) |
|---|---|---|---|---|
| 21-25 | Directly addresses primary goal with specific content | Answer above fold / first scroll | Multiple signals matching this persona's concerns | Persona-appropriate CTA, low friction |
| 16-20 | Covers topic, lacks persona-specific framing | On page but needs scrolling/nav | General signals, not persona-specific | CTA exists but generic for stage |
| 11-15 | Tangential — persona must extrapolate | Buried in dense text/structure | Gaps in what this persona needs | Next step exists, not prominent |
| 6-10 | Serves a different audience | Pieced from multiple sections | Minimal — persona feels uncertain | Single CTA mismatched to journey stage |
| 0-5 | Irrelevant to this persona | Absent — persona bounces | None, or actively undermining | Dead end |

Trust signals to check: testimonials from similar users, credentials/certifications, security badges (risk-averse), industry/size-matched case studies, author expertise. Action signals: CTA matched to stage (awareness = "learn more", decision = "buy now"), friction level (free trial vs sales call), alternative paths per readiness.

### Interpretation & prioritization
| Total | Rating | Implication |
|---|---|---|
| 80-100 | Excellent | Minor optimizations only |
| 60-79 | Good | Relevant with notable gaps |
| 40-59 | Needs work | Significant improvements needed |
| 0-39 | Critical mismatch | Major restructuring or new page |

Weight personas by SERP intent share (70% informational SERP → weight informational personas up; ad-dominated → commercial; local pack → local). Rank fixes: (1) weakest persona with highest volume weight, (2) lowest-scoring dimension across all personas = systemic issue, (3) critical-mismatch personas = page-type problem.

Validation: every persona traces to SERP signals; scores cite page evidence; recommendations name sections/CTA text/placement; 4-7 personas exactly; weakest persona addressed first.

## 12. Wireframes (IST/SOLL, on demand)

Generate IST (current state) from the parsed page and SOLL (target state) from SERP consensus type + gap findings + weakest personas. Placeholders must be ultra-concrete: not "Add a CTA here" but "Add pricing CTA with annual savings badge below hero, linking to /pricing#enterprise". Output as annotated semantic HTML section outline.

## Sources
- claude-seo: `skills/seo-cluster/SKILL.md`, `skills/seo-cluster/references/serp-overlap-methodology.md`, `skills/seo-cluster/references/hub-spoke-architecture.md`, `skills/seo-cluster/references/execution-workflow.md`, `agents/seo-cluster.md`
- claude-seo: `skills/seo-sxo/SKILL.md`, `skills/seo-sxo/references/page-type-taxonomy.md`, `skills/seo-sxo/references/persona-scoring.md`, `skills/seo-sxo/references/user-story-framework.md`, `agents/seo-sxo.md`
- existing consolidated-seo-geo (topic clusters, cannibalization prevention/resolution — merged into §6)
- AgriciDaniel/claude-seo is MIT-licensed. No FLOW-framework content reproduced (only cross-referenced in the source), so no CC BY 4.0 attribution required in this file.

## Addenda — completeness pass

### skills/seo-sxo/references/wireframe-templates.md
IST/SOLL wireframe methodology (before/after page blueprints from SERP expectations): mobile-first 375px, above-the-fold ~600px must contain the page-type-critical element; 8 SOLL section-by-section templates with semantic HTML5 — Landing (hero H1=value prop matching keyword, social proof logos+metric, 3 feature blocks addressing PAA, pricing 2-3 tiers, FAQ 5-7 PAA questions), Blog (TL;DR box above fold, TOC jump links, expert blockquote, H2 per keyword cluster), Product (CTA above fold, specs table, aggregateRating), Comparison ('[A] vs [B]: [year]' + quick verdict + persona recs), Service, Local (NAP + map + openingHoursSpecification), Tool (input above fold), Hybrid; placeholder rule: never vague ('Add a CTA') always concrete ('Add Start Free Trial button below hero, green #2d6a4f, links to /signup').
