import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Conditions Générales de Vente (CGV) — YEKPON DIGIT",
  description: "Conditions Générales de Vente applicables aux achats de projets logiciels et services sur YEKPON DIGIT.",
};

export default function CGVPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8 text-zinc-300 text-sm leading-relaxed">
      <div className="space-y-2">
        <Badge variant="default">Document Légal</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Conditions Générales de Vente (CGV)
        </h1>
        <p className="text-xs text-zinc-500">Dernière mise à jour : 14 Novembre 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">1. Objet et Champ d&apos;Application</h2>
        <p>
          Les présentes Conditions Générales de Vente (ci-après les « CGV ») régissent l&apos;ensemble des ventes conclues sur la plateforme web <strong>YEKPON DIGIT</strong> (accessible à l&apos;adresse yekpondigit.com), portant sur des projets logiciels clés en main, codes sources, templates, applications mobiles, architectures SaaS et services d&apos;ingénierie associés.
        </p>
        <p>
          Toute commande passée sur le site implique l&apos;adhésion pleine, entière et sans réserve du Client aux présentes CGV.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">2. Nature des Produits et Démos</h2>
        <p>
          Les produits proposés sont des biens numériques immatériels téléchargeables accompagnés d&apos;une clé de licence logicielle. Des aperçus démos interactifs en sandbox ou sous forme de vidéos sont mis à disposition pour permettre au Client de tester le fonctionnement et l&apos;ergonomie du logiciel avant tout achat.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">3. Prix et Modalités de Paiement</h2>
        <p>
          Les prix des produits sont indiqués en Francs CFA (XOF) toutes taxes comprises, ainsi qu&apos;à titre indicatif en Euros (EUR) et Dollars américains (USD).
        </p>
        <p>
          Le règlement des commandes s&apos;effectue de manière sécurisée par :
        </p>
        <ul className="list-disc pl-5 space-y-1 text-zinc-400">
          <li>Mobile Money : MTN MoMo, Moov Money, Celtiis Cash (via passerelles FedaPay / KKiaPay / Moneroo).</li>
          <li>Cartes bancaires internationales : Visa, Mastercard (via Stripe et agrégateurs partenaires).</li>
        </ul>
        <p>
          Le montant de la commande est débité immédiatement lors de la validation du paiement.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">4. Livraison Numérique & Quotas de Téléchargement</h2>
        <p>
          Dès confirmation du paiement par notre système de webhooks sécurisé, le Client accède instantanément à :
        </p>
        <ul className="list-disc pl-5 space-y-1 text-zinc-400">
          <li>Une URL de téléchargement signée et temporaire des archives du projet.</li>
          <li>Une clé de licence logicielle unique formatée et chiffrée.</li>
          <li>Une facture acquittée au format PDF téléchargeable.</li>
        </ul>
        <p>
          Pour des motifs de sécurité applicative (anti-fraude et protection de la bande passante), les téléchargements sont limités à un quota de 10 téléchargements par période de 30 jours, renouvelable gratuitement sur demande auprès de notre support.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">5. Droit de Rétractation pour Contenu Numérique</h2>
        <p>
          Conformément aux réglementations sur le commerce électronique, le droit de rétractation ne peut être exercé pour les contrats de fourniture de contenu numérique sans support matériel dont l&apos;exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.
        </p>
        <p>
          En validant sa commande et en accédant immédiatement aux archives du code source, le Client accepte expressément l&apos;exécution immédiate du contrat et renonce à son droit de rétractation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">6. Garantie & Support Technique</h2>
        <p>
          YEKPON DIGIT garantit que les logiciels livrés sont conformes aux descriptions de leurs fiches produits et exempts de tout code malveillant au moment de la livraison.
        </p>
        <p>
          Chaque achat inclut une assistance technique par ticket pendant une durée de 6 mois pour répondre aux questions relatives à l&apos;installation standard et à la configuration.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">7. Droit Applicable et Règlement des Litiges</h2>
        <p>
          Les présentes CGV sont régies par le droit de la République du Bénin. En cas de contestation ou de litige, les parties s&apos;engagent à rechercher préalablement une solution amiable. À défaut, les tribunaux compétents de Cotonou seront seuls habilités à trancher le litige.
        </p>
      </section>
    </div>
  );
}
