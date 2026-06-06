import { useState, useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { subscribeNewsletter } from "@/lib/actions";

interface NewsletterFormProps {
  dict?: {
    title: string;
    description: string;
    placeholder: string;
    success: string;
  };
}

export function NewsletterForm({ dict }: NewsletterFormProps) {
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, null);
  const [email, setEmail] = useState("");

  const labels = dict || {
    title: "Newsletter",
    description: "Get the latest insights on technical execution and operational speed.",
    placeholder: "Email address",
    success: "Thank you for subscribing."
  };

  const status = state?.success ? "success" : isPending ? "submitting" : "idle";

  useEffect(() => {
    if (state?.success) {
      setEmail("");
    }
  }, [state]);

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
              className="flex items-center gap-3 py-4 text-brand-teal"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center">
                <Check size={12} />
              </div>
              <span className="text-sm font-normal">{labels.success}</span>
              <button 
                type="button"
                onClick={() => window.location.reload()} // Simplest way to reset form state in server actions for now
                className="ml-auto text-[11px] text-black/40 hover:text-black uppercase tracking-widest transition-colors"
              >
                Reset
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
              <div className="relative">
                <input
                  required
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={labels.placeholder}
                  disabled={status === "submitting"}
                  className="w-full bg-neutral-50 border border-black/5 px-4 py-4 text-sm font-normal focus:outline-none focus:border-black/20 transition-all focus:bg-white disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  aria-label={labels.title}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black text-white rounded-sm hover:bg-neutral-800 transition-all disabled:bg-neutral-400 group"
                >
                  {status === "submitting" ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </div>
              {state?.error && (
                <motion.p 
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
