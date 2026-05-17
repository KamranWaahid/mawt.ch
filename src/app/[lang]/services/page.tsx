import { SubpageHero } from "@/components/sections/subpage-hero";
import { FlatGrid } from "@/components/ui/flat-grid";
import { getDictionary } from "@/get-dictionary";
import { getHomePageData } from "@/lib/sanity.queries";
import type { Locale } from "@/i18n-config";

interface ServicesPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const data = await getHomePageData();

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
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge={dict.services.badge}
        title={dict.services.headline}
      />
      <FlatGrid 
        items={dict.services.pillars.map((pillar: any) => ({
          title: pillar.title,
          description: pillar.description
        }))} 
        columns={3} 
      />
      
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <h2 className="text-4xl font-normal tracking-tighter text-black leading-[1.1]">
              {lang === "en" 
                ? "We don't just build tools. We build the systems that run your business."
                : "Nous ne construisons pas seulement des outils. Nous construisons les systèmes qui font tourner votre entreprise."}
            </h2>
            <div className="flex flex-col gap-8">
              <p className="text-lg text-neutral-500 font-normal leading-relaxed">
                {lang === "en"
                  ? "Our approach is holistic. We look at your entire operational workflow to identify bottlenecks and opportunities for automation."
                  : "Notre approche est holistique. Nous examinons l'ensemble de votre flux opérationnel pour identifier les goulots d'étranglement."}
              </p>
              <button className="w-fit px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-sm font-normal uppercase tracking-widest">
                {lang === "en" ? "Explore our methodology" : "Explorer notre méthodologie"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services List Section */}
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* Left Column: Heading */}
            <div className="lg:col-span-4 lg:col-start-1">
              <h2 className="text-xl md:text-2xl font-normal text-black sticky top-32">
                Services
              </h2>
            </div>
            
            {/* Right Column: Categories & Services */}
            <div className="lg:col-span-8 flex flex-col">
              {servicesList.map((item, idx) => (
                <div 
                  key={item.category} 
                  className={`grid grid-cols-1 md:grid-cols-2 gap-8 py-10 ${idx === 0 ? "border-t border-black/10 lg:pt-0 lg:border-t-0" : "border-t border-black/5"}`}
                >
                  <div className="col-span-1">
                    <h3 className="text-[15px] font-normal text-black">{item.category}</h3>
                  </div>
                  <div className="col-span-1">
                    <ul className="flex flex-col gap-2.5">
                      {item.services?.map((service) => (
                        <li key={service} className="text-[14px] text-neutral-500 font-normal">
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
