/**
 * Populate Sanity with static pages (legal + list-page headers + contact).
 * Documents are created as `pageContent` (generic static page type) plus the
 * `contact` singleton. Content comes from:
 *   .cursor/briefs/content/legal-pages.md
 *   .cursor/briefs/content/standalone-pages-2.md
 *
 * Run: SANITY_WRITE_TOKEN=... node --import tsx scripts/populate-static-pages.ts
 * (use Node >= 20)
 */
import { createClient } from "@sanity/client";

import { textToBlocks } from "./lib/sanity-content-helpers";

const token =
  process.env.SANITY_WRITE_TOKEN?.trim() ||
  process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!token) {
  console.error("Missing Sanity write token. Set SANITY_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "ewciugup",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2024-01-01",
  token,
  useCdn: false,
});

type Section = { title: string; body: string };

function bodyFromSections(sections: Section[]) {
  const blocks: Record<string, unknown>[] = [];
  for (const s of sections) {
    blocks.push({
      _type: "block",
      style: "h2",
      markDefs: [],
      children: [{ _type: "span", text: s.title, marks: [] as string[] }],
    });
    blocks.push(...textToBlocks(s.body));
  }
  return blocks;
}

type StaticPage = {
  pageKey: string;
  language: "fr" | "en";
  slug: string;
  heroH1: string;
  heroH2?: string;
  intro?: string;
  sections?: Section[];
  bottomCtaH2?: string;
  bottomCtaBody?: string;
  bottomCtaLabel?: string;
  metaTitle: string;
  metaDescription: string;
};

