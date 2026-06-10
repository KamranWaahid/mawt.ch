export type FamilyCard = {
  emoji: string;
  title: string;
  description: string;
  linkLabel: string;
  familyRoute: string;
};

export type FeaturedProjectTeaser = {
  emoji: string;
  client: string;
  headline: string;
  body: string;
  linkLabel: string;
};

export type HomepageMetaVariant = {
  title: string;
  description: string;
};

export const HOMEPAGE_COPY = {
  trustedBy: {
    fr: { tagline: "Ils nous font confiance" },
    en: { tagline: "Trusted by" },
  },
  whatWeDo: {
    fr: {
      h2: "Ce qu'on fait",
      cards: [
        {
          emoji: "🌐",
          title: "Présence",
          description: "Site, branding, e-commerce qui ressemble à votre boîte.",
          linkLabel: "Découvrir Sites et Branding",
          familyRoute: "services/sites-et-branding",
        },
        {
          emoji: "🤖",
          title: "Outils",
          description: "CRM intelligent, agents IA, RAG, automatisations qui font gagner du temps.",
          linkLabel: "Découvrir Solutions IA",
          familyRoute: "services/solutions-ia",
        },
        {
          emoji: "🎯",
          title: "Stratégie",
          description: "Conseil IA, audit, change management. On pense avant de coder.",
          linkLabel: "Découvrir Conseil IA",
          familyRoute: "services/conseil-ia",
        },
        {
          emoji: "🤝",
          title: "Équipe",
          description: "Renfort technique et expert dédié, choisis par nous pour votre business.",
          linkLabel: "Découvrir Renfort et Équipe",
          familyRoute: "services/renfort-equipe",
        },
        {
          emoji: "🎓",
          title: "Autonomie IA",
          description:
            "Formation ChatGPT, ateliers IA, coaching décideurs. Vos équipes deviennent autonomes sur l'IA.",
          linkLabel: "Découvrir Formation IA",
          familyRoute: "services/formation-ia",
        },
      ] satisfies FamilyCard[],
    },
    en: {
      h2: "What we do",
      cards: [
        {
          emoji: "🌐",
          title: "Presence",
          description: "Websites, branding, e-commerce that look like your business.",
          linkLabel: "Explore Sites and Branding",
          familyRoute: "services/sites-and-branding",
        },
        {
          emoji: "🤖",
          title: "Tools",
          description: "Smart CRMs, AI agents, RAG, automation that frees your hours.",
          linkLabel: "Explore AI Solutions",
          familyRoute: "services/ai-solutions",
        },
        {
          emoji: "🎯",
          title: "Strategy",
          description: "AI consulting, business audit, change management. We think before we code.",
          linkLabel: "Explore AI Consulting",
          familyRoute: "services/ai-consulting",
        },
        {
          emoji: "🤝",
          title: "Team",
          description: "Dedicated tech talent we curate for your business.",
          linkLabel: "Explore Team Augmentation",
          familyRoute: "services/team-augmentation",
        },
        {
          emoji: "🎓",
          title: "AI Autonomy",
          description: "ChatGPT training, AI workshops, leader coaching. Your team becomes autonomous on AI.",
          linkLabel: "Explore AI Training",
          familyRoute: "services/ai-training",
        },
      ] satisfies FamilyCard[],
    },
  },
  featuredProjects: {
    h2: { fr: "Nos cas concrets", en: "Real cases" },
    seeAll: { fr: "Voir tous nos projets →", en: "See all our projects →" },
    teasers: {
      fr: [
        {
          emoji: "🏛️",
          client: "Crown",
          headline: "Transformation 360.",
          body: "Restructuration org, refonte tech, CRM intelligent avec RAG.\nLe patron déchargé, l'équipe autonome.",
          linkLabel: "Lire le cas",
        },
        {
          emoji: "🤖",
          client: "Mellender",
          headline: "Lancement complet et CRM intelligent.",
          body: "Branding, site avec listings, CRM intelligent avec RAG.\nTout par une même équipe.",
          linkLabel: "Lire le cas",
        },
        {
          emoji: "🛒",
          client: "Légumes Express",
          headline: "Commandes multicanal centralisées.",
          body: "Web, partenaires, téléphone. Tout regroupé dans un seul tableau de bord.\nPlus une marque rafraîchie.",
          linkLabel: "Lire le cas",
        },
      ] satisfies FeaturedProjectTeaser[],
      en: [
        {
          emoji: "🏛️",
          client: "Crown",
          headline: "360 transformation.",
          body: "Org restructuring, tech rebuild, smart CRM with embedded RAG.\nOwner unblocked, team empowered.",
          linkLabel: "Read the case",
        },
        {
          emoji: "🤖",
          client: "Mellender",
          headline: "End to end launch and smart CRM.",
          body: "Brand, listings website, smart CRM with RAG on properties.\nAll by the same senior team.",
          linkLabel: "Read the case",
        },
        {
          emoji: "🛒",
          client: "Légumes Express",
          headline: "Multichannel orders centralised.",
          body: "Web, partner platforms, phone. All in one dashboard.\nPlus a refreshed brand.",
          linkLabel: "Read the case",
        },
      ] satisfies FeaturedProjectTeaser[],
    },
  },
  seo: {
    fr: {
      v1_short: {
        title: "MAWT. Agence IA et conseil à Genève",
        description:
          "Équipe à taille humaine basée à Genève. CRM intelligents, agents IA, conseil et renfort d'équipe pour PME suisses et entreprises commerciales en croissance.",
      },
      v2_longer: {
        title: "MAWT. Solutions IA, conseil et développement à Genève",
        description:
          "Équipe à taille humaine basée à Genève. CRM intelligents, agents IA, conseil et renfort d'équipe pour PME suisses et entreprises commerciales en croissance.",
      },
    },
    en: {
      default: {
        title: "MAWT. AI solutions, consulting and development from Geneva",
        description:
          "Senior human team based in Geneva. Smart CRMs, AI agents, consulting and dedicated talent for ambitious businesses across Europe.",
      },
    },
  },
  schemaOrg: {
    description:
      "Agence IA à taille humaine basée à Genève. Solutions IA sur mesure, automatisation, conseil IA, sites web et branding, renfort d'équipe, formation IA pour PME suisses et entreprises commerciales en croissance.",
  },
} as const;
