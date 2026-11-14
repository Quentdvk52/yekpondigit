import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ProductRepository } from "@/server/repositories/product-repository";
import { ProductDetailClient } from "@/components/product/product-detail-client";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await ProductRepository.findBySlug(slug);

  if (!product) {
    return {
      title: "Produit Introuvable | YEKPON DIGIT",
    };
  }

  const title = product.seo_title || `${product.title_fr} — Logiciel Clé en Main | YEKPON DIGIT`;
  const description =
    product.seo_description || product.summary_fr || "Achetez ce logiciel prêt à déployer sur YEKPON DIGIT.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: product.media[0]?.url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
          width: 1200,
          height: 630,
          alt: product.title_fr,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await ProductRepository.findBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryCategory = product.categories[0];

  // Données structurées Schema.org JSON-LD pour Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title_fr,
    description: product.summary_fr,
    image: product.media[0]?.url,
    category: primaryCategory?.name_fr,
    offers: {
      "@type": "Offer",
      price: product.base_price_xof,
      priceCurrency: "XOF",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "YEKPON DIGIT",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(product.rating_avg) || 5.0,
      reviewCount: Math.max(product.rating_count, 1),
    },
  };

  return (
    <>
      {/* Script JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Fil d'Ariane Sémantique */}
        <nav aria-label="Fil d'ariane" className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
            Accueil
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <Link href="/boutique" className="hover:text-foreground transition-colors">
            Boutique
          </Link>
          {primaryCategory && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              <Link
                href={`/boutique?category=${primaryCategory.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {primaryCategory.name_fr}
              </Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-md">
            {product.title_fr}
          </span>
        </nav>

        {/* Détails du Produit */}
        <ProductDetailClient product={product} />
      </div>
    </>
  );
}
