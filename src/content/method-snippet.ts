export type MethodVariantCopy = {
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export const METHOD_COPY: Record<"fr" | "en", Record<string, MethodVariantCopy>> = {
  fr: {
    v4_collaboration: {
      body: "Une vraie collaboration, pas une prestation. On commence par comprendre votre boîte, on identifie le vrai problème, on construit ensemble, on reste à vos côtés après le go live. Vous parlez à ceux qui font.",
      ctaLabel: "Notre méthode complète →",
      ctaHref: "notre-methode",
    },
    v5_no_disappear: {
      body: "On n'est pas là pour livrer et disparaître. On comprend votre boîte avant d'écrire une ligne. On construit avec vous, pas à côté. Et on reste à vos côtés après le déploiement.",
      ctaLabel: "Notre méthode complète →",
      ctaHref: "notre-methode",
    },
  },
  en: {
    default: {
      body: "We're not here to ship and disappear. We understand your business before writing a line. We build with you, not beside you. And we stay around after launch.",
      ctaLabel: "Our full method →",
      ctaHref: "our-process",
    },
  },
};

export const METHOD_SECTION_H2 = {
  fr: "Notre méthode",
  en: "Our method",
} as const;
