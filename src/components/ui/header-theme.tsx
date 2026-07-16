"use client";

import { useEffect } from "react";

/**
 * Forces the fixed site header into a given theme while the host page is
 * mounted ("light" = white text/logo for dark pages). Uses the existing
 * mawt-header-theme event the header already listens to; resets on unmount.
 */
export function HeaderTheme({ theme }: { theme: "light" | "dark" }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("mawt-header-theme", { detail: { theme } }));
    return () => {
      window.dispatchEvent(new CustomEvent("mawt-header-theme", { detail: { theme: null } }));
    };
  }, [theme]);
  return null;
}
