"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { SectionReveal } from "@/components/ui/section-reveal";
import { sectionTitleClass } from "@/components/ui/section-title-style";

export function VisionSection({ dict, services }: { dict: any; services?: any[] }) {
  const params = useParams();
  const currentLang = (params?.lang as string) || "en";
  const displayItems = services && services.length > 0 ? services : dict.items;

  return (
    <section className="relative py-12 md:py-18 lg:py-24">
      <div className="site-container">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left Column: Statement + its divider line. Sticky at ALL
              breakpoints: from the horizontal line down, this block pins while
              the services column keeps scrolling. On mobile/tablet the grid is a
              single column, so the block carries an opaque background + z-index:
              the services scroll up cleanly BEHIND the pinned title instead of
              showing through it. `self-start` stops the grid item stretching
              (required for sticky to engage). */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 relative top-auto self-start h-fit z-10 pb-4 lg:pb-0">
            {/* Header Badge */}
            <div className="mb-6">
              <Badge label={dict.badge} theme="light" />
            </div>
            {/* Horizontal Divider — now pinned together with the text */}
            <div className="mb-4 h-px w-full bg-black/10" />
            <AnimatedTitle
              as="h2"
              text={dict.statement}
              className={`${sectionTitleClass} text-balance`}
              splitBy="word"
            />
          </div>
          
          {/* Right Column: Services List & Link */}
          <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
            {displayItems?.map((item: any, idx: number) => {
              const title = item.category || item.title;
              return (
                <div key={`${title}-${idx}`} className="flex flex-col">
                  <SectionReveal delay={idx * 0.08}>
                    <div className="flex flex-col">
                      <h3 className="text-lg-fluid font-medium tracking-tight text-black mb-2">
                        {title}
                      </h3>
                      {item.services && Array.isArray(item.services) ? (
                        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm-fluid leading-relaxed text-neutral-500 max-w-[55ch] mb-6">
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
                        <p className="text-sm-fluid font-normal leading-relaxed text-neutral-500 max-w-[55ch] mb-6">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Divider */}
                    <div className="h-px w-full bg-black/10 mb-6" />
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