const PAGES: StaticPage[] = [
  // ============================== LEGAL ==============================
  // ----- Mentions légales / Legal notice -----
  {
    pageKey: "legal-notice",
    language: "fr",
    slug: "mentions-legales",
    heroH1: "Mentions légales",
    heroH2: "Qui édite ce site et comment nous joindre.",
    metaTitle: "Mentions légales | MAWT",
    metaDescription:
      "Informations légales sur MAWT Sàrl, studio IA et conseil basé à Genève. Éditeur, hébergement, propriété intellectuelle.",
    sections: [
      {
        title: "Éditeur du site",
        body:
          "Le présent site [URL] est édité par :\n\n[RAISON_SOCIALE]\n[ADRESSE]\nSuisse\n\nNuméro d'identification des entreprises (IDE) : [IDE]\nNuméro de TVA : [TVA]\nInscrite au registre du commerce du canton de Genève.\n\nReprésentée par : [GERANT]\nContact : [EMAIL]\nTéléphone : [TELEPHONE]",
      },
      {
        title: "Hébergement",
        body:
          "Le site est hébergé par :\n\n[HEBERGEUR]\n\nL'hébergeur assure le stockage et la mise à disposition du site. Pour toute question relative au traitement de vos données, voir notre politique de confidentialité.",
      },
      {
        title: "Propriété intellectuelle",
        body:
          "L'ensemble des contenus de ce site (textes, visuels, logos, code, structure, identité de marque) est la propriété de [RAISON_SOCIALE] ou de ses partenaires, et protégé par le droit suisse de la propriété intellectuelle.\n\nToute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation écrite préalable, est interdite et peut constituer une contrefaçon.\n\nLes marques et logos de tiers éventuellement présents (logos clients, technologies) restent la propriété de leurs détenteurs respectifs et sont affichés avec leur accord ou dans un cadre informatif.",
      },
      {
        title: "Responsabilité",
        body:
          "[RAISON_SOCIALE] met tout en œuvre pour fournir des informations à jour et exactes, sans garantir leur exhaustivité ni leur actualité permanente. Les informations de ce site sont fournies à titre indicatif et ne constituent ni un conseil juridique, ni un engagement contractuel.\n\n[RAISON_SOCIALE] décline toute responsabilité pour les dommages directs ou indirects résultant de l'accès au site, de son utilisation, ou de l'impossibilité d'y accéder, dans les limites permises par le droit suisse.\n\nLe site peut contenir des liens vers des sites tiers. [RAISON_SOCIALE] n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
      },
      {
        title: "Droit applicable",
        body:
          "Le présent site et son utilisation sont soumis au droit suisse. Le for exclusif est à Genève, sous réserve d'un for impératif prévu par la loi.",
      },
      {
        title: "Contact",
        body: "Pour toute question relative à ce site : [EMAIL]",
      },
    ],
  },
  {
    pageKey: "legal-notice",
    language: "en",
    slug: "legal-notice",
    heroH1: "Legal notice",
    heroH2: "Who publishes this site and how to reach us.",
    metaTitle: "Legal notice | MAWT",
    metaDescription:
      "Legal information about MAWT Sàrl, an AI studio and consultancy based in Geneva. Publisher, hosting, intellectual property.",
    sections: [
      {
        title: "Site publisher",
        body:
          "This site [URL] is published by :\n\n[RAISON_SOCIALE]\n[ADRESSE]\nSwitzerland\n\nBusiness identification number (UID) : [IDE]\nVAT number : [TVA]\nRegistered in the commercial register of the Canton of Geneva.\n\nRepresented by : [GERANT]\nContact : [EMAIL]\nPhone : [TELEPHONE]",
      },
      {
        title: "Hosting",
        body:
          "The site is hosted by :\n\n[HEBERGEUR]\n\nThe host stores and serves the site. For any question regarding the processing of your data, see our privacy policy.",
      },
      {
        title: "Intellectual property",
        body:
          "All content on this site (text, visuals, logos, code, structure, brand identity) is the property of [RAISON_SOCIALE] or its partners, and is protected under Swiss intellectual property law.\n\nAny reproduction, representation, modification or use, in whole or in part, without prior written authorisation, is prohibited and may constitute infringement.\n\nThird party trademarks and logos that may appear (client logos, technologies) remain the property of their respective owners and are displayed with their agreement or for informational purposes.",
      },
      {
        title: "Liability",
        body:
          "[RAISON_SOCIALE] does its best to provide accurate and up to date information, without guaranteeing completeness or permanent currency. The information on this site is provided for guidance only and constitutes neither legal advice nor a contractual commitment.\n\n[RAISON_SOCIALE] disclaims any liability for direct or indirect damages resulting from accessing, using, or being unable to access the site, to the extent permitted by Swiss law.\n\nThe site may contain links to third party sites. [RAISON_SOCIALE] has no control over these sites and disclaims any liability for their content.",
      },
      {
        title: "Governing law",
        body:
          "This site and its use are governed by Swiss law. The exclusive place of jurisdiction is Geneva, subject to any mandatory jurisdiction provided by law.",
      },
      {
        title: "Contact",
        body: "For any question about this site : [EMAIL]",
      },
    ],
  },

  // ----- CGU / Terms -----
  {
    pageKey: "terms",
    language: "fr",
    slug: "conditions-generales",
    heroH1: "Conditions générales d'utilisation",
    heroH2: "Les règles qui encadrent l'usage de ce site.",
    intro:
      "Ce document couvre l'usage du site web. Les conditions des prestations (missions, contrats de service) font l'objet de contrats séparés signés avec chaque client, distincts de ces CGU.",
    metaTitle: "Conditions générales d'utilisation | MAWT",
    metaDescription:
      "Les conditions d'utilisation du site MAWT. Accès, contenus, propriété intellectuelle, responsabilité, droit applicable.",
    sections: [
      {
        title: "1. Objet et acceptation",
        body:
          "Les présentes conditions générales d'utilisation (les « Conditions ») régissent l'accès et l'utilisation du site [URL], édité par [RAISON_SOCIALE] (« MAWT », « nous »). En accédant au site, vous acceptez les présentes Conditions. Si vous ne les acceptez pas, n'utilisez pas le site.",
      },
      {
        title: "2. Accès au site",
        body:
          "Le site est accessible gratuitement. MAWT s'efforce d'en assurer la disponibilité, sans garantie d'accès continu ou sans interruption. MAWT peut modifier, suspendre ou interrompre tout ou partie du site à tout moment, sans préavis et sans engager sa responsabilité.",
      },
      {
        title: "3. Utilisation du site",
        body:
          "Vous vous engagez à utiliser le site de manière loyale et conforme à la loi. Sont notamment interdits :\n\nl'accès non autorisé aux systèmes, l'introduction de code malveillant, la collecte automatisée massive de données (scraping), toute tentative de perturber le fonctionnement du site, et tout usage portant atteinte aux droits de MAWT ou de tiers.\n\nMAWT se réserve le droit de restreindre l'accès en cas d'usage abusif.",
      },
      {
        title: "4. Contenus et formulaires",
        body:
          "Les informations publiées sur le site le sont à titre indicatif et peuvent évoluer sans préavis. Elles ne constituent ni un conseil personnalisé, ni une offre contractuelle.\n\nLorsque vous nous transmettez un message via le formulaire de contact, vous garantissez que les informations fournies sont exactes et que vous êtes autorisé à les communiquer. Le traitement de ces données est décrit dans notre politique de confidentialité.",
      },
      {
        title: "5. Propriété intellectuelle",
        body:
          "L'ensemble des éléments du site est protégé par le droit de la propriété intellectuelle et reste la propriété de MAWT ou de ses partenaires. Aucune licence ni aucun droit ne vous est cédé du fait de votre visite, au delà de la simple consultation à des fins personnelles et non commerciales.",
      },
      {
        title: "6. Liens vers des sites tiers",
        body:
          "Le site peut renvoyer vers des sites tiers sur lesquels MAWT n'a aucun contrôle. Ces liens sont fournis pour votre commodité. MAWT décline toute responsabilité quant à leur contenu, leur disponibilité ou leurs pratiques en matière de données.",
      },
      {
        title: "7. Responsabilité",
        body:
          "Dans les limites permises par le droit suisse, MAWT décline toute responsabilité pour les dommages directs ou indirects liés à l'utilisation du site, à l'impossibilité d'y accéder, à la présence d'erreurs ou d'éventuels éléments nuisibles. Vous utilisez le site sous votre seule responsabilité.",
      },
      {
        title: "8. Protection des données",
        body:
          "Le traitement de vos données personnelles est régi par notre politique de confidentialité et notre politique de cookies, qui font partie intégrante des présentes Conditions.",
      },
      {
        title: "9. Modification des Conditions",
        body:
          "MAWT peut modifier les présentes Conditions à tout moment. La version applicable est celle publiée sur le site au moment de votre accès. Dernière mise à jour : [DATE_MAJ].",
      },
      {
        title: "10. Droit applicable et for",
        body:
          "Les présentes Conditions sont soumises au droit suisse. Tout litige relève de la compétence exclusive des tribunaux de Genève, sous réserve d'un for impératif prévu par la loi.",
      },
    ],
  },
  {
    pageKey: "terms",
    language: "en",
    slug: "terms",
    heroH1: "Terms of use",
    heroH2: "The rules that govern the use of this site.",
    intro:
      "This document covers use of the website. Terms for services (engagements, service contracts) are set out in separate contracts signed with each client, distinct from these terms.",
    metaTitle: "Terms of use | MAWT",
    metaDescription:
      "The terms of use for the MAWT website. Access, content, intellectual property, liability, governing law.",
    sections: [
      {
        title: "1. Purpose and acceptance",
        body:
          "These terms of use (the « Terms ») govern access to and use of the site [URL], published by [RAISON_SOCIALE] (« MAWT », « we »). By accessing the site, you accept these Terms. If you do not accept them, do not use the site.",
      },
      {
        title: "2. Access to the site",
        body:
          "The site is freely accessible. MAWT works to keep it available, without guaranteeing continuous or uninterrupted access. MAWT may modify, suspend or discontinue all or part of the site at any time, without notice and without incurring liability.",
      },
      {
        title: "3. Use of the site",
        body:
          "You agree to use the site fairly and lawfully. The following are prohibited :\n\nunauthorised access to systems, introduction of malicious code, mass automated data collection (scraping), any attempt to disrupt the operation of the site, and any use that infringes the rights of MAWT or third parties.\n\nMAWT reserves the right to restrict access in case of abuse.",
      },
      {
        title: "4. Content and forms",
        body:
          "Information published on the site is provided for guidance and may change without notice. It constitutes neither personalised advice nor a contractual offer.\n\nWhen you send us a message through the contact form, you warrant that the information provided is accurate and that you are authorised to share it. The processing of this data is described in our privacy policy.",
      },
      {
        title: "5. Intellectual property",
        body:
          "All elements of the site are protected by intellectual property law and remain the property of MAWT or its partners. No licence or right is granted to you by your visit, beyond simple consultation for personal, non commercial purposes.",
      },
      {
        title: "6. Links to third party sites",
        body:
          "The site may link to third party sites over which MAWT has no control. These links are provided for your convenience. MAWT disclaims any liability for their content, availability or data practices.",
      },
      {
        title: "7. Liability",
        body:
          "To the extent permitted by Swiss law, MAWT disclaims any liability for direct or indirect damages related to the use of the site, the inability to access it, the presence of errors or any harmful elements. You use the site at your own risk.",
      },
      {
        title: "8. Data protection",
        body:
          "The processing of your personal data is governed by our privacy policy and our cookie policy, which form an integral part of these Terms.",
      },
      {
        title: "9. Changes to the Terms",
        body:
          "MAWT may amend these Terms at any time. The applicable version is the one published on the site at the time of your access. Last updated : [DATE_MAJ].",
      },
      {
        title: "10. Governing law and jurisdiction",
        body:
          "These Terms are governed by Swiss law. Any dispute falls under the exclusive jurisdiction of the courts of Geneva, subject to any mandatory jurisdiction provided by law.",
      },
    ],
  },

  // ----- Confidentialité / Privacy -----
  {
    pageKey: "privacy",
    language: "fr",
    slug: "confidentialite",
    heroH1: "Politique de confidentialité",
    heroH2: "Comment on collecte, utilise et protège vos données. En clair, sans jargon.",
    intro:
      "Vos données vous appartiennent. Cette politique explique quelles données on collecte sur ce site, pourquoi, combien de temps on les garde, avec qui on les partage, et quels sont vos droits. Elle est conforme à la loi fédérale sur la protection des données (nLPD, en vigueur depuis le 1ᵉʳ septembre 2023) et à son ordonnance.\n\nDernière mise à jour : [DATE_MAJ].",
    metaTitle: "Politique de confidentialité | MAWT",
    metaDescription:
      "Comment MAWT collecte, utilise et protège vos données personnelles. Conforme à la nLPD suisse. Vos droits et comment les exercer.",
    sections: [
      {
        title: "1. Responsable du traitement",
        body:
          "Le responsable du traitement de vos données est :\n\n[RAISON_SOCIALE]\n[ADRESSE]\nSuisse\n[EMAIL]\n\nPour toute question relative à vos données ou pour exercer vos droits, écrivez nous à [EMAIL].",
      },
      {
        title: "2. Quelles données on collecte",
        body:
          "Données que vous nous transmettez directement\nVia le formulaire de contact : nom, email professionnel, entreprise (optionnel), type de besoin, budget indicatif et le contenu de votre message. Vous choisissez ce que vous partagez.\n\nDonnées collectées automatiquement\nLors de votre visite : adresse IP (sous forme abrégée si possible), type de navigateur et d'appareil, pages consultées, date et durée de la visite, site de provenance. Ces données proviennent des journaux serveur et des outils de mesure d'audience (voir notre politique de cookies).\n\nOn ne collecte aucune donnée sensible au sens de la nLPD et on ne vous demande jamais plus que nécessaire.",
      },
      {
        title: "3. Pourquoi on traite ces données (finalités)",
        body:
          "Répondre à vos demandes de contact et préparer une éventuelle collaboration.\nAssurer le bon fonctionnement, la sécurité et l'amélioration du site.\nMesurer l'audience de façon agrégée pour comprendre ce qui intéresse nos visiteurs.\nRespecter nos obligations légales.\n\nChaque traitement repose sur un motif justificatif : votre demande ou votre consentement, notre intérêt légitime à exploiter et sécuriser le site, ou une obligation légale.",
      },
      {
        title: "4. Combien de temps on conserve vos données",
        body:
          "Messages de contact : conservés le temps de traiter votre demande, puis jusqu'à trois ans à des fins de suivi commercial, sauf demande de suppression de votre part.\nDonnées de mesure d'audience : conservées de façon agrégée selon les durées indiquées dans notre politique de cookies.\nDonnées liées à des obligations légales (par exemple comptables) : conservées pendant les durées légales applicables, jusqu'à dix ans.\n\nAu delà, vos données sont supprimées ou anonymisées.",
      },
      {
        title: "5. Avec qui on partage vos données (sous traitants)",
        body:
          "On ne vend jamais vos données et on ne les partage pas à des fins publicitaires.\n\nOn fait appel à des prestataires qui traitent des données pour notre compte, encadrés par des accords de sous traitance :\n\nNotre hébergeur, pour le fonctionnement du site.\nGoogle Ireland Limited / Google LLC, pour la mesure d'audience (Google Analytics).\nNotre back end de contenu et nos outils internes de communication.\n\nCertains de ces prestataires peuvent être situés hors de Suisse, notamment aux États-Unis. Voir la section suivante.",
      },
      {
        title: "6. Transferts hors de Suisse",
        body:
          "Lorsque vos données sont transférées dans un pays ne disposant pas d'une protection adéquate reconnue, on encadre ce transfert par des garanties appropriées : clauses contractuelles types reconnues par le Préposé fédéral à la protection des données et à la transparence, ou adhésion du prestataire à un cadre reconnu (par exemple le Swiss U.S. Data Privacy Framework pour les transferts vers les États-Unis).",
      },
      {
        title: "7. Vos droits",
        body:
          "Conformément à la nLPD, vous disposez des droits suivants :\n\nAccès : savoir si on traite des données vous concernant et lesquelles.\nRectification : faire corriger des données inexactes.\nEffacement : demander la suppression de vos données, sous réserve de nos obligations légales.\nOpposition : vous opposer à un traitement, notamment à la mesure d'audience.\nLimitation : demander que l'on gèle un traitement contesté.\nPortabilité : recevoir les données que vous nous avez fournies dans un format exploitable.\n\nPour exercer ces droits, écrivez à [EMAIL]. On répond dans les meilleurs délais, en principe sous trente jours. On peut vous demander de justifier votre identité.\n\nSi vous estimez que le traitement de vos données n'est pas conforme, vous pouvez vous adresser au Préposé fédéral à la protection des données et à la transparence (PFPDT), www.edoeb.admin.ch.",
      },
      {
        title: "8. Sécurité",
        body:
          "On prend des mesures techniques et organisationnelles appropriées pour protéger vos données contre la perte, l'accès non autorisé et l'usage abusif : accès restreints, chiffrement des connexions, sauvegardes, journalisation. Aucune transmission sur internet n'est totalement sûre, mais on s'engage à protéger vos données avec le sérieux qu'elles méritent. Notre approche détaillée est décrite sur notre page sécurité.",
      },
      {
        title: "9. Cookies",
        body:
          "Ce site utilise des cookies et technologies similaires. Leur usage et la façon de les refuser sont détaillés dans notre politique de cookies.",
      },
      {
        title: "10. Modifications",
        body:
          "On peut mettre à jour cette politique pour refléter des évolutions légales ou techniques. La version applicable est celle publiée sur cette page. En cas de changement important, on l'indique clairement.",
      },
    ],
  },
  {
    pageKey: "privacy",
    language: "en",
    slug: "privacy",
    heroH1: "Privacy policy",
    heroH2: "How we collect, use and protect your data. In plain terms, no jargon.",
    intro:
      "Your data belongs to you. This policy explains what data we collect on this site, why, how long we keep it, who we share it with, and what your rights are. It complies with the Swiss Federal Act on Data Protection (FADP, in force since 1 September 2023) and its ordinance.\n\nLast updated : [DATE_MAJ].",
    metaTitle: "Privacy policy | MAWT",
    metaDescription:
      "How MAWT collects, uses and protects your personal data. Compliant with the Swiss FADP. Your rights and how to exercise them.",
    sections: [
      {
        title: "1. Data controller",
        body:
          "The controller of your data is :\n\n[RAISON_SOCIALE]\n[ADRESSE]\nSwitzerland\n[EMAIL]\n\nFor any question about your data or to exercise your rights, write to us at [EMAIL].",
      },
      {
        title: "2. What data we collect",
        body:
          "Data you send us directly\nThrough the contact form : name, work email, company (optional), need type, indicative budget and the content of your message. You choose what you share.\n\nData collected automatically\nWhen you visit : IP address (shortened where possible), browser and device type, pages viewed, date and duration of the visit, referring site. This data comes from server logs and audience measurement tools (see our cookie policy).\n\nWe collect no sensitive data within the meaning of the FADP, and we never ask for more than we need.",
      },
      {
        title: "3. Why we process this data (purposes)",
        body:
          "To answer your contact requests and prepare a possible collaboration.\nTo ensure the proper functioning, security and improvement of the site.\nTo measure audience in aggregate to understand what interests our visitors.\nTo comply with our legal obligations.\n\nEach processing rests on a justifying ground : your request or consent, our legitimate interest in running and securing the site, or a legal obligation.",
      },
      {
        title: "4. How long we keep your data",
        body:
          "Contact messages : kept for as long as needed to handle your request, then up to three years for commercial follow up, unless you ask for deletion.\nAudience measurement data : kept in aggregate for the periods stated in our cookie policy.\nData tied to legal obligations (for example accounting) : kept for the applicable legal periods, up to ten years.\n\nBeyond that, your data is deleted or anonymised.",
      },
      {
        title: "5. Who we share your data with (processors)",
        body:
          "We never sell your data and we don't share it for advertising.\n\nWe use providers that process data on our behalf, governed by data processing agreements :\n\nOur host, for the operation of the site.\nGoogle Ireland Limited / Google LLC, for audience measurement (Google Analytics).\nOur content back end and internal communication tools.\n\nSome of these providers may be located outside Switzerland, in particular in the United States. See the next section.",
      },
      {
        title: "6. Transfers outside Switzerland",
        body:
          "When your data is transferred to a country without recognised adequate protection, we frame that transfer with appropriate safeguards : standard contractual clauses recognised by the Federal Data Protection and Information Commissioner, or the provider's adherence to a recognised framework (for example the Swiss U.S. Data Privacy Framework for transfers to the United States).",
      },
      {
        title: "7. Your rights",
        body:
          "Under the FADP, you have the following rights :\n\nAccess : know whether we process data about you and which data.\nRectification : have inaccurate data corrected.\nErasure : request deletion of your data, subject to our legal obligations.\nObjection : object to a processing, in particular audience measurement.\nRestriction : ask us to freeze a contested processing.\nPortability : receive the data you provided in a usable format.\n\nTo exercise these rights, write to [EMAIL]. We respond as soon as possible, in principle within thirty days. We may ask you to verify your identity.\n\nIf you believe the processing of your data is not compliant, you can contact the Federal Data Protection and Information Commissioner (FDPIC), www.edoeb.admin.ch.",
      },
      {
        title: "8. Security",
        body:
          "We take appropriate technical and organisational measures to protect your data against loss, unauthorised access and misuse : restricted access, encrypted connections, backups, logging. No transmission over the internet is fully secure, but we commit to protecting your data with the seriousness it deserves. Our detailed approach is described on our security page.",
      },
      {
        title: "9. Cookies",
        body:
          "This site uses cookies and similar technologies. Their use and how to refuse them are detailed in our cookie policy.",
      },
      {
        title: "10. Changes",
        body:
          "We may update this policy to reflect legal or technical developments. The applicable version is the one published on this page. In case of a significant change, we state it clearly.",
      },
    ],
  },

  // ----- Cookies -----
  {
    pageKey: "cookies",
    language: "fr",
    slug: "cookies",
    heroH1: "Politique de cookies",
    heroH2: "Ce qu'on dépose sur votre appareil, pourquoi, et comment dire non.",
    metaTitle: "Politique de cookies | MAWT",
    metaDescription:
      "Quels cookies ce site utilise, pourquoi, et comment les refuser ou les supprimer. Mesure d'audience et fonctionnement du site.",
    sections: [
      {
        title: "Qu'est ce qu'un cookie",
        body:
          "Un cookie est un petit fichier déposé sur votre appareil lorsque vous visitez un site. Il permet de faire fonctionner le site, de mémoriser vos préférences ou de mesurer l'audience. Certaines technologies similaires (pixels, stockage local) suivent la même logique et sont couvertes par cette politique.",
      },
      {
        title: "Les cookies qu'on utilise",
        body:
          "Cookies strictement nécessaires\nIndispensables au fonctionnement du site et à votre sécurité (préférence de langue, mémorisation de votre choix sur les cookies). Ils ne peuvent pas être désactivés et ne servent pas à vous suivre. Durée : session à 12 mois.\n\nCookies de mesure d'audience\nOn utilise Google Analytics pour comprendre, de façon agrégée, comment le site est utilisé : pages vues, provenance, appareils. L'adresse IP est anonymisée lorsque c'est possible. Ces cookies ne sont pas nécessaires : vous pouvez les refuser sans dégrader votre navigation. Fournisseur : Google. Durée : jusqu'à 24 mois.",
      },
      {
        title: "Comment refuser ou retirer votre choix",
        body:
          "Vous pouvez refuser les cookies non essentiels à tout moment :\n\nVia le bandeau de cookies à votre arrivée sur le site, ou en rouvrant le panneau de gestion des cookies (lien en bas de page).\nVia les réglages de votre navigateur, qui permet de bloquer ou supprimer les cookies déjà déposés.\nPour Google Analytics spécifiquement, via le module de désactivation proposé par Google (tools.google.com/dlpage/gaoptout).\n\nRefuser les cookies de mesure d'audience n'affecte pas votre accès au site.",
      },
      {
        title: "Cookies tiers",
        body:
          "Les cookies de mesure d'audience sont déposés par Google. Le traitement des données par ce prestataire, y compris d'éventuels transferts hors de Suisse, est encadré comme décrit dans notre politique de confidentialité.",
      },
      {
        title: "Mise à jour",
        body:
          "Cette politique peut évoluer si on change d'outils ou si le cadre légal change. Dernière mise à jour : [DATE_MAJ].",
      },
    ],
  },
  {
    pageKey: "cookies",
    language: "en",
    slug: "cookies",
    heroH1: "Cookie policy",
    heroH2: "What we place on your device, why, and how to say no.",
    metaTitle: "Cookie policy | MAWT",
    metaDescription:
      "Which cookies this site uses, why, and how to refuse or delete them. Audience measurement and site operation.",
    sections: [
      {
        title: "What a cookie is",
        body:
          "A cookie is a small file placed on your device when you visit a site. It helps the site work, remembers your preferences or measures audience. Some similar technologies (pixels, local storage) follow the same logic and are covered by this policy.",
      },
      {
        title: "The cookies we use",
        body:
          "Strictly necessary cookies\nEssential to the operation and security of the site (language preference, remembering your cookie choice). They cannot be disabled and are not used to track you. Duration : session to 12 months.\n\nAudience measurement cookies\nWe use Google Analytics to understand, in aggregate, how the site is used : page views, sources, devices. The IP address is anonymised where possible. These cookies are not necessary : you can refuse them without degrading your browsing. Provider : Google. Duration : up to 24 months.",
      },
      {
        title: "How to refuse or withdraw your choice",
        body:
          "You can refuse non essential cookies at any time :\n\nThrough the cookie banner when you arrive on the site, or by reopening the cookie settings panel (link in the footer).\nThrough your browser settings, which let you block or delete cookies already placed.\nFor Google Analytics specifically, through the opt out add on offered by Google (tools.google.com/dlpage/gaoptout).\n\nRefusing audience measurement cookies does not affect your access to the site.",
      },
      {
        title: "Third party cookies",
        body:
          "Audience measurement cookies are placed by Google. The processing of data by this provider, including any transfers outside Switzerland, is framed as described in our privacy policy.",
      },
      {
        title: "Update",
        body:
          "This policy may change if we change tools or if the legal framework changes. Last updated : [DATE_MAJ].",
      },
    ],
  },

  // ============================== STANDALONE HEADERS ==============================
  // ----- Contact (hero + intro; form labels live in the component/dictionary) -----
  {
    pageKey: "contact",
    language: "fr",
    slug: "contact",
    heroH1: "Parlons de votre projet.",
    heroH2: "Un échange direct avec l'équipe qui construira. Pas un commercial, pas d'intermédiaire.",
    intro:
      "Décrivez nous votre contexte en quelques lignes. On revient vers vous sous 24h ouvrées avec une première lecture honnête : ce qu'on voit, ce qu'on ferait, et si on est les bons pour vous. Si on ne l'est pas, on vous le dit et on vous oriente.",
    metaTitle: "Contact | MAWT, studio IA et conseil à Genève",
    metaDescription:
      "Parlons de votre projet. Un échange direct avec l'équipe qui construira, pas un commercial. Réponse sous 24h ouvrées.",
  },
  {
    pageKey: "contact",
    language: "en",
    slug: "contact",
    heroH1: "Let's talk about your project.",
    heroH2: "A direct conversation with the team that will build it. No salesperson, no middle layer.",
    intro:
      "Tell us about your context in a few lines. We come back within 24 business hours with an honest first read : what we see, what we'd do, and whether we're the right team. If we're not, we say so and point you elsewhere.",
    metaTitle: "Contact | MAWT, AI studio and consulting in Geneva",
    metaDescription:
      "Let's talk about your project. A direct conversation with the team that will build it, not a salesperson. Reply within 24 business hours.",
  },

  // ----- Clients / Partners -----
  {
    pageKey: "clients",
    language: "fr",
    slug: "clients",
    heroH1: "Ceux qui nous font confiance.",
    heroH2: "Des PME suisses aux scale-ups en croissance. Des relations qui durent, pas des prestations one shot.",
    intro:
      "On ne court pas après le logo. On choisit nos missions, et la plupart de nos clients restent avec nous plus d'un an. Voici une partie de ceux qui nous ont fait confiance, et ce qu'on a construit ensemble.",
    metaTitle: "Nos clients | MAWT, studio IA et conseil à Genève",
    metaDescription:
      "Les entreprises qui nous font confiance, des PME suisses aux scale-ups. Des relations qui durent, pas des missions one shot.",
    sections: [
      {
        title: "Depuis 2021",
        body:
          "Plus de 50 missions choisies avec soin.\nLa plupart de nos clients restent plus d'un an.",
      },
      {
        title: "On s'inscrit dans la durée",
        body:
          "On n'est pas là pour livrer et disparaître. On suit, on ajuste, on grandit avec votre boîte. Notre vrai indicateur de qualité, c'est que vous restiez.",
      },
      {
        title: "On parle votre langage",
        body:
          "Suisse romande, contexte PME, contraintes réelles. On comprend votre marché parce qu'on travaille dedans.",
      },
      {
        title: "On dit les choses",
        body:
          "Si une piste ne tient pas, on vous le dit. Si l'IA n'est pas la réponse, on le dit aussi. La franchise, c'est ce qui fait durer une relation.",
      },
    ],
    bottomCtaH2: "Et si on construisait quelque chose ensemble ?",
    bottomCtaBody:
      "30 minutes pour comprendre votre contexte. On vous dit franchement comment on aborderait votre projet, et si on est les bons.",
    bottomCtaLabel: "Discutons",
  },
  {
    pageKey: "clients",
    language: "en",
    slug: "partners",
    heroH1: "The people we build with.",
    heroH2: "From Swiss SMEs to growing scale-ups. Partnerships that last, not one off projects.",
    intro:
      "We don't chase logos. We choose our engagements, and most of the people we work with stay with us over a year. Here are some of them, and what we've built together.",
    metaTitle: "Our partners | MAWT, AI studio and consulting in Geneva",
    metaDescription:
      "The companies we work with, from Swiss SMEs to growing scale-ups. Relationships that last, not one off projects.",
    sections: [
      {
        title: "Since 2021",
        body:
          "More than 50 engagements chosen with care.\nMost of our partners stay over a year.",
      },
      {
        title: "We're in it for the long run",
        body:
          "We're not here to ship and disappear. We follow up, we adjust, we grow with your business. Our real quality metric is that you stay.",
      },
      {
        title: "We speak your context",
        body:
          "Swiss market, SME reality, real constraints. We understand your world because we work inside it.",
      },
      {
        title: "We say the hard things",
        body:
          "If a path doesn't hold up, we tell you. If AI isn't the answer, we say that too. Straight talk is what makes a partnership last.",
      },
    ],
    bottomCtaH2: "What if we built something together ?",
    bottomCtaBody:
      "30 minutes to understand your context. We tell you honestly how we'd approach your project, and whether we're the right team.",
    bottomCtaLabel: "Get in touch",
  },

  // ----- FAQs header -----
  {
    pageKey: "faqs",
    language: "fr",
    slug: "faqs",
    heroH1: "Les questions qu'on nous pose le plus.",
    heroH2: "Délais, budgets, façon de travailler, IA, sécurité. Des réponses claires, sans détour.",
    intro:
      "Vous ne trouvez pas votre réponse ici ? Écrivez nous, on répond directement. Aucune question n'est trop bête, et on préfère un échange honnête à un flou poli.",
    metaTitle: "Questions fréquentes | MAWT",
    metaDescription:
      "Délais, budgets, façon de travailler, IA, sécurité. Les réponses claires aux questions qu'on nous pose le plus souvent.",
    bottomCtaH2: "Une question qui n'est pas ici ?",
    bottomCtaBody:
      "Posez la nous directement. On revient sous 24h ouvrées avec une vraie réponse, pas un copier coller.",
    bottomCtaLabel: "Poser une question",
  },
  {
    pageKey: "faqs",
    language: "en",
    slug: "faqs",
    heroH1: "The questions we get most.",
    heroH2: "Timelines, budgets, how we work, AI, security. Clear answers, no detours.",
    intro:
      "Can't find your answer here ? Write to us, we answer directly. No question is too basic, and we'd rather have an honest exchange than a polite blur.",
    metaTitle: "Frequently asked questions | MAWT",
    metaDescription:
      "Timelines, budgets, how we work, AI, security. Clear answers to the questions we get most often.",
    bottomCtaH2: "A question that isn't here ?",
    bottomCtaBody:
      "Ask us directly. We come back within 24 business hours with a real answer, not a copy paste.",
    bottomCtaLabel: "Ask a question",
  },

  // ----- Blog header -----
  {
    pageKey: "blog",
    language: "fr",
    slug: "blog",
    heroH1: "Ce qu'on apprend, on le partage.",
    heroH2: "Nos retours de terrain sur l'IA, la tech et la transformation des PME. Du concret, pas du buzzword.",
    intro:
      "On écrit ce qu'on aurait aimé lire : des analyses honnêtes, des cas réels, ce qui marche et ce qui ne marche pas. Pas de hype, pas de promesses creuses. Si un sujet vous intéresse et qu'on n'en a pas parlé, dites le nous.",
    metaTitle: "Le blog | MAWT, IA et conseil pour PME suisses",
    metaDescription:
      "Nos retours de terrain sur l'IA, la tech et la transformation des PME suisses. Du concret, pas du buzzword.",
    bottomCtaH2: "Un sujet vous turlupine ?",
    bottomCtaBody:
      "Posez nous la question directement, ou parlons de votre projet. On préfère le concret aux généralités.",
    bottomCtaLabel: "Discutons",
  },
  {
    pageKey: "blog",
    language: "en",
    slug: "blog",
    heroH1: "What we learn, we share.",
    heroH2: "Field notes on AI, tech and business transformation. Concrete stuff, no buzzwords.",
    intro:
      "We write what we'd have wanted to read : honest analysis, real cases, what works and what doesn't. No hype, no empty promises. If a topic matters to you and we haven't covered it, tell us.",
    metaTitle: "The blog | MAWT, AI and consulting for Swiss businesses",
    metaDescription:
      "Field notes on AI, tech and the transformation of Swiss businesses. Concrete stuff, no buzzwords.",
    bottomCtaH2: "Got something on your mind ?",
    bottomCtaBody:
      "Ask us directly, or let's talk about your project. We prefer concrete over general.",
    bottomCtaLabel: "Get in touch",
  },
];

