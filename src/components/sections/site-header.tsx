"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { FaLinkedinIn, FaGithub, FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import LogoBlack from "../../../public/MAWT Branding/MAWT Logo - Black.svg";
import LogoWhite from "../../../public/MAWT Branding/MAWT Logo - White.svg";

type SiteHeaderProps = {
  title: string;
  theme?: "light" | "dark";
  socialLinks?: { platform: string; url: string }[];
  services?: any[]; // Array of Service documents
  mainNav?: { label: string; href: string; hasDropdown?: boolean }[];
};

const defaultServicesData = {
  Strategy: [
    "Build the Right Website", "Understand Users", "Meeting Market Needs",
    "Generate Business", "Improve Iteratively", "Digital Responsibility"
  ],
  Content: [
    "Content Audit", "UX Writing", "Strategic Storytelling",
    "Guidelines", "Trainings and Sparring", "Content Governance"
  ],
  Design: [
    "User Research", "Service Design", "UX Audit",
    "UX Design", "UI Design", "Branding", "Design Governance"
  ],
  Development: [
    "Artificial Intelligence", "Custom Development", "CMS",
    "E-Commerce", "Mobile Application", "Open Data", "Moodle"
  ],
  Performance: [
    "Analytics", "SEO"
  ]
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services", hasDropdown: true },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const platformIcons: Record<string, any> = {
  LinkedIn: FaLinkedinIn,
  Twitter: FaXTwitter,
  GitHub: FaGithub,
};

