> Deep reference for GEO / AI-search optimization: citability scoring, Google AI Optimization Guide alignment, llms.txt evidence, debunked myths, AI crawler policy, and per-platform citation rules.

## 0. Framing rule (Google primary source)

> "Optimizing for generative AI search is **still SEO** from Google's perspective. AEO and GEO are rebranded labels for the same work." — Google AI Optimization Guide (developers.google.com/search/docs/fundamentals/ai-optimization-guide)

- **Eligibility floor**: a page must be **indexed AND snippet-eligible in Google Search** to appear in any AI feature. There is no separate "AI index".
- AI Overviews / AI Mode layer two techniques on the same ranking systems: (1) **RAG/grounding** — retrieve indexed pages, generate answer with source links; (2) **query fan-out** — multiple related sub-queries pull in additional results.
- Audits must frame GEO findings as **SEO fundamentals applied to AI-search surfaces**, never as a separate discipline. When a community claim contradicts Google's guide, defer to Google and note the contradiction in the report.

## 1. Myths debunked (Google, AI Optimization Guide §Myths)

Google explicitly says you do **NOT** need to:

| Rejected claim | Status |
|---|---|
| Create `llms.txt` or AI-specific markup files | Rejected — independently confirmed by evidence in §6 |
| "Chunk" content into small pieces for AI | Rejected |
| Rewrite content with AI-specific phrasings / long-tail keyword variations | Rejected |
| Chase inauthentic mentions across blogs / forums / videos (mention-farming) | Rejected |
| Over-invest in structured data specifically for AI features | Rejected |

What DOES matter per Google: **unique, non-commodity, first-hand content**. Google's own contrast: "7 Tips for First-Time Homebuyers" (commodity) vs "Why We Waived the Inspection & Saved Money: A Look Inside the Sewer Line" (lived experience).

**Who / How / Why test** (creating-helpful-content companion guide):
- **Who** created it — bylines where readers expect them; author background pages **required for YMYL**.
- **How** it was created — disclose process for AI-assisted content where readers would reasonably ask.
- **Why** it exists — "to help people", not "to attract search clicks".
- YMYL scope (health, finance, safety) **expanded Sept 2025 QRG to include political/social topics**.

Google's self-audit warning signs: writing to a target word count (there isn't one); entering niches without expertise for traffic; faking publication-date freshness; mass content churn for "freshness" signals.

**AI content policy**: generative AI content is fine if it meets Search Essentials; it becomes spam when used to scale low-value pages (QRG §4.6.5 scaled content abuse, §4.6.6 low-effort main content). Two enforced requirements:
1. Merchant Center AI-generated product images must carry IPTC `DigitalSourceType: TrainedAlgorithmicMedia` metadata.
2. AI-generated product titles/descriptions must be separately specified and labeled AI-generated in the merchant feed.

**Forward-looking**: Google's guide covers AI **agents** interacting via 3 channels (screenshots + vision model, raw HTML/DOM, browser accessibility tree), and name-drops **WebMCP** (site↔agent standard, early stage) and **UCP** (Universal Commerce Protocol — Google + Shopify + Etsy + Walmart + Visa/Mastercard).

## 2. Key statistics (as of May 2026)

| Metric | Value | Source |
|---|---|---|
| AI Overviews reach | 1.5B users/month, 200+ countries | Google |
| AI Overviews query coverage | 50%+ of all queries | Industry data |
| AI Mode monthly users | 1B+ (surpassed May 2026) | Google |
| AI Mode default model | Gemini 3.5 Flash (global since I/O 2026) | Google |
| AI-referred sessions growth | +527% (Jan–May 2025) | SparkToro |
| ChatGPT weekly active users | 900M | OpenAI |
| Perplexity monthly queries | 500M+ | Perplexity |

## 3. Brand mentions > backlinks

**Brand mentions correlate 3x more strongly with AI visibility than backlinks** (Ahrefs Dec 2025 study, 75,000 brands).

| Signal | Correlation with AI citations |
|---|---|
| YouTube mentions | **~0.737** (strongest) |
| Reddit mentions | High |
| Wikipedia presence | High |
| LinkedIn presence | Moderate |
| Domain Rating (backlinks) | **~0.266** (weak) |

- Only **11% of domains** are cited by both ChatGPT and Google AI Overviews for the same query → platform-specific optimization is mandatory.
- YouTube threshold heuristic: channel 10K+ subscribers + regular publishing = citable source for Gemini/Perplexity.

