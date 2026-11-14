# 🚀 YEKPON DIGIT — Boutique & Bibliothèque de Logiciels Clés en Main

Plateforme e-commerce haut de gamme permettant d'acheter des projets logiciels complets (SaaS, Web Apps, Applications Mobiles Android/Flutter/React Native, Logiciels Desktop, Scripts et Templates) avec **démonstration interactive en sandbox**, paiement sécurisé (Mobile Money Bénin/UEMOA + Cartes bancaires), génération de licences HMAC et livraison instantanée par URLs signées privées.

---

## 🛠️ Stack Technique

- **Framework** : Next.js 15+ (App Router, Server Components & Server Actions)
- **UI & Style** : React 19, TypeScript Strict (`noUncheckedIndexedAccess`), Tailwind CSS 4, Radix UI, Lucide Icons
- **Base de Données** : PostgreSQL (Neon Serverless / Supabase compatible) avec extensions `uuid-ossp`, `pgcrypto`, `pg_trgm`
- **Stockage Privé** : S3-compatible Object Storage (Neon S3 / AWS S3) pour les livrables payants et médias
- **Sécurité** : Conforme OWASP ASVS niveau 2, CSP stricte, en-têtes HSTS/XFO, chiffrement AES-256-GCM des accès démos, validation Zod client/serveur, isolation `src/server` avec `import 'server-only'`
- **Paiements** : Architecture modulaire `PaymentProvider` (FedaPay, KKiaPay, Moneroo, Stripe + Sandbox Mock)
- **Qualité & Tests** : Vitest, Playwright, TypeScript Strict

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- Node.js 22+ LTS ou 24
- npm 10+ ou pnpm 9+
- Instance PostgreSQL (Neon)

### 2. Installation
```bash
# Cloner le dépôt
git clone https://github.com/Quentdvk52/yekpondigit.git
cd yekpondigit

# Installer les dépendances
npm install
```

### 3. Configuration
Copiez le fichier `.env.example` en `.env` :
```bash
cp .env.example .env
```
Renseignez votre `DATABASE_URL` et vos clés S3 (fournies dans les paramètres projet).

### 4. Base de Données
Exécutez le script SQL initial sur votre instance PostgreSQL :
```bash
# Via psql ou la console Neon :
psql $DATABASE_URL -f db/schema.sql
```

### 5. Lancer l'environnement de développement
```bash
npm run dev
```
Rendez-vous sur [http://localhost:3000](http://localhost:3000).

---

## 🧪 Tests & Vérification

```bash
# Vérification des types TypeScript
npm run typecheck

# Exécution des tests unitaires
npm run test

# Build de production
npm run build
```

---

## 📂 Documentation & Architecture
L'ensemble des spécifications et guides se trouve dans le répertoire `/docs` :
- `docs/PLAN-EXECUTION.md` : Plan d'exécution par phase et matrice de suivi
- `docs/TODO-PROPRIETAIRE.md` : Actions et comptes à valider par le propriétaire
- `docs/03-CAHIER-DES-CHARGES.md` : Cahier des charges fonctionnel exhaustif
- `docs/04-ARCHITECTURE-STACK.md` : Architecture logicielle et conventions
- `docs/05-BASE-DE-DONNEES.md` : Schéma de données et RLS
- `docs/07-DESIGN-SYSTEM-UI-UX.md` : Design System Dark Luxe
- `docs/09-SYSTEME-DEMO.md` : Système de démos isolées en sandbox
- `docs/10-PAIEMENT-COMMANDES-LIVRAISON.md` : Passerelles de paiement & licences
- `docs/11-SECURITE.md` : Règles de sécurité obligatoires (OWASP ASVS 2)

---

## 🔒 Sécurité
Pour signaler une vulnérabilité ou pour toute question relative à la sécurité :
Veuillez vous référer à `docs/11-SECURITE.md`.
