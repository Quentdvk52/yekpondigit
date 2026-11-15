import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/rbac";
import { AdminRepository } from "@/server/repositories/admin-repository";
import { DashboardClient } from "@/components/admin/dashboard-client";

export const metadata: Metadata = {
  title: "Tableau de Bord Administrateur | YEKPON DIGIT",
  description: "Vue d'ensemble des ventes, revenus et performances logicielles.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const kpi = await AdminRepository.getDashboardKPI();

  return <DashboardClient kpi={kpi} />;
}
