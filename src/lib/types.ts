export type SanityImageSource = {
  _type: "image";
  asset?: {
    _ref: string;
    _type: "reference";
    url?: string;
    mimeType?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      };
    };
  };
  alt?: string;
  caption?: string;
};

export type ProjectPhase = {
  _key: string;
  title: string;
  description?: string;
  deliverables?: string[];
};

export type Project = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  overview?: string;
  workType?: string;
  industry?: string;
  // Specific fields
  problemStatement?: string;
  problemImage?: SanityImageSource;
  solution?: string;
  solutionImage?: SanityImageSource;
  deliverables?: string[];
  videoUrl?: string;
  year?: number;
  tags: string[];
  coverImage?: SanityImageSource;
  gallery?: SanityImageSource[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
  services?: Service[];
  phases?: ProjectPhase[];
  technologies?: string[];

};

export type ServiceSection = {
  h2: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type ServiceComparisonTable = {
  title?: string;
  columns?: string[];
  rows?: { cells: string[] }[];
};

export type ServiceCta = {
  headline?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export type RelatedService = {
  _id: string;
  title: string;
  slug: string;
  family?: string;
  heroH2?: string;
  description?: string;
  icon?: string;
};

export type Service = {
  _id: string;
  language?: "fr" | "en";
  title: string;
  slug: string;
  category?: string;
  family?: string;
  displayAsCard?: boolean;
  tier?: number;
  h2SeoCapture?: string;
  heroH1?: string;
  heroH2?: string;
  description?: string;
  icon?: string;
  mainImage?: SanityImageSource;
  answerBox?: string;
  whoFor?: string;
  longDescription?: any[]; // Portable text
  features?: string[];
  deliverables?: string[];
  keyTakeaways?: string[];
  sections?: ServiceSection[];
  comparisonTable?: ServiceComparisonTable;
  faq?: ServiceFaqItem[];
  cta?: ServiceCta;
  relatedServices?: RelatedService[];
  featuredProjects?: Project[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
};

export type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  role?: string;
};

export type SiteSettings = {
  title: string;
  tagline: string;
  ctaLabel: string;
  ctaHref: string;
  seoDescription: string;
  socialLinks?: { platform: string; url: string }[];
  servicesNav?: { category: string; services: string[] }[];
  mainNav?: { label: string; href: string; hasDropdown?: boolean }[];
};

export type BlogPost = {
  _id: string;
  language?: string;
  title: string;
  slug: string;
  author?: Author;
  mainImage?: SanityImageSource;
  categories?: string[];
  publishedAt: string;
  excerpt?: string;
  body: any[];
};

export type Author = {
  name: string;
  role?: string;
  avatar?: SanityImageSource;
  bio?: string;
  socialLinks?: { platform: string; url: string }[];
};

export type AboutContent = {
  heading: string;
  subheading?: string;
  story?: string;
  values?: { title: string; description: string }[];
  locations?: { city: string; description: string }[];
};

export type HomePageData = {
  settings: SiteSettings;
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  about: AboutContent;
  posts?: BlogPost[];
};

export type Career = {
  _id: string;
  title: string;
  location: string;
  type: string;
  description?: string;
};

export type FAQ = {
  _id: string;
  question: string;
  answer: string;
  category: string;
};

export type PricingPlan = {
  _id: string;
  name: string;
  price: string;
  interval: string;
  description?: string;
  features: string[];
  cta: string;
  recommended: boolean;
};

export type Doc = {
  _id: string;
  title: string;
  slug: string;
  group: string;
  excerpt?: string;
  content: any; // Using any for PortableText for now
  category?: string;
  featured?: boolean;
  estimatedReadTime?: number;
  relatedDocs?: Partial<Doc>[];
};

export type Partner = {
  _id: string;
  name: string;
  logo: SanityImageSource;
  url?: string;
  category: "technology" | "strategic" | "engineering";
  featured: boolean;
  order: number;
};

export type ContactSettings = {
  _id: string;
  headline: string;
  subheading?: string;
  email?: string;
  phone?: string;
  offices?: {
    city: string;
    address: string;
    mapUrl?: string;
    isMain: boolean;
  }[];
  socialHeadline?: string;
};
