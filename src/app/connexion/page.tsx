"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/app/actions/auth-actions";

export default function ConnexionPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [require2FA, setRequire2FA] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await loginAction({ email, password, totpCode: totpCode || undefined });
      if (!res.success) {
        if (res.require2FA) {
          setRequire2FA(true);
        }
        setError(res.error ?? "Identifiants invalides.");
        return;
      }

      router.push("/");
      router.refresh();
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {require2FA ? "Vérification en Deux Étapes" : "Connexion à votre Espace"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {require2FA
              ? "Entrez le code à 6 chiffres de votre application d'authentification."
              : "Accédez à vos commandes, téléchargements et clés de licence."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!require2FA ? (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <Link href="/contact" className="text-xs text-primary hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Code Authentificateur (TOTP)
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="123456"
                  className="pl-9 tracking-widest text-center text-lg font-mono"
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={isPending} className="w-full mt-2">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : require2FA ? (
              "Valider le code 2FA"
            ) : (
              <>
                Se connecter
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {!require2FA && (
          <div className="mt-6 text-center text-xs text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-semibold text-primary hover:underline">
              Créer un compte gratuitement
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
