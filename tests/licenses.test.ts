import { describe, it, expect } from "vitest";
import { DownloadService } from "@/server/downloads/service";
import { POST as verifyLicenseRoute } from "@/app/api/licenses/verify/route";

describe("Phase 6 — Licences, Téléchargements S3 & Espace Client", () => {
  it("génère et valide un jeton de téléchargement temporaire", () => {
    const token = DownloadService.generateDownloadToken(
      "lic_test_123",
      "file_test_456",
      "products/demo/1/source-v1.zip",
      "acheteur@test.com",
      120 // 2 minutes
    );

    expect(token).toBeDefined();
    expect(token).toContain(".");

    const payload = DownloadService.verifyDownloadToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.licenseId).toBe("lic_test_123");
    expect(payload?.fileId).toBe("file_test_456");
    expect(payload?.storagePath).toBe("products/demo/1/source-v1.zip");
    expect(payload?.email).toBe("acheteur@test.com");
  });

  it("rejette un jeton de téléchargement expiré ou altéré", () => {
    // 1. Jeton expiré (TTL négatif)
    const expiredToken = DownloadService.generateDownloadToken(
      "lic_exp",
      "file_exp",
      "path/to/file.zip",
      "test@test.com",
      -10 // déjà expiré
    );

    const expPayload = DownloadService.verifyDownloadToken(expiredToken);
    expect(expPayload).toBeNull();

    // 2. Jeton altéré
    const validToken = DownloadService.generateDownloadToken(
      "lic_valid",
      "file_valid",
      "path/to/file.zip",
      "test@test.com",
      120
    );
    const tampered = validToken.slice(0, -4) + "XXXX";
    const tamperedPayload = DownloadService.verifyDownloadToken(tampered);
    expect(tamperedPayload).toBeNull();
  });

  it("vérifie le respect du quota de téléchargement", async () => {
    const quota = await DownloadService.checkDownloadQuota("lic_quota_test", 10);
    expect(quota.allowed).toBe(true);
    expect(quota.remaining).toBeLessThanOrEqual(10);
  });

  it("génère une URL présignée de téléchargement valide lors du traitement du jeton", async () => {
    const token = DownloadService.generateDownloadToken(
      "lic_proc_test",
      "file_proc_test",
      "products/demo/1/source-v1.zip",
      "client@test.com",
      120
    );

    const result = await DownloadService.processDownload(token, "192.168.1.50");
    expect(result.presignedUrl).toBeDefined();
    expect(result.storagePath).toBe("products/demo/1/source-v1.zip");
  });

  it("vérifie publiquement une clé de licence via l'API /api/licenses/verify", async () => {
    // Clé valide format YDXX-XXXX-XXXX-XXXX
    const req = new Request("http://localhost:3000/api/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "YD26-LIVE-9X82-K7M4", domain: "maboutique.bj" }),
    });

    const res = await verifyLicenseRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.valid).toBe(true);
    expect(data.status).toBe("active");
    expect(data.license).toBeDefined();
  });

  it("rejette une clé de licence au format invalide", async () => {
    const req = new Request("http://localhost:3000/api/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "cle-non-conforme" }),
    });

    const res = await verifyLicenseRoute(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.valid).toBe(false);
    expect(data.status).toBe("invalid_format");
  });
});
