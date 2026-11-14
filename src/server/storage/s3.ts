import "server-only";
import crypto from "node:crypto";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

export function getS3Client(): S3Client {
  return new S3Client({
    region: env.AWS_REGION,
    endpoint: env.AWS_ENDPOINT_URL_S3,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID ?? "mock-access-key",
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "mock-secret-key",
    },
    forcePathStyle: true, // Requis pour Neon S3 / MinIO / S3 compatibles
  });
}

/**
 * Calcule l'empreinte cryptographique SHA-256 d'un buffer ou stream binaire
 */
export function calculateSha256(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Génère une URL présignée de téléchargement courte (TTL 60 à 120s selon OWASP ASVS)
 */
export async function getPresignedDownloadUrl(
  storagePath: string,
  expiresInSeconds = 120
): Promise<string> {
  const s3 = getS3Client();
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_PRIVATE,
    Key: storagePath,
  });

  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

/**
 * Téléverse un fichier livrable vers le bucket S3 privé et retourne son hash et sa taille
 */
export async function uploadPrivateDeliverable(
  storagePath: string,
  buffer: Buffer,
  contentType = "application/zip"
): Promise<{ storagePath: string; sizeBytes: number; sha256: string }> {
  const sha256 = calculateSha256(buffer);
  const sizeBytes = buffer.length;

  const s3 = getS3Client();
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_PRIVATE,
    Key: storagePath,
    Body: buffer,
    ContentType: contentType,
    Metadata: {
      "sha256-checksum": sha256,
    },
  });

  await s3.send(command);

  return {
    storagePath,
    sizeBytes,
    sha256,
  };
}
