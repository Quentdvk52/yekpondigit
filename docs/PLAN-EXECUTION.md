# 🗺️ PLAN D'EXÉCUTION — YEKPON DIGIT
> **Boutique & Bibliothèque Premium de Projets Logiciels Clés en Main**
> Stack : Next.js 16 (App Router), React 19, TypeScript Strict, Tailwind CSS 4, PostgreSQL (Neon), S3 Storage, Three.js / R3F, Motion, Radix/shadcn.

---

## 1. Vue d'Ensemble & Objectifs
**YEKPON DIGIT** est une plateforme e-commerce haut de gamme spécialisée dans la vente de projets logiciels prêts à l'emploi (sites web, SaaS, applications mobiles Flutter/React Native/Android natif, logiciels desktop, templates, scripts et bots).
Chaque produit dispose d'une page avec démonstration interactive en sandbox (ou vidéo/mockup 3D), d'un parcours de commande fluide avec passerelles Mobile Money (Bénin / Afrique de l'Ouest) et cartes bancaires, d'une génération automatique de clés de licence avec certificats PDF, et d'un système de téléchargement sécurisé par URLs signées à usage unique et quotas stricts.

### Contraintes Globales (Non Négociables)
1. **Sécurité (OWASP ASVS Niveau 2)** :
   - Conformité stricte à `docs/11-SECURITE.md`.
   - Zéro secret en clair dans le code client ou les dépôts.
   - Validation Zod sur 100 % des entrées client et serveur.
   - Contrôle d'accès strict côté serveur (Auth + Rôle + Propriété de la ressource).
   - Webhooks de paiement signés, idempotents et vérifiés de serveur à serveur.
   - Démos isolées sur domaine/sous-domaine séparé via iframe `sandbox` et CSP étanche.
2. **Performance & Accessibilité** :
   - Core Web Vitals : LCP < 2,5 s, INP < 200 ms, CLS < 0,1.
   - Lazy-loading et dégradation gracieuse pour la 3D WebGL (`prefers-reduced-motion` et fallback mobile).
   - Accessibilité conforme WCAG 2.2 niveau AA.
3. **Architecture Logicielle** :
   - Isolation stricte `src/server` avec `import 'server-only'`.
   - Pattern Result / Erreurs typées pour les services métier.
   - Couche d'abstraction modulaire pour les paiements (`PaymentProvider` : FedaPay, KKiaPay, Moneroo, Stripe, + Mock Sandbox).

---

## 2. Découpage par Phases

### 🔹 PHASE 0 : Fondations & Socle Technique (En cours)
- **Objectifs** :
  - Initialiser le dépôt Git et la structure Next.js standardisée (`src/`, `docs/`, `supabase/` ou `db/`).
  - Configurer TypeScript strict (`noUncheckedIndexedAccess`), Tailwind CSS 4, ESLint, Prettier.
  - Définir `.env.example` et le module de validation stricte d'environnement Zod (`src/lib/env.ts`).
  - Mettre en place `proxy.ts` / `middleware.ts` avec en-têtes de sécurité (HSTS, CSP stricte, X-Frame-Options, Referrer-Policy).
  - Établir la connexion PostgreSQL (Neon) et le schéma de base (Enums, profils, rôles).
  - Configurer l'endpoint de diagnostic de santé `/api/health`.
  - Base du thème sombre/clair et layout racine.
- **Livrables & Tests** :
  - Build Next.js sans avertissement (`next build`).
  - Typecheck TS sans erreur (`tsc --noEmit`).
  - Test `/api/health` validant la connexion base de données et l'environnement.

---

### 🔹 PHASE 1 : Design System & Pages Statiques
- **Objectifs** :
  - Intégrer les tokens graphiques du fichier `docs/07-DESIGN-SYSTEM-UI-UX.md` (palettes Dark Luxe, typographie, espacements fluides).
  - Composants UI de base (boutons, cartes produit, inputs, badges, modales, tiroirs, alertes).
  - Header sticky avec méga-menu, recherche ⌘K, sélecteur devise (XOF, EUR, USD) et langue.
  - Footer complet avec mentions, navigation et badges de réassurance.
  - Pages CMS statiques : À propos, CGV, Licences, Confidentialité, Remboursements, Mentions légales.
  - Pages 404, 500 et bannière de consentement cookies granulaire.
- **Checklist** :
  - Zéro violation critique d'accessibilité (axe-core).
  - Rendu impeccable sur 5 résolutions cibles (360px, 768px, 1024px, 1440px, 1920px).

---

### 🔹 PHASE 2 : Base de Données, Authentification & Catalogue Admin
- **Objectifs** :
  - Schéma complet PostgreSQL : tables `products`, `product_versions`, `product_files`, `demos`, `categories`, `tags`, `collections`, `bundles`.
  - Authentification sécurisée (Email/Password, validation email, sessions sécurisées HttpOnly, 2FA TOTP pour rôles admin/support).
  - Back-office Produit : Wizard en 6 étapes (Informations, Médias, Démos, Licences/Prix, Fichiers livrables, SEO/Publication).
  - Gestion des fichiers livrables sur stockage S3 privé avec hash SHA-256 automatique.
  - Seed DEMO complet avec 12 produits représentatifs (marqués `[DEMO]`).
- **Checklist** :
  - Tests d'autorisation et vérification d'absence de fuite de données (anti-IDOR).
  - Upload sécurisé validé par signatures binaires et extensions.

---

### 🔹 PHASE 3 : Boutique Publique & Fiche Produit Complète
- **Objectifs** :
  - Page d'accueil dynamique : Hero produit, compteurs de confiance animés, catégories 3D tilt, produits vedettes, étapes « Comment ça marche », avis clients, FAQ.
  - Page `/boutique` avec filtres combinés (type, stack, secteur, prix, licence, démo), recherche instantanée tolérante FTS, tri, modes grille/liste.
  - Fiche produit `/produit/[slug]` : Hero interactif, onglets riches (Description, Fonctionnalités, Captures, Prérequis, Changelog, FAQ, Avis vérifiés), sélecteur de licence (Standard vs Étendue), add-ons, CTA sticky mobile.
  - Métadonnées SEO dynamiques, JSON-LD `Product`, OpenGraph et sitemap XML.
- **Checklist** :
  - Lighthouse SEO ≥ 95, Performance mobile ≥ 90.
  - Navigation intégrale au clavier et balisage sémantique.

---

### 🔹 PHASE 4 : Système de Démonstrations Sécurisé
- **Objectifs** :
  - Implémentation des 6 types de démos (`live_iframe`, `video`, `gallery`, `mobile_mockup`, `emulator`, `credentials_only`).
  - Page dédiée plein écran `/demo/[slug]` avec sélecteur d'appareil (Desktop, Tablette, Mobile) et bandeau de rappel « Mode Démo ».
  - Chiffrement applicatif AES-256-GCM des identifiants d'accès démo en base de données.
  - Validation stricte des URLs contre les attaques SSRF (liste blanche, refus d'adresses IP privées/locales).
  - Sandbox iframe hermétique (`sandbox="allow-scripts allow-forms allow-same-origin"` sous domaine séparé).

---

### 🔹 PHASE 5 : Panier, Checkout & Intégration des Paiements
- **Objectifs** :
  - Panier persistant (visiteur local fusionné à la connexion), calcul des totaux recalculé serveur.
  - Système de coupons de réduction (pourcentage ou montant fixe, dates de validité, limites d'usage).
  - Architecture modulaire de paiement `PaymentProvider` avec adapters :
    - FedaPay (MTN MoMo, Moov Money, Cartes)
    - KKiaPay (MTN, Moov, Celtiis, Cartes)
    - Moneroo
    - Stripe (Cartes internationales)
    - SandboxProvider (simulateur d'achat complet pour tests locaux et CI)
  - Endpoint de webhooks sécurisés `/api/webhooks/[provider]` avec vérification cryptographique des signatures, idempotence stricte via table `webhook_events`, revérification de statut serveur-à-serveur et transaction SQL atomic.
  - Génération de facture PDF conforme avec numérotation séquentielle sans trou.
  - Page de confirmation `/commande/[id]/merci` avec suivi en temps réel.
- **Checklist** :
  - Tests E2E automatisés du cycle complet d'achat en sandbox.
  - Tests de résistance aux webhooks contrefaits, rejoués ou aux montants altérés.

---

### 🔹 PHASE 6 : Licences, Téléchargements & Espace Client
- **Objectifs** :
  - Génération de clés de licence uniques format `XXXX-XXXX-XXXX-XXXX` (base32 non ambiguë) avec signature HMAC.
  - API de vérification publique `/api/licenses/verify` avec rate limit strict.
  - Téléchargement sécurisé via `/api/downloads/[token]` : vérification de licence active, quota de téléchargements (ex: 10 par 30 jours), audit log avec IP hashée, génération d'URL présignée S3 courte (TTL 60-120s).
  - Génération de certificat de licence officiel en PDF (`@react-pdf/renderer`).
  - Espace client complet `/compte/*` : Dashboard, commandes, licences, téléchargements, notifications de mises à jour, avis vérifiés, sécurité (mot de passe, 2FA, sessions).

---

### 🔹 PHASE 7 : Back-Office Administrateur Exhaustif
- **Objectifs** :
  - Dashboard KPI : Chiffre d'affaires, volume de ventes, conversion, panier moyen, graphiques temporels.
  - Gestion des commandes : Détail, historique des webhooks, renvoi de licences, remboursements totaux/partiels avec révocation de licence.
  - Gestion des clients, licences et avis (modération).
  - Module « Sur mesure » (Kanban de suivi des demandes de devis et acomptes).
  - CMS (Articles de blog Markdown, FAQ, bannières promo).
  - Table d'audit `audit_logs` append-only pour toutes les actions critiques d'administration.
  - 2FA TOTP obligatoire pour l'accès aux interfaces administrateur.

---

### 🔹 PHASE 8 : Expérience 3D & Animations Avancées
- **Objectifs** :
  - Scène Three.js / React Three Fiber pour le Hero : objets tech flottants (smartphones, tablettes, fenêtres desktop avec interfaces), réactivité souris et gyroscope mobile.
  - Composant `DeviceFrame3D` pour la mise en situation des applications mobiles et SaaS.
  - Intégration de Lenis (smooth scroll) et GSAP ScrollTrigger pour les transitions au défilement.
  - Dégradation gracieuse automatique : détection GPU/FPS (PerformanceMonitor), désactivation si `prefers-reduced-motion` ou mobile à faible ressource.

---

### 🔹 PHASE 9 : Service Sur-Mesure, i18n & Optimisations
- **Objectifs** :
  - Parcours complet « Demande de projet sur mesure » avec formulaire par étapes et téléversement de cahier des charges.
  - Internationalisation complète FR / EN via `next-intl` (FR langue par défaut, traductions soignées).
  - Manifeste PWA et page hors-ligne avec cache intelligent.

---

### 🔹 PHASE 10 : Durcissement Sécurité, Performance & QA
- **Objectifs** :
  - Audit de sécurité OWASP complet selon la checklist §13 de `docs/11-SECURITE.md`.
  - Tests d'étanchéité IDOR sur toutes les routes API et Server Actions.
  - Optimisation des bundles JavaScript (JS initial < 170 Ko gzip).
  - Audits Lighthouse sur toutes les pages clés (scores ≥ 90 sur Performance, Accessibilité, Best Practices, SEO).

---

### 🔹 PHASE 11 : Mise en Production & Déploiement
- **Objectifs** :
  - Configuration du projet de production Vercel + Neon PostgreSQL + Stockage S3.
  - Application des migrations de schéma en production.
  - Bascule des clés de paiement en mode LIVE après validation des contrats marchands.
  - Test d'achat réel de bout en bout suivi d'un remboursement test.
  - Documentation finale : Guide d'exploitation, runbook incidents, guide d'administration.

---

## 3. Matrice de Suivi des Exigences

| Réf Exigence | Description | Phase | Fichiers Clés | Tests Associés | Statut |
|---|---|---|---|---|---|
| **REQ-00** | Socle, TS strict, Tailwind 4, CSP, Health | 0 | `src/app/api/health/route.ts`, `src/lib/env.ts`, `src/proxy.ts` | Typecheck, Build, Health test | 🔄 En cours |
| **REQ-01** | Tokens, UI-kit, Thème Dark/Light, Layout | 1 | `src/components/ui/*`, `src/app/[locale]/layout.tsx` | axe-core, Responsive 5 viewports | ⏳ En attente |
| **REQ-02** | Schéma PostgreSQL, RLS, Seed DEMO, Auth | 2 | `db/schema.sql`, `src/server/auth/*`, `src/app/admin/products/*` | Tests RLS, Tests IDOR, Auth test | ⏳ En attente |
| **REQ-03** | Accueil, Catalogue, Recherche ⌘K, Fiche Produit | 3 | `src/app/[locale]/(public)/boutique/*`, `src/components/product/*` | Lighthouse budgets, SEO JSON-LD | ⏳ En attente |
| **REQ-04** | Système de Démo sandboxé & isolé | 4 | `src/app/[locale]/(public)/demo/*`, `src/components/demo/*` | Tests SSRF, CSP frame-src | ⏳ En attente |
| **REQ-05** | Panier, Checkout, Adapters Paiement, Webhooks | 5 | `src/server/payments/*`, `src/app/api/webhooks/*` | E2E Achat Sandbox, Tests Idempotence | ⏳ En attente |
| **REQ-06** | Licences HMAC, Téléchargements signés S3, Compte | 6 | `src/server/licenses/*`, `src/server/downloads/*`, `src/app/[locale]/(account)/*` | Tests Quotas, Test Token signé | ⏳ En attente |
| **REQ-07** | Back-office complet, Audit logs, 2FA Admin | 7 | `src/app/admin/*`, `src/server/audit/*` | Tests Rôles RBAC, Audit logging | ⏳ En attente |
| **REQ-08** | Hero 3D R3F, DeviceFrames, Animations GSAP | 8 | `src/components/three/*`, `src/components/motion/*` | PerformanceMonitor, Fallback test | ⏳ En attente |
| **REQ-09** | Devis sur mesure, i18n FR/EN, PWA | 9 | `src/app/[locale]/(public)/sur-mesure/*`, `src/messages/*` | Validation i18n, PWA Lighthouse | ⏳ En attente |
| **REQ-10** | Audit OWASP ASVS, Tests de charge, Durcissement | 10 | Tout le projet, `tests/security/*` | Rapport Pentest, ZAP / Audit automatisé | ⏳ En attente |
| **REQ-11** | Déploiement Vercel, Live test, Runbook | 11 | `docs/RUNBOOK.md`, Configuration Vercel | Checklist mise en production | ⏳ En attente |
