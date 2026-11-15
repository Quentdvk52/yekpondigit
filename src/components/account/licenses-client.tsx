"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  Globe,
  Plus,
  ShieldCheck,
  Download,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export interface LicenseItem {
  id: string;
  productTitle: string;
  productSlug: string;
  version: string;
  licenseCode: "standard" | "extended";
  licenseName: string;
  key: string;
  domains: string[];
  maxDomains: number;
  status: "active" | "suspended" | "revoked";
  issuedAt: string;
  supportUntil: string;
}

export function LicensesClient() {
  const [licenses, setLicenses] = useState<LicenseItem[]>([
    {
      id: "lic_1",
      productTitle: "YekponStore — E-Commerce Multivendeur Clé en Main",
      productSlug: "demo-yekpon-store-ecommerce",
      version: "v1.2.0",
      licenseCode: "standard",
      licenseName: "Licence Standard",
      key: "YD26-LIVE-9X82-K7M4",
      domains: ["boutique.monentreprise.bj"],
      maxDomains: 1,
      status: "active",
      issuedAt: "15 Janvier 2026",
      supportUntil: "15 Janvier 2027",
    },
    {
      id: "lic_2",
      productTitle: "SchoolDesk — SaaS Gestion Scolaire & Universitaire",
      productSlug: "demo-schooldesk-gestion-scolaire",
      version: "v2.0.1",
      licenseCode: "extended",
      licenseName: "Licence Étendue (Multi-Campus)",
      key: "YD26-SAAS-4F29-P1X8",
      domains: ["campus1.schooldesk.africa", "campus2.schooldesk.africa"],
      maxDomains: 999,
      status: "active",
      issuedAt: "20 Janvier 2026",
      supportUntil: "20 Janvier 2027",
    },
  ]);

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [addingDomainId, setAddingDomainId] = useState<string | null>(null);
  const [newDomainInput, setNewDomainInput] = useState("");

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleAddDomain = (licId: string) => {
    if (!newDomainInput.trim()) return;

    const cleanDomain = newDomainInput
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");

    setLicenses((prev) =>
      prev.map((lic) => {
        if (lic.id === licId) {
          if (lic.domains.includes(cleanDomain)) return lic;
          if (lic.domains.length >= lic.maxDomains) return lic;
          return { ...lic, domains: [...lic.domains, cleanDomain] };
        }
        return lic;
      })
    );

    setNewDomainInput("");
    setAddingDomainId(null);
  };

  const handleRemoveDomain = (licId: string, domainToRemove: string) => {
    setLicenses((prev) =>
      prev.map((lic) => {
        if (lic.id === licId) {
          return { ...lic, domains: lic.domains.filter((d) => d !== domainToRemove) };
        }
        return lic;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Key className="w-5 h-5 text-sky-400" />
            <span>Mes Licences d'Exploitation</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gérez vos clés d'activation officielles et assignez vos noms de domaine de production.
          </p>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {licenses.length} licence(s)
        </span>
      </div>

      <div className="space-y-5">
        {licenses.map((lic) => {
          const isVisible = Boolean(visibleKeys[lic.id]);
          const displayKey = isVisible
            ? lic.key
            : `${lic.key.slice(0, 4)}-••••-••••-${lic.key.slice(-4)}`;

          return (
            <div
              key={lic.id}
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-5"
            >
              {/* Entête Licence */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/produit/${lic.productSlug}`}
                      className="font-bold text-base text-foreground hover:text-sky-400 transition-colors"
                    >
                      {lic.productTitle}
                    </Link>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {lic.version}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{lic.licenseName}</span>
                    <span>•</span>
                    <span>Délivrée le {lic.issuedAt}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">Support jusqu'au {lic.supportUntil}</span>
                  </div>
                </div>

                <Badge variant="accent" className="text-xs font-bold gap-1 self-start sm:self-auto">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Certifiée HMAC</span>
                </Badge>
              </div>

              {/* Clé de Licence & Copie */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Clé d'Activation
                </span>
                <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/10 rounded-xl p-3">
                  <code className="font-mono font-bold text-sm sm:text-base text-sky-400 tracking-wider">
                    {displayKey}
                  </code>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility(lic.id)}
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(lic.key)}
                      className="h-8 px-2.5 text-xs gap-1.5 hover:bg-white/10"
                    >
                      {copiedKey === lic.key ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Copier</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Domaines Autorisés */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>Domaines Autorisés ({lic.domains.length} / {lic.maxDomains === 999 ? "Illimités" : lic.maxDomains})</span>
                  </span>

                  {lic.domains.length < lic.maxDomains && !addingDomainId && (
                    <button
                      type="button"
                      onClick={() => setAddingDomainId(lic.id)}
                      className="text-sky-400 hover:underline font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Ajouter un domaine</span>
                    </button>
                  )}
                </div>

                {addingDomainId === lic.id && (
                  <div className="flex gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                    <Input
                      placeholder="Ex : monsite.com"
                      value={newDomainInput}
                      onChange={(e) => setNewDomainInput(e.target.value)}
                      className="h-9 text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddDomain(lic.id)}
                      className="h-9 px-3 text-xs font-bold"
                    >
                      Enregistrer
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddingDomainId(null)}
                      className="h-9 px-2 text-xs"
                    >
                      Annuler
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {lic.domains.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">
                      Aucun domaine assigné. Le premier domaine qui activera la clé sera automatiquement rattaché.
                    </span>
                  ) : (
                    lic.domains.map((dom) => (
                      <span
                        key={dom}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/20 border border-border/60 text-xs font-mono text-zinc-200"
                      >
                        <span>{dom}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDomain(lic.id, dom)}
                          className="text-muted-foreground hover:text-rose-400 transition-colors ml-1"
                          title="Dissocier ce domaine"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Actions Téléchargement et Certificat */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
                <Link href="/compte/telechargements">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>Accéder aux Fichiers Sources</span>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => alert(`Certificat de licence pour ${lic.productTitle} délivré sous le numéro ${lic.key}`)}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Certificat de Licence PDF</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
