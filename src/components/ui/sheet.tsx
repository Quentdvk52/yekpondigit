"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "left" | "right" | "bottom";
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  className,
}: SheetProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = {
    left: "top-0 left-0 h-full w-full max-w-sm border-r",
    right: "top-0 right-0 h-full w-full max-w-sm border-l",
    bottom: "bottom-0 left-0 w-full max-h-[85vh] rounded-t-3xl border-t",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed bg-slate-900 border-white/10 p-6 shadow-2xl backdrop-blur-2xl text-white transition-all overflow-y-auto",
          positionClasses[position],
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          {title && <h3 className="font-bold text-base text-white">{title}</h3>}
          <button
            onClick={onClose}
            aria-label="Fermer le panneau"
            className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
