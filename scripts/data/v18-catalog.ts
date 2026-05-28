export type V18ServiceDef = {
  family: string;
  frSlug: string;
  enSlug: string;
  frTitle: string;
  enTitle: string;
  tier: number;
  displayAsCard?: boolean;
  h2SeoCapture?: { fr?: string; en?: string };
};

export const V18_SERVICES: V18ServiceDef[] = [
  { family: "sites-et-branding", frSlug: "site-internet", enSlug: "website", frTitle: "Site internet", enTitle: "Website", tier: 1 },
  { family: "sites-et-branding", frSlug: "e-commerce-eshop", enSlug: "e-commerce", frTitle: "E-commerce / E-shop", enTitle: "E-commerce", tier: 2 },
  { family: "sites-et-branding", frSlug: "branding-identite", enSlug: "branding-identity", frTitle: "Branding & identité", enTitle: "Branding & identity", tier: 3 },
  { family: "sites-et-branding", frSlug: "refonte-site-web", enSlug: "website-redesign", frTitle: "Refonte de site web", enTitle: "Website redesign", tier: 99, displayAsCard: false },
  { family: "sites-et-branding", frSlug: "audit-ux-seo-performance", enSlug: "ux-seo-performance-audit", frTitle: "Audit UX / SEO / performance", enTitle: "UX / SEO / performance audit", tier: 4 },

  { family: "solutions-ia", frSlug: "crm-intelligent", enSlug: "smart-crm", frTitle: "CRM intelligent", enTitle: "Smart CRM", tier: 1 },
  { family: "solutions-ia", frSlug: "agent-ia-assistant", enSlug: "ai-agent", frTitle: "Agent IA / Assistant IA", enTitle: "AI agent / assistant", tier: 2 },
  { family: "solutions-ia", frSlug: "rag-intelligence-embarquee", enSlug: "rag-enterprise", frTitle: "RAG / Intelligence embarquée", enTitle: "Enterprise RAG", tier: 3 },
  { family: "solutions-ia", frSlug: "chatbots", enSlug: "chatbots", frTitle: "Chatbots", enTitle: "Chatbots", tier: 4 },
  { family: "solutions-ia", frSlug: "application-metier-logiciel-sur-mesure", enSlug: "custom-business-application", frTitle: "Application métier / Logiciel sur mesure", enTitle: "Custom business application", tier: 5 },
  { family: "solutions-ia", frSlug: "automatisations", enSlug: "ai-automation", frTitle: "Automatisations", enTitle: "AI automation", tier: 6 },
  { family: "solutions-ia", frSlug: "integrations-apis", enSlug: "integrations-apis", frTitle: "Intégrations & APIs", enTitle: "Integrations & APIs", tier: 7 },
  { family: "solutions-ia", frSlug: "application-mobile", enSlug: "mobile-app", frTitle: "Application mobile", enTitle: "Mobile app", tier: 8 },
  { family: "solutions-ia", frSlug: "portail-client-entreprise", enSlug: "client-business-portal", frTitle: "Portail client & entreprise", enTitle: "Client & business portal", tier: 99, displayAsCard: false },

  { family: "conseil-ia", frSlug: "strategie-ia", enSlug: "ai-strategy", frTitle: "Stratégie IA", enTitle: "AI strategy", tier: 1 },
  { family: "conseil-ia", frSlug: "audit-operationnel", enSlug: "business-audit", frTitle: "Audit opérationnel", enTitle: "Business audit", tier: 2 },
  { family: "conseil-ia", frSlug: "conseil-organisationnel", enSlug: "organizational-consulting", frTitle: "Conseil organisationnel", enTitle: "Organizational consulting", tier: 3 },
  { family: "conseil-ia", frSlug: "transformation-numerique", enSlug: "digital-transformation", frTitle: "Transformation numérique", enTitle: "Digital transformation", tier: 4 },
  { family: "conseil-ia", frSlug: "change-management", enSlug: "change-management", frTitle: "Change management", enTitle: "Change management", tier: 5 },
  { family: "conseil-ia", frSlug: "ai-change-management", enSlug: "ai-change-management", frTitle: "AI change management", enTitle: "AI change management", tier: 6 },
  { family: "conseil-ia", frSlug: "conseil-digitalisation", enSlug: "digital-transformation-consulting", frTitle: "Conseil digitalisation", enTitle: "Digital transformation consulting", tier: 7 },

  {
    family: "renfort-equipe",
    frSlug: "developpeur-dedie",
    enSlug: "dedicated-developer",
    frTitle: "Développeur dédié",
    enTitle: "Dedicated developer",
    tier: 1,
    h2SeoCapture: { fr: "Recruter un développeur freelance senior, sans le risque marketplace.", en: "Hire a senior freelance developer, without the marketplace risk." },
  },
  {
    family: "renfort-equipe",
    frSlug: "expert-ia-dedie",
    enSlug: "dedicated-ai-expert",
    frTitle: "Expert IA dédié",
    enTitle: "Dedicated AI expert",
    tier: 2,
    h2SeoCapture: { fr: "Recruter un développeur IA senior, sans la pénurie marketplace.", en: "Hire a senior AI developer, without the talent shortage pain." },
  },
  {
    family: "renfort-equipe",
    frSlug: "designer-ux-dedie",
    enSlug: "dedicated-ux-designer",
    frTitle: "Designer UX dédié",
    enTitle: "Dedicated UX designer",
    tier: 3,
    h2SeoCapture: { fr: "Recruter un designer UX senior, sans les délais d'un recrutement classique.", en: "Hire a senior UX designer, without the classic recruitment timeline." },
  },
  { family: "renfort-equipe", frSlug: "qa-testing", enSlug: "qa-testing", frTitle: "QA & testing", enTitle: "QA & testing", tier: 4 },
  { family: "renfort-equipe", frSlug: "pilotage-projet", enSlug: "project-management", frTitle: "Pilotage de projet", enTitle: "Project management", tier: 5 },
  { family: "renfort-equipe", frSlug: "accompagnement-design", enSlug: "design-coaching", frTitle: "Accompagnement design", enTitle: "Design coaching", tier: 6 },
  { family: "renfort-equipe", frSlug: "maintenance-applicative", enSlug: "application-maintenance", frTitle: "Maintenance applicative", enTitle: "Application maintenance", tier: 7 },
  { family: "renfort-equipe", frSlug: "cto-temps-partiel", enSlug: "fractional-cto", frTitle: "CTO à temps partiel", enTitle: "Fractional CTO", tier: 8 },
  { family: "renfort-equipe", frSlug: "tech-lead-temps-partiel", enSlug: "fractional-tech-lead", frTitle: "Tech Lead à temps partiel", enTitle: "Fractional Tech Lead", tier: 9 },
  { family: "renfort-equipe", frSlug: "engineering-as-a-service", enSlug: "engineering-as-a-service", frTitle: "Engineering as a Service", enTitle: "Engineering as a Service", tier: 10 },

  { family: "formation-ia", frSlug: "formation-chatgpt-entreprise", enSlug: "chatgpt-for-teams", frTitle: "Formation ChatGPT en entreprise", enTitle: "ChatGPT for teams", tier: 1 },
  { family: "formation-ia", frSlug: "formation-ia-equipes", enSlug: "ai-workshop", frTitle: "Formation IA pour équipes", enTitle: "AI workshop", tier: 2 },
  { family: "formation-ia", frSlug: "coaching-decideurs-ia", enSlug: "ai-coaching-for-leaders", frTitle: "Coaching décideurs IA", enTitle: "AI coaching for leaders", tier: 3 },
  { family: "formation-ia", frSlug: "accompagnement-adoption-ia", enSlug: "ai-implementation", frTitle: "Accompagnement adoption IA", enTitle: "AI implementation", tier: 4 },
];

