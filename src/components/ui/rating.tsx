import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  score: number; // 0 to 5
  count?: number;
  showText?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function Rating({
  score,
  count,
  showText = true,
  className,
  size = "md",
}: RatingProps) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className={cn("inline-flex items-center gap-1.5 text-zinc-300", className)}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              iconSize,
              star <= Math.round(score)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-zinc-600"
            )}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-zinc-300">
          {score.toFixed(1)}
          {count !== undefined && (
            <span className="text-zinc-500 font-normal ml-1">({count})</span>
          )}
        </span>
      )}
    </div>
  );
}
