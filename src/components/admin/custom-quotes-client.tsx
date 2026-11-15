"use client";

import { useState, useTransition } from "react";
import {
  KanbanSquare,
  Sparkles,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Mail,
  DollarSign,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateQuoteStatusAction } from "@/app/actions/admin-actions";
import type { AdminCustomQuote } from "@/server/repositories/admin-repository";

interface CustomQuotesClientProps {
  initialQuotes: AdminCustomQuote[];
}

const KANBAN_COLUMNS: {
  id: AdminCustomQuote["status"];
  title: string;
  badgeColor: string;
}[] = [
  { id: "new", title: "Nouveau (Reçu)", badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
  { id: "qualified", title: "Qualifié / Cadrage", badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  { id: "quoted", title: "Devis Transmis", badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { id: "in_progress", title: "En Développement", badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { id: "delivered", title: "Livré & Clôturé", badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
];

export function CustomQuotesClient({ initialQuotes }: CustomQuotesClientProps) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const moveQuote = (quoteId: string, targetStatus: AdminCustomQuote["status"]) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await updateQuoteStatusAction({
        quoteId,
        status: targetStatus,
      });

      if (res.success) {
        setFeedback({ type: "success", text: res.message! });
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? { ...q, status: targetStatus } : q))
        );
      } else {
        setFeedback({ type: "error", text: res.error || "Erreur" });
      }
    });
  };

  const getNextStatus = (current: AdminCustomQuote["status"]): AdminCustomQuote["status"] | null => {
    const order: AdminCustomQuote["status"][] = ["new", "qualified", "quoted", "in_progress", "delivered"];
    const idx = order.indexOf(current);
    return idx < order.length - 1 ? order[idx + 1]! : null;
  };

  const getPrevStatus = (current: AdminCustomQuote["status"]): AdminCustomQuote["status"] | null => {
    const order: AdminCustomQuote["status"][] = ["new", "qualified", "quoted", "in_progress", "delivered"];
    const idx = order.indexOf(current);
    return idx > 0 ? order[idx - 1]! : null;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <KanbanSquare className="w-4 h-4" />
            <span>Pipeline Sur Mesure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
            Kanban de Suivi des Projets &amp; Devis
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gérez le cycle de vie complet des demandes personnalisées, de la qualification à la livraison.
          </p>
        </div>

        <span className="font-mono text-xs text-muted-foreground">
          {quotes.length} dossier(s) actif(s)
        </span>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-red-500/15 text-red-400 border border-red-500/30"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Colonnes Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
        {KANBAN_COLUMNS.map((col) => {
          const colQuotes = quotes.filter((q) => q.status === col.id);

          return (
            <div
              key={col.id}
              className="rounded-2xl border border-border/80 bg-card/60 p-4 space-y-3 min-h-[450px] flex flex-col justify-between"
            >
              <div>
                {/* En-tête de colonne */}
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="font-bold text-xs text-foreground">{col.title}</span>
                  <Badge variant="outline" className={`text-[10px] font-mono ${col.badgeColor}`}>
                    {colQuotes.length}
                  </Badge>
                </div>

                {/* Cartes dans la colonne */}
                <div className="space-y-3 pt-3">
                  {colQuotes.map((quote) => {
                    const nextSt = getNextStatus(quote.status);
                    const prevSt = getPrevStatus(quote.status);

                    return (
                      <div
                        key={quote.id}
                        className="rounded-xl border border-border/80 bg-card p-4 shadow-sm space-y-3 hover:border-sky-500/40 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                          <span className="font-bold text-sky-400">{quote.reference}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{quote.deliveryWeeks} sem.</span>
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-foreground line-clamp-1">
                            {quote.title}
                          </h4>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                            {quote.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-border/40 space-y-1 text-[11px]">
                          <div className="flex justify-between items-center text-muted-foreground">
                            <span>Client :</span>
                            <span className="font-semibold text-foreground truncate max-w-[120px]" title={quote.clientName}>
                              {quote.clientName}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Budget est. :</span>
                            <span className="font-mono font-bold text-sky-400">
                              {quote.budgetEstimatedXof.toLocaleString("fr-FR")} F
                            </span>
                          </div>
                        </div>

                        {/* Boutons d'avancement du Kanban */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                          {prevSt ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isPending}
                              onClick={() => moveQuote(quote.id, prevSt)}
                              className="h-7 px-2 text-[10px] gap-1 text-muted-foreground"
                              title="Reculer d'une étape"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </Button>
                          ) : (
                            <div />
                          )}

                          {nextSt ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isPending}
                              onClick={() => moveQuote(quote.id, nextSt)}
                              className="h-7 px-2.5 text-[10px] gap-1 text-sky-400 hover:text-sky-300 border-sky-500/30"
                              title="Passer à l'étape suivante"
                            >
                              <span>Avancer</span>
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Clôturé</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {colQuotes.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground text-[11px] italic">
                      Aucun projet à cette étape
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
