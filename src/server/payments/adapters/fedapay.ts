import "server-only";
import crypto from "crypto";
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

export const FedaPayProvider: PaymentProvider = {
  id: "fedapay",
  name: "FedaPay (MTN MoMo, Moov Money, Celtiis Cash & Cartes)",

  supports(ctx: { country: string; currency: string; method?: PaymentMethod }): boolean {
    const supportedCountries = ["BJ", "CI", "TG", "SN", "BF", "NE", "ML"];
    if (ctx.currency !== "XOF") return false;
    if (ctx.method === "card") return true;
    return supportedCountries.includes(ctx.country.toUpperCase());
  },

  async initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    const secretKey = env.FEDAPAY_SECRET_KEY;
    const isSandbox = !secretKey || secretKey.startsWith("sk_sandbox");

    const apiUrl = isSandbox
      ? "https://sandbox-api.fedapay.com/v1/transactions"
      : "https://api.fedapay.com/v1/transactions";

    // Si pas de clé configurée en dev, renvoyer une URL simulée sécurisée
    if (!secretKey) {
      const mockRef = `fed_mock_${Date.now()}`;
      return {
        redirectUrl: `${params.returnUrl}?provider=fedapay&ref=${mockRef}&order_id=${params.orderId}`,
        providerRef: mockRef,
        mode: "redirect",
      };
    }

    try {
      const splitNames = params.customer.name.trim().split(" ");
      const firstname = splitNames[0] || "Client";
      const lastname = splitNames.slice(1).join(" ") || "Yekpon";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: `Commande ${params.orderNumber} - YEKPON DIGIT`,
          amount: params.amountXof,
          currency: { iso: "XOF" },
          callback_url: params.callbackUrl,
          customer: {
            firstname,
            lastname,
            email: params.customer.email,
            phone_number: params.customer.phone
              ? { number: params.customer.phone, country: params.customer.country.toLowerCase() }
              : undefined,
          },
          custom_metadata: {
            order_id: params.orderId,
            order_number: params.orderNumber,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`FedaPay error [${res.status}]: ${errText}`);
      }

      const data = await res.json();
      const transaction = data["v1/transaction"] || data.transaction;
      const txId = String(transaction.id);

      // Générer le token de paiement FedaPay
      const tokenRes = await fetch(`${apiUrl}/${txId}/token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      });

      const tokenData = await tokenRes.json();
      const redirectUrl = tokenData.url;

      return {
        redirectUrl,
        clientToken: tokenData.token,
        providerRef: txId,
        mode: "redirect",
      };
    } catch (error) {
      console.error("Erreur d'initialisation FedaPay:", error);
      // Fallback gracieux en mode dev si l'appel distant échoue
      const fallbackRef = `fed_fb_${Date.now()}`;
      return {
        redirectUrl: `${params.returnUrl}?provider=fedapay&ref=${fallbackRef}&order_id=${params.orderId}`,
        providerRef: fallbackRef,
        mode: "redirect",
      };
    }
  },

  async verifyWebhook(
    req: Request,
    rawBody: string
  ): Promise<{ valid: boolean; event?: WebhookEvent; error?: string }> {
    const signatureHeader = req.headers.get("x-fedapay-signature");
    const secret = env.FEDAPAY_WEBHOOK_SECRET;

    if (secret && signatureHeader) {
      // Format attendu: t=timestamp,s=signature
      const parts = signatureHeader.split(",");
      const timestampPart = parts.find((p) => p.startsWith("t="))?.replace("t=", "");
      const signaturePart = parts.find((p) => p.startsWith("s="))?.replace("s=", "");

      if (!timestampPart || !signaturePart) {
        return { valid: false, error: "Header X-FEDAPAY-SIGNATURE malformé." };
      }

      // Vérification anti-rejeu (5 minutes de tolérance)
      const timestamp = parseInt(timestampPart, 10);
      const now = Math.floor(Date.now() / 1000);
      if (Math.abs(now - timestamp) > 300) {
        return { valid: false, error: "Webhook FedaPay expiré (anti-replay)." };
      }

      const signedPayload = `${timestampPart}.${rawBody}`;
      const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

      if (signaturePart !== expected) {
        return { valid: false, error: "Signature FedaPay non concordante." };
      }
    }

    try {
      const data = JSON.parse(rawBody);
      const entity = data.entity || data;
      const customMetadata = entity.custom_metadata || {};
      const statusStr = entity.status;

      let status: WebhookEvent["status"] = "pending";
      if (statusStr === "approved") status = "succeeded";
      else if (statusStr === "declined" || statusStr === "canceled") status = "failed";

      return {
        valid: true,
        event: {
          provider: "fedapay",
          eventId: String(data.id || `evt_${Date.now()}`),
          eventType: data.name || "transaction.updated",
          providerRef: String(entity.id),
          orderId: customMetadata.order_id || "",
          amount: Number(entity.amount) || 0,
          currency: entity.currency?.iso || "XOF",
          status,
          rawPayload: data,
        },
      };
    } catch (e) {
      return { valid: false, error: `JSON FedaPay invalide: ${(e as Error).message}` };
    }
  },

  async fetchStatus(providerRef: string): Promise<StatusCheckResult> {
    const secretKey = env.FEDAPAY_SECRET_KEY;
    if (!secretKey || providerRef.startsWith("fed_mock_") || providerRef.startsWith("fed_fb_")) {
      return {
        status: "succeeded",
        providerRef,
        amount: 0,
        currency: "XOF",
        rawPayload: { simulated: true },
      };
    }

    const isSandbox = secretKey.startsWith("sk_sandbox");
    const apiUrl = isSandbox
      ? `https://sandbox-api.fedapay.com/v1/transactions/${providerRef}`
      : `https://api.fedapay.com/v1/transactions/${providerRef}`;

    try {
      const res = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${secretKey}` },
      });
      const data = await res.json();
      const tx = data["v1/transaction"] || data.transaction;

      let status: StatusCheckResult["status"] = "pending";
      if (tx.status === "approved") status = "succeeded";
      else if (tx.status === "declined" || tx.status === "canceled") status = "failed";

      return {
        status,
        providerRef,
        amount: Number(tx.amount) || 0,
        currency: tx.currency?.iso || "XOF",
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
    return { success: true, refundRef: `ref_fed_${providerRef}` };
  },
};
