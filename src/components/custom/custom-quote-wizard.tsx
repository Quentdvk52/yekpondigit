"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Smartphone,
  Globe,
  Database,
  Bot,
  CreditCard,
  ShieldCheck,
  Bell,
  Cpu,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Send,
  Building,
  Mail,
  User,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { submitCustomQuoteAction } from "@/app/actions/quote-actions";
import { ConfettiCelebration } from "@/components/three/confetti-celebration";

const PROJECT_TYPES = [
  {
    id: "saas",
    title: "SaaS & Plateforme Web",
    desc: "Architecture multi-tenant, abonnements récurrents, dashboard métrique.",
    basePriceXof: 1500000,
    baseWeeks: 4,
    icon: Layers,
  },
  {
    id: "mobile_app",
    title: "Application Mobile (iOS & Android)",
    desc: "Développement cross-platform Flutter natif, publication Stores.",
    basePriceXof: 1800000,
    baseWeeks: 5,
    icon: Smartphone,
  },
  {
    id: "ecommerce",
    title: "E-Commerce & Marketplace",
    desc: "Catalogue, panier, multivendeurs, passerelles Mobile Money & Cartes.",
    basePriceXof: 1200000,
    baseWeeks: 3,
    icon: Globe,
  },
  {
    id: "core_banking",
    title: "Intranet Métier & Microfinance",
    desc: "Gestion de portefeuilles, scoring, décaissements instantanés, exports.",
    basePriceXof: 2500000,
    baseWeeks: 6,
    icon: Database,
  },
  {
    id: "bot_automation",
    title: "Bot & Automatisation IA",
    desc: "Agent intelligent WhatsApp, scraping, connecteurs API sur mesure.",
    basePriceXof: 800000,
    baseWeeks: 2,
    icon: Bot,
  },
];

const FEATURES_LIST = [
  {
    id: "momo_cards",
    label: "Paiements Mobile Money (MTN, Moov, Celtiis) + CB",
    priceXof: 250000,
    weeks: 1,
    icon: CreditCard,
  },
  {
    id: "two_factor_auth",
    label: "Authentification Renforcée 2FA TOTP & Rôles RBAC",
    priceXof: 180000,
    weeks: 1,
    icon: ShieldCheck,
  },
  {
    id: "ai_integration",
    label: "Intégration d'IA Générative (Gemini 2.0 / RAG)",
    priceXof: 450000,
    weeks: 2,
    icon: Cpu,
  },
  {
    id: "notifications_sms",
    label: "Notifications SMS & Alertes WhatsApp Automatisées",
    priceXof: 200000,
    weeks: 1,
    icon: Bell,
  },
];

