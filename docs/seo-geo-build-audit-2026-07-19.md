# Audit SEO/GEO & build — mawt.ch — 2026-07-19

## Score global : 70/100

Pondération contractuelle (Content 23 %, Technical 22 %, On-Page 20 %, Schema 10 %, CWV/Perf 10 %, AI Readiness 10 %, Images 5 %), mappée sur les 10 dimensions auditées :

| Catégorie (poids) | Dimensions sources | Score |
|---|---|---|
| Contenu / E-E-A-T (23 %) | content-eeat | **58** |
| Technique (22 %) | technical (78) + config (64) | **71** |
| On-page / intl / local (20 %) | international (86) + local (82) | **84** |
| Schema (10 %) | schema | **79** |
| CWV / Perf (10 %) | render-perf (70) + bundle (80) | **75** |
| AI Readiness (10 %) | geo-ai | **68** |
| Images / Media (5 %) | media | **42** |
| **Global pondéré** | | **70/100** |

Lecture : l'infrastructure (i18n, schema, NAP, robots/IA, ISR, fonts) est solide et au-dessus de la moyenne. Les deux boulets sont **le contenu** (auteurs anonymes, blog générique, piliers sous le plancher de mots, phrase hero cassée) et **les médias** (56,5 MB committés pour la vidéo mobile, 231 MB d'assets orphelins).

---

## Top 10 actions

Classées par ratio impact/effort.

| # | Action | Dimension | Sévérité | Effort | Gain attendu |
|---|---|---|---|---|---|
| 1 | Corriger la phrase hero cassée (« MAWT is a Swiss A Geneva studio » / « MAWT est une Un studio ») dans en.json + fr.json | content-eeat | **High** | S | Phrase canonique extractible correcte pour snippets et réponses IA, 2 locales |
| 2 | Boucher le trou soft-404 : `notFound()` sur lang invalide dans `[lang]/layout.tsx` | geo-ai | **High** | S | Fin de la surface illimitée de clones homepage indexables (200 + canonical auto-référent) |
| 3 | Committer le MotionMAWTMobile.mp4 ré-encodé (9,7 MB working tree vs 56,5 MB en git) | media | **High** | S | −83 % de stream mobile sur le hero ; empêche tout déploiement du fichier 17 Mbps |
| 4 | Ajouter un og:image fallback dans `[lang]/layout.tsx` (1200×630, <500 KB) | technical | **Medium** | S | Previews sociales + cartes AI-answer sur 100 % des pages ; restaure summary_large_image |
| 5 | Lier les 3 paires blog EN/FR via `translationOf` dans Sanity (zéro code) | international | **Medium** | S | hreflang + alternates sitemap automatiques sur les 6 seuls URLs qui en manquent |
| 6 | Corriger l'URL LinkedIn (`/in/mawt.ch` → `/company/...`) et monter sameAs à 5+ plateformes (Wikidata, YouTube, X, GitHub, local.ch) | schema / geo-ai | **Medium** | S | Réconciliation d'entité IA — signal n°1 selon la grille ; actuellement 2 URLs dont 1 probablement morte |
| 7 | Supprimer `public/Approach Page` (231 MB, 194 fichiers, zéro référence) + entrées proxy.ts:81-82 | media / config | **Medium** | S | public/ passe de 301 → ~70 MB par déploiement |
| 8 | Dédupliquer « \| MAWT » dans les titles de 9+ templates (pattern `{ absolute }`) | technical | **Medium** | S | SERP propres, caractères de title récupérés, 2 locales |
| 9 | Auteurs nommés : bios équipe sur /about + byline Person (schema auteur Sanity déjà en place, jamais peuplé) | content-eeat | **High** | M | Le test « Who » passe enfin — pénalité d'anonymat post-core-update Déc 2025 levée |
| 10 | Étoffer les 7 pages piliers services EN (374–715 mots) au-dessus du plancher 800 mots | content-eeat | **High** | L | Pages commerciales principales conformes au critère à poids 100 % du skill |

---

## Technique — 78/100

