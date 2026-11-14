import { Sparkles, ShieldCheck, Code2, Users, Rocket, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "À propos de YEKPON DIGIT — Notre Vision & Ingénierie",
  description: "Découvrez la mission de YEKPON DIGIT, notre engagement d'excellence logicielle et notre équipe.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="accent">À propos de nous</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Démocratiser l&apos;accès à des logiciels de <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">qualité industrielle</span>.
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
          Chez YEKPON DIGIT, nous concevons, développons et auditons des applications clés en main pour permettre aux entrepreneurs, startups et entreprises d&apos;accélérer leur mise sur le marché sans réinventer la roue.
        </p>
      </div>

      {/* Valeurs / Piliers */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Code Source Artisanal & Typé</h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Pas de code généré à la va-vite. Chaque projet respecte les meilleures pratiques architecturales (Clean Architecture, TypeScript strict, modularité) et est accompagné d&apos;une documentation d&apos;installation complète.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Sécurité & Transparence</h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Chaque livrable est analysé contre les vulnérabilités OWASP, signé avec empreinte cryptographique SHA-256 et assorti de conditions de licence parfaitement claires.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Rocket className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Livraison Instantanée & Support</h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Dès validation du paiement (Mobile Money ou carte), vous recevez vos fichiers, votre clé de licence et un accompagnement technique dédié inclus pendant 6 mois.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="mt-16 p-8 sm:p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-sky-950/40 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <Badge variant="success">Notre Engagement</Badge>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Un écosystème conçu pour les créateurs de valeur
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Que vous souhaitiez lancer un SaaS multi-tenant, déployer une application mobile pour vos clients au Bénin ou en Afrique de l&apos;Ouest, ou intégrer des briques technologiques robustes à vos systèmes d&apos;information, YEKPON DIGIT vous fournit les fondations indispensables.
          </p>
        </div>
      </div>
    </div>
  );
}
