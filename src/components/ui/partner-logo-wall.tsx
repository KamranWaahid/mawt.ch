"use client";

import Image from "next/image";
import { urlForImage } from "@/lib/sanity.image";
import type { Partner } from "@/lib/types";

interface PartnerLogoWallProps {
  partners: Partner[];
  partnersSuffix?: string;
}

export function PartnerLogoWall({
  partners,
  partnersSuffix = "Partners",
}: PartnerLogoWallProps) {
  const categories = Array.from(new Set(partners.map((p) => p.category)));
  const getPartnerUrl = (partner: Partner) => {
    if (partner.url) return partner.url;
    if (partner.name.toLowerCase().includes("mellender")) return "https://www.mellender.ch/";
    return null;
  };

  if (!partners.length) return null;

  return (
    <div className="flex flex-col gap-20 py-16 md:py-24 lg:py-28">
      {categories.map((category) => (
        <div key={category} className="site-container-xwide flex w-full flex-col gap-8">
          <div className="flex items-center gap-6">
            <h3 className="text-[12px] font-normal tracking-wide text-white/35">
              {category} {partnersSuffix}
            </h3>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {partners
              .filter((p) => p.category === category)
              .map((partner) => {
                const asset = partner.logo?.asset as
                  | (NonNullable<Partner["logo"]["asset"]> & { url?: string })
                  | undefined;
                const logoSrc =
                  asset?.url ?? urlForImage(partner.logo)?.width(400).fit("max").url();
                const partnerUrl = getPartnerUrl(partner);
                if (!logoSrc) return null;

                const logo = (
                  <Image
                    src={logoSrc}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 768px) 140px, 180px"
                    className="object-contain p-5 opacity-45 brightness-0 invert transition-[opacity,transform] duration-300 group-hover:opacity-90 group-hover:scale-[1.02] sm:p-6"
                  />
                );

                return (
                  <li key={partner._id}>
                    <div className="group relative aspect-[3/2] border border-white/10 bg-white/[0.02] transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.04]">
                      {partnerUrl ? (
                        <a
                          href={partnerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
                          aria-label={partner.name}
                        >
                          {logo}
                        </a>
                      ) : (
                        <div className="relative h-full w-full">{logo}</div>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}
