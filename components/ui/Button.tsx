import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-purple text-white shadow-lg shadow-brand-purple/20 hover:opacity-90",
        secondary:
          "bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:opacity-90",
        ghost:
          "hover:bg-brand-purple/10 text-zinc-700 hover:text-brand-purple active:scale-100",
        outline:
          "border border-zinc-200 bg-white shadow-sm hover:border-brand-purple/30 hover:bg-brand-purple/5 hover:text-brand-purple",
        destructive: "bg-red-500 text-white shadow-sm hover:bg-red-500/90",
        link: "text-brand-purple underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        sm: "h-9 px-3 text-xs rounded-lg",
        md: "h-11 px-4 py-2 text-sm rounded-xl",
        lg: "h-12 px-8 text-base rounded-2xl",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
