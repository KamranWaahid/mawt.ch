import { SubpageHero } from "@/components/sections/subpage-hero";
import { FlatGrid } from "@/components/ui/flat-grid";
import { getDictionary } from "@/get-dictionary";
import { getHomePageData } from "@/lib/sanity.queries";
import type { Locale } from "@/i18n-config";
import { getFamilyTitle, familySlugForLang, familyOrderIndex, standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, itemListLd, SITE_URL } from "@/components/seo/structured-data";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { AnimatedTitle } from "@/components/ui/animated-title";

interface ServicesPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Services | MAWT, agence IA à Genève" : "Services | MAWT, AI agency in Geneva",
    description:
      lang === "fr"
        ? "Solutions IA, automatisation, sites, conseil, renfort d'équipe et formation. Tout ce que MAWT construit pour les PME et entreprises en croissance de Suisse romande."
        : "AI solutions, automation, websites, consulting, team augmentation and training. Everything MAWT builds for SMEs and growing companies across French speaking Switzerland.",
    alternates: standaloneAlternates("services", lang),
  };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  // Pass `lang`: without it this defaulted to EN service docs, so on /fr the
  // service links were built with English slugs (/fr/services/.../website)
  // instead of the French ones (/site-internet) -> 404 across the FR catalog.
  const data = await getHomePageData(lang);

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

  // Group the individual Service documents from Sanity by their family.
  // Families are sorted AI-first (FAMILY_ORDER) so the "agence IA" offers lead.
  const dynamicServicesGrouped = data.services
    ?.slice()
    .sort((a, b) => familyOrderIndex(a.family ?? "") - familyOrderIndex(b.family ?? ""))
    .reduce((acc, service) => {
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
  
  const catalogItems = (data.services || [])
    .filter((s: any) => s?.family && s?.title && s?.slug)
    .map((s: any) => ({
      name: s.title,
      url: `${SITE_URL}/${lang}/services/${familySlugForLang(s.family, lang)}/${s.slug}`,
    }));
  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: "Services", url: `${SITE_URL}${localizedHref("services", lang)}` },
  ]);
  const catalogLd = itemListLd(
    lang === "fr" ? "Services MAWT" : "MAWT Services",
    catalogItems,
    lang,
  );

  return (
    <div className="min-h-screen">
      <JsonLd data={catalogItems.length ? [crumbLd, catalogLd] : [crumbLd]} />
      <SubpageHero
        eyebrow={dict.services.badge}
        title={dict.services.headline}
        subtitle={lang === "fr" ? "Cinq piliers d'expertise." : "Five pillars of expertise."}
        compact
      />
      <FlatGrid 
        items={dict.services.pillars.map((pillar: any) => ({
          title: pillar.title,
          description: pillar.description
        }))} 
        columns={3} 
      />
      
      <section className="py-16 md:py-24 lg:py-32 border-t border-black/5">
        <div className="site-container-wide">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <AnimatedTitle
              as="h2"
              text={lang === "en" 
                ? "We don't just build tools. We build the systems that run your business."
                : "Nous ne construisons pas seulement des outils. Nous construisons les systèmes qui font tourner votre entreprise."}
              className="text-3xl-fluid font-medium tracking-tighter text-black leading-tight max-w-[22ch]"
              splitBy="word"
            />
            <div className="flex flex-col gap-8">
              <p className="text-base-fluid text-neutral-500 font-normal leading-relaxed max-w-[55ch]">
                {lang === "en"
                  ? "Our approach is holistic. We look at your entire operational workflow to identify bottlenecks and opportunities for automation."
                  : "Notre approche est holistique. Nous examinons l'ensemble de votre flux opérationnel pour identifier les goulots d'étranglement."}
              </p>
              {/* BUG-009: Replaced dead <button> with a working Next.js <Link> to the methodology page */}
              <Link
                href={lang === "en" ? `/${lang}/our-process` : `/${lang}/notre-methode`}
                className="w-fit flex items-center gap-2 px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 text-sm font-normal tracking-widest group"
              >
                {lang === "en" ? "Explore our methodology" : "Explorer notre m\u00e9thodologie"}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services List Section */}
      <section className="py-16 md:py-24 lg:py-32 border-t border-black/5">
        <div className="site-container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* Left Column: Heading */}
            <div className="lg:col-span-4 lg:col-start-1">
              <h2 className="text-2xl-fluid font-medium tracking-tight text-black sticky top-32">
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
                    <h3 className="text-lg-fluid font-medium text-black">{item.category}</h3>
                  </div>
                  <div className="col-span-1">
                    <ul className="flex flex-col gap-2.5">
                      {item.services?.map((service: any) => {
                        const isObj = typeof service === "object";
                        const serviceTitle = isObj ? service.title : service;
                        const serviceHref = isObj ? service.href : null;

                        return (
                          <li key={serviceTitle} className="text-sm-fluid text-neutral-500 font-normal leading-relaxed">
                            {serviceHref ? (
                              <Link href={serviceHref} className="hover:text-black hover:underline transition-colors decoration-[#75DAB4] decoration-2 underline-offset-4">
                                {serviceTitle}
                              </Link>
                            ) : (
                              <span>{serviceTitle}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Technologies */}
      {dict.services.technologies?.groups?.length ? (
        <section className="py-16 md:py-24 lg:py-32 border-t border-black/5">
          <div className="site-container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              <div className="lg:col-span-4 lg:col-start-1">
                <h2 className="text-2xl-fluid font-medium tracking-tight text-black">
                  {dict.services.technologies.title}
                </h2>
                <p className="mt-4 max-w-[38ch] text-sm-fluid font-normal leading-relaxed text-neutral-500">
                  {dict.services.technologies.intro}
                </p>
              </div>
              <div className="lg:col-span-8 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                {dict.services.technologies.groups.map((group: { title: string; items: string[] }) => (
                  <div key={group.title} className="space-y-5">
                    <h3 className="text-sm-fluid font-medium text-black/80">{group.title}</h3>
                    <ul className="space-y-2.5">
                      {group.items.map((item) => (
                        <li key={item} className="text-sm-fluid font-normal leading-relaxed text-neutral-500">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
