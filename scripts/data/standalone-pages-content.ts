export type MethodPageCopy = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  heroH1: string;
  heroH2: string;
  intro: string;
  steps: { title: string; body: string }[];
  differentiators: string;
  bottomCtaH2: string;
  bottomCtaBody: string;
  bottomCtaLabel: string;
};

export type SecurityPageCopy = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  heroH1: string;
  heroH2: string;
  intro: string;
  sections: { title: string; body: string }[];
  bottomCtaH2: string;
  bottomCtaBody: string;
  bottomCtaLabel: string;
};

export const STANDALONE_PAGES = {
  method: {
    fr: {
      slug: "notre-methode",
      metaTitle: "Notre méthode de travail | MAWT, studio à Genève",
      metaDescription:
        "Comment on bosse avec vous : du premier échange au suivi long terme. Une vraie collaboration, pas une prestation.",
      heroH1: "Notre méthode, en cinq temps.",
      heroH2: "Comprendre, cadrer, construire, livrer, rester. Une vraie collaboration, pas une prestation.",
      intro:
        "On ne suit pas un cahier des charges au pied de la lettre, on ne livre pas un PDF puis on disparaît. Notre méthode tient en cinq temps. Chacun est pensé pour qu'au bout du chemin, vous ayez quelque chose qui marche vraiment, pas juste quelque chose qui coche les cases.",
      steps: [
        {
          title: "Comprendre",
          body: "On commence par votre boîte, pas par notre solution. Entretiens avec votre équipe, cartographie de vos process, analyse de vos données, immersion dans votre métier. Si on ne comprend pas ce qui vous fait avancer ou ce qui vous bloque, on ne peut rien construire d'utile.",
        },
        {
          title: "Cadrer",
          body: "On définit ensemble le problème à résoudre et les critères de succès mesurables. On propose une approche, on chiffre, on alerte sur les risques. Si l'IA n'est pas la bonne réponse, on le dit. Si un SaaS suffit, on le dit aussi. Le brief n'est pas figé : il évolue avec ce qu'on apprend.",
        },
        {
          title: "Construire",
          body: "On bosse en itérations courtes, avec des livraisons régulières que vous testez sur vos vraies données. Vous voyez avancer. Vous arbitrez en cours de route. Pas d'effet tunnel, pas de surprise au \"grand jour\" trois mois plus tard.",
        },
        {
          title: "Livrer",
          body: "On déploie en production, on forme votre équipe, on documente ce qu'il faut savoir pour faire vivre la solution. La passation n'est pas un événement, c'est un processus : on s'assure que vous êtes vraiment autonome avant de prendre de la distance.",
        },
        {
          title: "Rester",
          body: "On ne disparaît pas après le go live. Suivi des indicateurs, ajustements, évolutions mineures, support sur les incidents. Vous savez à qui parler et combien ça coûte. On grandit ensemble dans la durée, ou on s'efface progressivement quand votre interne reprend la main.",
        },
      ],
      differentiators:
        "Conseil et exécution dans la même équipe. Vous ne passez pas d'un cabinet qui pense à un prestataire qui exécute. Les gens qui font les choix sont aussi ceux qui construisent.\n\nVous parlez aux décideurs. Pas à un account manager qui transmet. Le senior qui travaille sur votre dossier est joignable directement.\n\nOn dit non quand il faut. Si votre besoin n'est pas pour nous, on le dit franchement et on recommande quelqu'un d'autre. Mieux vaut une fin claire qu'un projet qui patauge.\n\nContinuité long terme. La plupart de nos clients restent plus d'un an. C'est notre vrai indicateur de qualité, pas un NPS de fin de mission.",
      bottomCtaH2: "Envie de tester sur un vrai cas ?",
      bottomCtaBody:
        "30 minutes ensemble pour comprendre votre contexte. On vous dit franchement comment on aborderait votre projet, et si on est les bons.",
      bottomCtaLabel: "Discutons",
    },
    en: {
      slug: "our-process",
      metaTitle: "How we work | MAWT, Geneva based studio",
      metaDescription:
        "How we work with you, from first conversation to long term follow up. A real partnership, not a transaction.",
      heroH1: "Our process, in five steps.",
      heroH2: "Understand, frame, build, ship, stay. A real partnership, not a transaction.",
      intro:
        "We don't follow a spec to the letter, we don't drop a deck and disappear. Our process has five steps. Each one is built so that at the end of the road, you have something that actually works, not just something that ticks the boxes.",
      steps: [
        {
          title: "Understand",
          body: "We start with your business, not our solution. Team interviews, process mapping, data analysis, immersion in your domain. If we don't understand what moves you forward or what blocks you, we can't build anything useful.",
        },
        {
          title: "Frame",
          body: "We define the real problem together, with measurable success criteria. We propose an approach, we scope, we flag the risks. If AI isn't the right answer, we say so. If a SaaS will do, we say that too. The brief isn't frozen : it evolves with what we learn.",
        },
        {
          title: "Build",
          body: "We work in short iterations with regular drops you test on your real data. You see progress. You arbitrate along the way. No tunnel effect, no surprises three months later on launch day.",
        },
        {
          title: "Ship",
          body: "We deploy to production, we train your team, we document what's needed to keep the solution alive. Handoff isn't an event, it's a process : we make sure you're truly autonomous before stepping back.",
        },
        {
          title: "Stay",
          body: "We don't vanish after go live. Metric tracking, adjustments, minor evolutions, incident support. You know who to call and what it costs. We grow with you over time, or we step back progressively when your team takes over.",
        },
      ],
      differentiators:
        "Consulting and execution from the same team. You don't move from a firm that thinks to a vendor that executes. The people making the calls are also the ones building.\n\nYou talk to decision makers. Not an account manager who relays. The senior on your project is directly reachable.\n\nWe say no when we have to. If your need isn't for us, we say so honestly and recommend someone else. Better a clear end than a project that drifts.\n\nLong term continuity. Most of our clients stay over a year. That's our real quality metric, not a final mission NPS.",
      bottomCtaH2: "Want to try this on a real case ?",
      bottomCtaBody:
        "30 minutes together to understand your context. We tell you honestly how we'd approach your project, and whether we're the right team.",
      bottomCtaLabel: "Get in touch",
    },
  },
  security: {
    fr: {
      slug: "securite",
      metaTitle: "Sécurité, confidentialité et IA responsable | MAWT",
      metaDescription:
        "Hébergement Suisse, confidentialité, sécurité du code, IA responsable. Comment on protège vos données et vos systèmes.",
      heroH1: "Sécurité, confidentialité et IA responsable.",
      heroH2: "Comment on protège vos données, vos systèmes et vos utilisateurs.",
      intro:
        "Vos données ont de la valeur. Vos systèmes aussi. Quand on construit pour vous, on engage notre responsabilité sur la sécurité de ce qu'on livre. Cette page détaille comment on s'y prend, sans jargon et sans promesses creuses.",
      sections: [
        {
          title: "Hébergement et stockage des données",
          body: "Par défaut, on héberge vos données en Suisse ou dans l'Union européenne. Stack maîtrisée, fournisseurs identifiés, chaînes de sous traitance documentées. Si votre métier impose un hébergement spécifique (LPD, secteur réglementé, contraintes internes), on s'adapte.\n\nOn documente précisément où vivent vos données : production, sauvegardes, logs, environnements de test. Vous savez ce qui est où, qui y accède et combien de temps c'est conservé.",
        },
        {
          title: "Confidentialité",
          body: "NDA mutuel sur toutes les missions. Accès à vos systèmes strictement limité aux personnes de l'équipe qui travaillent sur votre projet. Comptes nominatifs, MFA partout où c'est possible, révocation immédiate à la fin de la mission ou au départ d'un collaborateur.\n\nVos données ne servent jamais à entraîner des modèles, à alimenter d'autres clients, ou à faire de la démonstration. Si on veut publier un cas client, on vous demande d'abord.",
        },
        {
          title: "Sécurité du code et des systèmes",
          body: "On code en suivant les bonnes pratiques OWASP. Revues de code systématiques, dépendances scannées et mises à jour, secrets jamais en clair dans le repo. On utilise des outils d'analyse statique et des tests automatisés pour détecter les régressions de sécurité avant la prod.\n\nSur l'infrastructure : principe du moindre privilège, journalisation des accès, sauvegardes testées régulièrement, plan de réponse aux incidents documenté. Pour les projets critiques, on peut intégrer une revue de sécurité externe avant mise en production.",
        },
        {
          title: "IA responsable",
          body: "Quand on construit une solution IA, on fait des choix explicites sur les modèles utilisés (OpenAI, Anthropic, modèles open source auto hébergés) et les données qui leur sont envoyées. Par défaut, on désactive l'usage de vos données pour l'entraînement chez les fournisseurs qui le permettent.\n\nPour les RAG, vos documents restent dans des bases sous votre contrôle ou le nôtre, jamais partagées. Les agents IA ont des garde fous explicites, des validations humaines aux étapes sensibles, et une journalisation complète de leurs actions.\n\nSur les usages risqués (génération de contenus publics, prise de décision automatisée), on conseille des règles internes claires et un sponsor humain identifié pour chaque cas.",
        },
        {
          title: "Conformité",
          body: "On accompagne la conformité avec la LPD suisse, le RGPD européen et les obligations sectorielles applicables (santé, finance, droit). On ne fait pas de conseil juridique, mais on construit les solutions de façon à ce que votre conformité soit possible et auditable.\n\nSur demande, on peut signer un avenant DPA (data processing agreement) qui formalise nos engagements en tant que sous traitant.",
        },
        {
          title: "Incidents et continuité",
          body: "Si quelque chose va mal, on est joignable rapidement. Plan de réponse aux incidents documenté avec vos équipes au démarrage du projet. Sauvegardes régulières et testées. Pour les solutions critiques, on peut mettre en place du monitoring proactif et un engagement de temps de réponse.",
        },
      ],
      bottomCtaH2: "Une question de sécurité spécifique ?",
      bottomCtaBody:
        "On répond directement, sans formulaire de qualification. Décrivez nous votre contexte, on revient avec une analyse honnête de ce qu'on peut garantir et de ce qu'on ne peut pas.",
      bottomCtaLabel: "Discutons",
    },
    en: {
      slug: "security",
      metaTitle: "Security, confidentiality and responsible AI | MAWT",
      metaDescription:
        "Swiss hosting, confidentiality, code security, responsible AI. How we protect your data and your systems.",
      heroH1: "Security, confidentiality and responsible AI.",
      heroH2: "How we protect your data, your systems and your users.",
      intro:
        "Your data has value. So do your systems. When we build for you, we put our name on the security of what we ship. This page lays out how we do it, no jargon, no empty promises.",
      sections: [
        {
          title: "Hosting and data storage",
          body: "By default, we host your data in Switzerland or the European Union. Controlled stack, identified providers, documented subprocessor chains. If your business requires a specific hosting choice (FADP, regulated sector, internal constraints), we adapt.\n\nWe document precisely where your data lives : production, backups, logs, test environments. You know what's where, who can access it and how long it's kept.",
        },
        {
          title: "Confidentiality",
          body: "Mutual NDA on every engagement. Access to your systems strictly limited to team members working on your project. Named accounts, MFA wherever possible, immediate revocation at end of mission or when a team member leaves.\n\nYour data is never used to train models, feed other clients, or for demos. If we want to publish a case study, we ask you first.",
        },
        {
          title: "Code and systems security",
          body: "We follow OWASP best practices. Systematic code reviews, dependencies scanned and updated, secrets never plain in the repo. We use static analysis and automated tests to catch security regressions before production.\n\nOn infrastructure : least privilege, access logging, regularly tested backups, documented incident response plan. For critical projects, we can plug in an external security review before launch.",
        },
        {
          title: "Responsible AI",
          body: "When we build an AI solution, we make explicit choices on the models used (OpenAI, Anthropic, self hosted open source models) and the data sent to them. By default, we disable training on your data with providers that allow it.\n\nFor RAG, your documents stay in databases under your control or ours, never shared. AI agents have explicit guardrails, human validations at sensitive steps, and full action logging.\n\nOn risky usage (public content generation, automated decision making), we advise clear internal rules and an identified human sponsor for each case.",
        },
        {
          title: "Compliance",
          body: "We support compliance with Swiss FADP, European GDPR and applicable sector regulations (health, finance, law). We don't give legal advice, but we build solutions so your compliance is possible and auditable.\n\nOn request, we can sign a DPA (data processing agreement) that formalises our commitments as a processor.",
        },
        {
          title: "Incidents and continuity",
          body: "If something goes wrong, we're reachable fast. Incident response plan documented with your team at project kickoff. Regularly tested backups. For critical solutions, we can set up proactive monitoring and a response time commitment.",
        },
      ],
      bottomCtaH2: "Got a specific security question ?",
      bottomCtaBody:
        "We answer directly, no qualification form. Tell us your context, we come back with an honest analysis of what we can guarantee and what we can't.",
      bottomCtaLabel: "Get in touch",
    },
  },
} as const;
