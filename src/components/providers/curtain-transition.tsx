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
 *     the transform transition runs on the compositor, immune to
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
const RISE_MS = 750;
const REVEAL_MS = 300;
// Top overshoot: the sheet's rounded corners live above the viewport once
// landed, so the radius never has to be animated away.
const SHEET_OVERSHOOT_PX = 28;

export type SlidePreview = {
  title: string;
  crossLabel: string;
  tagline: string;
};

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

type Phase = "idle" | "rising" | "revealing";

const CurtainContext = createContext<{
  navigateWithCurtain: (href: string) => void;
  takePendingSlide: () => boolean;
  notifyPageReady: () => void;
}>({
  navigateWithCurtain: () => {},
  takePendingSlide: () => false,
  notifyPageReady: () => {},
});

export const useCurtainTransition = () => useContext(CurtainContext);

export function CurtainTransitionProvider({
  children,
  servicesPreview,
}: {
  children: ReactNode;
  servicesPreview?: SlidePreview;
}) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const pendingRef = useRef(false);
  const landedRef = useRef(false);
  const pageReadyRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [risen, setRisen] = useState(false);

  const cleanup = useCallback(() => {
    removeSnapshot();
    pendingRef.current = false;
    landedRef.current = false;
    pageReadyRef.current = false;
    setRisen(false);
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
      pendingRef.current = true;
      landedRef.current = false;
      pageReadyRef.current = false;
      createSnapshot();
      setRisen(false);
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
  // At click time the main thread is idle (the heavy page renders later, in
  // normal flow), so these frames flow and the transition start is never
  // swallowed. Once started, the transform animates on the compositor even
  // if hydration blocks the main thread mid-flight.
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

  // transitionend backup — landing must never depend on a single DOM event.
  useEffect(() => {
    if (!(phase === "rising" && risen)) return;
    const t = setTimeout(() => {
      landedRef.current = true;
      maybeReveal();
    }, RISE_MS + 350);
    return () => clearTimeout(t);
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

  return (
    <CurtainContext.Provider value={{ navigateWithCurtain, takePendingSlide, notifyPageReady }}>
      {children}
      {phase !== "idle" && (
        <div
          aria-hidden="true"
          onTransitionEnd={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.propertyName === "transform") {
              landedRef.current = true;
              maybeReveal();
            } else if (e.propertyName === "opacity") {
              cleanup();
            }
          }}
          style={{
            top: -SHEET_OVERSHOOT_PX,
            // Explicit transform (NOT Tailwind translate-y-* utilities:
            // Tailwind v4 implements those with the standalone `translate`
            // property, which a `transition: transform` silently ignores —
            // the sheet would just teleport).
            transform: risen ? "translateY(0)" : "translateY(100%)",
            transitionProperty: "transform, opacity",
            transitionDuration: `${RISE_MS}ms, ${REVEAL_MS}ms`,
            transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1), ease-out",
          }}
          className={`fixed inset-x-0 bottom-0 z-[120] overflow-hidden rounded-t-[28px] bg-[#161616] shadow-[0_-32px_90px_rgba(0,0,0,0.45)] will-change-transform ${
            phase === "revealing" ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          {/* Content zone = exactly the viewport once landed (the overshoot
              strip sits above it), so the facade hero lines up pixel-for-pixel
              with the real dark page hero it reveals into. */}
          <div className="absolute inset-x-0 bottom-0" style={{ top: SHEET_OVERSHOOT_PX }}>
            {servicesPreview && (
              <div className="pb-[10vh] pt-[24vh]">
                <div className="site-container-xwide">
                  <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-tight text-white">
                    <span className="block">
                      {servicesPreview.title}{" "}
                      <span className="text-white/15">{servicesPreview.crossLabel}</span>
                    </span>
                    <span className="block">{servicesPreview.tagline}</span>
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </CurtainContext.Provider>
  );
}
