import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShopCatalogClient } from "@/components/product/shop-catalog-client";
import { ProductRepository } from "@/server/repositories/product-repository";
import { CategoryRepository } from "@/server/repositories/category-repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Boutique & Catalogue de Projets Logiciels | YEKPON DIGIT",
  description:
    "Parcourez notre catalogue de solutions logicielles clés en main : SaaS, sites web, applications mobiles Flutter & Android, templates et logiciels desktop avec démonstration interactive.",
  keywords: [
    "boutique logiciels",
    "acheter un SaaS",
    "application mobile prête",
    "template e-commerce",
    "logiciel desktop",
    "YEKPON DIGIT",
  ],
};

interface BoutiquePageProps {
  searchParams?: Promise<{
    category?: string;
    type?: string;
  }>;
}

export default async function BoutiquePage({ searchParams }: BoutiquePageProps) {
  const params = await searchParams;
  const [productsRes, categories] = await Promise.all([
    ProductRepository.list({ limit: 100 }),
    CategoryRepository.listAll(true),
  ]);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* En-tête de la Boutique */}
      <div className="mb-10 text-center sm:text-left border-b border-border/60 pb-8">
        <Badge variant="accent" className="mb-2">Catalogue Officiel</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Boutique de Logiciels Clés en Main
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
          Tous nos projets sont fournis avec leur code source complet, documentation d&apos;installation,
          certificat de licence et support technique dédié.
        </p>
      </div>

      {/* Interface de Filtrage et Catalogue */}
      <ShopCatalogClient
        initialProducts={productsRes.products}
        categories={categories}
        selectedCategorySlug={params?.category}
      />
    </div>
  );
}
