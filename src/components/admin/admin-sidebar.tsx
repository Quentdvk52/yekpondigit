"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Key,
  Users,
  KanbanSquare,
  ShieldCheck,
  ExternalLink,
  LogOut,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth-actions";

const ADMIN_NAV_ITEMS = [
  {
    label: "Vue d'ensemble",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Catalogue Produits",
    href: "/admin/produits",
    icon: Package,
  },
  {
    label: "Commandes & Ventes",
    href: "/admin/commandes",
    icon: CreditCard,
  },
  {
    label: "Licences Logicielles",
    href: "/admin/licences",
    icon: Key,
  },
  {
    label: "Base Clients",
    href: "/admin/clients",
    icon: Users,
  },
  {
    label: "Projets Sur Mesure",
    href: "/admin/sur-mesure",
    icon: KanbanSquare,
  },
  {
    label: "Journal d'Audit & Sécu",
    href: "/admin/audit",
    icon: ShieldCheck,
  },
];

interface AdminSidebarProps {
  userEmail: string;
  userRole: string;
}

export function AdminSidebar({ userEmail, userRole }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <aside className="w-72 border-r border-border/80 bg-card/60 backdrop-blur-xl flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="p-5 space-y-6">
        {/* Titre & Statut Admin */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-wider uppercase text-amber-400 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Back-Office Sécurisé</span>
            </span>
            <Badge variant="accent" className="text-[9px] font-mono py-0 px-2">
              2FA ACTIF
            </Badge>
          </div>
          <div className="font-black text-lg text-foreground tracking-tight flex items-center gap-2">
            <span>YEKPON ADMIN</span>
            <span className="text-sky-400 text-xs font-mono font-normal">v1.0</span>
          </div>
        </div>

        {/* Liens de navigation */}
        <nav className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  isActive
                    ? "bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-sky-400" : "text-muted-foreground")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profil Admin & Liens Bas */}
      <div className="p-4 border-t border-border/60 bg-muted/5 space-y-3">
        <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Session Habilitée</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">LIVE</span>
          </div>
          <div className="font-semibold text-xs text-foreground truncate" title={userEmail}>
            {userEmail}
          </div>
          <div className="text-[10px] text-sky-400 font-mono capitalize">
            {userRole === "super_admin" ? "Super Administrateur" : "Administrateur"}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Link href="/boutique" target="_blank" className="w-1/2">
            <Button variant="outline" size="sm" className="w-full text-[11px] h-8 gap-1">
              <ExternalLink className="w-3 h-3" />
              <span>Boutique</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-1/2 text-[11px] h-8 gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-3 h-3" />
            <span>Quitter</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
