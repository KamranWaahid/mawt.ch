"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Globe, Layers } from "lucide-react";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa6";
import Image from "next/image";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { translatePath } from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";
import LogoBlack from "../../../public/MAWT Branding/MAWT Logo - Black.svg";

const platformIcons: Record<string, any> = {
  LinkedIn: FaLinkedinIn,
  Twitter: FaXTwitter,
  GitHub: FaGithub,
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
};

export function SiteFooter({ 
  dict, 
  socialLinks 
}: { 
  dict: any;
  socialLinks?: { platform: string; url: string }[];
}) {
  const params = useParams();
  const pathname = usePathname();
  const currentLang = (params?.lang as string) || "en";

  // Footer hrefs are authored as EN-canonical paths (e.g. "/about"); localize them
  // to the current locale's public URL (e.g. "/fr/a-propos").
  const localizeHref = (href: string) => {
    if (!href || href === "/") return `/${currentLang}`;
    const normalized = href.startsWith("/") ? href : `/${href}`;
    return translatePath(`/en${normalized}`, "en", currentLang as Locale);
  };

  const toggleLanguage = () => {
    const nextLang = currentLang === "en" ? "fr" : "en";
    const newPath = pathname
      ? translatePath(pathname, currentLang as Locale, nextLang as Locale)
      : `/${nextLang}`;
    window.location.href = newPath;
  };

  return (
    <footer className="bg-white px-6 py-[120px] sm:px-10 lg:px-20 border-t border-black/5">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-x-8 gap-y-16 grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr]">
          {/* Logo and Socials Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-8">
            <div className="flex items-center gap-2">
              <Image
                src={LogoBlack}
                alt="MAWT Logo"
                className="h-5 w-auto"
              />
            </div>
            
            <div className="flex items-center gap-5 text-black/60">
              {socialLinks?.map((link, i) => {
                const Icon = platformIcons[link.platform] || Globe;
                return (
                  <Link
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="hover:text-black transition-colors"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </Link>
                );
              })}
              {!socialLinks && (
                <>
                  <Link href="https://linkedin.com/company/mawt.ch" aria-label="LinkedIn" className="hover:text-black transition-colors"><FaLinkedinIn size={18} aria-hidden="true" /></Link>
                  <Link href="https://x.com/mawt.ch" aria-label="Twitter" className="hover:text-black transition-colors"><FaXTwitter size={18} aria-hidden="true" /></Link>
                  <Link href="https://github.com/mawt.ch" aria-label="GitHub" className="hover:text-black transition-colors"><FaGithub size={18} aria-hidden="true" /></Link>
                  <Link href="https://instagram.com/mawt.ch" aria-label="Instagram" className="hover:text-black transition-colors"><FaInstagram size={18} aria-hidden="true" /></Link>
                  <Link href="https://facebook.com/mawt.ch" aria-label="Facebook" className="hover:text-black transition-colors"><FaFacebookF size={18} aria-hidden="true" /></Link>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-md border border-black/10 px-3 py-1.5 text-sm font-normal text-black/60 hover:bg-black/5 transition-colors"
            >
              <Globe size={14} />
              <span>{currentLang === "en" ? "English" : "Français"}</span>
              <span className="text-[10px] opacity-40">▼</span>
            </button>
          </div>

          {/* Navigation Columns */}
          {dict.columns.map((column: any) => (
            <div key={column.title} className="space-y-6">
              <h4 className="text-sm font-normal text-black/80">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link: any) => (
                  <li key={link.label}>
                    <Link
                      href={localizeHref(link.href)}
                      className="text-sm font-normal text-black/60 hover:text-black transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Régions / Regions Column */}
          <div className="space-y-6">
            <h4 className="text-sm font-normal text-black/80">
              {currentLang === "fr" ? "Régions" : "Regions"}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href={localizeHref("/geneva")}
                  className="text-sm font-normal text-black/60 hover:text-black transition-colors"
                >
                  {currentLang === "fr" ? "Genève" : "Geneva"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <NewsletterForm dict={dict.newsletter} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col gap-4 border-t border-black/5 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <button className="text-[12px] font-normal text-black/60 hover:text-black transition-colors">
              {dict.cookieSettings}
            </button>
          </div>
          <p className="text-[12px] font-normal text-black/60">
            {dict.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
