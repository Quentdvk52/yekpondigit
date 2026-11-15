import type { Metadata } from "next";
import { LicensesClient } from "@/components/account/licenses-client";

export const metadata: Metadata = {
  title: "Mes Licences Logicielles | YEKPON DIGIT",
  description: "Gérez vos clés d'activation et assignez vos noms de domaine autorisés.",
};

export default function CompteLicencesPage() {
  return <LicensesClient />;
}
