import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center my-auto">
      <div className="relative">
        <div className="text-8xl sm:text-9xl font-black text-sky-500/10 tracking-widest select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold text-xs uppercase tracking-wider backdrop-blur-md">
            Page introuvable
          </span>
        </div>
      </div>

      <h1 className="mt-6 text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
        Oups ! Cette ressource n&apos;existe pas ou a été déplacée.
      </h1>

      <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
        Le lien que vous avez suivi est peut-être incorrect ou la page a été archivée. Vous pouvez retourner à l&apos;accueil ou explorer notre catalogue.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/">
          <Button variant="primary">
            <Home className="w-4 h-4 mr-2" />
            Retour à l&apos;accueil
          </Button>
        </Link>
        <Link href="/boutique">
          <Button variant="secondary">
            <Search className="w-4 h-4 mr-2" />
            Explorer la boutique
          </Button>
        </Link>
      </div>
    </div>
  );
}
