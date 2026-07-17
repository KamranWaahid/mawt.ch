"use client";

import { useState, useActionState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
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
    successBody: string;
    reset: string;
    stepBasics: string;
    stepProject: string;
    stepDetails: string;
    service: string;
    timeline: string;
    serviceOptions: { value: string; label: string }[];
    timelineOptions: { value: string; label: string }[];
    placeholders: {
      name: string;
      email: string;
      message: string;
    };
    validation: {
      name: string;
      email: string;
      message: string;
    };
    back: string;
    continue: string;
    sending: string;
  };
  lang?: "en" | "fr";
  theme?: "light" | "dark";
}

type FormStep = 1 | 2 | 3;

// BUG-023: Use the typed state from actions.ts
type ClientErrors = Partial<Record<"name" | "email" | "message", string>>;

const defaultLabels = {
  name: "Name",
  email: "Email",
  message: "Project details",
  submit: "Send message",
  success: "Message sent.",
  error: "Something went wrong.",
  successBody: "We've received your request and will reach out shortly.",
  reset: "Send another message",
  stepBasics: "Let's start with the basics",
  stepProject: "What are you looking for?",
  stepDetails: "Anything else we should know?",
  service: "Service",
  timeline: "Timeline",
  serviceOptions: [
    { value: "Strategy", label: "Strategy" },
    { value: "Development", label: "Development" },
    { value: "Design", label: "Design" },
    { value: "AI Automation", label: "AI automation" },
  ],
  timelineOptions: [
    { value: "Under 3 months", label: "Under 3 months" },
    { value: "3-6 months", label: "3-6 months" },
    { value: "Ongoing", label: "Ongoing" },
  ],
  placeholders: {
    name: "Your name",
    email: "hello@company.com",
    message: "Tell us about your project challenges...",
  },
  validation: {
    name: "Please enter your full name (at least 2 characters).",
    email: "Please enter a valid email address.",
    message: "Please describe your project (at least 10 characters).",
  },
  back: "Go back",
  continue: "Continue",
  sending: "Sending...",
};

