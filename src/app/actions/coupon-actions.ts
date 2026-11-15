"use server";

import { CouponRepository } from "@/server/repositories/coupon-repository";

export interface ValidateCouponResult {
  success: boolean;
  coupon?: {
    code: string;
    discountType: "percentage" | "fixed";
    value: number;
    discountXof: number;
  };
  error?: string;
}

export async function validateCouponAction(
  code: string,
  subtotalXof: number
): Promise<ValidateCouponResult> {
  const cleanCode = code?.trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, error: "Veuillez saisir un code promo valide." };
  }

  const coupon = await CouponRepository.findByCode(cleanCode);

  if (!coupon || !coupon.is_active) {
    return { success: false, error: "Ce code promo n'existe pas ou n'est plus actif." };
  }

  // Vérification de la date d'expiration
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { success: false, error: "Ce code promo a expiré." };
  }

  // Vérification du quota d'utilisation
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return { success: false, error: "Ce code promo a atteint sa limite maximale d'utilisations." };
  }

  // Vérification du montant minimum d'achat
  if (subtotalXof < coupon.min_order_xof) {
    return {
      success: false,
      error: `Ce code promo nécessite un montant minimum de commande de ${coupon.min_order_xof.toLocaleString("fr-FR")} FCFA.`,
    };
  }

  // Calcul de la remise
  let discountXof = 0;
  if (coupon.discount_type === "percentage") {
    discountXof = Math.round((subtotalXof * coupon.value) / 100);
  } else {
    discountXof = Math.min(coupon.value, subtotalXof);
  }

  return {
    success: true,
    coupon: {
      code: coupon.code,
      discountType: coupon.discount_type,
      value: coupon.value,
      discountXof,
    },
  };
}
