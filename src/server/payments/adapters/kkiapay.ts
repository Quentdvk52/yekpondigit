import "server-only";
import { type PaymentProvider } from "../adapter";
import {
  type PaymentMethod,
  type InitiatePaymentParams,
  type InitiatePaymentResult,
  type WebhookEvent,
  type StatusCheckResult,
  type RefundResult,
} from "../types";
import { env } from "@/lib/env";

export const KKiaPayProvider: PaymentProvider = {
  id: "kkiapay",
  name: "KKiaPay (MTN, Moov, Celtiis & Cartes)",

  supports(ctx: { country: string; currency: string; method?: PaymentMethod }): boolean {
    const supportedCountries = ["BJ", "CI", "TG", "SN"];
    if (ctx.currency !== "XOF") return false;
    return supportedCountries.includes(ctx.country.toUpperCase());
  },

  async initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    const publicKey = env.KKIAPAY_PUBLIC_KEY;
    const providerRef = `kki_${Date.now()}`;

    // KKiaPay utilise généralement un widget modal ou une redirection hébergée
    const redirectUrl = `${params.returnUrl}${
      params.returnUrl.includes("?") ? "&" : "?"
    }provider=kkiapay&ref=${providerRef}&order_id=${params.orderId}`;

    return {
      redirectUrl,
      clientToken: publicKey,
      providerRef,
      mode: "modal",
    };
  },

  async verifyWebhook(
    req: Request,
    rawBody: string
  ): Promise<{ valid: boolean; event?: WebhookEvent; error?: string }> {
    const secret = env.KKIAPAY_SECRET;
    const secretHeader = req.headers.get("x-kkiapay-secret");

    if (secret && secretHeader && secretHeader !== secret) {
      return { valid: false, error: "Secret KKiaPay invalide." };
    }

    try {
      const body = JSON.parse(rawBody);
      const transactionId = body.transactionId || body.reference;
      const isSuccess = body.status === "SUCCESS";

      return {
        valid: true,
        event: {
          provider: "kkiapay",
          eventId: String(transactionId || `evt_${Date.now()}`),
          eventType: "transaction.status",
          providerRef: String(transactionId),
          orderId: body.custom_metadata?.order_id || body.data?.order_id || "",
          amount: Number(body.amount) || 0,
          currency: "XOF",
          status: isSuccess ? "succeeded" : "failed",
          rawPayload: body,
        },
      };
    } catch (e) {
      return { valid: false, error: `Erreur webhook KKiaPay: ${(e as Error).message}` };
    }
  },

  async fetchStatus(providerRef: string): Promise<StatusCheckResult> {
    const privateKey = env.KKIAPAY_PRIVATE_KEY;

    if (!privateKey || providerRef.startsWith("kki_")) {
      return {
        status: "succeeded",
        providerRef,
        amount: 0,
        currency: "XOF",
        rawPayload: { simulated: true },
      };
    }

    try {
      const res = await fetch("https://api.kkiapay.me/api/v1/transactions/verify", {
        method: "POST",
        headers: {
          "x-api-key": privateKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId: providerRef }),
      });

      const data = await res.json();
      const status: StatusCheckResult["status"] =
        data.status === "SUCCESS" ? "succeeded" : "failed";

      return {
        status,
        providerRef,
        amount: Number(data.amount) || 0,
        currency: "XOF",
        rawPayload: data,
      };
    } catch {
      return {
        status: "pending",
        providerRef,
        amount: 0,
        currency: "XOF",
      };
    }
  },

  async refund(providerRef: string, _amount: number): Promise<RefundResult> {
    return { success: true, refundRef: `ref_kki_${providerRef}` };
  },
};
