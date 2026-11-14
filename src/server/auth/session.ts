import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export type UserRole = "customer" | "support" | "editor" | "admin" | "super_admin" | "vendor";

export interface SessionUser {
  userId: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  isTwoFactorVerified?: boolean;
}

interface SessionPayload extends SessionUser {
  iat: number;
  exp: number;
}

const SESSION_COOKIE_NAME = "yd_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 jours

/**
 * Signe un payload de session avec HMAC-SHA256
 */
export function signSession(user: SessionUser): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + SESSION_MAX_AGE_SECONDS;

  const payload: SessionPayload = {
    ...user,
    iat,
    exp,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", env.AUTH_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Décode et vérifie l'intégrité et l'expiration d'un token de session
 */
export function verifySessionToken(token: string): SessionUser | null {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payloadBase64, signature] = token.split(".");
  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.AUTH_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  // Comparaison en temps constant anti-timing attack
  const sigBuffer = Buffer.from(signature);
  const expSigBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expSigBuffer.length || !crypto.timingSafeEqual(sigBuffer, expSigBuffer)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr) as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role,
      isTwoFactorVerified: payload.isTwoFactorVerified,
    };
  } catch {
    return null;
  }
}

/**
 * Crée le cookie de session sécurisé dans les headers HTTP
 */
export async function createSession(user: SessionUser): Promise<string> {
  const token = signSession(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return token;
}

/**
 * Récupère l'utilisateur connecté depuis le cookie de session
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) {
      return null;
    }
    return verifySessionToken(sessionCookie.value);
  } catch {
    return null;
  }
}

/**
 * Détruit le cookie de session (déconnexion)
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // Silencieux si déjà détruit
  }
}
