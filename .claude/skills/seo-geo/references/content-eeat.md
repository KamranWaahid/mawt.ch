> Deep source of truth for content quality: E-E-A-T scoring per the Sept 11, 2025 QRG, Google's Who/How/Why heuristic, algorithmic filler/AI-pattern/claim detection with exact thresholds, content briefs, keyword density, and humanization rules.

## 1. Who / How / Why — canonical pre-check

Run Google's own three-question heuristic (helpful-content guide: developers.google.com/search/docs/fundamentals/creating-helpful-content) before scoring any E-E-A-T sub-factor:

| Question | Pass criteria |
|---|---|
| **Who** created it? | Visible byline + author bio page + relevant credentials. Non-negotiable for YMYL. |
| **How** was it created? | Process disclosure where readers would ask — mandatory for AI-assisted content. Original research / first-hand evidence present. |
| **Why** does it exist? | "To help people", not "to attract search clicks". Red flags: niche entry without expertise, churn for freshness signals, writing to a word-count target. |

If all three answers are weak, the page is at risk under core helpfulness signals. The Helpful Content System was **merged into the core ranking algorithm in the March 2024 core update** — no standalone classifier; helpfulness is re-weighted in every core update.

## 2. E-E-A-T framework (Sept 11, 2025 QRG + Dec 2025 core update)

Trustworthiness is the most important factor, assessed via the other three plus direct trust indicators.

### Scoring weights

| Factor | Weight | Strong signals | "None" rating trigger |
|--------|--------|----------------|----------------------|
| Experience | 20% | First-hand use, original photos/screenshots/data, case studies with specifics, before/after outcomes, process documentation, anecdotes that couldn't be fabricated | Clearly AI-generated or scraped |
| Expertise | 25% | Relevant credentials in visible byline/bio, technical accuracy + depth, evidence-backed claims, correct specialized vocabulary, up-to-date with the field | Factual errors, misinformation |
| Authoritativeness | 25% | Niche authority recognition, external citations of author/site, awards/accreditations, consistent publication history, reputable media features, professional affiliations | Negative reputation, known misinformation |
| Trustworthiness | 30% | Contact info (address/phone/email), privacy policy + ToS, HTTPS valid cert, transparent authorship, reviews/testimonials, visible corrections/update history, no hidden ads/clickbait, secure payments + visible refund policy (e-commerce) | Deceptive practices, scam indicators |

### December 2025 core update — scope expansion

- E-E-A-T now applies to **ALL competitive queries, not just YMYL**. Anonymous/generic authorship is penalized even for non-YMYL (entertainment, lifestyle) content.
- AI content quality detection significantly improved.
- Measured traffic impact: **affiliate sites -71%**, **health/YMYL -67%**, **e-commerce -52%** average decline.
- Experience became the key differentiator: AI can generate expertise-sounding content but cannot fabricate genuine experience — first-person narrative ("I tested this..."), original (non-stock) photos, verifiable specifics, real process docs.

### YMYL topics (highest E-E-A-T bar)

Health/safety, financial advice/transactions, legal, news/current events, **elections and civic trust (added Sept 2025)**, **democratic processes (added Sept 2025)**, groups of people (harm potential).

### Overall score bands + remediation

| Band | Meaning | Priority fixes |
|------|---------|----------------|
| 90-100 | Exceptional — authority site, recognized expert | Maintain freshness, monitor reputation, keep credentials current |
| 70-89 | Strong | Regular updates, expand author presence, speaking/publications, expertise video |
| 50-69 | Moderate | Original research depth, topical content clusters, industry recognition, document methodologies |
| 30-49 | Weak | Author bios + credentials, first-hand experience content, external citations, testimonials |
| 0-29 | Critical | Contact info + about page, establish author identity, HTTPS, remove deceptive elements |

### Cross-platform correlation (merged from existing Factory skill)

- E-E-A-T correlates **3x more strongly with AI visibility than traditional backlinks** (Ahrefs study Dec 2025, 75K brands).
- Platform correlations: **YouTube 0.737** (strongest), Reddit high, Wikipedia high, LinkedIn moderate.
- YouTube citability threshold: channel **10K+ subscribers + regular publishing** = citable source for Gemini/Perplexity.

## 3. AI content assessment (Sept 2025 QRG)

Raters now formally evaluate whether content appears AI-generated. AI content is **acceptable IF** it demonstrates genuine E-E-A-T, provides unique value, has human oversight/editing, and contains original insight. Its presence is not inherently penalizing — creation method is irrelevant if value is unique.

