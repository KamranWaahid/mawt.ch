import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type DarkPageIconProps = {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
};

export function DarkPageIcon({ icon: Icon, className, iconClassName }: DarkPageIconProps) {
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-white/[0.035] text-white/55 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white",
        className,
      )}
      aria-hidden="true"
    >
      <Icon size={17} strokeWidth={1.5} className={iconClassName} />
    </span>
  );
}
