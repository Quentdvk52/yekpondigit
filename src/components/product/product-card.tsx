"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, ArrowRight, ShieldCheck, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui/price-tag";
import { Rating } from "@/components/ui/rating";
import { type ProductSummary } from "@/server/repositories/product-repository";

// Images par défaut selon le type de produit
const DEFAULT_COVERS: Record<string, string> = {
  website: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
  saas: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
  mobile_app: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
  android_native: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=80",
  desktop_app: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
  ui_kit: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
  bot: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  template: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
  script_plugin: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
  bundle: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
  service: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
};

export interface ProductCardProps {
  product: ProductSummary;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const coverUrl =
    DEFAULT_COVERS[product.type] ??
    DEFAULT_COVERS.saas ??
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800";

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 backdrop-blur-sm ${className}`}
    >
      <div>
        {/* Vignette / Image */}
        <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted/30">
          <Image
            src={coverUrl}
            alt={product.title_fr}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />

          {/* Badges sur l'image */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <Badge variant="accent" className="capitalize text-[11px] font-semibold">
              {product.type.replace("_", " ")}
            </Badge>
            {product.is_featured && (
              <Badge variant="warning" className="text-[10px] font-bold">
                ⭐ Vedette
              </Badge>
            )}
            {product.is_new && (
              <Badge variant="success" className="text-[10px] font-bold">
                Nouveau
              </Badge>
            )}
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="rounded-md bg-black/70 px-2 py-1 font-mono text-[11px] text-zinc-300 backdrop-blur-md border border-white/10">
              v{product.current_version}
            </span>
          </div>
        </div>

        {/* Note et avis */}
        <div className="mb-2 flex items-center justify-between">
          <Rating score={Number(product.rating_avg) || 5.0} count={product.rating_count} size="sm" />
          <span className="text-[11px] text-muted-foreground font-medium">
            {product.sales_count} ventes
          </span>
        </div>

        {/* Titre & Résumé */}
        <Link href={`/produit/${product.slug}`} className="group-hover:text-primary transition-colors">
          <h3 className="line-clamp-2 text-base font-bold tracking-tight text-foreground">
            {product.title_fr}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.summary_fr}
        </p>

        {/* Avantages clés */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <Code2 className="h-3 w-3" />
            Sources incluses
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-primary" />
            Licence certifiée
          </span>
        </div>
      </div>

      {/* Pied de carte : Prix et Actions */}
      <div className="mt-5 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">À partir de</span>
            <PriceTag
              amountXof={product.base_price_xof}
              salePriceXof={product.sale_price_xof}
              size="md"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href={`/produit/${product.slug}#demo`} className="w-full">
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-9">
              <Eye className="h-3.5 w-3.5" />
              Démo
            </Button>
          </Link>

          <Link href={`/produit/${product.slug}`} className="w-full">
            <Button size="sm" className="w-full gap-1.5 text-xs h-9">
              Découvrir
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
