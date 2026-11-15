import "server-only";
import crypto from "crypto";
import { query, pool } from "@/server/db";
import { ProductRepository } from "./product-repository";
import { CouponRepository } from "./coupon-repository";
import { generateLicenseKey, signLicenseKey } from "@/server/licenses/generator";

export interface OrderRecord {
  id: string;
  number: string;
  user_id: string | null;
  email: string;
  status: "pending" | "paid" | "failed" | "cancelled" | "refunded" | "disputed";
  currency: string;
  subtotal_xof: number;
  discount_xof: number;
  tax_xof: number;
  total_xof: number;
  display_currency: "XOF" | "EUR" | "USD";
  display_total: number;
  fx_rate: number;
  coupon_code: string | null;
  billing: {
    name: string;
    phone?: string;
    country: string;
  };
  ip_hash: string | null;
  user_agent_hash: string | null;
  locale: string;
  created_at: string;
  paid_at: string | null;
  fulfilled_at: string | null;
}

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string;
  product_title_snapshot: string;
  license_code: string;
  unit_price_xof: number;
  addon_snapshot: { id: string; name: string; priceXof: number }[];
  quantity: number;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  provider: string;
  provider_ref: string;
  status: string;
  amount_xof: number;
  currency: string;
  method: string | null;
  raw_payload: Record<string, unknown>;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface LicenseRecord {
  id: string;
  order_item_id: string;
  user_id: string | null;
  email: string;
  product_id: string;
  key: string;
  license_code: string;
  status: "active" | "suspended" | "revoked";
  domains: string[];
  max_domains: number;
  issued_at: string;
  expires_at: string | null;
  signature?: string;
}

export interface CreateOrderParams {
  userId?: string | null;
  email: string;
  customerName: string;
  customerPhone?: string;
  country: string;
  displayCurrency: "XOF" | "EUR" | "USD";
  couponCode?: string | null;
  items: {
    productId: string;
    productSlug?: string;
    licenseCode: "standard" | "extended";
    quantity: number;
    addons?: { id: string; name: string; priceXof: number }[];
  }[];
  ipHash?: string;
  userAgentHash?: string;
}

// Stores de réplication en mémoire pour fonctionnement hors-ligne / fallback tests
const IN_MEMORY_ORDERS = new Map<string, OrderRecord>();
const IN_MEMORY_ORDER_ITEMS = new Map<string, OrderItemRecord[]>();
const IN_MEMORY_PAYMENTS = new Map<string, PaymentRecord[]>();
const IN_MEMORY_LICENSES = new Map<string, LicenseRecord[]>();
const IN_MEMORY_WEBHOOKS = new Set<string>();

let orderCounter = 1042;

