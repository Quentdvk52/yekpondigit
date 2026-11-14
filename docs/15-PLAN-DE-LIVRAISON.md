# 🗺️ PLAN DE LIVRAISON — Phases & checklists de validation

Règle : une phase n'est terminée que si TOUTE sa checklist est verte (lint, typecheck, tests, build, a11y, sécurité, responsive 5 largeurs).

## PHASE 0 — Fondations (durée indicative : 1 jour)
- Init repo Next.js (version stable patchée), TS strict, Tailwind 4, shadcn, ESLint/Prettier/Husky/gitleaks, CI de base, `.env.example` + validation Zod, structure du 04, Supabase local + premières migrations (enums, profiles), i18n, thème dark/light, layout (header/footer), `proxy.ts` avec en-têtes de sécurité + CSP nonce, page health.
- ✅ Build vert, CI verte, en-têtes vérifiés, README démarrage.

## PHASE 1 — Design system & pages statiques (2–3 j)
- Tokens, composants UI (07), layout responsive, Lenis + Motion de base, pages CMS statiques, 404/500, cookie banner, sélecteur langue/devise.
- ✅ UI-kit complet, axe 0 critique, 5 largeurs OK.

## PHASE 2 — Base de données, catalogue & admin produits (3–4 j)
- Schéma complet (05) + RLS + seed DEMO, auth (signup/login/2FA), rôles, admin produits (wizard, médias, licences, versions, fichiers privés), catégories/tags/collections.
- ✅ Tests RLS/IDOR verts, upload sécurisé OK, CRUD admin audité.

## PHASE 3 — Boutique publique & fiche produit (3–4 j)
- Accueil (sans 3D finale), boutique + filtres + recherche + ⌘K, fiche produit complète, SEO/JSON-LD, sitemap, OG images.
- ✅ Lighthouse budgets, SEO ≥ 95, navigation clavier.

## PHASE 4 — Système de démo (2 j)
- Tous types de démo (09), plein écran, sélecteur d'appareil, validation URL/liste blanche, sandbox iframe, CSP frame-src, reset des démos.
- ✅ Tests SSRF/URL malveillante, démo isolée sur domaine séparé.

## PHASE 5 — Panier, checkout, paiement, commandes (4–5 j)
- Panier, coupons, `createOrder`, couche paiement + adapters (sandbox), webhooks idempotents, statuts, emails, factures PDF, pages statut/merci.
- ✅ E2E achat sandbox, tests webhook (rejeu, forgé, montant altéré), tests unitaires prix.

## PHASE 6 — Licences, téléchargements, espace client (3 j)
- Génération licences, API verify, téléchargements signés + quotas + logs, espace client complet, avis vérifiés, favoris, tickets.
- ✅ IDOR téléchargements testé, quotas, certificat PDF.

## PHASE 7 — Back-office complet (3 j)
- Dashboard KPI, commandes/paiements/remboursements, clients, licences, coupons, avis, sur mesure (kanban), CMS/blog, emails, analytics, paramètres, rôles, audit.
- ✅ 2FA admin obligatoire, audit log couvrant les actions sensibles.

## PHASE 8 — 3D & animations avancées (2–3 j)
- Hero 3D, DeviceFrame 3D, ScrollTrigger sections, micro-interactions, fallbacks, PerformanceMonitor, reduced-motion.
- ✅ LCP/INP tenus avec 3D, fallback testé (WebGL off, mobile bas de gamme).

## PHASE 9 — Sur mesure, blog, i18n complète, PWA (2 j)
- ✅ Contenus FR/EN complets, hreflang, offline page.

## PHASE 10 — Durcissement : sécurité, perf, QA (3 j)
- Audit sécurité complet (11 §13 + tests manuels), ZAP, k6, Lighthouse, a11y manuelle, correction de tout High/Critical, revue dépendances, docs finales.
- ✅ Rapport d'audit, scores cibles atteints.

## PHASE 11 — Mise en production (1–2 j)
- Checklist déploiement (14 §5), clés LIVE, test d'achat réel + remboursement, monitoring, runbook, formation admin.
- ✅ Go-live validé par le propriétaire.

## PHASE 12 — Évolutions (backlog)
Marketplace multi-vendeurs, affiliation, abonnements, app mobile de la boutique, avis vidéo, IA de recommandation/assistant d'achat, intégration GitHub (dépôts privés auto), multi-devises de paiement avancé.

## Matrice de suivi (à tenir à jour dans docs/PLAN-EXECUTION.md)
| Exigence | Phase | Fichier(s) | Test(s) | Statut |
|---|---|---|---|---|
