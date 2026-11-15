import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/rbac";
import { AdminRepository } from "@/server/repositories/admin-repository";
import { CustomQuotesClient } from "@/components/admin/custom-quotes-client";

export const metadata: Metadata = {
  title: "Projets Sur Mesure | YEKPON DIGIT Admin",
  description: "Pipeline Kanban de traitement des demandes de devis et développements personnalisés.",
};

export const dynamic = "force-dynamic";

export default async function AdminSurMesurePage() {
  await requireAdmin();
  const quotes = await AdminRepository.listCustomQuotes();

  return <CustomQuotesClient initialQuotes={quotes} />;
}
