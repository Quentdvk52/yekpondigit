import "server-only";
import crypto from "node:crypto";

/**
 * Implémentation TOTP standard RFC 6238 (SHA-1, 6 chiffres, 30s)
 * Sans dépendance externe pour une sécurité et maintenabilité maximales.
 */

// Table de décodage Base32 (RFC 4648)
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Decode(base32: string): Buffer {
  const cleanBase32 = base32.toUpperCase().replace(/=+$/, "").replace(/[\s-]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleanBase32.length; i++) {
    const char = cleanBase32[i];
    const index = BASE32_ALPHABET.indexOf(char ?? "");
    if (index === -1) {
      throw new Error(`Caractère invalide dans le secret base32 : ${char}`);
    }
    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | (buffer[i] ?? 0);
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Génère un secret TOTP cryptographiquement sécurisé (160 bits / 20 octets)
 */
export function generateTotpSecret(email: string, issuer = "YEKPON DIGIT"): { secret: string; otpauthUrl: string } {
  const randomBytes = crypto.randomBytes(20);
  const secret = base32Encode(randomBytes);
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(email);
  const otpauthUrl = `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;

  return { secret, otpauthUrl };
}

/**
 * Calcule le code TOTP pour un horodatage donné (step)
 */
export function generateTotpCode(secretBase32: string, timeStep = Math.floor(Date.now() / 1000 / 30)): string {
  const key = base32Decode(secretBase32);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(timeStep), 0);

  const hmac = crypto.createHmac("sha1", key);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  // Dynamic truncation (RFC 4226)
  const offset = (digest[digest.length - 1] ?? 0) & 0x0f;
  const binary =
    (((digest[offset] ?? 0) & 0x7f) << 24) |
    (((digest[offset + 1] ?? 0) & 0xff) << 16) |
    (((digest[offset + 2] ?? 0) & 0xff) << 8) |
    ((digest[offset + 3] ?? 0) & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, "0");
}

/**
 * Vérifie la validité d'un code TOTP à 6 chiffres avec tolérance de dérive (±1 fenêtre de 30s)
 */
export function verifyTotpCode(secretBase32: string, token: string): boolean {
  if (!token || token.length !== 6 || !/^\d{6}$/.test(token)) {
    return false;
  }

  const currentStep = Math.floor(Date.now() / 1000 / 30);

  // Tolérance ±1 pas temporel (fenêtre totale de 90 secondes)
  for (const stepOffset of [-1, 0, 1]) {
    const expected = generateTotpCode(secretBase32, currentStep + stepOffset);
    if (crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
      return true;
    }
  }

  return false;
}
