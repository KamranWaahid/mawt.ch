# Automatisation éditoriale du blog MAWT — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deux fois par mois, recevoir 3 sujets d'article par email, répondre pour choisir, et obtenir l'article rédigé en FR et EN, sourcé, déposé en brouillon dans Sanity — sans qu'aucun contenu n'atteigne le public sans relecture humaine.

**Architecture:** n8n (VPS 24/7) orchestre le cron, les emails et les secrets. L'API Claude fait la veille et la rédaction. Sanity stocke les brouillons. Aucun secret ne transite en clair : tout vit dans le magasin de credentials chiffré de n8n.

**Tech Stack:** n8n (Schedule Trigger, IMAP Trigger, AI Agent Anthropic, HTTP Request, Send Email), Sanity HTTP API (GROQ + mutations), Portable Text.

**Spec:** `docs/superpowers/specs/2026-07-13-blog-automation-design.md`

## Global Constraints

- Projet Sanity : `ewciugup`, dataset `production`, API version `2024-01-01`.
- Le site interroge Sanity en `perspective: "published"`. Tout `_id` préfixé `drafts.` est donc invisible en production. **Cette propriété est la garantie de sécurité du système et doit être vérifiée par un test réel, pas supposée.**
- Le schéma `post` exige `language` ET `category`. Un article sans `category` est invalide dans le Studio.
- `category` ∈ { `tendances-ia`, `opinions`, `guides-pratiques`, `cas-clients` }.
- `slug` doit valider `^[a-z0-9]+(?:-[a-z0-9]+)*$` — pas d'accent, pas d'apostrophe, pas de majuscule.
- Toutes les requêtes blog filtrent sur `language == $lang`. Un article sans `language` n'apparaît dans aucune langue. C'est le bug qu'on vient de corriger : ne pas le réintroduire.
- Chaque article produit porte le tag `ref:MB-<YYYY-MM-DD>`. C'est la clé d'idempotence.
- Aucune affirmation datée sans source vérifiée par recherche web.
- Token Sanity dédié, nommé `n8n-blog`, permission Editor. Le token présent dans `.env.local` a été exposé en clair et doit être révoqué, pas réutilisé.

---

## File Structure

| Fichier | Responsabilité |
|---|---|
| `n8n/blog-propose.workflow.json` | Workflow 1 : cron → veille → email des 3 sujets |
| `n8n/blog-write.workflow.json` | Workflow 2 : IMAP → choix → rédaction → brouillons Sanity |
| `n8n/prompts/propose-topics.md` | Prompt de veille et de proposition (source de vérité, collé dans le nœud) |
| `n8n/prompts/write-article.md` | Prompt de rédaction FR+EN |
| `n8n/README.md` | Credentials à créer, import des workflows, procédure de vérification |
| `scripts/sanity/blog-queries.md` | Les GROQ et mutations validées, référencées par les workflows |

Rien de tout cela n'est du code de site. Aucun fichier sous `src/` n'est touché.

---

## Task 1 : Prouver que le brouillon est invisible en production

C'est la tâche la plus importante du plan. Si cette propriété est fausse, tout le design s'effondre et il faut le revoir avant d'écrire une ligne de n8n.

**Files:**
- Create: `scripts/sanity/blog-queries.md`

**Interfaces:**
- Produces: la mutation `createOrReplace` de référence, et la preuve que `drafts.*` n'atteint pas le site.

- [ ] **Step 1 : Créer un brouillon jetable dans Sanity**

```bash
TOKEN=$(grep SANITY_API_WRITE_TOKEN .env.local | cut -d= -f2)
curl -s -X POST \
  "https://ewciugup.api.sanity.io/v2024-01-01/data/mutate/production" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mutations":[{"createOrReplace":{
    "_id":"drafts.post-test-invisibility",
    "_type":"post",
    "language":"fr",
    "title":"CANARI — ne doit jamais apparaitre en ligne",
    "slug":{"_type":"slug","current":"canari-test-invisibilite"},
    "category":"opinions",
    "tags":["ref:MB-TEST"],
    "excerpt":"Brouillon de test. Si vous lisez ceci sur mawt.ch, le systeme est casse.",
    "publishedAt":"2026-07-13T09:00:00Z",
    "body":[{"_key":"b0","_type":"block","style":"normal","markDefs":[],
             "children":[{"_key":"s0","_type":"span","text":"Canari.","marks":[]}]}]
  }}]}'
```