**Low-quality AI markers (flag all):** generic phrasing without specificity · no original insight/perspective · no first-hand experience signals · factual inaccuracies · repetitive structure across pages · no author attribution.

**New spam categories (Sept 2025 QRG):**

| Category | Definition |
|---|---|
| Expired domain abuse | Buying expired domains to exploit their backlinks |
| Site reputation abuse | Hosting low-quality third-party content on a reputable site |
| Scaled content abuse | Mass-producing pages without value (QRG Jan 23, 2025 §4.6.5: automated tools as "a low-effort way to produce many pages that add little-to-no value") |

**Also new:** raters assess AI Overview summary quality; **RSL 1.0** (Really Simple Licensing, Dec 2025) — machine-readable AI-training licensing standard augmenting robots.txt, backed by Reddit, Yahoo, Medium, Quora, Cloudflare, Akamai, Creative Commons.

**QRG Lowest-rating triggers (Jan 23, 2025 update):** §4.6.6 — Lowest when "all or almost all MC… copied, paraphrased, [or] AI-generated"; §4.6 — filler content (padding phrases, generic transitions, no original insight).

## 4. Filler & AI-pattern detection (algorithmic, advisory)

Heuristic scorer aligned to QRG §4.6/§4.6.5/§4.6.6. Advisory only — it never issues an "this is AI" verdict (modern generators can pass every heuristic). Pair with claim verification (§6) for stronger signal.

### Formulas (per-1000-token normalized)

| Metric | Formula | Flag threshold |
|--------|---------|----------------|
| filler_score (0-100, higher=worse) | `min(100, filler_hits_per_1000_tokens × 25)` | flag "filler" at ≥ 50 |
| ai_pattern_score (0-100, higher=worse) | `min(100, ai_hits_per_1000_tokens × 15)` | flag "ai-patterns" at ≥ 40 |
| information_density (0-1) | `(proper-noun entities + numbers) × 100 / tokens`, divided by 10, capped at 1.0 | flag "low-density" at < 0.20 |
| repetition_score (0-100) | fraction of bigrams occurring >1× × 100 | flag "repetitive" at ≥ 30 |
| thin content | token count | flag "thin-content" at < 300 tokens |

**Composite quality (0-100, higher=better):** `(100−filler)×0.25 + (100−ai_pattern)×0.25 + density×100×0.25 + (100−repetition)×0.15 + min(100, tokens/10)×0.10` (length bonus caps at 1000 tokens). Default pass threshold: **60**.

**Density calibration:** high-density writing (case studies, data journalism) lands at ~5+ entities+numbers per 100 tokens; generic filler lands at < 2. Filler phrase tuning: ~3 hits per 1000 tokens is the concern line.

### Filler phrase catalogue (26 phrases, case-insensitive substring match)

"it's important to note that", "in this article, we'll explore", "in this article we will explore", "in today's fast-paced world", "in today's digital age", "in today's competitive landscape", "needless to say", "at the end of the day", "when it comes to", "when all is said and done", "in the realm of", "in the world of", "the bottom line is", "without further ado", "first and foremost", "last but not least", "for what it's worth", "it goes without saying", "as we all know", "the truth is that", "the fact of the matter is", "more often than not", "let's dive in", "let's dive into", "let's take a closer look", "let's take a deeper look".

### AI-pattern catalogue (46 phrases; from Wikipedia "AI Cleanup" catalogue, CC BY-SA 4.0)

"delve into", "delve deeper into", "in the ever-evolving", "ever-evolving landscape", "ever-changing landscape", "in the dynamic landscape", "navigating the", "navigate the complexities", "tapestry of", "rich tapestry", "intricate tapestry", "embark on a journey", "embarking on this", "a testament to", "a beacon of", "the cornerstone of", "a cornerstone of", "at the heart of", "at its core", "in essence,", "in conclusion,", "ultimately,", "moreover,", "furthermore,", "however, it's worth noting", "it's worth noting that", "by leveraging", "leverage the power of", "leveraging the power of", "harness the power of", "unlock the potential", "unlock the full potential", "the realm of possibilities", "open up a world of", "a world of possibilities", "elevate your", "transform your", "revolutionize the way", "game-changer", "game-changing", "cutting-edge", "state-of-the-art", "in summary,", "to summarize,", "to put it simply,", "in a nutshell,".

Additions to this list require corpus evidence, not intuition — only phrases disproportionately frequent in LLM output vs human writing qualify.

## 5. Humanization rules (deterministic 1:1 rewrites)

