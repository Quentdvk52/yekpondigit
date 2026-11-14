"use client";

import * as React from "react";
import { ShieldCheck, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [preferences, setPreferences] = React.useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  React.useEffect(() => {
    const saved = localStorage.getItem("yd_cookie_consent");
    if (!saved) {
      // Afficher avec un léger délai pour ne pas bloquer le LCP
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const all = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem("yd_cookie_consent", JSON.stringify(all));
    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    const essentialOnly = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem("yd_cookie_consent", JSON.stringify(essentialOnly));
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem("yd_cookie_consent", JSON.stringify(preferences));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Consentement aux cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 rounded-2xl border border-white/15 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl text-white animate-slideUp"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Gestion de votre Confidentialité</h4>
          <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
            Nous utilisons des cookies essentiels pour garantir la sécurité de vos commandes et téléchargements.
            Vous pouvez personnaliser vos choix ci-dessous.
          </p>
        </div>
      </div>

      {showSettings && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <div>
              <p className="font-semibold text-white">Cookies Nécessaires</p>
              <p className="text-[11px] text-zinc-400">Authentification, panier et sécurité anti-fraude</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Toujours actif
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <div>
              <p className="font-semibold text-white">Mesure d&apos;audience & Analytics</p>
              <p className="text-[11px] text-zinc-400">Statistiques anonymisées pour améliorer la plateforme</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400"
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="primary" onClick={handleAcceptAll} className="flex-1">
          <Check className="w-3.5 h-3.5 mr-1" />
          Tout accepter
        </Button>
        <Button size="sm" variant="secondary" onClick={handleDeclineAll} className="flex-1">
          Refuser
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (showSettings) handleSaveCustom();
            else setShowSettings(true);
          }}
          className="w-full sm:w-auto"
        >
          <Settings className="w-3.5 h-3.5 mr-1" />
          {showSettings ? "Enregistrer mes choix" : "Personnaliser"}
        </Button>
      </div>
    </div>
  );
}
