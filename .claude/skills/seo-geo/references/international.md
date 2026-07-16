# International SEO — Hreflang, i18n, Cultural Adaptation

> Deep source of truth for hreflang implementation/validation, content parity across language versions, cultural adaptation profiles, locale format rules, and machine-translation QA per the Jan 23, 2025 Google QRG update.

## 1. Hreflang validation rules (8 checks)

| # | Check | Rule | Failure consequence |
|---|-------|------|--------------------|
| 1 | Self-referencing tag | Every page includes an hreflang tag pointing to itself; URL must exactly match the page's canonical URL | Missing self-ref → Google ignores the ENTIRE hreflang set |
| 2 | Return tags | Every relationship bidirectional (A→B AND B→A); all language versions reference each other (full mesh) | Missing return tag invalidates the signal for BOTH pages |
| 3 | x-default | Required. Points to fallback for unmatched languages (typically language selector page or EN version). Exactly ONE x-default per alternate set. Must also receive return tags from all other versions | No fallback routing for unmatched users |
| 4 | Language code | ISO 639-1 two-letter only (`en`, `fr`, `de`, `ja`) | Invalid code = tag ignored |
| 5 | Region code | Optional; ISO 3166-1 Alpha-2, format `language-REGION` (lowercase lang, UPPERCASE region): `en-US`, `en-GB`, `pt-BR` | Invalid code = tag ignored |
| 6 | Canonical alignment | Hreflang only on canonical URLs; hreflang URL and canonical URL must match exactly (incl. trailing slash). If page canonicals elsewhere, its hreflang is ignored. Non-canonical pages must NOT appear in any hreflang set | Signal ignored |
| 7 | Protocol consistency | All URLs in a set use the same protocol. After HTTPS migration, update every hreflang tag to HTTPS | Mixed HTTP/HTTPS = validation failure |
| 8 | Cross-domain | Hreflang works across domains (example.com ↔ example.de) with return tags on BOTH domains; verify both in Google Search Console; sitemap implementation recommended for cross-domain | Unverified/one-way = signal dropped |

### Code errors to catch (exact fixes)
| Wrong | Right | Why |
|-------|-------|-----|
| `eng` | `en` | ISO 639-2 (3-letter) not valid for hreflang |
| `jp` | `ja` | `jp` is the country code, not the language code for Japanese |
| `zh` alone | `zh-Hans` or `zh-Hant` | Ambiguous without script qualifier |
| `en-uk` | `en-GB` | UK is not a valid ISO 3166-1 code |
| `es-LA` | Specific countries (`es-MX`, `es-AR`…) | Latin America is not a country |
| Region without language (`-US`) | `en-US` | Region qualifier requires language prefix |

### Common mistakes — severity table
| Issue | Severity | Fix |
|-------|----------|-----|
| Missing self-referencing tag | Critical | Add hreflang pointing to same page URL |
| Missing return tags (A→B but no B→A) | Critical | Add matching return tags on all alternates |
| Missing x-default | High | Add x-default pointing to fallback/selector page |
| Invalid language code (e.g. `eng`) | High | Use ISO 639-1 two-letter codes |
| Invalid region code (e.g. `en-uk`) | High | Use ISO 3166-1 Alpha-2 codes |
| Hreflang on non-canonical URL | High | Move hreflang to canonical URL only |
| HTTP/HTTPS mismatch in URLs | Medium | Standardize all URLs to HTTPS |
| Trailing slash inconsistency | Medium | Match canonical URL format exactly |
| Hreflang in both HTML and sitemap | Low | Choose one method (sitemap preferred for large sites) |
| Language without region when geo-targeted | Low | Add region qualifier |

## 2. Implementation methods

| Method | Best for | Pros | Cons |
|--------|----------|------|------|
| HTML `<link>` tags | Sites with < 50 language/region variants per page | Easy, visible in source | Bloats `<head>`, unmaintainable at scale |
| HTTP `Link:` headers | Non-HTML files (PDFs, documents) | Works for non-HTML | Complex server/CDN config, invisible in HTML |
| XML sitemap | Large sites, cross-domain, 50+ pages | Scalable, centralized | Not visible on page, needs sitemap maintenance |