Last-mile cleanup on drafts. Conservative: only listed phrases are replaced; unknown idioms are left alone. Not a paraphraser — no new content introduced. Preserve leading capitalization; after deletions, collapse double spaces and fix space-before-punctuation.

| Match (case-insensitive, word-boundary) | Replace with |
|---|---|
| in essence, · in conclusion, · ultimately, · moreover, · furthermore, · in summary, · to summarize, · to put it simply, · in a nutshell, · needless to say, | *(delete)* |
| delve into · delve deeper into | explore |
| in the ever-evolving landscape/world of | in |
| ever-evolving · ever-changing | changing |
| navigating the complexities of | handling |
| tapestry of | range of |
| rich/intricate/complex tapestry | range |
| embark on a journey | begin |
| a testament to | evidence of |
| a beacon of | a leader in |
| (the/a) cornerstone of · at the heart of | central to |
| however, it's worth noting that | however, |
| it's worth noting that · it's important to note that | note: |
| by leveraging | by using |
| leverage/harness the power of · unlock the (full) potential | use |
| leveraging the power of | using |
| open up a world of | enable |
| a world of possibilities | options |
| elevate your · transform your | improve your |
| revolutionize the way | change how |
| game-changer | important |
| cutting-edge · state-of-the-art | modern |
| in today's fast-paced/digital/competitive world/age/landscape | today |
| at the end of the day | ultimately |
| when it comes to | for |
| first and foremost, | first, |
| last but not least, | finally, |
| let's dive in/into | starting with |
| let's take a closer/deeper look | look at |

Deliberate divergence from upstream catalogues: "leverage" → "use" (not "employ") — reads more naturally in SEO contexts.

## 6. Claim verification (citation-gap detection)

Fact-check pass on drafts pre-publish. Advisory: checks whether the author *anchored* each claim, not whether the citation is valid. A high uncited ratio in long-form content is the same red flag QRG raters use.

### Claim types detected (first match wins per span — no double counting)

| Kind | Pattern semantics | Example |
|------|-------------------|---------|
| statistic | `N% of <subject>` or bare `N%` | "47% of marketers report…" |
| quantity | `$N million/billion/trillion/k/M/B`, comma-grouped numbers, `N million/billion/trillion` | "200 million users", "$3.2 billion" |
| authority | "according to a [Name] study/report/survey/analysis/paper"; Forrester/Gartner/McKinsey/Pew/Nielsen/Statista/Deloitte/Edelman/MIT/Stanford/Harvard/Wharton + said/reports/found/noted | "a Stanford study found" |
| temporal | "in 19xx/20xx", "by 20xx" | "in 2025", "by 2030" |
| comparative | "Nx/N times more/less/faster/slower/higher/lower/better/worse", "twice/thrice/half as X" | "3x faster" |

### Citation markers (searched in ±200-char window around each claim)

1. Markdown link `[Source](https://…)` 2. HTML `<a href="https://…">` 3. Footnote `[1]` / `[^1]` 4. schema.org `"@type": "Citation"` block 5. Attribution form: "Source:", "Via:", "See also:", "Cited in/by", "According to/Per + ProperNoun". Standalone "see"/"per" excluded (false positives: "see growth", "per page").

**Pass/fail:** report `uncited_ratio = uncited/claims`; fail draft at **uncited_ratio > 0.4** (default threshold).

## 7. Content metrics

### Word count floors (topical coverage floors, NOT targets — Google confirms word count is not a ranking factor; a 500-word page that answers the query outranks a 2,000-word page that doesn't)

| Page type | Minimum words |
|-----------|---------------|
| Homepage | 500 |
| Service page | 800 |
| Blog post | 1,500 |
| Product page | 300+ (400+ complex products) |
| Location page | 500-600 |

### Readability & structure

- Flesch Reading Ease **60-70** for general audience — a quality proxy, **NOT a ranking factor** (John Mueller confirmed; Yoast deprioritized Flesch in v19.3). Target grade 8-10 reading level.
- Sentences avg **15-20 words**; paragraphs **2-4 sentences** (2-3 for web body copy); intro 50-100 words with hook + value prop + keyword.
- Logical H1→H2→H3 hierarchy, never skip levels; ToC for long-form; lists/tables where data is comparative.
- Featured snippets: paragraph **40-60 words** answer-first; list 5-8 numbered items; table for comparisons/specs.

### Linking

