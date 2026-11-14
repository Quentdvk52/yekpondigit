import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amountXof: number, currency: "XOF" | "EUR" | "USD" = "XOF"): string {
  if (currency === "XOF") {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amountXof);
  }

  // Taux indicatifs
  const rateEUR = 1 / 655.957;
  const rateUSD = 1 / 600;

  if (currency === "EUR") {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amountXof * rateEUR);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountXof * rateUSD);
}