export const DELETE_SERVICE_SLUGS = [
  "cms",
  "seo",
  "analytics",
  "mobile-application",
  "ui-design",
  "ux-design",
  "user-research",
  "service-design",
  "artificial-intelligence",
  "custom-development",
  "digital-responsibility",
  "build-the-right-website",
  "generate-business",
  "meeting-market-needs",
  "improve-iteratively",
  "understand-users",
  "content-audit",
  "content-governance",
  "strategic-storytelling",
  "ux-writing",
  "design-governance",
  "trainings-and-sparring",
  "moodle",
  "open-data",
];

export const RENAME_SERVICE_SLUGS: Record<string, { newSlug: string; family: string; title?: string }> = {
  "e-commerce": { newSlug: "e-commerce-eshop", family: "sites-et-branding", title: "E-commerce / E-shop" },
  branding: { newSlug: "branding-identite", family: "sites-et-branding", title: "Branding & identité" },
  "ux-audit": { newSlug: "audit-ux-seo-performance", family: "sites-et-branding", title: "Audit UX / SEO / performance" },
};

export const FAQ_TAG_MAP: Record<string, string[]> = {
  "0769f462-8172-4373-9faa-6390b7938a09": ["conseil", "strategie"],
  "123e6d71-f696-439d-a567-3f458d9b95a2": ["ia", "automatisation"],
  "18f7e2d3-1e32-4cdd-8741-3a6bb7028dc9": ["sites", "branding"],
  "1b69ad7a-a664-42c1-a8d3-ec34236a06e7": ["conseil", "transformation"],
  "200bff2e-ded4-4e59-8eaa-f9f8ea21e44d": ["conseil", "audit"],
  "212ead33-abc7-461d-a29c-fd266728d566": ["sites"],
  "2a7c5eec-1629-4a2d-95a2-fe704bec03bf": ["conseil"],
  "308537b3-974d-47f3-82cc-cb06b5b801e9": ["ia", "automatisation"],
  "3873584a-e1fb-415a-bcb0-ebbb5a7fb086": ["renfort", "developpeur"],
  "46ad92b6-c209-42db-ba32-daf421071a31": ["conseil", "transformation", "audit"],
  "4f819ea5-02ce-45a6-ba36-21af00833d9c": ["conseil", "renfort"],
  "5f9cbb2d-d019-4691-a6cb-fe71e7722c83": ["ia", "conseil"],
  "6862f13a-899c-4c3c-a198-54aea15ecbdd": ["conseil"],
  "71e44a3c-73e6-46e4-9b5d-7328f937a3f1": ["ia", "automatisation"],
  "8276ac33-06b3-4450-9d40-5ecf403436b0": ["conseil"],
  "ac8a8642-a336-4e43-b4b7-2552a5f06246": ["conseil", "ia"],
  "b427e8d1-afb7-4f4c-bf1c-18617d350d85": ["conseil", "transformation"],
  "c6c193d0-277d-4062-8eab-2e51be77f62a": ["renfort", "developpeur"],
  "c7fe70b8-eea8-4ab9-bd63-9094a08941e1": ["conseil"],
  "d7257772-60ba-4575-b9a0-67cc30dc0f67": ["ia", "developpeur"],
};
