---
name: seo-geo
description: SEO technique + contenu + GEO-IA complet. Scoring, seuils CWV (INP), citabilite, schema + deprecations 2023-2026, E-E-A-T QRG 2025, quality gates, local/GBP, e-commerce, hreflang, backlinks, clustering SERP, drift monitoring, Google APIs. Router + 13 references chargees a la demande.
sources_read:
  - phaam/.claude/skills/geo-* + seo-* + on-page-seo-auditor + technical-seo-checker
  - agents/seo-analysis-monitoring, SearchFit SEO plugin, knowledge-work-plugins/marketing
  - AgriciDaniel/claude-seo v2.2.0 (MIT) — extraction integrale 2026-07-16 : 25 sub-skills, 18 agents, 50 scripts, refs (scout 20/24 FORK, docs/scouted/claude-seo.md)
globs: "**/*.html,**/*.tsx,**/*.jsx,**/*.php,**/*.md"
---

# SEO & GEO — Skill Consolide (router)

**Progressive disclosure** : ce fichier = regles toujours actives + formules coeur. Le detail profond vit dans `references/` — charger UNIQUEMENT le fichier du sujet traite, jamais tous.

## Routing — charger a la demande

| Besoin | Reference | Contenu cle |
|---|---|---|
| Lancer un audit complet | `references/audit-methodology.md` | Pipeline render→detect→crawl→paralleliser→scorer→synthese, roster 8+7 subagents, detection industrie, framework 10 principes, falsifiabilite, extensions data |
| Schema.org | `references/schema.md` | Types actifs + proprietes, timeline deprecations 2023-2026 + remplacements, generateurs, validation merchant, scoring 100 pts |
| GEO / AI search | `references/geo-ai-search.md` | Google AI Optimization Guide, 5 mythes rejetes (llms.txt...), citabilite, crawler tiers, regles par plateforme, stats 2026 |
| SEO technique / CWV | `references/technical.md` | 9 categories, INP-era, LCP subparts, Speculation Rules/bfcache, IndexNow, SPA rendering, agent-friendly pages |
| Contenu / E-E-A-T | `references/content-eeat.md` | QRG sept 2025, Who/How/Why, detection filler/AI-patterns, humanization, briefs, densite, templates par type de page |
| SEO local / GBP / Maps | `references/local-maps.md` | Signaux GBP + deprecations, rubrique 25 champs, reviews, citations tiers 1-3, geo-grid/SoLV |
| E-commerce | `references/ecommerce.md` | Merchant listing gates, ProductGroup variants, IPTC AI-images, UCP, parasite-SEO |
| International / hreflang | `references/international.md` | 8 checks + severites, parite contenu /100, profils culturels, formats locaux, MT-QA |
| Backlinks / off-page | `references/backlinks-offpage.md` | Stack gratuit Moz/Bing/CommonCrawl, health score 7 facteurs, 30 patterns toxiques, anchors, expired-domain heritage |
| Clustering / SXO | `references/clustering-sxo.md` | Clustering par overlap SERP (jamais similarite texte), hub-spoke, taxonomie page-type, persona scoring |
| Re-audit / monitoring | `references/drift-monitoring.md` | Baseline 13 champs SQLite, 17 regles diff CRITICAL/WARNING/INFO — "git for SEO" |
| Sitemaps / images / programmatic | `references/sitemaps-images-programmatic.md` | Quality gates programmatic, sitemap rules, image SEO, comparison pages, plans par industrie |
| Google APIs / FLOW | `references/google-apis-flow.md` | 4 tiers credentials, pieges GSC (totaux agreges), Indexing API, CrUX History, Keyword Planner, boucle FLOW (CC BY 4.0) |

## 1. SEO Health Score (audit, 0-100)

| Categorie | Poids |
|---|---|
| Content Quality | 23% |
| Technical SEO | 22% |
| On-Page SEO | 20% |
| Schema / Structured Data | 10% |
| Performance (CWV) | 10% |
| AI Search Readiness | 10% |
| Images | 5% |

