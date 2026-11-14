import { describe, it, expect } from "vitest";
import { calculateSha256 } from "@/server/storage/s3";

describe("Phase 2 — Stockage Privé S3 & Empreintes SHA-256", () => {
  it("calcule avec exactitude l'empreinte SHA-256 d'un contenu binaire", () => {
    const testData = Buffer.from("YEKPON DIGIT — Livrable Logiciel Sécurisé 2026");
    const hash = calculateSha256(testData);

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);

    // Hash stable et déterministe
    const hash2 = calculateSha256(testData);
    expect(hash2).toBe(hash);
  });
});