### HTML (place in `<head>`; every page lists ALL alternates including itself)
```html
<link rel="alternate" hreflang="en-US" href="https://example.com/page" />
<link rel="alternate" hreflang="en-GB" href="https://example.co.uk/page" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />
<link rel="alternate" hreflang="x-default" href="https://example.com/page" />
```

### HTTP header (server/CDN config)
```
Link: <https://example.com/page>; rel="alternate"; hreflang="en-US",
      <https://example.com/fr/page>; rel="alternate"; hreflang="fr",
      <https://example.com/page>; rel="alternate"; hreflang="x-default"
```

### XML sitemap — 4 hard rules
1. Declare namespace `xmlns:xhtml="http://www.w3.org/1999/xhtml"` on `<urlset>`.
2. Every `<url>` entry includes ALL alternates as `<xhtml:link rel="alternate" hreflang=".." href=".." />` — including itself.
3. Each alternate must also appear as its own `<url>` entry with its own full alternate set (full mesh in the sitemap too).
4. Split at 50,000 URLs per sitemap file.

## 3. Hreflang generation workflow (7 steps)
1. Detect languages: URL path, subdomain, ccTLD, HTML `lang` attribute.
2. Map page equivalents across languages/regions.
3. Validate all codes against ISO 639-1 + ISO 3166-1.
4. Generate tags per page, including self-reference.
5. Verify all relationships are bidirectional.
6. Add one x-default per page set.
7. Output as HTML tags, HTTP headers, or `hreflang-sitemap.xml`.

## 4. Content parity audit

### Parity matrix — 9 dimensions
| Dimension | Compare | Acceptable variance | Severity if failing |
|-----------|---------|--------------------|--------------------|
| Page existence | Page exists in all declared languages | 0% — all must exist | High |
| Section structure | H2/H3 section count | ±1 section | Medium |
| FAQ items | FAQ question count | ±2 items | Medium |
| Images | Count + localized alt text | Must match exactly | Medium |
| Charts/SVGs | Present in all versions | Must match exactly | Low |
| Word count | Proportional to expansion ratio | ±30% of expected ratio | Low |
| Schema markup | JSON-LD present + localized | Type and key properties must match | High |
| Title tag | Localized with local-language keyword | Must be localized, not English | High |
| Meta description | Localized, within char limits | Must be localized | Medium |

### Word count ratio validation (vs English source)
| Target | Expected ratio | Acceptable range | Red flag |
|--------|---------------|------------------|----------|
| German (DE) | 1.25–1.35x | 1.10–1.50x | DE shorter than EN → likely missing content |
| French (FR) | 1.15–1.25x | 1.00–1.40x | |
| Spanish (ES) | 1.15–1.25x | 1.00–1.40x | |
| Japanese (JA) | 0.75–0.90x | 0.60–1.00x | JA longer than EN → likely padding |
| Chinese (ZH) | 0.70–0.80x | 0.55–0.95x | |

### Freshness tracking
Detect stale translations via: (1) file modification timestamps (EN updated after DE → DE stale), (2) frontmatter `date_modified`/`lastmod` comparison, (3) source-language content hash changed since last translation.

| State | Delta since source update | Priority |
|-------|--------------------------|----------|
| Fresh | ≤ 7 days | OK |
| Aging | 8–30 days | Low |
| Stale | 31–90 days | Medium |
| Outdated | 90+ days | High |

### Cultural adaptation quality gates
| Check | Example | Severity |
|-------|---------|----------|
| Foreign brand references | "Walmart" on de-DE page | Medium |
| Foreign statistics | "80% of Americans" on localized page | Medium |
| CTA aggressiveness mismatch | "BUY NOW!" on ja-JP | Low |
| Wrong-jurisdiction legal refs | CCPA cited on de-DE instead of DSGVO | High |
| Currency/unit mismatch | USD prices on EUR pages, imperial on metric | High |
| Untranslated elements | English in navigation, buttons, alt text, schema | Medium |

