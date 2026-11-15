import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { PaymentRouter } from "@/server/payments/router";
import { SandboxPaymentProvider } from "@/server/payments/adapters/sandbox";
import { OrderRepository } from "@/server/repositories/order-repository";
import { env } from "@/lib/env";

describe("Phase 5 — Couche d'Abstraction Paiement & Commandes", () => {
  it("sélectionne le bon adaptateur selon le moyen de paiement et la devise", () => {
    // 1. Sandbox forcé
    const p1 = PaymentRouter.selectProvider({
      country: "BJ",
      currency: "XOF",
      method: "sandbox",
    });
    expect(p1.id).toBe("sandbox");

    // 2. Mobile Money en Afrique de l'Ouest (Bénin) -> FedaPay ou KKiaPay
    const p2 = PaymentRouter.selectProvider({
      country: "BJ",
      currency: "XOF",
      method: "momo",
    });
    expect(["fedapay", "kkiapay"]).toContain(p2.id);

    // 3. Carte bancaire en Euros -> Stripe
    const p3 = PaymentRouter.selectProvider({
      country: "FR",
      currency: "EUR",
      method: "card",
    });
    expect(p3.id).toBe("stripe");
  });

  it("crée une commande avec recalcul strict des prix et numéro séquentiel", async () => {
    const { order, items } = await OrderRepository.createOrder({
      email: "test.acheteur@yekpondigit.com",
      customerName: "Acheteur Test",
      country: "BJ",
      displayCurrency: "XOF",
      items: [
        {
          productId: "30000000-0000-0000-0000-000000000001",
          productSlug: "demo-yekpon-store-ecommerce",
          licenseCode: "standard",
          quantity: 1,
        },
      ],
    });

    expect(order.id).toBeDefined();
    expect(order.number).toMatch(/^YD-\d{4}-\d{6}$/);
    expect(order.status).toBe("pending");
    expect(order.subtotal_xof).toBeGreaterThan(0);
    expect(order.total_xof).toBe(order.subtotal_xof);
    expect(items.length).toBe(1);
    expect(items[0]?.unit_price_xof).toBeGreaterThan(0);
  });

  it("initialise un paiement et valide le webhook sandbox avec signature HMAC", async () => {
    const { order } = await OrderRepository.createOrder({
      email: "sandbox.user@yekpondigit.com",
      customerName: "Sandbox Tester",
      country: "BJ",
      displayCurrency: "XOF",
      items: [
        {
          productId: "30000000-0000-0000-0000-000000000001",
          licenseCode: "standard",
          quantity: 1,
        },
      ],
    });

    // 1. Initialisation
    const initRes = await SandboxPaymentProvider.initiate({
      orderId: order.id,
      orderNumber: order.number,
      amountXof: order.total_xof,
      currency: "XOF",
      displayCurrency: "XOF",
      displayAmount: order.total_xof,
      customer: {
        name: "Sandbox Tester",
        email: "sandbox.user@yekpondigit.com",
        country: "BJ",
      },
      method: "sandbox",
      returnUrl: "http://localhost:3000/commande/return",
      cancelUrl: "http://localhost:3000/commande/cancel",
      callbackUrl: "http://localhost:3000/api/webhooks/sandbox",
    });

    expect(initRes.providerRef).toBeDefined();
    expect(initRes.redirectUrl).toContain("provider=sandbox");

    // 2. Simulation Webhook valide avec signature HMAC
    const payloadObj = {
      event_id: `evt_test_${Date.now()}`,
      event_type: "payment.succeeded",
      provider_ref: initRes.providerRef,
      order_id: order.id,
      amount: order.total_xof,
      currency: "XOF",
      status: "succeeded",
    };
    const rawBody = JSON.stringify(payloadObj);
    const secret = env.SANDBOX_WEBHOOK_SECRET || "dev-sandbox-webhook-secret-key-32ch";
    const validSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

    const reqValid = new Request("http://localhost:3000/api/webhooks/sandbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sandbox-signature": validSignature,
      },
      body: rawBody,
    });

    const verifyRes = await SandboxPaymentProvider.verifyWebhook(reqValid, rawBody);
    expect(verifyRes.valid).toBe(true);
    expect(verifyRes.event?.orderId).toBe(order.id);
    expect(verifyRes.event?.status).toBe("succeeded");

    // 3. Vérification de rejet d'une signature contrefaite
    const reqInvalid = new Request("http://localhost:3000/api/webhooks/sandbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sandbox-signature": "mauvaise-signature-contrefaite",
      },
      body: rawBody,
    });

    const verifyInvalidRes = await SandboxPaymentProvider.verifyWebhook(reqInvalid, rawBody);
    expect(verifyInvalidRes.valid).toBe(false);
  });

  it("génère automatiquement les licences lors du passage de la commande à 'paid'", async () => {
    const { order } = await OrderRepository.createOrder({
      email: "fulfill.test@yekpondigit.com",
      customerName: "Fulfill Tester",
      country: "BJ",
      displayCurrency: "XOF",
      items: [
        {
          productId: "30000000-0000-0000-0000-000000000001",
          licenseCode: "standard",
          quantity: 1,
        },
      ],
    });

    await OrderRepository.markAsPaid(order.id, "test_ref_123");

    const details = await OrderRepository.getOrderDetails(order.id);
    expect(details?.order.status).toBe("paid");
    expect(details?.order.paid_at).not.toBeNull();
    expect(details?.licenses.length).toBeGreaterThanOrEqual(1);

    const lic = details?.licenses[0];
    expect(lic?.key).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    expect(lic?.status).toBe("active");
  });
});
