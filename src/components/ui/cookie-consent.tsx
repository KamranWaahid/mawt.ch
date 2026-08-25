"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Cookie } from "lucide-react";

const COOKIE_CONSENT_KEY = "mawt-cookie-consent";

type ConsentChoice = "all" | "essential" | null;

interface CookieConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

const TEXT = {
  en: {
    title: "Cookie settings",
    description:
      "We use cookies to make this site work properly. Essential cookies are always on. Analytics cookies help us understand how visitors use the site, but only if you allow them.",
    essential: "Essential cookies",
    essentialDesc: "Required for the site to work. These can't be turned off.",
    analytics: "Analytics cookies",
    analyticsDesc: "Help us understand how visitors use our site.",
    acceptAll: "Accept all",
    essentialOnly: "Reject non-essential cookies",
    saved: "Preferences saved.",
    close: "Close cookie settings",
  },
  fr: {
    title: "Paramètres des cookies",
    description:
      "Nous utilisons des cookies pour que ce site fonctionne correctement. Les cookies essentiels sont toujours actifs. Les cookies analytiques nous aident à comprendre comment les visiteurs utilisent le site, mais seulement si vous les acceptez.",
    essential: "Cookies essentiels",
    essentialDesc: "Nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.",
    analytics: "Cookies analytiques",
    analyticsDesc: "Nous aident à comprendre comment les visiteurs utilisent notre site.",
    acceptAll: "Tout accepter",
    essentialOnly: "Refuser les cookies non essentiels",
    saved: "Préférences enregistrées.",
    close: "Fermer les paramètres des cookies",
  },
};

export function CookieConsentModal({ isOpen, onClose, lang = "en" }: CookieConsentModalProps) {
  const t = lang === "fr" ? TEXT.fr : TEXT.en;
  const [saved, setSaved] = useState(false);

  const handleChoice = useCallback(
    (choice: ConsentChoice) => {
      if (choice) {
        localStorage.setItem(COOKIE_CONSENT_KEY, choice);
        // Remove analytics cookies if user chose essential only
        if (choice === "essential") {
          document.cookie = "_ga=; Max-Age=0; path=/";
          document.cookie = "_gid=; Max-Age=0; path=/";
          document.cookie = "_fbp=; Max-Age=0; path=/";
          document.cookie = "_fbc=; Max-Age=0; path=/";
        }
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1000);
    },
    [onClose]
  );

  // Trap focus inside modal when open
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-sm z-[201] bg-white border border-black/10 shadow-2xl p-8 max-h-[calc(100dvh-3rem)] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <Cookie size={18} className="text-[#75DAB4]" />
                <h2 id="cookie-modal-title" className="text-lg font-normal tracking-tight text-black">
                  {t.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="text-neutral-400 hover:text-black transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-neutral-500 font-normal leading-relaxed mb-6">
              {t.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-sm">
                <div className="w-4 h-4 rounded-sm bg-black flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-black">{t.essential}</p>
                  <p className="text-xs text-neutral-400 font-normal mt-0.5">{t.essentialDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-sm">
                <div className="w-4 h-4 rounded-sm border border-black/20 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-black">{t.analytics}</p>
                  <p className="text-xs text-neutral-400 font-normal mt-0.5">{t.analyticsDesc}</p>
                </div>
              </div>
            </div>

            {saved ? (
              <p className="text-sm text-[#75DAB4] font-normal text-center py-2">{t.saved}</p>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleChoice("all")}
                  className="w-full py-2.5 bg-black text-white text-sm font-medium tracking-tight hover:bg-neutral-800 transition-colors"
                >
                  {t.acceptAll}
                </button>
                <button
                  type="button"
                  onClick={() => handleChoice("essential")}
                  className="w-full py-2.5 border border-black/10 text-black text-sm font-medium tracking-tight hover:bg-neutral-50 hover:border-black transition-colors"
                >
                  {t.essentialOnly}
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

  /** Returns the current consent choice or null if not set */
  const getConsent = useCallback((): ConsentChoice => {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentChoice) || null;
  }, []);

  return { showModal, openModal, closeModal, getConsent };
}
