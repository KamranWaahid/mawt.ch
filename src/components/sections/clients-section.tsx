"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { urlForImage } from "@/lib/sanity.image";
import { sectionTitleClass } from "@/components/ui/section-title-style";
import type { Partner } from "@/lib/types";

type ClientsCopy = {
  title?: string;
};

type LogoSprite = {
  name: string;
  href?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  emphasis?: "wide" | "compact";
};

const spriteSize = {
  width: 1846,
  height: 164,
};

const fallbackLogos: LogoSprite[] = [
  { name: "Mellender Real Estate", href: "https://www.mellender.ch/", x: 0, y: 0, width: 232, height: 60, emphasis: "wide" },
  { name: "Sotheby's", x: 326, y: 7, width: 193, height: 46 },
  { name: "United Nations", x: 612, y: 2, width: 183, height: 56 },
  { name: "EMS", x: 888, y: 8, width: 189, height: 44 },
  { name: "Kouleta", x: 1170, y: 0, width: 188, height: 60 },
  { name: "Ciro", x: 1452, y: 4, width: 124, height: 52, emphasis: "compact" },
  { name: "Légitimes Express", x: 1670, y: 0, width: 176, height: 60 },
  { name: "SGP", x: 414, y: 111, width: 176, height: 48 },
  { name: "Buzz", x: 683, y: 116, width: 160, height: 35 },
  { name: "RS Detailing", x: 936, y: 120, width: 223, height: 23, emphasis: "wide" },
  { name: "Sartivoon Crafts", x: 1254, y: 105, width: 175, height: 56 },
];

export function ClientsSection({ dict, partners }: { dict?: ClientsCopy; partners?: Partner[] }) {
  const displayPartners = partners && partners.length > 0 ? partners : [];
  const revealTransition = { duration: 0.95, ease: [0.16, 1, 0.3, 1] as const };

  const getLogoUrl = (partner: Partner) => {
    if (!partner.logo) return null;
    if (typeof partner.logo === "string") return partner.logo;
    return urlForImage(partner.logo)?.width(300).url() ?? null;
  };

  const getPartnerUrl = (partner: Partner) => {
    if (partner.url) return partner.url;
    if (partner.name.toLowerCase().includes("mellender")) return "https://www.mellender.ch/";
    return null;
  };

  const partnerLogos = displayPartners
    .map((partner) => ({
      partner,
      logoSrc: getLogoUrl(partner),
      partnerUrl: getPartnerUrl(partner),
    }))
    .filter((item): item is { partner: Partner; logoSrc: string; partnerUrl: string | null } => Boolean(item.logoSrc));
  const shouldUsePartnerLogos = partnerLogos.length >= fallbackLogos.length;

  return (
    <section className="relative -mt-[8svh] overflow-hidden bg-[#F6F5F4] pt-0 pb-20 md:-mt-[10svh] md:pb-24 lg:-mt-[12svh] lg:pb-28">
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
        
        {shouldUsePartnerLogos ? (
          <motion.div 
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ ...revealTransition, delay: 0.1 }}
            className="mt-7 grid grid-cols-2 items-center gap-x-6 gap-y-7 sm:mt-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7"
          >
            {partnerLogos.map(({ partner, logoSrc, partnerUrl }) => {
              return (
                <div 
                  key={partner._id} 
                  className="flex h-16 items-center justify-center px-3 sm:h-18"
                >
                  {partnerUrl ? (
                    <a 
                      href={partnerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="relative block h-10 w-full max-w-[150px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                    >
                      <Image
                        src={logoSrc}
                        alt={partner.name}
                        fill
                        sizes="(max-width: 640px) 140px, 155px"
                        className="object-contain grayscale opacity-45 contrast-75 brightness-90 transition duration-300 hover:grayscale-0 hover:opacity-100 hover:contrast-100 hover:brightness-100"
                      />
                    </a>
                  ) : (
                    <div className="relative h-10 w-full max-w-[150px]">
                      <Image
                        src={logoSrc}
                        alt={partner.name}
                        fill
                        sizes="(max-width: 640px) 140px, 155px"
                        className="object-contain grayscale opacity-45 contrast-75 brightness-90 transition duration-300 hover:grayscale-0 hover:opacity-100 hover:contrast-100 hover:brightness-100"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.ul
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ ...revealTransition, delay: 0.1 }}
            className="mt-7 grid grid-cols-2 items-center gap-x-6 gap-y-7 sm:mt-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7"
            aria-label={dict?.title}
          >
            {fallbackLogos.map((logo) => {
              const logoStyle = {
                "--logo-x": `${logo.x}px`,
                "--logo-y": `${logo.y}px`,
                "--logo-w": `${logo.width}px`,
                "--logo-h": `${logo.height}px`,
                "--sprite-w": `${spriteSize.width}px`,
                "--sprite-h": `${spriteSize.height}px`,
              } as CSSProperties;

              const mark = (
                <span
                  className="block bg-no-repeat opacity-45 grayscale contrast-75 brightness-90 mix-blend-multiply transition duration-300 [--logo-scale:clamp(0.39,3.4vw,0.56)] group-hover:opacity-70 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-95"
                  style={{
                    ...logoStyle,
                    backgroundImage: "url('/client-logos.png')",
                    width: "calc(var(--logo-w) * var(--logo-scale))",
                    height: "calc(var(--logo-h) * var(--logo-scale))",
                    backgroundPosition: "calc(var(--logo-x) * -1 * var(--logo-scale)) calc(var(--logo-y) * -1 * var(--logo-scale))",
                    backgroundSize: "calc(var(--sprite-w) * var(--logo-scale)) calc(var(--sprite-h) * var(--logo-scale))",
                  }}
                  aria-hidden="true"
                />
              );

              return (
                <li
                  key={logo.name}
                  className="flex h-16 items-center justify-center px-3 sm:h-18"
                >
                  {logo.href ? (
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={logo.name}
                      className="group flex h-full w-full items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                    >
                      {mark}
                    </a>
                  ) : (
                    <span className="group flex h-full w-full items-center justify-center" aria-label={logo.name}>
                      {mark}
                    </span>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
