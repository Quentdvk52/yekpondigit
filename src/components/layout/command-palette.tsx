"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Laptop, Smartphone, Globe, Terminal, FileCode2, ArrowRight } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface SearchItem {
  id: string;
  title: string;
  category: string;
  url: string;
  icon: React.ReactNode;
}

const STATIC_SEARCH_ITEMS: SearchItem[] = [
  { id: "1", title: "Plateforme SaaS Multi-Tenant", category: "Applications Web", url: "/boutique?type=saas", icon: <Laptop className="w-4 h-4 text-sky-400" /> },
  { id: "2", title: "Application Mobile E-Commerce Flutter", category: "Mobile Apps", url: "/boutique?type=mobile_app", icon: <Smartphone className="w-4 h-4 text-emerald-400" /> },
  { id: "3", title: "Site Vitrine Agence Next.js 15", category: "Sites Web", url: "/boutique?type=website", icon: <Globe className="w-4 h-4 text-indigo-400" /> },
  { id: "4", title: "Bot d'Automatisation & Scraping Python", category: "Scripts & Bots", url: "/boutique?type=bot", icon: <Terminal className="w-4 h-4 text-amber-400" /> },
  { id: "5", title: "Application Desktop Electron & SQLite", category: "Desktop/OS", url: "/boutique?type=desktop_app", icon: <FileCode2 className="w-4 h-4 text-purple-400" /> },
  { id: "6", title: "Demande de Projet Sur-Mesure", category: "Services", url: "/sur-mesure", icon: <Sparkles className="w-4 h-4 text-pink-400" /> },
  { id: "7", title: "Conditions Générales de Vente (CGV)", category: "Légal", url: "/cgv", icon: <ArrowRight className="w-4 h-4 text-zinc-400" /> },
  { id: "8", title: "Politique des Licences Logicielles", category: "Légal", url: "/licences", icon: <ArrowRight className="w-4 h-4 text-zinc-400" /> },
];

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!query.trim()) return STATIC_SEARCH_ITEMS;
    const q = query.toLowerCase();
    return STATIC_SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" className="p-0 overflow-hidden">
      <div className="flex items-center px-4 border-b border-white/10 bg-white/5">
        <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
        <input
          autoFocus
          type="text"
          placeholder="Rechercher un logiciel, un template, un service... (Esc pour quitter)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent py-4 text-sm text-white placeholder:text-zinc-500 outline-none"
        />
      </div>

      <div className="max-h-80 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400">
            Aucun projet ou document ne correspond à « {query} ».
          </div>
        ) : (
          filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.url)}
              className="w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-sky-500/30">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-zinc-400">{item.category}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </button>
          ))
        )}
      </div>

      <div className="px-4 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Astuce : Naviguez avec les flèches et appuyez sur Entrée</span>
        <span>YEKPON DIGIT</span>
      </div>
    </Modal>
  );
}
