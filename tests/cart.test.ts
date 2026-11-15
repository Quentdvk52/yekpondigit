import { describe, it, expect } from "vitest";
import { validateCouponAction } from "@/app/actions/coupon-actions";
import { generateLicenseKey, signLicenseKey, verifyLicenseSignature } from "@/server/licenses/generator";

describe("Phase 5 — Panier, Coupons & Licences Cryptographiques", () => {
  it("applique correctement un coupon de réduction en pourcentage", async () => {
    const res = await validateCouponAction("BIENVENUE10", 150000);
    expect(res.success).toBe(true);
    expect(res.coupon?.code).toBe("BIENVENUE10");
    expect(res.coupon?.discountType).toBe("percentage");
    expect(res.coupon?.value).toBe(10);
    expect(res.coupon?.discountXof).toBe(15000); // 10% de 150 000 = 15 000
  });

  it("rejette un code promo inexistant ou expiré", async () => {
    const res = await validateCouponAction("CODE_INEXISTANT_XYZ", 150000);
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });

  it("applique un coupon à montant fixe si le montant minimum est respecté", async () => {
    const res = await validateCouponAction("LANCEMENT", 80000); // min 50 000
    expect(res.success).toBe(true);
    expect(res.coupon?.discountType).toBe("fixed");
    expect(res.coupon?.discountXof).toBe(15000);
  });

  it("rejette un coupon si le montant minimum n'est pas atteint", async () => {
    const res = await validateCouponAction("LANCEMENT", 30000); // min 50 000 requis
    expect(res.success).toBe(false);
    expect(res.error).toContain("50");
  });

  it("génère des clés de licence conformes au format YDXX-XXXX-XXXX-XXXX sans caractères ambigus", () => {
    const key = generateLicenseKey();
    expect(key).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    expect(key).not.toMatch(/[0O1IL]/); // pas de caractères ambigus
  });

  it("signe et vérifie l'authenticité d'une licence par signature HMAC", () => {
    const key = generateLicenseKey();
    const productId = "30000000-0000-0000-0000-000000000001";
    const email = "client@test.com";

    const signature = signLicenseKey(key, productId, email);
    expect(signature).toBeDefined();
    expect(signature.length).toBe(64); // SHA-256 hex string

    // Signature valide
    const isValid = verifyLicenseSignature(key, productId, email, signature);
    expect(isValid).toBe(true);

    // Signature contrefaite ou produit altéré
    const isFakeValid = verifyLicenseSignature(key, "autre-produit-id", email, signature);
    expect(isFakeValid).toBe(false);
  });
});
