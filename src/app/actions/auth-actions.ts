"use server";

import { redirect } from "next/navigation";
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "@/schemas/auth";
import { UserRepository } from "@/server/repositories/user-repository";
import { hashPassword } from "@/server/auth/password";
import { createSession, destroySession } from "@/server/auth/session";
import { verifyTotpCode } from "@/server/auth/totp";
import { isAdminRole } from "@/server/auth/rbac";

export interface ActionResult {
  success: boolean;
  error?: string;
  require2FA?: boolean;
}

export async function loginAction(data: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  const user = await UserRepository.verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return { success: false, error: "Email ou mot de passe incorrect." };
  }

  if (user.is_blocked) {
    return { success: false, error: "Ce compte a été suspendu. Veuillez contacter le support." };
  }

  // Vérification 2FA pour les comptes administratifs ou avec 2FA activé
  if (user.two_factor_enabled && user.two_factor_secret) {
    if (!parsed.data.totpCode) {
      return { success: false, require2FA: true };
    }

    const isValidTotp = verifyTotpCode(user.two_factor_secret, parsed.data.totpCode);
    if (!isValidTotp) {
      return { success: false, error: "Code d'authentification 2FA invalide ou expiré.", require2FA: true };
    }
  }

  await createSession({
    userId: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    isTwoFactorVerified: true,
  });

  return { success: true };
}

export async function signupAction(data: SignupInput): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  const existing = await UserRepository.findByEmail(parsed.data.email);
  if (existing) {
    return { success: false, error: "Un compte existe déjà avec cette adresse email." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await UserRepository.create({
    email: parsed.data.email,
    passwordHash,
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    country: parsed.data.country,
    role: "customer",
  });

  await createSession({
    userId: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
  });

  return { success: true };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/connexion");
}
