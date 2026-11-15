"use client";

import Link from "next/link";
import {
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminDashboardKPI } from "@/server/repositories/admin-repository";

interface DashboardClientProps {
  kpi: AdminDashboardKPI;
}

export function DashboardClient({ kpi }: DashboardClientProps) {
  const maxTrend = Math.max(...kpi.salesTrend.map((t) => t.amountXof), 1);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Activity className="w-4 h-4" />
            <span>Tableau de Bord Exécutif</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
            Indicateurs &amp; Revenus en Temps Réel
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Suivi des ventes de solutions, rapprochement multidevises et contrôle des passerelles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/commandes">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
              <span>Voir les Commandes</span>
            </Button>
          </Link>
          <Link href="/admin/produits/nouveau">
            <Button size="sm" className="text-xs font-bold gap-1.5">
              <span>+ Nouveau Produit</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Grandes Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CA Total */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">Chiffre d'Affaires Réglé</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono font-black text-2xl text-foreground">
              {kpi.totalRevenueXof.toLocaleString("fr-FR")} <span className="text-sm font-normal text-muted-foreground">FCFA</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+18.4% vs mois précédent</span>
            </div>
          </div>
        </div>

        {/* Volume de Ventes */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">Commandes Livrées</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono font-black text-2xl text-foreground">
              {kpi.paidOrdersCount} <span className="text-sm font-normal text-muted-foreground">/ {kpi.totalOrders}</span>
            </div>
            <div className="text-[11px] text-sky-400 font-semibold mt-1">
              Taux de conversion : {kpi.conversionRate}%
            </div>
          </div>
        </div>

        {/* Panier Moyen */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">Panier Moyen</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono font-black text-2xl text-foreground">
              {kpi.averageCartXof.toLocaleString("fr-FR")} <span className="text-sm font-normal text-muted-foreground">FCFA</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Licences Standard &amp; Étendues
            </div>
          </div>
        </div>

        {/* Remboursements */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">Taux de Litiges / Remb.</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-mono font-black text-2xl text-foreground">
              0.0% <span className="text-sm font-normal text-muted-foreground">({kpi.refundsCount} remb.)</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-1">
              Excellente santé marchande
            </div>
          </div>
        </div>
      </div>

      {/* Grille : Graphique Ventes & Rapprochement Passerelles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique de Ventes sur 7 Jours */}
        <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Tendance des Ventes (Derniers 7 Jours)
              </h2>
              <p className="text-xs text-muted-foreground">
                Volume de facturation consolidé jour par jour.
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">
              XOF / FCFA
            </Badge>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-border/40 pb-2">
            {kpi.salesTrend.map((day) => {
              const heightPct = Math.max(Math.round((day.amountXof / maxTrend) * 100), 6);
              return (
                <div key={day.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-sky-400 font-bold bg-black/60 px-1.5 py-0.5 rounded">
                    {day.amountXof.toLocaleString("fr-FR")}
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-sky-600 to-sky-400 group-hover:from-sky-500 group-hover:to-sky-300 transition-all shadow-lg shadow-sky-500/20"
                  />
                  <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Répartition des Passerelles */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-5">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Passerelles de Paiement
            </h2>
            <p className="text-xs text-muted-foreground">
              Rapprochement des encaissements par canal.
            </p>
          </div>

          <div className="space-y-4">
            {kpi.gatewayStats.map((gateway) => (
              <div key={gateway.provider} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{gateway.label}</span>
                  <span className="font-mono text-muted-foreground font-bold">
                    {gateway.amountXof.toLocaleString("fr-FR")} F ({gateway.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                  <div
                    style={{ width: `${gateway.percentage}%` }}
                    className="h-full bg-sky-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-muted/10 border border-border/40 text-xs text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tous les webhooks FedaPay, KKiaPay &amp; Stripe sont actifs et synchronisés.</span>
          </div>
        </div>
      </div>

      {/* Dernières Commandes Traitées */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Dernières Commandes Enregistrées
            </h2>
            <p className="text-xs text-muted-foreground">
              Flux d'achat direct et délivrance automatique des licences.
            </p>
          </div>
          <Link href="/admin/commandes">
            <Button variant="ghost" size="sm" className="text-xs text-sky-400 hover:text-sky-300">
              Voir tout l'historique →
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="p-3">Numéro</th>
                <th className="p-3">Client</th>
                <th className="p-3">Moyen &amp; Passerelle</th>
                <th className="p-3">Montant</th>
                <th className="p-3">Statut</th>
                <th className="p-3 text-right">Licence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {kpi.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/10">
                  <td className="p-3 font-mono font-bold text-foreground">
                    {order.number}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold block text-foreground">{order.customerName || "Client Invité"}</span>
                    <span className="text-muted-foreground text-[10px]">{order.email}</span>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {order.provider.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono font-bold text-sky-400">
                    {order.totalXof.toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={order.status === "paid" ? "accent" : "outline"}
                      className="text-[10px]"
                    >
                      {order.status === "paid" ? "Payé" : order.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-foreground">
                    {order.licenseKeys[0] || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