- Internal: **3-5 relevant internal links per 1,000 words**, descriptive varied anchors, no orphan pages; specify hub (links out to cluster) vs spoke (links to pillar).
- External: cite authoritative sources, reasonable count, open in new tab.

### Freshness

- Publication date visible; last-updated date if revised; flag content **> 12 months** without update on fast-moving topics.
- Stats **> 2 years** → update; examples **> 3 years** → replace; sync `dateModified` in schema.

### Analysis hygiene

Score E-E-A-T against boilerplate-stripped main content (trafilatura-extracted text), not raw HTML — nav chrome, footers, and cookie banners dilute trust-signal scoring. For SPAs, render with headless browser before extraction; flag pages with < 100 retrievable words as potentially JS-rendered/gated rather than guessing.

## 8. Keyword density & placement

### Primary keyword density (per Semrush/Ahrefs/Yoast published research)

| Density | Assessment |
|---------|-----------|
| < 0.5% | Under-optimised — likely missing from key locations |
| 0.5% - 2.0% | Optimal — natural reading, clear topic signal |
| 2.0% - 3.0% | Review required — may read unnaturally |
| > 3.0% | Keyword-stuffing risk — likely penalty trigger |

- 1,000-word article at 1-2% ≈ **10-20 total appearances** (headings + body + alt text).
- **Diminishing returns:** first 1-2 mentions carry most weight; prioritize placement quality over count.
- **Distribution:** spread evenly — never front-load the intro or cluster in one section.

### Required placements (all 6)

1. Title tag (near front) 2. H1 (near front) 3. URL slug (lowercase, hyphenated) 4. Meta description 5. First paragraph / first 100 words 6. ≥ 1 image alt text.

**NOT required in:** every H2/H3 (H1 coverage carries context; 1 H1 + 1-2 H2 mentions suffice), every paragraph, every internal-link anchor (vary anchors).

### Secondary & semantic keywords

| Type | Count | Usage |
|------|-------|-------|
| Closely related terms | 5-8 | Body + H2-H6 headings |
| Broader semantic terms | 10-15 | Related concepts, intent variations |
| Synonyms | as natural | Improve readability; do **NOT** count toward primary density ("web design" ≠ "website design" ≠ "site design" — only exact matches count) |

**Per-section brief guidance format:** "Use secondary keyword '[term]' in H2. Body: mention primary keyword once."

**5 common mistakes:** exact-match obsession (Google understands synonyms) · heading stuffing · ignoring first 100 words (highest-value placement after title/H1) · forgetting alt text (free placement + image search) · counting synonyms toward density.

## 9. Meta tag rules

| Tag | Rule |
|-----|------|
| Title | **50-60 chars** (never under 50, never over 60). Primary keyword first, brand last, pipe/dash matching site pattern. Lead with outcomes/numbers/specifics. |
| Meta description | **130-150 chars** (never under 130, never over 150). Active voice, USPs + specifics, end with CTA. No brand at end (already in title). **No quotes** — Google truncates at quotes. |
| URL | < 60 chars, hyphens, lowercase, keyword early, no stop words. |
| H1 | Exactly one per page, includes primary keyword. |

## 10. Content briefs

### Two modes

- **Improve mode** (existing URL): fetch page, mark "keep/strengthen" vs "add new" sections; never recommend full rewrite when targeted improvements win.
- **New page mode** (keyword only): use homepage/sitemap for business context; build outline from competitive gaps.

### Competitor analysis

- Top **5** ranking pages; filter excluded domains (§11) first; if < 3 real competitors remain, note the thin competitive landscape.
- Score each competitor: **Depth 1-10 + Formatting 1-10 + SEO 1-10 + UX 1-10 = X/40**.
- Three gap types: **topic gaps** (subtopics missed entirely) · **depth gaps** (covered but shallow) · **quality gaps** (outdated, no expert perspective, poor formatting).
- Gap priority: `Impact × Competitive Advantage / Effort`.
- Search intent: informational / commercial / transactional / navigational + identify SERP format rewarded (guide, listicle, comparison table, landing page, FAQ, video, local pack).

### Hard rules

1. **Website Relevance Rule:** every heading/keyword/FAQ suggested must be something the site can credibly deliver based on its actual services (read homepage + sitemap first). If not deliverable — remove.
2. **Site Structure Coverage Rule:** hub/category/"types of" briefs MUST reference every relevant existing sub-page (one section + internal link each), never invent categories, never omit existing ones. Non-hub pages: suggest internal links, don't force all categories in.
3. **Output language:** never name researchers, frameworks, or tools in output (no "Princeton GEO", "Clearscope", "Backlinko" etc.) — internal thinking tools only; write for a business owner.
4. **Information Gain (non-negotiable):** state EXACTLY what new value the piece adds that no ranking page provides — proprietary data, case studies with real outcomes, expert quotes, original synthesis. "More detail" or "better formatting" do not qualify.
5. **E-E-A-T requirements section:** list exact trust signals needed — author bio/credentials, expert quotes, cited studies with dates, last-updated date; critical for YMYL.

