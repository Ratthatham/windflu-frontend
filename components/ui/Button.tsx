import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const variants = {
      primary:
        "bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90 transition-all active:scale-[0.98]",
      secondary:
        "bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-100/80 transition-all active:scale-[0.98]",
      ghost:
        "hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 transition-all",
      outline:
        "border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900 transition-all active:scale-[0.98]",
      destructive:
        "bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90 transition-all active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs rounded-lg",
      md: "h-11 px-4 py-2 text-sm rounded-xl",
      lg: "h-13 px-8 text-base rounded-2xl",
      icon: "h-11 w-11 rounded-xl flex items-center justify-center",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
