# Sitemaps, Image SEO, Programmatic SEO & Strategic Planning

> Deep reference for XML sitemap analysis/generation, image SEO (files + metadata + SERP), programmatic-page safety gates, competitor comparison pages, and per-industry SEO strategy templates.

## 1. XML Sitemaps

### 1.1 Validation checks (analysis mode)
- Valid XML format (report parsing errors with line numbers).
- URL count **< 50,000 per file** (protocol limit) — split with a sitemap index beyond that.
- All URLs return **HTTP 200**.
- `<lastmod>` dates accurate — flag if **all identical**; must reflect the actual data/content update timestamp, NOT generation time.
- `<priority>` and `<changefreq>` are **ignored by Google** — safe to remove.
- Sitemap referenced in robots.txt.
- Compare crawled pages vs sitemap: report missing pages (in crawl, not in sitemap) and extra pages (in sitemap but 404/redirected).

Quality signals: sitemap index if >50k URLs; split by content type (pages, posts, images, videos); no non-canonical URLs; no noindexed URLs; no redirected URLs; HTTPS-only.

### 1.2 Issue severity table
| Issue | Severity | Fix |
|-------|----------|-----|
| Invalid XML | Critical | Fix syntax |
| >50k URLs in single file | Critical | Split with sitemap index |
| Non-200 URLs | High | Remove or fix broken URLs |
| Noindexed URLs included | High | Remove from sitemap |
| Redirected URLs included | Medium | Update to final URLs |
| All identical lastmod | Low | Use actual modification dates |
| priority/changefreq present | Info | Can remove (ignored by Google) |

### 1.3 Generation mode workflow
1. Identify business type (or auto-detect from existing site) → load industry template (§5).
2. Plan structure interactively.
3. Apply quality gates: **WARNING at 30+ location pages** (require 60%+ unique content per page); **HARD STOP at 50+ location pages** (require explicit user justification). Rationale: Google's doorway-page algorithm penalizes programmatic location pages with thin/duplicate content.
4. Generate valid XML; split at 50k URLs with sitemap index; document architecture in `STRUCTURE.md`.

If no sitemap found: check `/sitemap.xml`, `/sitemap_index.xml`, and robots.txt reference before reporting "not found". On rate limiting: back off, report partial results with retry timing.