## 4. GEO Health Score (0–100) — 5 dimensions

| Dimension | Weight |
|---|---|
| Citability | 25% |
| Structural Readability | 20% |
| Authority & Brand Signals | 20% |
| Technical Accessibility | 20% |
| Multi-Modal Content | 15% |

Legacy Factory composite (kept for continuity in older audits):
`GEO_Score = Platform×0.25 + Content×0.25 + Technical×0.20 + Schema×0.15 + Brand×0.15` — scale: 85–100 Excellent | 70–84 Good | 55–69 Average | 40–54 Weak | 0–39 Critical. New audits use the 5-dimension model above.

### 4.1 Citability (25%)

- **Optimal passage length: 134–167 words** (Princeton/Georgia Tech/IIT Delhi 2024 research).
- **~44% of AI citations come from the first 30% of a page** (SE Ranking) → front-load the self-contained answer.
- Direct answer in **first 40–60 words of each section**; direct answer in **first 150 words of the page** is a prerequisite for all AI platforms.
- Sub-score formula: `Citability = AnswerBlock×0.30 + SelfContainment×0.25 + Structure×0.20 + Stats×0.15 + Uniqueness×0.10`
- Measured lifts: definitions ("X is…" / "X refers to…") **+2.1x** citations; statistics with source **+40%**; authority quotes **+115%**.

| Strong signals | Weak signals |
|---|---|
| Quotable sentences with specific facts/statistics | Vague, general statements |
| Self-contained answer blocks (extractable without context) | Opinion without evidence |
| Direct answer in first 40–60 words of section | Buried conclusions |
| Claims attributed to specific sources | No specific data points |
| "X is…" / "X refers to…" definition patterns | — |
| Unique data points not found elsewhere | — |

### 4.2 Structural Readability (20%)

- **92% of AI Overview citations come from top-10 ranking pages**, but **47% come from pages ranking below position 5** — different selection logic than blue links.
- Strong: clean H1→H2→H3 hierarchy; question-based headings; short paragraphs (2–4 sentences); tables for comparative data; ordered/unordered lists; FAQ sections in clear Q&A format (**structured content, not FAQ schema for commercial sites**).
- Weak: wall of text; inconsistent heading hierarchy; no lists/tables; info buried in paragraphs.

### 4.3 Multi-Modal Content (15%)

Content with multi-modal elements sees **156% higher selection rates**. Check: text + relevant images; embedded/linked video; infographics/charts; interactive elements (calculators, tools); structured data supporting media.

### 4.4 Authority & Brand Signals (20%)

- **Recency**: content under **3 months old is ~3x more likely** to be cited in AI answers; pages stale **6+ months lose citation eligibility** (SE Ranking, 1.3M-citation study). A scheduled refresh program is one of the highest-leverage GEO plays.
- Strong: author byline with credentials; publication + last-updated dates; citations to primary sources; organization credentials; expert quotes with attribution; entity in Wikipedia/Wikidata; mentions on Reddit/YouTube/LinkedIn.
- Weak: anonymous authorship; no dates; no sources; no cross-platform brand presence.

### 4.5 Technical Accessibility (20%)

- **AI crawlers do NOT execute JavaScript.** Client-side-only rendering = invisible to AI platforms. SSR is a binary, critical requirement.
- Check: SSR vs client-only content; AI crawler access in robots.txt; `/llms.txt` presence (report-only, see §6); RSL 1.0 licensing terms.

## 5. AI crawlers — robots.txt policy

| Crawler | Owner | Purpose |
|---|---|---|
| GPTBot | OpenAI | ChatGPT web search |
| OAI-SearchBot | OpenAI | OpenAI search features |
| ChatGPT-User | OpenAI | ChatGPT browsing |
| ClaudeBot | Anthropic | Claude web features |
| PerplexityBot | Perplexity | Perplexity AI search |
| CCBot | Common Crawl | Training data (often blocked) |
| anthropic-ai | Anthropic | Claude training |
| Bytespider | ByteDance | TikTok/Douyin AI |
| cohere-ai | Cohere | Cohere models |

**Policy**: allow GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot for AI-search visibility. Block CCBot / training-only crawlers only if desired.

