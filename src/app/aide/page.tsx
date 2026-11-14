import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Centre d'Aide & FAQ — YEKPON DIGIT",
  description: "Réponses à toutes vos questions sur les commandes, démos, paiements Mobile Money et téléchargements sur YEKPON DIGIT.",
};

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="accent">Support & Assistance</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Comment pouvons-nous vous aider ?
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Retrouvez les réponses aux questions les plus fréquentes sur le fonctionnement de la plateforme YEKPON DIGIT.
        </p>
      </div>

      {/* Cartes de contact direct */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Assistance par Email</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Réponse garantie sous 24h ouvrées</p>
            <a href="mailto:support@yekpondigit.com" className="text-xs font-semibold text-sky-400 hover:underline mt-1 inline-block">
              support@yekpondigit.com
            </a>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">WhatsApp Business</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Discussion rapide avec un ingénieur</p>
            <Link href="/contact" className="text-xs font-semibold text-emerald-400 hover:underline mt-1 inline-block">
              Ouvrir le formulaire de contact
            </Link>
          </div>
        </div>
      </div>

      {/* Accordéon FAQ par Sections */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-white/10 pb-2">
            1. Commandes, Paiements & Factures
          </h2>
          <Accordion>
            <AccordionItem title="Quels sont les moyens de paiement acceptés ?">
              Nous acceptons les paiements Mobile Money locaux au Bénin et dans toute la zone UEMOA (MTN MoMo, Moov Money, Celtiis Cash), ainsi que les cartes bancaires internationales (Visa, Mastercard) via des passerelles cryptées et certifiées.
            </AccordionItem>
            <AccordionItem title="Puis-je commander en tant qu'invité sans créer de compte ?">
              Oui ! Vous pouvez commander avec votre simple adresse email. Vos accès, votre clé de licence et vos liens de téléchargement vous seront envoyés immédiatement par email, avec la possibilité de lier vos commandes à un compte à tout moment.
            </AccordionItem>
            <AccordionItem title="Où puis-je télécharger ma facture acquittée ?">
              Dès la confirmation du paiement, votre facture au format PDF est téléchargeable sur la page de confirmation et dans votre Espace Client.
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-white/10 pb-2">
            2. Téléchargements & Mises à Jour
          </h2>
          <Accordion>
            <AccordionItem title="Que contient exactement l'archive téléchargée ?">
              L&apos;archive ZIP comprend l&apos;intégralité du code source du projet (Frontend, Backend, scripts de base de données SQL), les fichiers de configuration, les fichiers d&apos;environnement d&apos;exemple, la documentation d&apos;installation détaillée et votre certificat de licence.
            </AccordionItem>
            <AccordionItem title="Comment se passent les futures mises à jour ?">
              Dès qu&apos;une nouvelle version d&apos;un logiciel est publiée par notre équipe, tous les acquéreurs éligibles reçoivent une notification par email et peuvent télécharger la nouvelle version directement depuis leur Espace Client sans frais supplémentaires.
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-white/10 pb-2">
            3. Démos Interactives & Sécurité
          </h2>
          <Accordion>
            <AccordionItem title="Les démos sont-elles fidèles au code livré ?">
              Oui. Toutes les démos sont des déploiements réels des projets hébergés sur des instances sandboxées sécurisées, vous permettant de manipuler l&apos;interface avant votre achat.
            </AccordionItem>
            <AccordionItem title="Proposez-vous un service d'installation pour mon hébergement ?">
              Oui, nous proposons une option « Service d&apos;Installation Clé en Main » ajoutable lors de votre commande, où nos ingénieurs déploient et configurent le projet directement sur votre serveur ou votre compte cloud (Vercel, Supabase, VPS, etc.).
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
