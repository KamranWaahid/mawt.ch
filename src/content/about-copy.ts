export const ABOUT_COPY = {
  fr: {
    hero: {
      h1: "Une équipe à taille humaine, basée à Genève.",
      h2: "Nous concevons des systèmes d'IA et d'automatisation, conseillons sur leur adoption, et intégrons des experts dans vos équipes. Un studio qui construit, pas une usine à slides.",
    },
    story: {
      h2: "Pourquoi MAWT",
      p1: "On intervient souvent quand les outils se sont multipliés et que le travail réel reste manuel. Le brief est un point de départ. Ce qui compte, c'est ce qui freine vraiment vos équipes.",
      p2: "Nous travaillons comme une extension de votre organisation : on propose, on construit, et on reste après la mise en production. Pas une livraison jetable : un système que quelqu'un connaît encore six mois plus tard.",
      p3: "Nous préférons les solutions qui tiennent dans le quotidien à celles qui brillent en présentation. Si quelque chose ne sert pas vos opérations, on le dit.",
    },
    team: {
      h2: "L'équipe",
      body: "Stratégie, produit, ingénierie et IA : des profils complémentaires, peu de couches. Vous parlez aux personnes qui cadrent et qui écrivent le code.",
    },
    howWeWork: {
      h2: "Comment on travaille",
      principles: [
        {
          emoji: "🤝",
          title: "Proches de l'opérationnel",
          description: "Nous travaillons avec les équipes qui utilisent le système, pas seulement avec le sponsor du projet.",
        },
        {
          emoji: "🧠",
          title: "Partir du vrai frein",
          description: "Avant d'automatiser, on regarde où le temps et les erreurs se perdent. Ensuite on construit ce qui soulage ce point précis.",
        },
        {
          emoji: "🎯",
          title: "Adapté à votre contexte",
          description: "Vos outils, vos contraintes, votre rythme. Nous n'imposons pas un modèle générique.",
        },
        {
          emoji: "⚡",
          title: "L'IA quand elle sert",
          description: "L'IA entre dans la solution lorsqu'elle réduit un travail réel, pas pour remplir une slide.",
        },
      ],
    },
    trackRecord: {
      h2: "Depuis 2021",
      body: "Plus de 50 missions choisies avec soin.",
    },
    bottomCta: {
      h2: "Parlons de ce qui vous bloque.",
      body: "Trente minutes pour comprendre le contexte. Si nous pouvons aider, on propose une suite claire. Sinon, on vous oriente.",
      ctaPrimary: { label: "Écrire à l'équipe", href: "contact" },
      ctaSecondary: { label: "Voir nos projets", href: "projets" },
    },
    seo: {
      title: "À propos | MAWT, studio IA à Genève",
      description:
        "MAWT est un studio IA à Genève. Systèmes d'automatisation, conseil et développement pour PME et entreprises en croissance en Suisse romande.",
    },
  },
  en: {
    hero: {
      h1: "A senior team in Geneva, close enough to sit with you.",
      h2: "We build AI and automation systems, advise on adoption, and embed specialists in your organisation. A studio that ships software, not slide decks.",
    },
    story: {
      h2: "Why MAWT",
      p1: "We usually arrive when tools have multiplied and the real work is still done by hand. The brief is a starting point. What matters is where your teams actually lose time.",
      p2: "We work as an extension of your organisation: we propose, we build, and we stay after go-live. Not a disposable delivery: a system someone still understands six months later.",
      p3: "We favour solutions that hold up on a Tuesday afternoon over ones that look clever in a presentation. If something will not serve your operations, we say so.",
    },
    team: {
      h2: "The team",
      body: "Strategy, product, engineering, and AI: complementary profiles, few layers. You speak with the people who scope the work and write the code.",
    },
    howWeWork: {
      h2: "How we work",
      principles: [
        {
          emoji: "🤝",
          title: "Close to the work",
          description: "We sit with the teams who will use the system, not only with the project sponsor.",
        },
        {
          emoji: "🧠",
          title: "Start from the real friction",
          description: "Before automating, we look where time and errors accumulate. Then we build for that point.",
        },
        {
          emoji: "🎯",
          title: "Shaped to your context",
          description: "Your tools, constraints, and pace. We do not impose a generic template.",
        },
        {
          emoji: "⚡",
          title: "AI when it earns its place",
          description: "AI enters the solution when it removes real work, not to decorate a roadmap.",
        },
      ],
    },
    trackRecord: {
      h2: "Since 2021",
      body: "Over 50 missions, chosen with care.",
    },
    bottomCta: {
      h2: "Tell us what is getting in the way.",
      body: "Thirty minutes to understand the context. If we can help, we outline a clear next step. If not, we point you elsewhere.",
      ctaPrimary: { label: "Write to the team", href: "contact" },
      ctaSecondary: { label: "See our work", href: "projets" },
    },
    seo: {
      title: "About | MAWT, AI studio in Geneva",
      description:
        "MAWT is an AI studio in Geneva. Automation systems, consulting, and custom development for SMEs and growing companies in Switzerland.",
    },
  },
} as const;

export type AboutLangCopy = (typeof ABOUT_COPY)["fr"];
