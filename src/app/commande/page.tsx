import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";

export const metadata: Metadata = {
  title: "Paiement Sécurisé | YEKPON DIGIT",
  description:
    "Finalisez l'achat de vos projets logiciels avec MTN Mobile Money, Moov Money, Celtiis Cash ou carte bancaire.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
