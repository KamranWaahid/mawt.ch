"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import Image from "next/image";
import LogoBlack from "../../../public/logo-black.svg";
import LogoWhite from "../../../public/logo-white.svg";
import { translatePath } from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";
import { useCurtainTransition } from "@/components/providers/curtain-transition";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

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
  usesCurtain?: boolean;
};

const navItems = [
  { href: "/work", label: "Work" },
  { href: "/our-process", label: "Approach" },
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
  "/our-process": "Approche",
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { navigateWithCurtain } = useCurtainTransition();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useBodyScrollLock(isMobileMenuOpen);

  // Dark catalogue pages use the DHNN slide-up curtain.
  const curtainHrefs = new Set(["/services", "/work", "/news", "/about", "/contact"]);
  const activeNavItems: NavItem[] = (mainNav && mainNav.length > 0 ? mainNav : navItems).map((item) => ({
    ...item,
    usesCurtain: curtainHrefs.has(item.href),
  }));

  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const isHomePage = ["/", "/en", "/fr", ""].includes(normalizedPath);
  
  const [isPastHero, setIsPastHero] = useState(!isHomePage);
  const [headerThemeOverride, setHeaderThemeOverride] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setHeaderThemeOverride(customEvent.detail?.theme || null);
    };
    window.addEventListener("mawt-header-theme", handleThemeChange);
    return () => {
      window.removeEventListener("mawt-header-theme", handleThemeChange);
    };
  }, []);

  // "isDark" here means dark-colored chrome (black text) for light grounds.
  // Mobile menu is always dark catalogue chrome, so opening it must not flip
  // the header into black-on-dark. Catalogue pages force theme="light".
  const isDark = headerThemeOverride
    ? headerThemeOverride === "dark"
    : !isHomePage || isPastHero;

  const navTextClass = isDark ? "text-black/72" : "text-white/80";
  const navHoverClass = isDark ? "hover:text-black" : "hover:text-white";
  const navDividerClass = isDark ? "text-black/25" : "text-white/30";
  const navSlashClass = isDark ? "text-black/45" : "text-white/50";

  // Menu overlay is always dark catalogue chrome — keep the white mark while open.
  const useDarkLogo = isDark && !isMobileMenuOpen;
  const { scrollY } = useScroll();

  const lastPathnameRef = useRef(pathname);

  // Close mobile menu only when the actual pathname changes
  useEffect(() => {
    if (lastPathnameRef.current !== pathname) {
      setIsMobileMenuOpen(false);
      lastPathnameRef.current = pathname;
    }
  }, [pathname]);

  // Escape closes the overlay and returns focus to the menu trigger.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen]);

  // Keep isPastHero state in sync with scroll position/page type changes
  useEffect(() => {
    const handleReset = () => {
      if (!isHomePage) {
        if (!isPastHero) {
          setIsPastHero(true);
        }
      } else {
        if (typeof window !== "undefined") {
          const vh = window.innerHeight;
          const past = window.scrollY > 3.9 * vh;
          if (isPastHero !== past) {
            setIsPastHero(past);
          }
        }
      }
    };
    const frameId = requestAnimationFrame(handleReset);
    return () => cancelAnimationFrame(frameId);
  }, [isHomePage, isPastHero]);

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
    <>
      <motion.div
        initial={isHomePage ? "hidden" : "visible"}
        animate={isPastHero ? "visible" : "hidden"}
        variants={{
          visible: { y: "0%", opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed left-0 right-0 top-0 z-[81] h-[71px]"
      >
        <div className="site-container-xwide flex h-full items-center">
          <Link
            href={`/${currentLang}`}
            aria-label={`${title} home`}
            className="pointer-events-auto block w-[98px] shrink-0 transition-opacity hover:opacity-80"
          >
            <Image
              src={useDarkLogo ? LogoBlack : LogoWhite}
              alt="MAWT Logo"
              className="h-auto w-full"
            />
          </Link>
        </div>
      </motion.div>

      {/* Progressive glass blur (does not inherit mix-blend-difference to avoid color inversion).
          Eight stacked backdrop-filter layers (::before + 6 divs + ::after), each masked to a
          sliding band, so the blur is strongest at the top and fully dissolved at the bottom. */}
      <div
        className={`navbar-blur-backdrop ${isPastHero ? "visible" : ""} ${isDark ? "is-light-bg" : "is-dark-bg"}`}
      >
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>

      <motion.header
        style={{ viewTransitionName: "site-header" }}
        initial={isHomePage ? "hidden" : "visible"}
        animate={isPastHero ? "visible" : "hidden"}
        variants={{
          visible: { y: "0%", opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 top-0 z-[80] h-[71px] border-b border-transparent bg-transparent transition-colors duration-300 ${
          isPastHero ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <nav
          aria-label="Primary"
          className="site-container-xwide flex h-full items-center justify-between gap-5 md:gap-8"
        >
          <div className="w-[98px] shrink-0" />

        <div className="ml-auto flex items-center">
          {/* Full nav from lg up — tablet widths keep the hamburger so labels
              never wrap/clip inside the fixed 71px bar. */}
          <div className={`hidden flex-nowrap items-center justify-end gap-x-5 text-[13px] font-normal leading-none transition-colors duration-300 lg:flex xl:gap-x-8 xl:text-[14px] ${navTextClass}`}>
            {activeNavItems.map((item) => (
              <Link
                key={item.href}
                href={navHref(item.href, currentLang as Locale)}
                aria-current={pathname === navHref(item.href, currentLang as Locale) ? "page" : undefined}
                onClick={
                  item.usesCurtain
                    ? (e) => {
                        e.preventDefault();
                        navigateWithCurtain(navHref(item.href, currentLang as Locale));
                      }
                    : undefined
                }
                className={`inline-flex min-h-11 items-center transition-colors ${navHoverClass} ${pathname === navHref(item.href, currentLang as Locale) ? (isDark ? "text-black font-semibold" : "text-white font-semibold") : ""}`}
              >
                {navLabel(item, currentLang)}
              </Link>
            ))}
            <span className={navDividerClass}>·</span>
            <button
              type="button"
              onClick={() => handleLanguageChange("fr")}
              aria-label="Passer en français"
              className={`inline-flex min-h-11 min-w-11 items-center justify-center transition-colors ${navHoverClass} ${currentLang === "fr" ? (isDark ? "text-black font-medium" : "text-white font-medium") : ""}`}
            >
              FR
            </button>
            <span className={navSlashClass}>/</span>
            <button
              onClick={() => handleLanguageChange("en")}
              type="button"
              aria-label="Change language"
              className={`inline-flex min-h-11 min-w-11 items-center justify-center transition-colors ${navHoverClass} ${currentLang === "en" ? (isDark ? "text-black font-medium" : "text-white font-medium") : ""}`}
            >
              EN
            </button>
          </div>

          <div className={`flex items-center gap-1 text-[13px] font-normal leading-none transition-colors duration-300 lg:hidden ${navTextClass}`}>
            <motion.button
              whileHover={{ y: -1 }}
              type="button"
              onClick={() => handleLanguageChange("fr")}
              aria-label="Passer en français"
              className={`inline-flex min-h-11 min-w-11 items-center justify-center transition-colors ${navHoverClass} ${currentLang === "fr" ? (isDark ? "text-black font-medium" : "text-white font-medium") : ""}`}
            >
              FR
            </motion.button>
            <span className={navSlashClass}>/</span>
            <motion.button
              whileHover={{ y: -1 }}
              onClick={() => handleLanguageChange("en")}
              type="button"
              aria-label="Change language"
              className={`inline-flex min-h-11 min-w-11 items-center justify-center transition-colors ${navHoverClass} ${currentLang === "en" ? (isDark ? "text-black font-medium" : "text-white font-medium") : ""}`}
            >
              EN
            </motion.button>

            <button
              ref={menuButtonRef}
              className={`z-[90] ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                isMobileMenuOpen
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : (isDark ? "bg-black/5 text-black hover:bg-black/10" : "bg-white/15 text-white hover:bg-white/25")
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-primary-nav"
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
            id="mobile-primary-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Primary"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 6rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 4rem)" }}
            className="fixed inset-0 z-[85] overflow-y-auto overscroll-contain bg-[#161616]/97 lg:hidden"
            data-lenis-prevent
          >
            <div className="site-container-xwide flex flex-col gap-12 pb-24">
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
                      onClick={(e) => {
                        setIsMobileMenuOpen(false);
                        if (item.usesCurtain) {
                          e.preventDefault();
                          navigateWithCurtain(navHref(item.href, currentLang as Locale));
                        }
                      }}
                      className="text-[clamp(2rem,10vw,3.35rem)] font-normal leading-none tracking-tight text-white"
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
                {/* Language Switcher */}
                <div className="flex items-center gap-4 border-t border-white/10 pt-12">
                  <span className="text-lg text-white/25">·</span>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange("fr")}
                    className={`text-lg font-normal transition-colors ${currentLang === "fr" ? "text-white underline underline-offset-4" : "text-white/40 hover:text-white"}`}
                  >
                    FR
                  </button>
                  <span className="text-lg text-white/25">/</span>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange("en")}
                    className={`text-lg font-normal transition-colors ${currentLang === "en" ? "text-white underline underline-offset-4" : "text-white/40 hover:text-white"}`}
                  >
                    EN
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
    </>
  );
}
