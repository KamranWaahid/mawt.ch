"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import Image from "next/image";
import LogoBlack from "../../../public/logo-black.svg";
import LogoWhite from "../../../public/logo-white.svg";
import { translatePath } from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";

/**
 * Localize a nav href (authored as an EN-canonical path like "/about") to the
 * current locale's public URL. "/" maps to the locale root. Unknown segments
 * pass through unchanged.
 */
function navHref(href: string, lang: Locale): string {
  if (!href || href === "/") return `/${lang}`;
  const normalized = href.startsWith("/") ? href : `/${href}`;
  return translatePath(`/en${normalized}`, "en", lang);
}

type SiteHeaderProps = {
  title: string;
  theme?: "light" | "dark";
  socialLinks?: { platform: string; url: string }[];
  services?: unknown[];
  mainNav?: { label: string; href: string; hasDropdown?: boolean }[];
};

type NavItem = {
  href: string;
  label: string;
  hasDropdown?: boolean;
};

const navItems = [
  { href: "/work", label: "Work" },
  { href: "/approach", label: "Approach" },
  { href: "/services", label: "Services" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// FR labels keyed by the EN-canonical href. The nav labels are authored in
// English (whether from Sanity `mainNav` or the fallback above), so on /fr we
// translate the DISPLAY text here. Unknown hrefs fall back to the English label.
const NAV_LABELS_FR: Record<string, string> = {
  "/work": "Projets",
  "/approach": "Approche",
  "/services": "Services",
  "/news": "Actualités",
  "/about": "À propos",
  "/contact": "Contact",
};

function navLabel(item: { href: string; label: string }, lang: string): string {
  if (lang !== "fr") return item.label;
  return NAV_LABELS_FR[item.href] ?? item.label;
}

export function SiteHeader({ title, theme: themeProp, mainNav }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = pathname.startsWith("/fr") ? "fr" : "en";
  // Hide the FR/EN switch on the contact page only (requested). The global
  // switcher stays everywhere else so language switching still works site-wide.
  const isContactPage = pathname.endsWith("/contact");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeNavItems: NavItem[] = (mainNav && mainNav.length > 0 ? mainNav : navItems).map((item) => ({
    ...item,
    hasDropdown: false,
  }));

  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const isHomePage = ["/", "/en", "/fr", ""].includes(normalizedPath);
  
  const navTextClass = isMobileMenuOpen ? "text-black/70" : "text-white/80";
  const navHoverClass = isMobileMenuOpen ? "hover:text-black" : "hover:text-white";
  const navDividerClass = isMobileMenuOpen ? "text-black/25" : "text-white/30";
  const navSlashClass = isMobileMenuOpen ? "text-black/45" : "text-white/50";

  const [isPastHero, setIsPastHero] = useState(!isHomePage);
  const mixBlendClass = (!isMobileMenuOpen && (!isHomePage || isPastHero)) ? "mix-blend-difference" : "";
  const useDarkLogo = isMobileMenuOpen || !isHomePage || isPastHero;
  const { scrollY } = useScroll();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    if (!isHomePage) {
      setIsPastHero(true);
    } else {
      if (typeof window !== "undefined") {
        const vh = window.innerHeight;
        setIsPastHero(window.scrollY > 3.9 * vh);
      }
    }
  }, [isHomePage, pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isHomePage && typeof window !== "undefined") {
      // The hero section is 400svh, and sticky container is 100svh.
      // We reveal the sticky header right after the hero finishes (around 3.9 * vh).
      const vh = window.innerHeight;
      setIsPastHero(latest > 3.9 * vh);
    }
  });

  const handleLanguageChange = (lang: string) => {
    if (lang === currentLang) return;
    const alt = document.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${lang}"]`,
    );
    const targetUrl = alt?.getAttribute("href") || translatePath(pathname, currentLang as Locale, lang as Locale);

    try {
      const url = new URL(targetUrl, window.location.origin);
      router.push(url.pathname + url.search + url.hash);
    } catch {
      router.push(targetUrl);
    }
  };

  return (
    <motion.header
      style={{ viewTransitionName: "site-header" }}
      initial={isHomePage ? "hidden" : "visible"}
      animate={isPastHero ? "visible" : "hidden"}
      variants={{
        visible: { y: "0%", opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed left-0 right-0 top-0 z-[80] h-[71px] border-b border-transparent px-5 transition-colors duration-300 sm:px-7 md:px-9 lg:px-[2.5vw] bg-transparent ${
        isPastHero ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-full w-full max-w-[1760px] items-center justify-between gap-5 md:gap-8"
      >
        <Link
          href={`/${currentLang}`}
          aria-label={`${title} home`}
          className="z-50 block w-[98px] shrink-0 transition-opacity hover:opacity-80"
        >
          <Image
            src={useDarkLogo ? LogoBlack : LogoWhite}
            alt="MAWT Logo"
            className="h-auto w-full"
          />
        </Link>

        <div className="ml-auto flex items-center">
          <div className={`hidden flex-wrap items-center justify-end gap-x-5 gap-y-3 text-[13px] font-normal leading-none transition-colors duration-300 md:flex lg:gap-x-8 lg:text-[14px] ${navTextClass} ${mixBlendClass}`}>
            {activeNavItems.map((item) => (
              <Link
                key={item.label}
                href={navHref(item.href, currentLang as Locale)}
                aria-current={pathname === navHref(item.href, currentLang as Locale) ? "page" : undefined}
                className={`transition-colors ${navHoverClass}`}
              >
                {navLabel(item, currentLang)}
              </Link>
            ))}
            {!isContactPage && (
              <>
                <span className={navDividerClass}>—</span>
                <button
                  type="button"
                  onClick={() => handleLanguageChange("fr")}
                  aria-label="Passer en français"
                  className={`transition-colors ${navHoverClass} ${currentLang === "fr" ? (isMobileMenuOpen ? "text-black font-medium" : "text-white font-medium") : ""}`}
                >
                  FR
                </button>
                <span className={navSlashClass}>/</span>
                <button
                  onClick={() => handleLanguageChange("en")}
                  type="button"
                  aria-label="Change language"
                  className={`transition-colors ${navHoverClass} ${currentLang === "en" ? (isMobileMenuOpen ? "text-black font-medium" : "text-white font-medium") : ""}`}
                >
                  EN
                </button>
              </>
            )}
          </div>

          <div className={`flex items-center gap-3 text-[13px] font-normal leading-none transition-colors duration-300 md:hidden ${navTextClass} ${mixBlendClass}`}>
            {!isContactPage && (
              <>
                <motion.button
                  whileHover={{ y: -1 }}
                  type="button"
                  onClick={() => handleLanguageChange("fr")}
                  aria-label="Passer en français"
                  className={`transition-colors ${navHoverClass} ${currentLang === "fr" ? (isMobileMenuOpen ? "text-black font-medium" : "text-white font-medium") : ""}`}
                >
                  FR
                </motion.button>
                <span className={navSlashClass}>/</span>
                <motion.button
                  whileHover={{ y: -1 }}
                  onClick={() => handleLanguageChange("en")}
                  type="button"
                  aria-label="Change language"
                  className={`transition-colors ${navHoverClass} ${currentLang === "en" ? (isMobileMenuOpen ? "text-black font-medium" : "text-white font-medium") : ""}`}
                >
                  EN
                </motion.button>
              </>
            )}

            <button
              className={`z-50 ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors md:hidden ${isMobileMenuOpen ? "bg-black/5 text-black hover:bg-black/10" : "bg-white/15 text-white hover:bg-white/25"}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(10px)" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 6rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 4rem)" }}
            className="fixed inset-0 z-40 overflow-y-auto bg-white/95 px-6 md:hidden"
          >
            <div className="flex flex-col gap-12 pb-24">
              <motion.div
                className="flex flex-col gap-7"
                initial="initial"
                animate="animate"
                variants={{
                  animate: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.2
                    }
                  }
                }}
              >
                {activeNavItems.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={{
                      initial: { opacity: 0, x: -20, filter: "blur(10px)" },
                      animate: { opacity: 1, x: 0, filter: "blur(0px)" }
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Link
                      href={navHref(item.href, currentLang as Locale)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[clamp(2rem,10vw,3.35rem)] font-normal leading-none tracking-tight text-black"
                    >
                      {navLabel(item, currentLang)}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-12"
              >
                {/* Language Switcher (hidden on the contact page) */}
                {!isContactPage && (
                <div className="flex items-center gap-4 border-t border-black/10 pt-12">
                  <span className="text-lg text-neutral-300">—</span>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange("fr")}
                    className={`text-lg font-normal transition-colors ${currentLang === "fr" ? "text-black underline underline-offset-4" : "text-neutral-400 hover:text-black"}`}
                  >
                    FR
                  </button>
                  <span className="text-lg text-neutral-300">/</span>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange("en")}
                    className={`text-lg font-normal transition-colors ${currentLang === "en" ? "text-black underline underline-offset-4" : "text-neutral-400 hover:text-black"}`}
                  >
                    EN
                  </button>
                </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
