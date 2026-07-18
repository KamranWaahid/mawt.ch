"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";

/**
 * Slide-up page transition (DHNN-style), decoupled from hydration.
 *
 * Putting the REAL destination page inside the rising sheet doesn't survive
 * heavy hydration: the main thread blocks, frames drop, and the rise janks
 * or appears instant. So the rise never depends on the destination page:
 *
 *  1. click → freeze a DOM snapshot of the current page (z-110) and rise a
 *     LIGHTWEIGHT FACADE sheet (z-120) styled like the destination hero.
 *  2. router.push runs in parallel; the real page mounts under the snapshot.
 *  3. when the facade has landed AND the page has mounted, the snapshot is
 *     removed and the facade fades out, revealing the real page.
 *
 * All same-origin internal navigations opt in via a capture-phase click
 * interceptor (nav, footer, CTAs, cards). Reduced motion / external /
 * modified clicks stay plain.
 */

const SNAPSHOT_ID = "mawt-slide-snapshot";
const ARM_TIMEOUT_MS = 8000;
const RISE_MS = 900;
const REVEAL_MS = 340;
// Overshoot on BOTH ends: top hides the rounded corners once landed, bottom
// covers the keyframe over-travel (the sheet briefly rises past 0 and settles).
const SHEET_OVERSHOOT_PX = 28;

export type SlidePreview = {
  theme: "dark" | "light" | "home";
  /** Dark services wordmark layout */
  title?: string;
  crossLabel?: string;
  tagline?: string;
  /** Light SubpageHero layout */
  subtitle?: string;
};

function normalizePath(href: string): string {
  try {
    const url = new URL(href, window.location.origin);
    const path = url.pathname.replace(/\/$/, "") || "/";
    return path;
  } catch {
    return href.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";
  }
}

function isLocaleRoot(path: string): boolean {
  return path === "/en" || path === "/fr" || path === "/";
}

type PreviewHint = { title?: string; subtitle?: string };

function resolvePreview(
  href: string,
  previews: Record<string, SlidePreview>,
  hint?: PreviewHint,
): SlidePreview {
  const path = normalizePath(href);
  if (previews[path]) return previews[path];
  if (isLocaleRoot(path)) return { theme: "home" };
  // Unmapped internals (service details, blog posts, projects): the clicked
  // link's own text becomes the facade title, so the destination's content
  // visibly arrives WITH the curtain instead of after it.
  return { theme: "light", title: hint?.title, subtitle: hint?.subtitle };
}

/** Best label for an arbitrary clicked link — explicit attr, then aria, then
 * the anchor's visible text if it reads like a title (not a whole card). */
function extractHint(anchor: HTMLAnchorElement): PreviewHint | undefined {
  const explicit = anchor.dataset.curtainTitle;
  if (explicit) return { title: explicit, subtitle: anchor.dataset.curtainSubtitle };
  const aria = anchor.getAttribute("aria-label");
  if (aria && aria.length <= 90) return { title: aria };
  const heading = anchor.querySelector("h1, h2, h3, h4");
  const text = (heading?.textContent || anchor.textContent || "").trim().replace(/\s+/g, " ");
  if (text && text.length >= 2 && text.length <= 90) return { title: text };
  return undefined;
}

