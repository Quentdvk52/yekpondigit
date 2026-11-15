import type { Metadata } from "next";
import { OrderStatusClient } from "@/components/checkout/order-status-client";

export const metadata: Metadata = {
  title: "Statut de votre Commande | YEKPON DIGIT",
  description: "Suivez en direct l'état de validation de votre commande logicielle.",
};

interface OrderStatusPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { id } = await params;
  return <OrderStatusClient orderId={id} />;
}
