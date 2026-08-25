"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa6";

interface WhatsAppButtonProps {
  dict: {
    /** International format, digits only — no "+", no spaces (wa.me requirement). */
    phone: string;
    label: string;
    ariaLabel: string;
    message: string;
  };
}

/**
 * Floating click-to-chat entry point.
 *
 * Deliberately revealed only after the first screen: the homepage hero is
 * approved and its first-screen appearance must not change, and every internal
 * page hero reads calmer without a badge floating over it. A single scroll
 * threshold keeps that rule uniform instead of special-casing the homepage.
 *
 * Sits below the cookie modal (z-200/201) and the skip link (z-100) so neither
 * is ever obstructed.
 */
const REVEAL_AFTER_PX = 300;

export function WhatsAppButton({ dict }: WhatsAppButtonProps) {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Passive listener on native scroll: Lenis drives window.scrollY, so this
    // observes it rather than competing with it.
    const onScroll = () => setVisible(window.scrollY > REVEAL_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const href = `https://wa.me/${dict.phone}?text=${encodeURIComponent(dict.message)}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dict.ariaLabel}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed bottom-6 right-6 z-[90] flex items-center rounded-full border border-black/10 bg-white/90 p-3.5 text-black shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-colors hover:border-black/20 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <FaWhatsapp className="size-5 shrink-0 text-brand-teal" aria-hidden="true" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm leading-none transition-all duration-300 ease-out group-hover:ml-2.5 group-hover:max-w-[14rem] group-focus-visible:ml-2.5 group-focus-visible:max-w-[14rem]">
            {dict.label}
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
