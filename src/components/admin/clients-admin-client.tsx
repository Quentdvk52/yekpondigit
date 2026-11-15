"use client";

import { useState, useTransition } from "react";
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Ban,
  CheckCircle2,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toggleCustomerBlockAction } from "@/app/actions/admin-actions";
import type { AdminCustomerItem } from "@/server/repositories/admin-repository";

interface ClientsAdminClientProps {
  initialCustomers: AdminCustomerItem[];
}

export function ClientsAdminClient({ initialCustomers }: ClientsAdminClientProps) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  });

  const handleToggleBlock = (userId: string, currentBlocked: boolean) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await toggleCustomerBlockAction({
        userId,
        isBlocked: !currentBlocked,
      });

      if (res.success) {
        setFeedback({ type: "success", text: res.message! });
        setCustomers((prev) =>
          prev.map((c) => (c.id === userId ? { ...c, isBlocked: !currentBlocked } : c))
        );
      } else {
        setFeedback({ type: "error", text: res.error || "Erreur" });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Users className="w-4 h-4" />
            <span>Base Clients &amp; Comptes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
            Utilisateurs, Commandes &amp; Sécurité des Accès
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gérez vos clients enregistrés, analysez leurs dépenses et suspendez les comptes suspects.
          </p>
        </div>

        <span className="font-mono text-xs text-muted-foreground">
          {filtered.length} client(s)
        </span>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-red-500/15 text-red-400 border border-red-500/30"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Barre de Recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, email, téléphone..."
          className="pl-10 h-10"
        />
      </div>

      {/* Tableau des Clients */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Téléphone &amp; Pays</th>
                <th className="p-4">Commandes</th>
                <th className="p-4">Dépenses Totales</th>
                <th className="p-4">Statut Compte</th>
                <th className="p-4">Inscrit le</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-foreground block text-sm">{customer.fullName}</span>
                    <span className="text-muted-foreground text-[11px]">{customer.email}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-foreground block">{customer.phone || "—"}</span>
                    <span className="text-muted-foreground text-[10px]">{customer.country}</span>
                  </td>
                  <td className="p-4 font-mono font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
                      <span>{customer.ordersCount}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-sky-400">
                    {customer.totalSpentXof.toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="p-4">
                    {customer.isBlocked ? (
                      <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/30 bg-red-500/10">
                        Compte Suspendu
                      </Badge>
                    ) : (
                      <Badge variant="accent" className="text-[10px]">
                        Actif
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground font-mono">
                    {new Date(customer.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleToggleBlock(customer.id, customer.isBlocked)}
                      className={`h-8 text-[11px] gap-1.5 ${
                        customer.isBlocked
                          ? "text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30"
                          : "text-red-400 hover:bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      {customer.isBlocked ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Réactiver</span>
                        </>
                      ) : (
                        <>
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspendre</span>
                        </>
                      )}
                    </Button>
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