### 1.4 Formats
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/page</loc><lastmod>2026-02-07</lastmod></url>
</urlset>
```
Sitemap index: same header with `<sitemapindex>` root and one `<sitemap><loc>…</loc><lastmod>…</lastmod></sitemap>` per child file (e.g. `sitemap-pages.xml`, `sitemap-posts.xml`).

## 2. Image SEO

### 2.1 Alt text
- Present on all `<img>` except decorative (`role="presentation"`).
- Descriptive of content, keywords only where natural, **10-125 characters**.
- Good: "Professional plumber repairing kitchen sink faucet". Bad: "image.jpg", "plumber plumbing plumber services" (stuffing), "Click here".

### 2.2 File size thresholds (tiered)
| Image category | Target | Warning | Critical |
|----------------|--------|---------|----------|
| Thumbnails | < 50KB | > 100KB | > 200KB |
| Content images | < 100KB | > 200KB | > 500KB |
| Hero/banner | < 200KB | > 300KB | > 700KB |

### 2.3 Formats
| Format | Browser support | Use case |
|--------|-----------------|----------|
| WebP | ~95.3-97% | Default recommendation |
| AVIF | ~92-93.8% | Best compression, newer |
| JPEG | 100% | Photo fallback |
| PNG | 100% | Graphics with transparency |
| SVG | 100% | Icons, logos, illustrations |

`<picture>` progressive-enhancement pattern (most efficient first):
```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Descriptive alt" width="800" height="600" loading="lazy" decoding="async">
</picture>
```
**JPEG XL**: November 2025 — Chromium team reversed its 2022 removal decision; Rust-based decoder, feature-complete but not yet in Chrome stable. Offers lossless JPEG recompression (~20% savings, zero quality loss). Not yet practical for web deployment; monitor.

### 2.4 Responsive, lazy loading, LCP attributes
- `srcset` + `sizes` matching layout breakpoints (e.g. 400w/800w/1200w variants).
- `loading="lazy"` on below-fold images ONLY. Lazy-loading the LCP/hero image directly harms LCP.
- `fetchpriority="high"` on the hero/LCP image.
- `decoding="async"` on non-LCP images (prevents decode blocking the main thread).
- CLS prevention: `width`+`height` attributes on every `<img>` (or CSS `aspect-ratio`); flag images without dimensions.

Lazy-loader classification (`lazy_method`, 5 values) — a JS-driven lazy-loader intentionally omits native `loading="lazy"`; that is NOT a regression:
| `lazy_method` | Signal | Common stack |
|---|---|---|
| `native` | `loading="lazy"` attribute | Plain HTML / modern browsers |
| `perfmatters` | `data-perfmatters-src/-srcset` or class `perfmatters-lazy` | WP + Perfmatters |
| `ewww` | `data-ewww-src`/`data-eio` or class `lazyload-eio` | WP + EWWW Image Optimizer |
| `js-generic` | `data-src`/`data-lazy-src`/`data-original`/`data-srcset` or class `lazyload`/`lazyloaded`/`lazy` | Lazysizes, vanilla-lazyload, jQuery |
| `none` | No signal | Not lazy-loading |

### 2.5 File names & CDN
- Descriptive hyphenated lowercase: `blue-running-shoes.webp`, not `IMG_1234.jpg`. No special characters. Include relevant keywords.
- Check CDN serving (different domain / CDN headers, edge caching); recommend CDN for image-heavy sites.

### 2.6 File optimization pipeline (conversion + metadata)
Tool preference order: `exiftool` (EXIF/IPTC/XMP) → `cwebp` (WebP) → ImageMagick `convert` → FFmpeg. Check availability first (`which exiftool cwebp convert ffmpeg`).
- WebP: `cwebp -q 82 -metadata all in.jpg -o out.webp` (fallback `convert in.jpg -quality 82 out.webp`).
- AVIF: `ffmpeg -i in.jpg -c:v libaom-av1 -crf 30 -still-picture 1 out.avif` (slower encode, best compression).
- Responsive variants: resize to 400w / 800w / 1200w at quality 82.
- Full pipeline per image: audit metadata → inject IPTC/XMP (Creator, Copyright, Description) → convert to WebP → generate variants → verify metadata preserved → emit `<picture>` AVIF > WebP > JPEG chain.

### 2.7 IPTC/XMP metadata
Google Images displays IPTC **Creator, Credit Line, Copyright** in results — **NOT a ranking factor**, display/attribution only. Key fields: `IPTC:ObjectName`, `Caption-Abstract`, `By-line`, `Credit`, `CopyrightNotice`, `Source` + XMP `Title/Description/Creator/Rights`. **WebP supports EXIF and XMP but NOT IPTC natively** — use XMP fields for WebP (exiftool converts automatically). Batch audit for missing creator: `exiftool -if 'not $IPTC:By-line' -filename *.jpg *.webp *.png`.

### 2.8 AI-generated images — DigitalSourceType (Merchant Center)
For product images produced by generative AI, **Google Merchant Center requires** IPTC `XMP-iptcExt:DigitalSourceType = trainedAlgorithmicMedia` (full URI `https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia`). Operational policy, not a ranking factor — feeds missing the label on AI imagery **can be disapproved**. Vocabulary:
- `trainedAlgorithmicMedia` — fully AI-generated (diffusion-model product imagery)
- `compositeSynthetic` — mix of captured + AI elements
- `digitalCapture` — fully captured photograph
AI-generated product **titles/descriptions** must also be separately labeled in the Merchant Center feed (feed layer, not page layer).

### 2.9 What matters for Google Images
| Factor | Impact | Where |
|--------|--------|-------|
| Alt text | CRITICAL (ranking) | `<img alt="">` |
| Filename | HIGH (ranking) | File system |
| Page context | HIGH (ranking) | Surrounding HTML |
| File size/speed | MEDIUM (indirect via CWV) | Compression + format |
| IPTC Creator/Copyright | LOW (display only) | File metadata |
| EXIF camera data | NONE | — |
| IPTC Keywords | NONE (Google ignores) | — |

### 2.10 Image SERP analysis (DataForSEO optional)
Fetch Google Images via `serp_google_images_live_advanced` (**depth=100**); report domain dominance (top 10 by position count), alt/title patterns of winners, format distribution (WebP/JPEG/PNG), and opportunity score (keywords with page rankings but no image presence). Skip silently if MCP unavailable.

## 3. Programmatic SEO Safety

### 3.1 Data source assessment
- Each record needs enough unique attributes to generate distinct content.
- Flag duplicate/near-duplicate records at **>80% field overlap**.
- Verify freshness — stale data → stale pages. Check row/record count, column uniqueness, missing values, API rate limits.

### 3.2 Template rules
- Each page must read as a standalone valuable resource; no "mad-libs" (city/product name swapped in identical text).
- Dynamic sections must add genuine information, not keyword variations.
- Plan variable injection points (title, H1, body, meta description, schema), static vs dynamic blocks, conditional sections, and supplementary content (related items, tips, UGC).

### 3.3 URL rules
Lowercase hyphenated slugs; logical hierarchy; unique slugs enforced at generation time; **URLs < 100 characters**; no query parameters for primary content; consistent trailing slash. Common patterns: `/tools/[tool]`, `/[city]/[service]`, `/integrations/[platform]`, `/glossary/[term]`, `/templates/[name]`.

### 3.4 Internal linking automation
Hub/spoke (category hubs → pages); auto-link **3-5 related pages** by shared attributes; BreadcrumbList schema from URL hierarchy; varied descriptive anchors (no exact-match repetition); density **3-5 internal links per 1000 words**.

### 3.5 Quality gates
| Metric | Threshold | Action |
|--------|-----------|--------|
| Pages without content review | 100+ | WARNING: content audit before publishing |
| Pages without justification | 500+ | HARD STOP: explicit user approval + thin-content audit |
| Unique content per page | <40% | Flag as thin content (penalty risk) |
| Unique content per page | <30% | Recommended HARD STOP (scaled content abuse risk) |
| Word count per page | <300 | Flag for review |
| Shared template boilerplate | >60% of page | Penalty risk |
| Location pages | 30+ / 50+ | WARNING (require 60%+ unique) / HARD STOP |

**Uniqueness formula**: unique % = (words unique to this page) / (total words on page) × 100, measured against all other pages in the programmatic set. Headers/footers/navigation excluded; template boilerplate INCLUDED.

### 3.6 Scaled Content Abuse enforcement timeline
| Date | Event |
|------|-------|
| March 2024 | Scaled Content Abuse policy introduced; Google later reported **45% reduction** in low-quality unoriginal content post-enforcement |
| November 2024 | Aggressive enforcement of **site reputation abuse** (programmatic content parked on high-authority domains not your own) |
| June 2025 | Wave of manual actions on sites with AI-generated content at scale |
| August 2025 | SpamBrain update: enhanced pattern detection for AI link schemes and content farms |

Enhanced gates: **≥30-40% genuinely unique** content between any two programmatic pages; human review of a **5-10% sample** before publishing; progressive rollout in **batches of 50-100 pages** with **2-4 weeks** of indexing/ranking monitoring before expanding — never 500+ pages simultaneously without quality review. Standalone value test: "Would this page be worth publishing even if no other similar page existed?"

### 3.7 Safe vs penalty-risk page types at scale
Safe: integration pages (real setup docs, API details, screenshots); template/tool pages (downloadable content + usage instructions); glossary pages (**200+ word** definitions with examples); product pages (unique specs, reviews); data-driven pages (unique stats/charts per record); user-profile pages (UGC).
Penalty risk: location pages with only city swapped; "Best [tool] for [industry]" without industry-specific value; "[Competitor] alternative" without real comparison data; unreviewed AI-generated pages.

### 3.8 Canonicals, sitemap, index bloat
- Every programmatic page: self-referencing canonical. Parameter variations (sort/filter/pagination) → canonical to base URL. Paginated series → canonical to page 1. Programmatic vs manual overlap → manual page is canonical. Never cross-domain canonical unless intentional.
- Sitemap: auto-generate entries; split at 50k; `<lastmod>` = data update timestamp; exclude noindexed pages; register in robots.txt; update dynamically with the data source.
- Index bloat: noindex pages failing gates; noindex pagination beyond page 1; noindex faceted views (canonical to base category); monitor Search Console crawl stats for sites **>10k programmatic pages**; merge thin records into aggregated pages; **monthly** indexed-vs-intended count audit.
- Audit output: Programmatic SEO Score /100 across 6 categories (data quality, template uniqueness, URL structure, internal linking, thin-content risk, index management), issues bucketed Critical / High (1 week) / Medium (1 month) / Low.

## 4. Competitor Comparison & Alternatives Pages

Comparison pages convert at **4-7%** vs **0.5-1.8%** for standard blog content; 35.8% of marketers report comparison content performing "better than ever" (Intergrowth survey, November 2025).

### 4.1 Page types & keyword patterns
| Type | Target keyword | Volume signal |
|------|----------------|---------------|
| X vs Y head-to-head | `[A] vs [B]` | High |
| Alternatives list | `[A] alternatives`, `[A] alternatives [year]` | High |
| Category roundup | `best [category] tools [year]` | High |
| Comparison table/matrix | `[category] comparison` | — |
| Use-case variant | `[A] vs [B] for [use case]` | Medium |
| Review | `[A] review [year]` | Medium |
| Pricing comparison | `[A] vs [B] pricing` | Medium |
| Question form | `is [A] better than [B]` | Medium |

Title formulas: X vs Y → `[A] vs [B]: [Key Differentiator] ([Year])`; alternatives → `[N] Best [A] Alternatives in [Year] (Free & Paid)`; roundup → `[N] Best [Category] Tools in [Year], Compared & Ranked`. H1 matches title intent, primary keyword natural, **< 70 characters**. Minimum content: **1,500 words**.

### 4.2 Feature matrix & data accuracy
Feature matrix columns = Your Product / Competitor A / Competitor B with ✅/⚠️ Partial/❌ + pricing-from row + free-tier row. Rules: all claims verifiable from public sources; pricing current with **"as of [date]"** note; **quarterly review** or on major competitor releases; link to source per data point; missing data = "Not publicly available", never guessed.

### 4.3 Schema
- **Product + AggregateRating** (ratingValue, reviewCount, bestRating 5, worstRating 1).
- **SoftwareApplication** for software (applicationCategory, operatingSystem, Offer price/currency).
- **ItemList** for roundups (itemListOrder Descending, numberOfItems, positioned ListItems).
- FAQ content for common comparison questions: **FAQPage rich results retired May 2026**, but the markup still aids AI search and entity signals.

### 4.4 Conversion & trust layout
CTAs: above fold (summary + primary CTA), after comparison table ("Try X free"), bottom (final recommendation). No aggressive CTAs inside competitor description sections (kills trust). Social proof: testimonials tied to comparison criteria, G2/Capterra/TrustPilot ratings with source links, "Switched from [Competitor]" case studies. Pricing: highlight value not just lowest price; include hidden costs (setup fees, per-user, overage). Trust signals: "Last updated [date]", expert author, methodology disclosure, own-product affiliation disclosure.

### 4.5 Fairness & legal
Verifiable claims only; no defamation/false claims; cite sources; balanced presentation (acknowledge competitor strengths); disclose which product is yours; nominative fair use generally permits competitor brand mentions but do NOT imply endorsement/affiliation; trademark law varies by jurisdiction.

### 4.6 Internal linking
Link to own product/feature pages from comparison sections; cross-link related comparisons ("A vs B" ↔ "A vs C"); breadcrumb Home > Comparisons > Page; related-comparisons section at bottom; link cited case studies.

## 5. Strategic SEO Planning (per industry)

### 5.1 Process (6 steps) & roadmap (4 phases)
Discovery (business type, audience, competitors, KPIs, budget) → competitive analysis (top 5 competitors: content strategy, schema, technical, E-E-A-T, DA estimate, keyword gaps) → architecture design (industry template + URL hierarchy + quality gates) → content strategy (gaps, page counts, cadence, E-E-A-T plan, calendar) → technical foundation (schema per page type, CWV targets, AI-search readiness, mobile-first) → roadmap:
| Phase | Window | Focus |
|-------|--------|-------|
| 1 Foundation | weeks 1-4 | Technical setup, core pages, essential schema, analytics |
| 2 Expansion | weeks 5-12 | Primary content, blog launch (2-4 posts/month), internal linking, local SEO |
| 3 Scale | weeks 13-24 | Advanced content, link building, GEO optimization, performance |
| 4 Authority | months 7-12 | Thought leadership, PR/media, advanced schema, continuous optimization |

Deliverables: SEO-STRATEGY, COMPETITOR-ANALYSIS, CONTENT-CALENDAR, IMPLEMENTATION-ROADMAP, SITE-STRUCTURE. KPI table with baseline / 3-month / 6-month / 12-month targets for organic traffic, rankings, DA, indexed pages, CWV. Six templates: saas, local-service, ecommerce, publisher, agency, generic (fallback = generic).

### 5.2 SaaS template
Architecture: `/product` (features, integrations, security), `/solutions` (by-industry, by-use-case), `/pricing`, `/customers` (case-studies, testimonials), `/resources` (blog, guides, webinars, templates, glossary), `/docs` + `/api`, `/company`, `/compare/vs-*`. Priorities: homepage, features, pricing, key integrations, top 3-5 use cases → then feature pages, industry solutions, 2-3 case studies, comparison pages. Funnel: BOFU comparison guides/ROI calculators; MOFU how-tos; TOFU trends. Schema: Homepage Organization+WebSite+SoftwareApplication; Product/Pricing SoftwareApplication+Offer; Blog Article/BlogPosting; Case studies Article+Organization(customer); Docs TechArticle. Metrics: organic to pricing, demo/trial signups, blog→pricing conversion, comparison rankings, integration page performance. Comparison URL patterns: `/{product}-vs-{competitor}`, `/{competitor}-alternative`, `/compare/{category}`, `/best-{category}-tools`. GEO: parseable feature comparisons, complete SoftwareApplication schema, original benchmarks/ROI data, pricing in extractable tables, monitor AI citation (AIO/ChatGPT/Perplexity).

### 5.3 Local-service template
Architecture: `/services/*`, `/locations/[city]/[service-city]`, `/reviews`, `/gallery`, `/emergency`, `/faq`. Quality gates: WARNING 30+ / HARD STOP 50+ location pages, plus:
| Page type | Min words | Unique % |
|-----------|-----------|----------|
| Primary location | 600 | 60%+ |
| Service area | 500 | 40%+ |
| Service page | 800 | 100% |
Location-page uniqueness sources: local landmarks/neighborhoods, location-specific services, local team, local testimonials, community involvement, local regulations. Schema: LocalBusiness with full address, telephone, openingHours, geo lat/long, areaServed, priceRange; AggregateRating on reviews page.

**Google Business Profile 2025-2026**: video verification now standard (postcard largely phased out); WhatsApp integration replaced Google Business Chat (deprecated); Q&A removed from Maps (replaced by AI-generated answers — GBP description/services/site FAQ feed them); **"business is open at time of search" ranked a top-5 individual ranking factor for the first time** (Whitespark 2026 Local Search Ranking Factors); review snippets shown in swipeable Stories format on mobile — encourage detailed reviews with photos.
**SAB update (June 2025)**: entire states/countries disallowed as service areas — specify cities, postal/ZIP codes, or neighborhoods; for a metro, list major cities.
**AI visibility**: AI Overviews appear for only **~0.14% of local keywords** (March 2025) — local faces less AI disruption; but ChatGPT/Perplexity increasingly recommend local businesses. **#1 AI visibility factor = presence on expert-curated "best of" lists** (Whitespark 2026); plus NAP consistency across Google/Yelp/Apple Maps, genuine review volume/quality, complete LocalBusiness schema, original photos. Metrics: local pack rankings, organic phone calls, direction requests, GBP insights, review count/rating.

### 5.4 Agency/consultancy template
Architecture: `/services/*/sub-service`, `/industries/*`, `/work` (case studies), `/about/team/[member]`, `/insights` (articles, guides, webinars, podcasts), `/process`, `/faq`. Schema: ProfessionalService (+hasOfferCatalog of Services), Service pages Service+ProfessionalService, case studies Article+Organization(client), team Person+ProfilePage. E-E-A-T requirements — team pages: headshots, credentialed bios, industry experience, speaking engagements, publications, social profiles; case studies: client/industry, challenge, methodology, **results with specific metrics**, timeline, testimonial. Minimum word counts: service pages **800**, industry pages **800**, case studies **1,000**. GEO: Person schema with sameAs for all team members (entity authority), ProfilePage schema, original industry research/surveys, quotable expertise statements, consistent agency entity info across directories.

### 5.5 Generic template (universal baseline)
Every page: unique title **30-60 chars**, unique meta description **120-160 chars**, single H1, strict H1→H2→H3 hierarchy, internal links, clear CTA. Minimum word counts: homepage **500**, product/service **800**, blog post **1,500**, about **400**, landing page **600**. Schema: Homepage Organization+WebSite; About AboutPage; Contact ContactPage; Blog Article/BlogPosting; FAQ → **QAPage for genuine Q&A; FAQPage no longer yields rich results (retired May 2026) but still aids AI citation**; Product/Service schema. Technical must-haves: HTTPS, mobile-responsive, robots.txt, XML sitemap submitted, GSC verified, CWV passing (LCP < 2.5s, INP < 200ms, CLS < 0.1). Should-haves: structured data on key pages, internal linking strategy, optimized 404, zero redirect chains, WebP + lazy loading. GEO checklist: quotable facts/stats, schema, topical clusters, original data, consistent entity info, clear headings/definitions/step formats, optional `llms.txt` at root (**emerging convention — Google treats it as a regular text file**, no special handling), monitor AI citation across AIO/ChatGPT/Perplexity/Bing Copilot. Customize by: B2B/B2C/D2C, geographic scope, product-vs-content weight, competition level, resources.

### 5.6 DataForSEO integration (optional)
When available: `dataforseo_labs_google_competitors_domain` + `dataforseo_labs_google_domain_intersection` (competitive intelligence), `dataforseo_labs_bulk_traffic_estimation` (traffic), `kw_data_google_ads_search_volume` + `dataforseo_labs_bulk_keyword_difficulty` (keyword research), `business_data_business_listings_search` (local listings). Degrade gracefully if absent.

## Sources
- claude-seo (AgriciDaniel, MIT): `skills/seo-sitemap/SKILL.md`, `skills/seo-images/SKILL.md`, `skills/seo-programmatic/SKILL.md`, `skills/seo-competitor-pages/SKILL.md`, `skills/seo-plan/SKILL.md`, `skills/seo-plan/assets/{saas,local-service,agency,generic}.md`, `agents/seo-sitemap.md`
- Existing `consolidated-seo-geo` Factory skill (sitemap/schema/content overlap merged; scoring formulas, CWV, crawler tiers remain in the router skill)

## Addenda — completeness pass

### skills/seo-plan/assets/ecommerce.md
E-commerce strategy template (2 of 6 seo-plan verticals were missed): full site architecture tree (/collections /products /brands /sale /gift-guide /blog/buying-guides); schema per page type (Product+Offer+AggregateRating+Review+BreadcrumbList; CollectionPage+ItemList); Merchant Center free listings require Product schema in INITIAL SERVER-RENDERED HTML (not JS-injected — Dec 2025 Google JS SEO guidance) with name/image/price/priceCurrency/availability; min 400 words on product AND category pages, unique descriptions (not manufacturer copy); faceted nav: noindex filter combinations, keep popular filters indexable; variants: single URL or canonical to parent; GEO checklist: structured specs/dimensions/materials, ProductGroup, consistent entity data across site/Amazon/Merchant Center, AI-parseable comparison tables.

### skills/seo-plan/assets/publisher.md
Publisher/media strategy template: NewsArticle schema example (headline, datePublished/dateModified, author Person with URL, publisher Organization+logo); author pages must include photo, credentials, sameAs, article archive; editorial standards (correction policy, fact-checking, COI disclosure); DATED FACTS: Google News inclusion fully automatic since March 2025 (no manual applications); KPI shift — traffic KPIs declining due to AI Overviews, leading publishers track subscriber conversions, scroll depth, AI citation frequency as standalone KPI; site reputation abuse = high risk for third-party content (Forbes/WSJ/Time/CNN penalized late 2024); consider dropping AMP (not required for Top Stories); ads placement affects CLS.
