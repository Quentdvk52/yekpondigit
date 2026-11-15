import type { Metadata } from "next";
import { getSession } from "@/server/auth/session";
import { isAdminRole } from "@/server/auth/rbac";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "Administration | YEKPON DIGIT",
  description: "Portail de gestion et d'administration de la plateforme YEKPON DIGIT.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Si l'utilisateur n'est pas connecté ou pas admin (ex: page /admin/login), on laisse passer la page
  if (!session || !isAdminRole(session.role)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-background">
      <AdminSidebar userEmail={session.email} userRole={session.role} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
