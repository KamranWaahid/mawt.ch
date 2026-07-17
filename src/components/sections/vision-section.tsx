"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { SectionReveal } from "@/components/ui/section-reveal";
import { sectionTitleDarkClass } from "@/components/ui/section-title-style";
import { ArrowUpRight } from "lucide-react";

export function VisionSection({ dict, services }: { dict: any; services?: any[] }) {
  const params = useParams();
  const currentLang = (params?.lang as string) || "en";
  const displayItems = services && services.length > 0 ? services : dict.items;

  return (
    // Negative top margin: the problem section's statement sits centered in a
    // 100vh screen and fades out over its last 15%, leaving the bottom half
    // empty — this section climbs into that void instead of waiting below it.
    <section className="relative -mt-[12vh] bg-[#161616] pb-8 pt-4 md:-mt-[16vh] md:pb-10 md:pt-6 lg:pb-12 lg:pt-8">
      <div className="site-container-xwide">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Statement + its divider line. Sticky at ALL
              breakpoints: from the horizontal line down, this block pins while
              the services column keeps scrolling. On mobile/tablet the grid is a
              single column, so the block carries an opaque background + z-index:
              the services scroll up cleanly BEHIND the pinned title instead of
              showing through it. `self-start` stops the grid item stretching
              (required for sticky to engage). */}
          <div className="sticky top-0 z-10 h-fit w-full self-start bg-gradient-to-b from-[#161616] from-[80px] to-transparent pb-16 pt-[87px] lg:top-32 lg:col-span-5 lg:bg-none lg:pb-0 lg:pt-0">
            <div className="mb-4 h-px w-full bg-white/10" />
            <AnimatedTitle
              as="h2"
              text={dict.statement}
              className={`${sectionTitleDarkClass} text-balance`}
              splitBy="word"
            />
          </div>

          <div className="flex flex-col pt-2 lg:col-span-7 lg:pt-0">
            {displayItems?.map((item: any, idx: number) => {
              const title = item.category || item.title;
              return (
                <div key={`${title}-${idx}`} className="flex flex-col">
                  <SectionReveal delay={idx * 0.08}>
                    <div className="flex flex-col">
                      <h3 className="mb-2 text-lg-fluid font-medium tracking-tight text-white">
                        {title}
                      </h3>
                      {item.services && Array.isArray(item.services) ? (
                        <ul className="mb-6 flex max-w-[55ch] flex-wrap gap-x-3 gap-y-1.5 text-sm-fluid leading-relaxed text-white/45">
                          {item.services.map((service: any, sIdx: number) => {
                            const isObj = typeof service === "object";
                            const serviceTitle = isObj ? service.title : service;
                            const serviceHref = isObj ? service.href : null;

                            return (
                              <li key={`${serviceTitle}-${sIdx}`} className="flex items-center gap-2">
                                {serviceHref ? (
                                  <Link
                                    href={serviceHref}
                                    className="transition-colors hover:text-white hover:underline decoration-[#75DAB4] decoration-2 underline-offset-4"
                                  >
                                    {serviceTitle}
                                  </Link>
                                ) : (
                                  <span>{serviceTitle}</span>
                                )}
                                {sIdx < item.services.length - 1 && (
                                  <span className="text-xs text-white/20">•</span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="mb-6 max-w-[55ch] text-sm-fluid font-normal leading-relaxed text-white/45">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mb-6 h-px w-full bg-white/10" />
                  </SectionReveal>
                </div>
              );
            })}

            <div className="pt-2">
              <SectionReveal delay={((displayItems?.length || 3) - 1) * 0.08 + 0.12}>
                <Link
                  href={`/${currentLang}/services`}
                  className="group inline-flex items-center gap-2 border-b border-white/40 pb-1 text-base font-normal text-white transition-colors hover:border-white hover:text-white/80"
                >
                  {dict.cta}
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </SectionReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
