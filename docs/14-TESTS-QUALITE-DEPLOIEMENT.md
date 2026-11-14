# ✅ TESTS, QUALITÉ & DÉPLOIEMENT

## 1. Pyramide de tests
- **Unitaires (Vitest)** : calcul de prix/coupons/taxes/devises, génération et vérification de clés de licence, validation Zod, adapters de paiement (avec mocks), signatures webhook, formatage, slugs. Couverture visée ≥ 80 % sur `src/server` et `src/lib`.
- **Intégration** : repositories + base de test (Supabase local/pg), RLS (utilisateur A ≠ B), idempotence webhook (rejouer 5×), transactions `markPaid`, quotas de téléchargement, expiration de commandes.
- **E2E (Playwright)** : parcours F du fichier 06 (achat complet sandbox, échec paiement, coupon, IDOR, remboursement, sur mesure) sur 3 viewports (mobile/tablette/desktop) + Chromium/Firefox/WebKit.
- **Accessibilité** : axe-core dans Playwright (0 violation critique), audit manuel clavier + lecteur d'écran.
- **Performance** : Lighthouse CI (budgets du 12), test de charge léger (k6) sur catalogue, recherche, création de commande (ex. 200 req/s catalogue en cache).
- **Sécurité** : `npm audit`, OSV, gitleaks, CodeQL, ZAP baseline (DAST) sur preview, tests manuels : IDOR, CSRF, XSS (payloads), SSRF (URLs démo), upload malveillant, webhook forgé, rejeu, énumération de comptes, brute force.
- **Visuel** : captures Playwright comparées sur pages clés (accueil, boutique, produit, checkout).

## 2. Qualité du code
TypeScript strict, ESLint (règles sécurité : `eslint-plugin-security`, `no-restricted-imports` pour empêcher import serveur dans client), Prettier, Husky (pre-commit : lint-staged + gitleaks, pre-push : typecheck), commitlint, revue de PR avec checklist sécurité (11 §13), pas de `console.log` en prod, pas de `any`, complexité raisonnable, ADR pour décisions.

## 3. CI/CD (GitHub Actions)
Jobs : install (`npm ci`) → lint → typecheck → unit/integration → build → e2e (preview) → lighthouse → audit sécurité → déploiement preview Vercel → migrations Supabase (staging) → **promotion manuelle** vers prod. Cache npm/Playwright. Protection de `main`.

## 4. Environnements
`local` (Supabase CLI) · `preview` (par PR) · `staging` · `production`. Projets Supabase séparés staging/prod ; variables par environnement ; migrations idempotentes ; seed uniquement hors prod.

## 5. Déploiement production (checklist)
- [ ] Domaine + DNS + SSL + HSTS · [ ] domaine séparé des démos · [ ] variables d'env prod (clés LIVE paiement) · [ ] webhooks configurés (URL, secrets) · [ ] emails : SPF, DKIM, DMARC · [ ] Sentry/Analytics · [ ] sauvegardes PITR activées · [ ] cron jobs configurés · [ ] robots/sitemap soumis (Search Console) · [ ] pages légales validées · [ ] test d'achat réel à faible montant + remboursement · [ ] revue sécurité finale + test restauration · [ ] plan de rollback (rollback Vercel + migration inverse).

## 6. Monitoring & exploitation
Uptime (ping `/api/health`), alertes (erreurs 5xx, webhooks en échec, latence p95, échecs d'email, quotas stockage), tableau de bord santé admin, rotation des logs, revue hebdomadaire des dépendances, mise à jour mensuelle des versions, **runbook** (`docs/RUNBOOK.md`) : paiement bloqué, webhook rejoué, remboursement, révocation de licence, fuite de clé, panne Supabase/Vercel.

## 7. Documentation à produire
README (démarrage < 10 min), `docs/ADMIN-GUIDE.md` (ajouter produit/démo/version, gérer commandes), `docs/DEPLOY.md`, `docs/RUNBOOK.md`, `docs/SECURITY.md` (politique + contact), `docs/DECISIONS.md`, `CHANGELOG.md`, `docs/API.md`.