Tiered visibility scoring (Factory model):
- **Tier 1 (50% weight, never block)**: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot
- **Tier 2 (25%, case-by-case)**: Google-Extended, GoogleOther, Applebot-Extended, Amazonbot, FacebookBot. Note: Google-Extended does NOT affect Google Search — Gemini training only.
- **Tier 3 (15%, optional)**: CCBot, anthropic-ai, Bytespider, cohere-ai
- `AI_Visibility = Tier1_Allowed×0.50 + Tier2_Allowed×0.25 + NoBlanketBlocks×0.15 + AI_Files×0.10` — the AI_Files 10% component measures presence/hygiene only, NOT citation impact (see §6).

## 6. llms.txt — evidence-based position

**`/llms.txt` is not currently consumed by any major AI search system.** Report presence; assign **zero citation-ranking weight**.

| Source | Date | Finding |
|---|---|---|
| John Mueller (Google), Reddit + Bluesky | 2025 | "No AI system currently uses llms.txt." Compared it to deprecated meta keywords. |
| Gary Illyes (Google), Search Central Live | July 2025 | Google has no plans to support llms.txt. |
| SE Ranking, 300k-domain study | Nov 2025 | Among the 50 most AI-cited domains, **only one** had `/llms.txt`. |
| OtterlyAI, server-log audit | 2025 | **0.1%** of AI-bot traffic targets `/llms.txt` (84 of 62,100 requests). |
| Anthropic, Stripe, Cloudflare, NVIDIA | 2024–2025 | All publish `llms.txt`; **none** state their crawlers consume third-party files. |

**Where it DOES matter**: AI coding agents (Cursor, Continue, Cline, Claude Code) consume `llms.txt` / `llms-full.txt` for per-library docs; Mintlify auto-generates both for thousands of developer-docs sites. → Developer-tooling site: net win. Non-developer business site: purely defensive optionality (zero cost).

**Audit behavior**: report presence of `/llms.txt` and `/llms-full.txt`; note whether well-formed (Mintlify-style markdown); if generating one, ship with the banner "no major LLM provider has confirmed consumption as of May 2026; ship for optionality, not for citation".

**Format** (root of domain):
```
# Title of site
> Brief description

## Main sections
- [Page title](url): Description

## Optional: Key facts
- Fact 1
```

**Reversal triggers**: any major AI search system documents llms.txt consumption; SE Ranking/OtterlyAI follow-up shows request-rate inflection; Mueller/Illyes retract. Last verified 2026-05-17.

## 7. RSL 1.0 (Really Simple Licensing)

Standard published **December 2025** for machine-readable AI licensing terms. Backed by Reddit, Yahoo, Medium, Quora, Cloudflare, Akamai, Creative Commons. Audit: check RSL implementation and appropriate licensing terms.

## 8. Platform-specific rules

