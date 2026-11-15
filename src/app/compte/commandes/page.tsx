import type { Metadata } from "next";
import { OrdersClient, type OrderRecord } from "@/components/account/orders-client";

export const metadata: Metadata = {
  title: "Historique de mes Commandes | YEKPON DIGIT",
  description: "Consultez l'historique complet de vos commandes, factures et règlements.",
};

export default function CompteCommandesPage() {
  const orders: OrderRecord[] = [
    {
      id: "ord_1001",
      number: "YD-2026-001042",
      date: "15 Janvier 2026",
      amountXof: 125000,
      paymentMethod: "Mobile Money (MTN MoMo)",
      status: "paid",
      items: [
        {
          title: "YekponStore — E-Commerce Multivendeur Clé en Main",
          license: "Licence Standard (1 Domaine)",
          priceXof: 125000,
        },
      ],
    },
    {
      id: "ord_1002",
      number: "YD-2026-001089",
      date: "20 Janvier 2026",
      amountXof: 290000,
      paymentMethod: "Carte Bancaire (Stripe 3DS)",
      status: "paid",
      items: [
        {
          title: "SchoolDesk — SaaS Gestion Scolaire & Universitaire",
          license: "Licence Étendue (Multi-Campus)",
          priceXof: 290000,
        },
      ],
    },
  ];

  return <OrdersClient orders={orders} />;
}
