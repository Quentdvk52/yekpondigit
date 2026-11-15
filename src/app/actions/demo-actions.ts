"use server";

import { query } from "@/server/db";
import { decryptDemoCredentials } from "@/server/security/crypto";

export interface DemoCredentialsResult {
  success: boolean;
  credentials?: Record<string, string>;
  error?: string;
}

export async function getDemoCredentialsAction(demoId: string): Promise<DemoCredentialsResult> {
  if (!demoId) {
    return { success: false, error: "Identifiant de démo requis." };
  }

  try {
    const res = await query<{ credentials_encrypted: string | null }>(
      "SELECT credentials_encrypted FROM demos WHERE id = $1 AND is_active = true LIMIT 1;",
      [demoId]
    );

    const encrypted = res.rows[0]?.credentials_encrypted;
    if (!encrypted) {
      return {
        success: true,
        credentials: {
          Email: "demo@yekpondigit.com",
          "Mot de passe": "DemoClient2026!",
          Rôle: "Utilisateur Démo (Lecture Seule)",
        },
      };
    }

    try {
      const decrypted = decryptDemoCredentials(encrypted);
      return { success: true, credentials: decrypted };
    } catch {
      return {
        success: true,
        credentials: {
          Email: "demo@yekpondigit.com",
          "Mot de passe": "DemoClient2026!",
          Note: "Identifiants par défaut en bac à sable",
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de la récupération des accès.",
    };
  }
}
