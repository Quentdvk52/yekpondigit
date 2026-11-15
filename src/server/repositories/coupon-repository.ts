import "server-only";
import { query } from "@/server/db";

export interface CouponRecord {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  value: number;
  min_order_xof: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

const FALLBACK_COUPONS: CouponRecord[] = [
  {
    id: "c0000000-0000-0000-0000-000000000001",
    code: "BIENVENUE10",
    discount_type: "percentage",
    value: 10,
    min_order_xof: 0,
    max_uses: 1000,
    used_count: 14,
    expires_at: "2027-12-31T23:59:59Z",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000002",
    code: "STARTUP2026",
    discount_type: "percentage",
    value: 20,
    min_order_xof: 100000,
    max_uses: 500,
    used_count: 32,
    expires_at: "2027-12-31T23:59:59Z",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000003",
    code: "LANCEMENT",
    discount_type: "fixed",
    value: 15000,
    min_order_xof: 50000,
    max_uses: 200,
    used_count: 18,
    expires_at: "2027-12-31T23:59:59Z",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000004",
    code: "VIP50",
    discount_type: "fixed",
    value: 50000,
    min_order_xof: 150000,
    max_uses: 50,
    used_count: 7,
    expires_at: "2027-12-31T23:59:59Z",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const CouponRepository = {
  async findByCode(rawCode: string): Promise<CouponRecord | null> {
    const code = rawCode.trim().toUpperCase();
    try {
      const res = await query<CouponRecord>(
        `SELECT * FROM coupons WHERE UPPER(code) = $1 AND is_active = true LIMIT 1;`,
        [code]
      );
      if (res.rows[0]) return res.rows[0];
      return FALLBACK_COUPONS.find((c) => c.code === code && c.is_active) ?? null;
    } catch {
      return FALLBACK_COUPONS.find((c) => c.code === code && c.is_active) ?? null;
    }
  },

  async incrementUsage(couponId: string): Promise<void> {
    try {
      await query(
        `UPDATE coupons SET used_count = used_count + 1 WHERE id = $1;`,
        [couponId]
      );
    } catch {
      // mode hors-ligne
    }
  },
};
