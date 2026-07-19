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
  | "developpement-logiciel"
  | "securite";

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
        "Un site MAWT est livré comme un système complet : design, structure éditoriale, CMS que votre équipe sait vraiment utiliser, SEO technique, analytics, et le budget performance qui garde Google et vos visiteurs satisfaits. On construit sur des fondations modernes — Next.js, CMS headless, Core Web Vitals mesurés — pour que le site reste rapide en grandissant au lieu de vieillir mal.",
        "Le travail suit notre méthode en quatre étapes : cadrage, construction, déploiement, amélioration. Vous voyez de vraies pages tôt, pas des maquettes à la semaine six. Les textes sont écrits pour la recherche ET pour les assistants IA qui répondent à votre place, en français et en anglais, parce qu'un public suisse lit les deux.",
        "C'est pensé pour les PME et entreprises en croissance de Genève et de Suisse romande qui ont besoin que leur site inspire confiance et ramène des demandes entrantes — pas seulement qu'il fasse bonne figure au prochain conseil. Quand le design est juste, ça se voit dans le pipeline, pas seulement dans les compliments.",
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
        "A MAWT website ships as a complete system : design, editorial structure, a CMS your team can actually use, technical SEO, analytics, and the performance budget that keeps Google and your visitors happy. We build on modern foundations — Next.js, headless CMS, measured Core Web Vitals — so the site stays fast as it grows instead of quietly rotting.",
        "The work follows our four-step method : scope, build, deploy, improve. You see real pages early, not mockups at week six. Copy is written for search AND for the AI assistants that now answer on your behalf, in French and English, because a Swiss audience reads both.",
        "It's built for SMEs and growing companies in Geneva and French-speaking Switzerland that need their site to earn trust and bring in enquiries — not just look good at the next board meeting. When the design is right, you feel it in the pipeline, not just the compliments.",
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
        "Concrètement, une mission produit un système qui tourne dans votre stack : un assistant RAG qui répond depuis vos documents en citant ses sources, un agent qui rédige des réponses dans votre boîte mail ou votre CRM, des tableaux de bord qui consolident vos chiffres sans équipe data. Vos données restent sous votre contrôle — hébergement suisse ou infrastructure locale quand la confidentialité l'exige, choix du modèle (Claude, GPT, Gemini ou open source local) dicté par le cas d'usage, jamais par la mode.",
        "On démarre petit, volontairement. Un process, automatisé de bout en bout, mesuré contre les heures qu'il consommait avant. Puis on étend au suivant. C'est comme ça que l'adoption de l'IA tient dans la durée : des gains visibles, pas de projet big bang.",
        "Nos clients sont surtout des PME de Genève et de Suisse romande avec de vraies opérations — vente, administration, logistique, service client — et pas de temps pour des expériences de laboratoire. Si une tâche prend des heures à votre équipe et suit des règles que vous savez décrire, il y a de bonnes chances qu'on puisse en automatiser l'essentiel.",
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
        "Concretely, an engagement produces a working system wired into your stack : a RAG assistant that answers from your documents and cites its sources, an agent that drafts replies inside your inbox or CRM, dashboards that consolidate your numbers without a data team. Your data stays under your control — Swiss hosting or your own infrastructure when confidentiality demands it, model choice (Claude, GPT, Gemini or local open-source) driven by the use case, never by hype.",
        "We start small on purpose. One process, automated end to end, measured against the hours it used to consume. Then we extend to the next one. That's how AI adoption sticks : visible wins, no big-bang project.",
        "Most of our clients are SMEs in Geneva and French-speaking Switzerland with real operations — sales, admin, logistics, client service — and no time for lab experiments. If a task takes your team hours and follows rules you can describe, there's a good chance we can automate most of it.",
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
        "Une mission de stratégie IA avec MAWT se termine par des décisions, pas par un deck : quels process automatiser en premier, ce que ça devrait coûter, quoi construire ou acheter, quels risques traiter (protection des données, nLPD, adoption par les équipes), et une feuille de route que votre équipe peut exécuter. Comme on construit aussi, chaque recommandation est une recommandation qu'on serait prêts à implémenter nous-mêmes — c'est ce qui garde le conseil honnête.",
        "L'audit regarde vos outils, vos données, et les workflows réels de vos équipes. On interroge les gens qui font le travail, pas seulement la direction. L'écart entre le process sur le papier et le process tel qu'il tourne vraiment, c'est en général là que la valeur se cache.",
        "C'est conçu pour les directions de PME suisses qui veulent une position claire sur l'IA sans embaucher un chief AI officer. Vous repartez en sachant où l'IA bouge vos chiffres, et où elle n'est qu'une distraction.",
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
        "An AI strategy engagement with MAWT ends with decisions, not a deck : which processes to automate first, what it should cost, what to build versus buy, which risks to handle (data protection, nLPD, team adoption), and a roadmap your team can execute. Because we also build, every recommendation is one we'd be willing to implement ourselves — that's what keeps the advice honest.",
        "The audit looks at your tools, your data, and your team's actual workflows. We interview the people who do the work, not just management. The gap between the process on paper and the process as it really runs is usually where the value hides.",
        "It's designed for leadership teams of Swiss SMEs that want a clear position on AI without hiring a chief AI officer. You leave knowing where AI moves your numbers, and where it's just a distraction.",
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
        "Chaque profil placé est senior, choisi à la main, et adossé au reste de MAWT : quand votre développeur dédié tombe sur une question d'infrastructure ou une décision de design, c'est toute l'équipe qui est derrière. Vous gagnez la continuité — la même personne, semaine après semaine — avec la profondeur de banc d'une agence.",
        "Les missions épousent votre réalité : plein temps sur un lancement, mi-temps sur une refonte, quelques jours par mois pour un CTO fractionnel. Pas d'engagement verrouillé sur trois mois, pas de remplacement surprise. Si quelqu'un n'est pas le bon fit, on le dit et on le corrige.",
        "Ça fonctionne pour les PME et scale-ups suisses qui ont besoin de capacité senior maintenant — pour livrer un produit, stabiliser une codebase, ou donner un cap technique à l'équipe — sans ajouter un poste permanent.",
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
        "Every profile we place is senior, hand-picked, and backed by the rest of MAWT : when your dedicated developer hits an infrastructure question or a design decision, the whole team stands behind them. You get continuity — the same person, week after week — with the bench depth of an agency.",
        "Engagements flex with your reality : full-time on a launch, half-time on a rebuild, a few days a month for a fractional CTO. No three-month lock-ins, no surprise substitutions. If someone isn't the right fit, we say it and we fix it.",
        "It works for Swiss SMEs and scale-ups that need senior capacity now — to ship a product, stabilise a codebase, or give the tech team a direction — without adding permanent headcount.",
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
        "Un programme type se déroule en demi-journées : un socle sur le fonctionnement réel des modèles (et leurs échecs), de la pratique sur vos documents et vos workflows, et un cadre de sécurité — ce qui peut aller dans un modèle public, ce qui ne sort jamais de chez vous, comment la nLPD s'applique. Les équipes repartent avec des prompts, des modèles et des habitudes qu'elles utilisent la semaine même.",
        "On forme sur les outils que vous garderez vraiment : ChatGPT, Claude, Copilot ou votre assistant interne. Et comme on construit des systèmes IA au quotidien, les questions reçoivent de vraies réponses, pas du contenu de slides.",
        "Les formats s'adaptent aux équipes suisses de cinq à quelques centaines de personnes : briefings de direction, ateliers par fonction pour la vente, les opérations ou les RH, et coaching individuel pour les décideurs qui veulent un espace privé pour se mettre à niveau.",
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
        "A typical programme runs in half-day sessions : a foundation on how the models actually work (and fail), hands-on practice on your documents and workflows, and a security frame — what may go into a public model, what never leaves your walls, how the nLPD applies. Teams leave with prompts, templates and habits they use the same week.",
        "We train on the tools you'll actually keep : ChatGPT, Claude, Copilot or your internal assistant. And because we build AI systems for a living, questions get real answers, not slideware.",
        "Formats fit Swiss teams from five to a few hundred people : executive briefings, function-specific workshops for sales, operations or HR, and one-to-one coaching for leaders who want a private space to get up to speed.",
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
        "On développe de bout en bout : MVP pour valider vite, applications web et mobiles, API, bases de données, modernisation de logiciels existants, renfort pour vos équipes IT. .NET, Node.js, Python, TypeScript, React Native selon le besoin, jamais l'inverse. Avec l'IA intégrée dans le développement quand elle accélère sans dégrader.",
        "Chaque projet part du même socle d'ingénierie : gestion de versions, revue de code, tests automatisés, CI/CD, environnements de staging, documentation. Pas parce que c'est à la mode, mais parce que c'est ce qui permet à une petite équipe de livrer du logiciel qu'une fiduciaire, une clinique ou un groupe industriel fait tourner tous les jours. Le code et les dépôts vous appartiennent dès le premier jour.",
        "On dit non tôt. Si une fonctionnalité ne sert pas le résultat, on le dit avant qu'elle coûte de l'argent. Si un logiciel du marché couvre 90 % de votre besoin, on le recommande et on l'intègre au lieu de le reconstruire.",
        "Du premier MVP en quelques semaines aux systèmes maintenus sur des années, c'est la même équipe senior qui reste responsable — architecture, code, déploiement, maintenance. Cette continuité, c'est exactement ce qui manque quand les agences tournent et que les freelances passent au projet suivant."
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
        "We build end to end : MVPs to validate fast, web and mobile applications, APIs, databases, modernisation of existing software, reinforcement for your IT teams. .NET, Node.js, Python, TypeScript, React Native as the need dictates, never the other way around. With AI woven into development where it speeds things up without cutting corners.",
        "Every project gets the same engineering floor : version control, code review, automated tests, CI/CD, staging environments, documentation. Not because it's fashionable, but because it's what lets a small team ship software that a fiduciary, a clinic or an industrial group runs daily. You own the code and the repositories from day one.",
        "We say no early. If a feature doesn't serve the outcome, we say so before it costs money. If off-the-shelf software covers 90% of your need, we recommend it and integrate it instead of rebuilding it.",
        "From a first MVP in a few weeks to systems maintained over years, the same senior team stays accountable — architecture, code, deployment, maintenance. That continuity is exactly what goes missing when agencies rotate staff and freelancers move on to the next thing."
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
        "On aborde la sécurité comme le reste : par le pragmatisme. On identifie ce qui menace vraiment votre continuité, on corrige dans l'ordre d'impact, on met en place ce qui doit durer. Tests d'intrusion, conformité nLPD, surveillance SIEM quand la taille le justifie. Le tout via un réseau d'experts seniors éprouvés, avec MAWT comme interlocuteur unique.",
        "Une première mission commence en général par une revue d'exposition : comptes et accès, sauvegardes et leurs tests de restauration, surface d'attaque email, pratiques de mots de passe et de prestataires, et l'écart entre ce que la nLPD exige et ce qui est en place. Vous recevez une liste priorisée — l'urgent, ce qui peut attendre, ce que vous pouvez ignorer sans risque — avec des coûts dimensionnés pour une PME.",
        "Les correctifs passent avant la paperasse. MFA partout où ça compte, sauvegardes testées, offboarding qui ferme vraiment les comptes, plan de réponse répété pour le jour où quelque chose passe. Ensuite seulement, la documentation qui le prouve à vos clients et aux auditeurs.",
        "Si vous traitez des données clients en Suisse, la sécurité fait désormais partie de la vente : questionnaires d'achat, demandes nLPD, conditions des cyber-assurances. Savoir répondre proprement est un atout commercial, pas seulement une protection."
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
        "We approach security like everything else : pragmatically. We identify what actually threatens your continuity, fix things in order of impact, and put in place what needs to last. Penetration testing, nLPD compliance, SIEM monitoring when your size justifies it. All through a proven network of senior security experts, with MAWT as your single point of contact.",
        "A first engagement usually starts with an exposure review : accounts and access, backups and their restore drills, email attack surface, password and vendor practices, and the gap between what the nLPD requires and what's actually in place. You get a prioritised list — what's urgent, what can wait, what you can safely ignore — with costs sized for an SMB.",
        "Fixes come before paperwork. MFA everywhere it matters, tested backups, offboarding that actually closes accounts, a rehearsed response plan for the day something slips through. Only then, the documentation that proves it to your clients and auditors.",
        "If you handle client data in Switzerland, security is now part of winning deals : procurement questionnaires, nLPD requests, cyber-insurance conditions. Being able to answer cleanly is a commercial asset, not just protection."
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
};
