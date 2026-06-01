"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { SectionReveal } from "@/components/ui/section-reveal";

export function VisionSection({ dict, services }: { dict: any; services?: any[] }) {
  const params = useParams();
  const currentLang = (params?.lang as string) || "en";
  const displayItems = services && services.length > 0 ? services : dict.items;

  return (
    <section className="relative overflow-hidden bg-bg-light py-20 md:py-32 lg:py-40 border-t border-black/5">
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-20">
        
        {/* Header Badge */}
        <SectionReveal>
          <div className="mb-12 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
            <div className="rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1.5 backdrop-blur-sm w-fit">
              <span className="text-[10px] font-normal tracking-[0.2em] text-black/80 uppercase">
                {dict.badge}
              </span>
            </div>
          </div>
        </SectionReveal>

        {/* Horizontal Divider */}
        <div className="mb-16 h-px w-full bg-black/10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Statement */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <SectionReveal delay={0.1}>
              <h2 className="text-2xl font-normal tracking-tight text-black sm:text-3xl md:text-[32px] lg:text-[34px] leading-[1.25] text-balance">
                {dict.statement}
              </h2>
            </SectionReveal>
          </div>
          
          {/* Right Column: Services List & Link */}
          <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
            {displayItems?.map((item: any, idx: number) => {
              const title = item.category || item.title;
              return (
                <div key={`${title}-${idx}`} className="flex flex-col">
                  <SectionReveal delay={idx * 0.08}>
                    <div className="flex flex-col">
                      <h3 className="text-[22px] md:text-2xl lg:text-[26px] font-normal tracking-tight text-black mb-3">
                        {title}
                      </h3>
                      {item.services && Array.isArray(item.services) ? (
                        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-[15px] leading-relaxed text-neutral-500 max-w-[55ch] mb-8">
                          {item.services.map((service: any, sIdx: number) => {
                            const isObj = typeof service === "object";
                            const serviceTitle = isObj ? service.title : service;
                            const serviceHref = isObj ? service.href : null;

                            return (
                              <li key={`${serviceTitle}-${sIdx}`} className="flex items-center gap-2">
                                {serviceHref ? (
                                  <Link href={serviceHref} className="hover:text-black hover:underline transition-colors decoration-[#75DAB4] decoration-2 underline-offset-4">
                                    {serviceTitle}
                                  </Link>
                                ) : (
                                  <span>{serviceTitle}</span>
                                )}
                                {sIdx < item.services.length - 1 && <span className="text-black/20 text-xs">•</span>}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-base font-normal leading-relaxed text-neutral-600 max-w-[55ch] mb-8">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Divider */}
                    <div className="h-px w-full bg-black/10 mb-8" />
                  </SectionReveal>
                </div>
              );
            })}
            
            {/* Call to Action Link */}
            <div className="pt-2">
              <SectionReveal delay={((displayItems?.length || 3) - 1) * 0.08 + 0.12}>
                <Link
                  href={`/${currentLang}/services`}
                  className="inline-flex items-center gap-1.5 text-base font-normal text-black border-b border-black pb-1 hover:opacity-60 transition-opacity"
                >
                  {dict.cta} <span>↗</span>
                </Link>
              </SectionReveal>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
