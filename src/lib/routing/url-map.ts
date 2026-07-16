// Single source of truth for all FR↔EN slug pairs (B3 localized URLs)
export type Locale = "fr" | "en";

export interface RouteMapping {
  fr: string;
  en: string;
  children?: RouteMapping[];
}

export const URL_MAP: RouteMapping[] = [
  {
    fr: "services",
    en: "services",
    children: [
      {
        fr: "solutions-ia",
        en: "ai-solutions",
        children: [
          { fr: "crm-intelligent", en: "smart-crm" },
          { fr: "agent-ia-assistant", en: "ai-agent" },
          { fr: "rag-intelligence-embarquee", en: "rag-enterprise" },
          { fr: "chatbots", en: "chatbots" },
          { fr: "ia-generative", en: "generative-ai" },
          { fr: "automatisations", en: "ai-automation" },
          { fr: "ia-locale", en: "local-ai" },
          { fr: "donnees-tableaux-de-bord", en: "advanced-analytics" },
          { fr: "portail-client-entreprise", en: "client-business-portal" },
        ],
      },
      {
        fr: "conseil-ia",
        en: "ai-consulting",
        children: [
          { fr: "strategie-ia", en: "ai-strategy" },
          { fr: "audit-operationnel", en: "business-audit" },
          { fr: "conseil-organisationnel", en: "organizational-consulting" },
          { fr: "transformation-numerique", en: "digital-transformation" },
          { fr: "change-management", en: "change-management" },
          { fr: "ai-change-management", en: "ai-change-management" },
        ],
      },
      {
        fr: "developpement-logiciel",
        en: "software-development",
        children: [
          { fr: "mvp-lancement-produit", en: "mvp-development" },
          { fr: "developpement-ia", en: "ai-development" },
          { fr: "site-internet", en: "web-development" },
          { fr: "application-mobile", en: "mobile-development" },
          { fr: "developpement-desktop", en: "desktop-development" },
          { fr: "integrations-apis", en: "api-development" },
          { fr: "developpement-base-de-donnees", en: "database-development" },
          { fr: "modernisation-logiciel", en: "software-modernization" },
          { fr: "renfort-equipe-it", en: "it-staff-augmentation" },
          {
            fr: "application-metier-logiciel-sur-mesure",
            en: "business-applications",
          },
        ],
      },
      {
        fr: "securite",
        en: "security",
        children: [
          { fr: "cybersecurite", en: "cybersecurity" },
          { fr: "conformite-compliance", en: "compliance-services" },
          { fr: "tests-intrusion-pentest", en: "penetration-testing" },
        ],
      },
      {
        fr: "sites-et-branding",
        en: "sites-and-branding",
        children: [
          { fr: "e-commerce-eshop", en: "e-commerce" },
          { fr: "branding-identite", en: "branding-identity" },
          { fr: "audit-ux-seo-performance", en: "ux-seo-performance-audit" },
          { fr: "referencement-ia-geo", en: "ai-search-optimization" },
          { fr: "refonte-site-web", en: "website-redesign" },
        ],
      },
      {
        fr: "renfort-equipe",
        en: "team-augmentation",
        children: [
          { fr: "developpeur-dedie", en: "dedicated-developer" },
          { fr: "expert-ia-dedie", en: "dedicated-ai-expert" },
          { fr: "designer-ux-dedie", en: "dedicated-ux-designer" },
          { fr: "qa-testing", en: "qa-testing" },
          { fr: "pilotage-projet", en: "project-management" },
          { fr: "accompagnement-design", en: "design-coaching" },
          { fr: "maintenance-applicative", en: "application-maintenance" },
          { fr: "cto-temps-partiel", en: "fractional-cto" },
          { fr: "tech-lead-temps-partiel", en: "fractional-tech-lead" },
          {
            fr: "engineering-as-a-service",
            en: "engineering-as-a-service",
          },
        ],
      },
      {
        fr: "formation-ia",
        en: "ai-training",
        children: [
          { fr: "formation-chatgpt-entreprise", en: "chatgpt-for-teams" },
          { fr: "formation-ia-equipes", en: "ai-workshop" },
          { fr: "coaching-decideurs-ia", en: "ai-coaching-for-leaders" },
          { fr: "accompagnement-adoption-ia", en: "ai-implementation" },
        ],
      },
    ],
  },
  { fr: "geneve", en: "geneva" },
  // BUG-010/019: The app router folder is `work`; map it to `projets` in FR.
  // Keep `projects` as an alias too (next.config.ts has a 301 for /en/projects → /en/work)
  { fr: "projets", en: "work" },
  { fr: "projets", en: "projects" },
  {
    fr: "blog",
    en: "news",
    children: [
      { fr: "categorie", en: "category" },
      { fr: "tag", en: "tag" },
      { fr: "auteur", en: "author" },
    ],
  },
  { fr: "a-propos", en: "about" },
  { fr: "contact", en: "contact" },
  { fr: "faqs", en: "faqs" },
  { fr: "clients", en: "partners" },
  { fr: "notre-methode", en: "our-process" },
  { fr: "securite", en: "security" },
  { fr: "mentions-legales", en: "legal-notice" },
  { fr: "confidentialite", en: "privacy" },
  { fr: "conditions-generales", en: "terms" },
  { fr: "cookies", en: "cookies" },
];