export function SiteHeader({ title, theme: themeProp, socialLinks, services, mainNav }: SiteHeaderProps) {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const activeServicesData = services && services.length > 0 
    ? services.reduce((acc, service) => {
        if (!service.category || !service.title) return acc;
        const cat = service.category;
        if (!acc[cat]) {
          acc[cat] = [];
        }
        acc[cat].push(service.title);
        return acc;
      }, {} as Record<string, string[]>)
    : defaultServicesData;

  const activeNavItems = mainNav && mainNav.length > 0 ? mainNav : navItems;

  // Default to light if not on homepage, unless overridden by prop
  const isHomePage = pathname === "/" || pathname === "/en" || pathname === "/fr";
  const theme = themeProp || (isHomePage ? "dark" : "light");

  const isLight = theme === "light" || activeDropdown !== null || isMobileMenuOpen;

  const currentLang = pathname.startsWith("/fr") ? "fr" : "en";

  const handleLanguageChange = (lang: string) => {
    if (lang === currentLang) return;
    const newPath = pathname.replace(`/${currentLang}`, `/${lang}`) || `/${lang}`;
    window.location.href = newPath;
  };

  return (
    <header
      className={`absolute top-0 left-0 right-0 z-40 transition-colors duration-300 px-6 py-8 sm:px-8 md:px-10 lg:px-12 ${activeDropdown || isMobileMenuOpen ? "bg-white" : "bg-transparent"
        }`}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <nav
        aria-label="Primary"
        className="flex w-full items-center justify-between gap-6"
      >
        <Link
          href={`/${currentLang}`}
          aria-label={`${title} home`}
          onMouseEnter={() => setActiveDropdown(null)}
          className="shrink-0 transition-opacity hover:opacity-80 z-50 flex items-center"
        >
          <Image
            src={isLight ? LogoBlack : LogoWhite}
            alt="MAWT Logo"
            className="h-5 w-auto"
          />
        </Link>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="hidden items-center gap-8 md:flex">
            {activeNavItems.map((item) => (
              <div
                key={item.label}
                className="relative flex h-full items-center"
                onMouseEnter={() => {
                  if (item.hasDropdown) {
                    setActiveDropdown(item.label);
                  } else {
                    setActiveDropdown(null);
                  }
                }}
              >
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    href={`/${currentLang}${item.href === "/" ? "" : item.href}`}
                    aria-current={pathname === `/${currentLang}${item.href === "/" ? "" : item.href}` ? "page" : undefined}
                    className={`group relative flex items-center gap-1.5 py-2 text-[15px] font-normal tracking-tight transition-colors duration-300 ${isLight ? "text-black" : "text-neutral-300 hover:text-white"
                      }`}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown
                        size={14}
                        className={`transition-all duration-300 ${activeDropdown === item.label ? "rotate-180 opacity-100" : "opacity-40"
                          } ${isLight ? "text-black" : ""}`}
                      />
                    )}
                    {activeDropdown === item.label && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#75DAB4]"
                      />
                    )}
                  </Link>
                </motion.div>
              </div>
            ))}
          </div>

          <div 
            className={`hidden items-center gap-4 border-l transition-colors duration-300 pl-6 md:flex ${isLight ? "border-black/10" : "border-white/10"
            }`}
            onMouseEnter={() => setActiveDropdown(null)}
          >
            <motion.button
              whileHover={{ y: -1 }}
              onClick={() => handleLanguageChange("fr")}
              className={`text-[14px] font-normal transition-colors duration-300 ${currentLang === "fr"
                ? (isLight ? "text-black" : "text-white")
                : (isLight ? "text-neutral-500 hover:text-black" : "text-neutral-400 hover:text-white")
                }`}
            >
              FR
            </motion.button>
            <motion.button
              whileHover={{ y: -1 }}
              onClick={() => handleLanguageChange("en")}
              type="button"
              aria-label="Change language"
              className={`text-[14px] font-normal transition-colors duration-300 ${currentLang === "en"
                ? (isLight ? "text-black" : "text-white")
                : (isLight ? "text-neutral-500 hover:text-black" : "text-neutral-400 hover:text-white")
                }`}
            >
              EN
            </motion.button>
          </div>

          <button
            className="flex items-center justify-center p-3 md:hidden z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="text-black" size={24} />
            ) : (
              <Menu className={isLight ? "text-black" : "text-white"} size={24} />
            )}
          </button>
        </div>
      </nav>

      {/* Desktop Mega Menu */}
      <AnimatePresence>
        {activeDropdown === "Services" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseEnter={() => setActiveDropdown(null)}
              className="fixed inset-0 top-[104px] z-[-1] bg-white h-screen w-screen hidden md:block"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full bg-white text-black hidden md:block border-b border-black/5"
            >
              <div className="mx-auto grid max-w-[1440px] grid-cols-5 gap-12 px-6 py-16 sm:px-8 md:px-10 lg:px-12">
                {Object.entries(activeServicesData).map(([category, items]) => (
                  <div key={category} className="flex flex-col gap-6">
                    <h3 className="text-lg font-normal tracking-tight text-black">{category}</h3>
                    <ul className="flex flex-col gap-3">
                      {(items as string[]).map((item) => (
                        <li key={item}>
                          <motion.div whileHover={{ x: 2 }}>
                            <Link
                              href={`/${currentLang}/services`}
                              className="text-[15px] font-normal text-neutral-600 transition-colors hover:text-black"
                            >
                              {item}
                            </Link>
                          </motion.div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="fixed inset-0 bg-white/95 z-40 md:hidden pt-32 px-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-16 pb-24">
              <motion.div
                className="flex flex-col gap-8"
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
                    {item.hasDropdown ? (
                      <div className="flex flex-col gap-6">
                        <button
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="text-4xl font-normal tracking-tighter text-black flex items-center justify-between group w-full text-left"
                        >
                          {item.label}
                          <ChevronDown size={24} className={`transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : "opacity-20"}`} />
                        </button>
                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-l border-black/5 pl-6"
                            >
                              <div className="grid gap-8 py-4">
                                {Object.keys(activeServicesData).map(cat => (
                                  <Link
                                    key={cat}
                                    href={`/${currentLang}/services`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xl text-neutral-400 font-normal hover:text-black transition-colors"
                                  >
                                    {cat}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={`/${currentLang}${item.href === "/" ? "" : item.href}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-4xl font-normal tracking-tighter text-black flex items-center justify-between group"
                      >
                        {item.label}
                        <ArrowRight className="text-neutral-200 transition-transform group-hover:translate-x-1" size={24} />
                      </Link>
                    )}
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
                <div className="flex items-center gap-8 border-t border-black/10 pt-12">
                  <button
                    onClick={() => handleLanguageChange("fr")}
                    className={`text-lg font-normal transition-colors ${currentLang === "fr" ? "text-black underline underline-offset-4" : "text-neutral-400 hover:text-black"}`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`text-lg font-normal transition-colors ${currentLang === "en" ? "text-black underline underline-offset-4" : "text-neutral-400 hover:text-black"}`}
                  >
                    EN
                  </button>
                </div>

                {/* Social Media Links */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-bold">Follow @mawt.ch</span>
                    <div className="h-px flex-1 bg-black/5 ml-4" />
                  </div>
                  <div className="flex gap-8 text-black">
                    {socialLinks?.map((link, i) => {
                      const Icon = platformIcons[link.platform] || Globe;
                      return (
                        <Link
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#75DAB4] transition-colors"
                        >
                          <Icon size={24} strokeWidth={1.5} />
                        </Link>
                      );
                    })}
                    {!socialLinks && (
                      <>
                        <Link href="https://linkedin.com/company/mawt" className="hover:text-[#75DAB4] transition-colors"><FaLinkedinIn size={24} /></Link>
                        <Link href="https://twitter.com/mawt_ch" className="hover:text-[#75DAB4] transition-colors"><FaXTwitter size={24} /></Link>
                        <Link href="https://github.com/mawt-ch" className="hover:text-[#75DAB4] transition-colors"><FaGithub size={24} /></Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
