import { Check, X, ShieldCheck, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

export const metadata = {
  title: "Licences Logicielles — YEKPON DIGIT",
  description: "Comparatif et détails des licences Standard et Étendue pour les projets logiciels YEKPON DIGIT.",
};

export default function LicensesPage() {
  const comparison = [
    { feature: "Code source complet inclus", standard: true, extended: true },
    { feature: "Documentation d'installation pas à pas", standard: true, extended: true },
    { feature: "Utilisation pour un projet final unique (1 domaine)", standard: true, extended: true },
    { feature: "Utilisation sur plusieurs domaines / projets clients", standard: false, extended: true },
    { feature: "Exploitation en tant que service payant (SaaS / abonnement)", standard: false, extended: true },
    { feature: "Revente du code source brut tel quel", standard: false, extended: false },
    { feature: "Mises à jour incluses", standard: "12 mois", extended: "À vie (Life-time)" },
    { feature: "Support technique prioritaire", standard: "6 mois", extended: "12 mois" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
      {/* Title */}
      <div className="text-center space-y-4">
        <Badge variant="accent">Propriété & Droits d&apos;usage</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Des licences claires, transparentes et équitables.
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400">
          Chaque projet logiciel acheté sur YEKPON DIGIT est livré avec une clé de licence unique signée et un certificat légal d&apos;attribution de droits.
        </p>
      </div>

      {/* Grid Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Standard */}
        <Card className="border-sky-500/30 bg-slate-900/80 relative">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Badge variant="accent">Populaire</Badge>
              <span className="text-xs text-zinc-400">Usage Unique</span>
            </div>
            <CardTitle className="mt-2 text-2xl text-white">Licence Standard</CardTitle>
            <CardDescription>
              Idéale pour lancer son propre projet, une application interne ou un site client unique.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-zinc-300">
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1 domaine / installation en production</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Code source complet (Frontend + Backend + DB)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Modifications et personnalisations libres</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>12 mois de mises à jour de version</span>
              </li>
              <li className="flex items-center gap-2 text-zinc-500">
                <X className="w-4 h-4 text-zinc-600 shrink-0" />
                <span>Revente ou redistribution interdite</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Extended */}
        <Card className="border-indigo-500/40 bg-gradient-to-b from-indigo-950/20 to-slate-900/90 relative">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Badge variant="success">Pour Agences & SaaS</Badge>
              <span className="text-xs text-zinc-400">Multi-projets</span>
            </div>
            <CardTitle className="mt-2 text-2xl text-white">Licence Étendue</CardTitle>
            <CardDescription>
              Conçue pour les créateurs de SaaS payants, agences web et déploiements à grande échelle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-zinc-300">
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Domaines illimités (projets clients / multisites)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Droit d&apos;exploiter en mode SaaS payant aux utilisateurs finaux</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Code source complet sans restriction</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mises à jour à vie prioritaires</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>12 mois de support technique dédié prioritaire</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Tableau comparatif détaillé</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-white/5 text-zinc-400 uppercase font-semibold text-[11px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4 sm:px-6">Fonctionnalités & Droits</th>
                <th className="p-4 sm:px-6 text-center">Licence Standard</th>
                <th className="p-4 sm:px-6 text-center">Licence Étendue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {comparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:px-6 font-medium text-white">{row.feature}</td>
                  <td className="p-4 sm:px-6 text-center">
                    {typeof row.standard === "boolean" ? (
                      row.standard ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-zinc-600 mx-auto" />
                      )
                    ) : (
                      <span className="font-semibold text-sky-400">{row.standard}</span>
                    )}
                  </td>
                  <td className="p-4 sm:px-6 text-center">
                    {typeof row.extended === "boolean" ? (
                      row.extended ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-zinc-600 mx-auto" />
                      )
                    ) : (
                      <span className="font-semibold text-emerald-400">{row.extended}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Licences */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white">Questions fréquentes sur les licences</h3>
        </div>
        <Accordion>
          <AccordionItem title="Puis-je modifier le code source acheté ?">
            Oui, absolument. Dès votre achat, vous disposez de 100 % du code source (non obfusqué) et pouvez le modifier librement pour répondre aux besoins de votre entreprise ou de vos clients.
          </AccordionItem>
          <AccordionItem title="Puis-je revendre le code source sur une autre place de marché ?">
            Non. Les licences YEKPON DIGIT vous accordent un droit d&apos;exploitation commercial et d&apos;usage final, mais interdisent formellement la redistribution ou la revente directe du code source brut sous forme de template ou de produit concurrent.
          </AccordionItem>
          <AccordionItem title="Comment activer ma clé de licence sur mon serveur ?">
            Votre clé de licence unique (format `XXXX-XXXX-XXXX-XXXX`) peut être renseignée dans la variable d&apos;environnement de votre projet ou validée via notre API publique `/api/licenses/verify`.
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
