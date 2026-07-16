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
 * Slide-up page transition (DHNN-style): the DESTINATION PAGE rises from the
 * bottom of the viewport as a sheet over a FROZEN SNAPSHOT of the current
 * page. The snapshot is a plain DOM clone of <main> (canvas pixels copied),
 * appended to <body> at click time — this sidesteps AnimatePresence
 * mode-switching entirely: the real old page exits with the ordinary fade,
 * invisibly, underneath the opaque snapshot.
 *
 * Choreography:
 *  1. click → arm + freeze (clone at z-[110]) → router.push
 *  2. PageTransition mounts the new page with the slide variant, fixed at
 *     z-[120], rising 100vh → 0 over the snapshot
 *  3. on landing → scroll reset under the covering sheet → release (remove
 *     snapshot, unfix the page) — no visible jump
 *
 * Failsafes: arming auto-expires (never a stuck frozen screen), reduced
 * motion gets a plain navigation.
 */

const SNAPSHOT_ID = "mawt-slide-snapshot";
// Dev compiles routes on demand and can take seconds; prod navigations are
// near-instant. The failsafe only exists so a failed navigation never leaves
// a frozen screen.
const ARM_TIMEOUT_MS = 8000;

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

const CurtainContext = createContext<{
  navigateWithCurtain: (href: string) => void;
  takePendingSlide: () => boolean;
  isSlideArmed: boolean;
  releaseSlide: () => void;
}>({
  navigateWithCurtain: () => {},
  takePendingSlide: () => false,
  isSlideArmed: false,
  releaseSlide: () => {},
});

export const useCurtainTransition = () => useContext(CurtainContext);

export function CurtainTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const pendingRef = useRef(false);
  const [isSlideArmed, setIsSlideArmed] = useState(false);

  const releaseSlide = useCallback(() => {
    removeSnapshot();
    pendingRef.current = false;
    setIsSlideArmed(false);
  }, []);

  const navigateWithCurtain = useCallback(
    (href: string) => {
      if (shouldReduceMotion) {
        router.push(href);
        return;
      }
      pendingRef.current = true;
      createSnapshot();
      setIsSlideArmed(true);
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

  // Failsafe: a navigation that never lands must not leave the screen frozen.
  useEffect(() => {
    if (!isSlideArmed) return;
    const t = setTimeout(releaseSlide, ARM_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [isSlideArmed, releaseSlide]);

  return (
    <CurtainContext.Provider
      value={{ navigateWithCurtain, takePendingSlide, isSlideArmed, releaseSlide }}
    >
      {children}
    </CurtainContext.Provider>
  );
}
