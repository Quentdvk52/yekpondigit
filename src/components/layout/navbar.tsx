"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Sparkles,
  ChevronDown,
  Globe,
  Layers,
  Terminal,
  Smartphone,
  Laptop,
} from "lucide-react";
import { CurrencySelector } from "./currency-selector";
import { CommandPalette } from "./command-palette";
import { Sheet } from "@/components/ui/sheet";

export function Navbar() {
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);

  // Écouteur clavier pour ⌘K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { label: "Boutique", href: "/boutique" },
    { label: "Sur mesure", href: "/sur-mesure" },
    { label: "Licences", href: "/licences" },
    { label: "À propos", href: "/a-propos" },
    { label: "Aide & FAQ", href: "/aide" },
  ];

  const categories = [
    { name: "Applications Web & SaaS", href: "/boutique?type=saas", icon: <Laptop className="w-4 h-4 text-sky-400" /> },
    { name: "Applications Mobiles (Flutter / Android)", href: "/boutique?type=mobile_app", icon: <Smartphone className="w-4 h-4 text-emerald-400" /> },
    { name: "Sites Web & E-Commerce", href: "/boutique?type=website", icon: <Globe className="w-4 h-4 text-indigo-400" /> },
    { name: "Logiciels Desktop (Windows / Mac)", href: "/boutique?type=desktop_app", icon: <Layers className="w-4 h-4 text-purple-400" /> },
    { name: "Scripts, Plugins & Bots", href: "/boutique?type=bot", icon: <Terminal className="w-4 h-4 text-amber-400" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-lg text-slate-950 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              YD
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-base tracking-wider text-white">YEKPON DIGIT</span>
              <span className="block text-[10px] text-zinc-400 uppercase tracking-widest -mt-1 font-semibold">
                Bibliothèque Logicielle
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-300">
            {/* Mega menu Catégories */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                onBlur={() => setTimeout(() => setIsCategoriesOpen(false), 200)}
                className="flex items-center gap-1 hover:text-white transition-colors py-2"
              >
                <span>Catégories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? "rotate-180 text-sky-400" : ""}`} />
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 w-72 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-2xl animate-scaleUp z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-xs text-zinc-200 hover:text-white"
                    >
                      <div className="p-1.5 rounded-lg bg-white/5">{cat.icon}</div>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-white ${
                  pathname === link.href ? "text-sky-400 font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions Droite */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Recherche ⌘K trigger */}
            <button
              onClick={() => setIsCommandOpen(true)}
              aria-label="Ouvrir la recherche rapide (⌘K)"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-400 hover:text-white transition-all"
            >
              <Search className="w-4 h-4 text-zinc-400" />
              <span className="hidden md:inline">Recherche...</span>
              <kbd className="hidden md:inline-flex px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-zinc-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Sélecteur de Devise */}
            <div className="hidden sm:block">
              <CurrencySelector />
            </div>

            {/* Panier */}
            <Link
              href="/panier"
              aria-label="Accéder au panier"
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Compte Client */}
            <Link
              href="/auth/connexion"
              aria-label="Mon compte"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
            >
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>Compte</span>
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Ouvrir le menu mobile"
              className="lg:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ⌘K Command Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Mobile Drawer Menu */}
      <Sheet
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Menu YEKPON DIGIT"
        position="right"
      >
        <div className="space-y-6">
          <div className="mb-4">
            <CurrencySelector />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-2">Navigation</p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-2">Catégories</p>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <div className="p-1 rounded bg-white/5">{cat.icon}</div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/auth/connexion"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/20"
            >
              <User className="w-4 h-4" />
              <span>Se connecter à mon compte</span>
            </Link>
          </div>
        </div>
      </Sheet>
    </>
  );
}
