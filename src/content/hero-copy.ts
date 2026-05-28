export type HeroVariantCopy = {
  h1: string;
  h2: string;
  body: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export const HERO_COPY: Record<"fr" | "en", Record<string, HeroVariantCopy>> = {
  fr: {
    v1_humain: {
      h1: "Une équipe à taille humaine pour vos enjeux numériques.",
      h2: "On construit. On conseille. On déploie l'IA. Vous parlez aux décideurs.",
      body: "CRM intelligents · Automatisations IA · Conseil opérationnel.",
      ctaPrimary: { label: "Discutons", href: "contact" },
      ctaSecondary: { label: "Voir nos projets", href: "projets" },
    },
    v3_gain: {
      h1: "Gagnez du temps. Économisez de l'argent. Avec une équipe à taille humaine.",
      h2: "On automatise vos process. On rend vos outils intelligents.\nVous récupérez vos heures et votre marge.",
      body: "Pour les PME suisses qui veulent en faire plus avec moins.",
      ctaPrimary: { label: "Voir ce qu'on a fait", href: "projets" },
      ctaSecondary: { label: "Discutons", href: "contact" },
    },
    v5_problem_solver: {
      h1: "Problem solvers numériques pour PME et organisations.",
      h2: "On construit ce dont vous avez besoin. Quand c'est de l'IA, encore mieux.",
      body: "Équipe à taille humaine. Genève et Suisse romande.",
      ctaPrimary: { label: "Parlons-en", href: "contact" },
      ctaSecondary: { label: "Nos projets", href: "projets" },
    },
  },
  en: {
    v1_senior_humans: {
      h1: "Built by senior humans. Designed for serious work.",
      h2: "Custom AI systems, intelligent CRMs, automation, strategic advisory.",
      body: "Geneva-based. Direct access to the people who actually build.",
      ctaPrimary: { label: "Get in touch", href: "contact" },
      ctaSecondary: { label: "Our work", href: "projets" },
    },
    challenger_a_optimize: {
      h1: "Optimize your time and your costs. With a senior human team.",
      h2: "We automate your processes. We make your tools intelligent.\nYou get hours and margin back.",
      body: "For organizations that want to do more with less. Geneva-based.",
      ctaPrimary: { label: "See what we built", href: "projets" },
      ctaSecondary: { label: "Get in touch", href: "contact" },
    },
  },
};
