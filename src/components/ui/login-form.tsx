"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Lock } from "lucide-react";

interface LoginFormProps {
  dict: {
    title: string;
    subtitle: string;
    fieldLabel: string;
    placeholder: string;
    button: string;
    error: string;
    success: string;
  };
  lang: string;
}

export function LoginForm({ dict, lang }: LoginFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [key, setKey] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // We'll use a server action or API route to verify and set cookie
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          window.location.href = `/${lang}/studio`;
        }, 1500);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-black/5 p-12 relative overflow-hidden"
      >
        {/* Decor */}
        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
          <Shield size={120} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-black flex items-center justify-center rounded-sm">
              <Lock size={18} className="text-[#75DAB4]" />
            </div>
            <div>
              <h1 className="text-xl font-normal tracking-tight text-black">{dict.title}</h1>
              <p className="text-[12px] text-black/40 uppercase tracking-widest">{dict.subtitle}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[11px] font-normal uppercase tracking-widest text-black/40">
                {dict.fieldLabel}
              </label>
              <input
                required
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={dict.placeholder}
                className="w-full bg-neutral-50 border border-black/5 px-4 py-4 text-sm font-normal focus:outline-none focus:border-black/20 transition-all"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className="w-full group bg-black text-white px-6 py-4 text-sm font-normal uppercase tracking-[0.2em] flex items-center justify-between hover:bg-neutral-800 transition-all disabled:bg-neutral-400"
            >
              <span>{status === "submitting" ? "Authenticating..." : status === "success" ? "Redirecting..." : dict.button}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <AnimatePresence>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 text-[12px] text-red-500 font-medium text-center"
              >
                {dict.error}
              </motion.p>
            )}
            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 text-[12px] text-brand-teal font-medium text-center"
              >
                {dict.success}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <p className="mt-8 text-[11px] text-black/20 text-center uppercase tracking-widest">
        Property of MAWT Solutions AG • Unauthorized access is prohibited
      </p>
    </div>
  );
}
