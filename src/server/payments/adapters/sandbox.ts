import "server-only";
import crypto from "crypto";
import { type PaymentProvider } from "../adapter";
import {
  type PaymentProviderId,
  type PaymentMethod,
  type InitiatePaymentParams,
  type InitiatePaymentResult,
  type WebhookEvent,
  type StatusCheckResult,
  type RefundResult,
} from "../types";
import { env } from "@/lib/env";

interface SandboxTx {
  ref: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | "pending" | "cancelled" | "refunded";
  createdAt: number;
}

// Mémoire persistante en cours de session d'exécution
const sandboxTxStore = new Map<string, SandboxTx>();

export const SandboxPaymentProvider: PaymentProvider = {
  id: "sandbox",
  name: "Simulateur Sandbox Test YEKPON",

  supports(_ctx: { country: string; currency: string; method?: PaymentMethod }): boolean {
    // Le mode sandbox supporte tous les pays et méthodes si activé
    return true;
  },

  async initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    const providerRef = `sbx_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    sandboxTxStore.set(providerRef, {
      ref: providerRef,
      orderId: params.orderId,
      amount: params.amountXof,
      currency: "XOF",
      status: "succeeded",
      createdAt: Date.now(),
    });

    const redirectUrl = `${params.returnUrl}${
      params.returnUrl.includes("?") ? "&" : "?"
    }provider=sandbox&ref=${providerRef}&order_id=${params.orderId}&status=success`;

    return {
      redirectUrl,
      providerRef,
      mode: "sandbox",
    };
  },

  async verifyWebhook(
    req: Request,
    rawBody: string
  ): Promise<{ valid: boolean; event?: WebhookEvent; error?: string }> {
    try {
      const signature = req.headers.get("x-sandbox-signature");
      const secret = env.SANDBOX_WEBHOOK_SECRET || "dev-sandbox-webhook-secret-key-32ch";

      if (signature) {
        const expected = crypto
          .createHmac("sha256", secret)
          .update(rawBody)
          .digest("hex");

        if (signature !== expected) {
          return { valid: false, error: "Signature HMAC Sandbox invalide." };
        }
      }

      const body = JSON.parse(rawBody) as {
        event_id?: string;
        event_type?: string;
        provider_ref?: string;
        order_id?: string;
        amount?: number;
        currency?: string;
        status?: string;
      };

      if (!body.order_id || !body.provider_ref) {
        return { valid: false, error: "Champs requis order_id ou provider_ref manquants." };
      }

      // Enregistre ou met à jour dans le store interne
      sandboxTxStore.set(body.provider_ref, {
        ref: body.provider_ref,
        orderId: body.order_id,
        amount: Number(body.amount) || 0,
        currency: body.currency || "XOF",
        status: (body.status as any) || "succeeded",
        createdAt: Date.now(),
      });

      return {
        valid: true,
        event: {
          provider: "sandbox",
          eventId: body.event_id || `evt_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
          eventType: body.event_type || "payment.succeeded",
          providerRef: body.provider_ref,
          orderId: body.order_id,
          amount: Number(body.amount) || 0,
          currency: body.currency || "XOF",
          status: (body.status as any) || "succeeded",
          rawPayload: body as Record<string, unknown>,
        },
      };
    } catch (e) {
      return { valid: false, error: `Erreur d'analyse du webhook sandbox: ${(e as Error).message}` };
    }
  },

  async fetchStatus(providerRef: string): Promise<StatusCheckResult> {
    const tx = sandboxTxStore.get(providerRef);

    if (tx) {
      return {
        status: tx.status === "refunded" ? "cancelled" : tx.status,
        providerRef,
        amount: tx.amount,
        currency: tx.currency,
        rawPayload: { ...tx },
      };
    }

    // Si la référence commence par sbx_, on valide en mode sandbox
    if (providerRef.startsWith("sbx_")) {
      return {
        status: "succeeded",
        providerRef,
        amount: 0,
        currency: "XOF",
        rawPayload: { ref: providerRef, simulated: true },
      };
    }

    return {
      status: "failed",
      providerRef,
      amount: 0,
      currency: "XOF",
      rawPayload: { error: "Transaction introuvable" },
    };
  },

  async refund(providerRef: string, _amount: number): Promise<RefundResult> {
    const tx = sandboxTxStore.get(providerRef);
    if (tx) {
      tx.status = "refunded";
      return { success: true, refundRef: `ref_${providerRef}` };
    }
    return { success: true, refundRef: `ref_mock_${Date.now()}` };
  },
};
