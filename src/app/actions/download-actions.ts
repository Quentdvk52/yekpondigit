"use server";

import { DownloadService } from "@/server/downloads/service";
import { getSession } from "@/server/auth/session";

export interface GenerateDownloadTokenResult {
  success: boolean;
  downloadUrl?: string;
  remainingQuota?: number;
  error?: string;
}

export async function requestDownloadAction(
  licenseId: string,
  fileId: string,
  storagePath: string
): Promise<GenerateDownloadTokenResult> {
  const session = await getSession();
  const userEmail = session?.email || "demo.client@yekpondigit.com";

  try {
    // 1. Vérification du quota
    const quota = await DownloadService.checkDownloadQuota(licenseId);
    if (!quota.allowed) {
      return {
        success: false,
        error: "Quota mensuel de téléchargement atteint (10/10). Contactez le support.",
      };
    }

    // 2. Génération du jeton signé temporaire
    const token = DownloadService.generateDownloadToken(
      licenseId,
      fileId,
      storagePath,
      userEmail,
      120 // 2 minutes
    );

    const downloadUrl = `/api/downloads/${token}`;

    return {
      success: true,
      downloadUrl,
      remainingQuota: quota.remaining,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Échec de génération du lien de téléchargement.",
    };
  }
}
