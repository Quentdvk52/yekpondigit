import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/rbac";
import { AdminRepository } from "@/server/repositories/admin-repository";
import { OrdersAdminClient } from "@/components/admin/orders-admin-client";

export const metadata: Metadata = {
  title: "Gestion des Commandes | YEKPON DIGIT Admin",
  description: "Suivi des paiements, détails des commandes et remboursements avec révocation.",
};

export const dynamic = "force-dynamic";

export default async function AdminCommandesPage() {
  await requireAdmin();
  const orders = await AdminRepository.listOrders();

  return <OrdersAdminClient initialOrders={orders} />;
}
