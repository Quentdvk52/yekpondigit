import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Key,
  Download,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { getSession } from "@/server/auth/session";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth-actions";

export default async function CompteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Profil par défaut pour consultation démo si non connecté
  const user = session || {
    userId: "00000000-0000-0000-0000-000000000003",
    email: "demo.client@yekpondigit.com",
    fullName: "Koffi Mensah (Mode Client Démo)",
    role: "customer" as const,
  };

  const navItems = [
    { label: "Vue d'ensemble", href: "/compte", icon: LayoutDashboard },
    { label: "Mes Commandes", href: "/compte/commandes", icon: ShoppingBag },
    { label: "Mes Licences", href: "/compte/licences", icon: Key },
    { label: "Téléchargements", href: "/compte/telechargements", icon: Download },
    { label: "Mon Profil & Sécurité", href: "/compte/profil", icon: User },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header Espace Client */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Espace Client Sécurisé</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Bonjour, {user.fullName || user.email}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Gérez vos projets logiciels, licences certifiées et téléchargements de codes sources.
          </p>
        </div>

        <form action={logoutAction}>
          <Button variant="outline" size="sm" type="submit" className="gap-2 text-xs text-muted-foreground hover:text-rose-400">
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Latérale */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="rounded-2xl border border-border/80 bg-card p-3 shadow-md space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
                >
                  <Icon className="w-4 h-4 text-sky-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Box Support Développeur */}
          <div className="rounded-2xl border border-border/60 bg-muted/10 p-4 space-y-2 text-xs">
            <span className="font-bold text-foreground block">Besoin d'assistance ?</span>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              Notre équipe d'ingénieurs vous assiste pour l'installation et le déploiement sur votre serveur.
            </p>
            <Link href="/aide" className="text-sky-400 font-bold hover:underline block pt-1 text-[11px]">
              Ouvrir un ticket d'aide →
            </Link>
          </div>
        </aside>

        {/* Contenu Principal */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