export function ContactForm({ dict, lang = "en", theme = "light" }: ContactFormProps) {
  const prefersReducedMotion = useReducedMotion();
  const labels = {
    ...defaultLabels,
    ...dict,
    placeholders: {
      ...defaultLabels.placeholders,
      ...dict?.placeholders,
    },
    validation: {
      ...defaultLabels.validation,
      ...dict?.validation,
    },
    serviceOptions: dict?.serviceOptions?.length ? dict.serviceOptions : defaultLabels.serviceOptions,
    timelineOptions: dict?.timelineOptions?.length ? dict.timelineOptions : defaultLabels.timelineOptions,
  };
  const isDark = theme === "dark";
  const fieldLabelClass = isDark ? "text-[13px] font-normal text-white/42" : "text-[13px] font-normal text-black/42";
  const fieldInputBase = cn(
    "w-full bg-transparent py-3.5 text-[16px] font-normal border-b transition-colors duration-300 focus:outline-none md:text-[17px]",
    isDark ? "text-white placeholder:text-white/25" : "text-black placeholder:text-black/30",
  );
  const fieldBorderClass = isDark ? "border-white/12 focus:border-white" : "border-black/12 focus:border-black";
  const errorClass = isDark ? "text-[13px] font-normal text-red-300" : "text-[13px] font-normal text-red-600";
  const primaryButtonClass = isDark
    ? "group inline-flex w-fit items-center gap-2 border border-white/20 px-8 py-4 text-sm font-normal text-white/85 transition-colors duration-300 hover:border-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-white/85"
    : "group inline-flex w-fit items-center gap-2 border border-black px-8 py-4 text-sm font-normal text-black transition-colors duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-black";
  const secondaryButtonClass = isDark
    ? "inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center border border-white/15 text-white/80 transition-colors duration-300 hover:border-white hover:text-white"
    : "inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center border border-black/15 text-black transition-colors duration-300 hover:border-black";
  const [step, setStep] = useState<FormStep>(1);
  // BUG-023: Typed action state
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: labels.serviceOptions[0]?.value || "Strategy",
    timeline: labels.timelineOptions[1]?.value || labels.timelineOptions[0]?.value || "3-6 months",
    message: "",
  });
  // BUG-006: Client-side per-step errors
  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  // "Send another message": `state` keeps success=true forever, so submitted
  // is DERIVED — success is shown until the user dismisses THIS state object.
  // A new submission produces a new state object and shows success again.
  const [dismissedState, setDismissedState] = useState<ContactFormState>(null);
  const submitted = Boolean(state?.success) && dismissedState !== state;

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
      errors.name = labels.validation.name;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = labels.validation.email;
    }
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: ClientErrors = {};
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = labels.validation.message;
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
  const handleReset = () => {
    setStep(1);
    setDismissedState(state);
    setFormData({
      name: "",
      email: "",
      service: labels.serviceOptions[0]?.value || "Strategy",
      timeline: labels.timelineOptions[1]?.value || labels.timelineOptions[0]?.value || "3-6 months",
      message: "",
    });
    setClientErrors({});
  };

  const status = state?.success
    ? "success"
    : isPending
    ? "submitting"
    : state?.error
    ? "error"
    : "idle";

  const stepVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: (direction: number) => ({
          x: direction > 0 ? 24 : -24,
          opacity: 0,
        }),
        animate: {
          x: 0,
          opacity: 1,
        },
        exit: (direction: number) => ({
          x: direction > 0 ? -24 : 24,
          opacity: 0,
        }),
      };

  // BUG-007: Extract server-side field errors
  const serverFieldError = (field: "name" | "email" | "service" | "timeline" | "message") =>
    state?.details?.[field]?.[0];

  if (submitted) {
    return (
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-start gap-8 py-4"
        role="status"
        aria-live="polite"
      >
        <div className={cn("flex h-11 w-11 items-center justify-center border", isDark ? "border-white/20 text-white" : "border-black text-black")}>
          <Check size={20} strokeWidth={1.75} />
        </div>
        <div className="flex max-w-[36ch] flex-col gap-3">
          <h3 className={cn("text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-[1.1] tracking-tight", isDark ? "text-white" : "text-neutral-900")}>
            {labels.success}
          </h3>
          <p className={cn("text-[15px] font-normal leading-relaxed", isDark ? "text-white/55" : "text-black/50")}>
            {labels.successBody}
          </p>
        </div>
        {/* BUG-015: Use state reset, not reload */}
        <button type="button" onClick={handleReset} className={primaryButtonClass}>
          {labels.reset}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-10", isDark ? "text-white" : "text-black")}>
      {/* Progress Indicator */}
      <div
        className="flex items-center gap-3"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={3}
        aria-label={`Step ${step} of 3`}
      >
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "h-px flex-1 transition-colors duration-500",
              s <= step ? (isDark ? "bg-white" : "bg-black") : (isDark ? "bg-white/12" : "bg-black/12")
            )}
          />
        ))}
      </div>

      <form action={formAction} className="relative min-h-[320px] overflow-hidden">
        <AnimatePresence mode="wait" custom={step}>
          <motion.div
            key={step}
            custom={step}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-10"
          >
            {step === 1 && (
              <div className="flex flex-col gap-8">
                <h3 className={cn("text-[15px] font-normal", isDark ? "text-white/55" : "text-black/55")}>
                  {labels.stepBasics}
                </h3>
                <div className="grid gap-8 md:grid-cols-2 md:gap-10">
                  {/* BUG-012: htmlFor + id association */}
                  <div className="flex flex-col gap-3">
                    <label htmlFor="contact-name" className={fieldLabelClass}>
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
                        fieldInputBase,
                        clientErrors.name || serverFieldError("name")
                          ? "border-red-400 focus:border-red-300"
                          : fieldBorderClass
                      )}
                      placeholder={labels.placeholders.name}
                    />
                    {(clientErrors.name || serverFieldError("name")) && (
                      <p id="contact-name-error" className={errorClass}>
                        {clientErrors.name || serverFieldError("name")}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label htmlFor="contact-email" className={fieldLabelClass}>
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
                        fieldInputBase,
                        clientErrors.email || serverFieldError("email")
                          ? "border-red-400 focus:border-red-300"
                          : fieldBorderClass
                      )}
                      placeholder={labels.placeholders.email}
                    />
                    {(clientErrors.email || serverFieldError("email")) && (
                      <p id="contact-email-error" className={errorClass}>
                        {clientErrors.email || serverFieldError("email")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-8">
                <h3 className={cn("text-[15px] font-normal", isDark ? "text-white/55" : "text-black/55")}>
                  {labels.stepProject}
                </h3>
                <div className="grid gap-10 md:grid-cols-2">
                  <fieldset className="flex flex-col gap-4 border-0 p-0">
                    <legend className={fieldLabelClass}>{labels.service}</legend>
                    <div className="flex flex-col" role="radiogroup" aria-label={labels.service}>
                      {labels.serviceOptions.map((option) => {
                        const selected = formData.service === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, service: option.value }))
                            }
                            className={cn(
                              "flex items-center justify-between gap-4 border-b py-[14px] text-left text-[15px] font-normal transition-colors duration-300",
                              isDark ? "border-white/10" : "border-black/10",
                              selected ? (isDark ? "text-white" : "text-black") : (isDark ? "text-white/45 hover:text-white" : "text-black/45 hover:text-black")
                            )}
                          >
                            {option.label}
                            <span
                              className={cn(
                                "h-2 w-2 shrink-0 rounded-full transition-opacity duration-300",
                                selected ? (isDark ? "bg-white opacity-100" : "bg-black opacity-100") : "opacity-0"
                              )}
                              aria-hidden
                            />
                          </button>
                        );
                      })}
                    </div>
                    <input type="hidden" name="service" value={formData.service} />
                  </fieldset>

                  <fieldset className="flex flex-col gap-4 border-0 p-0">
                    <legend className={fieldLabelClass}>{labels.timeline}</legend>
                    <div className="flex flex-col" role="radiogroup" aria-label={labels.timeline}>
                      {labels.timelineOptions.map((option) => {
                        const selected = formData.timeline === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, timeline: option.value }))
                            }
                            className={cn(
                              "flex items-center justify-between gap-4 border-b py-[14px] text-left text-[15px] font-normal transition-colors duration-300",
                              isDark ? "border-white/10" : "border-black/10",
                              selected ? (isDark ? "text-white" : "text-black") : (isDark ? "text-white/45 hover:text-white" : "text-black/45 hover:text-black")
                            )}
                          >
                            {option.label}
                            <span
                              className={cn(
                                "h-2 w-2 shrink-0 rounded-full transition-opacity duration-300",
                                selected ? (isDark ? "bg-white opacity-100" : "bg-black opacity-100") : "opacity-0"
                              )}
                              aria-hidden
                            />
                          </button>
                        );
                      })}
                    </div>
                    <input type="hidden" name="timeline" value={formData.timeline} />
                  </fieldset>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-8">
                <h3 className={cn("text-[15px] font-normal", isDark ? "text-white/55" : "text-black/55")}>
                  {labels.stepDetails}
                </h3>
                <div className="flex flex-col gap-3">
                  {/* BUG-012: htmlFor + id */}
                  <label htmlFor="contact-message" className={fieldLabelClass}>
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
                      fieldInputBase,
                      "resize-none",
                      clientErrors.message || serverFieldError("message")
                        ? "border-red-400 focus:border-red-300"
                        : fieldBorderClass
                    )}
                    placeholder={labels.placeholders.message}
                  />
                  {(clientErrors.message || serverFieldError("message")) && (
                    <p id="contact-message-error" className={errorClass}>
                      {clientErrors.message || serverFieldError("message")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Server errors: always show the summary, and list field-level
                messages too — a name/email error returned while the user sits
                on step 3 was otherwise invisible (the fields live on step 1). */}
            {state?.error && !submitted && (
              <div className="flex flex-col gap-1.5" role="alert">
                <p className={errorClass}>{state.error}</p>
                {state.details &&
                  Object.values(state.details)
                    .flat()
                    .map((msg) => (
                      <p key={msg} className={errorClass}>
                        {msg}
                      </p>
                    ))}
              </div>
            )}

            {/* Honeypot: invisible to humans, tempting for bots. The server
                silently drops submissions that fill it. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] top-auto h-px w-px opacity-0"
            />

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

            <div className="mt-2 flex items-center gap-3">
              <input type="hidden" name="lang" value={lang} />
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev - 1) as FormStep)}
                  className={secondaryButtonClass}
                  aria-label={labels.back}
                >
                  <ArrowLeft size={16} strokeWidth={1.5} />
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={handleContinue} className={primaryButtonClass}>
                  {labels.continue}
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  onClick={(e) => {
                    if (!validateStep3()) e.preventDefault();
                  }}
                  className={primaryButtonClass}
                >
                  {status === "submitting" ? (
                    <span className="flex items-center gap-3" aria-label={labels.sending}>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                      {labels.sending}
                    </span>
                  ) : (
                    <>
                      {labels.submit}
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
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
