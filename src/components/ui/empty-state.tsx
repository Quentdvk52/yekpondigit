import { ReactNode } from "react";
import { FolderSearch } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm max-w-md mx-auto",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 shadow-inner">
        {icon || <FolderSearch className="w-7 h-7" />}
      </div>
      <h4 className="text-lg font-bold text-white tracking-wide">{title}</h4>
      <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
