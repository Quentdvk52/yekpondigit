import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductRepository } from "@/server/repositories/product-repository";
import { DemoViewerClient } from "@/components/demo/demo-viewer-client";

export const dynamic = "force-dynamic";

interface DemoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await ProductRepository.findBySlug(slug);

  if (!product) {
    return { title: "Démonstration Introuvable | YEKPON DIGIT" };
  }

  return {
    title: `Démo Interactive — ${product.title_fr} | YEKPON DIGIT`,
    description: `Testez en direct la solution logicielle ${product.title_fr} dans un environnement sandbox isolé.`,
    robots: {
      index: false, // Démos en noindex selon docs/09-SYSTEME-DEMO.md §5
      follow: true,
    },
  };
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const product = await ProductRepository.findBySlug(slug);

  if (!product) {
    notFound();
  }

  return <DemoViewerClient product={product} />;
}
