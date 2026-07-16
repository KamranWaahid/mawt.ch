# E-commerce SEO

> Deep reference for merchant listing schema, ProductGroup variants, UCP agent commerce, IPTC AI-image labeling, parasite-SEO risk, and marketplace intelligence — every rule with its exact threshold, date, or weight.

## 1. Merchant Listing Schema — required fields

Google's 2025 Product structured-data docs define four property groups that gate merchant-listing eligibility beyond what the Rich Results Test catches (RRT catches structural errors; these are **policy** errors — fields that parse fine but disqualify the product from the rich feature).

### Base Product (required — missing = High severity)

| Level | Required fields |
|---|---|
| Product | `name`, `image` (array, >= 1 high-res URL), `description`, `offers`, `brand.name` |
| Offer | `price`, `priceCurrency`, `availability`, `url`, `seller.name` |
| MerchantReturnPolicy | `applicableCountry`, `returnPolicyCategory` (missing sub-field = Medium) |
| OfferShippingDetails | `shippingDestination`, `deliveryTime` (missing sub-field = Medium) |

### Merchant-listing gate properties

| Property | Severity if missing | Rule |
|---|---|---|
| `hasMerchantReturnPolicy` (on Product or Offer) | **High** | REQUIRED for Google merchant listing eligibility |
| `shippingDetails` (OfferShippingDetails: rate, handling time, transit time) | **High** | REQUIRED for merchant listing eligibility |
| `hasMemberProgram` / `UnitPriceSpecification.validForMemberTier` | Medium | Needed for loyalty-pricing visibility in Google Shopping |
| `energyEfficiencyClass` | **High (EU mode only)** | REQUIRED in the EU for in-scope categories under EPREL |
| `hasCertification` (Certification type) | Recommended | Replaced `EnergyConsumptionDetails` **April 2025** (Energy Star, safety, organic) |

### Validation rules (exact)

1. `price` = number string `"29.99"`, never `"$29.99"` (no currency symbol)
2. `availability` = full Schema.org URL enum (`https://schema.org/InStock`)
3. `priceCurrency` = ISO 4217 (USD, EUR, GBP)
4. `brand.name` must not be empty or `"N/A"`
5. `priceValidUntil` = ISO 8601 date
6. If `aggregateRating` present: `ratingValue` AND `reviewCount` both required
7. JSON-LD must be in the **initial server-rendered HTML**, not JS-injected (Google JS SEO guidance, December 2025) — Shopify/Magento PWA/headless Next.js overwhelmingly inject schema client-side; render with JS and diff raw vs rendered HTML to confirm
8. Free Merchant Center listings minimum: `name`, `image`, `price`, `priceCurrency`, `availability` server-rendered

### Schema completeness score

| Completeness | Score |
|---|---|
| All required fields | 50/100 |
| + `aggregateRating` | 65/100 |
| + `sku`/`gtin13`/`gtin14`/`mpn` | 75/100 |
| + `shippingDetails` | 85/100 |
| + `hasMerchantReturnPolicy` | 90/100 |
| + reviews (3+) | 100/100 |

### Deprecated rich-result types (generating them = Critical)

| @type | Status |
|---|---|
| Vehicle / VehicleListing | Rich result retired **June 2025** |
| ClaimReview | Retired **June 2025** |
| EstimatedSalary | Retired **June 2025** |
| LearningVideo | Retired **June 2025** |
| Course | Course rich result still live; **Course Info carousel** variant retired June 2025 — verify which use-case applies |
| SpecialAnnouncement | Deprecated **July 2025** |
| FAQPage | FAQ rich results retired for ALL sites **2026-05-07** (supersedes Aug 2023 gov/health restriction). Flag at Info, not Critical — markup still aids AI Mode / AI Overviews entity resolution. Genuine user Q&A → use `QAPage` |

## 2. ProductGroup — variants

Use for products with size/color variants. Google increasingly **enforces this for apparel** (absence = Info finding today).

```json
{
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  "name": "Product Name",
  "description": "Product group description",
  "productGroupID": "product-group-id",
  "variesBy": ["https://schema.org/size", "https://schema.org/color"],
  "hasVariant": [{
    "@type": "Product",
    "name": "Variant - Red, Large",
    "sku": "SKU-001", "color": "Red", "size": "Large",
    "offers": { "@type": "Offer", "price": "29.99", "priceCurrency": "USD",
                "availability": "https://schema.org/InStock" }
  }]
}
```

