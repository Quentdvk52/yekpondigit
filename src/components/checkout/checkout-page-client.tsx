"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useCurrency } from "@/contexts/currency-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createOrderAction } from "@/app/actions/order-actions";

const COUNTRIES = [
  { code: "BJ", name: "Bénin (+229)", phonePrefix: "+229" },
  { code: "CI", name: "Côte d'Ivoire (+225)", phonePrefix: "+225" },
  { code: "TG", name: "Togo (+228)", phonePrefix: "+228" },
  { code: "SN", name: "Sénégal (+221)", phonePrefix: "+221" },
  { code: "BF", name: "Burkina Faso (+226)", phonePrefix: "+226" },
  { code: "ML", name: "Mali (+223)", phonePrefix: "+223" },
  { code: "NE", name: "Niger (+227)", phonePrefix: "+227" },
  { code: "CM", name: "Cameroun (+237)", phonePrefix: "+237" },
  { code: "FR", name: "France (+33)", phonePrefix: "+33" },
  { code: "US", name: "États-Unis (+1)", phonePrefix: "+1" },
  { code: "CA", name: "Canada (+1)", phonePrefix: "+1" },
];

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, coupon, subtotalXof, discountXof, totalXof, clearCart } = useCart();
  const { format, currency } = useCurrency();

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("BJ");
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "card" | "sandbox">("momo");
  const [cgvAccepted, setCgvAccepted] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!customerName.trim()) {
      setSubmitError("Veuillez saisir votre nom complet.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setSubmitError("Veuillez saisir une adresse email valide.");
      return;
    }

    if (!cgvAccepted) {
      setSubmitError("Veuillez accepter les conditions générales de vente.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createOrderAction({
        customerName,
        email,
        phone: phone || undefined,
        country,
        paymentMethod,
        displayCurrency: currency,
        couponCode: coupon?.code,
        cgvAccepted: true,
        items: items.map((item) => ({
          productId: item.productId,
          productSlug: item.productSlug,
          licenseCode: item.licenseCode,
          quantity: item.quantity,
          addons: item.addons,
        })),
      });

      if (!res.success) {
        setSubmitError(res.error || "Échec de l'initialisation de la commande.");
        setIsSubmitting(false);
        return;
      }

      // Vider le panier après création réussie
      clearCart();

      // Redirection vers l'URL retournée (passerelle ou statut)
      if (res.redirectUrl) {
        if (res.redirectUrl.startsWith("http://") || res.redirectUrl.startsWith("https://")) {
          window.location.href = res.redirectUrl;
        } else {
          router.push(res.redirectUrl);
        }
      } else {
        router.push(`/commande/${res.orderId}/statut`);
      }
    } catch (err) {
      setSubmitError("Une erreur inattendue est survenue lors de la validation.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-20 text-center space-y-5">
        <h1 className="text-2xl font-bold text-foreground">Votre panier est vide</h1>
        <p className="text-sm text-muted-foreground">
          Veuillez sélectionner au moins un projet logiciel avant d'accéder au paiement.
        </p>
        <Link href="/boutique">
          <Button size="lg" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retourner à la boutique
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-border/80">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <Lock className="w-7 h-7 text-sky-400" />
            <span>Paiement &amp; Finalisation de Commande</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Transmission sécurisée et chiffrée SSL 256-bit. Vos licences seront envoyées à l'adresse renseignée.
          </p>
        </div>

        <Link href="/panier">
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="w-4 h-4" />
            Modifier le panier
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Colonne Gauche : Formulaire de Facturation et Choix du Paiement */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1 : Informations Acheteur */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-black">
                1
              </span>
              <span>Coordonnées du Titulaire de la Licence</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Nom complet / Société <span className="text-rose-400">*</span>
                </label>
                <Input
                  required
                  placeholder="Ex : Koffi Mensah ou Tech SARL"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Adresse Email de Réception <span className="text-rose-400">*</span>
                </label>
                <Input
                  required
                  type="email"
                  placeholder="koffi@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
                <span className="text-[11px] text-muted-foreground">
                  Les liens de téléchargement S3 et certificats de licence HMAC seront envoyés à cette adresse.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Pays de Résidence / Facturation <span className="text-rose-400">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-border/80 bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Numéro de Téléphone (Mobile Money)
                </label>
                <Input
                  type="tel"
                  placeholder="Ex : 97 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Section 2 : Mode de Paiement */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-black">
                2
              </span>
              <span>Sélectionnez votre Moyen de Paiement</span>
            </h2>

            <div className="space-y-3">
              {/* Option 1 : Mobile Money */}
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "momo"
                    ? "border-sky-500 bg-sky-500/10 shadow-sm"
                    : "border-border/60 hover:bg-muted/20"
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={() => setPaymentMethod("momo")}
                  className="mt-1 text-sky-500 focus:ring-sky-500"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-sky-400" />
                      <span>Mobile Money (Bénin &amp; Afrique de l'Ouest)</span>
                    </span>
                    <Badge variant="outline" className="text-[10px] font-bold">
                      Recommandé UEMOA
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Réglez instantanément avec <strong>MTN Mobile Money</strong>, <strong>Moov Money</strong> ou <strong>Celtiis Cash</strong> via FedaPay / KKiaPay. Sans frais de change.
                  </p>
                </div>
              </label>

              {/* Option 2 : Carte Bancaire */}
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "card"
                    ? "border-sky-500 bg-sky-500/10 shadow-sm"
                    : "border-border/60 hover:bg-muted/20"
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mt-1 text-sky-500 focus:ring-sky-500"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Carte Bancaire Internationale (Visa / Mastercard)</span>
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">3D Secure</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Paiement par carte bancaire locale ou internationale avec sécurité 3D Secure renforcée (Stripe / FedaPay).
                  </p>
                </div>
              </label>

              {/* Option 3 : Mode Sandbox Simulation (Actif en mode Démo / Test) */}
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === "sandbox"
                    ? "border-amber-500 bg-amber-500/10 shadow-sm"
                    : "border-border/60 hover:bg-muted/20"
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="sandbox"
                  checked={paymentMethod === "sandbox"}
                  onChange={() => setPaymentMethod("sandbox")}
                  className="mt-1 text-amber-500 focus:ring-amber-500"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Mode Sandbox (Test &amp; Simulation Immédiate)</span>
                    </span>
                    <Badge variant="warning" className="text-[10px] font-bold">
                      Environnement Test
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Validez immédiatement votre commande sans débit réel pour tester la génération automatique de licences et les téléchargements S3.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3 : CGV & Consentement */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-muted-foreground leading-relaxed">
              <input
                type="checkbox"
                required
                checked={cgvAccepted}
                onChange={(e) => setCgvAccepted(e.target.checked)}
                className="mt-0.5 rounded border-border text-sky-500 focus:ring-sky-500"
              />
              <span>
                J'accepte expressément les{" "}
                <Link href="/cgv" target="_blank" className="text-sky-400 underline hover:text-sky-300">
                  Conditions Générales de Vente
                </Link>{" "}
                et reconnais que la fourniture immédiate des logiciels dématérialisés entraîne le début de l'exécution et l'accès complet aux codes sources.
              </span>
            </label>
          </div>
        </div>

        {/* Colonne Droite : Récapitulatif et Bouton Payer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xl space-y-6 sticky top-24">
            <h2 className="text-lg font-extrabold text-foreground tracking-tight border-b border-border/60 pb-3">
              Articles de la Commande ({items.length})
            </h2>

            {/* Liste concise des articles */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.licenseCode}`}
                  className="flex items-start justify-between gap-3 text-xs border-b border-border/40 pb-2.5"
                >
                  <div>
                    <span className="font-bold text-foreground block line-clamp-1">
                      {item.productTitle}
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize">
                      Licence {item.licenseCode === "standard" ? "Standard (1 site)" : "Étendue (illimitée)"}
                    </span>
                    {item.addons.length > 0 && (
                      <span className="text-[10px] text-sky-400 block">
                        +{item.addons.length} option(s) incluse(s)
                      </span>
                    )}
                  </div>
                  <div className="font-mono font-bold text-foreground shrink-0">
                    {format(
                      (item.unitPriceXof + item.addons.reduce((s, a) => s + a.priceXof, 0)) *
                        item.quantity
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total et Remises */}
            <div className="space-y-2 pt-2 border-t border-border/60 text-sm">
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Sous-total</span>
                <span className="font-mono">{format(subtotalXof)}</span>
              </div>

              {discountXof > 0 && (
                <div className="flex justify-between text-emerald-400 text-xs">
                  <span>Remise ({coupon?.code})</span>
                  <span className="font-mono font-bold">-{format(discountXof)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-border/80">
                <span className="text-base font-bold text-foreground">Total à Régler</span>
                <div className="text-right">
                  <div className="text-2xl font-black text-sky-400 font-mono">
                    {format(totalXof)}
                  </div>
                  {currency !== "XOF" && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      ({totalXof.toLocaleString("fr-FR")} FCFA)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Bouton de Validation */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full h-13 text-sm sm:text-base font-bold gap-2 shadow-xl shadow-sky-500/25"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Traitement sécurisé...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Payer {format(totalXof)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* Reassurances */}
            <div className="space-y-2.5 pt-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Garantie Satisfait ou Remboursé sous 14 jours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Téléchargement immédiat et licence HMAC envoyés par email</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