### Parity score (/100)
- Page existence parity: **30 pts** · SEO element parity (title, meta, schema): **30 pts** · Content structure parity (sections, images, FAQ): **25 pts** · Freshness parity: **15 pts**
- Bands: 90–100 excellent · 70–89 good, minor gaps · 50–69 significant issues · < 50 major failures, immediate action.
- Output: matrix table `| Page | EN | DE | FR | … | Parity Score |` with ✅/⚠️/❌ per language + prioritized action items.

## 5. Cultural adaptation profiles

Assessment: identify language versions + target markets → load profile → check CTAs (direct vs indirect), trust signals, legal pages, foreign brand refs, number/date/currency consistency → flag mismatches as **Medium severity** "Cultural Adaptation" findings → output Cultural Adaptation Score 0–100 per language version.

### DACH (DE, AT, CH)
| Dimension | Guideline |
|-----------|-----------|
| Formality | High — "Sie" (formal you), professional tone |
| Humor | Conservative; avoid sarcasm/wordplay in CTAs |
| CTA style | Indirect: "Jetzt entdecken" over "Jetzt kaufen" |
| Trust signals | TÜV/ISO certifications, "Datenschutz", Impressum (legally required) |
| Legal | Impressum mandatory · DSGVO (GDPR) · Widerrufsrecht (right of withdrawal) |
| Currency | EUR (DE/AT), CHF (CH) |
| Color symbolism | Blue = trust, Green = eco, Red = caution (NOT urgency) |
| Brand substitution | Walmart → MediaMarkt · Home Depot → Hornbach · Amazon → Otto/Zalando |
| Text expansion | +25–35% vs EN — plan longer headlines/buttons |

### Francophone (FR, BE, CA-FR, CH-FR)
| Dimension | Guideline |
|-----------|-----------|
| Formality | Medium-high — "vous" default; "tu" only youth/casual brands |
| Humor | Sophisticated appreciated; avoid blunt humor |
| CTA style | Elegant: "Découvrir nos solutions" over "Achetez maintenant" |
| Trust signals | "Fabriqué en France", professional certifications, press mentions |
| Legal | Mentions légales required · CNIL (data) · CGV (terms) |
| Currency | EUR (FR/BE), CAD (CA-FR), CHF (CH-FR) |
| Color symbolism | Blue = stability, White = purity/luxury, Red = passion |
| Brand substitution | Walmart → Carrefour · Amazon → Fnac/Cdiscount · Target → Leclerc |
| Text expansion | +15–25% vs EN |

### Hispanic (ES, LATAM)
| Dimension | Guideline |
|-----------|-----------|
| Formality | Varies: Spain "usted" formal; LATAM mixed |
| Humor | Warm, relational; self-deprecating accepted |
| CTA style | Warm/personal: "Empieza tu viaje" over "Comprar ahora" |
| Trust signals | Community proof, family themes, celebrity endorsements |
| Legal | LOPD (Spain); each LATAM country has own regulations |
| Currency | EUR (ES); regional: MXN, ARS, COP, CLP, PEN |
| Color symbolism | Red = energy/passion, Yellow = warmth, Blue = trust |
| Brand substitution | Walmart → Mercadona (ES) / Coppel (MX) · Amazon → MercadoLibre |
| Text expansion | +15–25% vs EN |

### Japanese (JA)
| Dimension | Guideline |
|-----------|-----------|
| Formality | Very high — keigo (honorific language) expected in business |
| Humor | Subtle; no direct humor in B2B; kawaii OK in B2C |
| CTA style | Subtle/polite: "お問い合わせ" (inquire) over direct "buy now" |
| Trust signals | Company longevity, ISO certs, endorsements from recognized institutions |
| Legal | APPI (personal info) · Tokutei Shōtorihiki (commercial transactions) law |
| Currency | JPY — no decimals |
| Color symbolism | White = purity, Red = vitality/celebration, Black = formality |
| Brand substitution | Amazon → Rakuten · Google Shopping → Yahoo! Shopping Japan |
| Text contraction | −10–25% vs EN (more compact) |

