"use client";

import { useState, useMemo } from "react";
import { Search, Filter, RotateCcw, PackageSearch, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { type ProductSummary } from "@/server/repositories/product-repository";
import { type CategoryRecord } from "@/server/repositories/category-repository";

export interface ShopCatalogClientProps {
  initialProducts: ProductSummary[];
  categories: CategoryRecord[];
  selectedCategorySlug?: string;
}

export function ShopCatalogClient({
  initialProducts,
  categories,
  selectedCategorySlug,
}: ShopCatalogClientProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategorySlug ?? "all");
  const [sortBy, setSortBy] = useState<"recent" | "price_asc" | "price_desc" | "sales">("recent");
  const [onlyWithPromo, setOnlyWithPromo] = useState(false);

  // Filtrage combiné réactif
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Recherche textuelle
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = p.title_fr.toLowerCase().includes(q) || p.title_en.toLowerCase().includes(q);
          const matchSummary = p.summary_fr.toLowerCase().includes(q);
          if (!matchTitle && !matchSummary) return false;
        }

        // Filtre Type
        if (selectedType !== "all" && p.type !== selectedType) {
          return false;
        }

        // Filtre Catégorie
        if (selectedCategory !== "all") {
          const inCat = p.categories.some((c) => c.slug === selectedCategory || c.id === selectedCategory);
          if (!inCat) return false;
        }

        // Promo
        if (onlyWithPromo && (!p.sale_price_xof || p.sale_price_xof >= p.base_price_xof)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") {
          const priceA = a.sale_price_xof ?? a.base_price_xof;
          const priceB = b.sale_price_xof ?? b.base_price_xof;
          return priceA - priceB;
        }
        if (sortBy === "price_desc") {
          const priceA = a.sale_price_xof ?? a.base_price_xof;
          const priceB = b.sale_price_xof ?? b.base_price_xof;
          return priceB - priceA;
        }
        if (sortBy === "sales") {
          return b.sales_count - a.sales_count;
        }
        // Par défaut : plus récents
        return new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime();
      });
  }, [initialProducts, search, selectedType, selectedCategory, sortBy, onlyWithPromo]);

  const resetFilters = () => {
    setSearch("");
    setSelectedType("all");
    setSelectedCategory("all");
    setSortBy("recent");
    setOnlyWithPromo(false);
  };

  const hasActiveFilters =
    search !== "" || selectedType !== "all" || selectedCategory !== "all" || onlyWithPromo;

  return (
    <div className="space-y-8">
      {/* Barre de Recherche & Contrôles Rapides */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une solution (ex: SaaS, e-commerce, Flutter, POS)..."
            className="pl-10 h-11"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tri */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-11 rounded-lg border border-border bg-background px-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="recent">Plus récents</option>
              <option value="sales">Meilleures ventes</option>
              <option value="price_asc">Prix : croissant</option>
              <option value="price_desc">Prix : décroissant</option>
            </select>
          </div>

          {/* Filtre Promotion */}
          <Button
            type="button"
            variant={onlyWithPromo ? "primary" : "outline"}
            size="sm"
            onClick={() => setOnlyWithPromo(!onlyWithPromo)}
            className="h-11 text-xs"
          >
            🔥 En Promo
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-11 text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Puces de Catégories Horizontales */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-black"
              : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          Toutes les Catégories
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.slug)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === c.slug
                ? "bg-primary text-black"
                : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.name_fr}
          </button>
        ))}
      </div>

      {/* Résumé des Résultats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <span>
          {filteredProducts.length} solution{filteredProducts.length > 1 ? "s" : ""} logicielle
          {filteredProducts.length > 1 ? "s" : ""} disponible{filteredProducts.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Grille des Produits */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
          <h3 className="text-lg font-bold text-foreground">Aucun logiciel ne correspond à vos critères</h3>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Essayez de modifier votre recherche ou de réinitialiser vos filtres pour voir d&apos;autres solutions.
          </p>
          <Button onClick={resetFilters} variant="outline" size="sm" className="mt-5 gap-2">
            <RotateCcw className="h-4 w-4" />
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
