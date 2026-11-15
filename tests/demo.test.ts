import { describe, it, expect } from "vitest";
import { encryptDemoCredentials, decryptDemoCredentials } from "@/server/security/crypto";
import { validateDemoUrl } from "@/server/security/ssrf";

describe("Phase 4 — Système de Démonstrations Sécurisé", () => {
  describe("Chiffrement AES-256-GCM des Identifiants Démo", () => {
    it("chiffre et déchiffre fidèlement les accès démo avec authentification de tag", () => {
      const credentials = {
        Email: "admin@demostore.com",
        "Mot de passe": "SuperSecretDemoPass2026!",
        Rôle: "Gestionnaire Démo",
      };

      const encrypted = encryptDemoCredentials(credentials);
      expect(encrypted).toContain(":");
      const parts = encrypted.split(":");
      expect(parts).toHaveLength(3); // iv:tag:ciphertext

      const decrypted = decryptDemoCredentials(encrypted);
      expect(decrypted.Email).toBe(credentials.Email);
      expect(decrypted["Mot de passe"]).toBe(credentials["Mot de passe"]);
      expect(decrypted.Rôle).toBe(credentials.Rôle);
    });

    it("échoue si le tag d'authentification ou le message est altéré (intégrité cryptographique)", () => {
      const credentials = { key: "value" };
      const encrypted = encryptDemoCredentials(credentials);
      const [iv, tag, ciphertext] = encrypted.split(":");

      // Altération du ciphertext
      const tampered = `${iv}:${tag}:${ciphertext}ff`;
      expect(() => decryptDemoCredentials(tampered)).toThrow();
    });
  });

  describe("Validation Anti-SSRF (OWASP ASVS Niveau 2)", () => {
    it("accepte les URLs HTTPS légitimes", () => {
      const res = validateDemoUrl("https://demo-ecommerce.yekpondigit.com");
      expect(res.isValid).toBe(true);
      expect(res.error).toBeUndefined();
    });

    it("rejette les protocoles non autorisés (file, ftp, gopher, javascript)", () => {
      expect(validateDemoUrl("file:///etc/passwd").isValid).toBe(false);
      expect(validateDemoUrl("ftp://files.example.com").isValid).toBe(false);
      expect(validateDemoUrl("javascript:alert(1)").isValid).toBe(false);
    });

    it("rejette strictement les adresses localhost et loopback", () => {
      expect(validateDemoUrl("http://localhost:3000").isValid).toBe(false);
      expect(validateDemoUrl("http://127.0.0.1:8080").isValid).toBe(false);
      expect(validateDemoUrl("http://127.0.0.2").isValid).toBe(false);
    });

    it("rejette les plages d'adresses IP privées (RFC 1918)", () => {
      expect(validateDemoUrl("http://10.0.0.1").isValid).toBe(false);
      expect(validateDemoUrl("http://192.168.1.1").isValid).toBe(false);
      expect(validateDemoUrl("http://172.16.0.1").isValid).toBe(false);
    });

    it("bloque l'accès aux métadonnées des services cloud (169.254.169.254)", () => {
      const res = validateDemoUrl("http://169.254.169.254/latest/meta-data/");
      expect(res.isValid).toBe(false);
      expect(res.error).toContain("metadata cloud");
    });
  });
});
