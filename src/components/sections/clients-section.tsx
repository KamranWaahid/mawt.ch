"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { urlForImage } from "@/lib/sanity.image";
import type { Partner } from "@/lib/types";

export function ClientsSection({ dict, partners }: { dict: any; partners?: Partner[] }) {
  return (
    <section className="bg-bg-light py-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20 flex flex-col items-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-black/40 text-[11px] font-normal mb-10 tracking-[0.2em]"
        >
          {dict.title}
        </motion.p>
        
        {partners && partners.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16 md:gap-y-10 max-w-5xl"
          >
            {partners.map((partner) => (
              <div key={partner._id} className="relative w-28 h-8 md:w-32 md:h-10 transition-all duration-300 hover:scale-105">
                {partner.url ? (
                  <a href={partner.url} target="_blank" rel="noopener noreferrer" className="block relative w-full h-full">
                    <Image
                      src={urlForImage(partner.logo)?.width(300).url() || ""}
                      alt={partner.name}
                      fill
                      className="object-contain filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                    />
                  </a>
                ) : (
                  <Image
                    src={urlForImage(partner.logo)?.width(300).url() || ""}
                    alt={partner.name}
                    fill
                    className="object-contain filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                )}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full aspect-[5/1] md:aspect-[10/1] max-w-5xl"
          >
            <Image
              src="/Client Logos.png"
              alt="Trusted by leading companies"
              fill
              className="object-contain opacity-50 grayscale"
              priority
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