Variant URL strategy: single URL for parent with variants, OR separate URLs with canonical to parent — structured data for ALL variants either way. Never duplicate H1 across product variants.

## 3. Product page on-page rules (concrete values)

| Element | Rule |
|---|---|
| Title | primary keyword + brand, **< 60 chars**, format `[Product] - [Key Feature] \| [Brand]` |
| Meta description | keyword + benefit + price ("from $XX") + CTA, **< 155 chars** |
| H1 | single, matches product name |
| H2s | Features, Specifications, Reviews, Related Products |
| Images | alt = product name + distinguishing feature; descriptive filenames; WebP + JPEG fallback; **>= 3 images** (hero/detail/lifestyle); **>= 800px** for Google Shopping eligibility; lazy-load below-fold only |
| Description | unique (never manufacturer copy-paste), **>= 200 words** body (strategy template: min 400 words product page, min 400 words category page); specs as table, not prose |
| Internal linking | breadcrumb Home > Category > Subcategory > Product; related products; keyword-rich anchor to category |
| Faceted nav | noindex duplicate filter combinations; keep popular filters indexable; canonical to main category page |

### Page score weights

| Category | Weight |
|---|---|
| Schema completeness | 25% |
| Image optimization | 20% |
| Content quality | 20% |
| Title & meta | 15% |
| Internal linking | 10% |
| Technical (speed, mobile, canonical) | 10% |

Analysis priority order: 1 schema completeness → 2 image optimization → 3 pricing competitiveness vs marketplace medians → 4 content uniqueness → 5 internal linking. LCP on the hero image is the CWV pressure point for product pages.

## 4. IPTC AI-image labeling (Merchant Center policy)

Google Merchant Center **requires** AI-generated product images to carry IPTC `DigitalSourceType: TrainedAlgorithmicMedia`. Operational policy, **not a ranking factor** — feeds missing the label on AI imagery can be **disapproved**.

### IPTC DigitalSourceType vocabulary

| Value | Use for | URI |
|---|---|---|
| `trainedAlgorithmicMedia` | Fully AI-generated (diffusion-model product imagery) | `https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia` |
| `compositeSynthetic` | Captured + AI-generated mix | `.../compositeSynthetic` |
| `digitalCapture` | Fully captured photo, no AI | `.../digitalCapture` |
| `negativeFilm` / `positiveFilm` | Film scans | `.../negativeFilm`, `.../positiveFilm` |

### Operations (exiftool)

```bash
# Inject
exiftool -XMP-iptcExt:DigitalSourceType="https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia" img.jpg
# Audit: find unlabeled images
exiftool -if 'not $XMP-iptcExt:DigitalSourceType' -filename -DigitalSourceType *.jpg *.webp *.png
```

- Field lives in **XMP-iptcExt** namespace; values may return as bare name or full URI — normalize to bare name when auditing.
- **WebP supports EXIF and XMP but NOT native IPTC** — use XMP fields for WebP (exiftool converts automatically).
- Audit scope extensions: `.jpg .jpeg .png .webp .tif .tiff`; count per directory: missing / trainedAlgorithmicMedia / compositeSynthetic / digitalCapture / other.
- **AI-generated product titles/descriptions** must ALSO be separately specified and labeled in the Merchant Center feed — enforced at the **feed layer**, not the page layer.
- When optimizing AI-generated assets, prompt the user to confirm source type before injecting.

## 5. UCP — Universal Commerce Protocol

Google-led open standard (co-developed with Shopify; endorsed by Etsy, Target, Walmart, Wayfair; payment partners Stripe, Visa, Mastercard, Adyen, Amex). Purpose: AI agents discover, negotiate, and transact with merchants without one-off integrations. Already powers direct buying from **AI Mode in Search and Gemini**. Third leg of agent-era discovery next to Merchant Center feeds and Google Business Profile.

| Is | Is NOT |
|---|---|
| Capability-declaration + negotiation protocol | A new payment processor |
| Transport-agnostic (REST, MCP, A2A) | A replacement for Merchant Center feeds |
| Pairs with AP2 (Agent Payments Protocol) for cryptographic user-consent proof on autonomous purchases | A way to skip being merchant of record |
| Consumed by AI Mode + Gemini today | A ranking factor (Google has not framed it that way) |

