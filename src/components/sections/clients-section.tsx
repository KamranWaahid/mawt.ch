"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { urlForImage } from "@/lib/sanity.image";
import { sectionTitleClass } from "@/components/ui/section-title-style";
import type { Partner } from "@/lib/types";

type ClientsCopy = {
  title?: string;
};

export function ClientsSection({ dict, partners }: { dict?: ClientsCopy; partners?: Partner[] }) {
  const displayPartners = partners && partners.length > 0 ? partners : [];
  const revealTransition = { duration: 0.95, ease: [0.16, 1, 0.3, 1] as const };

  const getLogoUrl = (partner: Partner) => {
    if (!partner.logo) return "";
    if (typeof partner.logo === "string") return partner.logo;
    return urlForImage(partner.logo)?.width(300).url() || "";
  };

  return (
    <section className="relative -mt-12 overflow-hidden pt-0 pb-20 md:-mt-14 md:pt-0 md:pb-24 lg:-mt-16 lg:pt-0 lg:pb-28">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, #F6F5F4 0%, #ECFBF5 22%, #D5FFEF 48%, #EAFBF4 78%, transparent 100%)",
        }}
      />
      <div className="site-container relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.45 }}
          transition={revealTransition}
          className={sectionTitleClass}
        >
          {dict?.title || "Who trust us?"}
        </motion.h2>
        
        {displayPartners.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ ...revealTransition, delay: 0.1 }}
            className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:mt-12 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-10 md:grid-cols-4 lg:grid-cols-7 lg:gap-x-14 lg:gap-y-12"
          >
            {displayPartners.map((partner) => {
              const logoSrc = getLogoUrl(partner);
              if (!logoSrc) return null;

              return (
                <div 
                  key={partner._id} 
                  className="relative h-8 w-full max-w-[135px] sm:h-10 sm:max-w-[155px]"
                >
                  {partner.url ? (
                    <a 
                      href={partner.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block relative h-full w-full"
                    >
                      <Image
                        src={logoSrc}
                        alt={partner.name}
                        fill
                        sizes="(max-width: 640px) 140px, 155px"
                        className="object-contain object-left grayscale opacity-45 contrast-75 brightness-90 transition duration-300 hover:grayscale-0 hover:opacity-100 hover:contrast-100 hover:brightness-100"
                      />
                    </a>
                  ) : (
                    <Image
                      src={logoSrc}
                      alt={partner.name}
                      fill
                      sizes="(max-width: 640px) 140px, 155px"
                      className="object-contain object-left grayscale opacity-45 contrast-75 brightness-90 transition duration-300 hover:grayscale-0 hover:opacity-100 hover:contrast-100 hover:brightness-100"
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        ) : (
          <div className="mt-12 relative w-full max-w-[1180px]">
            <motion.div 
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ ...revealTransition, delay: 0.1 }}
              className="relative w-full aspect-[5/1] md:aspect-[11/1]"
            >
              <Image
                src="/client-logos.png"
                alt="Trusted by leading companies"
                fill
                className="object-contain object-left opacity-45 grayscale contrast-75 brightness-90 mix-blend-multiply"
                priority
              />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
