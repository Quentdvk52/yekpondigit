import "server-only";
import {
  type PaymentProviderId,
  type PaymentMethod,
  type InitiatePaymentParams,
  type InitiatePaymentResult,
  type WebhookEvent,
  type StatusCheckResult,
  type RefundResult,
} from "./types";

export interface PaymentProvider {
  readonly id: PaymentProviderId;
  readonly name: string;

  supports(ctx: {
    country: string;
    currency: string;
    method?: PaymentMethod;
  }): boolean;

  initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult>;

  verifyWebhook(
    req: Request,
    rawBody: string
  ): Promise<{
    valid: boolean;
    event?: WebhookEvent;
    error?: string;
  }>;

  fetchStatus(providerRef: string): Promise<StatusCheckResult>;

  refund(providerRef: string, amount: number): Promise<RefundResult>;
}
