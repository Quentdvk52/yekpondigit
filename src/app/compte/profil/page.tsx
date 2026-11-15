import type { Metadata } from "next";
import { User, Lock, Shield, KeyRound, Smartphone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Mon Profil & Sécurité | YEKPON DIGIT",
  description: "Paramètres de compte, coordonnées et sécurité de connexion.",
};

export default async function CompteProfilPage() {
  const session = await getSession();

  const user = session || {
    userId: "00000000-0000-0000-0000-000000000003",
    email: "demo.client@yekpondigit.com",
    fullName: "Koffi Mensah (Client Démo)",
    role: "customer" as const,
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-sky-400" />
          <span>Profil &amp; Sécurité du Compte</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Gérez vos informations personnelles et protégez l'accès à vos licences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Formulaire Informations Personnelles */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              <span>Informations Générales</span>
            </h3>
            <Badge variant="outline" className="text-[10px] font-mono">
              Rôle : {user.role}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Nom complet</label>
              <Input defaultValue={user.fullName || "Koffi Mensah"} className="h-11" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Adresse Email</label>
              <Input disabled defaultValue={user.email} className="h-11 bg-muted/20" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Téléphone Mobile Money</label>
              <Input defaultValue="+229 97 00 00 03" className="h-11" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Pays</label>
              <Input defaultValue="Bénin (BJ)" className="h-11" />
            </div>
          </div>

          <div className="pt-2">
            <Button size="sm" className="font-bold text-xs">
              Mettre à jour mes informations
            </Button>
          </div>
        </div>

        {/* Formulaire Modification du Mot de Passe */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-5">
          <div className="border-b border-border/60 pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Modifier mon Mot de Passe</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Mot de passe actuel</label>
              <Input type="password" placeholder="••••••••••••" className="h-11" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Nouveau mot de passe</label>
              <Input type="password" placeholder="••••••••••••" className="h-11" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Confirmer le nouveau</label>
              <Input type="password" placeholder="••••••••••••" className="h-11" />
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" className="font-bold text-xs">
              Changer le mot de passe
            </Button>
          </div>
        </div>

        {/* Double Authentification 2FA */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Authentification à Deux Facteurs (2FA TOTP)</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Protégez vos achats et licences avec Google Authenticator ou Authy.
              </p>
            </div>
            <Badge variant="accent" className="text-[10px] self-start sm:self-auto font-bold">
              Disponible
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/10 border border-border/50 text-xs">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-sky-400 shrink-0" />
              <span>Application Authenticator (TOTP standard RFC 6238)</span>
            </div>
            <Button size="sm" variant="outline" className="text-xs font-bold shrink-0">
              Activer le 2FA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