Merchants stay **Merchant of Record** — they keep customer relationships and post-purchase ownership.

### Profile declaration

Publish JSON at **`/.well-known/ucp`**: `version` + `capabilities[]` (`id`, `version`, `endpoint`) + `merchant` (`name`, Merchant Center `id`). Capability ID pattern: `dev.ucp.<domain>.<verb>` with semver.

| Capability | Purpose |
|---|---|
| `dev.ucp.shopping.checkout` | Initiate checkout, return totals + payment intent |
| `dev.ucp.shopping.fulfillment` | Quote shipping options and delivery windows |
| `dev.ucp.shopping.discount` | Apply promo/loyalty discounts at quote time |
| `dev.ucp.shopping.cart` | Add/remove/update items in agent-managed carts |

### UCP audit (4 checks)

1. **Presence** — `/.well-known/ucp` resolves to valid JSON
2. **Capability coverage** — missing checkout/fulfillment/discount = **opportunity, not failure** (adoption early)
3. **Endpoint reachability** — HTTPS, valid TLS, no 5xx (probe with HEAD; report SSRF-blocked endpoints explicitly)
4. **Version coherence** — flag pre-release/unrecognized protocol versions

Relationships: Merchant Center feed = **required upstream** (UCP capabilities reference Merchant Center product IDs); Product schema `hasMerchantReturnPolicy`/`shippingDetails` = same data at page layer, UCP = API layer; GBP = independent (store/location vs product/order).

Audit posture: **Tier 1** (already on Merchant Center) → recommend declaring a UCP profile; **Tier 2** (DTC not on Merchant Center) → do NOT recommend yet, Merchant Center is prerequisite; **Tier 3** (informational/B2B) → ignore. Never score UCP absence as a failure. Merchant with clean feeds + complete Product schema + checkout API can declare a profile in one sprint.

Spec last verified **2026-05-18**; standard moving. Re-check when: canonical spec URL stabilizes, AP2 reaches stable release, platforms beyond AI Mode + Gemini announce consumption.

## 6. Parasite-SEO risk (site-reputation abuse)

Google's **2024-11-19** policy clarification: "no amount of first-party involvement alters the third-party nature" of a section. Section-level manual actions hit **Forbes Advisor, CNN Underscored, WSJ Buy Side within hours** of the clarification. Any audit of an established editorial domain must surface this pattern as **Critical**. Operational unit = the **subfolder/section**, never the whole site.

### Detection signals & exact thresholds (per subfolder, averaged per page)

| Signal | Patterns counted | Threshold → flag |
|---|---|---|
| Third-party authorship density | "Partner Content", "Sponsored Content", "Sponsored by", "Brand Studio", "In Partnership With", "Advertisement", "Advertorial", "Paid Post", "Promoted", "Paid Content" | **>= 1.0 hits/page** → `third-party-authorship-density` |
| Commercial-intent skew | "Buy Now", "Shop Now", "Add to Cart", "Compare Prices", "Best X Deals", "Promo Code", "Coupon", "Discount Code", "Affiliate Disclosure" | **>= 2.0 hits/page** → `commercial-intent-skew` |
| Affiliate-link density | URL params `tag=`, `aff_id=`, `affid=`, `partnerid=`, `ref_=`, `utm_source=`, `utm_campaign=` | **>= 3.0 hits/page** → `affiliate-density` |
| Cross-section drift | Section commerce rate **> 2x the site mean** commerce rate | → `commercial-intent-drift` (raises low→medium even below absolute threshold) |

### Risk labels

| Condition | Risk |
|---|---|
| `third-party-authorship-density` flag | **high** |
| `commercial-intent-skew` AND `affiliate-density` | **high** |
| Any single other flag | medium |
| No flags | low |

Site overall = high if any section is high. Output is **advisory** — contractual relationships can't be determined from HTML; it identifies the patterns Google's policy targets. Input: sampled sitemap URLs from one host; section key = first path segment.

## 7. Marketplace intelligence (DataForSEO Merchant API)

### Endpoints & costs

| Endpoint | Cost | Notes |
|---|---|---|
| `merchant_google_products_search` | **$0.02/call** | Google Shopping listings |
| `merchant_google_sellers_search` | **$0.02/call** | Per-seller ratings/prices |
| `merchant_amazon_products_search` | **$0.02/call** | In `warn_endpoints` — ALWAYS requires user approval |

