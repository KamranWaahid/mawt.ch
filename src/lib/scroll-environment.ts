/**
 * Scroll environment helpers.
 *
 * Mobile / tablet touch browsers need native momentum scrolling. Lenis wheel
 * smoothing is kept for mouse / trackpad desktops only.
 */

/** True when the primary input is touch (phones & tablets). */
export function prefersNativeScroll(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  // Hover-capable touchscreen laptops still get Lenis (wheel / trackpad).
  // Phones and tablets report hover: none + pointer: coarse.
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}
