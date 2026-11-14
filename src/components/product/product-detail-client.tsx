"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Code2,
  Download,
  HelpCircle,
  Eye,
  ArrowRight,
  Check,
  Sparkles,
  Smartphone,
  ExternalLink,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/ui/price-tag";
import { Rating } from "@/components/ui/rating";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { type ProductDetail } from "@/server/repositories/product-repository";

export interface ProductDetailClientProps {
  product: ProductDetail;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedLicenseCode, setSelectedLicenseCode] = useState<string>("standard");

  const currentLicense =
    product.licenses.find((l) => l.code === selectedLicenseCode) ?? product.licenses[0];

  const standardPrice = product.base_price_xof;
  const currentPrice = currentLicense?.price_xof ?? standardPrice;

  const mainDemo = product.demos[0];

  return (
    <div className="space-y-12">
      {/* Grille Principale : Galerie & Infos à gauche, Box d'Achat Sticky à droite */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Colonne Gauche : Aperçu visuel et Badges */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/80 bg-muted/30 shadow-lg">
            <img
              src={
                product.media[0]?.url ??
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80"
              }
              alt={product.title_fr}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <Badge variant="accent" className="capitalize text-xs font-semibold px-3 py-1">
                {product.type.replace("_", " ")}
              </Badge>
              {product.is_featured && (
                <Badge variant="warning" className="text-xs font-bold px-3 py-1">
                  ⭐ Vedette
                </Badge>
              )}
            </div>

            <div className="absolute bottom-4 right-4">
              <span className="rounded-lg bg-black/80 px-3 py-1.5 font-mono text-xs text-zinc-200 backdrop-blur-md border border-white/10">
                Version v{product.current_version}
              </span>
            </div>
          </div>

          {/* Badges de Confiance Technique */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
              <Code2 className="mx-auto h-5 w-5 text-emerald-400 mb-1" />
              <div className="text-xs font-bold text-foreground">Code Source</div>
              <div className="text-[10px] text-muted-foreground">100% Inclus</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
              <ShieldCheck className="mx-auto h-5 w-5 text-primary mb-1" />
              <div className="text-xs font-bold text-foreground">Licence Officielle</div>
              <div className="text-[10px] text-muted-foreground">Certifiée HMAC</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
              <Download className="mx-auto h-5 w-5 text-sky-400 mb-1" />
              <div className="text-xs font-bold text-foreground">Téléchargement</div>
              <div className="text-[10px] text-muted-foreground">Instantané S3</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
              <Sparkles className="mx-auto h-5 w-5 text-amber-400 mb-1" />
              <div className="text-xs font-bold text-foreground">Mises à Jour</div>
              <div className="text-[10px] text-muted-foreground">12 Mois Incluses</div>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Box d'Achat Sticky */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Rating score={Number(product.rating_avg) || 5.0} count={product.rating_count} />
                <span className="text-xs text-muted-foreground font-mono">
                  {product.sales_count} clients satisfaits
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {product.title_fr}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {product.summary_fr}
              </p>
            </div>

            {/* Sélecteur de Licence */}
            <div className="border-t border-border/60 pt-4 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Choisissez votre Licence d&apos;Exploitation
              </label>

              <div className="space-y-2">
                {product.licenses.map((lic) => {
                  const isSelected = lic.code === selectedLicenseCode;
                  return (
                    <button
                      key={lic.code}
                      type="button"
                      onClick={() => setSelectedLicenseCode(lic.code)}
                      className={`w-full text-left rounded-xl border p-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border/60 bg-card hover:bg-muted/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-4 w-4 rounded-full border items-center justify-center ${
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                            }`}
                          >
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-black" />}
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-foreground">
                            {lic.name}
                          </span>
                        </div>
                        <div className="font-mono text-xs sm:text-sm font-bold text-primary">
                          {lic.price_xof.toLocaleString("fr-FR")} FCFA
                        </div>
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground pl-6">
                        {lic.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Affichage du Prix Global */}
            <div className="border-t border-border/60 pt-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-semibold">
                  Montant à Régler
                </span>
                <div className="mt-0.5">
                  <PriceTag
                    amountXof={currentPrice}
                    salePriceXof={
                      selectedLicenseCode === "standard" ? product.sale_price_xof : null
                    }
                    size="xl"
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Paiement unique sans abonnement</span>
            </div>

            {/* Boutons d'Action Principaux */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/commande?product=${product.id}&license=${selectedLicenseCode}`}
                className="w-full block"
              >
                <Button size="lg" className="w-full h-12 text-sm sm:text-base font-bold gap-2">
                  Commander cette Solution
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              {mainDemo && (
                <a href="#demo" className="w-full block">
                  <Button variant="outline" size="lg" className="w-full h-11 text-xs sm:text-sm gap-2">
                    <Eye className="h-4 w-4" />
                    Tester la Démo Interactive
                  </Button>
                </a>
              )}
            </div>

            {/* Réassurance Paiement */}
            <div className="border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
              <span>💳 Paiement sécurisé par </span>
              <strong className="text-foreground">MTN MoMo, Moov Money, Celtiis Cash &amp; Cartes</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Zone de Démonstration Interactive */}
      {mainDemo && (
        <section id="demo" className="scroll-mt-24 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Laptop className="h-4 w-4" />
                Démonstration Interactive
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {mainDemo.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {mainDemo.notes ?? "Explorez l'interface complète en direct."}
              </p>
            </div>

            <a href={mainDemo.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                Ouvrir en plein écran
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>

          {/* Iframe Sandboxée Hermétique */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-slate-950 shadow-inner">
            <iframe
              src={mainDemo.url}
              title={`Démo ${product.title_fr}`}
              sandbox="allow-scripts allow-forms allow-same-origin"
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>

          <div className="mt-3 text-center text-[11px] text-muted-foreground">
            🔒 Démonstration exécutée en environnement sandbox isolé conforme OWASP ASVS.
          </div>
        </section>
      )}

      {/* 3. Onglets de Détails Techniques */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-md">
        <Tabs defaultValue="desc">
          <TabsList className="flex flex-wrap w-full justify-start mb-6">
            <TabsTrigger value="desc">Description Complète</TabsTrigger>
            <TabsTrigger value="stack">Stack &amp; Prérequis</TabsTrigger>
            <TabsTrigger value="includes">Contenu Inclus</TabsTrigger>
            <TabsTrigger value="changelog">Historique des Versions</TabsTrigger>
          </TabsList>

          <TabsContent value="desc">
            <div className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed text-zinc-300 py-4 space-y-4">
              <div dangerouslySetInnerHTML={{ __html: product.description_fr.replace(/\n/g, "<br/>") }} />
            </div>
          </TabsContent>

          <TabsContent value="stack">
            <div className="py-4 space-y-6 text-sm">
              <div>
                <h3 className="font-bold text-foreground mb-3">Technologies Clés</h3>
                <div className="flex flex-wrap gap-2">
                  {product.stack.map((s, idx) => (
                    <Badge key={idx} variant="outline" className="px-3 py-1 font-mono text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-3">Prérequis Système &amp; Serveur</h3>
                <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                  {product.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-3">Plateformes Supportées</h3>
                <div className="flex flex-wrap gap-2">
                  {product.platforms.map((p, idx) => (
                    <Badge key={idx} variant="accent" className="capitalize text-xs">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="includes">
            <div className="py-4 space-y-3">
              <h3 className="font-bold text-foreground mb-3">Ce que vous recevez immédiatement :</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.includes.map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-muted/20 p-3 text-xs sm:text-sm">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="changelog">
            <div className="py-4 space-y-4">
              {product.versions.map((ver) => (
                <div key={ver.id} className="rounded-xl border border-border/60 bg-muted/10 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-primary text-base">v{ver.version}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(ver.released_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 font-mono whitespace-pre-wrap">
                    {ver.changelog_md ?? "Version initiale officielle."}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* 4. Barre d'Achat Sticky Mobile (uniquement affichée sur mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-slate-950/95 p-3 backdrop-blur-lg sm:hidden flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Total</span>
          <div className="font-mono font-bold text-base text-white">
            {currentPrice.toLocaleString("fr-FR")} FCFA
          </div>
        </div>
        <Link href={`/commande?product=${product.id}&license=${selectedLicenseCode}`}>
          <Button size="sm" className="h-10 px-5 text-xs font-bold gap-1.5">
            Commander
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
