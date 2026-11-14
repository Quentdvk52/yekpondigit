import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle2, RotateCcw } from "lucide-react";

export const metadata = {
  title: "Politique de Remboursement — YEKPON DIGIT",
  description: "Conditions et démarches d'application de la garantie et des remboursements sur YEKPON DIGIT.",
};

export default function RefundsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8 text-zinc-300 text-sm leading-relaxed">
      <div className="space-y-2">
        <Badge variant="warning">Garantie & Litiges</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Politique de Remboursement
        </h1>
        <p className="text-xs text-zinc-500">Applicable à tous les logiciels vendus sur YEKPON DIGIT</p>
      </div>

      <div className="p-6 rounded-2xl border border-sky-500/20 bg-sky-500/5 backdrop-blur-sm space-y-2">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-sky-400" />
          Garantie de Fonctionnalité 7 Jours
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Nous tenons à ce que chaque client soit pleinement satisfait. Si un logiciel acheté comporte un bug bloquant avéré empêchant son exécution dans l&apos;environnement minimal requis, et que notre équipe ne parvient pas à le résoudre sous 48 heures ouvrées, nous procédons à un remboursement intégral.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">1. Cas Éligibles au Remboursement</h2>
        <ul className="list-disc pl-5 space-y-2 text-zinc-400">
          <li><strong>Défaut technique majeur avéré :</strong> Le logiciel ne démarre pas ou une fonctionnalité centrale décrite dans la fiche produit est défaillante, malgré le respect scrupuleux des prérequis d&apos;installation.</li>
          <li><strong>Non-conformité manifeste :</strong> Le code source livré diffère substantiellement de la démonstration interactive présentée sur le site.</li>
          <li><strong>Paiement en double :</strong> Tout débit accidentel en double suite à un incident de connectivité réseau est remboursé sans délai sur simple signalement.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">2. Cas Non Éligibles</h2>
        <ul className="list-disc pl-5 space-y-2 text-zinc-400">
          <li>Changement d&apos;avis après avoir téléchargé l&apos;intégralité des archives du code source.</li>
          <li>Incompatibilité due à un environnement serveur non conforme aux prérequis techniques indiqués sur la fiche produit.</li>
          <li>Incapacité technique ou manque de compétences pour personnaliser ou déployer le code source (dans ce cas, nos services d&apos;assistance ou de commande sur mesure peuvent intervenir).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">3. Conséquence du Remboursement sur les Licences</h2>
        <p>
          Dès validation d&apos;un remboursement par nos services administratifs, la clé de licence correspondante est immédiatement <strong>révoquée</strong> dans notre registre cryptographique, et les accès aux téléchargements et futures mises à jour sont désactivés.
        </p>
      </section>
    </div>
  );
}
