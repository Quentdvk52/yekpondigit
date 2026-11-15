"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  CreditCard,
  RotateCcw,
  Send,
  Key,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { refundOrderAction } from "@/app/actions/admin-actions";
import type { AdminOrderSummary } from "@/server/repositories/admin-repository";

interface OrdersAdminClientProps {
  initialOrders: AdminOrderSummary[];
}

export function OrdersAdminClient({ initialOrders }: OrdersAdminClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modal de remboursement
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderSummary | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const [refundMessage, setRefundMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.number.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setRefundMessage(null);
    startTransition(async () => {
      const res = await refundOrderAction({
        orderId: selectedOrder.id,
        reason: refundReason || "Demande client / Annulation de service",
        refundType: "full",
      });

      if (res.success) {
        setRefundMessage({ type: "success", text: res.message! });
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: "refunded" } : o))
        );
        setTimeout(() => {
          setSelectedOrder(null);
          setRefundReason("");
          setRefundMessage(null);
        }, 1800);
      } else {
        setRefundMessage({ type: "error", text: res.error || "Erreur de remboursement" });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <ShoppingBag className="w-4 h-4" />
            <span>Gestion des Commandes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
            Commandes, Règlements &amp; Remboursements
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Consultez le statut des transactions, renvoyez les accès et gérez les révocations.
          </p>
        </div>

        <span className="font-mono text-xs text-muted-foreground">
          {filteredOrders.length} commande(s) affichée(s)
        </span>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par n° de commande, email, nom client..."
            className="pl-10 h-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "paid", "pending", "refunded"].map((st) => (
            <Button
              key={st}
              size="sm"
              variant={statusFilter === st ? "primary" : "outline"}
              onClick={() => setStatusFilter(st)}
              className="text-xs capitalize h-10"
            >
              {st === "all" ? "Toutes" : st === "paid" ? "Payées" : st === "pending" ? "En attente" : "Remboursées"}
            </Button>
          ))}
        </div>
      </div>

      {/* Tableau des Commandes */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="p-4">Commande</th>
                <th className="p-4">Date</th>
                <th className="p-4">Client</th>
                <th className="p-4">Moyen de Paiement</th>
                <th className="p-4">Montant Total</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Clé de Licence</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-mono font-bold text-foreground">
                    {order.number}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold block text-foreground">{order.customerName || "Client"}</span>
                    <span className="text-muted-foreground text-[10px]">{order.email}</span>
                  </td>
                  <td className="p-4">
                    <span className="block text-foreground font-medium">{order.paymentMethod}</span>
                    <Badge variant="outline" className="text-[9px] font-mono mt-0.5">
                      {order.provider.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono font-bold text-sky-400">
                    {order.totalXof.toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        order.status === "paid"
                          ? "accent"
                          : order.status === "refunded"
                          ? "danger"
                          : "default"
                      }
                      className="text-[10px]"
                    >
                      {order.status === "paid"
                        ? "Payé"
                        : order.status === "refunded"
                        ? "Remboursé"
                        : "En attente"}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono font-bold">
                    {order.licenseKeys[0] ? (
                      <button
                        onClick={() => handleCopy(order.licenseKeys[0]!)}
                        className="flex items-center gap-1.5 text-sky-400 hover:underline"
                        title="Copier la licence"
                      >
                        <span>{order.licenseKeys[0]}</span>
                        {copiedKey === order.licenseKeys[0] ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/commande/${order.id}/merci`} target="_blank">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-[11px] text-muted-foreground" title="Voir reçu client">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>

                      {order.status === "paid" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setRefundReason("");
                            setRefundMessage(null);
                          }}
                          className="h-8 text-[11px] gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Rembourser</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Remboursement et Révocation */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-red-500/30 bg-card p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Rembourser la Commande {selectedOrder.number}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Cette action révoquera immédiatement les licences logicielles associées.
                </p>
              </div>
            </div>

            {refundMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  refundMessage.type === "success"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                }`}
              >
                {refundMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{refundMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleRefundSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client :</span>
                  <span className="font-semibold text-foreground">{selectedOrder.customerName} ({selectedOrder.email})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant à rembourser :</span>
                  <span className="font-mono font-bold text-red-400">{selectedOrder.totalXof.toLocaleString("fr-FR")} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Licences à révoquer :</span>
                  <span className="font-mono text-muted-foreground">{selectedOrder.licenseKeys.join(", ") || "Aucune"}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Motif du remboursement (obligatoire pour audit)
                </label>
                <Input
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Ex: Demande client sous délai de rétractation / Incompatibilité"
                  className="h-10 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  onClick={() => setSelectedOrder(null)}
                  className="text-xs"
                >
                  Annuler
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending || !refundReason.trim()}
                  className="text-xs font-bold bg-red-600 hover:bg-red-500 text-white"
                >
                  {isPending ? "Traitement en cours..." : "Confirmer le Remboursement & Révoquer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
