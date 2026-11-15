import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/rbac";
import { AdminRepository } from "@/server/repositories/admin-repository";
import { LicensesAdminClient } from "@/components/admin/licenses-admin-client";

export const metadata: Metadata = {
  title: "Gestion des Licences | YEKPON DIGIT Admin",
  description: "Contrôle des clés de licence cryptographiques, révocations et quotas de domaines.",
};

export const dynamic = "force-dynamic";

export default async function AdminLicencesPage() {
  await requireAdmin();
  const licenses = await AdminRepository.listLicenses();

  return <LicensesAdminClient initialLicenses={licenses} />;
}
