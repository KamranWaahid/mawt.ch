"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Cookie, X } from "lucide-react";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

const COOKIE_CONSENT_KEY = "mawt-cookie-consent";

type ConsentChoice = "all" | "essential" | null;

interface CookieConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

const TEXT = {
  en: {
    title: "Cookie Settings",
    description:
      "We use cookies so the site works correctly. Essential cookies cannot be turned off. Analytics cookies help us understand how people use the pages. You can decline them.",
    essential: "Essential Cookies",
    essentialDesc: "Required for the website to function. Cannot be disabled.",
    analytics: "Analytics Cookies",
    analyticsDesc: "Help us understand how visitors interact with our site.",
    acceptAll: "Accept All",
    essentialOnly: "Reject non-essential",
    saveChoice: "Save choices",
    saved: "Preferences saved.",
    close: "Close cookie settings",
    alwaysOn: "Always on",
    optional: "Optional",
    policy: "Cookie policy",
  },
  fr: {
    title: "Paramètres des cookies",
    description:
      "Nous utilisons des cookies pour que le site fonctionne correctement. Les cookies essentiels ne peuvent pas être désactivés. Les cookies analytiques nous aident à comprendre l'usage des pages. Vous pouvez les refuser.",
    essential: "Cookies essentiels",
    essentialDesc: "Nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.",
    analytics: "Cookies analytiques",
    analyticsDesc: "Nous aident à comprendre comment les visiteurs interagissent avec notre site.",
    acceptAll: "Tout accepter",
    essentialOnly: "Refuser les non essentiels",
    saveChoice: "Enregistrer mes choix",
    saved: "Préférences enregistrées.",
    close: "Fermer les paramètres des cookies",
    alwaysOn: "Toujours actifs",
    optional: "Optionnels",
    policy: "Politique relative aux cookies",
  },
};

export function CookieConsentModal({ isOpen, onClose, lang = "en" }: CookieConsentModalProps) {
  const t = lang === "fr" ? TEXT.fr : TEXT.en;
  const [saved, setSaved] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const reduceMotion = useReducedMotion();
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    const current = localStorage.getItem(COOKIE_CONSENT_KEY);
    setAnalyticsEnabled(current === "all");
    setSaved(false);
  }, [isOpen]);

  const persistChoice = useCallback(
    (choice: Exclude<ConsentChoice, null>) => {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice);
      if (choice === "essential") {
        document.cookie = "_ga=; Max-Age=0; path=/";
        document.cookie = "_gid=; Max-Age=0; path=/";
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 900);
    },
    [onClose],
  );

  const handleSaveCustom = () => {
    persistChoice(analyticsEnabled ? "all" : "essential");
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
            className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[max(1.25rem,env(safe-area-inset-left))] right-[max(1.25rem,env(safe-area-inset-right))] z-[201] max-h-[calc(100dvh-2.5rem)] overflow-y-auto overscroll-contain border border-white/10 bg-[#161616] p-6 text-white shadow-2xl sm:p-7 md:bottom-[max(2rem,env(safe-area-inset-bottom))] md:left-auto md:right-[max(2rem,env(safe-area-inset-right))] md:max-w-md md:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <DarkPageIcon icon={Cookie} />
                <h2
                  id="cookie-modal-title"
                  className="text-[18px] font-medium tracking-tight text-white"
                >
                  {t.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mb-7 text-[14px] font-normal leading-relaxed text-white/55">
              {t.description}{" "}
              <Link
                href={`/${lang}/cookies`}
                onClick={onClose}
                className="text-white/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              >
                {t.policy}
              </Link>
            </p>

            <div className="mb-8 space-y-3">
              <div className="flex items-start justify-between gap-4 border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <p className="text-[14px] font-normal text-white">{t.essential}</p>
                  <p className="mt-1 text-[12px] font-normal leading-relaxed text-white/40">
                    {t.essentialDesc}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-normal tracking-wide text-white/45">
                  {t.alwaysOn}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 border border-white/10 bg-white/[0.03] p-4">
                <div className="pr-2">
                  <p className="text-[14px] font-normal text-white">{t.analytics}</p>
                  <p className="mt-1 text-[12px] font-normal leading-relaxed text-white/40">
                    {t.analyticsDesc}
                  </p>
                  <p className="mt-2 text-[11px] font-normal text-white/30">{t.optional}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analyticsEnabled}
                  aria-label={t.analytics}
                  onClick={() => setAnalyticsEnabled((value) => !value)}
                  className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 ${
                    analyticsEnabled
                      ? "border-[#75DAB4]/50 bg-[#75DAB4]/25"
                      : "border-white/20 bg-white/[0.06]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
                      analyticsEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {saved ? (
              <p className="py-2 text-center text-[13px] font-normal text-[#75DAB4]">
                {t.saved}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => persistChoice("all")}
                  className="min-h-11 w-full border border-white bg-white py-3 text-[13px] font-normal text-black transition-colors hover:bg-transparent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                >
                  {t.acceptAll}
                </button>
                <button
                  type="button"
                  onClick={() => persistChoice("essential")}
                  className="min-h-11 w-full border border-white/20 py-3 text-[13px] font-normal text-white/80 transition-colors hover:border-white/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                >
                  {t.essentialOnly}
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="min-h-11 w-full py-2 text-[12px] font-normal text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                >
                  {t.saveChoice}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Hook to manage consent state and banner visibility */
export function useCookieConsent() {
  const [showModal, setShowModal] = useState(false);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  const getConsent = useCallback((): ConsentChoice => {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentChoice) || null;
  }, []);

  return { showModal, openModal, closeModal, getConsent };
}
