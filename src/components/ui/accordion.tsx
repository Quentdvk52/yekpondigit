"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm sm:text-base text-white hover:text-sky-300 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ml-4",
            isOpen && "rotate-180 text-sky-400"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  );
}

export function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-3", className)}>{children}</div>;
}