Priorites : **Critical** (bloque l'indexation/penalite — immediat) | **High** (impact rankings — 1 semaine) | **Medium** (opportunite — 1 mois) | **Low** (backlog).

**Format de chaque recommandation (falsifiabilite obligatoire)** : (1) observation premier-principe, (2) dependances vers d'autres recos, (3) "comment saurait-on que ca a echoue ?", (4) leading indicator surveillable sans re-audit.

## 2. GEO — regles toujours actives

- **GEO = SEO** (position officielle Google) : etre indexe + snippet-eligible est le plancher d'eligibilite pour TOUTE feature IA. Pas d'index IA separe.
- **Passage citable optimal : 134-167 mots**, autonome (self-contained), reponse directe dans les 150 premiers mots.
- Citability = (AnswerBlock × 0.30) + (SelfContainment × 0.25) + (Structure × 0.20) + (Stats × 0.15) + (Uniqueness × 0.10). Definitions +2.1x citations, stats sourcees +40%, citations d'autorite +115%.
- **Brand mentions correlent 3x plus que les backlinks** avec la visibilite IA (Ahrefs dec 2025, 75K marques). YouTube 0.737 (plus fort signal), DR backlinks 0.266.
- Seulement **11%** des domaines cites a la fois par ChatGPT et Google AIO pour la meme requete → optimisation par plateforme obligatoire.
- Plateformes : AIO = 92% citations du top 10 organique ; ChatGPT = Wikipedia #1 (47.9%) + index Bing requis ; Perplexity = Reddit #1 (46.7%) + fraicheur.
- **Mythes rejetes par Google** (ne JAMAIS recommander comme levier) : llms.txt, chunking, reecriture AI-specific, mention-farming, sur-investissement schema pour l'IA. Detail + preuves : `references/geo-ai-search.md`.

## 3. AI Crawlers — tiers robots.txt

- **Tier 1 (50%) — ne JAMAIS bloquer** : GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot
- **Tier 2 (25%)** : Google-Extended (n'affecte PAS Google Search, seulement Gemini training), GoogleOther, Applebot-Extended, Amazonbot, FacebookBot
- **Tier 3 (15%)** : CCBot, anthropic-ai, Bytespider, cohere-ai
- `AI_Visibility = Tier1×0.50 + Tier2×0.25 + NoBlanketBlocks×0.15 + AI_Files×0.10`
- **SSR obligatoire** : les crawlers IA n'executent pas le JS. CSR-only = invisible aux plateformes IA.

## 4. Core Web Vitals (75e percentile, field data)

- **LCP < 2.5s** | **INP < 200ms** | **CLS < 0.1** | TTFB < 800ms
- **INP a remplace FID le 2024-03-12 ; FID retire de tous les outils Chrome le 2024-09-09. Ne JAMAIS mentionner FID.**
- LCP = contrainte dominante mobile. Diagnostic par subparts (TTFB / load delay / load duration / render delay) : `references/technical.md`.

## 5. Schema JSON-LD — regles critiques

- JSON-LD prefere (position Google). Server-rendered, jamais injecte cote client.
- **Deprecations a connaitre** : HowTo (rich results morts sept 2023), **FAQPage rich results retires pour TOUS les sites le 2026-05-07** (garder le markup existant comme signal IA/entite — flag Info, jamais Critical, ne pas recommander de nouveaux FAQPage pour la SERP), SpecialAnnouncement (juil 2025), ClaimReview/VehicleListing/EstimatedSalary/LearningVideo/CourseInfo (juin 2025). Timeline complete + remplacements : `references/schema.md`.
- **sameAs = propriete #1 pour la reconnaissance d'entite IA.** Priorite : Wikipedia > Wikidata > LinkedIn > YouTube > X/Facebook/Crunchbase/GitHub.
- Scoring 100 pts (Organization 15, sameAs 5+ plateformes 15, server-rendered 10, Article+author 10, business-specific 10, JSON valide 10, Breadcrumb 5, WebSite+SearchAction 5, speakable 5, knowsAbout 5, zero deprecated 5, FAQ 5).
- E-commerce : `hasMerchantReturnPolicy` + `shippingDetails` REQUIS pour les merchant listings → `references/ecommerce.md`.

## 6. E-E-A-T (QRG 11 sept 2025)

- Poids : **Trust 30% / Expertise 25% / Authority 25% / Experience 20%**. Trust = pilier le plus lourd.
- YMYL etendu (sept 2025) aux sujets politiques/sociaux. Bylines + pages auteur REQUISES pour YMYL.
- Test **Who / How / Why** avant tout scoring de contenu. Contenu IA acceptable si Search Essentials OK ; spam si scale de pages low-value (QRG §4.6.5/§4.6.6).
- Update dec 2025 : E-E-A-T etendu a TOUTES les requetes competitives (affiliate -71%, YMYL -67% de trafic pour les sites faibles). Detection filler/AI-patterns + humanization : `references/content-eeat.md`.

## 7. Meta & on-page (checklist rapide)

- Title 50-60 chars (keyword dans les 30 premiers) | Meta description 150-160 | URL < 60 chars, hyphens, lowercase
- H1 unique avec keyword | hierarchie H2/H3 stricte | keyword dans les 100 premiers mots
- Densite primaire 0.5-1.5% (max 1-3% avec variantes semantiques) | 20-30 synonymes/LSI
- Alt text 10-125 chars descriptif | images > 200 KB = Warning, > 500 KB = Critical, WebP/AVIF, width/height fixes (CLS)
- og:title/description/image/url + twitter:card obligatoires
- Featured snippets : paragraph 40-60 mots reponse directe | list 5-8 items | table pour comparaisons

## 8. Quality gates contenu (seuils durs)

| Type de page | Min mots | Unique % |
|---|---|---|
| Homepage | 500 | 100% |
| Service/Feature | 800 | 100% |
| Blog post | 1 500 | 100% |
| Produit | 400 | 80%+ |
| Categorie / About | 400 | 100% |
| Landing | 600 | 100% |
| Location primaire | 600 | 60%+ |
| Location secondaire | 500 | 40%+ |

- **Location pages : WARNING a 30+, HARD STOP a 50+** (doorway-page risk) avec justification obligatoire.
- **Programmatic : WARNING a 100+ pages non relues, HARD STOP a 500+ ; < 40% contenu unique = thin flag, < 30% = stop.** Publier par batches 50-100 avec 2-4 semaines de monitoring. Detail : `references/sitemaps-images-programmatic.md`.

## 9. Cannibalisation & refresh

- **1 keyword primaire = 1 page** (mapping strict keyword → URL). Detection : meme keyword/intent sur 2+ pages, titres similaires.
- Resolution : merger vers l'URL la plus performante + 301, ou reecrire pour intent different + canonical + internal linking ajuste.
- Refresh : HIGH = perte 3+ positions / info obsolete (immediat) ; MEDIUM = stagnation 6+ mois (ce mois) ; stats > 2 ans a rafraichir, dateModified dans le schema.
- Clustering par **overlap SERP** (7-10 URLs partagees = meme post, 4-6 = meme cluster, 2-3 = interlink, 0-1 = separer) : `references/clustering-sxo.md`.

## 10. Topic clusters & maillage

- Pillar 2 500-4 000 mots liant CHAQUE spoke ; spokes 1 200-1 800 mots ; min 3 liens entrants/post ; zero orphelin ; aucune anchor > 40% de part.
- Reponse directe 150 premiers mots + FAQ structuree + donnees en tableaux + summary box = top 4 GEO-first items.

## 11. Audit express (checklist minimale)

- [ ] Titles/meta uniques aux bonnes longueurs, H1 unique, hierarchie propre
- [ ] robots.txt (Tier 1 IA non bloque) + sitemap + canonicals + zero 404/chaines
- [ ] HTTPS, CWV verts (LCP/INP/CLS), SSR actif
- [ ] Schema valide, zero type deprecie, sameAs 5+
- [ ] Passages citables 134-167 mots, reponse directe en tete
- [ ] Pas de thin content (gates §8), pas de cannibalisation
- [ ] E-E-A-T : auteur, dates, contact, preuves premiere main
- Audit complet orchestre → `references/audit-methodology.md` ; re-audit comparatif → `references/drift-monitoring.md`

## Project notes — MAWT website

- Site bilingue **EN/FR** (routing localise via proxy.ts, url-map.ts) → `references/international.md` est PRIORITAIRE : hreflang self-referencing + x-default, parite de contenu EN/FR, formats locaux FR-CH.
- Next.js App Router = SSR OK par defaut — verifier qu'aucun contenu SEO-critique n'est client-only (sections GSAP/Framer lazy).
- Copy = dictionaries en.json/fr.json — les recommandations de contenu passent par les dictionnaires, JAMAIS de texte en dur dans les composants.
- Composants SEO existants : `src/components/seo/` (structured data) — auditer avant de generer du schema neuf.
- Cible : agence premium Geneve/Suisse → local SEO (`references/local-maps.md`) pertinent pour "agence [service] Geneve".

## Sources RAG
Consolidation 2026-07-16 : extraction integrale de AgriciDaniel/claude-seo v2.2.0 (MIT — 25 sub-skills, 18 agents, 50 scripts Python lus par 14 agents paralleles) fusionnee avec le skill existant (sources phaam/SearchFit/knowledge-work). Contenu FLOW sous CC BY 4.0 (attribution dans `references/google-apis-flow.md`). Rapport scout : `docs/scouted/claude-seo.md`.
