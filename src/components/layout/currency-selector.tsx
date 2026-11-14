"use client";

import { useCurrency, type Currency } from "@/contexts/currency-context";
import { Coins } from "lucide-react";

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1 text-xs">
        <Coins className="w-3.5 h-3.5 text-zinc-400 ml-1.5 mr-1" />
        {(["XOF", "EUR", "USD"] as Currency[]).map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              currency === c
                ? "bg-sky-500 text-slate-950 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
