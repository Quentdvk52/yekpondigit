import { z } from "zod";

export const PRODUCT_TYPES = [
  "website",
  "web_app",
  "saas",
  "mobile_app",
  "android_native",
  "desktop_app",
  "template",
  "script_plugin",
  "ui_kit",
  "bot",
  "bundle",
  "service",
] as const;

export const PRODUCT_STATUSES = ["draft", "review", "published", "archived"] as const;

export const DEMO_KINDS = [
  "live_iframe",
  "video",
  "gallery",
  "mobile_mockup",
  "emulator",
  "credentials_only",
] as const;

// Étape 1 : Informations Générales
export const productStep1GeneralSchema = z.object({
  title_fr: z.string().trim().min(3, "Le titre en français est requis (min. 3 car.)."),
  title_en: z.string().trim().min(3, "Le titre en anglais est requis (min. 3 car.)."),
  slug: z
    .string()
    .trim()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des minuscules, chiffres et tirets."),
  type: z.enum(PRODUCT_TYPES, { errorMap: () => ({ message: "Type de produit invalide." }) }),
  summary_fr: z.string().trim().min(10, "Le résumé FR doit comporter au moins 10 caractères."),
  summary_en: z.string().trim().min(10, "Le résumé EN doit comporter au moins 10 caractères."),
  description_fr: z.string().trim().min(20, "La description FR doit comporter au moins 20 caractères."),
  description_en: z.string().trim().min(20, "La description EN doit comporter au moins 20 caractères."),
  category_ids: z.array(z.string().uuid()).min(1, "Veuillez associer au moins une catégorie."),
  tag_ids: z.array(z.string().uuid()).default([]),
  stack: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default(["web"]),
  requirements: z.array(z.string()).default([]),
  includes: z.array(z.string()).default([]),
});

// Étape 2 : Médias
export const productMediaItemSchema = z.object({
  kind: z.enum(["image", "video", "model3d"]),
  url: z.string().url("URL de média invalide."),
  alt_fr: z.string().optional(),
  alt_en: z.string().optional(),
  device: z.enum(["desktop", "tablet", "mobile"]).default("desktop"),
  sort_order: z.number().int().min(0).default(0),
});

export const productStep2MediaSchema = z.object({
  media: z.array(productMediaItemSchema).default([]),
});

// Étape 3 : Démos
export const productDemoItemSchema = z.object({
  kind: z.enum(DEMO_KINDS),
  title: z.string().trim().min(2, "Le titre de la démo est requis."),
  url: z.string().url("URL de démo invalide (format http:// ou https:// requis)."),
  allowed_origin: z.string().optional(),
  credentials_encrypted: z.string().optional(),
  notes: z.string().optional(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export const productStep3DemosSchema = z.object({
  demos: z.array(productDemoItemSchema).default([]),
});

// Étape 4 : Licences & Prix
export const productLicenseItemSchema = z.object({
  code: z.enum(["standard", "extended"]),
  name: z.string().min(2),
  price_xof: z.number().int().min(0, "Le prix en XOF doit être positif."),
  includes_source: z.boolean().default(true),
  max_domains: z.number().int().min(1).default(1),
  description: z.string().optional(),
});

export const productStep4PricingSchema = z.object({
  base_price_xof: z.number().int().min(0, "Le prix de base en XOF doit être positif."),
  sale_price_xof: z.number().int().min(0).nullable().optional(),
  sale_starts_at: z.string().datetime().nullable().optional(),
  sale_ends_at: z.string().datetime().nullable().optional(),
  licenses: z.array(productLicenseItemSchema).min(1, "Au moins une licence doit être configurée."),
});

// Étape 5 : Fichiers & Versions
export const productFileItemSchema = z.object({
  label: z.string().min(2),
  storage_path: z.string().min(5),
  size_bytes: z.number().int().min(1),
  sha256: z.string().length(64, "L'empreinte SHA-256 doit comporter exactement 64 caractères."),
  platform: z.string().default("all"),
  is_primary: z.boolean().default(true),
});

export const productStep5VersionSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Format de version invalide (ex: 1.0.0)."),
  changelog_md: z.string().optional(),
  files: z.array(productFileItemSchema).default([]),
});

// Étape 6 : SEO & Publication
export const productStep6PublicationSchema = z.object({
  status: z.enum(PRODUCT_STATUSES).default("draft"),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(true),
  seo_title: z.string().max(70, "Le titre SEO ne doit pas dépasser 70 caractères.").optional(),
  seo_description: z.string().max(160, "La description SEO ne doit pas dépasser 160 caractères.").optional(),
  og_image_url: z.string().url().optional(),
});

// Schéma complet combiné pour validation globale
export const completeProductWizardSchema = productStep1GeneralSchema
  .merge(productStep2MediaSchema)
  .merge(productStep3DemosSchema)
  .merge(productStep4PricingSchema)
  .merge(productStep5VersionSchema)
  .merge(productStep6PublicationSchema);

export type ProductWizardInput = z.infer<typeof completeProductWizardSchema>;
