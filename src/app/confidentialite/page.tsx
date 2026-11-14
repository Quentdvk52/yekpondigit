import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Politique de Confidentialité — YEKPON DIGIT",
  description: "Protection de vos données personnelles et conformité aux normes internationales de sécurité sur YEKPON DIGIT.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8 text-zinc-300 text-sm leading-relaxed">
      <div className="space-y-2">
        <Badge variant="default">Protection des Données</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Politique de Confidentialité & RGPD
        </h1>
        <p className="text-xs text-zinc-500">Dernière révision : 14 Novembre 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">1. Identité du Responsable de Traitement</h2>
        <p>
          Les données personnelles collectées sur le site sont traitées par la société <strong>YEKPON DIGIT</strong>, société enregistrée au Bénin, soumise aux lois applicables sur la protection des données personnelles et respectant les principes généraux du RGPD.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">2. Données Collectées et Finalités</h2>
        <p>
          Nous limitons la collecte de données au strict nécessaire (principe de minimisation) :
        </p>
        <ul className="list-disc pl-5 space-y-1 text-zinc-400">
          <li><strong>Création de compte et commande :</strong> Nom complet, adresse email, pays, historique d&apos;achats.</li>
          <li><strong>Paiement sécurisé :</strong> Aucune donnée bancaire (numéro de carte) n&apos;est stockée sur nos serveurs. Les transactions sont traitées directement par nos partenaires certifiés PCI-DSS (FedaPay, KKiaPay, Stripe).</li>
          <li><strong>Sécurité des téléchargements et licences :</strong> Empreinte de session hashée, adresse IP hashée (SHA-256 avec sel) pour la détection de fraude et la traçabilité des quotas de téléchargement.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">3. Durées de Conservation</h2>
        <p>
          Vos données de facturation et de licences sont conservées pendant les durées légales requises par les obligations comptables et fiscales. Vos données d&apos;accès et journaux techniques sont purgés au terme d&apos;un délai maximal de 12 mois.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">4. Vos Droits (Accès, Rectification, Suppression)</h2>
        <p>
          Conformément aux réglementations, vous disposez d&apos;un droit d&apos;accès, de rectification, de portabilité et de suppression de vos données personnelles. Vous pouvez exercer ces droits à tout moment depuis votre Espace Client ou en adressant un email à <code>privacy@yekpondigit.com</code>.
        </p>
      </section>
    </div>
  );
}
