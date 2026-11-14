# 📦 ARCHIVE ANTIGRAVITY — « CODELIB » : Boutique / Bibliothèque de logiciels

> Nom de travail : **CodeLib** (renommable via une seule variable `NEXT_PUBLIC_APP_NAME`).
> Cette archive contient TOUT ce dont l'agent a besoin pour construire le projet de bout en bout.

## 🎯 Le projet en une phrase
Une boutique en ligne premium, animée et 3D, qui vend des projets logiciels clés en main
(sites web, applications web/SaaS, applications mobiles, apps natives Android, logiciels desktop/OS,
templates, scripts, kits…). Chaque produit a une **page avec aperçu démo** (live, vidéo, galerie, mockup 3D)
et un bouton **« Commander »** menant à un paiement sécurisé puis à la **livraison automatique** (fichiers + licence).

## 🗂️ Contenu et ORDRE DE LECTURE OBLIGATOIRE
| # | Fichier | Rôle |
|---|---------|------|
| 00 | 00-LISEZ-MOI.md | Index (ce fichier) |
| 01 | 01-PROMPT-MAITRE.md | **Prompt principal à coller dans Antigravity** |
| 02 | 02-RECHERCHE-BENCHMARK.md | Analyse des sites similaires + enseignements |
| 03 | 03-CAHIER-DES-CHARGES.md | Fonctionnalités, rôles, règles métier |
| 04 | 04-ARCHITECTURE-STACK.md | Stack, versions, structure du repo, variables d'env |
| 05 | 05-BASE-DE-DONNEES.md | Schéma SQL complet + RLS |
| 06 | 06-ECRANS-ET-PAGES.md | TOUS les écrans (public, client, admin) avec contenu détaillé |
| 07 | 07-DESIGN-SYSTEM-UI-UX.md | Design system, tokens, composants, responsive, accessibilité |
| 08 | 08-3D-ET-ANIMATIONS.md | 3D, animations, scroll, performance graphique |
| 09 | 09-SYSTEME-DEMO.md | Système d'aperçu démo (iframe sandbox, vidéo, mockup, émulateur) |
| 10 | 10-PAIEMENT-COMMANDES-LIVRAISON.md | Paiement (Mobile Money + cartes), commandes, licences, téléchargements |
| 11 | 11-SECURITE.md | Règles de sécurité OBLIGATOIRES |
| 12 | 12-PERFORMANCE-SEO.md | Vitesse, Core Web Vitals, SEO, i18n |
| 13 | 13-API-SPEC.md | Endpoints, contrats, webhooks |
| 14 | 14-TESTS-QUALITE-DEPLOIEMENT.md | Tests, CI/CD, déploiement Vercel/Supabase, monitoring |
| 15 | 15-PLAN-DE-LIVRAISON.md | Phases + checklist de validation |
| 16 | 16-PROMPTS-PAR-PHASE.md | Prompts de relance courts, phase par phase |
| 17 | 17-CONTENU-ET-LEGAL.md | Textes, pages légales, emails, seed de démonstration |

## ▶️ Mode d'emploi
1. Dézipper l'archive à la racine du workspace Antigravity (dossier `/docs`).
2. Coller le contenu de `01-PROMPT-MAITRE.md` dans Antigravity.
3. L'agent lit les fichiers 02 → 17, produit un plan, puis exécute phase par phase (fichier 15).
4. À chaque fin de phase, utiliser le prompt correspondant de `16-PROMPTS-PAR-PHASE.md`.
5. Ne JAMAIS passer à la phase suivante si la checklist de la phase en cours n'est pas verte.

## ⚠️ Points à valider par le propriétaire avant la mise en production
- Choix et ouverture des comptes de paiement (KYC agrégateurs : plusieurs jours à semaines).
- Textes légaux (CGV, licences, confidentialité) à faire relire par un juriste.
- Frais, plafonds et moyens de paiement exacts : à confirmer dans les contrats marchands.
- Versions des dépendances : l'agent doit vérifier les dernières versions STABLES et les avis de sécurité au démarrage.
