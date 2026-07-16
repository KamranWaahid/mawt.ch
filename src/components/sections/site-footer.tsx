"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa6";
import Image from "next/image";
import { translatePath } from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";
import LogoBlack from "../../../public/MAWT Branding/MAWT Logo - Black.svg";
import { CookieConsentModal, useCookieConsent } from "@/components/ui/cookie-consent";

const platformIcons: Record<string, any> = {
  LinkedIn: FaLinkedinIn,
  Twitter: FaXTwitter,
  GitHub: FaGithub,
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
};

export function SiteFooter({
  dict,
  socialLinks,
}: {
  dict: any;
  socialLinks?: { platform: string; url: string }[];
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = (params?.lang as string) || "en";

  // BUG-008: Cookie consent modal state
  const { showModal, openModal, closeModal } = useCookieConsent();

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

    try {
      const url = new URL(newPath, window.location.origin);
      router.push(url.pathname + url.search + url.hash);
    } catch {
      router.push(newPath);
    }
  };

  return (
    <>
      {/* BUG-008: Cookie consent modal rendered at footer level */}
      <CookieConsentModal
        isOpen={showModal}
        onClose={closeModal}
        lang={currentLang}
      />

      <footer className="pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-32">
        <div className="site-container-wide">
          <div className="grid gap-x-10 gap-y-16 md:gap-x-12 lg:gap-x-16 grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr]">
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
                {/* BUG-022: Only render social links from CMS; hide defaults if none configured */}
                {socialLinks && socialLinks.length > 0
                  ? socialLinks.map((link, i) => {
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
                    })
                  : /* BUG-022: No social links configured — show only a LinkedIn placeholder
                       that is a real, verifiable URL. Remove the invalid GitHub/Twitter defaults. */
                    null}
              </div>

              {/* NAP — visible on every page (local SEO: engines corroborate
                  the entity from visible HTML, not only from the schema).
                  tel: is RFC 3966 (no separators); the label stays formatted. */}
              {dict.address && (
                <address className="not-italic text-xs-fluid text-black/60 space-y-1">
                  <p>MAWT — {dict.address}</p>
                  {dict.phoneDisplay && (
                    <p>
                      <a
                        href={`tel:${String(dict.phoneDisplay).replace(/[^+\d]/g, "")}`}
                        className="hover:text-black transition-colors"
                      >
                        {dict.phoneDisplay}
                      </a>
                    </p>
                  )}
                </address>
              )}

              {/* Language Switcher — BUG-013: type="button" to prevent form submit */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-2 rounded-md border border-black/10 px-3 py-1.5 text-xs-fluid text-black/60 hover:bg-black/5 transition-colors"
              >
                <Globe size={14} />
                <span>{currentLang === "en" ? "English" : "Français"}</span>
                <span className="text-[10px] opacity-40">▼</span>
              </button>
            </div>

            {/* Navigation Columns */}
            {dict.columns.map((column: any) => (
              <div key={column.title} className="space-y-6">
                {/* div, not h4: footer nav labels are not document structure —
                    h4 created a h2→h4 level skip on every page. */}
                <div className="text-xs-fluid font-medium text-black/80">{column.title}</div>
                <ul className="space-y-4">
                  {column.links.map((link: any) => (
                    <li key={link.label}>
                      <Link
                        href={localizeHref(link.href)}
                        className="text-sm-fluid text-black/60 hover:text-black transition-colors"
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
              <div className="text-xs-fluid font-medium text-black/80">
                {currentLang === "fr" ? "Régions" : "Regions"}
              </div>
              <ul className="space-y-4">
                <li>
                  <Link
                    href={localizeHref("/geneva")}
                    className="text-sm-fluid text-black/60 hover:text-black transition-colors"
                  >
                    {currentLang === "fr" ? "Genève" : "Geneva"}
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-16 md:mt-20 flex flex-col gap-4 border-t border-black/5 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              {/* BUG-008: Cookie Settings button now opens real consent modal */}
              <button
                type="button"
                onClick={openModal}
                className="text-xs-fluid text-black/60 hover:text-black transition-colors"
              >
                {dict.cookieSettings}
              </button>
            </div>
            <p className="text-xs-fluid text-black/60">
              {dict.rights}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
