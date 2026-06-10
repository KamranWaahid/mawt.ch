export const ABOUT_COPY = {
  fr: {
    hero: {
      h1: "Une équipe à taille humaine, basée à Genève.",
      h2: "MAWT est une agence IA à Genève. On construit des systèmes IA-natifs, on conseille sur l'adoption de l'IA et on met des experts dédiés au service de votre boîte. Une agence qui construit elle-même. Pas d'intermédiaires, pas de couches.",
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
      h2: "Parlons de votre projet",
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
      h2: "MAWT is an AI agency in Geneva. We build AI-native systems, advise on AI adoption, and embed dedicated experts into your organization. An agency that builds things itself. No middlemen, no layers.",
    },
    story: {
      h2: "Why MAWT",
      p1: "At MAWT, we always think further for you. Beyond the brief, beyond the deliverable. We look for what will actually move you forward.",
      p2: "We become an extension of your team. We propose, we find, we build. Including what wasn't in the initial brief. That's our signature : continuous partnership, not one-shot delivery.",
      p3: "Our conviction : there are no problems, only solutions. We hunt them with you, not next to you. And we build what actually solves, not what ticks boxes.",
    },
    team: {
      h2: "The team",
      body: "Several profiles, one shared vision. Each one expert in their domain, all passionate about what they do. That complementarity is what lets us combine consulting AND execution, marketing AND tech, strategy AND AI. Always in partnership with you.",
    },
    howWeWork: {
      h2: "How we work",
      principles: [
        {
          emoji: "🤝",
          title: "An extension of your team",
          description: "We team up with you. We think, we build, we stay by your side.",
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
          description: "AI is woven into the solution from day one, to serve your business daily.",
        },
      ],
    },
    trackRecord: {
      h2: "Since 2021",
      body: "Over 50 missions, picked with care.",
    },
    bottomCta: {
      h2: "Let's talk about your project",
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
