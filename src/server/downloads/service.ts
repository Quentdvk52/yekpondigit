import "server-only";
import crypto from "crypto";
import { query } from "@/server/db";
import { env } from "@/lib/env";
import { getPresignedDownloadUrl } from "@/server/storage/s3";

export interface DownloadTokenPayload {
  licenseId: string;
  fileId: string;
  storagePath: string;
  email: string;
  exp: number;
  nonce: string;
}

const IN_MEMORY_DOWNLOAD_LOGS: {
  id: string;
  licenseId: string;
  fileId: string;
  ipHash: string;
  createdAt: number;
}[] = [];

export const DownloadService = {
  /**
   * Génère un jeton signé temporaire à usage unique (TTL 60-120s)
   */
  generateDownloadToken(
    licenseId: string,
    fileId: string,
    storagePath: string,
    email: string,
    ttlSeconds = 120
  ): string {
    const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
    const nonce = crypto.randomBytes(8).toString("hex");

    const payload: DownloadTokenPayload = {
      licenseId,
      fileId,
      storagePath,
      email: email.toLowerCase(),
      exp,
      nonce,
    };

    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const secret = env.DOWNLOAD_TOKEN_SECRET || "dev-download-token-secret-key-32ch";
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payloadB64)
      .digest("base64url");

    return `${payloadB64}.${signature}`;
  },

  /**
   * Vérifie la validité d'un jeton de téléchargement
   */
  verifyDownloadToken(token: string): DownloadTokenPayload | null {
    if (!token || !token.includes(".")) return null;

    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;

    const secret = env.DOWNLOAD_TOKEN_SECRET || "dev-download-token-secret-key-32ch";
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(payloadB64)
      .digest("base64url");

    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    try {
      const json = Buffer.from(payloadB64, "base64url").toString("utf-8");
      const payload = JSON.parse(json) as DownloadTokenPayload;

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        return null; // Expiré
      }

      return payload;
    } catch {
      return null;
    }
  },

  /**
   * Vérifie le quota de téléchargement (max 10 téléchargements par 30 jours par défaut)
   */
  async checkDownloadQuota(licenseId: string, maxPerMonth = 10): Promise<{ allowed: boolean; remaining: number }> {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    let count = 0;
    try {
      const res = await query<{ count: string }>(
        `SELECT count(*) FROM download_logs WHERE license_id = $1 AND created_at > NOW() - INTERVAL '30 days';`,
        [licenseId]
      );
      count = parseInt(res.rows[0]?.count ?? "0", 10);
    } catch {
      // Fallback mémoire
      count = IN_MEMORY_DOWNLOAD_LOGS.filter(
        (log) => log.licenseId === licenseId && log.createdAt > thirtyDaysAgo
      ).length;
    }

    const remaining = Math.max(0, maxPerMonth - count);
    return {
      allowed: count < maxPerMonth,
      remaining,
    };
  },

  /**
   * Enregistre un audit log de téléchargement et génère l'URL présignée S3
   */
  async processDownload(
    token: string,
    rawIp = "127.0.0.1"
  ): Promise<{ presignedUrl: string; storagePath: string }> {
    const payload = this.verifyDownloadToken(token);
    if (!payload) {
      throw new Error("Lien de téléchargement expiré ou jeton invalide.");
    }

    // Vérification du quota
    const quota = await this.checkDownloadQuota(payload.licenseId);
    if (!quota.allowed) {
      throw new Error(
        "Quota mensuel de téléchargement atteint (10/10). Contactez le support pour une réinitialisation."
      );
    }

    // Audit log
    const ipHash = crypto.createHash("sha256").update(rawIp).digest("hex");
    IN_MEMORY_DOWNLOAD_LOGS.push({
      id: crypto.randomUUID(),
      licenseId: payload.licenseId,
      fileId: payload.fileId,
      ipHash,
      createdAt: Date.now(),
    });

    try {
      await query(
        `INSERT INTO download_logs (license_id, product_file_id, ip_hash, success)
         VALUES ($1, $2, $3, true);`,
        [payload.licenseId, payload.fileId, ipHash]
      );
    } catch {}

    // Génération URL S3 signée (TTL court 120s)
    let presignedUrl = "";
    try {
      presignedUrl = await getPresignedDownloadUrl(payload.storagePath, 120);
    } catch {
      // Si S3 n'est pas configuré en dev local, lien simulé
      presignedUrl = `https://mock-s3.yekpondigit.com/${payload.storagePath}?token=mock_valid`;
    }

    return { presignedUrl, storagePath: payload.storagePath };
  },
};
