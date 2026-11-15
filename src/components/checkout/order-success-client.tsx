"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  Key,
  ShieldCheck,
  FileText,
  ArrowRight,
  ExternalLink,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfettiCelebration } from "@/components/three/confetti-celebration";

interface OrderSuccessClientProps {
  order: {
    id: string;
    number: string;
    email: string;
    totalXof: number;
    displayTotal: number;
    displayCurrency: string;
    paidAt: string | null;
  };
  items: {
    id: string;
    productId: string;
    productTitle: string;
    licenseCode: string;
    unitPriceXof: number;
  }[];
  licenses: {
    id: string;
    key: string;
    licenseCode: string;
    maxDomains: number;
    productId: string;
  }[];
}

export function OrderSuccessClient({
  order,
  items,
  licenses,
}: OrderSuccessClientProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <ConfettiCelebration />
      {/* Carte Succès Hero */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-slate-900/60 to-slate-950 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Commande Validée &amp; Livrée</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Merci pour votre confiance !
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Votre commande <strong className="text-white font-mono">{order.number}</strong> est validée. Un email de confirmation complet a été envoyé à{" "}
            <strong className="text-sky-400">{order.email}</strong>.
          </p>
        </div>

        {/* Détails Commande Flash */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">N° Commande</span>
            <span className="font-mono font-bold text-white text-xs">{order.number}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Date</span>
            <span className="text-white text-xs">
              {order.paidAt ? new Date(order.paidAt).toLocaleDateString("fr-FR") : "Aujourd'hui"}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Montant Réglé</span>
            <span className="font-mono font-bold text-sky-400 text-xs">
              {order.totalXof.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Statut</span>
            <span className="font-bold text-emerald-400 text-xs">Payé &amp; Actif</span>
          </div>
        </div>
      </div>

      {/* Vos Licences et Téléchargements Immédiats */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
            <Key className="w-6 h-6 text-sky-400" />
            <span>Vos Clés de Licence &amp; Livrables</span>
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {items.length} logiciel(s) prêt(s) à déployer
          </span>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => {
            const license = licenses[idx] || licenses.find((l) => l.productId === item.productId);
            const licenseKey = license?.key || "YD26-LIVE-DEMO-XXXX";

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {item.productTitle}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        Licence {item.licenseCode === "standard" ? "Standard (1 site)" : "Étendue (illimitée)"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Code Source Complet Inclus</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/compte/telechargements?order=${order.number}`}>
                      <Button size="sm" className="gap-2 text-xs font-bold shadow-md shadow-sky-500/20">
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger les sources (.zip)</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Box de la Clé de Licence */}
                <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Clé de Licence Officielle YEKPON DIGIT</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Active &amp; Signée HMAC</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/10 rounded-lg p-2.5">
                    <code className="font-mono font-black text-sm sm:text-base text-sky-400 tracking-wider">
                      {licenseKey}
                    </code>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(licenseKey)}
                      className="h-8 px-2.5 text-xs gap-1.5 hover:bg-white/10"
                    >
                      {copiedKey === licenseKey ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copié !</span>
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
            );
          })}
        </div>
      </div>

      {/* Prochaines Étapes & Réassurances */}
      <div className="rounded-2xl border border-border/80 bg-muted/10 p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-foreground">Prochaines Étapes pour votre Projet</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
            <div className="font-bold text-foreground flex items-center gap-2">
              <Download className="w-4 h-4 text-sky-400" />
              <span>1. Décompressez l'Archive</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Téléchargez le fichier .zip contenant le code source complet, les configurations d'environnement et les schémas SQL.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
            <div className="font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>2. Suivez le Guide PDF</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Consultez la documentation d'installation pas-à-pas incluse dans l'archive pour configurer vos dépendances et déployer en quelques minutes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card space-y-2">
            <div className="font-bold text-foreground flex items-center gap-2">
              <Laptop className="w-4 h-4 text-amber-400" />
              <span>3. Support Technique</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Besoin d'aide pour le déploiement ou une personnalisation ? Notre équipe d'ingénieurs est joignable à <strong>support@yekpondigit.com</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
          <Link href="/boutique">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              Explorer d'autres projets logiciels
            </Button>
          </Link>
          <Link href="/aide">
            <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground">
              <span>Centre d'aide &amp; FAQ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
