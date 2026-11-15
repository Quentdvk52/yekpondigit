import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingBag,
  Key,
  Download,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Mon Espace Client | YEKPON DIGIT",
  description: "Tableau de bord de vos achats logiciels et licences clés en main.",
};

export default function CompteDashboardPage() {
  const stats = [
    { label: "Projets Achetés", value: "2", icon: ShoppingBag, color: "text-sky-400" },
    { label: "Licences Actives", value: "2", icon: Key, color: "text-emerald-400" },
    { label: "Téléchargements Restants", value: "10 / 10", icon: Download, color: "text-amber-400" },
    { label: "Mises à jour incluses", value: "12 Mois", icon: Sparkles, color: "text-indigo-400" },
  ];

  const recentItems = [
    {
      title: "YekponStore — E-Commerce Multivendeur Clé en Main",
      version: "v1.2.0",
      license: "Licence Standard (1 Domaine)",
      date: "15 Janvier 2026",
      key: "YD26-LIVE-9X82-K7M4",
      status: "active",
    },
    {
      title: "SchoolDesk — SaaS Gestion Scolaire & Universitaire",
      version: "v2.0.1",
      license: "Licence Étendue (Multi-Campus)",
      date: "20 Janvier 2026",
      key: "YD26-SAAS-4F29-P1X8",
      status: "active",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 4 Cartes Métriques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerte Notification de Mise à Jour */}
      <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Nouvelle version disponible pour YekponStore (v1.2.1)
            </h4>
            <p className="text-xs text-sky-200/80">
              Amélioration de la fluidité du checkout Mobile Money et mise à jour de sécurité des dépendances.
            </p>
          </div>
        </div>

        <Link href="/compte/telechargements">
          <Button size="sm" className="shrink-0 text-xs font-bold gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Mettre à jour</span>
          </Button>
        </Link>
      </div>

      {/* Mes Dernières Solutions Logicielles */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Mes Solutions Logicielles Récemment Acquises
          </h2>
          <Link href="/compte/licences" className="text-xs text-sky-400 font-bold hover:underline flex items-center gap-1">
            <span>Toutes mes licences</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentItems.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-border/60 bg-muted/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{item.title}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {item.version}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-3">
                  <span>{item.license}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Licence Active</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="font-mono text-xs font-bold text-sky-400 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg">
                  {item.key}
                </div>
                <Link href="/compte/telechargements">
                  <Button variant="outline" size="sm" className="h-9 px-3 text-xs gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Sources (.zip)</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
