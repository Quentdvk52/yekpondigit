"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Search,
  Lock,
  Calendar,
  Layers,
  Code,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AuditLogEntry } from "@/server/audit/audit-logger";

interface AuditLogsClientProps {
  initialLogs: AuditLogEntry[];
}

export function AuditLogsClient({ initialLogs }: AuditLogsClientProps) {
  const [logs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q) ||
      log.entity_id.toLowerCase().includes(q) ||
      (log.actor_email && log.actor_email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Lock className="w-4 h-4" />
            <span>Sécurité &amp; Traçabilité Immuable</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
            Journal d'Audit &amp; Événements Système
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Historique non modifiable de toutes les actions administratives critiques (OWASP ASVS Niveau 2).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/30">
            APPEND-ONLY CONFORME
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {filtered.length} entrée(s)
          </span>
        </div>
      </div>

      {/* Barre de Recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrer par action, acteur, identifiant entité..."
          className="pl-10 h-10"
        />
      </div>

      {/* Tableau des Événements d'Audit */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase text-[10px]">
              <tr>
                <th className="p-4">Horodatage (UTC)</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entité Cible</th>
                <th className="p-4">Acteur Habilité</th>
                <th className="p-4">IP Hashée</th>
                <th className="p-4 text-right">Détail (Diff)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-mono text-muted-foreground text-[11px]">
                    {new Date(log.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="font-mono text-[10px] bg-sky-500/10 text-sky-400 border-sky-500/30">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-foreground capitalize block">{log.entity}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{log.entity_id}</span>
                  </td>
                  <td className="p-4 text-foreground font-medium">
                    {log.actor_email || log.actor_id || "Système Automatique"}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-muted-foreground">
                    {log.ip_hash || "hash:anonyme"}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      className="h-8 text-[11px] gap-1 text-sky-400 hover:text-sky-300"
                    >
                      <Code className="w-3 h-3" />
                      <span>Inspecter Diff</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'Inspection du Diff JSON */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-sky-500/30 bg-card p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm text-foreground">
                  Payload de Modification — {selectedLog.action}
                </h3>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                {selectedLog.id}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-muted-foreground">
                Entité : <span className="text-foreground font-semibold">{selectedLog.entity}</span> ({selectedLog.entity_id})
              </div>
              <div className="text-muted-foreground">
                Date : <span className="text-foreground font-mono">{new Date(selectedLog.created_at).toISOString()}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 overflow-x-auto">
              <pre className="font-mono text-xs text-sky-300">
                {JSON.stringify(selectedLog.diff, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedLog(null)} className="text-xs">
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
