import "server-only";
import crypto from "crypto";
import { env } from "@/lib/env";

// Alphabet Base32 sans caractères ambigus (pas de 0/O, 1/I/L)
const BASE32_SAFE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/**
 * Génère une clé de licence format YDXX-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(prefix = "YD"): string {
  const bytes = crypto.randomBytes(15);
  let result = prefix;

  for (let i = 0; i < 14; i++) {
    const byte = bytes[i]!;
    result += BASE32_SAFE_ALPHABET[byte % BASE32_SAFE_ALPHABET.length];
  }

  // Découper en 4 blocs de 4 caractères: XXXX-XXXX-XXXX-XXXX
  const clean = result.slice(0, 16);
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}`;
}

/**
 * Signe une clé de licence avec le secret HMAC interne
 */
export function signLicenseKey(key: string, productId: string, email: string): string {
  const secret = env.LICENSE_SIGNING_SECRET || "dev-license-signing-secret-key-32ch";
  const message = `${key}:${productId}:${email.toLowerCase().trim()}`;
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

/**
 * Vérifie l'authenticité d'une signature de licence HMAC
 */
export function verifyLicenseSignature(
  key: string,
  productId: string,
  email: string,
  expectedSignature: string
): boolean {
  try {
    const actual = signLicenseKey(key, productId, email);
    const bufActual = Buffer.from(actual, "utf8");
    const bufExpected = Buffer.from(expectedSignature, "utf8");
    if (bufActual.length !== bufExpected.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufActual, bufExpected);
  } catch {
    return false;
  }
}
