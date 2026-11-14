"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "XOF" | "EUR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amountXof: number) => string;
  rates: Record<Currency, number>;
}

// Taux de change fixes/références
// 1 EUR = 655.957 XOF (parité fixe FCFA BCEAO)
// 1 USD ~ 600 XOF (taux indicatif moyen)
const DEFAULT_RATES: Record<Currency, number> = {
  XOF: 1,
  EUR: 1 / 655.957,
  USD: 1 / 600,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("XOF");

  useEffect(() => {
    const saved = localStorage.getItem("yd_currency") as Currency | null;
    if (saved && (saved === "XOF" || saved === "EUR" || saved === "USD")) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("yd_currency", c);
  };

  const format = (amountXof: number): string => {
    if (currency === "XOF") {
      return new Intl.NumberFormat("fr-BJ", {
        style: "currency",
        currency: "XOF",
        maximumFractionDigits: 0,
      }).format(amountXof);
    }

    if (currency === "EUR") {
      const amountEUR = amountXof * DEFAULT_RATES.EUR;
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amountEUR);
    }

    const amountUSD = amountXof * DEFAULT_RATES.USD;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountUSD);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, rates: DEFAULT_RATES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
