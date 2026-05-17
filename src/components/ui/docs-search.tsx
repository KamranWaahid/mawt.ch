"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { DocsSidebar } from "./docs-sidebar";

interface DocsLink {
  label: string;
  href: string;
}

interface DocsGroup {
  title: string;
  links: DocsLink[];
}

interface DocsSearchProps {
  initialGroups: DocsGroup[];
}

export function DocsSearch({ initialGroups }: DocsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return initialGroups;

    return initialGroups.map(group => ({
      ...group,
      links: group.links.filter(link => 
        link.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(group => group.links.length > 0);
  }, [searchQuery, initialGroups]);

  return (
    <div className="flex flex-col gap-10">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
        <input 
          type="text" 
          placeholder="Search docs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-neutral-50 border border-black/5 text-[14px] font-normal focus:outline-none focus:border-black/20 transition-colors"
        />
      </div>
      <DocsSidebar lang="en" groups={filteredGroups as any} />
    </div>
  );
}
