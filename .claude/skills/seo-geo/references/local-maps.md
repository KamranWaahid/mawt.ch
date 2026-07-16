# Local SEO & Maps Intelligence

> GBP signals, NAP consistency, review intelligence, citation tiers, local schema, geo-grid rank tracking, and doorway-page thresholds — every rule with its number, date, or weight (source data current to March 2026).

## Evidence key
**Confirmed** = Google docs/employee statement. **Study** = data-driven research (Whitespark, Sterling Sky, BrightLocal, Search Atlas, Seer, Ahrefs). **Consensus** = practitioner agreement, no controlled test.

## Local landscape — key statistics

| Metric | Value | Source |
|---|---|---|
| Google searches seeking local info | 46% | Industry data |
| Mobile "near me" searches → visit within 24h | 76% | Google (Confirmed) |
| "Near me" search growth over 2 years | +900% | Google |
| Zero-click rate for local-intent mobile searches | up to 78% | Similarweb |
| Local pack ads (tracked mobile keywords, Jan 2025→Jan 2026) | 1% → 22% | Sterling Sky/Places Scout |
| Local pack size | 3 results (standard); AI-powered packs (mobile US) show only 1-2 (32% fewer) | Sterling Sky |
| Curated Local Lists (Local Gems, Trending, Top List) | appear ~position 4 | SOCi, Nov 2025 |
| ChatGPT/AI used for local recommendations | 45% of users (up from 6%) | BrightLocal LCRS 2026 |
| ChatGPT local conversion rate vs Google organic | 15.9% vs 1.76% | Seer Interactive |
| ChatGPT traffic share vs Google for local | ~2% | Sterling Sky, Feb 2026 |
| AI Overviews on local searches | up to 68% | Whitespark Q2 2025 |
| AI Overview CTR reduction for position 1 | -58% | Ahrefs, Feb 2026 |
| Brand cited in AIO → organic CTR boost | +35% | Seer Interactive |

## Ranking factor weights

### Whitespark 2026 Local Search Ranking Factors (published Nov 6, 2025; 47 experts, 187 factors)

