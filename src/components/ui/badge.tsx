import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-zinc-300 border-white/10",
        accent: "bg-sky-500/15 text-sky-300 border-sky-500/30",
        success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        danger: "bg-red-500/15 text-red-300 border-red-500/30",
        outline: "text-zinc-400 border-white/15 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
