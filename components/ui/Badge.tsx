import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "success"
    | "purple"
    | "cyan"
    | "yellow";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-brand-purple text-white shadow-sm",
    secondary: "border-transparent bg-brand-blue/10 text-brand-blue",
    outline: "text-zinc-600 border-zinc-200 bg-white",
    destructive: "border-transparent bg-red-500 text-zinc-50 hover:bg-red-500/80",
    success: "border-transparent bg-emerald-500 text-white hover:bg-emerald-500/80",
    purple: "border-transparent bg-brand-purple/10 text-brand-purple",
    cyan: "border-transparent bg-brand-cyan/10 text-brand-cyan",
    yellow: "border-transparent bg-brand-yellow/20 text-brand-yellow-800",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
