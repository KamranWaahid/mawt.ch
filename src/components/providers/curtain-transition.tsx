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
 * or appears instant (observed twice on this project). So the rise never
 * depends on the destination page at all:
 *
 *  1. click → freeze a DOM snapshot of the current page (z-110) and rise a
 *     LIGHTWEIGHT FACADE sheet (z-120) styled exactly like the destination
 *     hero (same background, markup and classes, so the reveal is seamless).
 *     The facade is a few DOM nodes — it commits and paints instantly, and
 *     the keyframed rise runs on the compositor (translate3d), immune to
 *     main-thread jank. The rise starts the moment the user clicks.
 *  2. router.push runs in parallel; the real page mounts and hydrates in
 *     normal flow, invisible under the snapshot.
 *  3. when the facade has landed AND the page has mounted (scroll already
 *     reset under cover), the snapshot is removed and the facade fades out,
 *     revealing the real page — whose hero sits exactly where the facade's
 *     is.
 *
 * Failsafes: arming auto-expires (never a stuck frozen screen), reduced
 * motion gets a plain navigation, same-route clicks skip the effect.
 */

const SNAPSHOT_ID = "mawt-slide-snapshot";
// Dev compiles routes on demand and can take seconds; prod navigations are
// near-instant. The failsafe only exists so a failed navigation never leaves
// a frozen screen.
const ARM_TIMEOUT_MS = 8000;
// Keyframed rise: short tension hold (0–12%), then aggressive ease-in pull.
const RISE_MS = 600;
const REVEAL_MS = 480;
export const CONTENT_FADE_MS = 520;
const REVEAL_EASE = "ease-out";
// Top overshoot: the sheet's rounded corners live above the viewport once
// landed, so the radius never has to be animated away.
const SHEET_OVERSHOOT_PX = 28;

export type SlidePreview = {
  title: string;
  crossLabel?: string;
  tagline?: string;
  /** About uses a single statement hero; catalogue pages use title + cross + tagline. */
  layout?: "catalogue" | "statement";
};

export type SlideDestination = "services" | "work" | "news" | "about" | "contact";

function createSnapshot() {
  const main = document.querySelector("main");
  if (!main || document.getElementById(SNAPSHOT_ID)) return;

  const holder = document.createElement("div");
  holder.id = SNAPSHOT_ID;
  holder.setAttribute("aria-hidden", "true");
  holder.style.cssText =
    "position:fixed;inset:0;z-index:110;overflow:hidden;background:#F6F5F4;pointer-events:none;";

  const clone = main.cloneNode(true) as HTMLElement;
  clone.style.cssText = `position:absolute;left:0;right:0;top:${-window.scrollY}px;margin:0;`;
  clone.removeAttribute("id");

  // Canvases clone blank — copy their pixels so animated backgrounds
  // (ASCII hero) stay visible in the frozen frame.
  const src = main.querySelectorAll("canvas");
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

  holder.appendChild(clone);
  document.body.appendChild(holder);
}

function removeSnapshot() {
  document.getElementById(SNAPSHOT_ID)?.remove();
}

/** Match dark catalogue indexes: services, work, news, about, contact. */
export function slideDestinationForHref(href: string): SlideDestination | null {
  const path = href.split("?")[0]?.replace(/\/$/, "") || "";
  if (/\/(en|fr)\/services$/.test(path) || path.endsWith("/services")) return "services";
  if (
    /\/(en|fr)\/work$/.test(path) ||
    /\/(en|fr)\/projets$/.test(path) ||
    path.endsWith("/work") ||
    path.endsWith("/projets")
  ) {
    return "work";
  }
  if (
    /\/(en|fr)\/news$/.test(path) ||
    /\/(en|fr)\/blog$/.test(path) ||
    path.endsWith("/news") ||
    path.endsWith("/blog")
  ) {
    return "news";
  }
  if (
    /\/(en|fr)\/about$/.test(path) ||
    /\/(en|fr)\/a-propos$/.test(path) ||
    path.endsWith("/about") ||
    path.endsWith("/a-propos")
  ) {
    return "about";
  }
  if (/\/(en|fr)\/contact$/.test(path) || path.endsWith("/contact")) {
    return "contact";
  }
  return null;
}