### Brief output structure (exact order)

Search Intent (3-4 lines) → Competitor table (# / URL / key H2s / est. words / score X/40 / main gap) → Content Gaps → Winning Outline (H1, slug, target word count vs competitor avg; per-section word counts, format notes, "FS target" markers, per-section keyword guidance) → Meta tags → Unique Angle & Information Gain → E-E-A-T Requirements → 3-5 internal link suggestions with anchors. **Outline-only mode** ("just an outline"): skip competitor table, gaps, information gain, E-E-A-T sections.

### Page-type templates (sections with format values → schema → keyword placement)

| Type | Key sections (format values) | Schema | Primary keyword |
|------|------------------------------|--------|-----------------|
| Service | Definition box 80-120 words; who-needs-it bullets; numbered how-it-works; cost table/range; outcomes with stats; 3-5 why-us bullets; FAQ 5-8 Q at 40-60 words each (FS targets); risk-reducing CTA | Service + FAQPage (+ LocalBusiness if local) | H1, first 100 words, one H2, slug, meta title |
| Blog post | Answer-first paragraph 40-60 words (FS target); context 1-2 paras; 3-5 H2 subtopics from PAA/gaps; numbered common-mistakes; FAQ 5 Q; contextual service CTA | Article + FAQPage | H1, first 100 words, slug, meta title, one alt text |
| Case study | Bold outcome stat in line 1; situation; challenge; approach step-by-step; result with figures/%/timelines; 3-5 takeaways; related-service CTA | Article | Outcome/matter type in H1 + title |
| Category | Scope overview; one H2/H3 per sub-page with link (**must cover every sitemap sub-page**); personas; numbered process; FAQ 5-8 Q; CTA | Service + BreadcrumbList + FAQPage | Category name: H1, title, URL, first para |
| Landing | Hero headline+sub+button; 2-3-sentence problem; 3-5 benefit bullets; social proof; 3-step how-it-works; 4-6 objections answered; repeated CTA | WebPage + FAQPage | Offer/outcome: H1, title, hero subheading |
| FAQ page | **8-15 questions** grouped by subtopic, each answered in **40-60 words** (each an FS target); CTA after last | FAQPage — but see retirement note below | H1 "[Topic]: Frequently Asked Questions" + first answer |
| Location | City overview; suburbs/jurisdictions/landmarks list; service-area map; local-expertise paras; local team bios (E-E-A-T); 2-3 location-mentioning reviews; 5 local FAQ; local phone/address CTA | Service + LocalBusiness (address, phone, geo) | "[Service] [City]": H1, title, URL, first para, LocalBusiness schema |
| About | Brand positioning 2-3 paras; founding story with date; team bios with credentials + photos; 3-5 values; awards with dates; media mentions | Organization + Person per member | Brand or "[Brand] [industry]" in H1 + title |
| Homepage | Hero value prop + CTA; services card grid linking to service pages; 3-5 USPs; social proof; service-area map/list; 4-6 broad FAQ (for GEO); repeated CTA | Organization + WebSite + Service | Primary service + city: H1, title, first para |

> **FAQ rich results retired for all sites 2026-05-07.** FAQPage markup no longer produces a SERP rich result; keep it only as a supporting signal for AI Mode / AI Overviews entity resolution. For genuine user Q&A pages use QAPage instead.

### Error handling

| Scenario | Action |
|----------|--------|
| Target URL unreachable | Report; never guess content |
| Paywalled (402/403/login) | Analyze visible portion (meta, headers) only, note limitation |
| < 100 words retrievable | Flag as JS-rendered/gated; ask for full text |
| No competitors after filtering | Broaden to partial-match; note thin landscape |
| Sitemap missing | Proceed; note internal-link suggestions incomplete |
| Page type / word count unspecified | Auto-detect from intent + SERP format / use competitor average; state assumption |

Optional data tools if available: DataForSEO (`serp_google_organic_live_advanced`, `kw_data_google_ads_search_volume`, `dataforseo_labs_bulk_keyword_difficulty`, `dataforseo_labs_search_intent`, `on_page_content_parsing_live`, `content_analysis_summary`) or Ahrefs MCP (`keywords-explorer-overview`, `serp-overview`, `site-explorer-organic-keywords`, `site-explorer-top-pages`).

## 11. Excluded competitor domains (SERP filtering)

Never score these as competitors even when they rank. Check every SERP URL against this list before the competitor table.

| Category | Domains |
|----------|---------|
| Encyclopedias/reference | wikipedia.org, britannica.com, investopedia.com, dictionary.com, merriam-webster.com, webmd.com, healthline.com, mayoclinic.org |
| Social | facebook, instagram, twitter/x, linkedin, pinterest, tiktok, youtube, reddit, quora, threads.net |
| Content platforms | medium, substack, blogger, wordpress.com, wix, squarespace, hubpages, tumblr |
| Search engines | google, bing, yahoo, duckduckgo, baidu |
| Marketplaces | amazon (all TLDs), ebay, etsy, shopify, alibaba, gumtree.com.au, kogan |
| Forums/Q&A | stackoverflow, stackexchange, whirlpool.net.au, superuser, serverfault |
| News/media | bbc, cnn, news.com.au, abc.net.au, theguardian, forbes, techcrunch, theverge, mashable, huffpost, nytimes, washingtonpost |
| Data/research | statista, ibisworld, similarweb |
| Directories/reviews | maps.google, tripadvisor, yelp, trustpilot, yellowpages.com.au, bark, thumbtack, angi, homeadvisor, truelocal.com.au, hotfrog.com.au, productreview.com.au |
| Comparison sites | finder.com.au, canstar.com.au, iselect.com.au, mozo.com.au, comparethemarket.com.au, cmsmarket.com |
| Job boards | seek.com.au, indeed, glassdoor, jora, linkedin.com/jobs |
| SEO tool pages | semrush, ahrefs, moz, neilpatel, backlinko, searchengineland, searchenginejournal, yoast, screamingfrog.co.uk, majestic |
| AI platforms | chat.openai.com, chatgpt.com, claude.ai, perplexity.ai, gemini.google.com, copilot.microsoft.com |
| Government / academic | any `.gov`, `.gov.au`, `.gov.uk`, `.gov.nz`, `.gc.ca` / any `.edu`, `.edu.au`, `.ac.uk`, `.ac.nz` |

**URL path exclusions** (even on valid domains): `/tag/`, `/tags/`, `/author/`, `/category/`, `/archive/`, `/feed/`, `/rss/`, `/wp-json/`, `/wp-admin/`, `/login`, `/signup`, `/register`, `/cart`, `/checkout`, `/terms`, `/privacy`, `/cookie-policy`, `/disclaimer`, `/sitemap`, `/robots.txt`.

## 12. AI citation readiness (content-side signals)

Full GEO platform rules live in the GEO reference; content-side essentials:

- **Google AI Mode** (Gemini 3.5 Flash since I/O May 2026, **1B+ monthly users**) shows **zero organic blue links** — citation is the only visibility. AI Mode and AI Overviews share only **~14% of cited URLs**: optimize for both surfaces separately.
- Per Google's AI optimization guide, "AEO"/"GEO" are rebranded SEO — AI Overviews and AI Mode use the same ranking/quality systems as classic Search.
- Content signals for citation: answer-first formatting; quotable statements with stats + attribution; first-party data (highly cited); H1→H2→H3 flow; tables/lists for comparative data; Article + Organization/Person schema for entity clarity; content clusters over isolated pages (topical authority).
- Track AI citation as a **standalone KPI** across Google AI Overviews, AI Mode, ChatGPT, Perplexity, Bing Copilot — not just rankings.

## Sources

- claude-seo (AgriciDaniel, MIT): `skills/seo-content/SKILL.md`, `skills/seo-content-brief/SKILL.md`, `skills/seo-content-brief/references/excluded-domains.md`, `skills/seo-content-brief/references/keyword-density.md`, `skills/seo-content-brief/references/page-type-templates.md`, `skills/seo/references/eeat-framework.md`, `agents/seo-content.md`, `scripts/content_quality.py`, `scripts/content_humanize.py`, `scripts/content_verify.py`
- Existing Factory skill: `consolidated-seo-geo/SKILL.md` (E-E-A-T correlation stats, featured-snippet formats, freshness rules — merged)
- AI-pattern and humanization catalogues derive from the Wikipedia "AI Cleanup" project (CC BY-SA 4.0) and ivankuznetsov/claude-seo (MIT).