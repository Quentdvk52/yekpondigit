import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  CheckCircle2,
  Sparkles,
  Layers,
  Globe,
  Smartphone,
  Laptop,
  Palette,
  Terminal,
  HelpCircle,
} from "lucide-react";
import { Hero3DScene } from "@/components/three/hero-3d-scene";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { ProductCard } from "@/components/product/product-card";
import { ProductRepository } from "@/server/repositories/product-repository";
import { CategoryRepository } from "@/server/repositories/category-repository";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "sites-web": Globe,
  "saas-web": Layers,
  "mobile-apps": Smartphone,
  "desktop-apps": Laptop,
  "templates-ui": Palette,
  "scripts-bots": Terminal,
};

export default async function HomePage() {
  // Récupération des données dynamiques depuis Neon PostgreSQL
  const [featuredRes, latestRes, categories] = await Promise.all([
    ProductRepository.list({ isFeatured: true, limit: 6 }),
    ProductRepository.list({ limit: 6 }),
    CategoryRepository.listAll(true),
  ]);

  const featuredProducts = featuredRes.products;
  const latestProducts = latestRes.products;

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40">
        {/* Glow backdrop décoratif */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>La 1ère Bibliothèque de Logiciels Clés en Main d&apos;Afrique</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Achetez des projets logiciels{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-sky-200">
              prêts à encaisser
            </span>
            .
          </h1>

          <p className="mt-6 text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Applications SaaS, e-commerce, applications mobiles Android &amp; Flutter, logiciels desktop.
            Testez chaque projet en <strong className="text-zinc-200">démo interactive</strong>, payez par{" "}
            <strong className="text-zinc-200">Mobile Money ou Carte bancaire</strong> et téléchargez instantanément le code source avec votre licence.
          </p>

          {/* Boutons d'Action */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/boutique">
              <Button size="lg" className="h-13 px-8 text-base font-bold shadow-lg shadow-primary/20 gap-2">
                Explorer la Boutique
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/contact">
              <Button variant="outline" size="lg" className="h-13 px-8 text-base font-semibold">
                Demander un Projet Sur Mesure
              </Button>
            </Link>
          </div>

          {/* Scène 3D Interactive WebGL avec dégradation gracieuse */}
          <div className="mt-8 max-w-4xl mx-auto">
            <Hero3DScene />
          </div>

          {/* Bandeau de Chiffres Clés */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-border/40 pt-10">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-extrabold text-white font-mono">100%</div>
              <div className="text-xs text-muted-foreground mt-1">Code Source Complet Inclus</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-extrabold text-primary font-mono">12+</div>
              <div className="text-xs text-muted-foreground mt-1">Solutions Logicielles Prêtes</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">0 Fcfa</div>
              <div className="text-xs text-muted-foreground mt-1">Aucun Abonnement Caché</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-extrabold text-amber-400 font-mono">MoMo &amp; CB</div>
              <div className="text-xs text-muted-foreground mt-1">Paiement Local &amp; Sécurisé</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Catégories */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
            <div>
              <Badge variant="accent" className="mb-2">Catalogue</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Explorez par Catégorie de Logiciel
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Des architectures logicielles modernes conçues pour être déployées en quelques minutes.
              </p>
            </div>
            <Link href="/boutique" className="mt-4 sm:mt-0 text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              Voir toutes les catégories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] ?? Layers;
              return (
                <Link
                  key={cat.id}
                  href={`/boutique?category=${cat.id}`}
                  className="group relative flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.name_fr}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Projets prêts à déployer avec code source et licence d&apos;exploitation.
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Produits Vedettes (Featured) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                Sélection Premium
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Produits Logiciels en Vedette
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Les solutions les plus complètes et les plus demandées par nos clients entrepreneurs.
              </p>
            </div>
            <Link href="/boutique?sort=sales" className="mt-4 sm:mt-0 text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              Voir les meilleures ventes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Comment ça marche */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/20">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge variant="accent" className="mb-2">Processus Fluide</Badge>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
            Comment Fonctionne YEKPON DIGIT ?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            De la découverte à la mise en production sur vos serveurs en 4 étapes transparentes.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="rounded-2xl border border-border/60 bg-card p-6 relative">
              <div className="text-4xl font-black text-primary/20 font-mono mb-4">01</div>
              <h3 className="text-base font-bold text-foreground">Choisissez votre Projet</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Parcourez nos solutions logicielles selon votre secteur d&apos;activité, vos besoins et vos technologies favorites.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 relative">
              <div className="text-4xl font-black text-emerald-400/20 font-mono mb-4">02</div>
              <h3 className="text-base font-bold text-foreground">Testez la Démo Live</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Accédez à une sandbox interactive complète pour valider les écrans, les flux et l&apos;expérience utilisateur en réel.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 relative">
              <div className="text-4xl font-black text-amber-400/20 font-mono mb-4">03</div>
              <h3 className="text-base font-bold text-foreground">Payez en Toute Sécurité</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Réglez par Mobile Money (MTN, Moov, Celtiis) ou carte bancaire avec reçu officiel et facture immédiate.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 relative">
              <div className="text-4xl font-black text-indigo-400/20 font-mono mb-4">04</div>
              <h3 className="text-base font-bold text-foreground">Téléchargez &amp; Déployez</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Obtenez immédiatement vos codes sources signés SHA-256, vos clés de licence HMAC et le guide de déploiement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Nouveautés du Catalogue */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
            <div>
              <Badge variant="success" className="mb-2">Dernières Sorties</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Nouveaux Logiciels Récemment Ajoutés
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Découvrez nos dernières architectures publiées avec technologies 2026.
              </p>
            </div>
            <Link href="/boutique" className="mt-4 sm:mt-0 text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              Explorer tout le catalogue ({latestRes.total} logiciels)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Accordéon FAQ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              <HelpCircle className="h-4 w-4" />
              Réponses Claires
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Questions Fréquemment Posées
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tout ce que vous devez savoir avant d&apos;acheter un projet sur YEKPON DIGIT.
            </p>
          </div>

          <Accordion>
            <AccordionItem title="Reçois-je l'intégralité du code source après l'achat ?" defaultOpen>
              Oui, absolument. Chaque achat vous donne accès au code source complet (fichiers frontend, backend, schémas de base de données PostgreSQL/MySQL et scripts de déploiement) sans aucune obfuscation.
            </AccordionItem>
            <AccordionItem title="Quelle est la différence entre la Licence Standard et la Licence Étendue ?">
              La Licence Standard vous permet de déployer le logiciel pour un seul projet final (votre propre entreprise ou celle d&apos;un client unique). La Licence Étendue vous autorise à créer des instances illimitées ou à exploiter la solution sous forme de service SaaS commercial payant pour vos propres abonnés.
            </AccordionItem>
            <AccordionItem title="Quels sont les moyens de paiement acceptés ?">
              Nous acceptons les paiements locaux Mobile Money (MTN MoMo, Moov Money, Celtiis Cash au Bénin et dans toute la zone UEMOA) ainsi que les cartes bancaires internationales (Visa, Mastercard).
            </AccordionItem>
            <AccordionItem title="Proposez-vous un accompagnement pour l'installation sur nos serveurs ?">
              Oui. Bien que chaque projet contienne une documentation détaillée pas à pas, notre équipe propose un service d&apos;installation et de déploiement clé en main sur votre VPS ou hébergement cloud sous 48h.
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 7. Bannière CTA finale */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-card to-background text-center">
        <div className="container mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Prêt à lancer votre prochain produit technologique ?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Économisez des mois de développement. Téléchargez une solution complète, robuste et testée pour encaisser dès aujourd&apos;hui.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/boutique">
              <Button size="lg" className="h-12 px-8 font-bold gap-2">
                Accéder au Catalogue Complet
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="h-12 px-8 font-semibold">
                Contacter notre Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
