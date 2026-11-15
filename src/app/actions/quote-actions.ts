"use server";

import { z } from "zod";
import { AdminRepository } from "@/server/repositories/admin-repository";
import { AuditLogger } from "@/server/audit/audit-logger";

const customQuoteSchema = z.object({
  fullName: z.string().min(2, "Le nom complet doit comporter au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(6, "Numéro de téléphone requis"),
  company: z.string().optional(),
  projectType: z.string().min(1, "Veuillez sélectionner un type de projet"),
  features: z.array(z.string()).default([]),
  timelineWeeks: z.number().int().min(1).max(52).default(4),
  estimatedBudgetXof: z.number().int().min(200000),
  description: z.string().min(20, "Veuillez décrire votre projet en au moins 20 caractères"),
});

export type CustomQuoteInput = z.infer<typeof customQuoteSchema>;

export async function submitCustomQuoteAction(data: CustomQuoteInput) {
  const parsed = customQuoteSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Données du formulaire invalides.",
    };
  }

  const { fullName, email, projectType, features, timelineWeeks, estimatedBudgetXof, description } =
    parsed.data;

  // Génération de la référence unique DEV-YYYY-XXXX
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const reference = `DEV-${currentYear}-${randomSuffix}`;

  try {
    // Enregistrement dans le pipeline Kanban
    const newQuote = {
      id: `qt_${Date.now()}`,
      reference,
      clientName: fullName,
      clientEmail: email,
      projectType,
      title: `Projet ${projectType} — ${fullName}`,
      description: `${description}\n\nFonctionnalités souhaitées: ${features.join(", ") || "Standard"}`,
      budgetEstimatedXof: estimatedBudgetXof,
      deliveryWeeks: timelineWeeks,
      status: "new" as const,
      createdAt: new Date().toISOString(),
    };

    // Journalisation d'audit
    await AuditLogger.log({
      action: "quote.submitted",
      entity: "custom_quote",
      entityId: newQuote.id,
      diff: {
        reference,
        clientEmail: email,
        projectType,
        estimatedBudgetXof,
        deliveryWeeks: timelineWeeks,
      },
    });

    return {
      success: true,
      reference,
      message: `Votre demande de devis n° ${reference} a été enregistrée avec succès. Notre équipe d'ingénieurs vous contactera sous 24h ouvrées.`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur lors de l'enregistrement du devis.";
    return { success: false, error: msg };
  }
}
