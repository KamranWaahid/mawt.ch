# Automatisation éditoriale du blog MAWT — design

Date : 2026-07-13
Statut : validé, prêt pour le plan d'implémentation

## Problème

Le blog MAWT compte trois articles, publiés le même jour, en anglais uniquement à
l'origine. Alimenter le blog demande du temps et une régularité qu'aucun humain ne
tient spontanément. On veut une cadence tenue sans y penser, sans jamais publier
quoi que ce soit qu'un humain n'ait relu.

## Objectif

Deux fois par mois, recevoir trois sujets d'article par email. Répondre au mail pour
choisir. L'article est alors rédigé en français et en anglais, sourcé, et déposé en
brouillon dans Sanity. La publication reste un geste humain.

## Contraintes qui ont façonné le design

**Aucune publication automatique.** Les articles sont créés avec le préfixe `drafts.`.
Le site interroge Sanity en `perspective: "published"` : un brouillon est donc
structurellement invisible sur mawt.ch. Ce n'est pas une règle de conduite, c'est une
propriété du système.

**Le token Sanity ne doit jamais vivre en clair.** Cette contrainte a éliminé les
routines Claude Code cloud, qui ne peuvent pas lire de variables d'environnement et
auraient exigé le token dans leur configuration.

**Les faits doivent être vérifiés, pas mémorisés.** Un article sur l'actualité IA écrit
de mémoire par un modèle est un article faux. Toute affirmation datée doit venir d'une
recherche web, avec sa source.

## Architecture

n8n orchestre. L'API Claude rédige. Sanity stocke.

n8n tourne déjà sur un VPS allumé en permanence. Rien n'est installé de neuf : on
ajoute deux workflows et deux credentials.

### Workflow 1 — proposer

Déclencheur : Schedule Trigger, le 1er et le 15 du mois à 9h00, timezone
`Europe/Zurich`. n8n gère le fuseau nativement, donc pas de dérive à l'heure d'hiver.

1. **Lire l'existant.** Requête GROQ vers Sanity : titres, catégories et tags de tous
   les articles publiés, dans les deux langues. C'est ce qui évite les doublons.
2. **Veille et proposition.** Nœud AI Agent (Anthropic), outil de recherche web activé.
   Il croise trois sources d'inspiration : l'actualité IA récente, les angles SEO
   ancrés à Genève et en Suisse romande, et les trous du blog existant. Il rend
   exactement trois sujets, en JSON.
3. **Envoyer.** Email à `aa@mawt.ch`. L'objet porte une référence unique :
   `MAWT Blog — 3 sujets [MB-2026-07-15]`.

Chaque sujet contient : titre pressenti, angle, pourquoi maintenant, mots-clés visés,
sources consultées.

### Workflow 2 — rédiger

Déclencheur : IMAP Trigger sur la boîte `aa@mawt.ch`, filtré sur les objets contenant
`[MB-`. Le workflow se réveille parce qu'une réponse arrive, pas parce qu'un cron passe
voir si elle est arrivée.

1. **Extraire.** La référence `MB-…` depuis l'objet, le choix depuis le corps :
   `1`, `2`, `3`, `autre : <piste>`, ou `aucun`.
2. **Garde anti-doublon.** Requête Sanity : existe-t-il déjà un article portant le tag
   `ref:MB-…` ? Si oui, on s'arrête. C'est ce qui empêche une double rédaction si le
   workflow est rejoué.
3. **Bifurcation selon la réponse.**
   - `1`, `2`, `3` → on rédige le sujet correspondant, tel qu'il a été proposé.
   - `autre : <piste>` → on rédige la piste dictée par l'utilisateur, sans repasser par
     une proposition. La piste remplace le sujet, la référence reste la même.
   - `aucun` → on relance la génération de sujets et on renvoie un mail avec une
     nouvelle référence. Pas d'attente jusqu'à la prochaine échéance.
4. **Rédiger.** Nœud AI Agent : recherche approfondie sur le sujet retenu, vérification
   des sources, puis rédaction en français et en anglais.
5. **Écrire.** Deux mutations `createOrReplace` vers Sanity, en `drafts.`.
6. **Confirmer.** Email avec les liens vers le Studio.

