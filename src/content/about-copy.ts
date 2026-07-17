export const ABOUT_COPY = {
  fr: {
    hero: {
      h1: "Une équipe à taille humaine, basée à Genève.",
      h2: "MAWT construit des systèmes IA-natifs, conseille sur l'adoption de l'IA et intègre des experts dédiés dans votre organisation. Pas une agence. Un studio.",
    },
    story: {
      h2: "Pourquoi MAWT",
      p1: "Chez MAWT, on pense toujours plus loin pour vous. Au-delà du brief, au-delà de la prestation. On cherche ce qui va vraiment vous faire avancer.",
      p2: "On devient une extension de votre équipe. On propose, on trouve, on construit. Même ce qui n'était pas dans le brief initial. C'est notre signature : l'accompagnement continu, pas la prestation one-shot.",
      p3: "Notre conviction : il n'y a pas de problème, il n'y a que des solutions. On les cherche avec vous, pas à côté. Et on construit ce qui résout vraiment, pas ce qui coche les cases.",
    },
    team: {
      h2: "L'équipe",
      body: "Plusieurs profils, une seule vision. Chacun expert dans son domaine, tous passionnés par leur métier. C'est cette complémentarité qui nous permet d'embrasser conseil ET exécution, marketing ET tech, stratégie ET IA. Toujours en partenariat avec vous.",
    },
    howWeWork: {
      h2: "Comment on bosse",
      principles: [
        {
          emoji: "🤝",
          title: "Extension de votre équipe",
          description: "On fait équipe avec vous. On pense, on construit, on reste à vos côtés.",
        },
        {
          emoji: "🧠",
          title: "Créateurs de solutions",
          description: "Il n'y a pas de problème, il n'y a que des solutions. Et on les crée avec vous.",
        },
        {
          emoji: "🎯",
          title: "Sur-mesure",
          description: "Chaque mission est conçue spécifiquement pour votre contexte et vos objectifs.",
        },
        {
          emoji: "⚡",
          title: "IA-natif",
          description: "L'IA est intégrée dès la conception de la solution, pour servir votre business au quotidien.",
        },
      ],
    },
    trackRecord: {
      h2: "Depuis 2021",
      body: "Plus de 50 missions choisies avec soin.",
    },
    bottomCta: {
      h2: "Construisons ce qui vous fait avancer.",
      body: "30 minutes ensemble pour qu'on se comprenne. Si ça matche, on enchaîne. Si non, on vous oriente vers ceux qui peuvent vous aider.",
      ctaPrimary: { label: "Discutons", href: "contact" },
      ctaSecondary: { label: "Voir nos projets", href: "projets" },
    },
    seo: {
      title: "À propos | MAWT, agence IA à Genève",
      description:
        "MAWT est une agence IA à Genève. Solutions d'intelligence artificielle, automatisation et conseil stratégique. Équipe à taille humaine, pour les PME suisses et entreprises en croissance qui veulent avancer.",
    },
  },
  en: {
    hero: {
      h1: "A senior human team, based in Geneva.",
      h2: "MAWT builds AI-native systems, advises on AI adoption, and embeds dedicated experts into your organization. Not an agency. A studio.",
    },
    story: {
      h2: "Why MAWT",
      p1: "At MAWT, we always think further for you. Beyond the brief, beyond the deliverable. We look for what will actually move you forward.",
      p2: "We become an extension of your team. We propose, we find, we build—including what wasn't in the initial brief. That's our signature: continuous partnership, not one-shot delivery.",
      p3: "Our conviction: there are no problems, only solutions. We hunt for them with you, not next to you. And we build what actually solves the problem, not what simply ticks boxes.",
    },
    team: {
      h2: "The team",
      body: "Several profiles, one shared vision. Each one is an expert in their domain, and all are passionate about what they do. That complementarity is what allows us to combine consulting and execution, marketing and technology, strategy and AI—always in partnership with you.",
    },
    howWeWork: {
      h2: "Our principles",
      principles: [
        {
          emoji: "🤝",
          title: "An extension of your team",
          description: "We team up with you. We think, we build, and we stay by your side.",
        },
        {
          emoji: "🧠",
          title: "Problem solver",
          description: "There are no problems, only solutions. And we build them with you.",
        },
        {
          emoji: "🎯",
          title: "Custom",
          description: "Each mission is built specifically for your context and your goals.",
        },
        {
          emoji: "⚡",
          title: "AI-native",
          description: "AI is woven into the solution from day one, serving your business every day.",
        },
      ],
    },
    trackRecord: {
      h2: "Since 2021",
      body: "Over 50 missions, picked with care.",
    },
    bottomCta: {
      h2: "Let's build what moves you forward.",
      body: "30 minutes together to get to know each other. If it clicks, we move forward. If not, we point you to those who can help.",
      ctaPrimary: { label: "Get in touch", href: "contact" },
      ctaSecondary: { label: "See our work", href: "projets" },
    },
    seo: {
      title: "About | MAWT, AI agency in Geneva",
      description:
        "MAWT is an AI agency in Geneva. AI consulting, automation, custom development, and dedicated experts. Senior team, for Swiss SMBs and growing companies across Europe.",
    },
  },
} as const;

export type AboutLangCopy = (typeof ABOUT_COPY)["fr"];
