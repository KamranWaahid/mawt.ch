> Schema.org structured data for SEO + GEO: supported types (May 2026 baseline), the 2023–2026 deprecation timeline with replacements, generation rules, e-commerce merchant-listing validation, and the 100-point scoring grid.

## 1. Format and rendering rules

| Rule | Value / evidence |
|---|---|
| Format | **JSON-LD** (`<script type="application/ld+json">`) — Google's explicitly stated preference over Microdata and RDFa |
| `@context` | Must be `"https://schema.org"` (https, not http) |
| Rendering | JSON-LD injected via JavaScript may face **delayed processing** (Google JS SEO guidance, December 2025). Time-sensitive markup (especially `Product`, `Offer`) must be in the **initial server-rendered HTML** |
| AI impact | Content with proper schema has **~2.5× higher chance** of appearing in AI-generated answers (confirmed by Google and Microsoft, March 2025) |
| Schema.org version baseline | **29.4** (December 8, 2025) |
| Detection order (audit) | 1. JSON-LD `<script type="application/ld+json">` → 2. Microdata (`itemscope`, `itemprop`) → 3. RDFa (`typeof`, `property`). Always recommend migrating to JSON-LD |

## 2. Active types — recommend freely (May 2026)

| Type | Use case | Key properties |
|---|---|---|
| Organization | Company info | name, url, logo, contactPoint, sameAs |
| LocalBusiness | Physical businesses | name, address, telephone, openingHours, geo, priceRange |
| SoftwareApplication | Desktop/mobile apps | name, operatingSystem, applicationCategory, offers, aggregateRating |
| WebApplication | Browser-based SaaS | name, applicationCategory, offers, browserRequirements, featureList |
| Product | Physical/digital products | name, image, description, sku, brand, offers, review (+ Certification markup since April 2025) |
| ProductGroup | Variant products | name, productGroupID, variesBy, hasVariant |
| Offer | Pricing | price, priceCurrency, availability, url, validFrom |
| Service | Service businesses | name, provider, areaServed, description, offers |
| Article / BlogPosting / NewsArticle | Editorial content | headline, author, datePublished, dateModified, image, publisher |
| Review | Individual reviews | reviewRating, author, itemReviewed, reviewBody |
| AggregateRating | Rating summaries | ratingValue, reviewCount, bestRating, worstRating |
| BreadcrumbList | Navigation | itemListElement with position, name, item |
| WebSite | Site-level | name, url, potentialAction (SearchAction for sitelinks search box) |
| WebPage | Page-level | name, description, datePublished, dateModified |
| Person | Author/team | name, jobTitle, url, sameAs, image, worksFor |
| ProfilePage | Author/creator profiles (E-E-A-T) | mainEntity (Person), name, url, description, sameAs |
| ContactPage | Contact pages | name, url |
| QAPage | Genuine user Q&A (one question, community answers) | mainEntity (Question), acceptedAnswer, suggestedAnswer |
| VideoObject | Video content | name, description, thumbnailUrl, uploadDate, duration, contentUrl |
| ImageObject | Image content | contentUrl, caption, creator, copyrightHolder |
| Event | Events | name, startDate, endDate, location, organizer, offers |
| JobPosting | Job listings | title, description, datePosted, hiringOrganization, jobLocation |
| Course | Educational content (single-result rich card still live) | name, description, provider, hasCourseInstance |
| DiscussionForumPosting | Forum threads ("Discussions and forums" SERP feature, first-class rich result since 2024) | headline, author, datePublished, text, url |

**Video & specialized (also recommend freely):** BroadcastEvent, Clip, SeekToAction, SoftwareSourceCode — see template inventory (§7).

## 3. Deprecation timeline 2023–2026

Chronological. "Retired" = the Google rich result no longer renders; the vocabulary usually remains in schema.org.

