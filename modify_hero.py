import re

with open("src/components/sections/homepage-hero-section.tsx", "r") as f:
    content = f.read()

# Add useWindowSize import if not present
if "useWindowSize" not in content:
    content = content.replace('import { useParams } from "next/navigation";', 'import { useParams } from "next/navigation";\nimport { useWindowSize } from "@/hooks/use-window-size";')

# Find the start of HomepageHeroSection
start_idx = content.find("export function HomepageHeroSection({")

# Extract the top part
top_part = content[:start_idx]

# Our new HomepageHeroSection code
new_component = """export function HomepageHeroSection({ settings, dict, transitionDict }: HomepageHeroSectionProps) {
  const lang = useParams().lang as Locale;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeroMobileMenuOpen, setIsHeroMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });
  const windowSize = useWindowSize();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
    if (latest > 0.01 && videoRef.current && videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log("Autoplay prevented:", e);
        });
      }
    }
  });

  const LOGO_ORIGINAL_WIDTH = 696;
  const LOGO_ORIGINAL_HEIGHT = 160;
  
  const initialWidth = 98;
  const initialScale = initialWidth / LOGO_ORIGINAL_WIDTH;
  const initialX = windowSize.width < 1024 ? 20 : windowSize.width * 0.025;
  const initialY = windowSize.width < 1024 ? 24 : 32;
  
  const targetWidth = windowSize.width * 0.85;
  const targetScale = targetWidth / LOGO_ORIGINAL_WIDTH;
  const targetX = (windowSize.width - targetWidth) / 2;
  const targetY = (windowSize.height - (LOGO_ORIGINAL_HEIGHT * targetScale)) / 2;

  const finalScale = targetScale * 1.05;
  const finalX = (windowSize.width - (LOGO_ORIGINAL_WIDTH * finalScale)) / 2;
  const finalY = (windowSize.height - (LOGO_ORIGINAL_HEIGHT * finalScale)) / 2;

  const logoScale = useTransform(smoothProgress, [0, 0.25, 0.65], [initialScale, targetScale, finalScale]);
  const logoX = useTransform(smoothProgress, [0, 0.25, 0.65], [initialX, targetX, finalX]);
  const logoY = useTransform(smoothProgress, [0, 0.25, 0.65], [initialY, targetY, finalY]);

  const solidLogoOpacity = useTransform(smoothProgress, [0.25, 0.35], [1, 0]);
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0.05, 0.15, 0.50, 0.60], [0, 1, 1, 0]);

  // Transition gradient slides up from bottom
  const transitionGradientY = useTransform(smoothProgress, [0.65, 0.85, 1], ["100vh", "0vh", "0vh"]);
  const transitionCtaOpacity = useTransform(smoothProgress, [0.80, 0.85, 0.92, 0.98], [0, 1, 1, 0]);
  
  const navbarOpacity = useTransform(smoothProgress, [0.005, 0.05], [0, 1]);
  const navbarY = useTransform(smoothProgress, [0.005, 0.05], [-12, 0]);
  const navLinksOpacity = useTransform(smoothProgress, [0.85, 0.92], [0, 1]);
  const navLogoOpacity = useTransform(smoothProgress, [0.85, 0.92], [0, 1]);
  
  const isHomeNavLight = scrollProgress >= 0.88;
  const homeNavTextClass = isHomeNavLight ? "text-black/70" : "text-white/72";
  const homeNavHoverClass = isHomeNavLight ? "hover:text-black" : "hover:text-white";
  const homeNavDividerClass = isHomeNavLight ? "text-black/25" : "text-white/25";
  const homeNavSlashClass = isHomeNavLight ? "text-black/45" : "text-white/45";
  
  const isTransitionTextDark = scrollProgress >= 0.75;
  const transitionCtaClass = isTransitionTextDark
    ? "border-black/12 bg-black/[0.04] text-black/92 hover:border-black/22 hover:bg-black/[0.08] hover:text-black"
    : "border-white/14 bg-white/[0.10] text-white/92 hover:border-white/24 hover:bg-white/[0.16] hover:text-white";

  const navHref = (route: string) => {
    if (route === "news") return `/${lang}/news`;
    return localizedHref(route, lang);
  };

  return (
    <section ref={sectionRef} className="relative z-50 h-[400svh] w-full bg-[#F6F5F4] text-white">
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black">
        
        {/* Layer 1: The Video Container */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <video
            ref={videoRef}
            src="/MotionMAWT.mp4"
            className="w-full h-full object-cover"
            playsInline
            muted
            loop
            autoPlay
            preload="auto"
          />
        </div>

        {/* Layer 2: The Mask Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-black mix-blend-multiply flex overflow-hidden">
          <motion.div 
            className="origin-top-left absolute top-0 left-0" 
            style={{ scale: logoScale, x: logoX, y: logoY }}
          >
            <svg width="696" height="160" viewBox="0 0 696 160" fill="white" preserveAspectRatio="xMidYMid meet">
              {mawatLogoPaths.map(p => <path key={p} d={p} />)}
            </svg>
          </motion.div>
        </div>

        {/* Layer 3: The Solid White Logo */}
        <motion.div 
          className="absolute inset-0 z-[25] pointer-events-none overflow-hidden"
          style={{ opacity: solidLogoOpacity }}
        >
          <motion.div 
            className="origin-top-left absolute top-0 left-0" 
            style={{ scale: logoScale, x: logoX, y: logoY }}
          >
            <svg width="696" height="160" viewBox="0 0 696 160" fill="white" preserveAspectRatio="xMidYMid meet">
              {mawatLogoPaths.map(p => <path key={p} d={p} />)}
            </svg>
          </motion.div>
        </motion.div>

        {/* Gradient Transition */}
        <motion.div
          data-homepage-gradient
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[400vh]"
          style={{
            y: transitionGradientY,
            background:
              "linear-gradient(180deg, #000000 0%, #000000 10%, #001015 20%, #002B36 30%, #28725F 45%, #75DAB4 55%, #F6F5F4 75%, #F6F5F4 100%)",
          }}
        />

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-35 animate-bounce"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>

        {/* Transition Texts */}
        <motion.div className="pointer-events-none absolute inset-x-0 top-0 z-40 hidden px-5 sm:px-7 md:px-9 lg:block lg:px-[2.5vw]">
          <div className="mx-auto w-full max-w-[1760px] pt-[28vh]">
            <HeroGradientStatement text={transitionDict.statement} progress={smoothProgress} />
            <motion.div className="mt-12" style={{ opacity: transitionCtaOpacity }}>
              <Link
                href={localizedHref("a-propos", lang)}
                className={`pointer-events-auto inline-flex h-10 items-center rounded-full border px-[22px] text-[13px] font-normal leading-none backdrop-blur-md transition-colors duration-300 ${transitionCtaClass}`}
              >
                {transitionDict.cta}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="pointer-events-none absolute inset-x-0 top-0 z-40 px-5 sm:px-7 md:px-9 lg:hidden">
          <div className="mx-auto w-full max-w-[48rem] pt-[28vh]">
            <HeroGradientStatement
              text={transitionDict.statement}
              progress={smoothProgress}
              className="text-[clamp(2rem,11vw,4rem)] leading-[1.03]"
            />
            <motion.div className="mt-8" style={{ opacity: transitionCtaOpacity }}>
              <Link
                href={localizedHref("a-propos", lang)}
                className={`pointer-events-auto inline-flex h-10 items-center rounded-full border px-[22px] text-[13px] font-normal leading-none backdrop-blur-md transition-colors duration-300 ${transitionCtaClass}`}
              >
                {transitionDict.cta}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Z-50: NAVIGATION */}
        <motion.nav
          aria-label="Homepage transition navigation"
          className="absolute left-0 right-0 top-0 z-50 h-[71px] border-b border-transparent bg-transparent px-5 sm:px-7 md:px-9 lg:px-[2.5vw]"
          style={{ opacity: navbarOpacity, y: navbarY }}
        >
          <div className="mx-auto flex h-full w-full max-w-[1760px] items-center justify-between gap-5 md:gap-8">
            <motion.div style={{ opacity: navLogoOpacity }} className="shrink-0">
              <Link href={`/${lang}`} aria-label="MAWT home" className="block w-[98px]">
                <MawatLogo className="h-auto w-full" tone={isHomeNavLight ? "dark" : "light"} />
              </Link>
            </motion.div>

            <motion.div
              className={`ml-auto hidden flex-wrap items-center justify-end gap-x-5 gap-y-3 text-[13px] font-normal leading-none transition-colors duration-300 md:flex lg:gap-x-8 lg:text-[14px] ${homeNavTextClass}`}
              style={{ opacity: navLinksOpacity }}
            >
              {navItems.map((item) => (
                <Link key={item.route} href={navHref(item.route)} className={`transition-colors ${homeNavHoverClass}`}>
                  {item.label}
                </Link>
              ))}
              <span className={homeNavDividerClass}>—</span>
              <Link href="/fr" className={`transition-colors ${homeNavHoverClass} ${lang === "fr" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
                FR
              </Link>
              <span className={homeNavSlashClass}>/</span>
              <Link href="/en" className={`transition-colors ${homeNavHoverClass} ${lang === "en" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
                EN
              </Link>
            </motion.div>

            <motion.div
              className={`ml-auto flex items-center gap-3 text-[13px] font-normal leading-none transition-colors duration-300 md:hidden ${homeNavTextClass}`}
              style={{ opacity: navLinksOpacity }}
            >
              <Link href="/fr" className={`transition-colors ${homeNavHoverClass} ${lang === "fr" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
                FR
              </Link>
              <span className={homeNavSlashClass}>/</span>
              <Link href="/en" className={`transition-colors ${homeNavHoverClass} ${lang === "en" ? (isHomeNavLight ? "text-black" : "text-white") : ""}`}>
                EN
              </Link>
              <button
                type="button"
                aria-label={isHeroMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isHeroMobileMenuOpen}
                onClick={() => setIsHeroMobileMenuOpen((open) => !open)}
                className={`ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isHomeNavLight ? "bg-black/5 text-black" : "bg-white/10 text-white"}`}
              >
                {isHeroMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </motion.div>
          </div>
        </motion.nav>

        {isHeroMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(10px)" }}
            className="fixed inset-0 z-[49] bg-black/94 px-6 pb-10 pt-[calc(env(safe-area-inset-top)+6rem)] text-white md:hidden"
          >
            <div className="flex flex-col gap-7">
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <Link
                    key={item.route}
                    href={navHref(item.route)}
                    onClick={() => setIsHeroMobileMenuOpen(false)}
                    className="block border-b border-white/10 py-4 text-[1.5rem] font-normal tracking-[-0.02em] text-white/90 transition-colors hover:text-[#75DAB4]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
"""

with open("src/components/sections/homepage-hero-section.tsx", "w") as f:
    f.write(top_part + new_component)
