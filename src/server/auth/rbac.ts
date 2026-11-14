import "server-only";
import { redirect } from "next/navigation";
import { getSession, type SessionUser, type UserRole } from "./session";

export class AuthorizationError extends Error {
  constructor(message = "Accès non autorisé") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Vérifie si un rôle fait partie des rôles administrateurs
 */
export function isAdminRole(role: UserRole): boolean {
  return role === "admin" || role === "super_admin";
}

/**
 * Vérifie si un rôle fait partie de l'équipe (support, éditeur, admin)
 */
export function isStaffRole(role: UserRole): boolean {
  return role === "support" || role === "editor" || role === "admin" || role === "super_admin";
}

/**
 * Exige une session active, redirige ou lève une exception
 */
export async function requireAuth(redirectTo = "/connexion"): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Exige un ou plusieurs rôles spécifiques
 */
export async function requireRole(
  allowedRoles: UserRole[],
  redirectTo = "/connexion"
): Promise<SessionUser> {
  const user = await requireAuth(redirectTo);
  if (!allowedRoles.includes(user.role)) {
    throw new AuthorizationError(
      `Permission insuffisante : rôle '${user.role}' non autorisé.`
    );
  }
  return user;
}

/**
 * Exige les privilèges administrateur (admin ou super_admin)
 */
export async function requireAdmin(redirectTo = "/admin/login"): Promise<SessionUser> {
  const user = await getSession();
  if (!user || !isAdminRole(user.role)) {
    redirect(redirectTo);
  }

  return user;
}