## Modèle de données

Chaque article produit remplit le schéma `post` existant :

| Champ | Contenu |
|---|---|
| `language` | `"fr"` ou `"en"` |
| `title` | Titre rédigé, pas le sujet brut |
| `slug` | Slug localisé, `^[a-z0-9]+(?:-[a-z0-9]+)*$`, sans accent |
| `category` | Obligatoire au schéma : `tendances-ia`, `opinions`, `guides-pratiques` ou `cas-clients` |
| `tags` | Mots-clés + le tag technique `ref:MB-…` |
| `excerpt` | Résumé affiché dans la liste. Sans lui, `BlogFilter` affiche un texte de repli générique |
| `publishedAt` | Date d'exécution |
| `body` | Portable Text : blocs `normal`, chaque bloc avec `_key` et un `span` enfant |
| `seo` | `metaTitle`, `metaDescription` |

Les `_id` sont `drafts.post-<lang>-<slug>`. Le préfixe `drafts.` est ce qui rend
l'article invisible en production.

## État et idempotence

Il n'y a ni base de données ni fichier d'état. La référence `MB-…` circule dans l'objet
du mail, puis se fixe dans les `tags` du brouillon Sanity. La présence de ce tag est la
seule preuve qu'un sujet a déjà été traité, et le seul garde-fou contre la double
rédaction. Deux systèmes déjà en place, zéro plomberie ajoutée.

## Sécurité

Le token Sanity et la clé API Anthropic vivent dans le magasin de credentials chiffré
de n8n. Ils ne transitent dans aucun prompt et n'apparaissent dans aucune configuration
en clair.

Le token Sanity doit être **dédié à ce workflow** et nommé comme tel. Le révoquer coupe
l'automatisation sans rien casser d'autre.

Le token actuellement présent dans `.env.local` a été exposé en clair dans une
conversation. Il doit être révoqué, et ne doit pas être réutilisé ici.

## Gestion des erreurs

| Panne | Comportement |
|---|---|
| L'agent rend un JSON invalide | Une reprise, puis email d'échec |
| La mutation Sanity échoue | Email d'échec avec le message d'erreur brut. Aucun brouillon partiel |
| Réponse mail illisible | Email demandant de reformuler, avec les 3 sujets rappelés |
| Deux réponses au même mail | La garde anti-doublon absorbe la seconde |
| Aucune réponse | Rien. Le sujet expire. Le prochain cycle proposera autre chose |

## Vérification

Le système n'est pas considéré comme fonctionnel tant que ces quatre points ne sont pas
observés en vrai :

1. Exécution manuelle du workflow 1 → le mail arrive avec 3 sujets et une référence.
2. Réponse au mail → le workflow 2 se déclenche seul.
3. Les deux brouillons apparaissent dans le Studio, en français et en anglais.
4. `curl` sur `/fr/news` et `/en/news` → les brouillons **n'y sont pas**. C'est le test
   qui compte le plus.

## Hors périmètre

Les articles n'auront ni image de couverture ni auteur. Les champs existent au schéma
et restent vides, comme pour les trois articles actuels. La liste du blog reste
purement typographique.

Le composant `BlogFilter` affiche le slug brut de la catégorie (« tendances-ia »)
plutôt qu'un libellé lisible. C'est un défaut existant, indépendant de ce travail.

## Décisions écartées

**Routines Claude Code cloud.** Elles savent faire le cron et le mail — le connecteur
Microsoft 365 s'y attache. Mais elles ne peuvent pas lire de variables d'environnement,
ce qui aurait imposé le token Sanity en clair dans leur configuration. Rédhibitoire.

**Claude Code installé sur le VPS.** Le harnais agentique complet, mais il faut
installer Node, le CLI et l'authentifier. Trop de surface pour écrire des articles de
blog.

**Publication automatique.** Écartée d'emblée. Une erreur factuelle publiée sous la
marque, sans relecture, ne se rattrape pas.

**Trois articles rédigés puis triés.** Coût en tokens multiplié par trois, et un Studio
encombré de brouillons à nettoyer.
