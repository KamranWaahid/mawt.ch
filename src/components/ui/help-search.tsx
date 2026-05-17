"use client";

import { useState, useMemo } from "react";
import { Search, ArrowRight, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Fuse from "fuse.js";
import Link from "next/link";
import { useParams } from "next/navigation";

interface HelpCategory {
  title: string;
  count: number;
}

interface HelpSearchProps {
  initialCategories: HelpCategory[];
  dict: {
    searchPlaceholder: string;
    noResults: string;
    articles: string;
    quickLinks: string;
  };
}

const mockArticles = [
  { title: "Quick Start Guide", slug: "quick-start", category: "Getting Started" },
  { title: "Architecture Overview", slug: "architecture-overview", category: "Getting Started" },
  { title: "Embedded Teams Workflow", slug: "embedded-teams", category: "Developer" },
  { title: "API Authentication", slug: "api-reference", category: "Developer" },
  { title: "Billing and Invoices", slug: "billing", category: "Account" },
  { title: "Security Protocols", slug: "security-best-practices", category: "Security" },
];

export function HelpSearch({ initialCategories, dict }: HelpSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const lang = params?.lang || "en";

  const fuse = useMemo(() => new Fuse(mockArticles, {
    keys: ["title", "category"],
    threshold: 0.3,
  }), []);

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, fuse]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery || searchResults.length > 0) return initialCategories;
    return initialCategories.filter(category => 
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, initialCategories, searchResults]);

  const quickLinks = [
    "API Reference", "Billing FAQ", "SSO Configuration", "Team Seats"
  ];

  return (
    <>
      <section className="bg-white px-6 py-12 sm:px-8 md:px-10 lg:px-12 -mt-10">
        <div className="max-w-[800px] mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors" size={20} />
            <input 
              type="text" 
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-8 border border-black/5 bg-neutral-50 text-xl font-normal focus:outline-none focus:border-black transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-black/5"
            />
            
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white border border-black/5 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="flex flex-col">
                    {searchResults.map((result) => (
                      <Link 
                        key={result.slug}
                        href={`/${lang}/docs/${result.slug}`}
                        className="flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors border-b border-black/5 last:border-b-0 group/result"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-neutral-100 rounded group-hover/result:bg-white transition-colors">
                            <FileText size={18} className="text-neutral-400 group-hover/result:text-black" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[15px] font-normal text-black">{result.title}</span>
                            <span className="text-[11px] font-normal text-neutral-400 uppercase tracking-widest">{result.category}</span>
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-neutral-200 group-hover/result:text-black transition-all group-hover/result:translate-x-1" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="text-[13px] font-normal text-neutral-400 uppercase tracking-widest mr-2">{dict.quickLinks}</span>
            {quickLinks.map(link => (
              <button 
                key={link}
                onClick={() => setSearchQuery(link)}
                className="text-[14px] font-normal text-neutral-500 hover:text-black hover:underline underline-offset-4 transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5 border border-black/5">
            <AnimatePresence mode="popLayout">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <motion.div 
                    layout
                    key={category.title}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-12 bg-white hover:bg-neutral-50 transition-all duration-500 group cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex flex-col gap-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]">
                          {category.count} {dict.articles}
                        </span>
                        <ArrowRight size={18} className="text-neutral-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-2xl font-normal text-black leading-tight">
                        {category.title}
                      </h3>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-32 text-center bg-white"
                >
                  <p className="text-xl text-neutral-400 font-normal italic">
                    {dict.noResults} "{searchQuery}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
