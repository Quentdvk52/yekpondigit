"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
  KeyRound,
  ExternalLink,
  ShieldCheck,
  ShoppingCart,
  Copy,
  Check,
  X,
  Play,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type ProductDetail } from "@/server/repositories/product-repository";
import { getDemoCredentialsAction } from "@/app/actions/demo-actions";

type DeviceType = "desktop" | "tablet" | "mobile";

export interface DemoViewerClientProps {
  product: ProductDetail;
}

export function DemoViewerClient({ product }: DemoViewerClientProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState<Record<string, string> | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoadingCreds, setIsLoadingCreds] = useState(false);

  const activeDemo = product.demos[selectedDemoIndex] ?? product.demos[0];

  const handleOpenCredentials = async () => {
    setShowCredentialsModal(true);
    if (!credentials && activeDemo) {
      setIsLoadingCreds(true);
      const res = await getDemoCredentialsAction(activeDemo.id);
      if (res.success && res.credentials) {
        setCredentials(res.credentials);
      }
      setIsLoadingCreds(false);
    }
  };

  const copyToClipboard = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Largeurs du cadre selon l'appareil
  const deviceContainerClasses = {
    desktop: "w-full h-full max-w-full",
    tablet: "w-[768px] h-[95%] rounded-3xl border-8 border-zinc-800 shadow-2xl",
    mobile: "w-[375px] h-[780px] rounded-[40px] border-8 border-zinc-800 shadow-2xl",
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-950 text-white overflow-hidden select-none">
      {/* 1. Barre d'outils supérieure */}
      <header className="z-50 flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-card/95 px-4 backdrop-blur-md">
        {/* Gauche : Retour et Titre */}
        <div className="flex items-center gap-3">
          <Link href={`/produit/${product.slug}`}>
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Quitter la Démo</span>
            </Button>
          </Link>

          <div className="hidden md:block h-4 w-px bg-border/60" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground truncate max-w-[200px] sm:max-w-xs">
              {product.title_fr}
            </span>
            <Badge variant="accent" className="hidden lg:inline-flex text-[10px]">
              Bac à Sable Isolé
            </Badge>
          </div>
        </div>

        {/* Centre : Sélecteur d'Appareil */}
        <div className="flex items-center rounded-lg border border-border/60 bg-muted/30 p-0.5">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              device === "desktop" ? "bg-primary text-black font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Vue Ordinateur (Plein écran)"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              device === "tablet" ? "bg-primary text-black font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Vue Tablette (768px)"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tablette</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              device === "mobile" ? "bg-primary text-black font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Vue Smartphone (375px)"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Droite : Accès Démo & Commander */}
        <div className="flex items-center gap-2">
          {product.demos.length > 1 && (
            <select
              value={selectedDemoIndex}
              onChange={(e) => setSelectedDemoIndex(parseInt(e.target.value, 10))}
              className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
            >
              {product.demos.map((d, idx) => (
                <option key={d.id} value={idx}>
                  {d.title}
                </option>
              ))}
            </select>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenCredentials}
            className="h-9 gap-1.5 text-xs text-amber-300 border-amber-500/30 hover:bg-amber-500/10"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Identifiants Démo</span>
          </Button>

          <Link href={`/produit/${product.slug}`}>
            <Button size="sm" className="h-9 gap-1.5 text-xs font-bold bg-primary text-black hover:bg-primary/90">
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Commander</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Zone de Visualisation Centrale */}
      <main className="relative flex flex-1 items-center justify-center bg-zinc-950 p-2 sm:p-6 overflow-hidden">
        {/* Bandeau d'Avertissement de Sécurité */}
        <div className="absolute top-2 z-20 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-[11px] text-amber-300 backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          <span>Environnement Bac à Sable — Données de démonstration réinitialisées régulièrement.</span>
        </div>

        {/* Conteneur d'affichage selon le Device */}
        <div
          className={`relative flex items-center justify-center transition-all duration-300 overflow-hidden bg-black ${deviceContainerClasses[device]}`}
        >
          {activeDemo ? (
            activeDemo.kind === "video" ? (
              <div className="flex h-full w-full items-center justify-center bg-black">
                <video
                  src={activeDemo.url}
                  controls
                  autoPlay
                  loop
                  className="max-h-full max-w-full rounded-lg"
                />
              </div>
            ) : (
              <iframe
                src={activeDemo.url}
                title={activeDemo.title}
                sandbox="allow-scripts allow-forms allow-same-origin"
                className="h-full w-full border-0 bg-background"
                loading="lazy"
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <Layers className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-sm">Aucune démonstration active trouvée pour ce projet.</p>
            </div>
          )}
        </div>
      </main>

      {/* 3. Modal d'affichage des identifiants démo */}
      {showCredentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-base text-foreground">Identifiants d&apos;Accès Démo</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCredentialsModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Utilisez ces identifiants pour vous connecter à l&apos;instance de test en lecture seule :
            </p>

            {isLoadingCreds ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Chargement des accès sécurisés...
              </div>
            ) : credentials ? (
              <div className="space-y-3">
                {Object.entries(credentials).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground">{key}</div>
                      <div className="font-mono text-sm text-foreground font-bold">{val}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(key, val)}
                      className="h-8 w-8 p-0"
                      title="Copier"
                    >
                      {copiedKey === key ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">Aucun identifiant spécifique requis.</div>
            )}

            <Button
              type="button"
              onClick={() => setShowCredentialsModal(false)}
              className="w-full mt-6 text-xs h-10"
            >
              J&apos;ai compris, retour à la démo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
