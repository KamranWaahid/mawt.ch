"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { urlForImage } from "@/lib/sanity.image";
import type { Partner } from "@/lib/types";

export function ClientsSection({ dict, partners }: { dict: any; partners?: Partner[] }) {
  const displayPartners = partners && partners.length > 0 ? partners : [];

  const getLogoUrl = (partner: Partner) => {
    if (!partner.logo) return "";
    if (typeof partner.logo === "string") return partner.logo;
    return urlForImage(partner.logo)?.width(300).url() || "";
  };

  return (
    <section className="bg-bg-light py-20 border-y border-black/[0.02]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20 flex flex-col items-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-black/45 text-[11px] font-normal mb-12 tracking-[0.2em] uppercase text-center"
        >
          {dict?.title || "Who trust us?"}
        </motion.p>
        
        {displayPartners.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16 md:gap-y-10 max-w-5xl"
          >
            {displayPartners.map((partner) => {
              const logoSrc = getLogoUrl(partner);
              if (!logoSrc) return null;

              return (
                <div 
                  key={partner._id} 
                  className="relative w-22 h-6 md:w-28 md:h-7 shrink-0"
                >
                  {partner.url ? (
                    <a 
                      href={partner.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block relative w-full h-full"
                    >
                      <Image
                        src={logoSrc}
                        alt={partner.name}
                        fill
                        sizes="(max-width: 768px) 88px, 112px"
                        className="object-contain filter grayscale opacity-55"
                      />
                    </a>
                  ) : (
                    <Image
                      src={logoSrc}
                      alt={partner.name}
                      fill
                      sizes="(max-width: 768px) 88px, 112px"
                      className="object-contain filter grayscale opacity-55"
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        ) : (
          <div className="relative w-full max-w-5xl px-6 md:px-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full aspect-[5/1] md:aspect-[10/1]"
            >
              <Image
                src="/client-logos.png"
                alt="Trusted by leading companies"
                fill
                className="object-contain opacity-55 grayscale"
                priority
              />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
