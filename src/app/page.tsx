import Link from "next/link";
import { CheckCircle2, ShieldCheck, Zap, Sparkles, Terminal, Code2, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Top Banner */}
      <div className="bg-sky-500/10 border-b border-sky-500/20 py-2 px-4 text-center text-xs sm:text-sm text-sky-300 font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
        <span>Plateforme officielle YEKPON DIGIT — Projets logiciels complets avec code source et licence</span>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between glass sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 font-black text-xl text-white">
            YD
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-white">YEKPON DIGIT</h1>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Logiciels Clés en Main</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <Link href="#catalogue" className="hover:text-white transition-colors">Boutique</Link>
          <Link href="#categories" className="hover:text-white transition-colors">Catégories</Link>
          <Link href="#sur-mesure" className="hover:text-white transition-colors">Sur mesure</Link>
          <Link href="/api/health" target="_blank" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Santé API
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/api/health"
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium transition-all"
          >
            Diagnostic
          </Link>
          <Link
            href="#catalogue"
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5"
          >
            Boutique
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 sm:px-12 lg:px-24 flex flex-col items-center text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Phase 0 — Socle technique & Architecture validés</span>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-white">
          La bibliothèque de logiciels <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-sky-200">prêts à encaisser</span>.
        </h2>

        <p className="mt-6 text-base sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
          Applications SaaS, sites e-commerce, applications mobiles Android & Flutter, logiciels desktop.
          Aperçu démo interactif en sandbox, paiement Mobile Money & Cartes, livraison instantanée du code source avec licence.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#catalogue"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2 group"
          >
            Explorer la Boutique
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/api/health"
            className="px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
          >
            <Terminal className="w-4 h-4 text-sky-400" />
            Vérifier le Statut Système
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl text-left">
          <div className="p-6 rounded-2xl glass hover:border-sky-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Code Source Inclus</h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Projets propres, typés, documentés et accompagnés de leurs guides de déploiement pas à pas.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Démos Interactives</h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Testez chaque projet en conditions réelles dans des iframes sandboxées hermétiques et isolées.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Mobile Money & Cartes</h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Paiement local MTN MoMo, Moov Money, Celtiis Cash et cartes bancaires internationales sécurisées.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Licences & Sécurité</h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Clés de licence uniques signées par HMAC, téléchargements privés par URLs signées et quotas d'accès.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 py-8 px-6 text-center text-xs text-zinc-500">
        <p>© 2026 YEKPON DIGIT — Tous droits réservés. Plateforme de vente de logiciels clés en main.</p>
        <p className="mt-2">Conforme OWASP ASVS niveau 2 · Next.js 15+ · PostgreSQL Neon · Stockage S3</p>
      </footer>
    </main>
  );
}