function createSnapshot() {
  const body = document.body;
  if (document.getElementById(SNAPSHOT_ID)) return;

  // While a menu/modal holds the body-scroll lock, body is position:fixed
  // with top:-scrollY and window.scrollY reads 0 — derive the VISUAL scroll
  // from the lock offset so the frozen frame never jumps.
  const lockedTop =
    body.style.position === "fixed" ? Math.abs(parseInt(body.style.top || "0", 10) || 0) : null;
  const visualScroll = lockedTop ?? window.scrollY;

  const holder = document.createElement("div");
  holder.id = SNAPSHOT_ID;
  holder.setAttribute("aria-hidden", "true");
  holder.style.cssText =
    "position:fixed;inset:0;z-index:110;overflow:hidden;background:#F6F5F4;pointer-events:none;";

  // Clone the WHOLE body, not just <main>: open overlays (mobile menu),
  // the header and any fixed UI freeze exactly as the user sees them, so
  // the curtain rises over the real screen — no hard-cut, no flash.
  const clone = body.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  // Neutralize scroll-lock inline styles; the top offset reproduces the
  // visual scroll. Fixed descendants ignore this offset — they anchor to
  // the transformed stage below, which matches the viewport.
  clone.style.cssText = `position:absolute;left:0;right:0;top:${-visualScroll}px;margin:0;width:100%;overflow:visible;`;

  // Canvases clone blank — copy pixels so animated backgrounds stay frozen.
  const src = body.querySelectorAll("canvas");
  const dst = clone.querySelectorAll("canvas");
  src.forEach((c, i) => {
    const target = dst[i];
    if (!target || c.width === 0) return;
    target.width = c.width;
    target.height = c.height;
    try {
      target.getContext("2d")?.drawImage(c, 0, 0);
    } catch {
      /* tainted canvas — leave blank */
    }
  });

  // Parallax stage: the frozen page recedes upward and shrinks slightly while
  // the sheet rises over it — two planes moving against each other reads as
  // depth, not a flat slide. Transform + opacity only (compositor-safe).
  const stage = document.createElement("div");
  stage.style.cssText =
    "position:absolute;inset:0;transform:translateY(0) scale(1);transform-origin:50% 18%;" +
    `transition:transform ${900}ms cubic-bezier(0.6,0.05,0.14,0.99);will-change:transform;`;
  stage.appendChild(clone);

  // Dim the frozen page so the rising sheet always reads clearly
  // (dark-on-dark and light-on-light both need separation).
  const dim = document.createElement("div");
  dim.style.cssText =
    "position:absolute;inset:0;background:#000;opacity:0;transition:opacity 900ms cubic-bezier(0.6,0.05,0.14,0.99);pointer-events:none;";
  stage.appendChild(dim);

  holder.appendChild(stage);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      stage.style.transform = "translateY(-9vh) scale(0.962)";
      dim.style.opacity = "0.52";
    }),
  );

  document.body.appendChild(holder);
}

function removeSnapshot() {
  document.getElementById(SNAPSHOT_ID)?.remove();
}

function shouldInterceptAnchor(anchor: HTMLAnchorElement, event: MouseEvent): string | null {
  if (event.defaultPrevented) return null;
  if (event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;
  if (anchor.dataset.curtain === "off") return null;

  const raw = anchor.getAttribute("href");
  if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(raw, window.location.origin);
  } catch {
    return null;
  }

  if (url.origin !== window.location.origin) return null;
  if (url.pathname.startsWith("/studio") || url.pathname.startsWith("/admin")) return null;

  // Same-path hash / query toggles: let the browser handle them.
  const nextPath = url.pathname.replace(/\/$/, "") || "/";
  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  if (nextPath === currentPath) return null;

  return `${url.pathname}${url.search}${url.hash}`;
}

type Phase = "idle" | "rising" | "revealing";

const CurtainContext = createContext<{
  navigateWithCurtain: (href: string, hint?: PreviewHint) => void;
  takePendingSlide: () => boolean;
  notifyPageReady: () => void;
}>({
  navigateWithCurtain: () => {},
  takePendingSlide: () => false,
  notifyPageReady: () => {},
});

export const useCurtainTransition = () => useContext(CurtainContext);

/** Destination hero content that rides INSIDE the rising sheet. Each element
 * staggers in (blur + lift) while the sheet travels, so the page's content
 * visibly arrives with the curtain — by landing, the hero is already there. */