async function run() {
  let created = 0;
  let updated = 0;

  for (const p of PAGES) {
    const doc: Record<string, unknown> = {
      _type: "pageContent",
      pageKey: p.pageKey,
      language: p.language,
      slug: { _type: "slug", current: p.slug },
      heroH1: p.heroH1,
      ...(p.heroH2 ? { heroH2: p.heroH2 } : {}),
      ...(p.intro ? { intro: textToBlocks(p.intro) } : {}),
      ...(p.sections ? { body: bodyFromSections(p.sections) } : {}),
      ...(p.bottomCtaH2 ? { bottomCtaH2: p.bottomCtaH2 } : {}),
      ...(p.bottomCtaBody ? { bottomCtaBody: p.bottomCtaBody } : {}),
      ...(p.bottomCtaLabel ? { bottomCtaLabel: p.bottomCtaLabel } : {}),
      seo: {
        _type: "seo",
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
      },
    };

    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "pageContent" && pageKey == $k && language == $l][0]{_id}`,
      { k: p.pageKey, l: p.language },
    );

    if (existing?._id) {
      await client.patch(existing._id).set(doc).commit();
      updated++;
      console.log(`~ updated  ${p.pageKey} (${p.language})`);
    } else {
      await client.create(doc);
      created++;
      console.log(`+ created  ${p.pageKey} (${p.language})`);
    }
  }

  // Global Contact singleton (structured global info, language-agnostic).
  await client.createOrReplace({
    _id: "contact",
    _type: "contact",
    headline: "Parlons de votre projet.",
    subheading:
      "Un échange direct avec l'équipe qui construira. Pas un commercial, pas d'intermédiaire.",
    email: "hello@mawt.ch",
    offices: [
      {
        _key: "geneva",
        city: "Genève",
        address: "Genève, Suisse",
        isMain: true,
      },
    ],
    socialHeadline: "Suivez ce qu'on construit",
  });
  console.log("~ updated  contact (singleton)");

  console.log(`\nDone. ${created} created, ${updated} updated, +1 contact singleton.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