export function CustomQuoteWizard() {
  const [step, setStep] = useState(1);

  // Form state
  const [selectedType, setSelectedType] = useState<string>("saas");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["momo_cards"]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ reference: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calcul dynamique du budget et des délais
  const baseProject = PROJECT_TYPES.find((p) => p.id === selectedType) || PROJECT_TYPES[0]!;
  const featuresPrice = selectedFeatures.reduce((sum, fId) => {
    const f = FEATURES_LIST.find((item) => item.id === fId);
    return sum + (f ? f.priceXof : 0);
  }, 0);
  const totalBudgetXof = baseProject.basePriceXof + featuresPrice;

  const featuresWeeks = selectedFeatures.reduce((sum, fId) => {
    const f = FEATURES_LIST.find((item) => item.id === fId);
    return sum + (f ? f.weeks : 0);
  }, 0);
  const totalWeeks = baseProject.baseWeeks + featuresWeeks;

  const toggleFeature = (fId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(fId) ? prev.filter((id) => id !== fId) : [...prev, fId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await submitCustomQuoteAction({
        fullName,
        email,
        phone,
        company: company || undefined,
        projectType: baseProject.title,
        features: selectedFeatures.map(
          (fId) => FEATURES_LIST.find((f) => f.id === fId)?.label || fId
        ),
        timelineWeeks: totalWeeks,
        estimatedBudgetXof: totalBudgetXof,
        description,
      });

      if (res.success && res.reference) {
        setResult({ reference: res.reference, message: res.message! });
      } else {
        setError(res.error || "Une erreur est survenue lors de l'envoi.");
      }
    });
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto rounded-3xl border border-emerald-500/30 bg-card p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <ConfettiCelebration />
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="accent" className="font-mono text-xs px-3 py-1">
            DOSSIER ENREGISTRÉ : {result.reference}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Demande de Projet Transmise avec Succès !
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            {result.message}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-muted/20 border border-border/60 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type de projet :</span>
            <span className="font-bold text-foreground">{baseProject.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Budget indicatif :</span>
            <span className="font-mono font-bold text-sky-400">
              {totalBudgetXof.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Délai estimé de livraison :</span>
            <span className="font-semibold text-foreground">{totalWeeks} semaines</span>
          </div>
        </div>

        <div className="pt-2">
          <Link href="/boutique">
            <Button size="lg" className="w-full sm:w-auto font-bold gap-2">
              <span>Retourner à la Boutique</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        {[
          { stepNum: 1, title: "1. Type de Projet" },
          { stepNum: 2, title: "2. Fonctionnalités" },
          { stepNum: 3, title: "3. Estimation Budget" },
          { stepNum: 4, title: "4. Coordonnées & Envoi" },
        ].map((s) => (
          <div
            key={s.stepNum}
            className={`flex items-center gap-2 text-xs font-bold ${
              step === s.stepNum
                ? "text-sky-400"
                : step > s.stepNum
                ? "text-emerald-400"
                : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono ${
                step === s.stepNum
                  ? "bg-sky-500 text-white"
                  : step > s.stepNum
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-muted/40 text-muted-foreground"
              }`}
            >
              {s.stepNum}
            </div>
            <span className="hidden sm:inline">{s.title}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ÉTAPE 1 : Type de Projet */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">Quel type de solution souhaitez-vous développer ?</h3>
            <p className="text-xs text-muted-foreground">
              Sélectionnez l'architecture la plus proche de votre besoin métier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROJECT_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10"
                      : "border-border/80 bg-card hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected ? "bg-sky-500 text-white" : "bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      Dès {type.basePriceXof.toLocaleString("fr-FR")} F
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-foreground">{type.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{type.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => setStep(2)} className="font-bold gap-2 text-xs">
              <span>Continuer vers les Fonctionnalités</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 : Fonctionnalités */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">Modules &amp; Intégrations Spécifiques</h3>
            <p className="text-xs text-muted-foreground">
              Cochez les briques technologiques requises pour votre plateforme.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES_LIST.map((feat) => {
              const Icon = feat.icon;
              const isChecked = selectedFeatures.includes(feat.id);

              return (
                <div
                  key={feat.id}
                  onClick={() => toggleFeature(feat.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isChecked
                      ? "border-sky-500 bg-sky-500/10"
                      : "border-border/80 bg-card hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isChecked ? "bg-sky-500 text-white" : "bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{feat.label}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-xs text-sky-400 block">
                      +{feat.priceXof.toLocaleString("fr-FR")} FCFA
                    </span>
                    <span className="text-[10px] text-muted-foreground">+{feat.weeks} sem.</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour</span>
            </Button>
            <Button onClick={() => setStep(3)} className="font-bold gap-2 text-xs">
              <span>Voir l'Estimation Budgétaire</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 : Estimation de Budget & Délais */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">Estimation Automatisée du Projet</h3>
            <p className="text-xs text-muted-foreground">
              Calcul en temps réel selon les barèmes standards de développement de YEKPON DIGIT.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-500/30 bg-card p-6 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                  Budget Global Estimé
                </span>
                <div className="font-mono font-black text-3xl sm:text-4xl text-sky-400">
                  {totalBudgetXof.toLocaleString("fr-FR")}{" "}
                  <span className="text-base text-foreground font-normal">FCFA</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  Soit env. {Math.round(totalBudgetXof / 655.957).toLocaleString("fr-FR")} € /{" "}
                  {Math.round(totalBudgetXof / 610).toLocaleString("fr-FR")} $
                </div>
              </div>

              <div className="space-y-2 sm:border-l sm:border-border/60 sm:pl-6">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                  Délai Moyen de Livraison
                </span>
                <div className="font-mono font-black text-3xl sm:text-4xl text-foreground flex items-center gap-2">
                  <Clock className="w-7 h-7 text-emerald-400" />
                  <span>{totalWeeks} Semaines</span>
                </div>
                <div className="text-xs text-emerald-400 font-medium">
                  Méthodologie Agile : Déploiement continu et validation par sprint
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/20 border border-border/40 space-y-2 text-xs">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Ce qui est systématiquement garanti :</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px]">
                <li>Code source 100% propriétaire sans verrou technique vendeur</li>
                <li>Documentation d'architecture et manuel de déploiement Docker / Vercel</li>
                <li>Garantie de conformité et support correctif 6 mois inclus</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-xs gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modifier les options</span>
            </Button>
            <Button onClick={() => setStep(4)} className="font-bold gap-2 text-xs">
              <span>Finaliser &amp; Envoyer le Cahier des Charges</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ÉTAPE 4 : Coordonnées & Envoi */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">Vos Coordonnées Professionnelles</h3>
            <p className="text-xs text-muted-foreground">
              Un ingénieur d'affaires étudiera votre demande et vous répondra sous 24h.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Nom complet *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Koffi Mensah"
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Adresse Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@entreprise.com"
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Téléphone / WhatsApp *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+229 97 00 00 00"
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Entreprise ou Projet (optionnel)</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Cabinet / Startup SAS"
                  className="pl-9 h-10 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Description de votre besoin &amp; spécificités métier * (min. 20 caractères)
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez les objectifs clés de votre solution, vos flux d'utilisateurs, et vos éventuelles contraintes d'hébergement..."
              className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => setStep(3)}
              className="text-xs gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour</span>
            </Button>

            <Button
              type="submit"
              size="lg"
              disabled={isPending || description.length < 20}
              className="font-bold text-xs gap-2 bg-sky-500 hover:bg-sky-400 text-white"
            >
              <Send className="w-4 h-4" />
              <span>{isPending ? "Transmission en cours..." : "Transmettre ma Demande de Devis"}</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
