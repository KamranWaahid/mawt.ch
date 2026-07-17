"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import { ArrowRight, Globe } from "lucide-react";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa6";
import { motion, useReducedMotion } from "motion/react";
import { translatePath, localizedHref } from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";
import LogoWhite from "../../../public/MAWT Branding/MAWT Logo - White.svg";
import { CookieConsentModal, useCookieConsent } from "@/components/ui/cookie-consent";
import { CurtainLink } from "@/components/ui/curtain-link";

const platformIcons: Record<
  string,
  ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>
> = {
  LinkedIn: FaLinkedinIn,
  Twitter: FaXTwitter,
  GitHub: FaGithub,
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
};

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

type FooterDict = {
  rights: string;
  cookieSettings: string;
  address?: string;
  phoneDisplay?: string;
  regions?: string;
  geneva?: string;
  cta?: {
    headline: string;
    body: string;
    label: string;
  };
  columns: FooterColumn[];
};

function FooterNavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <CurtainLink
      href={href}
      className="group relative inline-flex text-[14px] font-normal text-white/55 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-white/70 transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
    </CurtainLink>
  );
}

export function SiteFooter({
  dict,
  socialLinks,
}: {
  dict: FooterDict;
  socialLinks?: { platform: string; url: string }[];
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const currentLang = ((params?.lang as string) || "en") as Locale;

  const { showModal, openModal, closeModal } = useCookieConsent();

  // Footer hrefs are authored as EN-canonical paths (e.g. "/about"); localize them
  // to the current locale's public URL (e.g. "/fr/a-propos").
  const localizeHref = (href: string) => {
    if (!href || href === "/") return `/${currentLang}`;
    const normalized = href.startsWith("/") ? href : `/${href}`;
    return translatePath(`/en${normalized}`, "en", currentLang);
  };

  const toggleLanguage = () => {
    const nextLang = currentLang === "en" ? "fr" : "en";
    const newPath = pathname
      ? translatePath(pathname, currentLang, nextLang as Locale)
      : `/${nextLang}`;

    try {
      const url = new URL(newPath, window.location.origin);
      router.push(url.pathname + url.search + url.hash);
    } catch {
      router.push(newPath);
    }
  };

  const contactHref = localizedHref("contact", currentLang);
  const isContactPage =
    pathname === contactHref ||
    pathname?.endsWith("/contact") === true;

  const phoneHref = dict.phoneDisplay
    ? `tel:${String(dict.phoneDisplay).replace(/[^+\d]/g, "")}`
    : undefined;

  return (
    <>
      <CookieConsentModal
        isOpen={showModal}
        onClose={closeModal}
        lang={currentLang}
      />

      <footer className="mt-auto bg-[#161616] text-white">
        {/* Closing invitation — skipped on Contact where the form already closes the page. */}
        {!isContactPage && dict.cta && (
          <section className="border-b border-white/10">
            <div className="site-container-xwide py-16 md:py-24 lg:py-28">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16"
              >
                <div className="lg:col-span-8">
                  <h2 className="max-w-[14ch] text-[clamp(2.2rem,4.6vw,4.2rem)] font-medium leading-[1.02] tracking-tight text-white">
                    {dict.cta.headline}
                  </h2>
                  {dict.cta.body && (
                    <p className="mt-5 max-w-[46ch] text-[15px] font-normal leading-relaxed text-white/55 md:text-[16px]">
                      {dict.cta.body}
                    </p>
                  )}
                </div>
                <div className="lg:col-span-4 lg:flex lg:justify-end">
                  <CurtainLink
                    href={contactHref}
                    className="group inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors duration-300 hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
                  >
                    {dict.cta.label}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5">
                      <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </CurtainLink>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Brand + navigation */}
        <div className="site-container-xwide py-14 md:py-16 lg:py-20">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-8 lg:col-span-4">
              <Link
                href={`/${currentLang}`}
                className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
                aria-label="MAWT home"
              >
                <Image
                  src={LogoWhite}
                  alt="MAWT"
                  className="h-5 w-auto"
                  priority={false}
                />
              </Link>

              {/* NAP — visible on every page for local SEO corroboration. */}
              {dict.address && (
                <address className="not-italic space-y-1.5 text-[13px] font-normal leading-relaxed text-white/45">
                  <p>MAWT — {dict.address}</p>
                  {dict.phoneDisplay && phoneHref && (
                    <p>
                      <a
                        href={phoneHref}
                        className="transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
                      >
                        {dict.phoneDisplay}
                      </a>
                    </p>
                  )}
                </address>
              )}

              {socialLinks && socialLinks.length > 0 && (
                <nav aria-label="Social" className="flex items-center gap-1">
                  {socialLinks.map((link) => {
                    const Icon = platformIcons[link.platform] || Globe;
                    return (
                      <a
                        key={`${link.platform}-${link.url}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.platform}
                        className="flex h-10 w-10 items-center justify-center text-white/45 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
                      >
                        <Icon size={16} aria-hidden={true} />
                      </a>
                    );
                  })}
                </nav>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  aria-label={
                    currentLang === "en"
                      ? "Switch language to French"
                      : "Passer la langue en anglais"
                  }
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-[12px] font-normal text-white/60 transition-colors duration-300 hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
                >
                  <Globe size={13} aria-hidden="true" />
                  <span className="tracking-wide">
                    {currentLang === "en" ? "EN" : "FR"}
                    <span className="mx-1.5 text-white/25">/</span>
                    <span className="text-white/30">
                      {currentLang === "en" ? "FR" : "EN"}
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:col-span-8 lg:grid-cols-5 lg:gap-x-6">
              {dict.columns.map((column) => (
                <nav key={column.title} aria-label={column.title} className="space-y-5">
                  <div className="text-[12px] font-normal tracking-wide text-white/35">
                    {column.title}
                  </div>
                  <ul className="space-y-3.5">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <FooterNavLink href={localizeHref(link.href)}>
                          {link.label}
                        </FooterNavLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}

              <nav
                aria-label={dict.regions || (currentLang === "fr" ? "Régions" : "Regions")}
                className="space-y-5"
              >
                <div className="text-[12px] font-normal tracking-wide text-white/35">
                  {dict.regions || (currentLang === "fr" ? "Régions" : "Regions")}
                </div>
                <ul className="space-y-3.5">
                  <li>
                    <FooterNavLink href={localizeHref("/geneva")}>
                      {dict.geneva || (currentLang === "fr" ? "Genève" : "Geneva")}
                    </FooterNavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Legal row */}
        <div className="border-t border-white/10">
          <div className="site-container-xwide flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:py-7">
            <button
              type="button"
              onClick={openModal}
              className="w-fit text-[12px] font-normal text-white/40 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
            >
              {dict.cookieSettings}
            </button>
            <p className="text-[12px] font-normal text-white/35">{dict.rights}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
