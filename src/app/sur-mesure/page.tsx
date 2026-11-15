import type { Metadata } from "next";
import {
  Sparkles,
  Code2,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Smartphone,
  Globe,
  Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CustomQuoteWizard } from "@/components/custom/custom-quote-wizard";

export const metadata: Metadata = {
  title: "Développement Logiciel Sur Mesure | YEKPON DIGIT",
  description:
    "Confiez la conception de votre application web, mobile ou SaaS à nos ingénieurs. Estimation de budget en ligne et devis sous 24h.",
};

export default function SurMesurePage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Service Sur Mesure */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ingénierie Logicielle &amp; Projets Clés en Main</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
          Votre Solution Logicielle Sur Mesure,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-sky-200">
            Conçue pour Scaler
          </span>
          .
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Vous avez un besoin spécifique que les templates du catalogue ne couvrent pas ? Nos experts
          développent votre SaaS, application mobile ou core banking sur mesure avec intégration directe de vos passerelles de paiement.
        </p>
      </div>

      {/* 4 Piliers d'Excellence */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Architecture Clean",
            desc: "Next.js 15, TypeScript strict, API REST / GraphQL et bases PostgreSQL haute performance.",
            icon: Code2,
          },
          {
            title: "Sécurité ASVS Niveau 2",
            desc: "Authentification 2FA TOTP, chiffrement AES-256 et étanchéité IDOR sur chaque endpoint.",
            icon: ShieldCheck,
          },
          {
            title: "Paiements Régionaux",
            desc: "Intégration directe de MTN MoMo, Moov Money, Celtiis Cash et cartes bancaires Stripe 3DS.",
            icon: Zap,
          },
          {
            title: "Code 100% Propriétaire",
            desc: "Cession intégrale des droits d'auteur, aucun abonnement captif, déploiement sur votre infrastructure.",
            icon: Layers,
          },
        ].map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-2.5"
            >
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 w-fit">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">{pillar.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Formulaire & Simulateur de Devis Interactif */}
      <div className="pt-4">
        <CustomQuoteWizard />
      </div>
    </div>
  );
}
