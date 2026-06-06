import { ClientsSection } from "@/components/sections/clients-section";
import { DescriptionSection } from "@/components/sections/description-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { ProcessSection } from "@/components/sections/process-section";
import { SiteFooter } from "@/components/sections/site-footer";
import { InsightsSection } from "@/components/sections/insights-section";
import { WorkSection } from "@/components/sections/work-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { VisionSection } from "@/components/sections/vision-section";
import { SiteHeader } from "@/components/sections/site-header";
import { getHomePageData, getPartners } from "@/lib/sanity.queries";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { getFamilyTitle, familySlugForLang, hreflangAlternates } from "@/lib/routing/url-helpers";
import { preload } from "react-dom";
import type { Metadata } from "next";

// Hero is a JS-driven <canvas> frame sequence; its first frame is the LCP image.
// Preload it from the server so the browser fetches it during HTML parse,
// before the hero's client JS even runs — pulls LCP earlier without changing
// the canvas behaviour or the flat design.
const HERO_FIRST_FRAME = "/HeroImages/ezgif-frame-001.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "MAWT — Partenaire d'exécution technique" : "MAWT — Technical Execution Partner",
    description:
      lang === "fr"
        ? "Partenaire suisse d'exécution technique : systèmes haute performance, solutions IA et expériences digitales."
        : "Swiss-based technical execution partner for high-performance systems and digital experiences.",
    alternates: hreflangAlternates(`/${lang}`, lang),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  // Preload the raw hero frame ONLY on desktop (>=1024px), where the animated
  // <canvas> draws it. On mobile the hero is a Next-optimized <Image priority>
  // (AVIF/WebP) which emits its own high-priority preload — so without the media
  // scope this raw JPEG preload double-loads and competes with the real mobile
  // LCP image, inflating mobile LCP.
  preload(HERO_FIRST_FRAME, {
    as: "image",
    fetchPriority: "high",
    media: "(min-width: 1024px)",
  });
  const dictionary = await getDictionary(lang);
  const data = await getHomePageData(lang);
  const partners = await getPartners();

  const defaultServicesList = [
    {
      category: "Strategy",
      services: [
        "Cultural and Visual Positioning", "Content Strategy", "Naming (UX)", 
        "Brand Storytelling", "Concept and Prototyping", "Whitepaper Reports", 
        "Key Messaging", "Market Deep Probing", "Audience Mapping", "Founder Positioning"
      ],
    },
    {
      category: "Design Systems",
      services: [
        "Brand Identity", "Typography and Color Systems", "Logo Design", 
        "Brand Guidelines", "Tone of Voice", "Visual Asset Library"
      ],
    },
    {
      category: "Website Design and Development",
      services: [
        "Creative Development", "Website Design", "Content Management (Webflow, Sanity and Payload)", 
        "Information Architecture", "UX and UI", "Motion Design", "Wireframing and Prototyping", 
        "Responsive Design", "Microsites", "CRM Integrations", "Performance and Analytics"
      ],
    },
    {
      category: "3D application",
      services: [
        "3D Asset Building and Texturing", "3D Animations", "WebGL", 
        "Custom Cursors (Hover and Action)", "Concept Development (Immersive Web)", 
        "Product Visualization", "Technical Animations"
      ],
    },
    {
      category: "Technical Consultation",
      services: [
        "System Architecture Review", "Stack Choice", "Technical App and Web Audit (UI/UX)", 
        "IT and Tech Initiatives", "Monthly and Quarterly Boards", "Tech and Data Visualization", 
        "Vendor Search", "Due-Diligence and Tech Review", "Data Rooms"
      ],
    },
    {
      category: "Product Strategy",
      services: [
        "Product Strategy and Development", "Concept Development", "Design Language Development", 
        "User Journey Mapping", "MVP Strategy (Go-to-Market, Pitch)", "Product Visualization and Prototyping", 
        "Product Ecosystem Design", "Hardware UX Consultation"
      ],
    },
    {
      category: "UX/UI Consultation & Realisation",
      services: [
        "Spatial Experiences", "3D Product Walkthroughs", "Out-of-Box Design", 
        "Interactive Product Demos", "Interactive Showrooms", "3D Web Integration"
      ],
    }
  ];

  // Group the individual Service documents from Sanity by their family
  const dynamicServicesGrouped = data.services?.reduce((acc, service) => {
    if (!service.family || !service.title) return acc;
    const familyTitle = getFamilyTitle(service.family, lang);
    if (!acc[familyTitle]) {
      acc[familyTitle] = [];
    }
    const familySlug = familySlugForLang(service.family, lang);
    acc[familyTitle].push({
      title: service.title,
      href: `/${lang}/services/${familySlug}/${service.slug}`,
    });
    return acc;
  }, {} as Record<string, { title: string; href: string }[]>);

  // Convert the grouped object into the array format expected by the UI
  let servicesList: any[] = defaultServicesList;
  
  if (dynamicServicesGrouped && Object.keys(dynamicServicesGrouped).length > 0) {
    servicesList = Object.entries(dynamicServicesGrouped).map(([category, services]) => ({
      category,
      services,
    }));
  }

  return (
    <>
      <HeroSection settings={data.settings} dict={dictionary.hero} />
      <ClientsSection dict={dictionary.clients} partners={partners} />
      <DescriptionSection dict={dictionary.description} />
      <ProblemSection dict={dictionary.problem} />
      <VisionSection dict={dictionary.vision} services={servicesList} />
      <SolutionSection dict={dictionary.solution} />
      <ProcessSection dict={dictionary.process} />
      <WorkSection dict={dictionary.work} projects={data.projects} />
      <InsightsSection dict={dictionary.insights} posts={data.posts} />
    </>
  );
}
