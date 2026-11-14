"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Image as ImageIcon,
  MonitorPlay,
  Tag,
  Upload,
  Globe,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProductAction } from "@/app/actions/product-actions";
import { PRODUCT_TYPES, type ProductWizardInput } from "@/schemas/product";

const STEPS = [
  { id: 1, label: "Informations", icon: FileText },
  { id: 2, label: "Médias", icon: ImageIcon },
  { id: 3, label: "Démos", icon: MonitorPlay },
  { id: 4, label: "Licences & Prix", icon: Tag },
  { id: 5, label: "Fichiers & Version", icon: Upload },
  { id: 6, label: "Publication & SEO", icon: Globe },
];

export default function NouveauProduitPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // État du formulaire complet
  const [formData, setFormData] = useState<ProductWizardInput>({
    title_fr: "",
    title_en: "",
    slug: "",
    type: "saas",
    summary_fr: "",
    summary_en: "",
    description_fr: "",
    description_en: "",
    category_ids: ["10000000-0000-0000-0000-000000000002"], // Catégorie SaaS par défaut
    tag_ids: [],
    stack: ["Next.js 15", "React 19", "PostgreSQL", "Tailwind CSS 4"],
    platforms: ["web", "mobile-ready"],
    requirements: ["Node.js 20+", "PostgreSQL 16"],
    includes: ["Code source complet", "Documentation PDF", "Support 6 mois"],
    media: [
      {
        kind: "image",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        alt_fr: "Capture d'écran principale",
        alt_en: "Main dashboard preview",
        device: "desktop",
        sort_order: 1,
      },
    ],
    demos: [
      {
        kind: "live_iframe",
        title: "Démonstration Interactive Sandboxée",
        url: "https://demo.yekpondigit.com",
        allowed_origin: "https://demo.yekpondigit.com",
        notes: "Identifiants de test fournis sur place",
        sort_order: 1,
        is_active: true,
      },
    ],
    base_price_xof: 150000,
    sale_price_xof: null,
    sale_starts_at: null,
    sale_ends_at: null,
    licenses: [
      {
        code: "standard",
        name: "Licence Standard (1 Domaine / Projet)",
        price_xof: 150000,
        includes_source: true,
        max_domains: 1,
        description: "Usage pour un seul projet client ou personnel.",
      },
      {
        code: "extended",
        name: "Licence Étendue (Usage Illimité / SaaS)",
        price_xof: 350000,
        includes_source: true,
        max_domains: 999,
        description: "Déploiements illimités et revente intégrée dans un produit commercial.",
      },
    ],
    version: "1.0.0",
    changelog_md: "### Version 1.0.0\n- Lancement officiel de la solution logicielle.",
    files: [
      {
        label: "Archive Source Complète (.zip)",
        storage_path: "products/sources/archive-v1.zip",
        size_bytes: 42000000,
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        platform: "all",
        is_primary: true,
      },
    ],
    status: "published",
    is_featured: false,
    is_new: true,
    seo_title: "",
    seo_description: "",
    og_image_url: "",
  });

  const nextStep = () => {
    setError(null);
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError(null);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const res = await createProductAction(formData);
      if (!res.success) {
        setError(res.error ?? "Échec lors de la création du produit.");
        return;
      }

      router.push("/admin/produits");
      router.refresh();
    });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* En-tête avec bouton retour */}
      <div className="mb-8">
        <Link
          href="/admin/produits"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au catalogue
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Nouveau Produit Logiciel (Wizard en 6 Étapes)
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Renseignez toutes les spécifications techniques, prix, versions et démos.
        </p>
      </div>

      {/* Barre de progression des étapes */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 mb-8">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isActive = s.id === currentStep;
          const isDone = s.id < currentStep;

          return (
            <button
              key={s.id}
              onClick={() => setCurrentStep(s.id)}
              className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-all ${
                isActive
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : isDone
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                  : "border-border/60 bg-card text-muted-foreground hover:bg-muted/30"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                  isActive
                    ? "bg-primary text-black"
                    : isDone
                    ? "bg-emerald-500 text-black"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="text-xs truncate">{s.label}</div>
            </button>
          );
        })}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Contenu du Wizard */}
      <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b border-border/60 pb-3">
              1. Informations Générales & Présentation
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  Titre du Produit (Français)
                </label>
                <Input
                  value={formData.title_fr}
                  onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                  placeholder="Ex: SaaS de Gestion de Factures"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  Titre du Produit (Anglais)
                </label>
                <Input
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="Ex: Invoice Management SaaS"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  Identifiant d&apos;URL unique (Slug)
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ex: saas-factures-pro"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  Type de Produit
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as ProductWizardInput["type"] })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PRODUCT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                Résumé Court (Français)
              </label>
              <Input
                value={formData.summary_fr}
                onChange={(e) => setFormData({ ...formData, summary_fr: e.target.value })}
                placeholder="Une phrase d'accroche pour la boutique..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                Résumé Court (Anglais)
              </label>
              <Input
                value={formData.summary_en}
                onChange={(e) => setFormData({ ...formData, summary_en: e.target.value })}
                placeholder="A catchy summary for the catalog..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                Description Complète Markdown (Français)
              </label>
              <Textarea
                rows={5}
                value={formData.description_fr}
                onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                placeholder="Détaillez les fonctionnalités clés, l'architecture et les cas d'usage..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                Description Complète Markdown (Anglais)
              </label>
              <Textarea
                rows={4}
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                placeholder="Detail key features, technical stack, and installation steps..."
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b border-border/60 pb-3">
              2. Médias, Captures & Visuels
            </h2>
            <p className="text-xs text-muted-foreground">
              Images d&apos;illustration du tableau de bord ou de l&apos;application.
            </p>

            <div className="rounded-xl border border-dashed border-border/80 p-6 text-center bg-muted/10">
              <ImageIcon className="mx-auto h-8 w-8 text-primary mb-2" />
              <div className="text-sm font-semibold">Image principale configurée</div>
              <div className="text-xs text-muted-foreground mt-1 font-mono break-all">
                {formData.media[0]?.url}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                URL de l&apos;Image Principale
              </label>
              <Input
                value={formData.media[0]?.url}
                onChange={(e) => {
                  const media = [...formData.media];
                  if (media[0]) media[0].url = e.target.value;
                  setFormData({ ...formData, media });
                }}
                placeholder="https://..."
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b border-border/60 pb-3">
              3. Démonstration Sandboxée & Essai Interactif
            </h2>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                Type de Démonstration
              </label>
              <select
                value={formData.demos[0]?.kind}
                onChange={(e) => {
                  const demos = [...formData.demos];
                  if (demos[0]) demos[0].kind = e.target.value as ProductWizardInput["demos"][0]["kind"];
                  setFormData({ ...formData, demos });
                }}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="live_iframe">Démo Live Interactive (Iframe sandboxée)</option>
                <option value="video">Vidéo de Présentation MP4 / WebM</option>
                <option value="mobile_mockup">Mockup Smartphone 3D / Interactif</option>
                <option value="credentials_only">Identifiants d&apos;Accès Uniquement</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                Titre de la Démo
              </label>
              <Input
                value={formData.demos[0]?.title}
                onChange={(e) => {
                  const demos = [...formData.demos];
                  if (demos[0]) demos[0].title = e.target.value;
                  setFormData({ ...formData, demos });
                }}
                placeholder="Ex: Tester la boutique en ligne"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                URL de la Démo (Hébergée sur domaine séparé)
              </label>
              <Input
                value={formData.demos[0]?.url}
                onChange={(e) => {
                  const demos = [...formData.demos];
                  if (demos[0]) demos[0].url = e.target.value;
                  setFormData({ ...formData, demos });
                }}
                placeholder="https://demo.monsaas.com"
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b border-border/60 pb-3">
              4. Tarifs & Configuration des Licences
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  Prix de Base Standard (XOF - FCFA)
                </label>
                <Input
                  type="number"
                  value={formData.base_price_xof}
                  onChange={(e) => {
                    const price = parseInt(e.target.value, 10) || 0;
                    setFormData({
                      ...formData,
                      base_price_xof: price,
                      licenses: formData.licenses.map((lic) =>
                        lic.code === "standard"
                          ? { ...lic, price_xof: price }
                          : { ...lic, price_xof: Math.round(price * 2.3) }
                      ),
                    });
                  }}
                  placeholder="150000"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  Prix Promotionnel (Optionnel, XOF)
                </label>
                <Input
                  type="number"
                  value={formData.sale_price_xof ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sale_price_xof: e.target.value ? parseInt(e.target.value, 10) : null,
                    })
                  }
                  placeholder="Laisser vide si aucun"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
              <div className="text-xs font-semibold uppercase text-muted-foreground">
                Licences automatiques générées
              </div>
              {formData.licenses.map((lic) => (
                <div
                  key={lic.code}
                  className="flex items-center justify-between rounded-lg bg-card p-3 border border-border/40 text-sm"
                >
                  <div>
                    <span className="font-semibold text-foreground">{lic.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({lic.max_domains === 999 ? "Domaines illimités" : "1 domaine"})
                    </span>
                  </div>
                  <div className="font-mono font-bold text-primary">
                    {lic.price_xof.toLocaleString("fr-FR")} FCFA
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b border-border/60 pb-3">
              5. Fichiers Livrables & Numéro de Version
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  Numéro de Version
                </label>
                <Input
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="1.0.0"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  Nom du Livrable
                </label>
                <Input
                  value={formData.files[0]?.label}
                  onChange={(e) => {
                    const files = [...formData.files];
                    if (files[0]) files[0].label = e.target.value;
                    setFormData({ ...formData, files });
                  }}
                  placeholder="Archive Source Complète (.zip)"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                Empreinte SHA-256 du Fichier Privé
              </label>
              <Input
                value={formData.files[0]?.sha256}
                onChange={(e) => {
                  const files = [...formData.files];
                  if (files[0]) files[0].sha256 = e.target.value;
                  setFormData({ ...formData, files });
                }}
                className="font-mono text-xs"
                placeholder="64 caractères hexadécimaux"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                Notes de Version (Changelog Markdown)
              </label>
              <Textarea
                rows={3}
                value={formData.changelog_md}
                onChange={(e) => setFormData({ ...formData, changelog_md: e.target.value })}
                placeholder="### Changements majeurs..."
              />
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b border-border/60 pb-3">
              6. Publication, SEO & Validation Finale
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  Statut de Publication
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as ProductWizardInput["status"] })
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="published">Publier Immédiatement</option>
                  <option value="draft">Sauvegarder en Brouillon</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  Titre SEO Meta
                </label>
                <Input
                  value={formData.seo_title ?? ""}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="Titre pour Google (max 70 car.)"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-border bg-background text-primary"
                />
                Mettre en avant sur la page d&apos;accueil (Featured)
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  className="h-4 w-4 rounded border-border bg-background text-primary"
                />
                Badge &quot;Nouveau&quot;
              </label>
            </div>
          </div>
        )}

        {/* Boutons de navigation du Wizard */}
        <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isPending}
          >
            Précédent
          </Button>

          {currentStep < 6 ? (
            <Button type="button" onClick={nextStep} className="gap-2">
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Créer et Enregistrer le Produit
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
