import "server-only";

export interface SsrfValidationResult {
  isValid: boolean;
  error?: string;
  normalizedUrl?: string;
}

/**
 * Valide strictement une URL de démo contre les attaques SSRF (Server-Side Request Forgery)
 * Conforme OWASP ASVS niveau 2.
 */
export function validateDemoUrl(rawUrl: string, allowedOrigins?: string[]): SsrfValidationResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isValid: false, error: "L'URL est requise." };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { isValid: false, error: "Format d'URL syntaxiquement invalide." };
  }

  // 1. Refus strict des protocoles non HTTP/HTTPS
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return {
      isValid: false,
      error: `Protocole non autorisé : '${parsed.protocol}'. Seuls http:// et https:// sont acceptés.`,
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 2. Refus de localhost et domaines locaux
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname === "0.0.0.0" ||
    hostname === "[::1]" ||
    hostname === "::1"
  ) {
    return {
      isValid: false,
      error: "Accès aux adresses locales (localhost) interdit pour des raisons de sécurité.",
    };
  }

  // 3. Détection et blocage des adresses IP privées (RFC 1918, Link-local, Cloud Metadata)
  // IPv4 regex standard
  const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const octet1 = parseInt(ipv4Match[1] ?? "0", 10);
    const octet2 = parseInt(ipv4Match[2] ?? "0", 10);

    // 127.0.0.0/8 (Loopback)
    if (octet1 === 127) {
      return { isValid: false, error: "Adresses loopback (127.x.x.x) interdites." };
    }

    // 10.0.0.0/8 (Privé)
    if (octet1 === 10) {
      return { isValid: false, error: "Adresses IP privées (10.x.x.x) interdites." };
    }

    // 172.16.0.0/12 (Privé)
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
      return { isValid: false, error: "Adresses IP privées (172.16-31.x.x) interdites." };
    }

    // 192.168.0.0/16 (Privé)
    if (octet1 === 192 && octet2 === 168) {
      return { isValid: false, error: "Adresses IP privées (192.168.x.x) interdites." };
    }

    // 169.254.0.0/16 (Link-local & Cloud Metadata 169.254.169.254)
    if (octet1 === 169 && octet2 === 254) {
      return { isValid: false, error: "Adresses metadata cloud / link-local (169.254.x.x) interdites." };
    }
  }

  // 4. Vérification de la liste blanche d'origines (si spécifiée)
  if (allowedOrigins && allowedOrigins.length > 0) {
    const origin = parsed.origin.toLowerCase();
    const isWhitelisted = allowedOrigins.some(
      (allowed) => allowed.toLowerCase() === origin || allowed.toLowerCase() === hostname
    );

    if (!isWhitelisted) {
      return {
        isValid: false,
        error: `L'origine '${origin}' ne fait pas partie de la liste blanche des serveurs de démonstration autorisés.`,
      };
    }
  }

  return {
    isValid: true,
    normalizedUrl: parsed.toString(),
  };
}