| Platform | Key citation sources | Optimization focus |
|---|---|---|
| **Google AI Overviews** | Strongly ranking-correlated (92% from top-10; 47% from positions 5+) | Traditional SEO + passage optimization, question headings, direct answers, tables, sourced stats |
| **Google AI Mode** (Gemini 3.5 Flash) | Weakly ranking-correlated; broader pool (**~9 domains cited/query**, Ahrefs) | Freshness, entity authority, citable passages beyond position 5 |
| **ChatGPT** | Wikipedia (**47.9%**, #1 source), Reddit (**11.3%**) | Entity presence, Wikipedia profile, Bing index, entity recognition |
| **Perplexity** | Reddit (**46.7%**, #1 source), Wikipedia | Community validation, multi-source corroboration, freshness |
| **Bing Copilot** | Bing index, authoritative sites | Bing SEO, IndexNow |

**Two Google citation engines, not one**: AI Mode and AI Overviews reach the same conclusion **~86%** of the time but cite the same URLs only **13.7%** of the time (Ahrefs, 540K query pairs). Score both surfaces separately — classic ranking feeds AI Overviews; AI Mode draws from a broader pool where freshness + entity authority outweigh raw position.

## 9. Entity linking — sameAs priority

`sameAs` is the single most important schema property for entity recognition by AI platforms. Target **5+ platforms**, in priority order:
1. Wikipedia (max authority) · 2. Wikidata (machine-readable entity) · 3. LinkedIn (Bing Copilot + ChatGPT signal) · 4. YouTube (Gemini + Perplexity signal) · 5. Twitter/X, Facebook, Crunchbase, GitHub · 6. Google Scholar, ORCID (academic) · 7. Instagram, app stores, sector directories.

Schema scoring (100-pt legacy Factory model, for AI discoverability audits): Organization/Person 15 · sameAs 5+ platforms 15 · server-rendered (not JS-injected) 10 · Article with author 10 · business-specific schema 10 · valid JSON + Schema.org types 10 · BreadcrumbList 5 · WebSite+SearchAction 5 · speakable 5 · knowsAbout 5 · no deprecated schemas 5 · FAQ schema 5. Caveat per Google §1: schema helps entity recognition generally — do not over-invest in structured data *specifically for AI features*.

## 10. Audit workflow rules

1. Fetch page + robots.txt for AI crawler rules; check `/llms.txt` and RSL 1.0.
2. Analyze citability (passage length, structure, directness) → **run passage-level scoring against boilerplate-stripped extracted text (trafilatura-style), not full HTML**, so navigation/footers don't dilute the signal.
3. Rendering check: raw fetch first; only spin up a headless render when an SPA shell is detected — compare pre-JS vs post-JS content to detect CSR dependency (what AI crawlers actually see is the pre-JS version).
4. Never fetch user-supplied URLs without SSRF/DNS-rebinding protection.
5. Evaluate authority signals (authorship, dates, citations, entity presence) and platform-specific visibility.
6. Optional live checks via DataForSEO MCP: `ai_optimization_chat_gpt_scraper` (real ChatGPT web-search visibility per query), `ai_opt_llm_ment_search` + `ai_opt_llm_ment_top_domains` (LLM mention tracking).

**Report contents** (`GEO-ANALYSIS.md`): GEO Readiness Score /100 with dimension breakdown; platform scores (Google AIO, AI Mode, ChatGPT, Perplexity, Bing Copilot); AI crawler access status per crawler; llms.txt status; brand-mention analysis (Wikipedia/Reddit/YouTube/LinkedIn); passages at 134–167 words identified; SSR check; top-5 highest-impact changes with effort estimates; schema recommendations; specific passages to rewrite.

**Error handling**:
| Scenario | Action |
|---|---|
| URL unreachable | Report error; never guess site content |
| AI crawlers blocked | List exactly which are blocked/allowed + robots.txt directives to fix |
| No llms.txt | Note absence; provide ready-to-use template (with the §6 optionality banner) |
| No structured data | Report gap; recommend Article, Organization, Person schema |

## 11. Prioritized playbook

**Quick wins**: (1) "What is [topic]?" definition in first 60 words; (2) 134–167-word self-contained answer blocks; (3) question-based H2/H3; (4) specific statistics with sources; (5) publication/update dates; (6) Person schema for authors; (7) allow Tier-1 AI crawlers.

**Medium effort**: (1) `/llms.txt` (optionality only); (2) author bio with credentials + Wikipedia/LinkedIn links; (3) SSR for key content; (4) entity presence on Reddit/YouTube; (5) comparison tables with data; (6) FAQ sections (structured content, not schema for commercial sites).

**High impact**: (1) original research/surveys (unique citability); (2) Wikipedia presence for brand/key people; (3) YouTube channel with content mentions; (4) comprehensive sameAs entity linking; (5) unique tools/calculators.

**GEO-first content top 6**: direct answer in first 150 words; structured FAQ; data in tables not prose; JSON-LD present; original first-hand data; Key Takeaways/Summary box.

## 12. Maintenance triggers

Re-verify quarterly (Google guide last verified 2026-05-18; llms.txt evidence 2026-05-17). Update this file when: Google publishes new myth-busting; policy docs revise eligibility/enforcement; WebMCP/UCP standards advance; any major AI system confirms llms.txt consumption; AI Mode model or citation-overlap studies are superseded.

## Sources

- claude-seo (AgriciDaniel, MIT): `skills/seo-geo/SKILL.md`
- claude-seo: `skills/seo-geo/references/google-ai-optimization-guide.md`
- claude-seo: `skills/seo-geo/references/llmstxt-evidence.md`
- claude-seo: `agents/seo-geo.md`
- existing consolidated-seo-geo (Factory) — GEO sections merged (legacy GEO_Score, citability sub-formula, crawler tiers, sameAs priority, schema 100-pt table)
- FLOW framework content, where referenced: CC BY 4.0 attribution to its original authors.