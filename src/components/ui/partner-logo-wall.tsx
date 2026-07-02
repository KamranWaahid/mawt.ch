"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity.image";
import type { Partner } from "@/lib/types";

interface PartnerLogoWallProps {
  partners: Partner[];
}

export function PartnerLogoWall({ partners }: PartnerLogoWallProps) {
  const categories = Array.from(new Set(partners.map(p => p.category)));
  const getPartnerUrl = (partner: Partner) => {
    if (partner.url) return partner.url;
    if (partner.name.toLowerCase().includes("mellender")) return "https://www.mellender.ch/";
    return null;
  };

  return (
    <div className="flex flex-col gap-24 py-16 md:py-24 lg:py-32">
      {categories.map((category) => (
        <div key={category} className="site-container-wide w-full flex flex-col gap-12">
           <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]">{category} Partners</h3>
              <div className="h-px flex-1 bg-black/5 ml-8" />
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-black/5 border border-black/5">
              {partners
                .filter(p => p.category === category)
                .map((partner) => {
                  const asset = partner.logo?.asset as (NonNullable<Partner["logo"]["asset"]> & { url?: string }) | undefined;
                  const logoSrc = asset?.url ?? urlForImage(partner.logo)?.width(400).fit("max").url();
                  const partnerUrl = getPartnerUrl(partner);
                  if (!logoSrc) return null;

                  return (
                    <motion.div
                      key={partner._id}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
                      className="aspect-[3/2] bg-white flex items-center justify-center transition-colors group relative"
                    >
                       {partnerUrl ? (
                         <a
                           href={partnerUrl}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-full h-full flex items-center justify-center relative"
                         >
                            <Image
                              src={logoSrc}
                              alt={partner.name}
                              fill
                              sizes="(max-width: 768px) 150px, 200px"
                              className="object-contain p-6 sm:p-8 md:p-10 filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                            />
                         </a>
                       ) : (
                          <Image
                            src={logoSrc}
                            alt={partner.name}
                            fill
                            sizes="(max-width: 768px) 150px, 200px"
                            className="object-contain p-6 sm:p-8 md:p-10 filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                          />
                       )}
                    </motion.div>
                  );
                })}
           </div>
        </div>
      ))}
    </div>
  );
}
