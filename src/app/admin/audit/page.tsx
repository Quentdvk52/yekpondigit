import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/rbac";
import { AuditLogger } from "@/server/audit/audit-logger";
import { AuditLogsClient } from "@/components/admin/audit-logs-client";

export const metadata: Metadata = {
  title: "Journal d'Audit & Sécurité | YEKPON DIGIT Admin",
  description: "Registre immuable des événements et actions d'administration (OWASP ASVS).",
};

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  await requireAdmin();
  const logs = await AuditLogger.list(100);

  return <AuditLogsClient initialLogs={logs} />;
}
