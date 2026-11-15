"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiCelebration() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Vérifier prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    // Palette dark luxe YEKPON DIGIT
    const colors = ["#38bdf8", "#818cf8", "#fbbf24", "#34d399", "#f43f5e"];

    // 1ère salve immédiate
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors,
    });

    // 2ème salve latérale gauche/droite à +250ms
    const timer = setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
