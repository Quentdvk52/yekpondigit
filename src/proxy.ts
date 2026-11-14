import { NextResponse, type NextRequest } from "next/server";

export function getSecurityHeaders() {
  const isDev = process.env.NODE_ENV !== "production";
  const demoUrl = process.env.NEXT_PUBLIC_DEMO_BASE_URL || "http://localhost:3001";

  // CSP Directives
  const csp = [
    "default-src 'self'",
    isDev
      ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline'", // En production, un nonce dynamique sera injecté
    "style-src 'self' 'unsafe-inline'",
    `frame-src 'self' ${demoUrl} https://*.fedapay.com https://*.kkiapay.me https://*.moneroo.io https://*.stripe.com https://checkout.stripe.com`,
    "connect-src 'self' https://*.neon.tech https://*.supabase.co https://*.upstash.io https://*.sentry.io https://api.resend.com",
    "img-src 'self' data: blob: https://*.neon.tech https://*.supabase.co https://images.unsplash.com",
    "font-src 'self' data:",
    "media-src 'self' blob: https://*.neon.tech",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://*.fedapay.com https://*.kkiapay.me https://*.moneroo.io https://checkout.stripe.com",
    "frame-ancestors 'none'",
  ].join("; ");

  return {
    "Content-Security-Policy": csp,
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(self)",
  };
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const headers = getSecurityHeaders();

  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
