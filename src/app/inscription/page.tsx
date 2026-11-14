"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupAction } from "@/app/actions/auth-actions";

export default function InscriptionPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cgvAccepted) {
      setError("Veuillez accepter les Conditions Générales de Vente.");
      return;
    }

    startTransition(async () => {
      const res = await signupAction({
        fullName,
        email,
        phone: phone || undefined,
        password,
        country: "BJ",
        cgvAccepted: true,
      });

      if (!res.success) {
        setError(res.error ?? "Échec de l'inscription.");
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
            <User className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Créer un Compte Client
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Achetez des projets logiciels, téléchargez vos livrables et gérez vos licences.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nom complet
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Koffi Mensah"
                className="pl-9"
              />
            </div>
          </div>

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
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Téléphone (Mobile Money)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+229 97 00 00 00"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Mot de passe sécurisé
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Au moins 8 caractères (Maj, min, chiffre)"
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="cgv"
              checked={cgvAccepted}
              onChange={(e) => setCgvAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
            />
            <label htmlFor="cgv" className="text-xs text-muted-foreground leading-relaxed">
              J&apos;accepte les{" "}
              <Link href="/cgv" className="text-primary hover:underline">
                Conditions Générales de Vente
              </Link>{" "}
              et la{" "}
              <Link href="/confidentialite" className="text-primary hover:underline">
                Politique de Confidentialité
              </Link>
              .
            </label>
          </div>

          <Button type="submit" disabled={isPending} className="w-full mt-2">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                Créer mon compte
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Link href="/connexion" className="font-semibold text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
