import type { Metadata } from "next";
import { DownloadsClient } from "@/components/account/downloads-client";

export const metadata: Metadata = {
  title: "Mes Téléchargements Sécurisés | YEKPON DIGIT",
  description: "Téléchargez vos archives de code source et vérifiez les empreintes SHA-256.",
};

export default function CompteTelechargementsPage() {
  return <DownloadsClient />;
}
