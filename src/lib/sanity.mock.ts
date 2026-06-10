import type { HomePageData, Project } from "@/lib/types";

export const mockHomeData: HomePageData = {
  settings: {
    title: "MAWT Solutions AG",
    tagline: "AI agency in Geneva.",
    ctaLabel: "Discuss your project",
    ctaHref: "/contact",
    seoDescription:
      "AI agency in Geneva. Artificial intelligence, process automation and custom tools for SMEs and growing companies.",
  },
  about: {
    heading: "Calm strategy. Precise execution.",
    story: "We are a multidisciplinary studio focused on modern web experiences that blend visual identity, motion, and conversion-focused product thinking.",
  },
  services: [
    {
      _id: "service-brand",
      title: "Brand Direction",
      slug: "brand-direction",
      description: "Identity systems with clear narratives and polished visual language.",
    },
    {
      _id: "service-web",
      title: "Web Design + Build",
      slug: "web-design-build",
      description: "High-performing websites built with modern architecture and animation.",
    },
    {
      _id: "service-growth",
      title: "Growth Iteration",
      slug: "growth-iteration",
      description: "Data-informed improvements to increase clarity, trust, and conversion.",
    },
  ],
  testimonials: [
    {
      _id: "testimonial-1",
      quote:
        "The team delivered a striking site that elevated our brand overnight and improved qualified leads by 42%.",
      name: "Leena Farooq",
      role: "Marketing Director, Atelier Noire",
    },
    {
      _id: "testimonial-2",
      quote:
        "Every detail felt intentional. The final result is luxurious, fast, and incredibly easy to manage.",
      name: "Daniyal Rehman",
      role: "Founder, Monolith Interiors",
    },
  ],
  projects: [
    {
      _id: "project-monolith",
      title: "Monolith Interiors",
      slug: "monolith-interiors",
      excerpt:
        "A luxury interiors website with immersive motion and clean editorial composition.",
      overview:
        "We redesigned Monolith's digital identity around dramatic typography, cinematic transitions, and a refined conversion flow.",
      year: 2025,
      tags: ["Web Design", "Brand", "Development"],
      testimonialQuote: "The craftsmanship is exceptional from first scroll to final CTA.",
      testimonialAuthor: "Monolith Interiors",
    },
    {
      _id: "project-velour",
      title: "Velour Labs",
      slug: "velour-labs",
      excerpt:
        "A product marketing experience balancing technical credibility with premium storytelling.",
      overview:
        "Velour Labs needed a modern product narrative. We created an elegant structure with subtle interactions and clear hierarchy.",
      year: 2026,
      tags: ["Product Marketing", "Motion", "SEO"],
    },
    {
      _id: "project-redstart",
      title: "Redstart Ventures",
      slug: "redstart-ventures",
      excerpt: "Deep tech VC fund",
      overview: "Building a design system that translates rigorous investment philosophy into a distinct digital identity.",
      year: 2025,
      tags: ["Website design", "Brand system"],
      problemStatement: "Redstart's website masked their rigorous investment philosophy and scientific approach, looking like every other VC fund. This misalignment weakened trust with LPs, founders, and partners seeking clarity and conviction in their fund identity.",
      solution: "Build a design system that translates their investment philosophy into a distinct digital identity. Create a presence that immediately conveys clarity and conviction to founders in advanced AI, new materials, and climate tech, while strengthening credibility with LPs and partners.",
      deliverables: ["Website design and development", "Brand system"]
    },
  ],
};

export const mockProjectBySlug = (slug: string): Project | null =>
  mockHomeData.projects.find((project) => project.slug === slug) ?? null;