| Date | Type | What happened | Replacement |
|---|---|---|---|
| **Sep 2023** | HowTo | Rich results removed from desktop and mobile. Vocabulary remains, produces no SERP feature | None for SERP. If comprehension is the goal: article structure with clear `<h2>` step headings. Keeping HowTo for AI-citation legibility is defensible — flag as "no SERP effect" |
| **Aug 2023** | FAQPage (restriction) | Rich results restricted to gov/health sites only | Superseded by the May 2026 full retirement below |
| **Jun 19, 2025** | VehicleListing / Vehicle | Retired, no replacement (Google "Simplifying our Search rich results" announcement). No more dealer-inventory rich cards | `Product` with vehicle-specific properties if sold online |
| **Jun 19, 2025** | ClaimReview | Retired, no replacement. The fact-check rich result was the main consumer; markup now has no SERP effect (vocabulary still in schema.org, Google ignores it) | None — for news context, `Article` with `dateline` |
| **Jun 19, 2025** | EstimatedSalary / OccupationalAggregateRating | Retired, no replacement | `JobPosting` with `baseSalary` for specific roles (JobPosting stays live) |
| **Jun 19, 2025** | LearningVideo | Retired | `VideoObject` (generic video rich result still renders) |
| **Jun 19, 2025** | Course Info **carousel** | Carousel variant retired only. Single-result `Course` rich card still live — always verify which variant the user means | Single `Course` rich card |
| **Jun 2025** | Book Actions | Deprecated then **REVERSED** — still functional as of Feb 2026. Historical note only, do not flag | n/a |
| **Jul 31, 2025** | SpecialAnnouncement | COVID-era emergency-info card deprecated, no longer processed. No replacement | `Event` if time-bounded; otherwise `Article` or `WebPage` |
| **Late 2025** | Practice Problem | Retired from rich results (educational practice problems no longer displayed) | None |
| **Late 2025** | Dataset | Retired from rich results; Dataset Search feature discontinued | None |
| **May 7, 2026** | **FAQPage — fully retired for ALL sites** | Supersedes the Aug 2023 gov/health restriction — even authoritative sites lose the rich result. Rich Results Test + Search Console report support drops **June 2026**; Search Console API support removed **August 2026** | See FAQPage policy below |

