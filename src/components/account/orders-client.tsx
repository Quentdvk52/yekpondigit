"use client";

import Link from "next/link";
import {
  ShoppingBag,
  FileText,
  ExternalLink,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface OrderItem {
  title: string;
  license: string;
  priceXof: number;
}

export interface OrderRecord {
  id: string;
  number: string;
  date: string;
  amountXof: number;
  paymentMethod: string;
  status: string;
  items: OrderItem[];
}

interface OrdersClientProps {
  orders: OrderRecord[];
}

export function OrdersClient({ orders }: OrdersClientProps) {
  const handleDownloadInvoice = (orderNumber: string) => {
    alert(`Téléchargement de la facture PDF ${orderNumber} en cours...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-400" />
            <span>Historique de mes Commandes</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Retrouvez tous vos reçus d'achat et vos factures comptables certifiées.
          </p>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {orders.length} commande(s)
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-base text-foreground">
                    {order.number}
                  </span>
                  <Badge variant="accent" className="text-[10px] font-bold">
                    Payé &amp; Livré
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{order.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{order.paymentMethod}</span>
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="font-mono font-black text-lg text-sky-400">
                  {order.amountXof.toLocaleString("fr-FR")} FCFA
                </div>
                <span className="text-[10px] text-muted-foreground">TTC (TVA 0% export)</span>
              </div>
            </div>

            {/* Articles de la commande */}
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-3 rounded-xl bg-muted/10 border border-border/40"
                >
                  <div>
                    <span className="font-bold text-foreground block">{item.title}</span>
                    <span className="text-muted-foreground">{item.license}</span>
                  </div>
                  <span className="font-mono font-bold text-foreground">
                    {item.priceXof.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Link href={`/commande/${order.id}/merci`}>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Détail de la commande &amp; Licences</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadInvoice(order.number)}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Facture PDF ({order.number}.pdf)</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
