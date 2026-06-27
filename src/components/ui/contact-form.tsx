"use client";

import { useState, useActionState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitContactForm, type ContactFormState } from "@/lib/actions";

interface ContactFormProps {
  dict?: {
    name: string;
    email: string;
    message: string;
    submit: string;
    success: string;
    error: string;
  };
}

type FormStep = 1 | 2 | 3;

// BUG-023: Use the typed state from actions.ts
type ClientErrors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm({ dict }: ContactFormProps) {
  const [step, setStep] = useState<FormStep>(1);
  // BUG-023: Typed action state
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Strategy",
    timeline: "3-6 months",
    message: "",
  });
  // BUG-006: Client-side per-step errors
  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  // BUG-015: Track success locally so we can reset without reload
  const [submitted, setSubmitted] = useState(false);

  const labels = dict || {
    name: "Name",
    email: "Email",
    message: "Project Details",
    submit: "Send Message",
    success: "Message sent.",
    error: "Something went wrong.",
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (name in clientErrors) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof ClientErrors];
        return next;
      });
    }
  };

  // BUG-006: Validate each step before advancing
  const validateStep1 = (): boolean => {
    const errors: ClientErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Please enter your full name (at least 2 characters).";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: ClientErrors = {};
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "Please describe your project (at least 10 characters).";
    }
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step === 1 && !validateStep1()) return;
    if (step < 3) {
      setStep((prev) => (prev + 1) as FormStep);
    }
  };

  // BUG-015: Reset form without window.location.reload()
  const handleReset = useCallback(() => {
    setStep(1);
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      service: "Strategy",
      timeline: "3-6 months",
      message: "",
    });
    setClientErrors({});
  }, []);

  const status = state?.success
    ? "success"
    : isPending
    ? "submitting"
    : state?.error
    ? "error"
    : "idle";

  // Track success from server state
  if (status === "success" && !submitted) {
    setSubmitted(true);
  }

  const stepVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      filter: "blur(10px)",
    }),
    animate: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      filter: "blur(10px)",
    }),
  };

  // BUG-007: Extract server-side field errors
  const serverFieldError = (field: "name" | "email" | "service" | "timeline" | "message") =>
    state?.details?.[field]?.[0];

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col gap-8 items-center justify-center py-24 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-[#75DAB4] flex items-center justify-center text-black">
          <Check size={40} />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-3xl font-normal tracking-tighter text-black">{labels.success}</h3>
          <p className="text-neutral-500 font-normal text-lg">
            We&apos;ve received your request and will reach out shortly.
          </p>
        </div>
        {/* BUG-015: Use state reset, not reload */}
        <button
          type="button"
          onClick={handleReset}
          className="px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-all text-sm font-normal uppercase tracking-widest mt-4"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-12 text-black">
      {/* Progress Indicator */}
      <div className="flex items-center gap-4" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 transition-all duration-500",
              s <= step ? "bg-black" : "bg-black/5"
            )}
          />
        ))}
      </div>

      <form action={formAction} className="relative overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait" custom={step}>
          <motion.div
            key={step}
            custom={step}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-12"
          >
            {step === 1 && (
              <div className="flex flex-col gap-12">
                <h2 className="text-3xl font-normal tracking-tighter text-black">
                  Let&apos;s start with the basics
                </h2>
                <div className="grid md:grid-cols-2 gap-12">
                  {/* BUG-012: htmlFor + id association */}
                  <div className="flex flex-col gap-4">
                    <label
                      htmlFor="contact-name"
                      className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]"
                    >
                      {labels.name}
                    </label>
                    <input
                      id="contact-name"
                      required
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      aria-describedby={clientErrors.name || serverFieldError("name") ? "contact-name-error" : undefined}
                      aria-invalid={!!(clientErrors.name || serverFieldError("name"))}
                      className={cn(
                        "w-full py-4 border-b focus:outline-none bg-transparent transition-colors font-normal text-xl text-black placeholder:text-neutral-400",
                        clientErrors.name || serverFieldError("name")
                          ? "border-red-400 focus:border-red-500"
                          : "border-black/10 focus:border-black"
                      )}
                      placeholder="Your name"
                    />
                    {(clientErrors.name || serverFieldError("name")) && (
                      <p id="contact-name-error" className="text-sm text-red-500 font-normal">
                        {clientErrors.name || serverFieldError("name")}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <label
                      htmlFor="contact-email"
                      className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]"
                    >
                      {labels.email}
                    </label>
                    <input
                      id="contact-email"
                      required
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      aria-describedby={clientErrors.email || serverFieldError("email") ? "contact-email-error" : undefined}
                      aria-invalid={!!(clientErrors.email || serverFieldError("email"))}
                      className={cn(
                        "w-full py-4 border-b focus:outline-none bg-transparent transition-colors font-normal text-xl text-black placeholder:text-neutral-400",
                        clientErrors.email || serverFieldError("email")
                          ? "border-red-400 focus:border-red-500"
                          : "border-black/10 focus:border-black"
                      )}
                      placeholder="hello@company.com"
                    />
                    {(clientErrors.email || serverFieldError("email")) && (
                      <p id="contact-email-error" className="text-sm text-red-500 font-normal">
                        {clientErrors.email || serverFieldError("email")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-12">
                <h2 className="text-3xl font-normal tracking-tighter text-black">
                  What are you looking for?
                </h2>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="flex flex-col gap-4">
                    {/* BUG-012: htmlFor + id */}
                    <label
                      htmlFor="contact-service"
                      className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]"
                    >
                      Service
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full py-4 border-b border-black/10 focus:border-black focus:outline-none bg-transparent transition-colors font-normal text-xl appearance-none text-black"
                    >
                      <option className="text-black bg-white">Strategy</option>
                      <option className="text-black bg-white">Development</option>
                      <option className="text-black bg-white">Design</option>
                      <option className="text-black bg-white">AI Automation</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-4">
                    {/* BUG-012: htmlFor + id */}
                    <label
                      htmlFor="contact-timeline"
                      className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]"
                    >
                      Timeline
                    </label>
                    <select
                      id="contact-timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full py-4 border-b border-black/10 focus:border-black focus:outline-none bg-transparent transition-colors font-normal text-xl appearance-none text-black"
                    >
                      <option className="text-black bg-white">Under 3 months</option>
                      <option className="text-black bg-white">3-6 months</option>
                      <option className="text-black bg-white">Ongoing</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-12">
                <h2 className="text-3xl font-normal tracking-tighter text-black">
                  Anything else we should know?
                </h2>
                <div className="flex flex-col gap-4">
                  {/* BUG-012: htmlFor + id */}
                  <label
                    htmlFor="contact-message"
                    className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]"
                  >
                    {labels.message}
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    aria-describedby={clientErrors.message || serverFieldError("message") ? "contact-message-error" : undefined}
                    aria-invalid={!!(clientErrors.message || serverFieldError("message"))}
                    className={cn(
                      "w-full py-4 border-b focus:outline-none bg-transparent transition-colors font-normal text-xl resize-none text-black placeholder:text-neutral-400",
                      clientErrors.message || serverFieldError("message")
                        ? "border-red-400 focus:border-red-500"
                        : "border-black/10 focus:border-black"
                    )}
                    placeholder="Tell us about your project challenges..."
                  />
                  {(clientErrors.message || serverFieldError("message")) && (
                    <p id="contact-message-error" className="text-sm text-red-500 font-normal">
                      {clientErrors.message || serverFieldError("message")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* BUG-007: General server error (non-field) */}
            {state?.error && !state.details && (
              <p className="text-sm text-red-500 font-normal">{state.error}</p>
            )}

            {/* Hidden fields for all steps: always include name/email/service/timeline so
                the server receives them even though earlier steps are not re-rendered. */}
            {step !== 1 && (
              <>
                <input type="hidden" name="name" value={formData.name} />
                <input type="hidden" name="email" value={formData.email} />
              </>
            )}
            {step !== 2 && (
              <>
                <input type="hidden" name="service" value={formData.service} />
                <input type="hidden" name="timeline" value={formData.timeline} />
              </>
            )}

            <div className="flex items-center gap-6 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev - 1) as FormStep)}
                  className="flex items-center justify-center w-14 h-14 border border-black/10 hover:border-black transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-black text-white text-sm font-normal transition-all uppercase tracking-widest hover:bg-neutral-900 group"
                >
                  Continue
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  onClick={() => validateStep3()}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-black text-white text-sm font-normal disabled:bg-neutral-400 transition-all uppercase tracking-widest hover:bg-neutral-900 group"
                >
                  {status === "submitting" ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-label="Sending..." />
                  ) : (
                    <>
                      {labels.submit}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
    </div>
  );
}
