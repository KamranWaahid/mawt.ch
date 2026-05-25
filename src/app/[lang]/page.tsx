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

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const data = await getHomePageData();
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

  // Group the individual Service documents from Sanity by their category
  const dynamicServicesGrouped = data.services?.reduce((acc, service) => {
    if (!service.category || !service.title) return acc;
    const cat = service.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(service.title);
    return acc;
  }, {} as Record<string, string[]>);

  // Convert the grouped object into the array format expected by the UI
  let servicesList = defaultServicesList;
  
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
