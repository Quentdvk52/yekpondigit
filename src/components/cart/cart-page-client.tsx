"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Tag,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useCart, type CartAddon } from "@/contexts/cart-context";
import { useCurrency } from "@/contexts/currency-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { validateCouponAction } from "@/app/actions/coupon-actions";

const COMMON_ADDONS: CartAddon[] = [
  {
    id: "addon_installation",
    name: "Déploiement & Configuration Clé en Main sur votre Serveur",
    priceXof: 50000,
  },
  {
    id: "addon_support_extended",
    name: "Extension Support Développeur Prioritaire (+6 Mois)",
    priceXof: 30000,
  },
];

export function CartPageClient() {
  const {
    items,
    coupon,
    removeItem,
    updateLicense,
    toggleAddon,
    applyCoupon,
    removeCoupon,
    subtotalXof,
    discountXof,
    totalXof,
    itemCount,
  } = useCart();

  const { format, currency } = useCurrency();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const res = await validateCouponAction(couponInput, subtotalXof);
      if (res.success && res.coupon) {
        applyCoupon(res.coupon);
        setCouponInput("");
      } else {
        setCouponError(res.error || "Code promo invalide.");
      }
    } catch {
      setCouponError("Une erreur est survenue lors de la vérification.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          icon={<ShoppingCart className="w-7 h-7" />}
          title="Votre panier est actuellement vide"
          description="Vous n'avez sélectionné aucun projet logiciel pour le moment. Explorez notre catalogue pour trouver la solution prête à déployer qui propulsera votre activité."
          action={
            <Link href="/boutique">
              <Button size="lg" className="gap-2 font-bold">
                Explorer la boutique de logiciels
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/80">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-sky-400" />
            <span>Mon Panier ({itemCount})</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vérifiez vos licences et options avant de passer au règlement sécurisé.
          </p>
        </div>

        <Link href="/boutique">
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="w-4 h-4" />
            Continuer mes achats
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Colonne Gauche : Liste des articles */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => {
            const itemAddonsTotal = item.addons.reduce((sum, a) => sum + a.priceXof, 0);
            const itemLineTotal = (item.unitPriceXof + itemAddonsTotal) * item.quantity;

            return (
              <div
                key={`${item.productId}-${item.licenseCode}`}
                className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-md transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Miniature Produit */}
                  <div className="relative w-full sm:w-36 aspect-[16/10] sm:aspect-square shrink-0 overflow-hidden rounded-xl bg-muted/40 border border-border/60">
                    <img
                      src={
                        item.coverImage ||
                        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80"
                      }
                      alt={item.productTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Détails Produit & Licence */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/produit/${item.productSlug}`}
                          className="font-bold text-base sm:text-lg text-foreground hover:text-sky-400 transition-colors line-clamp-1"
                        >
                          {item.productTitle}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                            Code Source 100% Inclus
                          </Badge>
                          <span className="text-xs text-muted-foreground">• Mises à jour 12 mois</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.licenseCode)}
                        aria-label="Supprimer cet article"
                        className="p-2 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sélecteur de Licence */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <span className="text-xs text-muted-foreground font-semibold">Licence :</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.licenseCode !== "standard") {
                              // On rétablit le prix standard proportionnel
                              const stdPrice = Math.round(item.unitPriceXof / 2.5);
                              updateLicense(
                                item.productId,
                                item.licenseCode,
                                "standard",
                                "Licence Standard (1 Domaine / Projet)",
                                stdPrice
                              );
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            item.licenseCode === "standard"
                              ? "bg-primary/10 border-primary text-primary"
                              : "border-border/60 hover:bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          Standard (1 Domaine)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (item.licenseCode !== "extended") {
                              const extPrice = Math.round(item.unitPriceXof * 2.5);
                              updateLicense(
                                item.productId,
                                item.licenseCode,
                                "extended",
                                "Licence Étendue (Usage Illimité / SaaS)",
                                extPrice
                              );
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            item.licenseCode === "extended"
                              ? "bg-primary/10 border-primary text-primary"
                              : "border-border/60 hover:bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          Étendue (Illimité / SaaS)
                        </button>
                      </div>
                    </div>

                    {/* Prix unitaire */}
                    <div className="flex items-baseline justify-between pt-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        Prix unitaire : {format(item.unitPriceXof)}
                      </span>
                      <span className="font-extrabold text-base sm:text-lg text-white font-mono">
                        {format(itemLineTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Options Additionnelles (Add-ons recommandés) */}
                <div className="border-t border-border/50 pt-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Options Recommandées pour ce logiciel</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {COMMON_ADDONS.map((addon) => {
                      const isChecked = item.addons.some((a) => a.id === addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isChecked
                              ? "border-sky-500/60 bg-sky-500/5 text-sky-200"
                              : "border-border/60 bg-muted/10 hover:bg-muted/20 text-muted-foreground"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddon(item.productId, item.licenseCode, addon)}
                            className="mt-0.5 rounded border-border text-sky-500 focus:ring-sky-500"
                          />
                          <div className="flex-1">
                            <span className="font-semibold block text-white/90 leading-tight">
                              {addon.name}
                            </span>
                            <span className="font-mono text-[11px] text-sky-400 font-bold">
                              +{format(addon.priceXof)}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Colonne Droite : Récapitulatif & Commande */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xl space-y-6 sticky top-24">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight border-b border-border/60 pb-3">
              Récapitulatif de Commande
            </h2>

            {/* Code Promo / Coupon */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-sky-400" />
                <span>Code Promo / Réduction</span>
              </label>

              {coupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="font-mono font-bold tracking-wider">{coupon.code}</span>
                      <span className="block text-[10px] text-emerald-300">
                        {coupon.discountType === "percentage"
                          ? `-${coupon.value}% de réduction appliquée`
                          : `-${format(coupon.value)} de remise`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <Input
                    placeholder="Ex : BIENVENUE10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="h-10 text-xs font-mono uppercase"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="h-10 px-4 text-xs font-bold shrink-0"
                  >
                    {isApplyingCoupon ? "..." : "Appliquer"}
                  </Button>
                </form>
              )}

              {couponError && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponError}</span>
                </p>
              )}
            </div>

            {/* Lignes de décomposition du prix */}
            <div className="space-y-2.5 pt-3 border-t border-border/60 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total HT</span>
                <span className="font-mono font-medium text-foreground">{format(subtotalXof)}</span>
              </div>

              {discountXof > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span className="flex items-center gap-1">
                    <span>Remise ({coupon?.code})</span>
                  </span>
                  <span className="font-mono font-bold">-{format(discountXof)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground text-xs">
                <span>TVA / Taxes applicables</span>
                <span className="font-mono">Incluses (0% B2B)</span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-border/80">
                <span className="text-base font-bold text-foreground">Total à Payer</span>
                <div className="text-right">
                  <div className="text-2xl font-black text-sky-400 font-mono">
                    {format(totalXof)}
                  </div>
                  {currency !== "XOF" && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      (Équivalent {totalXof.toLocaleString("fr-FR")} FCFA)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bouton Checkout */}
            <Link href="/commande" className="block w-full">
              <Button size="lg" className="w-full h-12 text-sm sm:text-base font-bold gap-2 shadow-lg shadow-sky-500/20">
                Passer la Commande
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            {/* Réassurances Garanties */}
            <div className="space-y-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Livraison & accès aux archives zip instantanés</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Garantie Satisfait ou Remboursé sous 14 jours</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Support d'installation & documentation PDF inclus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
