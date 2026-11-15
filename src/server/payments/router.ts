import "server-only";
import { type PaymentProvider } from "./adapter";
import {
  type PaymentProviderId,
  type PaymentMethod,
  type InitiatePaymentParams,
  type InitiatePaymentResult,
} from "./types";
import { SandboxPaymentProvider } from "./adapters/sandbox";
import { FedaPayProvider } from "./adapters/fedapay";
import { KKiaPayProvider } from "./adapters/kkiapay";
import { StripePaymentProvider } from "./adapters/stripe";
import { env } from "@/lib/env";

const ALL_PROVIDERS: Record<PaymentProviderId, PaymentProvider> = {
  sandbox: SandboxPaymentProvider,
  fedapay: FedaPayProvider,
  kkiapay: KKiaPayProvider,
  stripe: StripePaymentProvider,
  moneroo: SandboxPaymentProvider, // Moneroo redirige vers sandbox ou adapter dédié
};

export const PaymentRouter = {
  getAvailableProviders(): PaymentProvider[] {
    const enabledIds = (env.PAYMENT_PROVIDERS_ENABLED || "sandbox")
      .split(",")
      .map((s) => s.trim().toLowerCase() as PaymentProviderId);

    return enabledIds
      .map((id) => ALL_PROVIDERS[id])
      .filter((p): p is PaymentProvider => Boolean(p));
  },

  getProviderById(id: PaymentProviderId): PaymentProvider | null {
    return ALL_PROVIDERS[id] ?? null;
  },

  selectProvider(ctx: {
    country: string;
    currency: string;
    method?: PaymentMethod;
  }): PaymentProvider {
    // 1. Si mode simulation / sandbox demandé explicitement
    if (ctx.method === "sandbox") {
      return SandboxPaymentProvider;
    }

    const available = this.getAvailableProviders();

    // 2. Si le client paie en devises internationales (EUR / USD) par carte
    if ((ctx.currency === "EUR" || ctx.currency === "USD") && ctx.method === "card") {
      const stripe = available.find((p) => p.id === "stripe");
      if (stripe && stripe.supports(ctx)) return stripe;
    }

    // 3. Si le client paie en XOF (FCFA) par Mobile Money ou Carte locale
    if (ctx.currency === "XOF" || ["BJ", "CI", "TG", "SN", "BF", "NE", "ML"].includes(ctx.country.toUpperCase())) {
      const fedapay = available.find((p) => p.id === "fedapay");
      if (fedapay && fedapay.supports(ctx)) return fedapay;

      const kkiapay = available.find((p) => p.id === "kkiapay");
      if (kkiapay && kkiapay.supports(ctx)) return kkiapay;
    }

    // 4. Par défaut : trouver le premier provider qui supporte le contexte
    const match = available.find((p) => p.supports(ctx));
    if (match) return match;

    // 5. Repli garanti sur SandboxProvider
    return SandboxPaymentProvider;
  },

  async initiatePayment(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    const provider = this.selectProvider({
      country: params.customer.country,
      currency: params.currency,
      method: params.method,
    });

    return provider.initiate(params);
  },
};
