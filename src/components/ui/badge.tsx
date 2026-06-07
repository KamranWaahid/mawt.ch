import React from "react";

interface BadgeProps {
  label: string;
  theme?: "light" | "dark";
  className?: string;
}

export function Badge({ label, theme = "dark", className = "" }: BadgeProps) {
  const isDark = theme === "dark";
  
  // Bespoke aesthetic styling options
  const textColor = isDark 
    ? "text-neutral-400 group-hover:text-white" 
    : "text-neutral-600 group-hover:text-black";
  const labelColor = isDark 
    ? "text-white/90" 
    : "text-neutral-900";
  const cornerColor = isDark 
    ? "border-[#75DAB4]/60 group-hover:border-[#75DAB4]" 
    : "border-[#75DAB4]/80 group-hover:border-[#75DAB4]";
  const bgColor = isDark 
    ? "bg-white/[0.01] hover:bg-white/[0.02]" 
    : "bg-black/[0.01] hover:bg-black/[0.02]";

  return (
    <div
      className={`relative inline-flex items-center justify-center px-4.5 py-2.5 text-[10px] font-sans tracking-[0.25em] uppercase select-none transition-all duration-300 group
        ${bgColor} ${textColor} ${className}`}
    >
      {/* Custom Viewfinder corner brackets with subtle expansion hover effects */}
      <span className={`absolute top-0 left-0 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 ${cornerColor}`} />
      <span className={`absolute top-0 right-0 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${cornerColor}`} />
      <span className={`absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5 ${cornerColor}`} />
      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 ${cornerColor}`} />
      
      {/* Center crosshair dot indicator */}
      <span className="mr-3 flex items-center justify-center">
        <span className="h-1 w-1 rounded-full bg-[#75DAB4] transition-transform duration-300 group-hover:scale-125" />
      </span>
      
      {/* Label text */}
      <span className={`font-medium transition-colors duration-300 ${labelColor}`}>
        {label}
      </span>
    </div>
  );
}
