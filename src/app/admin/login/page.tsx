"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, Mail, KeyRound, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/app/actions/auth-actions";

export default function AdminLoginPage() {
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
        setError(res.error ?? "Accès refusé.");
        return;
      }

      router.push("/admin/produits");
      router.refresh();
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-primary/20 bg-card p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Portail Administration
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Accès restreint au personnel habilité de YEKPON DIGIT. Double facteur requis.
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
                  Identifiant Administrateur
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@yekpondigit.com"
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Mot de Passe Chiffré
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-9"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Code TOTP Administrateur (2FA)
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-amber-500" />
                <Input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="000000"
                  className="pl-9 tracking-widest text-center text-lg font-mono border-amber-500/40"
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={isPending} className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : require2FA ? (
              "Valider la clé de sécurité"
            ) : (
              <>
                Authentification Sécurisée
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
