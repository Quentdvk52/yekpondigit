"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/server/auth/rbac";
import { AdminRepository } from "@/server/repositories/admin-repository";

const refundOrderSchema = z.object({
  orderId: z.string().min(1, "Identifiant de commande requis"),
  reason: z.string().min(5, "Le motif doit comporter au moins 5 caractères"),
  refundType: z.enum(["full", "partial"]).default("full"),
  amountXof: z.number().int().positive().optional(),
});

const updateLicenseStatusSchema = z.object({
  licenseId: z.string().min(1, "Identifiant de licence requis"),
  status: z.enum(["active", "revoked", "expired"]),
  reason: z.string().optional(),
});

const resetLicenseDomainsSchema = z.object({
  licenseId: z.string().min(1, "Identifiant de licence requis"),
});

const toggleCustomerBlockSchema = z.object({
  userId: z.string().min(1, "Identifiant utilisateur requis"),
  isBlocked: z.boolean(),
});

const updateQuoteStatusSchema = z.object({
  quoteId: z.string().min(1, "Identifiant du devis requis"),
  status: z.enum(["new", "qualified", "quoted", "in_progress", "delivered"]),
});

export async function refundOrderAction(input: z.infer<typeof refundOrderSchema>) {
  const admin = await requireAdmin();
  const parsed = refundOrderSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const result = await AdminRepository.refundOrder({
      ...parsed.data,
      adminUserId: admin.userId,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/commandes");
    revalidatePath("/admin/licences");
    revalidatePath("/admin/audit");

    return {
      success: true,
      message: `La commande ${result.order.number} a été remboursée avec succès et les licences associées ont été révoquées.`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors du remboursement.";
    return { success: false, error: message };
  }
}

export async function updateLicenseStatusAction(input: z.infer<typeof updateLicenseStatusSchema>) {
  const admin = await requireAdmin();
  const parsed = updateLicenseStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const updated = await AdminRepository.updateLicenseStatus({
      ...parsed.data,
      adminUserId: admin.userId,
    });

    revalidatePath("/admin/licences");
    revalidatePath("/admin/audit");

    return {
      success: true,
      message: `Statut de la licence ${updated.key} mis à jour : ${updated.status}.`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour.";
    return { success: false, error: message };
  }
}

export async function resetLicenseDomainsAction(input: z.infer<typeof resetLicenseDomainsSchema>) {
  const admin = await requireAdmin();
  const parsed = resetLicenseDomainsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const updated = await AdminRepository.resetLicenseDomains({
      ...parsed.data,
      adminUserId: admin.userId,
    });

    revalidatePath("/admin/licences");
    revalidatePath("/admin/audit");

    return {
      success: true,
      message: `Les domaines autorisés pour la licence ${updated.key} ont été réinitialisés.`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la réinitialisation.";
    return { success: false, error: message };
  }
}

export async function toggleCustomerBlockAction(input: z.infer<typeof toggleCustomerBlockSchema>) {
  const admin = await requireAdmin();
  const parsed = toggleCustomerBlockSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const updated = await AdminRepository.toggleCustomerBlock({
      ...parsed.data,
      adminUserId: admin.userId,
    });

    revalidatePath("/admin/clients");
    revalidatePath("/admin/audit");

    return {
      success: true,
      message: updated.isBlocked
        ? `L'accès du client ${updated.fullName} a été suspendu.`
        : `L'accès du client ${updated.fullName} a été rétabli.`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour.";
    return { success: false, error: message };
  }
}

export async function updateQuoteStatusAction(input: z.infer<typeof updateQuoteStatusSchema>) {
  const admin = await requireAdmin();
  const parsed = updateQuoteStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const updated = await AdminRepository.updateQuoteStatus({
      ...parsed.data,
      adminUserId: admin.userId,
    });

    revalidatePath("/admin/sur-mesure");
    revalidatePath("/admin/audit");

    return {
      success: true,
      message: `Le devis ${updated.reference} est désormais au statut : ${updated.status}.`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors du déplacement du devis.";
    return { success: false, error: message };
  }
}