- **Medium — Aucun og:image / twitter:image sur tout le site.** Evidence : `grep -c 'og:image' = 0` sur /en, /fr, /en/work, /en/work/kouleta, /en/news/* ; le layout (`src/app/[lang]/layout.tsx:61-77`) n'a pas d'images dans openGraph/twitter, et les pages définissant leur propre objet twitter (page.tsx:55, work/page.tsx:33) dégradent la carte en `summary`. Nuance vérifiée : le code des pages détail (work/[slug], news/[slug]) mappe déjà l'image Sanity — ce sont les documents Sanity qui n'ont pas d'image. `public/cover-image.png` (2,2 MB) n'est référencé nulle part sauf l'allowlist proxy. Fix : fallback `openGraph.images` + `twitter.images` dans le layout avec un asset optimisé 1200×630 <500 KB ; uploader les covers dans Sanity. *Échec si :* après déploiement, le debugger LinkedIn/OpenGraph ne montre toujours pas d'image sur /en, ou `twitter:card` reste `summary` sur les pages listing — indicateur avancé : `curl | grep og:image` sur 5 pages en préprod.
- **Medium — Vidéo hero mobile 56,5 MB committée (5× le fichier desktop).** Evidence : HEAD contient MotionMAWTMobile.mp4 à 56 546 827 bytes ; le working tree contient déjà un ré-encode 9 674 913 bytes non committé (vérifié ffprobe, 2,91 Mbps). Fix : committer le fichier remplacé ; optionnel, viser 3-6 MB via 720×1280 (voir Quick wins). *Échec si :* `git show HEAD:public/MotionMAWTMobile.mp4 | wc -c` > 10 MB après le prochain push — indicateur avancé : taille du blob en CI.
- **Medium — Suffixe « | MAWT » dupliqué sur 9+ templates (2 locales).** Evidence : `<title>Services | MAWT, AI agency in Geneva | MAWT</title>`, `Privacy policy | MAWT | MAWT`, etc. — template layout `%s | MAWT` (layout.tsx:56) appliqué sur des titles contenant déjà la marque. Fix : retirer la marque des strings ou utiliser `title: { absolute }` comme la homepage (page.tsx:35). Concernés : services, approach, privacy, security, terms, cookies, legal-notice. *Échec si :* un audit `curl` post-fix trouve encore `MAWT.*MAWT` dans un `<title>` — indicateur avancé : grep automatisé sur le HTML rendu des 9 routes.
- **Low — /en/approach sert un duplicate 200 au lieu d'un 308.** Evidence : /en/approach → 200 avec canonical vers /en/our-process, alors que /en/geneve et /en/legal font 308. Fix : dans proxy.ts, 308 vers l'URL publique localisée pour les chemins filesystem-only ; auditer url-map.ts pour d'autres alias. *Échec si :* `curl -w '%{http_code}' /en/approach` ≠ 308 après fix, ou si un autre alias 200 apparaît dans les logs de crawl.
- **Low — H1 homepage en sr-only, hero visible sans heading.** Evidence : `<h1 class="sr-only">MAWT, AI agency in Geneva: ...</h1>` sur les 2 locales, headings visibles commencent à h2. Trade-off accepté du hero animé approuvé (règle mémoire : pas de modif visuelle sans validation). Fix : aucun urgent ; si revisité, promouvoir le statement visible en H1. *Échec si :* n/a (statu quo documenté) — indicateur : position moyenne des requêtes marque dans GSC ne doit pas dériver.
- **Info — Redirects locale en 307 : choix défendable.** Négociation Accept-Language ⇒ un 308 caché épinglerait la mauvaise locale ; les redirects déterministes utilisent déjà 308 ; single hop partout. Aucun changement. *Échec si :* des chaînes de redirect (>1 hop) apparaissent dans un crawl Screaming Frog.
- **Info — Ni Speculation Rules ni hint LCP.** 2 des 4 signaux de la grille acquis (pas de bfcache killers, pas de prerender déprécié). Fix opportuniste : `<script type="speculationrules">` prefetch modéré sur la nav principale dans le layout. *Échec si :* après ajout, le temps de navigation home→work mesuré (CrUX/RUM) ne baisse pas — indicateur : TTFB de navigation interne.

## Schema — 79/100

Base saine confirmée : **41/41 blocs JSON-LD valides, 100 % SSR, zéro type déprécié, @id cross-référencés, parité bilingue** (Info positif — préserver l'architecture `structured-data.tsx`).

- **Medium — sameAs à 2 plateformes seulement (cible grille : 5+).** Evidence : `"sameAs":["https://linkedin.com/in/mawt.ch","https://instagram.com/mawt.ch"]` sur Organization et LocalBusiness ; schema.md qualifie sameAs de propriété n°1 pour la reconnaissance d'entité IA (15/100 dans la grille). Fix : ajouter Wikidata (créer l'entité), YouTube, X, GitHub/Crunchbase, local.ch/search.ch dans Sanity settings.socialLinks — le pipeline normalise déjà. *Échec si :* dans 60 jours, une requête « MAWT Genève » dans ChatGPT/Perplexity ne résout toujours pas l'entité (test mensuel scripté) — indicateur avancé : nombre d'URLs dans sameAs rendu <5.
- **Medium — URL LinkedIn malformée : namespace personnel `/in/` + slug avec point.** Evidence : même valeur sur les 15 pages testées ; les pages entreprise vivent sous `/company/`, les slugs `/in/` n'acceptent pas les points ⇒ URL très probablement morte, ce qui nuit activement à la réconciliation. Fix : corriger dans Sanity vers la vraie page company ; vérifier aussi le handle Instagram. *Échec si :* `curl -I` de l'URL sameAs renvoie ≠200 après correction — indicateur : check automatisé des liens sameAs en CI.
- **Medium — BlogPosting sans `image` (propriété requise pour le rich result Article).** Evidence : conditional à structured-data.tsx:119, aucun post Sanity n'a d'image. Fix : fallback OG/site-default dans news/[slug] pour que `articleLd` reçoive toujours `opts.image` ; optionnel : auteur Person + sameAs. *Échec si :* le Rich Results Test signale encore « image manquante » sur un post — indicateur : rapport Search Console Articles.
- **Low — LocalBusiness sans openingHours ; identité dupliquée Organization/LocalBusiness.** Fix : ajouter `openingHours: "Mo-Fr 09:00-18:00"` ; optionnel, consolider en un nœud multi-typé `["Organization","LocalBusiness"]` en gardant l'@id `#organization`. *Échec si :* après consolidation, les cross-refs @id de Service/AboutPage/ContactPage cassent (validation Schema.org validator en CI).
- **Low — `speakable` absent partout (5 pts grille).** Fix : SpeakableSpecification (cssSelector h1 + intro) sur /geneva (CollectionPage) et /faqs (FAQPage). *Échec si :* le markup ajouté ne valide pas au Rich Results Test.
- **Info — FAQPage : rich result retiré des SERP depuis 2026-05-07, garder pour la citation IA.** Ne pas retirer ; la disparition des rapports Search Console mi-2026 n'est PAS une régression. *Échec si :* quelqu'un supprime le markup en croyant à une régression — indicateur : présence du bloc FAQPage dans le HTML rendu.
- **Info — Pas de SearchAction : choix correct et documenté** (pas de recherche réelle sur le site). N'ajouter que si une vraie recherche shippe.

## Contenu / E-E-A-T — 58/100

La dimension la plus faible. Quatre High vérifiés.

- **High — Anonymat total : le test « Who » échoue sur toutes les pages.** Evidence : /about « Several profiles, one shared vision » sans un seul nom (about-copy.ts:69-72) ; les 3 posts bylinés « Team MAWT » avec author Organization dans le JSON-LD ; grep site entier : aucun nom humain. Le paradoxe : le site vend « A senior human team » sans nommer un humain. L'infrastructure du fix existe déjà (schema author Sanity, branche Person dans structured-data.tsx:123 jamais empruntée). Fix : bios nommées avec rôles/crédentials sur /about (Person schema lié à l'Organization), byline Person avec sameAs LinkedIn sur les posts. *Échec si :* 90 jours après publication, aucune amélioration des impressions sur les requêtes non-marque dans GSC — indicateur avancé : `grep` d'un @type Person avec name dans le HTML rendu de /about et des 3 posts.
- **High — Blog : 3 posts génériques à 505/606/645 mots (plancher 1 500), tous datés du même jour.** Evidence re-mesurée : zéro chiffre, zéro citation, zéro entité nommée hors MAWT/AI, phrases-types (« seamless experiences », « digital ecosystems » dans les 3) ; densité ~0,05 vs seuil 0,20. C'est 100 % du blog, lié en prominence depuis la homepage. Fix : réécrire ou dépublier ; remplacer par 1-2 posts adossés à de vrais projets (Mellender CRM+RAG, Swixit, Crown) avec chiffres, décisions, auteur nommé. *Échec si :* 6 mois après réécriture, zéro citation IA détectée sur les sujets des posts (test mensuel Perplexity/ChatGPT) — indicateur avancé : densité mots/statistiques du nouveau contenu <1 stat citée par post.
- **High — Les 7 piliers services EN sous le plancher 800 mots.** Evidence re-mesurée : sites-and-branding 374 → ai-solutions 715 ; les pages feuilles prouvent que le template supporte la profondeur (smart-crm 1 736, web-development 1 517). FR : 4 piliers échouent aussi. Fix : étendre services-pillar-copy.ts — bloc how-we-work numéroté, 2-3 mini-cas chiffrés, 3-5 FAQ par pilier, par langue. *Échec si :* re-comptage automatisé <800 mots après extension, ou si les positions des requêtes « [service] Genève » ne bougent pas en 90 jours — indicateur avancé : word count en CI sur les 7 routes.
- **High — Phrase hero canonique grammaticalement cassée.** Evidence : « MAWT is a Swiss A Geneva studio for AI and engineering. » (EN) et « MAWT est une Un studio d'IA et d'ingénierie à Genève. » (FR) — préfixe composé (hero-section:839/859/887) + dict.description commençant par un article. Le commentaire code (l.884) désigne ce paragraphe comme LA phrase extractible pour snippets/IA. Visible aussi par les humains. Fix : réécrire `hero.description` dans les 2 dictionnaires pour continuer le préfixe (EN : « studio for AI and engineering, based in Geneva. » ; FR : « agence d'IA et d'ingénierie à Genève. »). *Échec si :* le HTML rendu strippé contient encore « is a Swiss A » ou « une Un » — indicateur : test de linéarisation en CI.
- **Medium — /about sous 400 mots (255 EN / 289 FR) + contradiction « Not an agency. A studio. » vs « AI agency » partout ailleurs** (meta, H1 sr-only, schema, about-copy.ts:61). Le contenu Sanity a dérivé du repo. « Over 50 missions » invérifiable (2 études de cas). Fix : trancher pour « agency », aligner Sanity sur about-copy.ts, ajouter founding story + bios + 2-3 preuves ; corriger la meta FR (211 chars). *Échec si :* grep « Not an agency » retourne encore un hit sur le rendu, ou word count <400.
- **Medium — Études de cas squelettiques (Swixit 57 mots, Mellender 132), meta descriptions vides, zéro chiffre** — alors que /work promet « measured results. Hours saved, errors cut » et que 8+ clients sont cités en socialProof sans page support. C'est le signal Experience (le seul infalsifiable par l'IA) qui est vide. Fix : template étude de cas (stat de résultat en tête, situation→challenge→approche→résultat chiffré), meta descriptions, + un 3e cas (Crown ou Diagora). *Échec si :* les pages cas restent sans un seul chiffre de résultat après refonte — indicateur : présence d'au moins un nombre d'outcome dans `<main>`.
- **Medium — Titles/descriptions hors bandes 50-60 / 130-150 chars** (descs : 211, 179, 169, 166… ; trop courtes : 53, 105, 108 ; doubles marques « | MAWT Geneva | MAWT »). Le pattern absolu de about/page.tsx:18-25 résout déjà le problème — l'appliquer partout. *Échec si :* un scan automatisé post-fix trouve >10 % de pages hors bandes.
- **Medium — H1 multi-phrases sur toutes les pages internes** : SubpageHero met titre + sous-titre dans le même `<h1>` (subpage-hero.tsx:91-113) ⇒ H1 de 20-30 mots. Fix : sous-titre en `<p>` sibling, même traitement visuel/animation. *Échec si :* le H1 rendu de /en/about dépasse encore ~10 mots.
- **Low — Espaces typographiques françaises dans la copy EN** (« signature : », « missing ? ») dans about-copy.ts, services-pillar-copy.ts et les docs Sanity EN. Fix : purge des espaces avant `:` `?` en EN. *Échec si :* `grep ' :' src/content/*copy*.ts` (strings EN) retourne un hit.
- **Low — Mismatch factuel FR/EN : projet « 200k » (FR) vs « 300k » (EN)** (services-pillar-copy.ts:148 vs 173). Fix : aligner un chiffre. *Échec si :* les deux valeurs diffèrent encore au prochain diff.
- **Low — /en/geneva à 471 mots (plancher location 500-600 ; FR passe à 521).** Fix : +80-120 mots (contexte Carouge, références clients Genève, 1-2 FAQ locales). *Échec si :* re-comptage <500.

## International — 86/100

- **Medium — Paires de blog traduites non liées : zéro hreflang sur les 6 posts.** Evidence : les 6 entrées sitemap des posts sont les seules sans alternates (sur 172) ; le code résout `translationOf` bidirectionnellement (news/[slug]/page.tsx:36-45, sitemap.ts:179-185) — la référence n'est simplement pas posée dans Sanity. Fix : poser `translationOf` sur un post de chaque paire dans Sanity Studio, zéro code. *Échec si :* 48 h après édition Sanity, le head d'un post ne rend toujours pas d'alternates — indicateur : `curl | grep hreflang` sur les 6 URLs.
- **Medium — Dates FR affichées en anglais (« May 17, 2026 »)** : `format(date, "MMMM dd, yyyy")` sans locale (news/[slug]/page.tsx:208), alors que blog-filter.tsx:68 fait déjà juste. Fix : `Intl.DateTimeFormat(lang === "fr" ? "fr-CH" : "en-US", ...)`. *Échec si :* /fr/blog/* contient encore « May » dans le rendu.
- **Low — Divergence latente sitemap/HTML pour un sibling de service manquant** : sitemap.ts:131-140 fallback `paths.fr ?? paths.en!` (émettrait hreflang fr → URL EN) vs page head canonical-only (comportement correct). Aujourd'hui 0 cas (70 docs appariés), mais premier dépublish Sanity = drift. Fix : dans sitemap.ts, omettre `alternates` quand le sibling manque, miroir du head. *Échec si :* un crawl sitemap trouve un alternate fr pointant vers /en/ (check CI possible dès maintenant).
- **Info — Codes `fr`/`en` sans région : trade-off délibéré et bon** (le .ch géo-signale déjà ; bare codes = matching pan-francophone). Nit : `inLanguage` fr-CH vs bare en, og:locale fr_CH vs en_US — normaliser une convention. *Échec si :* n/a ; indicateur : cohérence inLanguage/og:locale au prochain audit.
- **Info — Pages projet sans meta description dans les 2 locales** (parité intacte, donc gap on-page, pas i18n). Fix : champ description localisé dans le schema projet + generateMetadata work/[slug]. *Échec si :* /en/work/kouleta rend toujours 0 meta description.

## GEO / AI Readiness — 68/100

- **High — Trou soft-404 : tout chemin racine avec extension sert la homepage en 200, index-follow, canonical auto-référent.** Evidence reproduite et renforcée : /nonexistent-xyz.txt, /foo.png, /foo.pdf → 200 homepage avec `canonical=https://mawt.ch/nonexistent-xyz.txt` ; pire, /apple-touch-icon.png, /ads.txt, /humans.txt (requêtes automatiques des bots) génèrent organiquement des clones sans lien externe. Cause : proxy.ts:112-119 (`isFileRequest` → next()) + aucune validation de locale dans `[lang]/layout.tsx`. Les crawlers IA reçoivent des 200 confiants au lieu de 404. Fix : valider `lang` contre `i18n.locales` et `notFound()` (ou `dynamicParams = false`) ; optionnel, 404 explicite côté proxy pour les fichiers inexistants. *Échec si :* `curl -w '%{http_code}' /apple-touch-icon-precomposed.png` ≠ 404 après fix — indicateur avancé : pages « Dupliquée, Google a choisi une autre canonique » dans GSC.
- **Medium — Entité sameAs mince + LinkedIn `/in/` stocké en http://** — voir §Schema (même finding, angle IA : sameAs = 3 des 5 premiers facteurs de visibilité IA sont citation-related). Fix CMS-only, la normalisation https existe déjà (structured-data.tsx:155-157). *Échec si :* voir §Schema.
- **Medium — Articles = contenu commodité : 0 statistique, 0 source, auteur Organization, tous datés 2026-05-17** — ils franchissent la ligne de staleness 6 mois (perte d'éligibilité citation IA, étude SE Ranking) en **novembre 2026**. Lifts mesurés : stats sourcées +40 %, citations d'experts +115 %. Fix : auteur Person nommé (articleLd supporte déjà authorName), données first-hand MAWT, 1-2 stats citées par post, refresh trimestriel avec vrai contenu. *Échec si :* dateModified == datePublished sur les 3 posts au 1er novembre 2026 — indicateur avancé : calendrier de refresh non tenu au T+90.
- **Low — Contenu principal 100 % texte (0 image dans `<main>` des pages service/news)** — la dimension multi-modale (15 % du score GEO) récompense texte+visuel (~+156 % de sélection). Fix : 1 visuel pertinent (diagramme d'archi, before/after, screenshot livrable) par page famille + /en/geneva + par article, avec alt descriptif. *Échec si :* count `<img>` dans `<main>` des 7 familles reste 0 au prochain audit.
- **Low — Le hero linéarisé se lit « MAWT is a Swiss A Geneva studio », répété 3×** (variantes responsive) — dilue les ~250 mots uniques extractibles de la homepage. Fix conjoint avec le High content-eeat : rendre la phrase grammaticale sans toucher au hero visuel (flag en aria-hidden pur ou sr-only ajusté). *Échec si :* voir content-eeat #4.
- **Info — Posture robots.txt IA parfaite** : les 5 crawlers Tier-1 + Tier-2/3 explicitement autorisés, /studio /admin /api /private bloqués, llms.txt présent (zéro poids citation, garder tel quel, ne plus investir). *Échec si :* un changement du matcher proxy.ts casse robots.txt/sitemap.xml/llms.txt — indicateur : curl 200 des 3 fichiers après tout déploiement touchant proxy.ts.

## Local — 82/100

- **Medium — sameAs LinkedIn malformé sur Organization + LocalBusiness** — même racine que §Schema ; angle local : liens de profil morts = item de lint local-maps, et la corroboration citations = 3 des 5 premiers facteurs IA (Whitespark 2026). Fix Sanity + optionnel garde de forme d'URL dans StructuredData. *Échec si :* voir §Schema.
- **Low — Coordonnées geo à 4 décimales (minimum 5)** : 46.1839/6.1394 ≈ 11 m vs 1,1 m requis pour corroborer le futur pin GBP. Fix : géocoder Rue de la Fontenette 23, 1227 Carouge à 5+ décimales dans structured-data.tsx:242-246. *Échec si :* le JSON-LD rendu montre <5 décimales au prochain crawl.
- **Low — openingHoursSpecification absent** (champ recommandé Google, doc Déc 2025 ; horaires = facteur pack #5). Fix : ajouter Mo-Fr 09:00-18:00 (réels) et utiliser les MÊMES horaires à la création du GBP. *Échec si :* les horaires schema ≠ horaires GBP au moment du claim — indicateur : diff schema/GBP dans la checklist de claim.
- **Low — Titles FR de services sans « Genève »** : automatisations et cybersécurité disent « en Suisse » quand leurs siblings disent « MAWT Genève » — concession des requêtes « agence automatisation Genève ». Fix : sweep des seoTitle Sanity/fallbacks pour que chaque title FR service porte Genève. *Échec si :* grep des titles FR rendus trouve encore un service sans Genève ni Suisse+Genève — indicateur : positions GSC des requêtes « [service] Genève ».
- **Info — Zéro signal GBP/Maps dans le code** (pas de hasMap, pas d'embed, pas de citations Apple/Bing) — cohérent avec la mémoire prélancement. Après claim GBP + Bing Places + Apple Business Connect : hasMap (URL CID), profils dans sameAs, embed Maps lazy sur /geneve. *Échec si :* 30 jours après le claim GBP, hasMap absent du LocalBusiness rendu.
- **Info — /geneve sain, pas de risque doorway** (passe le swap-test : Carouge, secteurs genevois, nLPD, hosting suisse ; 1 seule page location ; NAP visible ; hreflang correct). Levier : ~465 mots EN un peu mince pour « agence IA Genève » — voir Low content-eeat. Ne PAS cloner pour d'autres villes sans contenu aussi unique.
- **Info — NAP 100 % cohérent sur les 4 surfaces** (footer, /geneve, contact, JSON-LD, mails transactionnels) — c'est la baseline exacte que le GBP devra copier. Nit : addressRegion localisé (« Genève »/« Geneva ») → « GE » serait locale-stable. *Échec si :* le GBP est créé avec une variante NAP (indicateur : diff caractère par caractère au claim).

## Media / Images — 42/100

La pire dimension — presque entièrement réglable aujourd'hui (voir Quick wins).

- **Medium — 231 MB orphelins dans `public/Approach Page/`** (194 fichiers git-trackés, UUIDs, 77 % de public/, zéro référence hors allowlist proxy, zéro occurrence dans le HTML rendu de 9 routes ; distinct du `public/Approach/` actif de 256 KB). Fix : `git rm -r`, retirer proxy.ts:81-82 (les DEUX lignes, raw + %20), après un GROQ de contrôle sur les champs URL Sanity. *Échec si :* un 404 sur `/Approach Page/*` apparaît dans les logs post-suppression (indicateur : monitoring 404 la première semaine).
- **High — MotionMAWTMobile.mp4 committé à 17 Mbps** (> débit 4G médian ⇒ stalls garantis en scrub). Ré-encode CRF 24 déjà dans le working tree (9,67 MB, 2,91 Mbps, prédiction du fix vérifiée). Action restante : commit + squeeze optionnel 720×1280 vers 4-6 MB. *Échec si :* voir Top 10 #3 — indicateur : taille du blob git en CI.
- **Medium — MotionMAWT.mp4 1080p affiché à max 820 CSS px** : re-encode 1280×720 CRF 24 mesuré à 6,5 MB (−40 %). Garder `preload="metadata"` tel quel. *Échec si :* après remplacement, le scrub desktop saccade (granularité keyframes) — indicateur : test visuel du hero avant merge.
- **Medium — about-us-leaf.png : `priority` sur un décor below-fold, w=3840 demandé depuis une source 1376 px** (preload eager qui concurrence le vrai LCP de /about ; srcSet en upscale ; sizes=100vw faux). Fix : retirer `priority`, remplacer le PNG 664 KB par un WebP/AVIF ~60-100 KB à 1440 px. *Échec si :* le `<link rel=preload as=image>` de leaf est toujours dans le HTML rendu de /en/about — indicateur : LCP de /about en lab avant/après.
- **Low — 4,5 MB d'images orphelines en racine public/** (cover-image.png 2,2 MB, HeroImage.png 1,3 MB, PlanetBackground.png, Service Background.png). Fix : supprimer (ou recycler cover-image compressée ≤300 KB 1200×630 comme og:image — synergie Top 10 #4) + purger l'allowlist. *Échec si :* les fichiers réapparaissent dans `du public/` au prochain audit.
- **Low — Composant mort cinematic-hero-section.tsx avec `preload="auto"` sur les 11 MB** — bombe à retardement si re-wiré. Fix : supprimer (avec hero-section.tsx) après validation user (règle mémoire), ou a minima passer en metadata. *Échec si :* un import de hero-section réapparaît (indicateur : grep en CI).
- **Info — Allowlist proxy.ts périmée** (8+ entrées vers des fichiers inexistants ; redondante avec la regex extension). Fix : purge avec le nettoyage orphelins. *Échec si :* n/a.
- **Info — Hygiène images vivantes bonne** : AVIF approche (11-193 KB — Scale.avif recompressable à ~60-80 KB), 19/19 imgs lazy, Sanity CDN via next/image. Optionnel seulement.

## Bundle — 80/100

- **Info — Isolation Studio CONFIRMÉE** : ~5,7 MB des 8,4 MB JS sont du Sanity Studio chargé uniquement sur /studio (manifests vérifiés chunk par chunk ; hls.js, media-chrome, codemirror = enfants lazy du chunk Studio). Rien à faire ; hygiène optionnelle sur l'import statique de sanity.config.
- **Medium — @sanity/client (37 KB gz) shippé sur TOUTES les routes publiques** : work-section.tsx et clients-section.tsx (client components) importent urlForImage → getSanityClient → createClient, uniquement pour nourrir imageUrlBuilder. Fix : `imageUrlBuilder({ projectId, dataset })` dans sanity.image.ts — @sanity/image-url accepte SanityProjectDetails, zéro changement de comportement, −37 KB gz par page. *Échec si :* après fix, `grep createClient` matche encore un chunk référencé par le manifest [lang] — indicateur : delta first-load JS de `next build`.
- **Low — gsap + @gsap/react en dependencies, zéro code GSAP dans le bundle** (tree-shaké ; seul consommateur = le hero mort). Risque : tout import futur de hero-section ré-ajoute ~70 KB silencieusement. CLAUDE.md documente encore le hero mort comme approuvé — doc drift. Fix : demander au user (règle mémoire), puis supprimer les 2 fichiers + `npm uninstall gsap @gsap/react` + mettre à jour CLAUDE.md. *Échec si :* `grep registerPlugin .next/static/chunks` matche après un futur build — indicateur : check CI.
- **Low — fuse.js dépendance à zéro import.** `npm uninstall fuse.js`. *Échec si :* le build casse (il ne devrait pas — aucun import).
- **Info — react-icons safe** (import nommé fa6, 4 KB en prod ; le barrel complet en dev = Turbopack only). Micro-win optionnel : swap vers lucide et drop de la dépendance.
- **Info — First-load homepage ≈ 870 KB raw** ; après le fix sanity.image.ts → ~750 KB, raisonnable pour cette stack (le reste = framework + motion, structurels au design approuvé). Pas d'autre split justifié.

## Config — 64/100

- **Medium — Aucune stratégie Cache-Control sur /public : la vidéo 11 MB servie en max-age=0.** Evidence : headers() de next.config.ts = sécurité uniquement ; `curl -sI /MotionMAWT.mp4` → `public, max-age=0`. Nuance vérifiée : ETag faible présent ⇒ revalidation 304, pas re-download complet — le coût réel est la latence de revalidation à chaque navigation vers la page la plus lourde. Le rename-on-change est déjà la convention ⇒ immutable sans risque. Fix : règle `{ source: "/:all*(mp4|webm|woff2|jpg|jpeg|png|svg|gif)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }`. *Échec si :* `curl -sI` post-déploiement montre encore max-age=0 sur un mp4 — indicateur : check headers en smoke test de déploiement.
- **Medium — Build forcé en webpack (`next build --webpack`) sans raison documentée, dev en Turbopack** ⇒ deux bundlers, drift dev/prod (CSS ordering, chunking), CI plus lente. Le seul grief Turbopack au dossier est dev-only et « sans objet en prod ». Fix : trial `next build` Turbopack sur une branche, diff output + typecheck + smoke preview ; si OK, dropper le flag ; sinon, commenter la raison. *Échec si :* le build Turbopack diverge visuellement ou casse un chunk (indicateur : diff du build-manifest + smoke Playwright sur la preview) — auquel cas on garde webpack ET on documente.
- **Medium — AVIF non activé pour l'optimiseur d'images** : défaut Next 16 = webp only (vérifié dans le package installé) ⇒ ~20-30 % de bytes laissés sur la table pour les images Sanity. Fix : `formats: ["image/avif", "image/webp"]` + optionnel `minimumCacheTTL` élevé (URLs Sanity content-hashées). *Échec si :* `curl -H 'Accept: image/avif'` sur un /_next/image ne renvoie pas `content-type: image/avif` après déploiement.
- **Medium — 231 MB Approach Page** — voir §Media (angle config : .git à 427 MB, upload Vercel gonflé à chaque déploiement ; la suppression seule règle le poids de déploiement, `git filter-repo` optionnel plus tard). *Échec si :* voir §Media.
- **Low — Pas de bundle analyzer.** Fix : `@next/bundle-analyzer` gated sur ANALYZE + script (cross-env sous Windows). *Échec si :* n/a — indicateur : le script `analyze` tourne en local.
- **Info — ISR + revalidation par tag + fonts : correctement configurés et vérifiés** (revalidate 3600, webhook fail-closed rate-limité, `x-nextjs-prerender: 1`, woff2 self-hosted préloadés). Garder tel quel.

## Render-perf — 70/100

- **Medium — Hydration mismatch PageTransition pour les utilisateurs prefers-reduced-motion** (reproduit Playwright : serveur `opacity:1;transform:none` vs client `opacity:1` — useReducedMotion() null en SSR, true à l'hydratation). Fix 3 lignes : ajouter `y: 0` aux reducedVariants (page-transition.tsx:58-62) — identité visuelle, formes de transform cohérentes. *Échec si :* le log console avec `reducedMotion:'reduce'` émule encore l'avertissement React 19 — indicateur : test Playwright reduced-motion en CI.
- **Medium — Les 8 sections below-fold de la homepage importées statiquement** — seul le curseur et Studio utilisent next/dynamic ; tout hydrate en concurrence avec le hero (ASCII canvas + springs). Fix : `next/dynamic` SANS ssr:false (SSR/SEO intacts) sur WorkSection, InsightsSection, ApproachSection, VisionSection minimum ; vérifier les deltas first-load de `next build`. *Échec si :* le first-load JS de la route [lang] ne baisse pas après le split, ou si du HTML de section disparaît du SSR (grep du contenu dans le HTML curlé).
- **Medium — AsciiWave repeint ~6 241 glyphes/100 ms dont ~87 % hors viewport** (grille 79×79 pour 29×29 visibles, OVERDRAW_CELLS=25 ; full clear + fillText par tick ; rAF réveillé à 60 Hz pour travailler 1 frame sur 6). Fix : (1) skip des cellules hors bande visible, (2) repaint des seules cellules mutées, (3) setTimeout(TICK_MS) → un rAF par tick. *Échec si :* le profil Performance Chrome montre toujours >5 ms/tick de paint sur le canvas après fix — indicateur : temps scripting du canvas en trace avant/après.
- **Medium — GSAP mort + hero orphelin cassé** — voir §Bundle ; angle render : cinematic-hero référence les 241 frames /HeroImages/ qui n'existent plus (re-mount = 404 total) ; ApproachFlowerSequence pareillement mort. Fix : suppression des 3 fichiers + uninstall + mise à jour CLAUDE.md (validation user d'abord). *Échec si :* voir §Bundle.
- **Low — Math mémoire ApproachFlowerSequence si jamais ressuscité** : 8,3 MB décodés/frame 1920×1080, 191 frames ≈ 1,6 GB pinnés sans éviction (imagesRef jamais purgé). Moot tant que mort ; si ressuscité : ImageBitmaps downscalés + fenêtre glissante ±15 + close(), cap 60-80 frames. *Échec si :* le composant est re-wiré sans ces gardes (indicateur : review obligatoire sur tout import du fichier).
- **Low — Prop `services` morte sur HomepageHeroSection** (sérialisée dans le flight payload pour rien ; dédupe React limite l'impact). Fix : retirer prop + destructuring + attribut dans page.tsx:176. *Échec si :* n/a (pure hygiène).
- **Info — Warning motion useScroll « non-static position » à chaque chargement de /en** — la classe de symptôme derrière la note mémoire « useTransform range freeze ». Fix : auditer chaque useScroll({target}) homepage (approach-section, problem-section, scrub-title candidats) et ajouter `relative` jusqu'à disparition. *Échec si :* le warning est toujours dans la console Playwright après fix — indicateur : assertion console en CI.
- **Info — 6 motion.divs du dive logo (3 variantes × 2 couches) reçoivent des transforms par frame même cachées** (gating CSS display seulement). Le reste du composant est remarquablement soigné (bail-out setState, visibility gating GPU, warm-up iOS). Fix : un seul track de transform sélectionné par matchMedia + une seule paire logo/mask. *Échec si :* le nombre de style-writes par frame (trace Performance) ne baisse pas de ~2/3 sur le hero.

---

## Quick wins build — exécutables aujourd'hui

Commandes prêtes (depuis `C:\Users\MAWT\Documents\mawtwebsite`) :

**1. Vidéos hero (gain : ~50 MB committés + 4,5 MB servis)**
```bash
# Mobile : committer le ré-encode déjà présent dans le working tree (9,67 MB)
git add public/MotionMAWTMobile.mp4

# Optionnel : squeeze mobile supplémentaire vers 4-6 MB (affiché à 72dvh dans max-w-86vw)
ffmpeg -i public/MotionMAWTMobile.mp4 -vf scale=720:1280 -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart public/MotionMAWTMobile-720.mp4
# → vérifier la fluidité du scrub (granularité keyframes) avant de remplacer

# Desktop : 11 MB → 6,5 MB mesuré (affiché à max 820 CSS px)
ffmpeg -i public/MotionMAWT.mp4 -vf scale=1280:720 -c:v libx264 -crf 24 -preset slow -movflags +faststart public/MotionMAWT-720.mp4
```
*Échec si :* scrub saccadé au test visuel, ou ffprobe du résultat >7 MB desktop / >6 MB mobile.

**2. Purge des 231 MB + orphelins (gain : public/ 301 → ~65 MB)**
```bash
# Contrôle préalable : aucun doc Sanity ne stocke '/Approach Page/'
git rm -r "public/Approach Page"
git rm public/cover-image.png public/HeroImage.png public/PlanetBackground.png "public/Service Background.png"
# Puis retirer dans src/proxy.ts : lignes 81-82 ('/Approach Page/' + '/Approach%20Page/')
# et les entrées mortes : /HeroImage.gif, /MAWT Hero.mp4, /MAWTBackground.gif, /Client Logos.png, /App Icons/
```
*Échec si :* 404 sur ces chemins dans les logs la première semaine (indicateur : monitoring 404).

**3. Code-split @sanity/client hors des bundles publics (gain : −37 KB gz/page)**
Dans `src/lib/sanity.image.ts` : remplacer `imageUrlBuilder(getSanityClient())` par
```ts
imageUrlBuilder({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET! })
```
*Échec si :* une image Sanity casse sur /work ou la home (test visuel), ou le chunk 1843 reste dans le manifest [lang].

**4. next.config.ts (2 ajouts)**
```ts
images: { formats: ["image/avif", "image/webp"], /* remotePatterns existants */ },
// dans headers():
{ source: "/:all*(mp4|webm|woff2|jpg|jpeg|png|svg|gif)",
  headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }
```
*Échec si :* curl -sI d'un mp4 ne montre pas immutable, ou un asset modifié sans rename reste stale (⇒ tenir la convention rename-on-change).

**5. Dépendances mortes**
```bash
npm uninstall fuse.js
# gsap + @gsap/react + suppression des 3 composants morts : APRÈS validation user (règle mémoire aesthetic changes)
```
*Échec si :* `next build` échoue post-uninstall (aucun import — ne devrait pas).

**6. `priority` de about-us-leaf.png** : retirer la prop dans `src/app/[lang]/about/page.tsx:270-277`. *Échec si :* le preload image reste dans le HTML rendu de /en/about.

---

## Écartés après vérification

Aucun finding réfuté — les 4 vérifications adverses menées (og:image, sameAs, Approach Page, soft-404, vidéos, anonymat, planchers de mots, phrase hero, hreflang blog, Cache-Control) ont toutes confirmé le cœur des constats, avec quelques sévérités recalibrées (notées dans les sections).