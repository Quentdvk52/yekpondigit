"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/rbac";
import { completeProductWizardSchema, type ProductWizardInput } from "@/schemas/product";
import { ProductRepository } from "@/server/repositories/product-repository";
import { AuditRepository } from "@/server/repositories/audit-repository";

export interface ProductActionResult {
  success: boolean;
  productId?: string;
  error?: string;
}

export async function createProductAction(data: ProductWizardInput): Promise<ProductActionResult> {
  const admin = await requireAdmin();

  const parsed = completeProductWizardSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const productId = await ProductRepository.create(parsed.data, admin.userId);

    await AuditRepository.log({
      actorId: admin.userId,
      action: "product.create",
      entity: "products",
      entityId: productId,
      diff: { title_fr: parsed.data.title_fr, slug: parsed.data.slug },
    });

    revalidatePath("/admin/produits");
    revalidatePath("/boutique");
    return { success: true, productId };
  } catch (error) {
    console.error("Erreur création produit :", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inattendue lors de la création.",
    };
  }
}

export async function deleteProductAction(productId: string): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();

  try {
    const deleted = await ProductRepository.delete(productId);
    if (!deleted) {
      return { success: false, error: "Produit introuvable." };
    }

    await AuditRepository.log({
      actorId: admin.userId,
      action: "product.delete",
      entity: "products",
      entityId: productId,
    });

    revalidatePath("/admin/produits");
    revalidatePath("/boutique");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de la suppression.",
    };
  }
}