### Default profile (unlisted locales) — 7-step checklist
1. Research formality registers (e.g. Korean has 7 speech levels).
2. Check text direction: RTL for Arabic, Hebrew, Farsi, Urdu.
3. Verify number/date formats via CLDR (Unicode Common Locale Data Repository).
4. Research legal requirements: privacy law, business registration, consumer protection.
5. Check expansion ratio: Germanic/Slavic expand, CJK contract.
6. Verify currency + local payment method preferences.
7. Research color meanings for the culture.
Note in output that assessment used general guidelines, not a pre-built profile.

## 6. Locale format reference

### Numbers
| Locale | Thousands | Decimal | Example |
|--------|-----------|---------|---------|
| en-US / en-GB | , | . | 1,234.56 |
| de-DE / de-AT | . | , | 1.234,56 |
| de-CH | ' | . | 1'234.56 |
| fr-FR / fr-CA | (space) | , | 1 234,56 |
| es-ES | . | , | 1.234,56 |
| es-MX | , | . | 1,234.56 |
| ja-JP / ko-KR | , | . | 1,234 (no decimals in most contexts) |
| zh-CN | , | . | 1,234.56 |
| pt-BR / it-IT / nl-NL | . | , | 1.234,56 |

### Dates
| Locale | Format | Example |
|--------|--------|---------|
| en-US | MM/DD/YYYY | 04/14/2026 |
| en-GB / fr-FR / es-ES / pt-BR | DD/MM/YYYY | 14/04/2026 |
| de-DE | DD.MM.YYYY | 14.04.2026 |
| ja-JP | YYYY/MM/DD or YYYY年MM月DD日 | 2026/04/14 |
| ko-KR | YYYY.MM.DD | 2026.04.14 |
| zh-CN | YYYY年MM月DD日 | 2026年04月14日 |
| Some LATAM | DD-MM-YYYY | 14-04-2026 |

### Currency
| Locale | Symbol | Placement | Example |
|--------|--------|-----------|---------|
| en-US | $ | Before | $1,234.56 |
| en-GB | £ | Before | £1,234.56 |
| de-DE / fr-FR / es-ES | € | After + space | 1.234,56 € / 1 234,56 € |
| ja-JP | ¥ | Before | ¥1,234 (JPY has no decimals) |
| pt-BR | R$ | Before | R$ 1.234,56 |
| ko-KR | ₩ | Before | ₩1,234 |
| zh-CN | ¥ | Before | ¥1,234.56 |
| de-CH | CHF | Before | CHF 1'234.56 |

### Addresses
| Region | Order | Example |
|--------|-------|---------|
| US/CA | Street, City, State ZIP | 123 Main St, Austin, TX 78701 |
| UK | Street, City, Postcode | 10 Downing St, London, SW1A 2AA |
| DE/AT | Street Nr, PLZ City | Hauptstr. 1, 10115 Berlin |
| FR | Street, Code Postal City | 1 Rue de Rivoli, 75001 Paris |
| JP | Postal City District Street | 〒100-0001 東京都千代田区千代田1-1 |

### Phones (international format, correct country code required)
| Region | Format | Example |
|--------|--------|---------|
| US | +1 (XXX) XXX-XXXX | +1 (512) 555-0123 |
| UK | +44 XXXX XXXXXX | +44 2071 234567 |
| DE | +49 XXX XXXXXXX | +49 30 12345678 |
| FR | +33 X XX XX XX XX | +33 1 23 45 67 89 |
| JP | +81 X-XXXX-XXXX | +81 3-1234-5678 |

### Text expansion vs English (UI/layout planning)
| Language | Ratio | Impact |
|----------|-------|--------|
| German | +25–35% | Longer headlines, buttons, nav labels |
| French / Spanish / Italian / Portuguese | +15–25% | Moderate expansion |
| Dutch | +10–20% | Slight expansion |
| Japanese | −10–25% | Contraction |
| Korean | −10–20% | Contraction |
| Chinese | −20–30% | Significant contraction |

