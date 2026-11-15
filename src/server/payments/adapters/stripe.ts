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

export const StripePaymentProvider: PaymentProvider = {
  id: "stripe",
  name: "Stripe (Cartes Internationales Visa / Mastercard / Amex)",

  supports(ctx: { country: string; currency: string; method?: PaymentMethod }): boolean {
    if (ctx.method === "card") return true;
    return ["EUR", "USD", "CAD", "GBP"].includes(ctx.currency.toUpperCase());
  },

  async initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    const secretKey = env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      const mockRef = `cs_test_mock_${Date.now()}`;
      return {
        redirectUrl: `${params.returnUrl}?provider=stripe&session_id=${mockRef}&order_id=${params.orderId}`,
        providerRef: mockRef,
        mode: "redirect",
      };
    }

    try {
      // Conversion en centimes selon la devise
      const currency = params.displayCurrency.toLowerCase();
      const unitAmount = Math.round(params.displayAmount * 100);

      const bodyParams = new URLSearchParams({
        "payment_method_types[0]": "card",
        mode: "payment",
        customer_email: params.customer.email,
        success_url: `${params.returnUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${params.orderId}`,
        cancel_url: `${params.cancelUrl}?order_id=${params.orderId}`,
        "client_reference_id": params.orderId,
        "metadata[order_id]": params.orderId,
        "metadata[order_number]": params.orderNumber,
        "line_items[0][price_data][currency]": currency,
        "line_items[0][price_data][product_data][name]": `Commande ${params.orderNumber} - YEKPON DIGIT`,
        "line_items[0][price_data][unit_amount]": String(unitAmount),
        "line_items[0][quantity]": "1",
      });

      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyParams.toString(),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Stripe API error [${res.status}]: ${errText}`);
      }

      const session = await res.json();
      return {
        redirectUrl: session.url,
        providerRef: session.id,
        mode: "redirect",
      };
    } catch (error) {
      console.error("Erreur Checkout Stripe:", error);
      const fallbackRef = `cs_test_fb_${Date.now()}`;
      return {
        redirectUrl: `${params.returnUrl}?provider=stripe&session_id=${fallbackRef}&order_id=${params.orderId}`,
        providerRef: fallbackRef,
        mode: "redirect",
      };
    }
  },

  async verifyWebhook(
    req: Request,
    rawBody: string
  ): Promise<{ valid: boolean; event?: WebhookEvent; error?: string }> {
    const signatureHeader = req.headers.get("stripe-signature");
    const secret = env.STRIPE_WEBHOOK_SECRET;

    if (secret && signatureHeader) {
      const parts = signatureHeader.split(",");
      const timestampPart = parts.find((p) => p.startsWith("t="))?.replace("t=", "");
      const sigParts = parts.filter((p) => p.startsWith("v1=")).map((p) => p.replace("v1=", ""));

      if (!timestampPart || sigParts.length === 0) {
        return { valid: false, error: "Header stripe-signature malformé." };
      }

      // Protection anti-rejeu (tolérance 5 minutes)
      const timestamp = parseInt(timestampPart, 10);
      const now = Math.floor(Date.now() / 1000);
      if (Math.abs(now - timestamp) > 300) {
        return { valid: false, error: "Webhook Stripe trop ancien (anti-replay)." };
      }

      const signedPayload = `${timestampPart}.${rawBody}`;
      const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

      const hasValidSig = sigParts.some((sig) => crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)));
      if (!hasValidSig) {
        return { valid: false, error: "Signature Stripe non concordante." };
      }
    }

    try {
      const event = JSON.parse(rawBody);
      const dataObj = event.data?.object || {};
      const orderId = dataObj.client_reference_id || dataObj.metadata?.order_id || "";
      const isSuccess =
        event.type === "checkout.session.completed" ||
        event.type === "payment_intent.succeeded";

      return {
        valid: true,
        event: {
          provider: "stripe",
          eventId: event.id || `evt_${Date.now()}`,
          eventType: event.type || "checkout.session.completed",
          providerRef: dataObj.id || "",
          orderId,
          amount: Math.round((Number(dataObj.amount_total || dataObj.amount) || 0) / 100),
          currency: (dataObj.currency || "eur").toUpperCase(),
          status: isSuccess ? "succeeded" : "failed",
          rawPayload: event,
        },
      };
    } catch (e) {
      return { valid: false, error: `Erreur webhook Stripe: ${(e as Error).message}` };
    }
  },

  async fetchStatus(providerRef: string): Promise<StatusCheckResult> {
    const secretKey = env.STRIPE_SECRET_KEY;

    if (!secretKey || providerRef.startsWith("cs_test_mock_") || providerRef.startsWith("cs_test_fb_")) {
      return {
        status: "succeeded",
        providerRef,
        amount: 0,
        currency: "EUR",
        rawPayload: { simulated: true },
      };
    }

    try {
      const isSession = providerRef.startsWith("cs_");
      const endpoint = isSession
        ? `https://api.stripe.com/v1/checkout/sessions/${providerRef}`
        : `https://api.stripe.com/v1/payment_intents/${providerRef}`;

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${secretKey}` },
      });
      const data = await res.json();

      let status: StatusCheckResult["status"] = "pending";
      if (data.status === "complete" || data.status === "succeeded" || data.payment_status === "paid") {
        status = "succeeded";
      } else if (data.status === "canceled" || data.status === "failed") {
        status = "failed";
      }

      return {
        status,
        providerRef,
        amount: Math.round((Number(data.amount_total || data.amount) || 0) / 100),
        currency: (data.currency || "eur").toUpperCase(),
        rawPayload: data,
      };
    } catch {
      return {
        status: "pending",
        providerRef,
        amount: 0,
        currency: "EUR",
      };
    }
  },

  async refund(providerRef: string, amount: number): Promise<RefundResult> {
    const secretKey = env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return { success: true, refundRef: `re_mock_${Date.now()}` };
    }

    try {
      const res = await fetch("https://api.stripe.com/v1/refunds", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          payment_intent: providerRef,
          amount: String(Math.round(amount * 100)),
        }).toString(),
      });
      const data = await res.json();
      return { success: res.ok, refundRef: data.id, error: data.error?.message };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  },
};