- **Cost guardrail is MANDATORY**: check budget status before EVERY call (`approved` → proceed; `needs_approval` → show cost, ask user; `blocked` → stop, offer free-only analysis) and log actual cost after each call.
- Task/poll queue pattern (POST task → poll → GET results) saves **60-80% vs live endpoints**; poll with exponential backoff **2s, 4s, 8s, max 60s**.
- Rate limits: **2,000 tasks/min** across endpoints, **30,000 tasks/day** standard plans; on HTTP 429 wait **60s** then retry.
- Key params: `keyword` (required), `location_code` default **2840 (US)**, `language_code` default `en`, `depth` default **100**, `sort_by` (relevance / price_low_to_high / price_high_to_low / rating; Amazon: avg_customer_review), `price_min`/`price_max` (Google only).
- Amazon-specific response fields: `asin`, `is_prime`, `is_best_seller`.
- Normalize: price → float (strip `$`), currency → ISO 4217, availability → enum `in_stock|out_of_stock|preorder|unknown`, rating → float 1 decimal, reviews → int. Currency-normalize to USD (or user-specified) before comparing.

### Analysis outputs

- **Pricing**: distribution min/max/median/P25/P75; outliers = **> 2 standard deviations from median**; price-to-rating correlation.
- **Sellers**: top 10 by listing count, rating distribution, free-shipping prevalence, new vs established.
- **Cross-marketplace report** (Google vs Amazon): avg price, median rating, avg review count, top-seller share %, free-shipping %.
- Always label data source in reports: "DataForSEO Merchant (live)" vs "On-page analysis (static)". Priorities: Critical > High > Medium > Low; scores as XX/100.

### Keyword gaps (organic vs Shopping)

| Gap type | Meaning | Action |
|---|---|---|
| Organic only | Ranks organically, no Shopping presence | Create Merchant Center feed, bid these keywords |
| Shopping only | Shopping visibility, weak/no organic | Create buying guides / comparison pages |
| Both present | Visible in both | Ensure price consistency, enhance schema |
| Neither | No visibility | Low priority unless high volume |

Method: pull organic ranked keywords for the domain, query Merchant API for the top organic keywords, cross-reference. Report each gap with position/rank, volume, CPC, recommended action.

## 8. E-commerce detection & rendering

- E-commerce signals to auto-detect during audits: Product schema, price elements, add-to-cart buttons, cart, product grids, Shopify/WooCommerce/Magento markers. If URL is category/homepage rather than product, adjust scope instead of failing.
- Prefer forced JS rendering for product-page audits and **compare pre-JS vs post-JS HTML** to confirm the JSON-LD is server-rendered (client-side-injected Product schema = delayed processing per Dec 2025 guidance; AI crawlers don't execute JS at all).
- GEO for e-commerce: structured specs (dimensions, materials) in tables; ProductGroup for variants; original photography with descriptive alt; genuine review content with AggregateRating; consistent product entity data across site + Amazon + Merchant Center; comparison feature tables AI can parse; product FAQ content (as QAPage/content, not FAQPage rich-result expectation).
- Site architecture template: `/collections/[category]/[subcategory]`, `/products/[product]`, `/brands/`, `/sale`, `/new-arrivals`, `/best-sellers`, `/blog/buying-guides|how-to|trends`, `/shipping`, `/returns`, `/faq`. Schema per page type: Product page = Product + Offer + AggregateRating + Review + BreadcrumbList; Category = CollectionPage + ItemList + BreadcrumbList; Brand = Brand + Organization.
- KPIs: organic revenue, product + category rankings, rich-result CTR, AOV from organic.

## Sources

- claude-seo (AgriciDaniel, MIT): `skills/seo-ecommerce/SKILL.md`, `skills/seo-ecommerce/references/marketplace-endpoints.md`, `skills/seo-ecommerce/references/ucp-universal-commerce-protocol.md`, `agents/seo-ecommerce.md`, `scripts/iptc_ai_label.py`, `scripts/parasite_risk.py`, `scripts/schema_ecommerce_validate.py`, `skills/seo-plan/assets/ecommerce.md`, `skills/seo-images/SKILL.md` (IPTC section), `skills/seo-schema/SKILL.md` (deprecations), `schema/templates.json` (ProductGroup)
- Existing `consolidated-seo-geo` SKILL.md (SSR/JS-rendering and schema-server-rendered rules merged)
