export type PillarLangCopy = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subhead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
  introParagraphs: string[];
  servicesH2: string;
  socialProof: string;
  projectsH2: string;
  faqH2: string;
  bottomCtaH2: string;
  bottomCtaPitch: string;
  bottomCtaLabel: string;
};

export type FamilyKey =
  | "sites-et-branding"
  | "solutions-ia"
  | "conseil-ia"
  | "renfort-equipe"
  | "formation-ia"
  | "digital"
  | "donnees-analytics"
  | "developpement-logiciel"
  | "securite"
  | "operations-scm";

export const PILLAR_COPY: Record<FamilyKey, { fr: PillarLangCopy; en: PillarLangCopy }> = {
  "sites-et-branding": {
    fr: {
      metaTitle: "Sites web, e-commerce et branding pour PME suisses | MAWT",
      metaDescription:
        "Sites internet sur mesure, e-shops, refontes, identité visuelle. Équipe à taille humaine à Genève. Discutons de votre projet.",
      h1: "Sites web et branding qui travaillent pour vous.",
      subhead:
        "Site vitrine, e-commerce, refonte, identité visuelle. Construits sur mesure par une équipe à taille humaine basée à Genève.",
      ctaPrimary: "Discutons",
      ctaSecondary: "Voir nos projets",
      ctaPrimaryHref: "contact",
      ctaSecondaryHref: "projets",
      introParagraphs: [
        "Votre site actuel ne vous représente plus. Trop lent, trop daté, trop compliqué à mettre à jour. Il ne ramène pas les bons clients, et vous le voyez chaque mois.",
        "Refaire un site n'est pas qu'un exercice graphique. C'est l'occasion de remettre votre image, votre proposition et vos parcours client à plat. Beaucoup livrent du beau. Peu livrent de l'efficace.",
        "On conçoit et on construit votre présence digitale comme un outil de croissance, pas comme une vitrine de portfolio. Site internet, e-commerce, refonte, identité cohérente. Un seul interlocuteur du premier brief au déploiement.",
      ],
      servicesH2: "Ce qu'on construit dans cette famille",
      socialProof:
        "Cas concrets : Kouleta (refonte vitrine), phaam.ch (e-commerce), rs detailing (site vitrine), Mellender (site immobilier avec listings dynamiques).",
      projectsH2: "Projets de la famille Sites et branding",
      faqH2: "Questions fréquentes sur les sites web et le branding",
      bottomCtaH2: "Discutons de votre site",
      bottomCtaPitch:
        "30 minutes pour comprendre votre besoin. Pas de devis bâclé, pas de pression. Juste un échange direct avec ceux qui vont construire.",
      bottomCtaLabel: "Démarrer un projet",
    },
    en: {
      metaTitle: "Websites, e-commerce and branding for ambitious teams | MAWT",
      metaDescription:
        "Custom websites, e-shops, redesigns, brand identity. Senior team based in Geneva. Let's talk about your project.",
      h1: "Websites and branding that actually pull their weight.",
      subhead:
        "Marketing sites, e-commerce, redesigns, brand identity. Built custom by a senior team based in Geneva.",
      ctaPrimary: "Get in touch",
      ctaSecondary: "See our work",
      ctaPrimaryHref: "contact",
      ctaSecondaryHref: "projects",
      introParagraphs: [
        "Your current site no longer represents you. Slow, dated, hard to update. It's not bringing in the right clients, and you can feel it every month.",
        "Rebuilding a site isn't just a visual exercise. It's a chance to reset your image, your value proposition, your customer paths. Plenty of agencies ship pretty. Few ship effective.",
        "We design and build your digital presence as a growth tool, not a portfolio piece. Websites, e-commerce, redesign, coherent brand. One senior point of contact from first brief to launch.",
      ],
      servicesH2: "What we build in this family",
      socialProof:
        "Real cases : Kouleta (marketing site redesign), phaam.ch (e-commerce), rs detailing (marketing site), Mellender (real estate site with dynamic listings).",
      projectsH2: "Featured Sites and branding projects",
      faqH2: "Frequently asked questions about websites and branding",
      bottomCtaH2: "Let's talk about your site",
      bottomCtaPitch:
        "30 minutes to understand what you actually need. No rushed quote, no pressure. Just a direct conversation with the people who'll build it.",
      bottomCtaLabel: "Start a project",
    },
  },
  "solutions-ia": {
    fr: {
      metaTitle: "Solutions IA sur mesure pour PME suisses | MAWT",
      metaDescription:
        "CRM intelligent, agents IA, RAG embarqué, automatisations. On intègre l'IA dans vos outils métier. Équipe à taille humaine basée à Genève.",
      h1: "Solutions IA sur mesure pour votre activité.",
      subhead: "CRM intelligent, agents IA, RAG embarqué, automatisations. On met l'IA dans vos outils, pas à côté.",
      ctaPrimary: "Discutons",
      ctaSecondary: "Cas concrets",
      ctaPrimaryHref: "contact",
      ctaSecondaryHref: "projets",
      introParagraphs: [
        "Les outils standards atteignent leur limite. ChatGPT répond à des questions isolées mais ne connaît pas vos clients, vos process, vos données. Vous voulez plus que ça : un système IA qui sert vraiment votre activité.",
        "La vraie IA en entreprise ne vit pas dans un onglet à part. Elle s'intègre dans vos outils existants. CRM, applications métier, workflows. Elle comprend votre contexte. Elle décharge vos équipes des tâches sans valeur.",
        "On conçoit et on construit cette couche IA sur mesure. RAG sur votre base documentaire, agents qui traitent vos demandes entrantes, CRM qui suggère la prochaine action. Pensés pour votre activité, par une équipe à taille humaine basée à Genève.",
      ],
      servicesH2: "Ce qu'on construit dans cette famille",
      socialProof:
        "Cas concrets : Mellender (CRM immobilier avec RAG), Crown (transformation 360 avec CRM intelligent et RAG), Diagora (automatisations métier).",
      projectsH2: "Projets de la famille Solutions IA",
      faqH2: "Questions fréquentes sur les solutions IA",
      bottomCtaH2: "Discutons de votre projet IA",
      bottomCtaPitch:
        "On démarre par comprendre ce que vous voulez vraiment automatiser ou améliorer. Si l'IA est pertinente, on le dit. Si elle ne l'est pas, on le dit aussi.",
      bottomCtaLabel: "Démarrer",
    },
    en: {
      metaTitle: "Custom AI solutions for ambitious businesses | MAWT",
      metaDescription:
        "Smart CRMs, AI agents, embedded RAG, automation. We weave AI into your tools, not next to them. Senior team based in Geneva.",
      h1: "Custom AI solutions, built into your tools.",
      subhead: "Smart CRMs, AI agents, embedded RAG, automation. AI that actually fits how your business runs.",
      ctaPrimary: "Get in touch",
      ctaSecondary: "Case studies",
      ctaPrimaryHref: "contact",
      ctaSecondaryHref: "projects",
      introParagraphs: [
        "Off-the-shelf AI tools hit a wall fast. ChatGPT answers isolated questions but doesn't know your clients, your processes, your data. You want more than that : an AI system that actually serves your business.",
        "Real enterprise AI doesn't live in a separate tab. It embeds into your existing tools. CRMs, business apps, workflows. It understands your context. It frees your team from no-value work.",
        "We design and build that AI layer custom. RAG on your knowledge base, agents that triage incoming requests, CRMs that suggest the next action. Built for your business, by a senior team based in Geneva.",
      ],
      servicesH2: "What we build in this family",
      socialProof:
        "Real cases : Mellender (real estate CRM with RAG), Crown (360 transformation with smart CRM and RAG), Diagora (business automation).",
      projectsH2: "Featured AI solutions projects",
      faqH2: "Frequently asked questions about AI solutions",
      bottomCtaH2: "Let's talk about your AI project",
      bottomCtaPitch:
        "We start by understanding what you actually want to automate or improve. If AI is the right answer, we say yes. If it isn't, we say so too.",
      bottomCtaLabel: "Start",
    },
  },
  "conseil-ia": {
    fr: {
      metaTitle: "Conseil IA et transformation numérique pour PME | MAWT",
      metaDescription:
        "Stratégie IA, audit opérationnel, transformation numérique, change management. On aide à décider où mettre l'IA, et où ne pas en mettre.",
      h1: "Conseil IA et transformation numérique pour PME.",
      subhead: "Stratégie IA, audit opérationnel, change management. On aide à décider avant de construire.",
      ctaPrimary: "Discutons",
      ctaSecondary: "Cas de transformation",
      ctaPrimaryHref: "contact",
      ctaSecondaryHref: "projets",
      introParagraphs: [
        "Tout le monde parle d'IA. Personne ne sait par où commencer. Vos équipes hésitent, vos process sont flous, vous craignez le projet à 200k qui ne sert à rien.",
        "Le vrai piège, c'est de sauter sur la première solution étiquetée IA sans diagnostic. Certains vendent des chatbots à des boîtes qui ont besoin d'autre chose. D'autres pondent des rapports sans jamais coder une ligne. Aucune de ces deux approches ne résout votre problème de fond.",
        "On commence par comprendre votre boîte. On identifie où l'IA crée vraiment de la valeur, et où elle est un gadget. On vous accompagne sur la mise en œuvre, le change management, la formation des équipes. Conseil et exécution dans la même équipe : c'est rare.",
      ],
      servicesH2: "Ce qu'on fait dans cette famille",
      socialProof:
        "Cas concrets : Crown (transformation 360 avec restructuration organisation, tech et IA), DG Expertise (digitalisation interne après audit), missions de stratégie IA pour les entreprises commerciales en croissance de Suisse romande.",
      projectsH2: "Projets de la famille Conseil IA",
      faqH2: "Questions fréquentes sur le conseil IA et la transformation",
      bottomCtaH2: "Discutons de votre transformation",
      bottomCtaPitch:
        "30 minutes pour comprendre où vous en êtes. On dit franchement si on est les bons. Si ce n'est pas le cas, on recommande quelqu'un d'autre.",
      bottomCtaLabel: "Démarrer",
    },
    en: {
      metaTitle: "AI consulting and digital transformation | MAWT Geneva",
      metaDescription:
        "AI strategy, business audit, change management. We help you decide where AI matters, and where it doesn't.",
      h1: "AI consulting and digital transformation.",
      subhead: "AI strategy, business audit, change management. Senior humans who think before they code.",
      ctaPrimary: "Get in touch",
      ctaSecondary: "Transformation cases",
      ctaPrimaryHref: "contact",
      ctaSecondaryHref: "projects",
      introParagraphs: [
        "Everyone talks AI. Nobody knows where to start. Your team hesitates, your processes are unclear, you fear the 300k project that delivers nothing.",
        "The real trap is jumping on the first pitch labelled AI without a diagnosis. Some sell chatbots to companies that need something else entirely. Others ship reports and never write a line of code. Neither approach actually solves your problem.",
        "We start by understanding your business. We identify where AI creates real value, and where it's a gadget. We support rollout, change management, team training. Consulting and execution from the same team : that's rare.",
      ],
      servicesH2: "What we do in this family",
      socialProof:
        "Real cases : Crown (360 transformation across org, tech and AI), DG Expertise (internal digitalisation after audit), AI strategy missions for growing commercial companies across French speaking Switzerland.",
      projectsH2: "Featured AI consulting projects",
      faqH2: "Frequently asked questions about AI consulting and transformation",
      bottomCtaH2: "Let's talk about your transformation",
      bottomCtaPitch:
        "30 minutes to understand where you are. We tell you honestly if we're the right fit. If we're not, we recommend someone else.",
      bottomCtaLabel: "Start",
    },
  },
  "renfort-equipe": {
    fr: {
      metaTitle: "Renfort tech et design dédié pour votre équipe | MAWT",
      metaDescription:
        "Développeur dédié, expert IA, designer UX, CTO temps partiel. Personne choisie, intégrée à votre business. Basés à Genève.",
      h1: "Renfort d'équipe digitale, soigneusement choisi.",
      subhead:
        "Pas un profil interchangeable. Une personne dédiée, sélectionnée pour votre business, intégrée à votre équipe.",
      ctaPrimary: "Discutons",
      ctaSecondary: "Profils et disponibilités",
      ctaPrimaryHref: "contact",
      ctaSecondaryHref: "contact",
      introParagraphs: [
        "Vous avez un projet, vous manquez de ressources. Vous pourriez ouvrir Malt ou LinkedIn, screener 30 candidats, vous tromper deux fois. Ou attendre six mois qu'un recrutement aboutisse.",
        "Les marketplaces vous laissent seul face au choix. Les ESN classiques envoient des juniors interchangeables qui changent de mission tous les trois mois. Aucune des deux options ne respecte ce qui vous importe vraiment : la qualité, la continuité, la compréhension de votre métier.",
        "On fait l'opposé. On comprend votre besoin, on choisit la bonne personne dans notre équipe ou dans notre réseau senior. Développeur dédié, designer UX, expert IA, CTO ou tech lead à temps partiel. Cette personne devient une extension de votre équipe, pas un consultant qui facture à l'heure.",
      ],
      servicesH2: "Les profils qu'on met à votre disposition",
      socialProof:
        "Cas concrets : Digital Admin (renfort développeur à la demande), EMS (QA testing), Swixit (sparring UX et UI continu), Kouleta (pilotage de refonte).",
      projectsH2: "Projets de la famille Renfort et équipe",
      faqH2: "Questions fréquentes sur le renfort d'équipe",
      bottomCtaH2: "Quel profil vous manque ?",
      bottomCtaPitch:
        "30 minutes pour comprendre votre contexte. On propose ensuite la bonne personne, pas un CV pris au hasard dans une base.",
      bottomCtaLabel: "Discutons",
    },
    en: {
      metaTitle: "Dedicated tech and design talent for your team | MAWT",
      metaDescription:
        "Senior dedicated developers, UX designers, AI experts, fractional CTO. Curated, not rented. Geneva based.",
      h1: "Dedicated tech and design talent. Curated, not rented.",
      subhead: "Not interchangeable freelancers. Senior people, picked for your business, embedded into your team.",
      ctaPrimary: "Get in touch",
      ctaSecondary: "Roles and availability",
      ctaPrimaryHref: "contact",
      ctaSecondaryHref: "contact",
      introParagraphs: [
        "You have a project. You're short on resources. You could browse marketplaces, screen 30 candidates, mis-hire twice. Or wait six months for a real hire to land.",
        "Marketplaces leave you alone with the choice. Classic agencies send juniors who rotate every three months. Neither respects what matters : quality, continuity, deep understanding of your business.",
        "We do the opposite. We understand your need, we pick the right person from our team or our senior network. Dedicated developer, UX designer, AI expert, fractional CTO or tech lead. That person becomes an extension of your team, not a consultant billing hours.",
      ],
      servicesH2: "The roles we bring to your team",
      socialProof:
        "Real cases : Digital Admin (on demand dev resources), EMS (QA testing), Swixit (continuous UX and UI sparring), Kouleta (redesign pilot).",
      projectsH2: "Featured Team augmentation projects",
      faqH2: "Frequently asked questions about team augmentation",
      bottomCtaH2: "Which role are you missing ?",
      bottomCtaPitch:
        "30 minutes to understand your context. Then we propose the right person, not a random CV pulled from a database.",
      bottomCtaLabel: "Get in touch",
    },
  },
  "formation-ia": {
    fr: {
      metaTitle: "Formation IA et ChatGPT pour entreprises | MAWT",
      metaDescription:
        "Formation ChatGPT en entreprise, ateliers IA équipes, coaching décideurs. Sessions sur mesure basées sur vos vrais cas métier.",
      h1: "Formation IA pour entreprises et équipes.",
      subhead: "ChatGPT en entreprise, ateliers IA, coaching décideurs. Sessions sur mesure, pas du replay YouTube.",
      ctaPrimary: "Discutons",
      ctaSecondary: "Voir les modules",
      ctaPrimaryHref: "contact",
      ctaSecondaryHref: "services/formation-ia",
      introParagraphs: [
        "Vos équipes utilisent ChatGPT en cachette. Ou pas du tout. Pas de cadre, pas de méthode, pas de sécurité. Et vous voyez les écarts se creuser entre ceux qui maîtrisent et les autres.",
        "Les formations IA standards sont trop générales pour être utiles. Deux heures de vidéo sur ChatGPT ne changent rien à la pratique de votre équipe demain matin. Il faut du contexte : vos outils, vos process, vos vrais cas.",
        "On construit des sessions sur mesure à partir de votre quotidien. ChatGPT appliqué à vos vrais documents, agents IA testés sur vos vrais workflows, coaching individuel pour les décideurs. Vos équipes repartent avec du concret, pas des slides.",
      ],
      servicesH2: "Ce qu'on propose dans cette famille",
      socialProof:
        "Cas concrets : formations ChatGPT pour équipes dirigeantes de PME romandes, ateliers IA pour équipes commerciales, coaching individuel pour décideurs.",
      projectsH2: "Projets de formation menés",
      faqH2: "Questions fréquentes sur la formation IA",
      bottomCtaH2: "Discutons de votre besoin en formation",
      bottomCtaPitch:
        "30 minutes pour comprendre votre niveau et vos enjeux. On construit ensuite un programme qui parle de votre métier, pas du nôtre.",
      bottomCtaLabel: "Démarrer",
    },
    en: {
      metaTitle: "AI and ChatGPT training for teams | MAWT Geneva",
      metaDescription:
        "ChatGPT for teams, AI workshops, leader AI coaching. Custom sessions built on your real use cases.",
      h1: "AI training for teams and leaders.",
      subhead: "ChatGPT for teams, AI workshops, leader coaching. Custom sessions, not generic YouTube replays.",
      ctaPrimary: "Get in touch",
      ctaSecondary: "See modules",
      ctaPrimaryHref: "contact",
      ctaSecondaryHref: "services/ai-training",
      introParagraphs: [
        "Your team uses ChatGPT in secret. Or not at all. No framework, no method, no security. And you can see the gap widening between those who master it and those who don't.",
        "Standard AI training is too generic to matter. A two hour ChatGPT video won't change your team's practice tomorrow morning. You need context : your tools, your processes, your real cases.",
        "We build custom sessions from your day to day reality. ChatGPT applied to your actual documents, AI agents tested on your real workflows, individual coaching for leaders. Your team leaves with something concrete, not slides.",
      ],
      servicesH2: "What we offer in this family",
      socialProof:
        "Real cases : ChatGPT training for executive teams of Swiss SMBs, AI workshops for sales teams, individual coaching for leaders.",
      projectsH2: "Training engagements we ran",
      faqH2: "Frequently asked questions about AI training",
      bottomCtaH2: "Let's talk about your training need",
      bottomCtaPitch:
        "30 minutes to understand your level and your stakes. Then we build a programme that speaks your business language, not ours.",
      bottomCtaLabel: "Start",
    },
  },
  "digital": {
    "fr": {
      "metaTitle": "Stratégie et outils digitaux pour PME suisses | MAWT",
      "metaDescription": "Conseil digital, e-commerce, applications métier. Une stratégie pragmatique et des outils qui font tourner votre activité. Équipe senior à Genève.",
      "h1": "Le digital qui fait tourner votre activité.",
      "subhead": "Stratégie digitale, commerce en ligne, applications métier. Des outils construits pour votre quotidien, pas pour la démo.",
      "ctaPrimary": "Discutons",
      "ctaSecondary": "Voir nos projets",
      "ctaPrimaryHref": "contact",
      "ctaSecondaryHref": "projets",
      "introParagraphs": [
        "Votre activité tourne, mais vos outils suivent mal. Un site qui vend peu, un back-office plein de ressaisies, des décisions prises sans vision claire. Vous sentez que le digital pourrait faire plus, sans savoir par où commencer.",
        "Le piège classique : empiler des outils. Un e-shop par ici, un logiciel par là, un consultant qui livre un rapport et disparaît. Résultat : des systèmes qui ne se parlent pas et une équipe qui bricole entre les deux.",
        "On prend le problème dans l'ordre. D'abord comprendre votre modèle et vos priorités. Ensuite construire ce qui manque : commerce digital qui convertit, applications métier qui remplacent les tableurs, stratégie qui tient sur une page et se met en œuvre. Un seul interlocuteur du diagnostic au déploiement."
      ],
      "servicesH2": "Ce qu'on construit dans cette famille",
      "socialProof": "Cas concrets : Crown (transformation digitale complète), phaam.ch (e-commerce), Diagora (digitalisation des process), Mellender (application métier immobilière).",
      "projectsH2": "Projets de la famille Digital",
      "faqH2": "Questions fréquentes sur la stratégie et les outils digitaux",
      "bottomCtaH2": "Discutons de votre projet digital",
      "bottomCtaPitch": "30 minutes pour comprendre où vous en êtes et ce qui bloque. On dit franchement ce qui vaut la peine d'être construit, et ce qui peut attendre.",
      "bottomCtaLabel": "Démarrer"
    },
    "en": {
      "metaTitle": "Digital strategy, e-commerce and business apps | MAWT",
      "metaDescription": "Digital consulting, e-commerce, business applications. Pragmatic strategy and tools that run your operations. Senior team based in Geneva.",
      "h1": "Digital that runs your business, not just your website.",
      "subhead": "Digital strategy, online commerce, business applications. Tools built for your daily operations, not for the demo.",
      "ctaPrimary": "Get in touch",
      "ctaSecondary": "See our work",
      "ctaPrimaryHref": "contact",
      "ctaSecondaryHref": "work",
      "introParagraphs": [
        "Your business runs, but your tools lag behind. A site that barely sells, a back office full of double entry, decisions made without a clear picture. You sense digital could do more, without knowing where to start.",
        "The classic trap is stacking tools. An e-shop here, a software there, a consultant who ships a report and disappears. You end up with systems that don't talk to each other and a team improvising in between.",
        "We take the problem in order. First understand your model and your priorities. Then build what's missing : digital commerce that converts, business applications that replace spreadsheets, a strategy that fits on one page and actually gets executed. One senior point of contact from diagnosis to rollout."
      ],
      "servicesH2": "What we build in this family",
      "socialProof": "Real cases : Crown (full digital transformation), phaam.ch (e-commerce), Diagora (process digitalisation), Mellender (real estate business application).",
      "projectsH2": "Featured Digital projects",
      "faqH2": "Frequently asked questions about digital strategy and tools",
      "bottomCtaH2": "Let's talk about your digital project",
      "bottomCtaPitch": "30 minutes to understand where you are and what's blocking you. We tell you honestly what's worth building, and what can wait.",
      "bottomCtaLabel": "Start"
    }
  },
  "donnees-analytics": {
    "fr": {
      "metaTitle": "Données et analytics pour décider vite | MAWT",
      "metaDescription": "Modernisation des données, tableaux de bord, IA générative. On transforme vos données éparpillées en décisions. Équipe senior à Genève.",
      "h1": "Vos données savent déjà. Encore faut-il les entendre.",
      "subhead": "Modernisation des données, tableaux de bord, intelligence connectée, IA générative. Des données éparpillées aux décisions claires.",
      "ctaPrimary": "Discutons",
      "ctaSecondary": "Voir nos projets",
      "ctaPrimaryHref": "contact",
      "ctaSecondaryHref": "projets",
      "introParagraphs": [
        "Vos chiffres existent. Dans l'ERP, dans le CRM, dans quinze exports Excel, dans la tête de deux personnes clés. Mais quand il faut décider, personne n'a la même version et tout le monde perd une journée à réconcilier.",
        "Le problème n'est presque jamais le manque de données. C'est leur éparpillement. Des sources qui ne se parlent pas, des définitions qui divergent, des rapports refaits à la main chaque mois. Et pendant ce temps, les décisions se prennent au feeling.",
        "On remet vos données en ordre de marche. Modernisation des flux, tableaux de bord qui répondent aux vraies questions, gestion des données propre, et IA générative branchée sur vos sources quand elle apporte quelque chose. Hébergement suisse ou européen, conformité nLPD comprise dès la conception."
      ],
      "servicesH2": "Ce qu'on construit dans cette famille",
      "socialProof": "Cas concrets : Mellender (RAG sur base documentaire immobilière), Crown (données unifiées dans un CRM intelligent), Diagora (automatisation des flux de données métier).",
      "projectsH2": "Projets de la famille Données et Analytics",
      "faqH2": "Questions fréquentes sur les données et l'analytics",
      "bottomCtaH2": "Discutons de vos données",
      "bottomCtaPitch": "30 minutes pour comprendre où sont vos données et ce que vous voulez en tirer. On identifie le premier chantier utile, pas le plus vendeur.",
      "bottomCtaLabel": "Démarrer"
    },
    "en": {
      "metaTitle": "Data and analytics that drive decisions | MAWT",
      "metaDescription": "Data modernisation, dashboards, generative AI. We turn scattered data into clear decisions. Senior team based in Geneva.",
      "h1": "Your data already knows. Time to listen to it.",
      "subhead": "Data modernisation, dashboards, connected intelligence, generative AI. From scattered data to clear decisions.",
      "ctaPrimary": "Get in touch",
      "ctaSecondary": "See our work",
      "ctaPrimaryHref": "contact",
      "ctaSecondaryHref": "work",
      "introParagraphs": [
        "Your numbers exist. In the ERP, in the CRM, in fifteen Excel exports, in the heads of two key people. But when a decision is due, nobody has the same version and everyone loses a day reconciling.",
        "The problem is almost never a lack of data. It's fragmentation. Sources that don't talk to each other, definitions that drift, reports rebuilt by hand every month. Meanwhile, decisions get made on gut feel.",
        "We put your data back to work. Modernised pipelines, dashboards that answer the questions you actually ask, clean data management, and generative AI plugged into your sources where it adds something. Swiss or European hosting, nLPD compliance built in from day one."
      ],
      "servicesH2": "What we build in this family",
      "socialProof": "Real cases : Mellender (RAG on a real estate knowledge base), Crown (unified data inside a smart CRM), Diagora (automated business data flows).",
      "projectsH2": "Featured Data and Analytics projects",
      "faqH2": "Frequently asked questions about data and analytics",
      "bottomCtaH2": "Let's talk about your data",
      "bottomCtaPitch": "30 minutes to understand where your data lives and what you want from it. We identify the first useful project, not the flashiest one.",
      "bottomCtaLabel": "Start"
    }
  },
  "developpement-logiciel": {
    "fr": {
      "metaTitle": "Développement logiciel sur mesure à Genève | MAWT",
      "metaDescription": "MVP, applications web et mobiles, API, modernisation, renfort IT. Ingénierie senior de bout en bout, du prototype au système critique.",
      "h1": "Du MVP au système critique, une seule équipe.",
      "subhead": "Web, mobile, desktop, API, bases de données, modernisation. Ingénierie senior de bout en bout, basée à Genève.",
      "ctaPrimary": "Discutons",
      "ctaSecondary": "Voir nos projets",
      "ctaPrimaryHref": "contact",
      "ctaSecondaryHref": "projets",
      "introParagraphs": [
        "Vous avez un produit à lancer, un logiciel vieillissant à moderniser, ou une équipe qui n'arrive plus à suivre. Le point commun : vous avez besoin de code qui tient, écrit par des gens qui ont déjà livré.",
        "Le marché est plein d'extrêmes. Des agences qui livrent vite et mal, des ESN qui facturent des juniors au prix de seniors, des freelances qui disparaissent après la V1. Entre les deux, il manque une équipe qui s'engage sur le résultat et reste après la mise en production.",
        "On développe de bout en bout : MVP pour valider vite, applications web et mobiles, API, bases de données, modernisation de logiciels existants, renfort pour vos équipes IT. .NET, Node.js, Python, TypeScript, React Native selon le besoin, jamais l'inverse. Avec l'IA intégrée dans le développement quand elle accélère sans dégrader."
      ],
      "servicesH2": "Ce qu'on construit dans cette famille",
      "socialProof": "Cas concrets : Mellender (CRM immobilier avec RAG), Crown (CRM intelligent sur mesure), Diagora (automatisations métier), phaam.ch et Kouleta (développement web).",
      "projectsH2": "Projets de la famille Développement logiciel",
      "faqH2": "Questions fréquentes sur le développement logiciel",
      "bottomCtaH2": "Discutons de votre logiciel",
      "bottomCtaPitch": "30 minutes pour comprendre ce que vous voulez construire ou moderniser. On vous dit ce qui est réaliste, dans quel ordre, et ce que ça implique.",
      "bottomCtaLabel": "Démarrer un projet"
    },
    "en": {
      "metaTitle": "Custom software development in Geneva | MAWT",
      "metaDescription": "MVPs, web and mobile apps, APIs, modernisation, IT reinforcement. Senior end-to-end engineering, from prototype to critical systems.",
      "h1": "From MVP to critical system, one team.",
      "subhead": "Web, mobile, desktop, APIs, databases, modernisation. Senior end-to-end engineering, based in Geneva.",
      "ctaPrimary": "Get in touch",
      "ctaSecondary": "See our work",
      "ctaPrimaryHref": "contact",
      "ctaSecondaryHref": "work",
      "introParagraphs": [
        "You have a product to launch, an ageing system to modernise, or a team that can't keep up. The common thread : you need code that holds, written by people who have shipped before.",
        "The market is full of extremes. Agencies that ship fast and badly, consultancies billing juniors at senior rates, freelancers who vanish after V1. What's missing in between is a team that commits to the outcome and stays after go-live.",
        "We build end to end : MVPs to validate fast, web and mobile applications, APIs, databases, modernisation of existing software, reinforcement for your IT teams. .NET, Node.js, Python, TypeScript, React Native as the need dictates, never the other way around. With AI woven into development where it speeds things up without cutting corners."
      ],
      "servicesH2": "What we build in this family",
      "socialProof": "Real cases : Mellender (real estate CRM with RAG), Crown (custom smart CRM), Diagora (business automation), phaam.ch and Kouleta (web development).",
      "projectsH2": "Featured Software development projects",
      "faqH2": "Frequently asked questions about software development",
      "bottomCtaH2": "Let's talk about your software",
      "bottomCtaPitch": "30 minutes to understand what you want to build or modernise. We tell you what's realistic, in what order, and what it takes.",
      "bottomCtaLabel": "Start a project"
    }
  },
  "securite": {
    "fr": {
      "metaTitle": "Cybersécurité pragmatique pour PME suisses | MAWT",
      "metaDescription": "Cybersécurité, conformité nLPD, tests d'intrusion, SIEM. Sécurité pragmatique pour PME, réseau d'experts seniors, un seul interlocuteur.",
      "h1": "La sécurité qui protège votre activité, pas votre conscience.",
      "subhead": "Cybersécurité, conformité nLPD, tests d'intrusion, SIEM. Pragmatique, dimensionné pour les PME suisses.",
      "ctaPrimary": "Discutons",
      "ctaSecondary": "Voir nos projets",
      "ctaPrimaryHref": "contact",
      "ctaSecondaryHref": "projets",
      "introParagraphs": [
        "Vous savez que vous devriez faire quelque chose. La nLPD est en vigueur, vos clients posent des questions, et les attaques sur les PME suisses ne relèvent plus de l'anecdote. Mais entre l'audit à 80k et la checklist gratuite qui ne sert à rien, difficile de savoir où mettre le curseur.",
        "Le vrai risque pour une PME, ce n'est pas le scénario hollywoodien. C'est le mot de passe partagé, la sauvegarde jamais testée, le compte d'un ancien employé resté ouvert, la facture piégée. Des failles simples, exploitées simplement, qui peuvent arrêter votre activité pendant des semaines.",
        "On aborde la sécurité comme le reste : par le pragmatisme. On identifie ce qui menace vraiment votre continuité, on corrige dans l'ordre d'impact, on met en place ce qui doit durer. Tests d'intrusion, conformité nLPD, surveillance SIEM quand la taille le justifie. Le tout via un réseau d'experts seniors éprouvés, avec MAWT comme interlocuteur unique."
      ],
      "servicesH2": "Ce qu'on couvre dans cette famille",
      "socialProof": "On s'appuie sur un réseau d'experts sécurité seniors, choisis mission par mission selon votre contexte. Vous gardez un seul interlocuteur, une seule méthode, un seul responsable du résultat.",
      "projectsH2": "Projets de la famille Sécurité",
      "faqH2": "Questions fréquentes sur la cybersécurité et la conformité",
      "bottomCtaH2": "Discutons de votre sécurité",
      "bottomCtaPitch": "30 minutes pour comprendre votre exposition réelle. On vous dit ce qui est urgent, ce qui peut attendre, et ce dont vous n'avez pas besoin.",
      "bottomCtaLabel": "Démarrer"
    },
    "en": {
      "metaTitle": "Pragmatic cybersecurity for Swiss SMBs | MAWT",
      "metaDescription": "Cybersecurity, nLPD compliance, penetration testing, SIEM. Pragmatic security for SMBs, senior expert network, one point of contact.",
      "h1": "Security that protects your business, not just your conscience.",
      "subhead": "Cybersecurity, nLPD compliance, penetration testing, SIEM. Pragmatic, sized for Swiss SMBs.",
      "ctaPrimary": "Get in touch",
      "ctaSecondary": "See our work",
      "ctaPrimaryHref": "contact",
      "ctaSecondaryHref": "work",
      "introParagraphs": [
        "You know you should do something. The nLPD is in force, your clients are asking questions, and attacks on Swiss SMBs are no longer anecdotal. But between the 80k audit and the free checklist that changes nothing, it's hard to know where to set the bar.",
        "The real risk for an SMB isn't the Hollywood scenario. It's the shared password, the backup nobody ever tested, the former employee's account left open, the booby-trapped invoice. Simple flaws, simply exploited, that can stop your business for weeks.",
        "We approach security like everything else : pragmatically. We identify what actually threatens your continuity, fix things in order of impact, and put in place what needs to last. Penetration testing, nLPD compliance, SIEM monitoring when your size justifies it. All through a proven network of senior security experts, with MAWT as your single point of contact."
      ],
      "servicesH2": "What we cover in this family",
      "socialProof": "We work with a network of senior security experts, selected engagement by engagement to match your context. You keep one point of contact, one method, one owner of the outcome.",
      "projectsH2": "Featured Security projects",
      "faqH2": "Frequently asked questions about cybersecurity and compliance",
      "bottomCtaH2": "Let's talk about your security",
      "bottomCtaPitch": "30 minutes to understand your real exposure. We tell you what's urgent, what can wait, and what you don't need at all.",
      "bottomCtaLabel": "Start"
    }
  },
  "operations-scm": {
    "fr": {
      "metaTitle": "ERP, opérations et chaîne logistique PME | MAWT",
      "metaDescription": "ERP, gestion des opérations, logistique, entrepôt, fournisseurs, GED. Des opérations qui tournent sans ressaisies ni tableurs fragiles.",
      "h1": "Des opérations qui tournent sans ressaisies.",
      "subhead": "ERP, chaîne logistique, entrepôt, fournisseurs, GED. On remplace les tableurs fragiles par des systèmes qui tiennent.",
      "ctaPrimary": "Discutons",
      "ctaSecondary": "Voir nos projets",
      "ctaPrimaryHref": "contact",
      "ctaSecondaryHref": "projets",
      "introParagraphs": [
        "Vos opérations reposent sur des tableurs que deux personnes comprennent, des ressaisies entre trois systèmes, et beaucoup de mémoire humaine. Ça tient. Jusqu'au jour où quelqu'un part en vacances, où une commande double, où le stock affiché ne correspond plus au stock réel.",
        "Les grands projets ERP font peur, à raison : dix-huit mois, budget doublé, équipes épuisées, pour finir avec un outil que personne n'utilise correctement. Mais l'alternative n'est pas de ne rien faire. C'est de prendre les chantiers dans le bon ordre, avec des outils dimensionnés pour votre réalité.",
        "On structure vos opérations pièce par pièce : ERP adapté à votre taille, gestion d'entrepôt et de stock fiable, suivi fournisseurs, GED qui remplace les dossiers partagés chaotiques, automatisations entre vos systèmes. Chaque brique se connecte aux autres, et vos équipes arrêtent de ressaisir."
      ],
      "servicesH2": "Ce qu'on couvre dans cette famille",
      "socialProof": "On combine notre équipe d'ingénierie avec un réseau d'experts opérations et supply chain seniors, activé selon votre secteur. Un seul interlocuteur, du diagnostic à la mise en production.",
      "projectsH2": "Projets de la famille Opérations et SCM",
      "faqH2": "Questions fréquentes sur les opérations et la chaîne logistique",
      "bottomCtaH2": "Discutons de vos opérations",
      "bottomCtaPitch": "30 minutes pour comprendre comment vos opérations tournent aujourd'hui. On identifie le point de friction qui coûte le plus, et on commence par là.",
      "bottomCtaLabel": "Démarrer"
    },
    "en": {
      "metaTitle": "ERP, operations and supply chain software | MAWT",
      "metaDescription": "ERP, operations management, logistics, warehouse, suppliers, document management. Operations that run without double entry or fragile spreadsheets.",
      "h1": "Operations that run without double entry.",
      "subhead": "ERP, supply chain, warehouse, suppliers, document management. We replace fragile spreadsheets with systems that hold.",
      "ctaPrimary": "Get in touch",
      "ctaSecondary": "See our work",
      "ctaPrimaryHref": "contact",
      "ctaSecondaryHref": "work",
      "introParagraphs": [
        "Your operations run on spreadsheets two people understand, re-entry across three systems, and a lot of human memory. It holds. Until someone goes on holiday, an order gets duplicated, or the stock on screen no longer matches the stock on the shelf.",
        "Big ERP projects are scary, and rightly so : eighteen months, doubled budget, exhausted teams, ending with a tool nobody uses properly. But the alternative isn't doing nothing. It's tackling the work in the right order, with tools sized for your reality.",
        "We structure your operations piece by piece : an ERP that fits your size, reliable warehouse and stock management, supplier tracking, document management that replaces chaotic shared folders, automation between your systems. Each piece connects to the others, and your team stops re-entering data."
      ],
      "servicesH2": "What we cover in this family",
      "socialProof": "We combine our engineering team with a network of senior operations and supply chain experts, engaged to match your industry. One point of contact, from diagnosis to go-live.",
      "projectsH2": "Featured Operations and SCM projects",
      "faqH2": "Frequently asked questions about operations and supply chain",
      "bottomCtaH2": "Let's talk about your operations",
      "bottomCtaPitch": "30 minutes to understand how your operations run today. We find the friction point that costs you most, and start there.",
      "bottomCtaLabel": "Start"
    }
  },
};
