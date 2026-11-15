import { describe, it, expect } from "vitest";
import { submitCustomQuoteAction } from "@/app/actions/quote-actions";
import manifest from "@/app/manifest";
import frMessages from "@/messages/fr.json";
import enMessages from "@/messages/en.json";

describe("Phase 9 — Service Sur-Mesure, i18n & PWA", () => {
  it("valide et enregistre une demande de devis sur mesure complète", async () => {
    const res = await submitCustomQuoteAction({
      fullName: "Bio Gado",
      email: "bio.gado@cotonou-tech.bj",
      phone: "+229 97 11 22 33",
      company: "Cotonou Logistics SARL",
      projectType: "SaaS & Plateforme Web",
      features: [
        "Paiements Mobile Money (MTN, Moov, Celtiis) + CB",
        "Authentification Renforcée 2FA TOTP & Rôles RBAC",
      ],
      timelineWeeks: 5,
      estimatedBudgetXof: 1930000,
      description: "Nous avons besoin d'une plateforme de tracking logistique avec paiement direct par MoMo.",
    });

    expect(res.success).toBe(true);
    expect(res.reference).toBeDefined();
    expect(res.reference).toMatch(/^DEV-\d{4}-\d{4}$/);
    expect(res.message).toContain(res.reference);
  });

  it("rejette une demande de devis avec une description trop courte", async () => {
    const res = await submitCustomQuoteAction({
      fullName: "Bio Gado",
      email: "bio.gado@cotonou-tech.bj",
      phone: "+229 97 11 22 33",
      projectType: "SaaS",
      features: [],
      timelineWeeks: 4,
      estimatedBudgetXof: 1500000,
      description: "Trop court", // < 20 caractères
    });

    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });

  it("rejette une demande avec une adresse email invalide", async () => {
    const res = await submitCustomQuoteAction({
      fullName: "Bio Gado",
      email: "pas-un-email-valide",
      phone: "+229 97 11 22 33",
      projectType: "SaaS",
      features: [],
      timelineWeeks: 4,
      estimatedBudgetXof: 1500000,
      description: "Description valide de plus de vingt caractères pour le projet.",
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain("email");
  });

  it("génère un manifeste PWA conforme pour le support mobile et hors-ligne", () => {
    const pwaManifest = manifest();

    expect(pwaManifest.name).toBe("YEKPON DIGIT — Logiciels Clés en Main");
    expect(pwaManifest.short_name).toBe("YEKPON DIGIT");
    expect(pwaManifest.display).toBe("standalone");
    expect(pwaManifest.background_color).toBe("#090d16");
    expect(pwaManifest.theme_color).toBe("#090d16");
    expect(pwaManifest.start_url).toBe("/");
    expect(pwaManifest.icons?.length).toBeGreaterThan(0);
  });

  it("garantit la cohérence des dictionnaires bilingues FR et EN", () => {
    const frKeys = Object.keys(frMessages);
    const enKeys = Object.keys(enMessages);

    expect(frKeys).toEqual(enKeys);
    expect(Object.keys(frMessages.nav)).toEqual(Object.keys(enMessages.nav));
    expect(Object.keys(frMessages.hero)).toEqual(Object.keys(enMessages.hero));
    expect(Object.keys(frMessages.product)).toEqual(Object.keys(enMessages.product));
    expect(Object.keys(frMessages.checkout)).toEqual(Object.keys(enMessages.checkout));
    expect(Object.keys(frMessages.licenses)).toEqual(Object.keys(enMessages.licenses));
  });
});
