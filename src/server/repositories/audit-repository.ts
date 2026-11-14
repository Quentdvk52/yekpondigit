import "server-only";
import { query } from "@/server/db";

export interface AuditLogEntry {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId: string;
  diff?: Record<string, unknown>;
  ipHash?: string;
}

export const AuditRepository = {
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await query(
        `INSERT INTO audit_logs (actor_id, action, entity, entity_id, diff, ip_hash)
         VALUES ($1, $2, $3, $4, $5, $6);`,
        [
          entry.actorId ?? null,
          entry.action,
          entry.entity,
          entry.entityId,
          JSON.stringify(entry.diff ?? {}),
          entry.ipHash ?? null,
        ]
      );
    } catch (error) {
      // Les logs d'audit ne doivent jamais bloquer la transaction principale mais être notés
      console.error("Erreur lors de l'insertion du log d'audit :", error);
    }
  },
};
