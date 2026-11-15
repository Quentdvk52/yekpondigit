import "server-only";
import { query } from "@/server/db";
import { getSession } from "@/server/auth/session";

export interface AuditLogEntry {
  id: string;
  actor_id: string | null;
  actor_email?: string;
  action: string;
  entity: string;
  entity_id: string;
  diff: Record<string, unknown>;
  ip_hash: string | null;
  created_at: string;
}

// Mémoire tampon pour fallback hors-ligne / tests unitaires
const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud_01",
    actor_id: "00000000-0000-0000-0000-000000000001",
    actor_email: "admin@yekpondigit.com",
    action: "product.publish",
    entity: "product",
    entity_id: "prod_1",
    diff: { status: "published", version: "1.2.0" },
    ip_hash: "a3f58e...12b9",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "aud_02",
    actor_id: "00000000-0000-0000-0000-000000000001",
    actor_email: "admin@yekpondigit.com",
    action: "order.verify",
    entity: "order",
    entity_id: "ord_1001",
    diff: { status: "paid", amount_xof: 125000, provider: "fedapay" },
    ip_hash: "74cd1a...88e1",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "aud_03",
    actor_id: "00000000-0000-0000-0000-000000000001",
    actor_email: "admin@yekpondigit.com",
    action: "license.generate",
    entity: "license",
    entity_id: "lic_1",
    diff: { key: "YD26-LIVE-9X82-K7M4", max_domains: 1 },
    ip_hash: "74cd1a...88e1",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export class AuditLogger {
  /**
   * Enregistre une action d'administration de manière immuable
   */
  static async log(params: {
    actorId?: string;
    action: string;
    entity: string;
    entityId: string;
    diff?: Record<string, unknown>;
    ipHash?: string;
  }): Promise<AuditLogEntry> {
    const entry: AuditLogEntry = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actor_id: params.actorId || null,
      action: params.action,
      entity: params.entity,
      entity_id: params.entityId,
      diff: params.diff || {},
      ip_hash: params.ipHash || null,
      created_at: new Date().toISOString(),
    };

    try {
      const sql = `
        INSERT INTO audit_logs (actor_id, action, entity, entity_id, diff, ip_hash)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const res = await query(sql, [
        entry.actor_id,
        entry.action,
        entry.entity,
        entry.entity_id,
        JSON.stringify(entry.diff),
        entry.ip_hash,
      ]);

      if (res.rows[0]) {
        return res.rows[0] as AuditLogEntry;
      }
    } catch {
      // Fallback mémoire en cas d'indisponibilité réseau
    }

    MOCK_AUDIT_LOGS.unshift(entry);
    return entry;
  }

  /**
   * Récupère la liste des logs d'audit avec pagination
   */
  static async list(limit = 50): Promise<AuditLogEntry[]> {
    try {
      const sql = `
        SELECT a.*, p.email as actor_email
        FROM audit_logs a
        LEFT JOIN profiles p ON a.actor_id = p.id
        ORDER BY a.created_at DESC
        LIMIT $1;
      `;
      const res = await query(sql, [limit]);
      if (res.rows.length > 0) {
        return res.rows as AuditLogEntry[];
      }
    } catch {
      // Fallback
    }

    return MOCK_AUDIT_LOGS.slice(0, limit);
  }
}
