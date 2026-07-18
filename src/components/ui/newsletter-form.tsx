"use client";
// BUG-014 fix: Added "use client" directive — this component uses React hooks.

import { useState, useActionState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { subscribeNewsletter, type NewsletterFormState } from "@/lib/actions";

interface NewsletterFormProps {
  dict?: {
    title: string;
    description: string;
    placeholder: string;
    success: string;
  };
  lang?: "en" | "fr";
}

export function NewsletterForm({ dict, lang = "en" }: NewsletterFormProps) {
  // BUG-023: Typed action state
  const [state, formAction, isPending] = useActionState<NewsletterFormState, FormData>(
    subscribeNewsletter,
    null
  );
  const [email, setEmail] = useState("");
  // BUG-015: Track success locally to reset without page reload
  const [localSuccess, setLocalSuccess] = useState(false);

  const isFr = lang === "fr";
  const labels = dict || {
    title: "Newsletter",
    description: isFr
      ? "Nos notes de terrain sur l'IA en entreprise et l'automatisation. Concret, pas théorique."
      : "Get our field notes on AI in business and automation. Practical, not theoretical.",
    placeholder: isFr ? "Adresse e-mail" : "Email address",
    success: isFr ? "Merci de votre inscription." : "Thank you for subscribing.",
  };

  const isSuccess = state?.success || localSuccess;
  const status = isSuccess ? "success" : isPending ? "submitting" : "idle";

  // Track server success into local state
  if (state?.success && !localSuccess) {
    setLocalSuccess(true);
  }

  // BUG-015: Reset form state without window.location.reload()
  const handleReset = useCallback(() => {
    setLocalSuccess(false);
    setEmail("");
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-sm font-normal text-black/80">{labels.title}</h4>
      <p className="text-[13px] text-black/40 font-normal leading-relaxed">
        {labels.description}
      </p>

      <div className="relative">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 py-4 text-[#75DAB4]"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#75DAB4]/10 flex items-center justify-center">
                <Check size={12} />
              </div>
              <span className="text-sm font-normal">{labels.success}</span>
              {/* BUG-015: State reset, not page reload */}
              <button
                type="button"
                onClick={handleReset}
                className="ml-auto text-[11px] text-black/40 hover:text-black tracking-wide transition-colors"
              >
                {isFr ? "Réinitialiser" : "Reset"}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              action={formAction}
              className="relative flex flex-col gap-3"
            >
              <input type="hidden" name="lang" value={lang} />
              {/* Honeypot: humans never see or fill this; bots do. The server
                  action drops any submission where it has a value. */}
              <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                <label htmlFor="newsletter-company">Company</label>
                <input
                  id="newsletter-company"
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div className="relative">
                {/* BUG-012: Visually-hidden label for screen readers */}
                <label htmlFor="newsletter-email" className="sr-only">
                  {labels.placeholder}
                </label>
                <input
                  id="newsletter-email"
                  required
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={labels.placeholder}
                  disabled={status === "submitting"}
                  aria-describedby={state?.error ? "newsletter-error" : undefined}
                  className="w-full bg-neutral-50 border border-black/5 px-4 py-3 text-sm font-normal focus:outline-none focus:border-black/20 transition-all focus:bg-white disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  aria-label={isFr ? "S'inscrire à la newsletter" : "Subscribe to newsletter"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black text-white rounded-sm hover:bg-neutral-800 transition-all disabled:bg-neutral-400 group"
                >
                  {status === "submitting" ? (
                    <div
                      className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      aria-label={isFr ? "Envoi en cours…" : "Sending…"}
                    />
                  ) : (
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </div>
              {state?.error && (
                <motion.p
                  id="newsletter-error"
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12px] font-normal text-red-500"
                >
                  {state.error}
                </motion.p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
