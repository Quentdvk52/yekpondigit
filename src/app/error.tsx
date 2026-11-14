"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Journaliser l'erreur de manière sécurisée côté monitoring sans fuite PII
    console.error("🚨 Client Error caught by boundary:", error.message);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center my-auto">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
        Une interruption inattendue est survenue
      </h1>

      <p className="mt-2 text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
        Nos systèmes ont enregistré cet événement technique. Vos données et vos commandes en cours sont entièrement sécurisées.
      </p>

      <div className="mt-8 flex items-center justify-center gap-4">
        <Button variant="primary" onClick={() => reset()}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    </div>
  );
}
