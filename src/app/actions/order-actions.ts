"use server";

import { z } from "zod";
import { headers } from "next/headers";
import crypto from "crypto";
import { OrderRepository } from "@/server/repositories/order-repository";
import { PaymentRouter } from "@/server/payments/router";
import { type PaymentMethod } from "@/server/payments/types";
import { getSession } from "@/server/auth/session";
import { env } from "@/lib/env";

const OrderCheckoutSchema = z.object({
  customerName: z.string().min(2, "Le nom complet est obligatoire."),
  email: z.string().email("Veuillez saisir une adresse email valide pour recevoir vos licences."),
  phone: z.string().optional(),
  country: z.string().min(2).max(3).default("BJ"),
  paymentMethod: z.enum(["momo", "card", "sandbox"]).default("momo"),
  displayCurrency: z.enum(["XOF", "EUR", "USD"]).default("XOF"),
  couponCode: z.string().optional().nullable(),
  cgvAccepted: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions générales de vente (CGV)." }),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().uuid().or(z.string().min(1)),
        productSlug: z.string().optional(),
        licenseCode: z.enum(["standard", "extended"]).default("standard"),
        quantity: z.number().int().min(1).default(1),
        addons: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              priceXof: z.number().nonnegative(),
            })
          )
          .optional()
          .default([]),
      })
    )
    .min(1, "Votre panier est vide."),
});

export type OrderCheckoutInput = z.infer<typeof OrderCheckoutSchema>;

export interface CreateOrderActionResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  redirectUrl?: string;
  mode?: "redirect" | "modal" | "sandbox";
  error?: string;
}

export async function createOrderAction(
  data: OrderCheckoutInput
): Promise<CreateOrderActionResult> {
  const parseResult = OrderCheckoutSchema.safeParse(data);

  if (!parseResult.success) {
    const firstErr = parseResult.error.errors[0]?.message || "Données de commande invalides.";
    return { success: false, error: firstErr };
  }

  const input = parseResult.data;

  // Calcul du hash d'IP pour audit anti-fraude sans stocker l'IP en clair
  const headerList = await headers();
  const rawIp = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";
  const ipHash = crypto.createHash("sha256").update(rawIp).digest("hex");
  const userAgent = headerList.get("user-agent") || "";
  const userAgentHash = crypto.createHash("sha256").update(userAgent).digest("hex");

  // Détection session utilisateur connecté
  const session = await getSession();
  const userId = session?.userId ?? null;

  try {
    // 1. Création sécurisée de la commande avec recalcul des prix côté serveur
    const { order } = await OrderRepository.createOrder({
      userId,
      email: input.email,
      customerName: input.customerName,
      customerPhone: input.phone,
      country: input.country,
      displayCurrency: input.displayCurrency,
      couponCode: input.couponCode,
      items: input.items,
      ipHash,
      userAgentHash,
    });

    const baseUrl = env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const returnUrl = `${baseUrl}/commande/${order.id}/statut`;
    const cancelUrl = `${baseUrl}/panier?cancelled=true&order=${order.number}`;
    const callbackUrl = `${baseUrl}/api/webhooks/fedapay`;

    // 2. Déclenchement de la transaction auprès de la passerelle via PaymentRouter
    const paymentResult = await PaymentRouter.initiatePayment({
      orderId: order.id,
      orderNumber: order.number,
      amountXof: order.total_xof,
      currency: order.currency,
      displayCurrency: order.display_currency,
      displayAmount: order.display_total,
      customer: {
        name: input.customerName,
        email: input.email,
        phone: input.phone,
        country: input.country,
      },
      method: input.paymentMethod as PaymentMethod,
      returnUrl,
      cancelUrl,
      callbackUrl,
    });

    // 3. Enregistrement de la tentative de paiement dans la base de données
    await OrderRepository.createPaymentRecord(
      order.id,
      paymentResult.mode === "sandbox" ? "sandbox" : "gateway",
      paymentResult.providerRef,
      order.total_xof,
      order.currency,
      input.paymentMethod
    );

    // Si nous sommes en mode Sandbox simulation, on valide automatiquement la commande
    if (input.paymentMethod === "sandbox" || paymentResult.mode === "sandbox") {
      await OrderRepository.markAsPaid(order.id, paymentResult.providerRef);
    }

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.number,
      redirectUrl: paymentResult.redirectUrl || returnUrl,
      mode: paymentResult.mode,
    };
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    return {
      success: false,
      error: `Échec de création de la commande: ${(error as Error).message}`,
    };
  }
}