### FAQPage policy (post May 7, 2026)
- **Existing FAQPage markup**: flag at **Info priority, NOT Critical**. Do **not** recommend removal — AI Mode and AI Overviews use structured data for entity resolution and claim verification during answer synthesis; accurate FAQPage lifts AI-citation probability independent of rich results.
- **New FAQPage**: no Google SERP benefit; acceptable **only** if AI search visibility is the explicit goal.
- **Genuine single-question pages with user-submitted answers**: use **QAPage** (Google's recommended type), never FAQPage.

### Audit severity for deprecated types
- Generating any June/July 2025-retired type (Vehicle, VehicleListing, ClaimReview, EstimatedSalary, LearningVideo, SpecialAnnouncement) in 2026 = **Critical** finding.
- `Course` present = **verify** whether the (dead) carousel or the (live) single-result card is intended — flag with the note, not auto-Critical.
- Always report the deprecated type **with its retirement date** plus the replacement from the table above (or "no replacement exists").

## 4. Recent additions 2024–2026

| Type / feature | Added | Notes |
|---|---|---|
| DiscussionForumPosting | 2024 | Forum/community content; "Discussions and forums" SERP feature |
| Speakable | Updated 2024 | Voice search optimization |
| Product Certification markup | April 2025 | Energy ratings, safety certifications. **Replaced EnergyConsumptionDetails** |
| ProductGroup | 2025 | E-commerce variants (variesBy, hasVariant) |
| ProfilePage | 2025 | Author/creator profiles, mainEntity Person, E-E-A-T |
| LoyaltyProgram | June 2025 | Member pricing / loyalty-card structured data |
| Organization-level shipping/return policies | November 2025 | Configurable via Search Console **without** Merchant Center |
| ConferenceEvent, PerformingArtsEvent | December 2025 | Schema.org v29.4 additions |

## 5. Generation rules

Workflow for any page:
1. Identify page type from content analysis.
2. Select schema type(s) from the Active table — never a deprecated type.
3. Generate valid JSON-LD with all **required + recommended** properties.
4. Only truthful, verifiable data; placeholders clearly marked (`[Business Name]`) for the user to fill.
5. Validate before presenting (checklist §8); absolute URLs and `@context: https://schema.org` everywhere.

### High-leverage 2026 generators (v2 gap analysis, May 2026)
| Type | Why it matters now | Required structure |
|---|---|---|
| **Reservation** (FoodEstablishmentReservation, LodgingReservation, RentalCarReservation, TaxiReservation, EventReservation, TrainReservation, FlightReservation) | Google AI Mode executes restaurant reservations (Robby Stein, Google, 2025-08-21) — Reservation + potentialAction markup matters more than in 2024 | `reservationStatus: https://schema.org/ReservationConfirmed`, `provider` (Organization), `reservationFor` (FoodEstablishment or Place), `startTime` (ISO 8601); optional endTime, partySize (int), reservationId, underName (Person with name/email) |
| **OrderAction** (potentialAction on Product/Service) | "Order this" action surfaced by AI agents | `target` = EntryPoint with `urlTemplate`, `inLanguage`, `actionPlatform` [DesktopWebPlatform, MobileWebPlatform]; `deliveryMethod` (default OnSitePickup + ParcelService); `priceSpecification.eligibleTransactionVolume` (minPrice 0 + priceCurrency); `merchant` (Organization); optional `acceptedPaymentMethod` list of PaymentMethod |
| **DiscussionForumPosting** | Live "Discussions and forums" SERP feature eligibility | headline, author (Person), datePublished, url, `mainEntityOfPage` ({@type: WebPage, @id: url}); optional text, dateModified, commentCount (int), `interactionStatistic` = InteractionCounter with `interactionType: https://schema.org/LikeAction` + userInteractionCount |
| **ProfilePage** | Cheapest entity-graph builder for AI-citation correlation | `mainEntity` = Person with name, url, `sameAs`, `knowsAbout`; optional description, worksFor (Organization), image, jobTitle. Wikipedia, GitHub, LinkedIn, ORCID URLs in sameAs disambiguate the person across knowledge graphs |

### sameAs platform priority (entity recognition — the single most important property for AI-platform entity recognition)
1. Wikipedia (max authority) → 2. Wikidata (machine-readable entity) → 3. LinkedIn (Bing Copilot + ChatGPT signal) → 4. YouTube (Gemini + Perplexity signal) → 5. Twitter/X, Facebook, Crunchbase, GitHub → 6. Google Scholar, ORCID (academic) → 7. Instagram, app stores, sector directories. Target **5+ platforms**.

## 6. E-commerce requirements (Google merchant listings)

| Requirement | Status | Since |
|---|---|---|
| `hasMerchantReturnPolicy` (on Product or its Offer) | **Required** for merchant listing eligibility | 2025 Product docs |
| `returnPolicyCountry` in MerchantReturnPolicy | **Required** | March 2025 |
| `shippingDetails` (on Product or its Offer) | **Required** for merchant listing eligibility | 2025 Product docs |
| `energyEfficiencyClass` | **Required in the EU** for in-scope categories (EPREL regulation) | EU mode only |
| Product variant structured data (ProductGroup) | Expanded — Google increasingly enforces for apparel, cosmetics, electronics | 2025 |
| MemberProgram / loyalty-tier pricing (`hasMemberProgram` or Offer priceSpecification UnitPriceSpecification + `validForMemberTier`) | Recommended — loyalty-pricing visibility in Google Shopping | June 2025 |
| Content API for Shopping | **Sunsets August 18, 2026** — migrate to Merchant API | — |

### Merchant-listing validation ruleset (policy layer beyond Rich Results Test)
Rich Results Test catches structural errors; this layer catches *policy* errors — fields that parse fine but disqualify the product from a rich feature. PASS = zero Critical and zero High findings.

| Severity | Rule fires when |
|---|---|
| **Critical** | Any deprecated `@type` anywhere in the payload: Vehicle, VehicleListing, ClaimReview, EstimatedSalary, LearningVideo, SpecialAnnouncement (Course → verification note) |
| **High** | No `@type: Product` block found; Product missing any of **name, image, description, offers**; any Offer missing any of **price, priceCurrency, availability**; `hasMerchantReturnPolicy` absent from Product AND Offer; `shippingDetails` absent from Product AND Offer; (EU mode) `energyEfficiencyClass` missing |
| **Medium** | MerchantReturnPolicy missing **applicableCountry** or **returnPolicyCategory**; OfferShippingDetails missing **shippingDestination** or **deliveryTime**; no MemberProgram / loyalty-tier pricing declared |
| **Info** | Product present without any ProductGroup — suggest ProductGroup if size/colour variants exist |

## 7. Template inventory (distinguishing structure per template)

| Template | Distinguishing structure |
|---|---|
| Organization | name, url, logo, contactPoint {telephone, contactType: "customer service"}, sameAs [] |
| LocalBusiness | address (PostalAddress: streetAddress, addressLocality, addressRegion, postalCode, addressCountry), telephone, openingHours (`Mo-Fr 09:00-17:00` format), geo (GeoCoordinates latitude/longitude) |
| Article/BlogPosting | headline, author (Person), datePublished + dateModified (YYYY-MM-DD), image, publisher (Organization with logo ImageObject) |
| VideoObject | name, description, thumbnailUrl, uploadDate, duration (ISO 8601, e.g. `PT1H30M`), contentUrl, embedUrl, publisher |
| BroadcastEvent (LIVE badge) | VideoObject + `publication` = BroadcastEvent with `isLiveBroadcast: true`, startDate, endDate (ISO 8601 datetime) |
| Clip (key moments) | VideoObject + `hasPart` = Clip[] with name, startOffset/endOffset (seconds), url with timestamp (`?t=120`) |
| SeekToAction | VideoObject + `potentialAction` = SeekToAction, target `[URL]?t={seek_to_second_number}`, `startOffset-input: "required name=seek_to_second_number"` |
| SoftwareSourceCode | name, description, codeRepository (repo URL), programmingLanguage, runtimePlatform, author, license (URL), dateCreated, dateModified |
| ProductGroup | productGroupID, `variesBy` [`https://schema.org/size`, `https://schema.org/color`], `hasVariant` = Product[] with sku, color, size, offers |
| ProfilePage | mainEntity Person with sameAs [] (see §5) |
| Certification | Product + `hasCertification` = Certification with certificationIdentification (e.g. "Energy Star"), issuedBy Organization (e.g. EPA) |
| OfferShippingDetails | Offer + shippingDetails: shippingRate (MonetaryAmount), deliveryTime (ShippingDeliveryTime: handlingTime 0–1 DAY, transitTime 1–5 DAY as QuantitativeValue min/max unitCode) |
| Product (full e-commerce) | name, description, image, sku, brand (Brand), offers (price, priceCurrency, availability `https://schema.org/InStock`, url, priceValidUntil, hasMerchantReturnPolicy {returnPolicyCategory `MerchantReturnFiniteReturnWindow`, merchantReturnDays 30}, shippingDetails), aggregateRating (ratingValue, reviewCount) |
| ItemList (hub/pillar pages) | name, description, numberOfItems, itemListElement = ListItem[] with position, url, name |

## 8. Validation

### 8-point checklist (every schema block)
1. `@context` is `"https://schema.org"` (not http)
2. `@type` is valid and non-deprecated (§3)
3. All required properties present (§2 / §6)
4. Property values match expected data types
5. No placeholder text left (e.g. `[Business Name]`)
6. URLs absolute, never relative
7. Dates in ISO 8601
8. Images have valid URLs

### Common errors to test for
Missing `@context` · invalid `@type` · wrong data types · placeholder text · relative URLs · invalid date formats · deprecated types.

### Error handling
| Scenario | Action |
|---|---|
| URL unreachable | Report connection error with HTTP status code; suggest verifying URL / auth requirement |
| No markup found | Report no JSON-LD/Microdata/RDFa detected; recommend types from page-content analysis |
| Invalid JSON-LD syntax | Report specific syntax errors (missing brackets, trailing commas, unquoted keys); provide corrected JSON-LD |
| Deprecated type detected | Flag with retirement date + replacement from §3 (or "no replacement exists") |

### Tools
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- Audit output format: table with columns Schema | Type | Status (pass/warn/fail) | Issues, plus missing-schema opportunities and generated fix code.

## 9. Scoring — Schema JSON-LD /100 (feeds GEO_Score at weight 0.15)

| Element | Points |
|---|---|
| Organization/Person schema | 15 |
| sameAs (5+ platforms, priority order §5) | 15 |
| Server-rendered (not JS-injected) | 10 |
| Article schema with author | 10 |
| Business-specific schema | 10 |
| Valid JSON + valid Schema.org types | 10 |
| BreadcrumbList | 5 |
| WebSite + SearchAction | 5 |
| speakable property | 5 |
| knowsAbout property | 5 |
| No deprecated schemas (per §3) | 5 |
| FAQ schema — **AI-citation value only since May 7, 2026** (no SERP feature); QAPage counts for genuine Q&A | 5 |

Parent formula: `GEO_Score = (Platform × 0.25) + (Content × 0.25) + (Technical × 0.20) + (Schema × 0.15) + (Brand × 0.15)`; scale 85–100 Excellent | 70–84 Good | 55–69 Average | 40–54 Weak | 0–39 Critical.

## Sources
- claude-seo (AgriciDaniel, MIT): `skills/seo-schema/SKILL.md`
- claude-seo: `skills/seo-schema/references/deprecated-types-2024-2026.md` (last verified against developers.google.com: 2026-05-25)
- claude-seo: `skills/seo/references/schema-types.md` (Schema.org v29.4 baseline)
- claude-seo: `scripts/schema_generate.py` (generator structures, §5)
- claude-seo: `scripts/schema_ecommerce_validate.py` (merchant-listing ruleset, §6)
- claude-seo: `schema/templates.json` (template inventory, §7)
- existing consolidated-seo-geo SKILL.md (scoring grid §9, sameAs priority §5)
- Google primary sources: developers.google.com/search/blog/2025/06/simplifying-search-results · /2023/09/structured-data-changes · /2023/08/howto-faq-changes · search/docs/appearance/structured-data/faqpage


## Addenda — completeness pass

### agents/seo-schema.md
Schema agent rules not in covered files: FAQ rich results retired for ALL sites on 2026-05-07 (supersedes Aug 2023 gov/health restriction) — existing FAQPage = flag Info priority NOT Critical, do not recommend removal (still aids AI/LLM citation and entity resolution); new FAQPage acceptable only if GEO/AI visibility is the goal; genuine user Q&A pages must use QAPage. Never recommend: HowTo (Sept 2023), SpecialAnnouncement (2025-07-31), CourseInfo/EstimatedSalary/LearningVideo (June 2025). Always: JSON-LD over Microdata/RDFa, @context 'https://schema.org' (not http), absolute URLs, ISO 8601 dates, no placeholder text. 7-point validation checklist. SPA rule: many sites inject JSON-LD client-side (React Helmet, Next/Head, vue-meta) — render with Playwright (--mode always) and compare raw_content vs rendered content to confirm whether schema is server-rendered.

### hooks/validate-schema.py
Reusable PostToolUse hook (matcher Edit|Write, config in hooks/hooks.json): regex-extracts <script type=application/ld+json> blocks from .html/.htm/.jsx/.tsx/.vue/.svelte/.php/.ejs files; BLOCKS the edit (exit 2) on: placeholder text ([Business Name], [City], [Phone], [INSERT, REPLACE, [URL], [Email]...) or deprecated @type (HowTo, SpecialAnnouncement, CourseInfo, EstimatedSalary, LearningVideo, ClaimReview, VehicleListing — the last two retired June 2025, fact-check + vehicle-listing rich results discontinued); warnings-only (missing @context/@type, http context) = exit 1 proceed. FAQPage intentionally NOT flagged. 10 MiB file-size guard. Directly reusable pattern for any bootstrapped web project.

### schema/templates.json
11 ready JSON-LD templates referenced by the schema agent: VideoObject; BroadcastEvent (isLiveBroadcast for LIVE badge); Clip (hasPart with startOffset/endOffset for key moments); SeekToAction (target ?t={seek_to_second_number}); SoftwareSourceCode (codeRepository/programmingLanguage); ProductGroup (variesBy + hasVariant for e-comm variants); ProfilePage (mainEntity Person + sameAs for E-E-A-T); Certification via hasCertification (replaced EnergyConsumptionDetails April 2025); OfferShippingDetails (shippingRate + handlingTime/transitTime QuantitativeValue); full e-commerce Product (Offer + priceValidUntil + MerchantReturnPolicy merchantReturnDays 30 + shippingDetails + aggregateRating); ItemList for hub/pillar pages.