| Factor group (Local Pack/Maps) | Weight | Trend |
|---|---|---|
| GBP Signals | **32%** | Stable, top group |
| Review Signals | **~20%** | Up from ~16% (2023) |
| On-Page Signals | ~15-19% | Slight decline |
| Link Signals | Declining | Multi-year drop; still **~26% of local ORGANIC** (#2 group) |
| Behavioral/Engagement | Rising | Clicks, calls, direction requests |
| Citation Signals | Lower for Pack | But 3 of top 5 AI visibility factors are citation-related |
| Social Signals / AI Search Signals | New | First time measured |

Top individual pack factors: 1. Primary GBP category (score **193**) · 2. Keywords in GBP business title (**181**) · 3. Proximity to search point (**176**) · 4. Verified GBP · 5. Business open at time of search (Sterling Sky controlled study) · 6. High ratings · 7. Native Google review quantity · 8. Additional categories · 9. Review recency/velocity · 10. Dedicated service pages · 11. Domain authority · 12. NAP consistency · 13. Spam listing removal · 14. Quality backlinks · 15. Review sentiment.

Top negative factors: **incorrect primary category (176)** = single worst mistake; duplicate profiles at same address (142).

### Search Atlas ML study (Aug 2025, XGBoost, explains 92-93% of variance)

| Factor | Variance explained |
|---|---|
| Proximity | **55.2%** (outside operator control — note in reports) |
| Review count | **19.2%** |
| Domain power | 5.9% |
| Semantic relevance in reviews | 5.3% |
| Everything else | <5% each |

Proximity radius varies: urban 1-2 miles, rural 5-10+ miles, specialty wider. Google weights dynamically per query: "emergency plumber near me" = proximity-dominant; "best plastic surgeon" = prominence-dominant (Consensus).

## Business type & vertical detection (run before any local audit)

| Type | Signals | Check impact |
|---|---|---|
| Brick-and-mortar | Visible street address, Maps embed, "Located at" | Full NAP + map checks |
| Service Area Business (SAB) | No address, "serving [city]", "we come to you", `areaServed` without `streetAddress` | Skip embedded-map + physical-address checks |
| Hybrid | Both address and service-area language | Full checks |

Vertical signals: **Restaurant** /menu, reservations, cuisine · **Healthcare** insurance, NPI, "Dr.", HIPAA notice · **Legal** attorney, practice areas, bar admission · **Home Services** emergency, free estimate, licensed/insured, 24/7 · **Real Estate** MLS, listings, open house · **Automotive** VIN, inventory, test drive. Unclear → present top 2 detected verticals and ask; none → generic `LocalBusiness` path.

## GBP signals

- Primary category = **#1 pack factor (193)**; most specific subtype wins ("Cosmetic Dentist" not "Dentist"). Wrong category = #1 negative (176).
- Additional categories: 3-5 relevant; **optimal = 4 additional** (BrightLocal).
- Business name: match real-world name exactly — no keyword stuffing.
- GBP website link: do **NOT** link the strongest organic page (Sterling Sky "Diversity Update" 2025 — harder to rank in map pack AND organic simultaneously; risks suppressing organic rankings).
- Hours: complete + holiday hours; **open-at-search-time = factor #5**.
- Posts: **no direct ranking impact** (WebFX empirical testing) but can trigger Post Justifications. Cadence target 1+/week.
- Photos: "likely benefit adding some vs none, no continued benefit adding more" (WebFX). **Geotagging has NO impact.** Photos = **+45% direction requests** (Agency Jet). Target 10+ across logo/cover/interior/exterior/team/products; refresh within 30 days.
- Attributes: identity attributes (Women-led, Eco-friendly) have minor impact for attribute-specific searches only; general attributes are filters, NOT ranking factors (WebFX/Sterling Sky).
- Google Verified badge replaced Google Guaranteed/Screened, **Oct 2025**.
- SAB: service area set in GBP does **NOT** affect rankings — rankings derive from verification address (Sterling Sky, March 2025). Up to 20 service areas definable.

### GBP feature deprecations (lint every audited page)

| Feature | Status/date | Lint severity | Action |
|---|---|---|---|
| GBP chat/messaging + call history | Fully sunset **2024-07-31** | **Critical** | "Message us via Google" CTAs do nothing — replace with phone/form/SMS. Only flag chat CTAs adjacent to a Google-business signal |
| `*.business.site` GBP websites | Shut down March 2024; redirects expired **2024-06-10** | **High** | Any remaining link (nav, citations, schema `sameAs`) is dead — update to real URL |
| GBP Q&A section | Removed **Dec 3, 2025** → Ask Maps (Gemini AI); no export was offered | **Medium** | Embedded GBP Q&A renders empty. Recreate Q&A as on-page FAQ — but FAQPage RICH RESULTS are government/healthcare-only since **Aug 2023** |
| School reviews/ratings | Removed **Apr 30, 2025** | — | No replacement |
| Google Food Ordering direct checkout | Discontinued **June 2024** | — | "Order Online" now redirects to third-party platforms |

Active features: Posts (with scheduling), Services menu, Attributes, Photos/Video, Local Lists, AI "Suggest Description", Google Verified badge.

### GBP profile completeness audit (25 fields, API-scored)

Scoring: Present+Optimized = 2 pts, Present = 1, Missing = 0. Max 50 raw → normalize `(score/50)*100`.

**Critical (8 fields, 16 pts):** primary category (most specific) · additional categories (3-5) · exact business name · complete address matching website NAP · **local phone, not toll-free**, matching website · website URL (not strongest page) · complete hours + holidays · Verified status.
**Important (8 fields, 16 pts):** description **250-750 chars** with service+location keywords · all services listed with descriptions · products with prices · 10+ photos across types · photo uploaded within **30 days** · relevant attributes · service areas (SAB, up to 20) · menu/services link.
**Supplementary (9 fields, 18 pts):** posts 1+/week · post within last **7 days** · booking link · social profiles linked · square logo · cover photo · 1+ video · owner responses (target **80%+ response rate**) · FAQ content on website (replaces deprecated Q&A).

Industry weight multipliers (re-normalize after: `final = weighted_raw / max_weighted × 100`):

| Vertical | Boosted fields |
|---|---|
| Restaurant | Menu link ×2, photos ×1.5, booking ×1.5, attributes ×1.5 |
| Healthcare | Services ×2, hours ×1.5, attributes ×1.5 |
| Legal | Services ×2, description ×1.5, photos ×0.5 |
| Home Services | Service areas ×2, hours ×1.5, photos ×1.5 |
| Real Estate | Photos ×2, social ×1.5, posts ×1.5 |
| Automotive | Products ×2, photos ×2, services ×1.5 |

Interpretation: 90-100 excellent (maintain cadence) · 75-89 good (fill supplementary) · 50-74 needs work · 25-49 poor (prioritize Critical fields) · 0-24 critical/unclaimed (start with verification).

## Review intelligence

### Benchmarks

| Rule/metric | Value | Source |
|---|---|---|
| "Magic 10" threshold | Ranking boost at 10 reviews: 9→10 = noticeable jump, 10→11 = no similar bump | Sterling Sky (Study) |
| **18-day rule** | Rankings "fall off a cliff" after 3 weeks without a new review. Velocity > volume | Sterling Sky |
| Only care about reviews from last 3 months | 74% | BrightLocal LCRS 2026 |
| "Always" read reviews | 41% (up from 29% in 2025) | BrightLocal 2026 |
| Only use businesses rated 4.5+ | 31% (up from 17%) | BrightLocal 2026 |
| Only use businesses rated 4+ | 68% (up from 55%) | BrightLocal 2026 |
| Review platforms consulted per consumer | 6 on average | BrightLocal 2026 |
| Would use a business that responds to reviews | 88% | BrightLocal |
| Platform usage | Google 71% (down from 83%), Instagram 37%, TikTok 29%, Apple Maps 27% (up from 14%) | BrightLocal 2026 |

### Enforcement (hard compliance rules)
- **Review gating prohibited** — any satisfaction pre-screening before directing to a review platform violates Google's fake-engagement policy AND the FTC Consumer Review Rule (effective **Oct 21, 2024**, penalties up to **$53,088/violation**).
- Google blocked/removed **240M+** policy-violating reviews in 2024 (+40% vs 2023). Deletion rates up **600%+** Jan-Jul 2025; **38% of deleted reviews were 5-star** (GMBapi.com) — legitimate-looking reviews get purged too.
- Never generate self-serving review markup: Google ignores `LocalBusiness` review schema from the business itself; mark up only third-party reviews visible on the page.
- Healthcare: HIPAA forbids confirming/denying a reviewer is a patient in responses — fine precedent **$30,000** (Manasa Health Center, 2023). Legal: attorney-client privilege applies to responses.

### Review intelligence workflow (API tier)
1. Fetch Google reviews sorted `newest`; 2. velocity = reviews/month over last 6 months; 3. flag any 3-week gap (18-day rule breach = ranking risk); 4. rating distribution — healthy = bell curve skewed to 5-star; 5. owner response rate = responses/total (target 80%+); 6. cross-platform pull (Tripadvisor, Trustpilot) and compare.

### Fake review detection — flag when **2+ signals** match
Uniform timing (same day/hour) · single-review or thin-history accounts · reviewer geography inconsistent with business · exclusively 5-star velocity spike vs baseline · identical/near-identical text · volume spike without marketing activity.

## NAP consistency

Extract Name/Address/Phone from three sources and diff: (1) visible page HTML (footer/contact), (2) `LocalBusiness` JSON-LD, (3) visible GBP data. Any discrepancy = finding. NAP absent from HTML **and** schema = Critical.

Discrepancy severity: **name mismatch = Critical · address mismatch = High · phone mismatch = Medium**.

Cross-platform verification (Google / Bing / Apple / OSM): Bing via `bing.com/maps?q=NAME+LOCATION` fetch; Apple has no public API — verify via Apple Business Connect (businessconnect.apple.com); OSM via Overpass/Nominatim. Classify each as exact match / partial / missing / conflicting; recommend claiming anything unclaimed.

## Citation tiers

Context: citations declining for pack rankings — Google's **July 2025** doc update removed "directories" from the prominence definition — yet **3 of the top 5 AI visibility factors are citation-related** (Whitespark 2026).

| Tier | Sources | Why |
|---|---|---|
| **Tier 1** (all industries) | Google Business Profile · Apple Business Connect (usage doubled 14%→27%, 1B+ iPhone users) · Bing Places (overhauled Oct 2025; powers ChatGPT, Copilot, Alexa; 900M queries/day) · Facebook · Yelp (still page-1 for many local queries) | Primary + AI-assistant data feeds |
| **Tier 2** (broad directories) | BBB, YellowPages, Manta, Superpages, Foursquare, Nextdoor | Breadth |
| **Tier 3** (data aggregators) | Data Axle (feeds Google/Bing/Apple) · Foursquare (merged with Factual; powers Uber, Nextdoor, Yahoo, ChatGPT; 500M+ devices) · Neustar/TransUnion (80+ platform partnerships incl. Bing, Apple) | Downstream distribution — submit once, propagate everywhere |

Industry-specific (top picks): **Restaurant** Yelp, TripAdvisor (1B+ reviews), OpenTable, DoorDash/UberEats/Grubhub, Foursquare. **Healthcare** Healthgrades (visited by 50% of Americans who see a doctor), Zocdoc, WebMD, Vitals, Doximity (80% of US physicians), NPI Registry (entity source of truth), state boards. **Legal** FindLaw (DA~91, dofollow), Martindale-Hubbell (DA~84, peer review since 1868), Avvo (1-10 auto-created from bar data), Justia (DA~70 free), Super Lawyers (top 5% selection), state bar directories. Ownership: Internet Brands/KKR owns Avvo+Martindale+Lawyers.com+Nolo; Thomson Reuters owns FindLaw+Super Lawyers+LawInfo. **Home Services** Thumbtack ($400M revenue 2024; ChatGPT/Alexa/Zillow integrations), BBB, Nextdoor, Yelp — declining: Angi (revenue -30% from 2022 peak), Porch (→insurance), Houzz (→SaaS). **Real Estate** Zillow (44% of all RE search traffic; integrated into ChatGPT Oct 2025), Homes.com (#2, 100M monthly visitors, overtook Realtor.com), Realtor.com, Redfin (acquired by Rocket Mar 2025), local MLS. **Automotive** Cars.com, AutoTrader, CarGurus, DealerRater (syndicates to Cars.com + OEM sites; salesperson ratings), Edmunds, KBB (pricing authority), OEM dealer locators.

## Local on-page & location pages (doorway thresholds)

- **Dedicated service pages = #1 local ORGANIC factor AND #2 AI visibility factor** (Whitespark 2026). One page per core service.
- Title + H1: city + service keyword. NAP visible in HTML. `tel:` click-to-call + contact form above the fold.
- Embedded Google Map = geographic reinforcement, not a direct ranking factor — **lazy-load it** to protect speed.
- Internal linking: hub-and-spoke, every critical page **≤3 clicks** from homepage, **2-5 contextual links per 1,000 words** with descriptive anchors.
- Multi-location URL structure: `domain.com/locations/city-name/` subdirectories (consolidate link equity better than subdomains — Bruce Clay: **50%+ traffic lift**). Store locator with individually crawlable URLs, SSR/SSG preferred over CSR.
- Location page uniqueness: **>60-70% unique content** minimum (industry consensus; no Google-confirmed threshold).
- **Swap test** (RicketyRoo): if you can swap the city name and the page still reads fine, it's a doorway page. Precedent: HVAC company lost **80% of rankings and 63% of traffic** after the March 2024 Core Update for this pattern.
- Doorway quality gates: **WARNING at 30+ location pages** (enforce 60%+ unique content) · **HARD STOP at 50+ pages** (require explicit user justification before generating/continuing).
- Each location page: unique `LocalBusiness` schema with its own `@id`, `branchOf` → homepage `Organization`.

## Local schema

Schema is **NOT a direct ranking factor** (Confirmed: John Mueller, Gary Illyes). Value = rich results (**+43% CTR**, Webstix case study), entity understanding, AI parsing.

Required (Google Developers doc, updated Dec 10, 2025): `name` (must match GBP exactly) + `address` (PostalAddress with streetAddress/addressLocality/addressRegion/postalCode). Recommended: `geo` (**minimum 5 decimal places** ≈ 1.1 m accuracy, Confirmed) · `openingHoursSpecification` · `telephone` (matches GBP + page NAP) · `url` · `priceRange` (**<100 chars**) · `image` · `aggregateRating` (ratingValue, reviewCount, bestRating) · `review` · `department` (auto dealers) · `menu`/`servesCuisine` (restaurants). SAB: `areaServed` with named cities + `sameAs` to Wikipedia/Wikidata — Schema.org-supported, NOT in Google's official recommended list.

### Subtype selection — always the most specific Google-supported type
Food: `Restaurant`, `CafeOrCoffeeShop`, `BarOrPub`, `Bakery`, `FastFoodRestaurant`, `IceCreamShop` (avoid generic `FoodEstablishment`). Healthcare: `MedicalClinic`/`Hospital`/`Dentist` (rich-result eligible), `Physician` (with Person), `Optician`, `Pharmacy` (avoid `MedicalBusiness`). Legal: `LegalService` only. Home services: `Plumber`, `Electrician`, `HVACBusiness`, `RoofingContractor`, `GeneralContractor`, `HousePainter`, `Locksmith`, `MovingCompany` (avoid `HomeAndConstructionBusiness`). Real estate: `RealEstateAgent` for both agents AND brokerages (no `RealEstateBrokerage` type exists). Automotive: `AutoDealer` (sales), `AutoRepair` (service), `AutoPartsStore` (parts) — separate schemas/GBPs per department.

### Deprecated schema — never emit

| Type | Status | Use instead |
|---|---|---|
| `Attorney` | Deprecated by Schema.org | `LegalService` + `Person` |
| `VehicleListing` | Rich results removed **June 12, 2025** | `Car` + `Offer` (Merchant Center vehicle feeds still work) |
| `HowTo` | Rich results removed **Sept 2023** | None |
| `SpecialAnnouncement` | Deprecated **July 31, 2025** | None |
| `FAQPage` rich results | Government/healthcare sites only since **Aug 2023** | Keep FAQ content for AI parsing, don't expect rich results |

### Industry patterns
Restaurant: subtype + `Menu > MenuSection > MenuItem` (name, price, nutrition, suitableForDiet) + `ReserveAction`/`OrderAction` + `servesCuisine`, `acceptsReservations`. Healthcare: clinic subtype + `Physician` pages as `Person` with `medicalSpecialty`, `hospitalAffiliation`, `hasCredential`, `sameAs` → NPI Registry + medical board. Legal: `LegalService` + `Person` bios (jobTitle, worksFor, alumniOf, bar admissions via `hasCredential`) + `makesOffer > Service` per practice area; practitioner GBP needs a unique phone per attorney (not for a sole lawyer); reviews follow the practitioner listing when the attorney changes firms. Home services: subtype + `areaServed` (cities + `sameAs`) + `Service` pages via `provider` + `hasOfferCatalog`. Real estate: `RealEstateAgent` + `Person` (memberOf) + `RealEstateListing` + residence type + `Offer`; `Event` for open houses. Automotive: `AutoDealer` + `Car` (VIN, mileage, fuelType, vehicleTransmission) + `Offer` (price, priceCurrency, availability).

### Multi-location pattern
Homepage: `Organization` with `@id: https://example.com/#org`. Each location page: subtype (e.g. `Dentist`) with unique `@id` (`.../locations/downtown/#location`), `branchOf: {"@id": ".../#org"}`, full address, 5-decimal `geo`, `telephone`, `openingHoursSpecification`.

## Geo-grid rank tracking

Simulates Maps searches from a grid of GPS points around the business; output = rank heatmap + SoLV.

**Grid generation:** `step = (2 × radius_km) / (grid_size − 1)`; for cell (i, j) with `center_index = (grid_size−1)/2`: `lat = center_lat + dy/111.32`, `lng = center_lng + dx/(111.32 × cos(center_lat × π/180))` where dy/dx = offset × step (111.32 km = 1° latitude).

| Grid | Points | Typical radius | Best for | Cost/keyword (live) |
|---|---|---|---|---|
| 3×3 | 9 | 2 km | Quick snapshot | $0.018 |
| 5×5 | 25 | 3 km | Standard urban | $0.050 |
| **7×7 (default)** | **49** | **5 km** | Best coverage/cost balance | **$0.098** |
| 9×9 | 81 | 8 km | Suburban/wide SAB | $0.162 |
| 13×13 | 169 | 15 km | Rural/large metro | $0.338 |

Radius guide: urban dense 2-5 km, suburban 5-10 km, rural 10-25 km. Cost formula: `grid² × keywords × $0.002` (live) or `× $0.0006` (standard). Multi-keyword scan = 3 keywords on one grid: primary service + brand+location + long-tail intent → 7×7 = 147 calls ≈ $0.29 live / $0.088 standard.

**Share of Local Voice (SoLV, Local Falcon metric):** `SoLV = (points_in_top_3 / total_points) × 100`.

| SoLV | Reading |
|---|---|
| 80-100% | Dominant — owns the area |
| 60-79% | Strong |
| 40-59% | Moderate — significant gaps |
| 20-39% | Weak — competitors dominate |
| 0-19% | Critical — nearly invisible |

Extended metrics: Average Rank (mean across points) · Visibility Score (top 3 = 3 pts, 4-10 = 1 pt, 11+ = 0) · Worst Quadrant (weakest compass direction). Heatmap symbols: `1`-`3` top 3, `4`-`9` visible, `+` = 11-20 buried, `-` = not ranked, `[1]` = center point.

**Mandatory cost gate:** before any scan, display grid size, keyword count, API-call count, and cost estimate, and get explicit confirmation — DataForSEO credits are consumed.

## API reference (thresholds & pricing)

### DataForSEO (Tier 1)
Basic auth · **2,000 calls/min** · up to **100 tasks per POST** (batch a whole 7×7 grid in one request) · $50 minimum deposit, $1 trial credit, credits never expire.

| Endpoint | Cost | Notes |
|---|---|---|
| Maps SERP `/v3/serp/google/maps/live/advanced` | $0.0006 standard (≤5 min) / $0.0012 priority (≤1 min) / **$0.002 live** (≤6 s) | Geo-grid backbone: `location_coordinate: "lat,lng,zoom"` (max 7 decimals, zoom 3z-21z). Search operators ×5 cost |
| My Business Info | $0.0015/profile | Deep-dive on target business (keyword, `cid:`, or `place_id:`) |
| Google Reviews | $0.003 per 10 (keyword) / **$0.00075 per 20 via place_id/CID (4× cheaper — always prefer)** | `sort_by: newest` for velocity |
| Q&A API | ~$0.002 | Historical only (GBP Q&A dead Dec 2025) |
| Business Listings Search | pre-indexed DB, up to 700+ results/query | MCP tool `business_data_business_listings_search` = Tier-1 detection probe |
| Tripadvisor reviews | billed per 30 reviews, standard only | Cross-platform |
| Trustpilot reviews | ~$0.00075/task, standard only | Cross-platform |

Reference totals: full audit with 1-keyword 7×7 grid ≈ 73 calls ≈ **$0.13**; with 3-keyword grid ≈ 171 calls ≈ **$0.33**.

### Free tier (Tier 0)

| API | Limits | Best for |
|---|---|---|
| Overpass (OSM) | ~2 concurrent/IP, ~10k req/day, ~1 GB/day, 180 s timeout, 512 MiB/query — use `[timeout:25]`. ODbL: attribute "Data from OpenStreetMap" | Radius competitor discovery via tags (`amenity=dentist`, `office=lawyer`, `craft=plumber`, `shop=car`…). No reviews/ratings; quality best in Europe |
| Geoapify Places | **3,000 credits/day** (1 credit = 20 places), 5 req/s, free API key. **Caching explicitly permitted** | Structured POI search (OSM+OpenAddresses+WhosOnFirst+GeoNames) |
| Nominatim | **1 req/s absolute**, valid User-Agent mandatory, autocomplete forbidden, bulk forbidden, caching required (repeat queries → ban) | Geocoding only (grid center point) — not listing discovery |

Google Maps Platform (Tier 2) ToS: store **`place_id` only**; lat/lng cacheable **30 days max**.

## Scoring rubrics

**Local SEO Score (website-side, 0-100):** GBP Signals 25% · Reviews & Reputation 20% · Local On-Page 20% · NAP & Citations 15% · Local Schema 10% · Local Links & Authority 10%.

**Maps Health Score (platform-side, 0-100):** Geo-Grid/SoLV 25% · GBP Completeness 20% · Review Health 20% · Cross-Platform Presence 15% · Competitor Position 10% · Schema & AI Readiness 10%. Without geo-grid (Tier 0), redistribute its 25%: GBP +10, Review Health +10, Cross-Platform +5. Always announce the detected tier before analysis.

Competitor analysis: Tier 0 = Overpass radius query sorted by distance; Tier 1 = Maps SERP top 20 with rating/review/category/photo comparison + competitive density (competitors per km²).

## Local links, authority & AI visibility

- **"Best of" list placements = #1 AI visibility citation factor** (Whitespark 2026); 3 of the top 5 AI visibility factors are citation-related.
- Brand mentions correlate **3× more strongly** with AI visibility than backlinks (Ahrefs: 0.664 vs 0.218). 66.2% of PR practitioners now track AI citations as a KPI (BuzzStream 2026).
- Chamber of Commerce membership: high Trust Flow, ~80% more consumer visits (GlueUp). BBB: Google uses it for business verification.
- Link velocity benchmark: **5-10 quality local links/month** for small businesses (Consensus).
- **ChatGPT does NOT read GBP.** It sources local answers from the Bing index (primary), Yelp, TripAdvisor, BBB, Reddit → claiming Bing Places is a direct ChatGPT/Copilot/Alexa play. Perplexity: authority-first, 40% more citations from high-authority sites, averages 21.87 citations/question (Qwairy).

## Voice search

58% of voice searches seek local business info (BusinessDasher); queries run 4-7 words as full questions; 80%+ of Google Assistant answers come from top-3 results. Data sources: Google Assistant ← GBP (transitioning to Gemini) · Siri ← Apple Business Connect + Yelp · Alexa ← Bing Places + Yelp + aggregators.

## Algorithm updates affecting local (2025-2026, all Confirmed unless noted)

| Update | Dates | Impact |
|---|---|---|
| March 2025 Core | Mar 13-27 | E-E-A-T emphasis; penalized thin/AI content |
| June 2025 Core | Jun-Jul 17 | General quality |
| August 2025 Spam | Aug 26-Sep 22 | Keyword stuffing, fake reviews, PBNs; Local Pack mostly stable |
| December 2025 Core | Dec 11-29 | Enhanced E-E-A-T, behavioral signal weighting |
| February 2026 Discover Core | Feb 5-27 | Discover-only; favored local expertise |
| "Diversity Update" (Sterling Sky, Study) | 2025 | Harder to rank in map pack AND organic simultaneously |

## Prioritized action ladder

**Quick wins:** claim Apple Business Connect (27% usage) and Bing Places (feeds ChatGPT/Copilot/Alexa) · fix NAP diffs across page/schema/GBP · add correct-subtype LocalBusiness schema with 5-decimal `geo` · `tel:` link · city+service in title/H1. **Medium:** dedicated page per service (#1 local organic factor) · review cadence ≤18 days · submit to the 3 data aggregators · industry directories · industry schema patterns · hub-and-spoke linking. **High impact:** digital PR targeting "best of" lists (#1 AI factor) · non-swappable location pages (>60% unique) · presence on ChatGPT's sources (Yelp, TripAdvisor, BBB, Reddit) · Chamber + BBB membership · community involvement content.

Note for JS-heavy sites: map embeds, GBP widgets, and review carousels are commonly injected client-side — audit the **post-render** DOM, not the raw HTML, or local signals will be missed.

## Sources

- claude-seo (AgriciDaniel, MIT): `skills/seo-local/SKILL.md`, `skills/seo-maps/SKILL.md`, `skills/seo/references/local-seo-signals.md`, `skills/seo/references/local-schema-types.md`, `skills/seo/references/maps-geo-grid.md`, `skills/seo/references/maps-gbp-checklist.md`, `skills/seo/references/maps-api-endpoints.md`, `skills/seo/references/maps-free-apis.md`, `agents/seo-local.md`, `agents/seo-maps.md`, `scripts/gbp_deprecation_lint.py`
- Existing `consolidated-seo-geo` SKILL.md (checked for overlap; no prior local/maps content merged — see FAQ schema caveat above)
