"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * Locks page scroll while `locked` is true. Stops Lenis when available and
 * sets overflow:hidden on html/body so native/trackpad scroll cannot continue
 * under menus, modals, and drawers. Always restores on unlock/unmount.
 */
export function useBodyScrollLock(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    lenis?.stop();

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      lenis?.start();
    };
  }, [locked, lenis]);
}
