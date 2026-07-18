"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";
import { prefersNativeScroll } from "@/lib/scroll-environment";

/**
 * Locks page scroll while `locked` is true (menus, modals, drawers).
 *
 * - With Lenis: stops the instance + overflow hidden.
 * - On native/iOS: uses position:fixed scroll freeze so background momentum
 *   cannot continue under the overlay (overflow:hidden alone is not enough).
 *
 * Always restores on unlock / unmount.
 */
export function useBodyScrollLock(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const useFixedFreeze = prefersNativeScroll();

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;
    const prevBodyLeft = body.style.left;
    const prevBodyRight = body.style.right;
    const prevBodyPaddingRight = body.style.paddingRight;

    // Keep page width stable when the scrollbar disappears (classic
    // scrollbars on Windows): otherwise content shifts ~17px on lock/unlock.
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (!useFixedFreeze && scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    if (useFixedFreeze) {
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
    }

    lenis?.stop();

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPaddingRight;

      if (useFixedFreeze) {
        body.style.position = prevBodyPosition;
        body.style.top = prevBodyTop;
        body.style.left = prevBodyLeft;
        body.style.right = prevBodyRight;
        body.style.width = prevBodyWidth;
        window.scrollTo(0, scrollY);
      }

      lenis?.start();
    };
  }, [locked, lenis]);
}
