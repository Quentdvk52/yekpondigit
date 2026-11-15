"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, RefreshCw, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderStatusClientProps {
  orderId: string;
}

export function OrderStatusClient({ orderId }: OrderStatusClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState<string>("pending");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (!res.ok) {
          setError("Impossible de récupérer l'état de la commande.");
          return;
        }

        const data = await res.json();
        setStatus(data.status);
        if (data.number) setOrderNumber(data.number);

        if (data.isPaid || data.status === "paid") {
          // Redirection vers la page merci
          setTimeout(() => {
            router.push(`/commande/${orderId}/merci`);
          }, 1200);
          return;
        }

        if (data.status === "failed" || data.status === "cancelled") {
          return;
        }

        // Continuer le polling si toujours pending (jusqu'à 60 tentatives ~ 2.5 minutes)
        if (pollCount < 60) {
          timer = setTimeout(() => {
            setPollCount((prev) => prev + 1);
          }, 2500);
        }
      } catch (err) {
        console.error("Erreur polling statut :", err);
      }
    };

    checkStatus();

    return () => clearTimeout(timer);
  }, [orderId, pollCount, router]);

  return (
    <div className="container mx-auto max-w-xl px-4 py-20 sm:py-28 text-center space-y-8">
      {status === "paid" ? (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 sm:p-12 shadow-2xl space-y-6 animate-scaleUp">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Paiement Confirmé avec Succès !
            </h1>
            <p className="text-sm text-emerald-300">
              Votre commande {orderNumber} a été validée. Redirection vers vos téléchargements en cours...
            </p>
          </div>

          <Link href={`/commande/${orderId}/merci`} className="inline-block">
            <Button size="lg" className="gap-2 font-bold">
              <span>Voir mes licences &amp; fichiers</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ) : status === "failed" ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Paiement Non Validé
            </h1>
            <p className="text-sm text-muted-foreground">
              La transaction n'a pas pu aboutir ou a été interrompue. Aucun montant n'a été prélevé sur votre compte.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/commande">
              <Button size="lg" className="gap-2 font-bold w-full sm:w-auto">
                <RefreshCw className="w-4 h-4" />
                <span>Réessayer le paiement</span>
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Contacter le support
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Validation de votre Paiement...
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Nous vérifions la confirmation auprès de l'opérateur Mobile Money ou de votre banque. Cette étape prend généralement quelques secondes.
            </p>
          </div>

          {orderNumber && (
            <div className="inline-block px-3 py-1 rounded-full bg-muted/40 border border-border/60 text-xs font-mono text-muted-foreground">
              Commande : {orderNumber}
            </div>
          )}

          <div className="pt-4 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
            <span>Vérification automatique en temps réel</span>
          </div>
        </div>
      )}
    </div>
  );
}
