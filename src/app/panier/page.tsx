import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Mon Panier d'Achat | YEKPON DIGIT",
  description:
    "Vérifiez vos projets logiciels et vos licences sélectionnées avant de finaliser votre commande sécurisée.",
};

export default function CartPage() {
  return <CartPageClient />;
}
