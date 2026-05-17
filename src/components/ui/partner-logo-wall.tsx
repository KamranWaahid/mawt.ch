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

  return (
    <div className="flex flex-col gap-24 py-24 px-6 sm:px-8 md:px-10 lg:px-12">
      {categories.map((category) => (
        <div key={category} className="max-w-[1440px] mx-auto w-full flex flex-col gap-12">
           <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em]">{category} Partners</h3>
              <div className="h-px flex-1 bg-black/5 ml-8" />
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-black/5 border border-black/5">
              {partners
                .filter(p => p.category === category)
                .map((partner) => (
                  <motion.div 
                    key={partner._id}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
                    className="aspect-[3/2] bg-white flex items-center justify-center p-12 transition-colors group relative"
                  >
                     {partner.url ? (
                       <a 
                         href={partner.url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="w-full h-full flex items-center justify-center relative"
                       >
                          <Image 
                            src={urlForImage(partner.logo)?.width(400).url() || ""}
                            alt={partner.name}
                            width={200}
                            height={100}
                            className="object-contain filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                          />
                       </a>
                     ) : (
                        <Image 
                          src={urlForImage(partner.logo)?.width(400).url() || ""}
                          alt={partner.name}
                          width={200}
                          height={100}
                          className="object-contain filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                        />
                     )}
                  </motion.div>
                ))}
           </div>
        </div>
      ))}
    </div>
  );
}
