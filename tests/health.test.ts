import { describe, it, expect } from "vitest";
import { env } from "@/lib/env";
import { getSecurityHeaders } from "@/proxy";

describe("Phase 0 — Socle Technique & Sécurité", () => {
  it("valide la présence et conformité des variables d'environnement", () => {
    expect(env.NEXT_PUBLIC_APP_NAME).toBe("YEKPON DIGIT");
    expect(env.DATABASE_URL).toBeDefined();
    expect(env.AUTH_SECRET).toBeDefined();
    expect(env.PAYMENT_PROVIDERS_ENABLED).toBeDefined();
  });

  it("génère les en-têtes de sécurité obligatoires (CSP, HSTS, X-Content-Type-Options, etc.)", () => {
    const headers = getSecurityHeaders();

    expect(headers["Strict-Transport-Security"]).toBe("max-age=63072000; includeSubDomains; preload");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
  });
});
