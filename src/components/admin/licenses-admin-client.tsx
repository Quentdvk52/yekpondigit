"use client";

import { useState, useTransition } from "react";
import {
  Key,
  Search,
  Globe,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Ban,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { updateLicenseStatusAction, resetLicenseDomainsAction } from "@/app/actions/admin-actions";
import type { AdminLicenseItem } from "@/server/repositories/admin-repository";

interface LicensesAdminClientProps {
  initialLicenses: AdminLicenseItem[];
}

export function LicensesAdminClient({ initialLicenses }: LicensesAdminClientProps) {
  const [licenses, setLicenses] = useState(initialLicenses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filtered = licenses.filter((lic) => {
    const q = search.toLowerCase();
    const matchesSearch =
      lic.key.toLowerCase().includes(q) ||
      lic.buyerEmail.toLowerCase().includes(q) ||
      lic.productTitle.toLowerCase().includes(q) ||
      lic.domains.some((d) => d.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "all" || lic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleStatus = (licenseId: string, currentStatus: "active" | "revoked" | "expired") => {
    const newStatus = currentStatus === "active" ? "revoked" : "active";
    setFeedback(null);

    startTransition(async () => {
      const res = await updateLicenseStatusAction({
        licenseId,
        status: newStatus,
        reason: newStatus === "revoked" ? "Révocation manuelle par l'administrateur" : undefined,
      });

      if (res.success) {
        setFeedback({ type: "success", text: res.message! });
        setLicenses((prev) =>
          prev.map((l) => (l.id === licenseId ? { ...l, status: newStatus } : l))
        );
      } else {
        setFeedback({ type: "error", text: res.error || "Erreur" });
      }
    });
  };

  const handleResetDomains = (licenseId: string) => {
    setFeedback(null);

    startTransition(async () => {
      const res = await resetLicenseDomainsAction({ licenseId });
      if (res.success) {
        setFeedback({ type: "success", text: res.message! });
        setLicenses((prev) =>
          prev.map((l) => (l.id === licenseId ? { ...l, domains: [] } : l))
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
            <Key className="w-4 h-4" />
            <span>Gestion des Licences Logicielles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
            Clés Cryptographiques &amp; Domaines Autorisés
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Surveillance des activations HMAC, révocations d'urgence et libération de slots domaines.
          </p>
        </div>

        <span className="font-mono text-xs text-muted-foreground">
          {filtered.length} licence(s)
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

      {/* Barre de Recherche et Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par clé YD26-..., email acheteur, domaine..."
            className="pl-10 h-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "active", "revoked", "expired"].map((st) => (
            <Button
              key={st}
              size="sm"
              variant={statusFilter === st ? "primary" : "outline"}
              onClick={() => setStatusFilter(st)}
              className="text-xs capitalize h-10"
            >
              {st === "all" ? "Toutes" : st === "active" ? "Actives" : st === "revoked" ? "Révoquées" : "Expirées"}
            </Button>
          ))}
        </div>
      </div>

      {/* Tableau des Licences */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="p-4">Clé de Licence</th>
                <th className="p-4">Produit Associé</th>
                <th className="p-4">Acheteur</th>
                <th className="p-4">Domaines Activés</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Émise le</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((lic) => (
                <tr key={lic.id} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-mono font-bold text-foreground">
                    <button
                      onClick={() => handleCopy(lic.key)}
                      className="flex items-center gap-1.5 text-sky-400 hover:underline"
                    >
                      <span>{lic.key}</span>
                      {copiedKey === lic.key ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold block text-foreground">{lic.productTitle}</span>
                    <span className="text-muted-foreground text-[10px] capitalize">
                      Licence {lic.licenseCode}
                    </span>
                  </td>
                  <td className="p-4 text-foreground font-medium">
                    {lic.buyerEmail}
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {lic.domains.length} / {lic.maxDomains} max
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {lic.domains.length > 0 ? (
                          lic.domains.map((dom) => (
                            <Badge key={dom} variant="outline" className="text-[9px] font-mono">
                              {dom}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-[10px] italic">Aucun domaine enregistré</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        lic.status === "active"
                          ? "accent"
                          : lic.status === "revoked"
                          ? "danger"
                          : "default"
                      }
                      className="text-[10px]"
                    >
                      {lic.status === "active" ? "Active" : lic.status === "revoked" ? "Révoquée" : "Expirée"}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground font-mono">
                    {new Date(lic.issuedAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {lic.domains.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isPending}
                          onClick={() => handleResetDomains(lic.id)}
                          className="h-8 text-[11px] gap-1 text-amber-400 hover:text-amber-300"
                          title="Vider la liste des domaines autorisés"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Domaines</span>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleToggleStatus(lic.id, lic.status)}
                        className={`h-8 text-[11px] gap-1 ${
                          lic.status === "active"
                            ? "text-red-400 hover:bg-red-500/10 border-red-500/30"
                            : "text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30"
                        }`}
                      >
                        {lic.status === "active" ? (
                          <>
                            <Ban className="w-3 h-3" />
                            <span>Révoquer</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3" />
                            <span>Réactiver</span>
                          </>
                        )}
                      </Button>
                    </div>
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
