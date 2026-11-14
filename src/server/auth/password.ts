import "server-only";
import crypto from "node:crypto";
import { query } from "@/server/db";

/**
 * Hachage de mot de passe côté serveur.
 * Utilise pgcrypto bcrypt via PostgreSQL pour garantir la cohérence absolue avec la base de données.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error("Le mot de passe doit comporter au moins 8 caractères.");
  }

  const res = await query<{ hash: string }>("SELECT crypt($1, gen_salt('bf', 12)) AS hash;", [password]);
  const hash = res.rows[0]?.hash;
  if (!hash) {
    throw new Error("Erreur lors de la génération du hash de mot de passe.");
  }
  return hash;
}

/**
 * Vérifie un mot de passe en clair par rapport au hash stocké en base
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) {
    return false;
  }

  try {
    const res = await query<{ valid: boolean }>(
      "SELECT ($1 = crypt($2, $1)) AS valid;",
      [storedHash, password]
    );
    return res.rows[0]?.valid === true;
  } catch (error) {
    console.error("Erreur vérification mot de passe :", error);
    return false;
  }
}

/**
 * Hachage hors-base (pour les tests unitaires purs)
 */
export function hashPasswordOffline(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPasswordOffline(password: string, hash: string, salt: string): boolean {
  const key = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(key), Buffer.from(hash));
}