type Phase = "idle" | "rising" | "revealing";

const CurtainContext = createContext<{
  navigateWithCurtain: (href: string) => void;
  takePendingSlide: () => boolean;
  notifyPageReady: () => void;
  isCurtainActive: boolean;
  /** False while the facade is rising; true once reveal starts (and when idle). */
  contentVisible: boolean;
}>({
  navigateWithCurtain: () => {},
  takePendingSlide: () => false,
  notifyPageReady: () => {},
  isCurtainActive: false,
  contentVisible: true,
});

export const useCurtainTransition = () => useContext(CurtainContext);

export function CurtainTransitionProvider({
  children,
  servicesPreview,
  workPreview,
  newsPreview,
  aboutPreview,
  contactPreview,
}: {
  children: ReactNode;
  servicesPreview?: SlidePreview;
  workPreview?: SlidePreview;
  newsPreview?: SlidePreview;
  aboutPreview?: SlidePreview;
  contactPreview?: SlidePreview;
}) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const pendingRef = useRef(false);
  const landedRef = useRef(false);
  const pageReadyRef = useRef(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [risen, setRisen] = useState(false);
  /** React-owned transform pose so re-renders cannot wipe WAAPI / settle(). */
  const [sheetPose, setSheetPose] = useState<"down" | "up">("down");
  const [destination, setDestination] = useState<SlideDestination | null>(null);

  const cleanup = useCallback(() => {
    removeSnapshot();
    pendingRef.current = false;
    landedRef.current = false;
    pageReadyRef.current = false;
    setRisen(false);
    setSheetPose("down");
    setDestination(null);
    setPhase("idle");
  }, []);

  // Landed + page mounted → drop the snapshot, then fade the facade away
  // over the real page (identical hero underneath — the swap is seamless).
  const maybeReveal = useCallback(() => {
    if (!landedRef.current || !pageReadyRef.current) return;
    // Two frames so the page beneath is actually painted before we uncover it.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        removeSnapshot();
        setPhase((p) => (p === "rising" ? "revealing" : p));
      }),
    );
  }, []);

  const navigateWithCurtain = useCallback(
    (href: string) => {
      if (shouldReduceMotion) {
        router.push(href);
        return;
      }
      // Already there (or a transition is in flight): plain navigation, no
      // freeze — a same-route push never changes pathname, so the armed
      // state would only clear via the failsafe.
      if (typeof window !== "undefined" && window.location.pathname === href) {
        router.push(href);
        return;
      }
      const dest = slideDestinationForHref(href) ?? "services";
      pendingRef.current = true;
      landedRef.current = false;
      pageReadyRef.current = false;
      setDestination(dest);
      createSnapshot();
      setRisen(false);
      setSheetPose("down");
      setPhase("rising");
      router.push(href);
    },
    [router, shouldReduceMotion],
  );

  // One-shot consumption by PageTransition when the pathname actually
  // changes — a stale flag never leaks into a later navigation.
  const takePendingSlide = useCallback(() => {
    const pending = pendingRef.current;
    pendingRef.current = false;
    return pending;
  }, []);

  const notifyPageReady = useCallback(() => {
    pageReadyRef.current = true;
    maybeReveal();
  }, [maybeReveal]);

  // Start the rise right after the facade painted its off-screen position.
  // Web Animations API owns the transform — avoids CSS/inline-style fights
  // and React re-renders restarting a class-based animation mid-flight.
  useEffect(() => {
    if (phase !== "rising" || risen) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRisen(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [phase, risen]);

  useEffect(() => {
    if (!(phase === "rising" && risen)) return;
    const el = sheetRef.current;
    if (!el || typeof el.animate !== "function") {
      const t = setTimeout(() => {
        landedRef.current = true;
        maybeReveal();
      }, RISE_MS);
      return () => clearTimeout(t);
    }

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      // Sync DOM pose immediately so anim.cancel() on effect teardown cannot
      // flash the sheet back to translateY(100%) before React commits state.
      el.style.transform = "translate3d(0, 0%, 0)";
      setSheetPose("up");
      landedRef.current = true;
      maybeReveal();
    };

    const anim = el.animate(
      [
        { transform: "translate3d(0, 100%, 0)" },
        { transform: "translate3d(0, 99%, 0)", offset: 0.12 },
        { transform: "translate3d(0, 0%, 0)" },
      ],
      {
        duration: RISE_MS,
        // Strong ease-in: tension hold is in the keyframes (0→12%), then
        // aggressive upward pull. Not ease-in-out — no late deceleration.
        easing: "cubic-bezier(0.75, 0, 1, 1)",
        fill: "forwards",
      },
    );

    anim.addEventListener("finish", settle);

    // Backup if the finish event is dropped under heavy main-thread work.
    const t = setTimeout(settle, RISE_MS + 200);

    return () => {
      anim.removeEventListener("finish", settle);
      clearTimeout(t);
      anim.cancel();
      if (settled) {
        el.style.transform = "translate3d(0, 0%, 0)";
      }
    };
  }, [phase, risen, maybeReveal]);

  // Reveal fade backup + final cleanup.
  useEffect(() => {
    if (phase !== "revealing") return;
    const t = setTimeout(cleanup, REVEAL_MS + 150);
    return () => clearTimeout(t);
  }, [phase, cleanup]);

  // Failsafe: a navigation that never lands must not leave the screen frozen.
  useEffect(() => {
    if (phase === "idle") return;
    const t = setTimeout(cleanup, ARM_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [phase, cleanup]);

  const activePreview =
    destination === "work"
      ? workPreview
      : destination === "news"
        ? newsPreview
        : destination === "services"
          ? servicesPreview
          : destination === "about"
            ? aboutPreview
            : destination === "contact"
              ? contactPreview
              : null;

  return (
    <CurtainContext.Provider
      value={{
        navigateWithCurtain,
        takePendingSlide,
        notifyPageReady,
        isCurtainActive: phase !== "idle",
        // Hide page body under the rising facade; fade it in as the facade
        // dissolves so below-the-hero content never pops/blinks in.
        contentVisible: phase === "idle" || phase === "revealing",
      }}
    >
      {children}
      {phase !== "idle" && (
        <div
          ref={sheetRef}
          aria-hidden="true"
          onTransitionEnd={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.propertyName === "opacity") cleanup();
          }}
          style={{
            top: -SHEET_OVERSHOOT_PX,
            // Pose is React state so re-renders cannot wipe the landed transform.
            // While rising, WAAPI overrides this; after settle, pose is "up".
            transform:
              sheetPose === "up" ? "translate3d(0, 0%, 0)" : "translate3d(0, 100%, 0)",
            transitionProperty: "opacity",
            transitionDuration: `${REVEAL_MS}ms`,
            transitionTimingFunction: REVEAL_EASE,
            willChange: "transform, opacity",
          }}
          className={`fixed inset-x-0 bottom-0 z-[120] overflow-hidden rounded-t-[28px] bg-[#161616] shadow-[0_-32px_90px_rgba(0,0,0,0.45)] ${
            phase === "revealing" ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          {/* Content zone = exactly the viewport once landed (the overshoot
              strip sits above it), so the facade hero lines up pixel-for-pixel
              with the real dark page hero it reveals into. */}
          <div className="absolute inset-x-0 bottom-0" style={{ top: SHEET_OVERSHOOT_PX }}>
            {activePreview && (
              <div className="pb-[10vh] pt-[24vh]">
                <div className="site-container-xwide">
                  {activePreview.layout === "statement" ? (
                    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                      <div className="lg:col-span-9">
                        <h1 className="max-w-[12ch] text-[clamp(3rem,6vw,5.8rem)] font-medium leading-[0.98] tracking-tight text-white">
                          {activePreview.title}
                        </h1>
                      </div>
                    </div>
                  ) : (
                    <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-tight text-white">
                      <span className="block">
                        {activePreview.title}{" "}
                        {activePreview.crossLabel ? (
                          <span className="text-white/15">{activePreview.crossLabel}</span>
                        ) : null}
                      </span>
                      {activePreview.tagline ? (
                        <span className="block">{activePreview.tagline}</span>
                      ) : null}
                    </h1>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </CurtainContext.Provider>
  );
}
