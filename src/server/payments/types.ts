import "server-only";

export type PaymentProviderId = "fedapay" | "kkiapay" | "stripe" | "moneroo" | "sandbox";

export type PaymentMethod = "momo" | "card" | "sandbox";

export type PaymentStatus =
  | "initiated"
  | "pending"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded"
  | "disputed";

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  country: string;
}

export interface InitiatePaymentParams {
  orderId: string;
  orderNumber: string;
  amountXof: number;
  currency: string;
  displayCurrency: "XOF" | "EUR" | "USD";
  displayAmount: number;
  customer: CustomerInfo;
  method: PaymentMethod;
  returnUrl: string;
  cancelUrl: string;
  callbackUrl: string;
}

export interface InitiatePaymentResult {
  redirectUrl?: string;
  clientToken?: string;
  providerRef: string;
  mode: "redirect" | "modal" | "sandbox";
}

export interface WebhookEvent {
  provider: PaymentProviderId;
  eventId: string;
  eventType: string;
  providerRef: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | "cancelled" | "pending";
  rawPayload: Record<string, unknown>;
}

export interface StatusCheckResult {
  status: "succeeded" | "failed" | "pending" | "cancelled";
  providerRef: string;
  amount: number;
  currency: string;
  rawPayload?: Record<string, unknown>;
}

export interface RefundResult {
  success: boolean;
  refundRef?: string;
  error?: string;
}
