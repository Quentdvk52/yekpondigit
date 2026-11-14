import { describe, it, expect } from "vitest";
import { generateTotpSecret, generateTotpCode, verifyTotpCode } from "@/server/auth/totp";
import { signSession, verifySessionToken } from "@/server/auth/session";
import { hashPasswordOffline, verifyPasswordOffline } from "@/server/auth/password";

describe("Phase 2 — Authentification & Sécurité", () => {
  describe("TOTP (RFC 6238)", () => {
    it("génère un secret base32 valide et une URL otpauth correcte", () => {
      const { secret, otpauthUrl } = generateTotpSecret("admin@yekpondigit.com", "YEKPON DIGIT");
      expect(secret).toHaveLength(32);
      expect(otpauthUrl).toContain("otpauth://totp/");
      expect(otpauthUrl).toContain("secret=" + secret);
      expect(otpauthUrl).toContain("issuer=YEKPON%20DIGIT");
    });

    it("génère et vérifie un code TOTP à 6 chiffres", () => {
      const { secret } = generateTotpSecret("test@yekpondigit.com");
      const currentCode = generateTotpCode(secret);
      expect(currentCode).toMatch(/^\d{6}$/);

      const isValid = verifyTotpCode(secret, currentCode);
      expect(isValid).toBe(true);

      const isInvalid = verifyTotpCode(secret, "000000");
      expect(isInvalid).toBe(false);
    });

    it("rejette les formats de code invalides", () => {
      const { secret } = generateTotpSecret("test@yekpondigit.com");
      expect(verifyTotpCode(secret, "")).toBe(false);
      expect(verifyTotpCode(secret, "12345")).toBe(false);
      expect(verifyTotpCode(secret, "abcdef")).toBe(false);
    });
  });

  describe("Sessions signées HMAC-SHA256", () => {
    it("signe et vérifie un jeton de session valide", () => {
      const user = {
        userId: "00000000-0000-0000-0000-000000000001",
        email: "admin@yekpondigit.com",
        fullName: "Super Administrateur",
        role: "super_admin" as const,
      };

      const token = signSession(user);
      expect(token).toContain(".");

      const verified = verifySessionToken(token);
      expect(verified).not.toBeNull();
      expect(verified?.userId).toBe(user.userId);
      expect(verified?.email).toBe(user.email);
      expect(verified?.role).toBe("super_admin");
    });

    it("rejette un token altéré ou falsifié", () => {
      const user = {
        userId: "00000000-0000-0000-0000-000000000001",
        email: "user@yekpondigit.com",
        fullName: "Test",
        role: "customer" as const,
      };

      const token = signSession(user);
      const [payload, sig] = token.split(".");
      const tamperedToken = `${payload}.${sig}xyz`;

      expect(verifySessionToken(tamperedToken)).toBeNull();
    });
  });

  describe("Hachage de mot de passe", () => {
    it("hache et vérifie correctement un mot de passe en mode hors-base", () => {
      const password = "MonSuperMotDePasse2026!";
      const { hash, salt } = hashPasswordOffline(password);

      expect(verifyPasswordOffline(password, hash, salt)).toBe(true);
      expect(verifyPasswordOffline("MauvaisMotDePasse", hash, salt)).toBe(false);
    });
  });
});