Expected: `{"transactionId":"...","results":[{"id":"drafts.post-test-invisibility","operation":"create"}]}`

- [ ] **Step 2 : Vérifier que Sanity le voit bien (le brouillon existe)**

```bash
curl -s -G "https://ewciugup.api.sanity.io/v2024-01-01/data/query/production" \
  -H "Authorization: Bearer $TOKEN" \
  --data-urlencode 'query=*[_id=="drafts.post-test-invisibility"][0]{title}'
```

Expected: le titre `CANARI — ne doit jamais apparaitre en ligne`.

- [ ] **Step 3 : Vérifier qu'il n'atteint PAS le site**

```bash
for u in "https://mawt.ch/fr/news" "https://mawt.ch/en/news" \
         "https://mawt.ch/fr/news/canari-test-invisibilite"; do
  echo -n "$u -> "
  curl -s "$u" | grep -c "CANARI" || true
done
```

Expected: `0` partout. La page article doit renvoyer un 404.

**Si un seul `CANARI` apparaît : ARRÊTER LE PLAN.** Le design repose sur une propriété fausse et doit être repensé.

- [ ] **Step 4 : Supprimer le canari**

```bash
curl -s -X POST \
  "https://ewciugup.api.sanity.io/v2024-01-01/data/mutate/production" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"mutations":[{"delete":{"id":"drafts.post-test-invisibility"}}]}'
```

Expected: `"operation":"delete"`.

- [ ] **Step 5 : Consigner la mutation de référence**

Écrire dans `scripts/sanity/blog-queries.md` la mutation validée ci-dessus, en notant que le préfixe `drafts.` est ce qui garantit l'invisibilité, et que le test du canari doit être rejoué si le client Sanity du site change de `perspective`.

- [ ] **Step 6 : Commit**

```bash
git add scripts/sanity/blog-queries.md
git commit -m "docs: validated Sanity draft-invisibility property with canary test"
```

---

## Task 2 : La requête anti-doublon et la garde d'idempotence

**Files:**
- Modify: `scripts/sanity/blog-queries.md`

