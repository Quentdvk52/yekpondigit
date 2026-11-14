"use client";

import { useCurrency } from "@/contexts/currency-context";
import { cn } from "@/lib/utils";

export interface PriceTagProps {
  amountXof: number;
  salePriceXof?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function PriceTag({
  amountXof,
  salePriceXof,
  className,
  size = "md",
}: PriceTagProps) {
  const { format } = useCurrency();
  const hasSale = salePriceXof !== null && salePriceXof !== undefined && salePriceXof < amountXof;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base sm:text-lg",
    lg: "text-xl sm:text-2xl",
    xl: "text-2xl sm:text-3xl",
  };

  const discountPercent = hasSale
    ? Math.round(((amountXof - salePriceXof) / amountXof) * 100)
    : 0;

  return (
    <div className={cn("inline-flex items-baseline gap-2 font-bold select-none", className)}>
      <span className={cn("text-white font-extrabold tracking-tight", sizeClasses[size])}>
        {format(hasSale ? salePriceXof : amountXof)}
      </span>

      {hasSale && (
        <>
          <span className="text-xs sm:text-sm text-zinc-500 line-through font-normal">
            {format(amountXof)}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
}
