import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderRepository } from "@/server/repositories/order-repository";
import { OrderSuccessClient } from "@/components/checkout/order-success-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Merci pour votre Commande | YEKPON DIGIT",
  description: "Téléchargement immédiat de vos licences logicielles et codes sources clés en main.",
};

interface OrderMerciPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderMerciPage({ params }: OrderMerciPageProps) {
  const { id } = await params;
  const details = await OrderRepository.getOrderDetails(id);

  if (!details) {
    notFound();
  }

  const { order, items, licenses } = details;

  return (
    <OrderSuccessClient
      order={{
        id: order.id,
        number: order.number,
        email: order.email,
        totalXof: order.total_xof,
        displayTotal: order.display_total,
        displayCurrency: order.display_currency,
        paidAt: order.paid_at,
      }}
      items={items.map((i) => ({
        id: i.id,
        productId: i.product_id,
        productTitle: i.product_title_snapshot,
        licenseCode: i.license_code,
        unitPriceXof: i.unit_price_xof,
      }))}
      licenses={licenses.map((l) => ({
        id: l.id,
        key: l.key,
        licenseCode: l.license_code,
        maxDomains: l.max_domains,
        productId: l.product_id,
      }))}
    />
  );
}
