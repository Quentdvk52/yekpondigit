import { describe, it, expect } from "vitest";
import { CategoryRepository } from "@/server/repositories/category-repository";
import { ProductRepository } from "@/server/repositories/product-repository";

describe("Phase 2 — Repositories & Base de Données", () => {
  it("récupère les catégories existantes depuis Neon PostgreSQL", async () => {
    const categories = await CategoryRepository.listAll();
    expect(categories.length).toBeGreaterThanOrEqual(6);

    const slugs = categories.map((c) => c.slug);
    expect(slugs).toContain("sites-web");
    expect(slugs).toContain("saas-web");
    expect(slugs).toContain("mobile-apps");
  });

  it("récupère la liste des tags prédéfinis", async () => {
    const techTags = await CategoryRepository.listTags("tech");
    expect(techTags.length).toBeGreaterThan(0);
    const tagSlugs = techTags.map((t) => t.slug);
    expect(tagSlugs).toContain("nextjs");
    expect(tagSlugs).toContain("flutter");
  });

  it("liste les produits du catalogue avec pagination et filtres", async () => {
    const result = await ProductRepository.list({ limit: 10 });
    expect(result.total).toBeGreaterThanOrEqual(12);
    expect(result.products.length).toBeLessThanOrEqual(10);

    const first = result.products[0];
    expect(first).toBeDefined();
    expect(first?.title_fr).toBeDefined();
    expect(first?.base_price_xof).toBeGreaterThan(0);
  });

  it("récupère le détail complet d'un produit par son slug avec démos et licences", async () => {
    const product = await ProductRepository.findBySlug("demo-yekpon-store-ecommerce");
    expect(product).not.toBeNull();
    expect(product?.slug).toBe("demo-yekpon-store-ecommerce");
    expect(product?.licenses.length).toBeGreaterThanOrEqual(2);
    expect(product?.demos.length).toBeGreaterThanOrEqual(1);
    expect(product?.versions.length).toBeGreaterThanOrEqual(1);
  });
});
