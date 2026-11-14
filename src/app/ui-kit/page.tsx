"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { PriceTag } from "@/components/ui/price-tag";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Sparkles, Terminal, Code2, ShieldAlert } from "lucide-react";

export default function UIKitPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="border-b border-white/10 pb-6 space-y-2">
        <Badge variant="accent">Design System Showcase</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          YEKPON DIGIT — Galerie de Composants UI
        </h1>
        <p className="text-sm text-zinc-400">
          Validation visuelle des tokens Dark Luxe, des états, des boutons, modales, formulaires et badges.
        </p>
      </div>

      {/* 1. Boutons */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">1. Boutons & Variantes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Bouton Principal</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="outline">Contour</Button>
          <Button variant="ghost">Fantôme</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" isLoading>Chargement</Button>
          <Button variant="secondary" disabled>Désactivé</Button>
        </div>
      </section>

      {/* 2. Badges */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">2. Badges & Statuts</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default">Défaut</Badge>
          <Badge variant="accent">Accentuation</Badge>
          <Badge variant="success">Succès / Payé</Badge>
          <Badge variant="warning">En attente</Badge>
          <Badge variant="danger">Refusé / Révoqué</Badge>
          <Badge variant="outline">Contour</Badge>
        </div>
      </section>

      {/* 3. Prix & Notes */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">3. Tags de Prix & Évaluations Étoiles</h2>
        <div className="flex flex-wrap items-center gap-8">
          <PriceTag amountXof={250000} size="lg" />
          <PriceTag amountXof={500000} salePriceXof={350000} size="lg" />
          <Rating score={4.8} count={42} size="md" />
        </div>
      </section>

      {/* 4. Formulaires */}
      <section className="space-y-4 max-w-xl">
        <h2 className="text-lg font-bold text-white">4. Champs de Saisie</h2>
        <Input label="Champ de texte standard" placeholder="Entrez une valeur..." />
        <Input label="Champ avec erreur" error="Adresse email invalide" placeholder="test@erreur" />
        <Textarea label="Zone de texte multi-lignes" placeholder="Votre message détaillé..." />
      </section>

      {/* 5. Cartes */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">5. Cartes Glassmorphism</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Carte Produit</CardTitle>
              <CardDescription>Description du composant de carte</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-300">Contenu principal de la carte avec effet de vitre givrée.</p>
            </CardContent>
            <CardFooter className="pt-4">
              <Button size="sm" variant="primary">Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>État de Chargement</CardTitle>
              <CardDescription>Squelettes pulsants sans saut de page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Boîte de Dialogue</CardTitle>
              <CardDescription>Modale accessible au clavier</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)}>
                Ouvrir la Modale
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. Tabs & Accordion */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white">6. Onglets & Accordéon FAQ</h2>
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Premier Onglet</TabsTrigger>
            <TabsTrigger value="tab2">Deuxième Onglet</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
            Contenu dynamique du premier onglet.
          </TabsContent>
          <TabsContent value="tab2" className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
            Contenu dynamique du deuxième onglet.
          </TabsContent>
        </Tabs>

        <Accordion>
          <AccordionItem title="Exemple d'accordéon interactif">
            Cet accordéon s&apos;ouvre et se referme de manière fluide avec des icônes réactives.
          </AccordionItem>
        </Accordion>
      </section>

      {/* 7. État Vide */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">7. État Vide</h2>
        <EmptyState
          title="Aucun produit trouvé"
          description="Essayez de modifier vos critères de recherche ou vos filtres pour trouver des résultats."
          action={<Button size="sm" variant="secondary">Réinitialiser les filtres</Button>}
        />
      </section>

      {/* Test Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Démonstration de Modale"
        description="Cette boîte de dialogue bloque le défilement et se ferme avec la touche Échap."
      >
        <p className="text-xs text-zinc-300 leading-relaxed">
          Exemple de contenu interactif au sein d&apos;une boîte de dialogue accessible.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button size="sm" variant="secondary" onClick={() => setIsModalOpen(false)}>
            Fermer
          </Button>
          <Button size="sm" variant="primary" onClick={() => setIsModalOpen(false)}>
            Valider
          </Button>
        </div>
      </Modal>
    </div>
  );
}
