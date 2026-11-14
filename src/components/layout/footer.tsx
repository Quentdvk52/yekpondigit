import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-zinc-400 text-xs">
      {/* Réassurance & Paiement */}
      <div className="border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Paiement 100 % Sécurisé & Local</p>
              <p className="text-zinc-500 text-xs">Mobile Money (MTN MoMo, Moov, Celtiis) et Cartes Bancaires</p>
            </div>
          </div>

          {/* Badges Paiements */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 font-bold text-xs tracking-wider">
              MTN MoMo
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 font-bold text-xs tracking-wider">
              Moov Money
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 font-bold text-xs tracking-wider">
              Celtiis Cash
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 font-bold text-xs tracking-wider">
              Visa / Mastercard
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 font-bold text-xs tracking-wider">
              Stripe
            </span>
          </div>
        </div>
      </div>

      {/* Colonnes Liens */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-slate-950 text-base">
              YD
            </div>
            <span className="font-black text-base text-white tracking-wider">YEKPON DIGIT</span>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
            La première plateforme africaine et internationale de vente de projets logiciels prêts à l&apos;emploi.
            Code source complet, licences transparentes, démos sandboxées et accompagnement sur-mesure.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Tous les logiciels sont audités et vérifiés</span>
          </div>
        </div>

        {/* Catégories */}
        <div className="space-y-3">
          <p className="font-bold text-white uppercase tracking-wider text-xs">Catalogue</p>
          <ul className="space-y-2">
            <li><Link href="/boutique?type=saas" className="hover:text-white transition-colors">Applications SaaS</Link></li>
            <li><Link href="/boutique?type=mobile_app" className="hover:text-white transition-colors">Apps Mobiles Flutter</Link></li>
            <li><Link href="/boutique?type=website" className="hover:text-white transition-colors">Sites Web Clés en Main</Link></li>
            <li><Link href="/boutique?type=desktop_app" className="hover:text-white transition-colors">Logiciels Desktop</Link></li>
            <li><Link href="/boutique?type=bot" className="hover:text-white transition-colors">Scripts & Bots</Link></li>
          </ul>
        </div>

        {/* Légal & Confiance */}
        <div className="space-y-3">
          <p className="font-bold text-white uppercase tracking-wider text-xs">Légal & Garanties</p>
          <ul className="space-y-2">
            <li><Link href="/licences" className="hover:text-white transition-colors">Types de Licences</Link></li>
            <li><Link href="/cgv" className="hover:text-white transition-colors">Conditions Générales (CGV)</Link></li>
            <li><Link href="/confidentialite" className="hover:text-white transition-colors">Politique de Confidentialité</Link></li>
            <li><Link href="/remboursements" className="hover:text-white transition-colors">Politique de Remboursement</Link></li>
            <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link></li>
          </ul>
        </div>

        {/* Support & Services */}
        <div className="space-y-3">
          <p className="font-bold text-white uppercase tracking-wider text-xs">Services & Aide</p>
          <ul className="space-y-2">
            <li><Link href="/sur-mesure" className="hover:text-white transition-colors">Développement Sur-Mesure</Link></li>
            <li><Link href="/aide" className="hover:text-white transition-colors">Centre d&apos;Aide & FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Nous Contacter</Link></li>
            <li><Link href="/licences/verifier" className="hover:text-white transition-colors">Vérifier une Licence</Link></li>
            <li><Link href="/api/health" target="_blank" className="hover:text-emerald-400 transition-colors">Statut des Services (API)</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright & Mentions de fin */}
      <div className="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
        <p>© 2026 YEKPON DIGIT — Tous droits réservés.</p>
        <p className="flex items-center gap-1">
          Conçu avec passion et rigueur d&apos;ingénierie logicielle
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        </p>
      </div>
    </footer>
  );
}
