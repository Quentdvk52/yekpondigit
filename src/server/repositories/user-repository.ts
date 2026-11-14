import "server-only";
import { query } from "@/server/db";
import { type UserRole } from "@/server/auth/session";

export interface ProfileRecord {
  id: string;
  email: string;
  password_hash: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  country: string;
  locale: string;
  role: UserRole;
  is_blocked: boolean;
  two_factor_secret: string | null;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const UserRepository = {
  async findByEmail(email: string): Promise<ProfileRecord | null> {
    const res = await query<ProfileRecord>(
      "SELECT * FROM profiles WHERE LOWER(email) = LOWER($1) LIMIT 1;",
      [email.trim()]
    );
    return res.rows[0] ?? null;
  },

  async findById(id: string): Promise<ProfileRecord | null> {
    const res = await query<ProfileRecord>(
      "SELECT * FROM profiles WHERE id = $1 LIMIT 1;",
      [id]
    );
    return res.rows[0] ?? null;
  },

  async create(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string;
    country?: string;
    role?: UserRole;
  }): Promise<ProfileRecord> {
    const res = await query<ProfileRecord>(
      `INSERT INTO profiles (email, password_hash, full_name, phone, country, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *;`,
      [
        data.email.trim().toLowerCase(),
        data.passwordHash,
        data.fullName.trim(),
        data.phone?.trim() ?? null,
        data.country ?? "BJ",
        data.role ?? "customer",
      ]
    );

    const record = res.rows[0];
    if (!record) {
      throw new Error("Impossible de créer l'utilisateur.");
    }
    return record;
  },

  async updateProfile(
    id: string,
    data: {
      fullName?: string;
      phone?: string;
      country?: string;
      locale?: string;
    }
  ): Promise<ProfileRecord | null> {
    const res = await query<ProfileRecord>(
      `UPDATE profiles
       SET full_name = COALESCE($2, full_name),
           phone = COALESCE($3, phone),
           country = COALESCE($4, country),
           locale = COALESCE($5, locale),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *;`,
      [id, data.fullName, data.phone, data.country, data.locale]
    );
    return res.rows[0] ?? null;
  },

  async setTwoFactor(
    id: string,
    secret: string | null,
    enabled: boolean
  ): Promise<void> {
    await query(
      `UPDATE profiles
       SET two_factor_secret = $2,
           two_factor_enabled = $3,
           updated_at = NOW()
       WHERE id = $1;`,
      [id, secret, enabled]
    );
  },

  async verifyCredentials(email: string, passwordPlain: string): Promise<ProfileRecord | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password_hash || user.is_blocked) {
      return null;
    }

    const res = await query<{ valid: boolean }>(
      "SELECT ($1 = crypt($2, $1)) AS valid;",
      [user.password_hash, passwordPlain]
    );

    if (res.rows[0]?.valid) {
      return user;
    }

    return null;
  },
};