### Format validation rules (6 steps)
1. Scan number patterns (prices, statistics, measurements) on each page.
2. Compare against expected format for the declared language.
3. Flag US-format numbers on non-US pages (e.g. "$1,234.56" on de-DE — should be "1.234,56 €").
4. Check date formats in posts, copyright notices, update timestamps.
5. Verify currency symbols match target market.
6. Verify phone numbers use international format with correct country code.

## 7. Machine-translation QA (Jan 2025 QRG §4.6.5)

Google's **January 23, 2025** Quality Rater Guidelines update explicitly classifies **machine-translated content with no human review** as scaled content abuse (§4.6.5): *"Using automated tools (generative AI or otherwise) as a low-effort way to produce many pages that add little-to-no value."*

Rule: MT is fine **when reviewed and corrected by a human speaker**. Raw MT — or "lightly post-edited" output still containing hallucinated terms, wrong gender/number agreement, or untranslated proper nouns — is treated as scaled content abuse.

### Signals to surface in audits
| Signal | Severity | Notes |
|--------|----------|-------|
| Multiple hreflang alternates whose content is identical except header chrome | Critical | Body never translated — just template-wrapped |
| `lang="xx"` on `<html>` doesn't match body language | High | Translation pipeline output with no final QA |
| Auto-translated meta description > 160 chars (untrimmed) | Medium | Translator overran snippet limit — no human caught it |
| `lang` attribute `auto` or missing | Medium | Confuses hreflang + AI crawlers |
| Untranslated proper nouns/product names in body | Low (heuristic) | Common MT failure mode, hard to detect automatically |
| Schema.org `inLanguage` absent or wrong vs body | Medium | Cross-check `inLanguage` in every multi-language audit |

### Do NOT flag
- Few MT pages **clearly labelled as MT** (human-translation-fallback pattern) — QRG explicitly permits honestly-labelled, clearly-scoped MT.
- Machine-translated **UI strings** — that's i18n, not "content".
- `lang="auto"` when no fallback signal can be fetched — be conservative, don't claim what can't be verified.

### Delegation heuristics
- Per-page hreflang validation → stays in this scope.
- Broader scaled-content scoring (entropy of translated pages, AI-pattern detection in body) → content-quality tooling.
- Google auto-translate widget detection → look for the `.goog-te-banner-frame` iframe. Widget translation is **exempted** from MT-scaled-content abuse but produces poor passage citability anyway.

Primary sources: Jan 2025 QRG §4.6.5 (https://services.google.com/fh/files/misc/hsw-sqrg.pdf); John Mueller, Search Off the Record episodes 2024–2025 (MT OK when human-reviewed; bulk unreviewed MT is abuse). Last verified 2026-05-17.

## 8. Audit error handling
| Scenario | Action |
|----------|--------|
| URL unreachable (DNS/connection) | Report clearly; do NOT guess site structure |
| No hreflang tags found | Report absence; check other i18n signals (subdirectories, subdomains, ccTLDs); recommend appropriate method |
| Invalid language/region codes | List each invalid code + correct replacement; output corrected tag set ready to implement |
| No cultural profile for language | Use Default Profile checklist; note assessment is general, not profile-based |
| Content parity directory empty | Report no files found; suggest verifying path or providing live URL |

## Sources
- claude-seo (MIT, AgriciDaniel): `skills/seo-hreflang/SKILL.md`
- claude-seo: `skills/seo-hreflang/references/content-parity.md`
- claude-seo: `skills/seo-hreflang/references/cultural-profiles.md`
- claude-seo: `skills/seo-hreflang/references/locale-formats.md`
- claude-seo: `skills/seo-hreflang/references/machine-translation-qa.md`
- Cultural profiles / content parity / locale formats original concept: Chris Muller (Pro Hub Challenge)
- Existing `consolidated-seo-geo` SKILL.md reviewed in full: contained no international/hreflang content — nothing to merge.
