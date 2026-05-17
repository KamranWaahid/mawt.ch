"use client";

import { useState, useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitContactForm } from "@/lib/actions";

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

export function ContactForm({ dict }: ContactFormProps) {
  const [step, setStep] = useState<FormStep>(1);
  const [state, formAction, isPending] = useActionState(submitContactForm, null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Strategy",
    timeline: "3-6 months",
    message: ""
  });

  useEffect(() => {
    if (state?.success) {
      // Logic for success already handled by conditional return below
    }
  }, [state]);

  const labels = dict || {
    name: "Name",
    email: "Email",
    message: "Project Details",
    submit: "Send Message",
    success: "Message sent.",
    error: "Something went wrong."
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(prev => (prev + 1) as FormStep);
    }
  };

  const status = state?.success ? "success" : isPending ? "submitting" : state?.error ? "error" : "idle";

  const stepVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      filter: "blur(10px)"
    }),
    animate: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)"
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      filter: "blur(10px)"
    })
  };

  if (status === "success") {
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
          <p className="text-neutral-500 font-normal text-lg">We've received your request and will reach out shortly.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 border border-black text-black hover:bg-black hover:text-white transition-all text-sm font-normal uppercase tracking-widest mt-4"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Progress Indicator */}
      <div className="flex items-center gap-4">
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
            {/* ... (fields remain the same, ensuring names match schema) */}
            {step === 1 && (
              <div className="flex flex-col gap-12">
                <h2 className="text-3xl font-normal tracking-tighter">Let's start with the basics</h2>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="flex flex-col gap-4">
                    <label className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]">{labels.name}</label>
                    <input 
                      required
                      name="name"
                      type="text" 
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full py-4 border-b border-black/10 focus:border-black focus:outline-none bg-transparent transition-colors font-normal text-xl" 
                      placeholder="Your name" 
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]">{labels.email}</label>
                    <input 
                      required
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full py-4 border-b border-black/10 focus:border-black focus:outline-none bg-transparent transition-colors font-normal text-xl" 
                      placeholder="hello@company.com" 
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-12">
                <h2 className="text-3xl font-normal tracking-tighter">What are you looking for?</h2>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="flex flex-col gap-4">
                    <label className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]">Service</label>
                    <select 
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full py-4 border-b border-black/10 focus:border-black focus:outline-none bg-transparent transition-colors font-normal text-xl appearance-none"
                    >
                      <option>Strategy</option>
                      <option>Development</option>
                      <option>Design</option>
                      <option>AI Automation</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]">Timeline</label>
                    <select 
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full py-4 border-b border-black/10 focus:border-black focus:outline-none bg-transparent transition-colors font-normal text-xl appearance-none"
                    >
                      <option>Under 3 months</option>
                      <option>3-6 months</option>
                      <option>Ongoing</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-12">
                <h2 className="text-3xl font-normal tracking-tighter">Anything else we should know?</h2>
                <div className="flex flex-col gap-4">
                  <label className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]">{labels.message}</label>
                  <textarea 
                    required
                    name="message"
                    rows={4} 
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full py-4 border-b border-black/10 focus:border-black focus:outline-none bg-transparent transition-colors font-normal text-xl resize-none" 
                    placeholder="Tell us about your project challenges..." 
                  />
                </div>
              </div>
            )}

            {state?.error && (
              <p className="text-sm text-red-500 font-normal">{state.error}</p>
            )}

            <div className="flex items-center gap-6 mt-8">
              {step > 1 && (
                <button 
                  type="button"
                  onClick={() => setStep(prev => (prev - 1) as FormStep)}
                  className="flex items-center justify-center w-14 h-14 border border-black/10 hover:border-black transition-colors"
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
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-black text-white text-sm font-normal disabled:bg-neutral-400 transition-all uppercase tracking-widest hover:bg-neutral-900 group"
                >
                  {status === "submitting" ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

