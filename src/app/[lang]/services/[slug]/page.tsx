import { getServiceBySlug } from "@/lib/sanity.queries";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { SectionReveal } from "@/components/ui/section-reveal";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/lib/sanity.image";
import * as Icons from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  
  if (!service) return {};

  return {
    title: `${service.title} | Expertise`,
    description: service.description || service.title,
    openGraph: {
      title: service.title,
      description: service.description,
      images: service.mainImage ? [urlForImage(service.mainImage)?.width(1200).height(630).url() || ""] : [],
    },
  };
}

const components = {
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-normal tracking-tight text-black mt-16 mb-8">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-normal tracking-tight text-black mt-16 mb-8">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-normal text-black mt-12 mb-6">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-xl font-normal text-black mt-10 mb-4">{children}</h4>,
    normal: ({ children }: any) => <p className="text-lg text-neutral-600 font-normal leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-brand-teal pl-8 py-2 italic text-neutral-500 my-12">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 text-neutral-600 space-y-2 text-lg">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 text-neutral-600 space-y-2 text-lg">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-neutral-600">{children}</li>,
    number: ({ children }: any) => <li className="text-neutral-600">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-black">{children}</strong>,
    link: ({ children, value }: any) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-brand-teal underline hover:text-black transition-colors">
        {children}
      </a>
    ),
  },
  types: {
    code: ({ value }: any) => (
      <div className="relative group my-12">
        <div className="absolute -top-3 left-4 px-2 py-1 bg-white border border-black/5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 z-10">
           {value?.language || 'code'}
        </div>
        <div className="p-8 bg-neutral-900 text-neutral-100 font-mono text-[14px] leading-relaxed overflow-x-auto rounded-sm">
          <pre><code>{value?.code}</code></pre>
        </div>
      </div>
    ),
  },
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service?._id) {
    notFound();
  }

  // Dynamically resolve icon
  const IconComponent = (Icons as any)[service.icon || "Layers"] || Icons.Layers;

  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge="Expertise"
        title={service.title}
      />

      {/* Main Content */}
      <section className="bg-white px-6 py-16 md:py-24 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left: Narrative */}
          <div className="lg:col-span-7">
            <SectionReveal className="space-y-8 md:space-y-12">
               <div className="flex items-center gap-4 text-brand-teal">
                  <IconComponent size={32} strokeWidth={1.5} />
                  <div className="h-px flex-1 bg-black/5" />
               </div>
               
               <div className="prose prose-lg max-w-none text-neutral-800">
                  {service.longDescription ? (
                    <PortableText value={service.longDescription} components={components} />
                  ) : (
                    <p className="text-xl text-neutral-600 italic">
                      {service.description || "Detailed narrative coming soon."}
                    </p>
                  )}
               </div>
            </SectionReveal>
          </div>

          {/* Right: Capabilities */}
          <div className="lg:col-span-5">
            <SectionReveal delay={0.2} className="bg-neutral-50 p-6 sm:p-12 border border-black/5 rounded-sm">
               <h2 className="text-sm uppercase tracking-[0.2em] text-black/40 mb-6 md:mb-8 font-semibold">Capabilities</h2>
               <ul className="space-y-4 md:space-y-6">
                  {service.features?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4 group">
                       <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-teal shrink-0" />
                       <span className="text-base md:text-lg font-normal text-black/80 group-hover:text-black transition-colors">
                          {feature}
                       </span>
                    </li>
                  ))}
               </ul>
            </SectionReveal>
          </div>

        </div>
      </section>

      {/* Featured Projects Section */}
      {service.featuredProjects && service.featuredProjects.length > 0 && (
        <section className="bg-bg-light px-6 py-16 md:py-24 sm:px-8 md:px-10 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <SectionReveal className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
               <div className="max-w-2xl">
                  <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-brand-teal mb-4 block font-semibold">Proof of Excellence</span>
                  <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-black">Case studies powered by this expertise.</h2>
               </div>
            </SectionReveal>

            <div className="grid md:grid-cols-2 gap-1 px-1 bg-black/5 border border-black/5 overflow-hidden rounded-sm">
               {service.featuredProjects.map((project, i) => (
                 <SectionReveal key={project._id} delay={i * 0.1} className="group bg-white overflow-hidden relative aspect-[4/3] md:aspect-[16/10]">
                    <Link href={`/${lang}/projects/${project.slug}`} className="block h-full relative">
                       <div className="absolute inset-0 z-10 p-6 md:p-10 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-sm">
                          <div className="space-y-2">
                             <span className="text-[10px] tracking-[0.2em] text-brand-teal uppercase font-bold">{project.tags?.[0] || "Featured"}</span>
                             <h3 className="text-2xl text-white font-normal">{project.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-white">
                             <span className="text-sm font-normal">View Case Study</span>
                             <div className="h-px w-12 bg-white/30 group-hover:w-20 transition-all duration-500" />
                          </div>
                       </div>
                       
                       {project.coverImage ? (
                         <Image 
                           src={urlForImage(project.coverImage)?.width(1200).height(800).url() || ""}
                           alt={project.title}
                           fill
                           className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                         />
                       ) : (
                         <div className="w-full h-full bg-neutral-100" />
                       )}
                    </Link>
                 </SectionReveal>
               ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-black text-white px-6 py-32 sm:px-8 md:px-10 lg:px-12 text-center">
        <SectionReveal className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-normal tracking-tight leading-[1.1]">
            Ready to integrate this expertise into your business?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link 
              href={`/${lang}/contact`}
              className="px-8 py-4 bg-brand-teal text-black text-sm font-semibold tracking-wide hover:bg-white transition-colors rounded-sm"
            >
              Start Your Project
            </Link>
            <Link 
              href={`/${lang}/projects`}
              className="text-sm font-normal border-b border-white/20 hover:border-white transition-colors pb-1"
            >
              Explore All Case Studies
            </Link>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