function FacadeContent({ preview }: { preview: SlidePreview }) {
  if (preview.theme === "home") {
    return <div className="h-full w-full bg-black" />;
  }

  if (preview.theme === "dark") {
    return (
      <div className="pb-[10vh] pt-[24vh]">
        <div className="site-container-xwide">
          <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-tight text-white">
            <span className="mawt-curtain-item block" style={{ animationDelay: "240ms" }}>
              {preview.title}{" "}
              {preview.crossLabel ? (
                <span className="text-white/15">{preview.crossLabel}</span>
              ) : null}
            </span>
            {preview.tagline ? (
              <span className="mawt-curtain-item block" style={{ animationDelay: "340ms" }}>
                {preview.tagline}
              </span>
            ) : null}
          </h1>
        </div>
      </div>
    );
  }

  // Light facade — an exact structural copy of SubpageHero (same section
  // heights, paddings and gradient scale), so the title occupies the same
  // pixels as the real hero it reveals into. No drift, no jump.
  return (
    <div className="h-full w-full overflow-hidden bg-[#F6F5F4]">
      <section className="relative isolate overflow-hidden pt-[132px] pb-14 sm:pt-[150px] md:min-h-[72vh] md:pt-[170px] lg:min-h-[76vh]">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #BFFFE6 0%, #DFFFF4 30%, #F6F5F4 74%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.36]"
          style={{
            background:
              "linear-gradient(180deg, rgba(117,218,180,0.18) 0%, transparent 42%, rgba(255,255,255,0.72) 100%)",
          }}
        />
        <div className="site-container-wide relative z-10 flex min-h-[calc(72vh-220px)] flex-col justify-center md:justify-end md:pb-[12vh]">
          <div className="max-w-[1240px]">
            {preview.title ? (
              <h1 className="max-w-[1180px] font-serif text-[clamp(2.55rem,6vw,4.45rem)] font-normal leading-[0.94] tracking-normal text-[#062833] md:max-w-[1240px]">
                <span className="mawt-curtain-item block" style={{ animationDelay: "220ms" }}>
                  {preview.title}
                </span>
                {preview.subtitle ? (
                  <span
                    className="mawt-curtain-item mt-1 block text-[#a7adb7]"
                    style={{ animationDelay: "320ms" }}
                  >
                    {preview.subtitle}
                  </span>
                ) : null}
              </h1>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export function CurtainTransitionProvider({
  children,
  previews = {},
}: {
  children: ReactNode;
  /** Localized pathname → facade copy/theme for seamless hero matching */
  previews?: Record<string, SlidePreview>;
}) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const previewsRef = useRef(previews);
  previewsRef.current = previews;

  const pendingRef = useRef(false);
  const landedRef = useRef(false);
  const pageReadyRef = useRef(false);
  const busyRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [activePreview, setActivePreview] = useState<SlidePreview | null>(null);

  const cleanup = useCallback(() => {
    removeSnapshot();
    pendingRef.current = false;
    landedRef.current = false;
    pageReadyRef.current = false;
    busyRef.current = false;
    setActivePreview(null);
    setPhase("idle");
  }, []);

  const maybeReveal = useCallback(() => {
    if (!landedRef.current || !pageReadyRef.current) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        removeSnapshot();
        setPhase((p) => (p === "rising" ? "revealing" : p));
      }),
    );
  }, []);

  const navigateWithCurtain = useCallback(
    (href: string, hint?: PreviewHint) => {
      if (shouldReduceMotion) {
        router.push(href);
        return;
      }

      const path = normalizePath(href);
      if (typeof window !== "undefined") {
        const current = window.location.pathname.replace(/\/$/, "") || "/";
        if (current === path) {
          router.push(href);
          return;
        }
      }

      // Don't stack transitions — fall back to a plain push if one is live.
      if (busyRef.current) {
        router.push(href);
        return;
      }

      busyRef.current = true;
      pendingRef.current = true;
      landedRef.current = false;
      pageReadyRef.current = false;
      setActivePreview(resolvePreview(href, previewsRef.current, hint));
      createSnapshot();
      setPhase("rising");
      // Immediate push — rAF-deferred pushes hang in throttled/background
      // tabs (rAF never fires). The rise is a CSS animation on the
      // compositor, and hover-prefetch keeps the push light anyway.
      router.push(href);
    },
    [router, shouldReduceMotion],
  );

  const takePendingSlide = useCallback(() => {
    const pending = pendingRef.current;
    pendingRef.current = false;
    return pending;
  }, []);

  const notifyPageReady = useCallback(() => {
    pageReadyRef.current = true;
    maybeReveal();
  }, [maybeReveal]);

  // Site-wide: any internal <a> uses the curtain (nav, footer, cards, CTAs).
  useEffect(() => {
    if (shouldReduceMotion) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = shouldInterceptAnchor(anchor, event);
      if (!href) return;

      event.preventDefault();
      // Snapshot runs synchronously in this handler — before React closes
      // any open menu — so the frozen frame still shows the menu and the
      // curtain rises over it (no hard-cut, no exposed old page).
      navigateWithCurtain(href, extractHint(anchor));
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigateWithCurtain, shouldReduceMotion]);

  // Warm the destination on intent (hover / touch): the server-rendered
  // payload — CMS data included — is already in the router cache at click
  // time, so the real page mounts under the curtain almost instantly.
  useEffect(() => {
    const prefetched = new Set<string>();

    const warm = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const raw = anchor.getAttribute("href");
      if (!raw || !raw.startsWith("/")) return;
      if (raw.startsWith("/studio") || raw.startsWith("/admin")) return;
      const path = normalizePath(raw);
      if (prefetched.has(path)) return;
      prefetched.add(path);
      router.prefetch(path);
    };

    document.addEventListener("pointerover", warm, { capture: true, passive: true });
    document.addEventListener("touchstart", warm, { capture: true, passive: true });
    return () => {
      document.removeEventListener("pointerover", warm, { capture: true });
      document.removeEventListener("touchstart", warm, { capture: true });
    };
  }, [router]);

  // animationend backup — landing must never depend on a single DOM event.
  // Generous margin: if the main thread stalls before the animation commits,
  // the backup must not reveal the page while the sheet is still mid-rise.
  useEffect(() => {
    if (phase !== "rising") return;
    const t = setTimeout(() => {
      landedRef.current = true;
      maybeReveal();
    }, RISE_MS + 900);
    return () => clearTimeout(t);
  }, [phase, maybeReveal]);

  useEffect(() => {
    if (phase !== "revealing") return;
    const t = setTimeout(cleanup, REVEAL_MS + 160);
    return () => clearTimeout(t);
  }, [phase, cleanup]);

  useEffect(() => {
    if (phase === "idle") return;
    const t = setTimeout(cleanup, ARM_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [phase, cleanup]);

  const sheetClass =
    activePreview?.theme === "dark"
      ? "rounded-t-[28px] border-t border-white/10 bg-[#161616] shadow-[0_-32px_90px_rgba(0,0,0,0.45)]"
      : activePreview?.theme === "light"
        ? "rounded-t-[28px] border-t border-black/5 bg-[#F6F5F4] shadow-[0_-28px_80px_rgba(0,0,0,0.18)]"
        : "rounded-t-[28px] border-t border-white/10 bg-black shadow-[0_-32px_90px_rgba(0,0,0,0.45)]";

  return (
    <CurtainContext.Provider value={{ navigateWithCurtain, takePendingSlide, notifyPageReady }}>
      {children}
      {phase !== "idle" && activePreview && (
        <div
          aria-hidden="true"
          onAnimationEnd={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.animationName.includes("mawt-curtain-rise")) {
              landedRef.current = true;
              maybeReveal();
            }
          }}
          onTransitionEnd={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.propertyName === "opacity") cleanup();
          }}
          style={{
            top: -SHEET_OVERSHOOT_PX,
            bottom: -SHEET_OVERSHOOT_PX,
            transitionProperty: "opacity",
            transitionDuration: `${REVEAL_MS}ms`,
            transitionTimingFunction: "ease-out",
          }}
          className={`mawt-curtain-sheet-rise fixed inset-x-0 z-[120] overflow-hidden will-change-transform ${sheetClass} ${
            phase === "revealing" ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <div
            className="absolute inset-x-0"
            style={{ top: SHEET_OVERSHOOT_PX, bottom: SHEET_OVERSHOOT_PX }}
          >
            <FacadeContent preview={activePreview} />
          </div>
        </div>
      )}
    </CurtainContext.Provider>
  );
}
