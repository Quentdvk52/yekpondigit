import { describe, it, expect } from "vitest";
import { ProductRepository } from "@/server/repositories/product-repository";
import sitemap from "@/app/sitemap";

describe("Phase 3 — Boutique Publique & Fiches Produits", () => {
  it("récupère les produits vedettes pour l'accueil", async () => {
    const res = await ProductRepository.list({ isFeatured: true, limit: 6 });
    expect(res.products.length).toBeGreaterThanOrEqual(1);

    const first = res.products[0];
    expect(first?.is_featured).toBe(true);
  });

  it("génère le sitemap XML complet avec routes statiques et produits dynamiques", async () => {
    const urls = await sitemap();
    expect(urls.length).toBeGreaterThanOrEqual(10);

    const urlStrings = urls.map((u) => u.url);
    expect(urlStrings.some((u) => u.includes("/boutique"))).toBe(true);
    expect(urlStrings.some((u) => u.includes("/produit/demo-yekpon-store-ecommerce"))).toBe(true);
  });

  it("filtre les produits par type", async () => {
    const res = await ProductRepository.list({ type: "saas" });
    expect(res.products.length).toBeGreaterThanOrEqual(1);
    for (const p of res.products) {
      expect(p.type).toBe("saas");
    }
  });
});
