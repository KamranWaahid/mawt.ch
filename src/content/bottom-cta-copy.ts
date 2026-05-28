export type BottomCtaVariant = {
  h2: string;
  body: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export const BOTTOM_CTA_COPY: Record<"fr" | "en", Record<string, BottomCtaVariant>> = {
  fr: {
    v1_30min: {
      h2: "Discutons de votre projet",
      body: "30 minutes pour comprendre votre besoin. Pas de devis bâclé, pas de pression. Juste un échange direct avec ceux qui vont construire.",
      ctaPrimary: { label: "Démarrer", href: "contact" },
      ctaSecondary: { label: "Voir nos projets", href: "projets" },
    },
    v3_specific_process: {
      h2: "Décrivez nous votre besoin",
      body: "En 5 lignes. On vous répond en 24h avec une première analyse honnête. Si c'est pour nous, on vous le dit. Sinon aussi.",
      ctaPrimary: { label: "Démarrer", href: "contact" },
      ctaSecondary: { label: "Voir nos projets", href: "projets" },
    },
  },
  en: {
    v1_30min: {
      h2: "Let's talk about your project",
      body: "30 minutes to understand your needs. No rushed quote, no pressure. Just a direct conversation with the people who will build it.",
      ctaPrimary: { label: "Get started", href: "contact" },
      ctaSecondary: { label: "See our work", href: "projets" },
    },
    v3_specific_process: {
      h2: "Tell us about your need",
      body: "In 5 lines. We respond in 24h with an honest first take. If it's for us, we say so. If not, also.",
      ctaPrimary: { label: "Get started", href: "contact" },
      ctaSecondary: { label: "See our work", href: "projets" },
    },
  },
};

export const SERVICE_DETAIL_BOTTOM_CTA = {
  fr: {
    h2: "Discutons de votre besoin",
    body: "30 minutes pour comprendre votre contexte. Pas de devis bâclé, pas de pression. Juste un échange direct.",
    ctaLabel: "Démarrer",
    ctaHref: "contact",
  },
  en: {
    h2: "Let's talk about your need",
    body: "30 minutes to understand your context. No rushed quote, no pressure. Just a direct conversation.",
    ctaLabel: "Start",
    ctaHref: "contact",
  },
} as const;
