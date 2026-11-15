import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/rbac";
import { AdminRepository } from "@/server/repositories/admin-repository";
import { ClientsAdminClient } from "@/components/admin/clients-admin-client";

export const metadata: Metadata = {
  title: "Gestion des Clients | YEKPON DIGIT Admin",
  description: "Répertoire des clients, volume d'achats et contrôle des accès.",
};

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  await requireAdmin();
  const customers = await AdminRepository.listCustomers();

  return <ClientsAdminClient initialCustomers={customers} />;
}
