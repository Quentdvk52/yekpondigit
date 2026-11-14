import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/utils";

describe("Phase 1 — Système de Devises & Formatage", () => {
  it("formate correctement les prix en Francs CFA (XOF)", () => {
    const formatted = formatPrice(1500000, "XOF");
    // Doit contenir 1 500 000 et FCFA ou F CFA
    expect(formatted).toMatch(/1[\s\u202F]500[\s\u202F]000/);
    expect(formatted).toMatch(/F[\s\u202F]?CFA/);
  });

  it("formate correctement les montants convertis en EUR", () => {
    // 655 957 XOF = ~1000 EUR
    const formatted = formatPrice(655957, "EUR");
    expect(formatted).toMatch(/1[\s\u202F]000/);
    expect(formatted).toContain("€");
  });

  it("formate correctement les montants convertis en USD", () => {
    // 600 000 XOF = ~1000 USD
    const formatted = formatPrice(600000, "USD");
    expect(formatted).toMatch(/1[\s,000]/);
    expect(formatted).toContain("$");
  });
});
