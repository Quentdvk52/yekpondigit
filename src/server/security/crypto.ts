import "server-only";
import crypto from "node:crypto";
import { env } from "@/lib/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommandé pour GCM

function getKey(): Buffer {
  // Dérive une clé 256 bits stable à partir de DEMO_CREDENTIALS_KEY
  return crypto.createHash("sha256").update(env.DEMO_CREDENTIALS_KEY).digest();
}

/**
 * Chiffre des identifiants d'accès démo avec AES-256-GCM
 * Format de sortie : `iv:tag:ciphertext` (hexadécimal)
 */
export function encryptDemoCredentials(credentials: Record<string, string>): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const jsonStr = JSON.stringify(credentials);
  const encrypted = Buffer.concat([cipher.update(jsonStr, "utf-8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Déchiffre les identifiants d'accès démo chiffrés avec AES-256-GCM
 */
export function decryptDemoCredentials(payload: string): Record<string, string> {
  if (!payload || !payload.includes(":")) {
    throw new Error("Payload de chiffrement invalide.");
  }

  const parts = payload.split(":");
  if (parts.length !== 3) {
    throw new Error("Structure de payload AES-GCM corrompue.");
  }

  const [ivHex, tagHex, encryptedHex] = parts;
  if (!ivHex || !tagHex || !encryptedHex) {
    throw new Error("Composants de chiffrement manquants.");
  }

  const key = getKey();
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString("utf-8")) as Record<string, string>;
}