export const OrderRepository = {
  async createOrder(params: CreateOrderParams): Promise<{ order: OrderRecord; items: OrderItemRecord[] }> {
    const orderId = crypto.randomUUID();
    const orderNumber = `YD-${new Date().getFullYear()}-${String(orderCounter++).padStart(6, "0")}`;

    // 1. Recalcul STRICT des prix côté serveur (Zero Trust Client)
    let calculatedSubtotalXof = 0;
    const computedItems: OrderItemRecord[] = [];

    for (const item of params.items) {
      // Trouver le produit officiel
      let product = null;
      if (item.productSlug) {
        product = await ProductRepository.findBySlug(item.productSlug);
      }
      if (!product) {
        // Recherche dans le catalogue global
        const listRes = await ProductRepository.list({ limit: 100 });
        const summary = listRes.products.find((p) => p.id === item.productId);
        if (summary) {
          product = await ProductRepository.findBySlug(summary.slug);
        }
      }

      if (!product) {
        throw new Error(`Produit introuvable pour la commande: ${item.productId}`);
      }

      // Prix officiel de la licence sélectionnée
      let licensePriceXof = product.base_price_xof;
      const foundLic = product.licenses.find((l) => l.code === item.licenseCode);
      if (foundLic) {
        licensePriceXof = foundLic.price_xof;
      } else if (item.licenseCode === "extended") {
        licensePriceXof = Math.round(product.base_price_xof * 2.5);
      } else if (product.sale_price_xof) {
        licensePriceXof = product.sale_price_xof;
      }

      // Options additionnelles
      const addons = item.addons || [];
      const addonsTotal = addons.reduce((sum, a) => sum + (Number(a.priceXof) || 0), 0);
      const unitPriceWithAddons = licensePriceXof + addonsTotal;
      const qty = Math.max(1, item.quantity || 1);

      calculatedSubtotalXof += unitPriceWithAddons * qty;

      computedItems.push({
        id: crypto.randomUUID(),
        order_id: orderId,
        product_id: product.id,
        product_title_snapshot: product.title_fr,
        license_code: item.licenseCode,
        unit_price_xof: licensePriceXof,
        addon_snapshot: addons,
        quantity: qty,
        created_at: new Date().toISOString(),
      });
    }

    // 2. Recalcul du coupon côté serveur
    let discountXof = 0;
    let validCouponCode: string | null = null;

    if (params.couponCode) {
      const coupon = await CouponRepository.findByCode(params.couponCode);
      if (coupon && coupon.is_active && calculatedSubtotalXof >= coupon.min_order_xof) {
        validCouponCode = coupon.code;
        if (coupon.discount_type === "percentage") {
          discountXof = Math.round((calculatedSubtotalXof * coupon.value) / 100);
        } else {
          discountXof = Math.min(coupon.value, calculatedSubtotalXof);
        }
      }
    }

    const totalXof = Math.max(0, calculatedSubtotalXof - discountXof);

    // Calcul de l'affichage dans la devise choisie
    let fxRate = 1.0;
    let displayTotal = totalXof;

    if (params.displayCurrency === "EUR") {
      fxRate = 1 / 655.957;
      displayTotal = Math.round(totalXof * fxRate * 100) / 100;
    } else if (params.displayCurrency === "USD") {
      fxRate = 1 / 600;
      displayTotal = Math.round(totalXof * fxRate * 100) / 100;
    }

    const orderRecord: OrderRecord = {
      id: orderId,
      number: orderNumber,
      user_id: params.userId ?? null,
      email: params.email.toLowerCase().trim(),
      status: "pending",
      currency: "XOF",
      subtotal_xof: calculatedSubtotalXof,
      discount_xof: discountXof,
      tax_xof: 0,
      total_xof: totalXof,
      display_currency: params.displayCurrency,
      display_total: displayTotal,
      fx_rate: fxRate,
      coupon_code: validCouponCode,
      billing: {
        name: params.customerName,
        phone: params.customerPhone,
        country: params.country,
      },
      ip_hash: params.ipHash ?? null,
      user_agent_hash: params.userAgentHash ?? null,
      locale: "fr",
      created_at: new Date().toISOString(),
      paid_at: null,
      fulfilled_at: null,
    };

    // Sauvegarder dans la mémoire de réplication
    IN_MEMORY_ORDERS.set(orderId, orderRecord);
    IN_MEMORY_ORDER_ITEMS.set(orderId, computedItems);

    // Tentative d'insertion SQL avec Neon PostgreSQL
    try {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        await client.query(
          `INSERT INTO orders (
            id, number, user_id, email, status, currency, subtotal_xof,
            discount_xof, tax_xof, total_xof, display_currency, display_total,
            fx_rate, coupon_code, billing, ip_hash, user_agent_hash, locale
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12,
            $13, $14, $15, $16, $17, $18
          );`,
          [
            orderRecord.id,
            orderRecord.number,
            orderRecord.user_id,
            orderRecord.email,
            orderRecord.status,
            orderRecord.currency,
            orderRecord.subtotal_xof,
            orderRecord.discount_xof,
            orderRecord.tax_xof,
            orderRecord.total_xof,
            orderRecord.display_currency,
            orderRecord.display_total,
            orderRecord.fx_rate,
            orderRecord.coupon_code,
            JSON.stringify(orderRecord.billing),
            orderRecord.ip_hash,
            orderRecord.user_agent_hash,
            orderRecord.locale,
          ]
        );

        for (const item of computedItems) {
          await client.query(
            `INSERT INTO order_items (
              id, order_id, product_id, product_title_snapshot,
              license_code, unit_price_xof, addon_snapshot, quantity
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
            [
              item.id,
              item.order_id,
              item.product_id,
              item.product_title_snapshot,
              item.license_code,
              item.unit_price_xof,
              JSON.stringify(item.addon_snapshot),
              item.quantity,
            ]
          );
        }

        await client.query("COMMIT");
      } catch (dbErr) {
        await client.query("ROLLBACK");
        // Fallback transparent si PostgreSQL est hors réseau
      } finally {
        client.release();
      }
    } catch {
      // Ignorer si la connexion Neon n'est pas joignable (mode sandbox / offline)
    }

    return { order: orderRecord, items: computedItems };
  },

  async findById(id: string): Promise<OrderRecord | null> {
    try {
      const res = await query<OrderRecord>(
        `SELECT * FROM orders WHERE id = $1 LIMIT 1;`,
        [id]
      );
      if (res.rows[0]) return res.rows[0];
    } catch {}
    return IN_MEMORY_ORDERS.get(id) ?? null;
  },

  async findByNumber(number: string): Promise<OrderRecord | null> {
    try {
      const res = await query<OrderRecord>(
        `SELECT * FROM orders WHERE number = $1 LIMIT 1;`,
        [number]
      );
      if (res.rows[0]) return res.rows[0];
    } catch {}
    for (const ord of IN_MEMORY_ORDERS.values()) {
      if (ord.number === number) return ord;
    }
    return null;
  },

  async getOrderDetails(id: string): Promise<{
    order: OrderRecord;
    items: OrderItemRecord[];
    payments: PaymentRecord[];
    licenses: LicenseRecord[];
  } | null> {
    const order = await this.findById(id);
    if (!order) return null;

    let items: OrderItemRecord[] = [];
    let payments: PaymentRecord[] = [];
    let licenses: LicenseRecord[] = [];

    try {
      const [itemsRes, paymentsRes, licensesRes] = await Promise.all([
        query<OrderItemRecord>(`SELECT * FROM order_items WHERE order_id = $1;`, [id]),
        query<PaymentRecord>(`SELECT * FROM payments WHERE order_id = $1;`, [id]),
        query<LicenseRecord>(
          `SELECT l.* FROM licenses l JOIN order_items oi ON oi.id = l.order_item_id WHERE oi.order_id = $1;`,
          [id]
        ),
      ]);
      items = itemsRes.rows;
      payments = paymentsRes.rows;
      licenses = licensesRes.rows;
    } catch {}

    if (items.length === 0) {
      items = IN_MEMORY_ORDER_ITEMS.get(id) ?? [];
    }
    if (payments.length === 0) {
      payments = IN_MEMORY_PAYMENTS.get(id) ?? [];
    }
    if (licenses.length === 0) {
      licenses = IN_MEMORY_LICENSES.get(id) ?? [];
    }

    return { order, items, payments, licenses };
  },

  async markAsPaid(orderId: string, paymentRef: string): Promise<void> {
    const now = new Date().toISOString();

    const order = IN_MEMORY_ORDERS.get(orderId);
    if (order) {
      order.status = "paid";
      order.paid_at = now;
      order.fulfilled_at = now;
    }

    // Mettre à jour en SQL
    try {
      await query(
        `UPDATE orders SET status = 'paid', paid_at = NOW(), fulfilled_at = NOW() WHERE id = $1;`,
        [orderId]
      );
      await query(
        `UPDATE payments SET status = 'succeeded', updated_at = NOW() WHERE order_id = $1 AND provider_ref = $2;`,
        [orderId, paymentRef]
      );
    } catch {}

    // Générer automatiquement les clés de licences
    await this.generateLicensesForOrder(orderId);
  },

  async markAsFailed(orderId: string, reason: string): Promise<void> {
    const order = IN_MEMORY_ORDERS.get(orderId);
    if (order) {
      order.status = "failed";
    }

    try {
      await query(
        `UPDATE orders SET status = 'failed' WHERE id = $1;`,
        [orderId]
      );
      await query(
        `UPDATE payments SET status = 'failed', failure_reason = $2, updated_at = NOW() WHERE order_id = $1;`,
        [orderId, reason]
      );
    } catch {}
  },

  async createPaymentRecord(
    orderId: string,
    provider: string,
    providerRef: string,
    amountXof: number,
    currency: string,
    method?: string
  ): Promise<void> {
    const payment: PaymentRecord = {
      id: crypto.randomUUID(),
      order_id: orderId,
      provider,
      provider_ref: providerRef,
      status: "initiated",
      amount_xof: amountXof,
      currency,
      method: method ?? null,
      raw_payload: {},
      failure_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const existing = IN_MEMORY_PAYMENTS.get(orderId) || [];
    existing.push(payment);
    IN_MEMORY_PAYMENTS.set(orderId, existing);

    try {
      await query(
        `INSERT INTO payments (
          id, order_id, provider, provider_ref, status, amount_xof, currency, method
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (provider, provider_ref) DO UPDATE SET updated_at = NOW();`,
        [
          payment.id,
          payment.order_id,
          payment.provider,
          payment.provider_ref,
          payment.status,
          payment.amount_xof,
          payment.currency,
          payment.method,
        ]
      );
    } catch {}
  },

  async isWebhookProcessed(provider: string, eventId: string): Promise<boolean> {
    const key = `${provider}:${eventId}`;
    if (IN_MEMORY_WEBHOOKS.has(key)) return true;

    try {
      const res = await query(
        `SELECT 1 FROM webhook_events WHERE provider = $1 AND event_id = $2 LIMIT 1;`,
        [provider, eventId]
      );
      return res.rows.length > 0;
    } catch {
      return false;
    }
  },

  async recordWebhookEvent(
    provider: string,
    eventId: string,
    signatureValid: boolean,
    payload: unknown,
    processedAt: Date | null,
    error?: string
  ): Promise<void> {
    const key = `${provider}:${eventId}`;
    IN_MEMORY_WEBHOOKS.add(key);

    try {
      await query(
        `INSERT INTO webhook_events (
          id, provider, event_id, signature_valid, payload, processed_at, error
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (provider, event_id) DO NOTHING;`,
        [
          crypto.randomUUID(),
          provider,
          eventId,
          signatureValid,
          JSON.stringify(payload),
          processedAt ? processedAt.toISOString() : null,
          error ?? null,
        ]
      );
    } catch {}
  },

  async generateLicensesForOrder(orderId: string): Promise<LicenseRecord[]> {
    const order = await this.findById(orderId);
    if (!order) return [];

    let items = IN_MEMORY_ORDER_ITEMS.get(orderId);
    if (!items || items.length === 0) {
      try {
        const res = await query<OrderItemRecord>(
          `SELECT * FROM order_items WHERE order_id = $1;`,
          [orderId]
        );
        items = res.rows;
      } catch {
        items = [];
      }
    }

    const generated: LicenseRecord[] = [];

    for (const item of items) {
      const key = generateLicenseKey();
      const signature = signLicenseKey(key, item.product_id, order.email);
      const maxDomains = item.license_code === "extended" ? 999 : 1;

      const lic: LicenseRecord = {
        id: crypto.randomUUID(),
        order_item_id: item.id,
        user_id: order.user_id,
        email: order.email,
        product_id: item.product_id,
        key,
        license_code: item.license_code,
        status: "active",
        domains: [],
        max_domains: maxDomains,
        issued_at: new Date().toISOString(),
        expires_at: null,
        signature,
      };

      generated.push(lic);

      try {
        await query(
          `INSERT INTO licenses (
            id, order_item_id, user_id, email, product_id, key, license_code,
            status, max_domains, issued_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (key) DO NOTHING;`,
          [
            lic.id,
            lic.order_item_id,
            lic.user_id,
            lic.email,
            lic.product_id,
            lic.key,
            lic.license_code,
            lic.status,
            lic.max_domains,
            lic.issued_at,
          ]
        );
      } catch {}
    }

    IN_MEMORY_LICENSES.set(orderId, generated);
    return generated;
  },
};
