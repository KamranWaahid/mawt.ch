"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const MEASUREMENT_ID = "G-J3FHJ45Y5L";
const COOKIE_CONSENT_KEY = "mawt-cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4, wired to the site's existing consent model (see
 * cookie-consent.tsx): loads unless the visitor opted for essential-only
 * cookies, same policy as the Meta pixel. page_view is re-fired on App
 * Router client navigations, which gtag's automatic tracking would miss
 * (send_page_view is disabled so views are only reported here).
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    if (localStorage.getItem(COOKIE_CONSENT_KEY) === "essential") return;
    loadedRef.current = true;
    if (!document.getElementById("ga4")) {
      const loader = document.createElement("script");
      loader.id = "ga4";
      loader.async = true;
      loader.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
      document.head.appendChild(loader);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer!.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
      window.gtag("event", "page_view");
    }
  }, []);

  // SPA navigations don't reload the page, so page_view must follow the route.
  const isFirstRoute = useRef(true);
  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }
    window.gtag?.("event", "page_view");
  }, [pathname]);

  return null;
}