**Interfaces:**
- Consumes: rien.
- Produces: `EXISTING_POSTS_QUERY` (pour la veille) et `REF_GUARD_QUERY` (pour l'idempotence). Ces deux noms sont référencés par les tâches 4, 5 et 7.

- [ ] **Step 1 : Valider `EXISTING_POSTS_QUERY`**

Elle alimente la veille pour éviter les doublons. Elle doit renvoyer les articles publiés, dans les deux langues, sans les brouillons.

```bash
curl -s -G "https://ewciugup.api.sanity.io/v2024-01-01/data/query/production" \
  --data-urlencode 'query=*[_type=="post" && !(_id in path("drafts.**"))]{language,title,category,tags}'
```

Expected: exactement 6 articles (3 FR, 3 EN), aucun brouillon.

- [ ] **Step 2 : Valider `REF_GUARD_QUERY`**

Elle répond à : « un article portant cette référence existe-t-il déjà, brouillon compris ? »

```bash
curl -s -G "https://ewciugup.api.sanity.io/v2024-01-01/data/query/production" \
  -H "Authorization: Bearer $TOKEN" \
  --data-urlencode 'query=count(*[_type=="post" && "ref:MB-TEST" in tags])'
```

Expected: `0` (le canari a été supprimé en tâche 1).

Note : cette requête **doit** être authentifiée. Sans token, l'API applique la perspective publiée et ne voit pas les brouillons — la garde serait aveugle et laisserait passer les doublons.

- [ ] **Step 3 : Consigner les deux requêtes**

Ajouter les deux GROQ à `scripts/sanity/blog-queries.md`, avec la note sur l'authentification obligatoire de `REF_GUARD_QUERY`.

- [ ] **Step 4 : Commit**

```bash
git add scripts/sanity/blog-queries.md
git commit -m "docs: add and validate blog dedup + idempotency GROQ queries"
```

---

## Task 3 : Le prompt de proposition de sujets

**Files:**
- Create: `n8n/prompts/propose-topics.md`

**Interfaces:**
- Consumes: `EXISTING_POSTS_QUERY` (tâche 2).
- Produces: un JSON strict `{"ref": string, "topics": [{"title", "angle", "why_now", "keywords": [], "sources": [], "category"}]}` — exactement 3 entrées. Consommé par les tâches 6 et 7.

- [ ] **Step 1 : Écrire le prompt**

Il doit contenir, explicitement :

- Le contexte MAWT : agence IA à Genève, PME et entreprises en croissance de Suisse romande. Ton premium, calme, éditorial. Pas de jargon startup, pas de buzzwords.
- Les trois sources d'inspiration : actualité IA récente (recherche web obligatoire), angles SEO locaux (Genève, Suisse romande), trous du blog existant.
- La liste des articles déjà publiés, injectée depuis `EXISTING_POSTS_QUERY`, avec la consigne de ne pas proposer de doublon.
- **L'interdiction d'affirmer un fait daté sans source.** Chaque sujet doit citer les URL consultées.
- `category` obligatoire, choisi parmi les 4 valeurs du schéma.
- Sortie : JSON strict, exactement 3 sujets, rien d'autre.

- [ ] **Step 2 : Tester le prompt à sec**

Le faire tourner une fois avec la vraie liste d'articles, et vérifier à la main :
- 3 sujets, pas 2 ni 4.
- Aucun doublon avec les 6 articles existants.
- Chaque `why_now` s'appuie sur une source réelle et vérifiable (ouvrir les URL).
- `category` est bien l'une des 4 valeurs autorisées.

- [ ] **Step 3 : Commit**

```bash
git add n8n/prompts/propose-topics.md
git commit -m "feat: add blog topic proposal prompt with sourcing requirement"
```

---

## Task 4 : Le prompt de rédaction FR + EN

**Files:**
- Create: `n8n/prompts/write-article.md`

**Interfaces:**
- Consumes: un sujet issu du JSON de la tâche 3, ou une piste libre dictée par l'utilisateur (`autre : …`).
- Produces: un JSON `{"fr": <Post>, "en": <Post>}` où `<Post>` = `{title, slug, category, tags[], excerpt, body[], seo:{metaTitle, metaDescription}}`. Consommé par la tâche 7.

- [ ] **Step 1 : Écrire le prompt**

Il doit imposer :

- Recherche web approfondie avant rédaction. **Aucune affirmation datée de mémoire.**
- Rédaction en français ET en anglais. Pas une traduction mot à mot : deux textes qui se lisent naturellement dans leur langue.
- Ton MAWT : concret, chiffré quand c'est possible, éditorial, sans buzzword. Le contre-exemple à éviter est explicitement donné : les 3 articles actuels, trop abstraits.
- `slug` : ASCII, minuscules, tirets, validant `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Un slug différent par langue.
- `excerpt` : obligatoire. Sans lui, la liste affiche un texte de repli générique.
- `tags` : mots-clés du sujet + le tag technique `ref:MB-<date>`.
- `body` : Portable Text. Chaque bloc `{_key, _type:"block", style:"normal", markDefs:[], children:[{_key,_type:"span",text,marks:[]}]}`. Les `_key` doivent être uniques dans le document.
- Sortie : JSON strict, rien d'autre.

- [ ] **Step 2 : Tester sur le sujet Fable 5**

Le sujet est réel et documenté : sortie de Claude Fable 5 le 9 juin 2026, contrôles à l'export américains le 12 juin, suspension mondiale, levée le 30 juin, redéploiement le 1er juillet avec de nouveaux classificateurs. Angle MAWT : la dépendance à un fournisseur unique, et ce que ça dit de la continuité de service pour une PME.

Vérifier sur la sortie :
- Les dates et les faits correspondent aux sources (anthropic.com, VentureBeat, InfoQ, Al Jazeera).
- Les deux slugs valident la regex.
- Chaque bloc du `body` a un `_key` unique.
- `excerpt` et `seo` sont remplis dans les deux langues.

- [ ] **Step 3 : Commit**

```bash
git add n8n/prompts/write-article.md
git commit -m "feat: add bilingual article writing prompt with source verification"
```

---

## Task 5 : Bout-en-bout à la main, sans n8n

Avant de construire quoi que ce soit dans n8n, prouver que la chaîne produit un vrai article publiable. Si elle échoue ici, elle échouera dans n8n — mais on l'aura découvert sans avoir rien configuré.

**Files:**
- Modify: `scripts/sanity/blog-queries.md`

**Interfaces:**
- Consumes: les prompts des tâches 3 et 4, les requêtes de la tâche 2.
- Produces: deux vrais brouillons Sanity, relus par l'utilisateur.

- [ ] **Step 1 : Rédiger l'article Fable 5**

Utiliser le prompt de la tâche 4 sur le sujet Fable 5, avec la référence `MB-2026-07-13`.

- [ ] **Step 2 : Écrire les deux brouillons**

Mutation `createOrReplace` sur `drafts.post-fr-<slug>` et `drafts.post-en-<slug>`, en réutilisant la forme validée en tâche 1.

- [ ] **Step 3 : Vérifier l'invisibilité, encore**

```bash
for u in "https://mawt.ch/fr/news" "https://mawt.ch/en/news"; do
  echo -n "$u -> "; curl -s "$u" | grep -ci "fable" || true
done
```

Expected: `0` partout.

- [ ] **Step 4 : Vérifier la garde d'idempotence**

Rejouer `REF_GUARD_QUERY` avec `ref:MB-2026-07-13`.

Expected: `2` (les deux brouillons). Le workflow 2 devra donc s'arrêter s'il retombe sur cette référence.

- [ ] **Step 5 : Faire relire à l'utilisateur**

Ouvrir les deux brouillons dans le Studio. **Gate humaine :** si la qualité rédactionnelle ne convient pas, retourner à la tâche 4 et affiner le prompt. Ne pas construire n8n autour d'un rédacteur médiocre.

- [ ] **Step 6 : Commit**

```bash
git add scripts/sanity/blog-queries.md
git commit -m "docs: end-to-end dry run validated on the Fable 5 article"
```

---

## Task 6 : Workflow n8n 1 — proposer

**Files:**
- Create: `n8n/blog-propose.workflow.json`

**Interfaces:**
- Consumes: `EXISTING_POSTS_QUERY` (tâche 2), `propose-topics.md` (tâche 3).
- Produces: un email à `aa@mawt.ch`, objet `MAWT Blog — 3 sujets [MB-<YYYY-MM-DD>]`.

- [ ] **Step 1 : Écrire le JSON du workflow**

Nœuds, dans l'ordre :

1. **Schedule Trigger** — cron `0 9 1,15 * *`, timezone `Europe/Zurich`. n8n gère le fuseau nativement : pas de dérive à l'heure d'hiver, contrairement à un cron UTC.
2. **Set** — calcule `ref = "MB-" + $now.format("yyyy-MM-dd")`.
3. **HTTP Request** — `EXISTING_POSTS_QUERY` vers Sanity. Pas de token nécessaire : on ne lit que du publié.
4. **AI Agent (Anthropic)** — outil de recherche web activé, prompt de la tâche 3, articles existants injectés.
5. **Send Email** — destinataire `aa@mawt.ch`, objet avec la `ref`, corps listant les 3 sujets numérotés, et la consigne de réponse : répondre `1`, `2`, `3`, `autre : <piste>`, ou `aucun`.

- [ ] **Step 2 : Importer dans n8n et exécuter à la main**

Bouton « Execute Workflow ». Ne pas attendre le 1er du mois.

Expected: un mail arrive à `aa@mawt.ch` avec 3 sujets et une référence en objet.

- [ ] **Step 3 : Commit**

```bash
git add n8n/blog-propose.workflow.json
git commit -m "feat: n8n workflow that proposes 3 blog topics twice a month"
```

---

## Task 7 : Workflow n8n 2 — rédiger

**Files:**
- Create: `n8n/blog-write.workflow.json`

**Interfaces:**
- Consumes: la réponse email, `REF_GUARD_QUERY` (tâche 2), `write-article.md` (tâche 4), la mutation validée (tâche 1).
- Produces: deux brouillons Sanity + un email de confirmation.

- [ ] **Step 1 : Écrire le JSON du workflow**

Nœuds :

1. **IMAP Trigger** — boîte `aa@mawt.ch`, filtre sur les objets contenant `[MB-`.
2. **Code** — extrait `ref` de l'objet et `choice` du corps. `choice` ∈ `1|2|3|autre|aucun`.
3. **HTTP Request** — `REF_GUARD_QUERY` **avec le token** (sinon la garde est aveugle aux brouillons). Si le compte est `> 0`, arrêter.
4. **Switch** — trois branches :
   - `aucun` → relancer la proposition avec une nouvelle `ref`, envoyer un nouveau mail. Fin.
   - `autre` → la piste dictée remplace le sujet, la `ref` reste la même.
   - `1|2|3` → le sujet correspondant.
5. **AI Agent (Anthropic)** — prompt de la tâche 4, recherche web activée.
6. **HTTP Request** — mutation `createOrReplace`, deux documents `drafts.`.
7. **Send Email** — confirmation, avec les liens Studio.
8. **Error Trigger** — sur échec de l'agent ou de la mutation : email d'échec avec l'erreur brute. Aucun brouillon partiel.

- [ ] **Step 2 : Tester avec une vraie réponse**

Répondre au mail de la tâche 6 avec `2`.

Expected:
- Le workflow se déclenche seul, sans attendre.
- Deux brouillons apparaissent dans le Studio, en FR et en EN.
- Un mail de confirmation arrive.

- [ ] **Step 3 : Tester la garde d'idempotence**

Répondre **une seconde fois** au même mail.

Expected: le workflow s'arrête à l'étape 3. **Aucun second brouillon n'est créé.** C'est le test qui prouve que le système ne se dédouble pas.

- [ ] **Step 4 : Tester l'invisibilité une dernière fois**

```bash
curl -s "https://mawt.ch/fr/news" | grep -c "<titre du brouillon>"
```

Expected: `0`.

- [ ] **Step 5 : Commit**

```bash
git add n8n/blog-write.workflow.json
git commit -m "feat: n8n workflow that writes FR+EN drafts from the email reply"
```

---

## Task 8 : Documentation d'exploitation

**Files:**
- Create: `n8n/README.md`

- [ ] **Step 1 : Écrire le README**

Il doit couvrir :

- **Les trois credentials à créer dans n8n**, et uniquement là :
  - Token Sanity `n8n-blog`, permission Editor, créé sur sanity.io/manage.
  - Clé API Anthropic, créée sur console.anthropic.com.
  - Accès mail `aa@mawt.ch`. Microsoft 365 n'accepte plus les mots de passe simples en IMAP/SMTP : utiliser OAuth2, ou un mot de passe d'application si le tenant l'autorise.
- L'import des deux workflows JSON.
- La procédure de vérification complète (le canari de la tâche 1).
- **Comment couper le système** : révoquer le token `n8n-blog`. Le site et le Studio ne bougent pas.
- Le rappel que rien n'est jamais publié automatiquement, et pourquoi : le préfixe `drafts.` face à `perspective: "published"`.

- [ ] **Step 2 : Commit**

```bash
git add n8n/README.md
git commit -m "docs: operating guide for the blog automation workflows"
```

---

## Ce que ce plan ne fait pas

Les articles n'auront ni image de couverture ni auteur. Les champs existent au schéma, ils resteront vides — comme pour les trois articles actuels. Sur un site d'agence premium, une liste d'articles sans aucune image finit par ressembler à un blog abandonné. C'est une décision à prendre à part, pas un oubli.

Le composant `BlogFilter` affiche le slug brut de la catégorie (« tendances-ia ») au lieu d'un libellé lisible. Défaut existant, indépendant de ce travail, corrigeable en une ligne le jour où on touchera au code du site.
