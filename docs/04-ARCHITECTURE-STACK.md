# 🏗️ ARCHITECTURE & STACK

## 1. Principes
Monorepo simple (un seul app Next.js au départ), serveur d'abord (Server Components + Server Actions + Route Handlers), séparation stricte client/serveur, domaines logiques isolés (catalog, cart, orders, payments, licenses, downloads, demos, admin), toute logique sensible dans `src/server`.

## 2. Stack (vérifier les dernières versions STABLES et patchées au démarrage, puis figer)
| Domaine | Choix |
|---------|-------|
| Framework | Next.js 16.x (App Router, Turbopack, `proxy.ts`), Node 22 LTS |
| UI | React 19, TypeScript strict, Tailwind CSS 4, shadcn/ui, Radix UI, lucide-react |
| Animation | Motion (framer-motion), GSAP + ScrollTrigger, Lenis (smooth scroll) |
| 3D | three, @react-three/fiber, @react-three/drei, @react-three/postprocessing (léger), leva (dev only), glTF/Draco/KTX2 compressés |
| Données | Supabase : PostgreSQL, Auth, Storage (buckets privés), RLS ; migrations SQL versionnées ; types générés |
| Validation | Zod (partagé client/serveur) |
| État / data | TanStack Query (client), Zustand (panier/UI minimal) |
| i18n | next-intl (fr par défaut, en) |
| Recherche | Postgres FTS + pg_trgm (option Meilisearch plus tard) |
| Rate limit / cache | Upstash Redis (@upstash/ratelimit) |
| Emails | Resend + React Email |
| PDF | @react-pdf/renderer (factures, certificats de licence) |
| Paiement | Adapters : Moneroo, FedaPay, KKiaPay, Stripe |
| Monitoring | Sentry, Vercel Analytics + Speed Insights, logs structurés (pino) |
| Tests | Vitest, React Testing Library, Playwright, axe-core (a11y), Lighthouse CI |
| Qualité | ESLint, Prettier, Husky + lint-staged, commitlint, TypeScript `strict` + `noUncheckedIndexedAccess` |
| CI/CD | GitHub Actions → Vercel (preview + prod), Supabase migrations en CI |
| Sécurité outillage | npm audit / OSV scanner, gitleaks (secrets), Dependabot/Renovate, CodeQL |

## 3. Structure du dépôt
```
codelib/
├─ docs/                      # cette archive + PLAN-EXECUTION, DECISIONS, CHANGELOG
├─ supabase/
│  ├─ migrations/             # SQL versionné
│  ├─ seed.sql                # données DEMO
│  └─ config.toml
├─ public/                    # assets statiques optimisés, models/*.glb (draco), fonts
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ (public)/         # home, boutique, produit, catégories, blog, pages
│  │  │  ├─ (checkout)/       # panier, checkout, confirmation
│  │  │  ├─ (account)/        # espace client
│  │  │  └─ (auth)/           # login, signup, reset, 2FA
│  │  ├─ admin/               # back-office (hors i18n, protégé)
│  │  ├─ api/
│  │  │  ├─ webhooks/{moneroo,fedapay,kkiapay,stripe}/route.ts
│  │  │  ├─ downloads/[token]/route.ts
│  │  │  ├─ licenses/verify/route.ts
│  │  │  └─ health/route.ts
│  │  ├─ sitemap.ts · robots.ts · manifest.ts · opengraph-image.tsx
│  │  └─ layout.tsx · global-error.tsx · not-found.tsx
│  ├─ components/
│  │  ├─ ui/ (shadcn) · layout/ · product/ · cart/ · checkout/ · demo/ · admin/
│  │  └─ three/ (Canvas, scènes, fallbacks) · motion/ (wrappers animation)
│  ├─ server/                 # CODE SERVEUR UNIQUEMENT (import 'server-only')
│  │  ├─ auth/ · db/ · repositories/ · services/
│  │  ├─ payments/{adapter.ts,moneroo.ts,fedapay.ts,kkiapay.ts,stripe.ts,router.ts}
│  │  ├─ orders/ · licenses/ · downloads/ · emails/ · pdf/ · audit/ · security/
│  ├─ lib/                    # utilitaires purs (format, money, slug, env)
│  ├─ schemas/                # Zod
│  ├─ hooks/ · stores/ · i18n/ · styles/
│  └─ proxy.ts                # en-têtes, CSP nonce, garde de routes (Next 16)
├─ tests/{unit,integration,e2e}/
├─ .env.example · .gitignore · .gitleaks.toml
├─ next.config.ts · tailwind (v4 via CSS) · tsconfig.json
└─ README.md
```

## 4. Variables d'environnement (`.env.example`, JAMAIS de vraies valeurs)
```
NEXT_PUBLIC_APP_NAME=CodeLib
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_DEMO_BASE_URL=          # domaine séparé des démos
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # serveur uniquement
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RESEND_API_KEY=
EMAIL_FROM=
SENTRY_DSN=
PAYMENT_PROVIDERS_ENABLED=fedapay,kkiapay,stripe
MONEROO_SECRET_KEY= / MONEROO_WEBHOOK_SECRET=
FEDAPAY_SECRET_KEY= / FEDAPAY_WEBHOOK_SECRET= / FEDAPAY_ENV=sandbox
KKIAPAY_PUBLIC_KEY= / KKIAPAY_PRIVATE_KEY= / KKIAPAY_SECRET=
STRIPE_SECRET_KEY= / STRIPE_WEBHOOK_SECRET=
LICENSE_SIGNING_SECRET=             # HMAC/clé de signature licences
DOWNLOAD_TOKEN_SECRET=
CRON_SECRET=
```
Validation au démarrage via Zod (`src/lib/env.ts`) : l'app refuse de démarrer si une variable obligatoire manque. Variables `NEXT_PUBLIC_*` = uniquement non sensibles.

## 5. Flux d'architecture clés
- **Rendu** : pages catalogue en ISR/Cache Components (revalidation par tag à la modification produit) ; panier/checkout/compte dynamiques ; admin dynamique.
- **Achat** : Panier → `createOrder` (serveur recalcule prix) → `payments.router.initiate()` → redirection/fenêtre fournisseur → webhook signé → `orders.markPaid()` (transaction + idempotence) → `licenses.issue()` → `emails.send()` → page confirmation (polling du statut).
- **Téléchargement** : bouton → serveur vérifie droits + quota → crée token court → redirige vers URL signée Storage → journalise.
- **Démos** : iframe vers `NEXT_PUBLIC_DEMO_BASE_URL` (voir 09).

## 6. Conventions
Conventional Commits, branches `feat/`, `fix/`, PR avec checklist sécurité ; ADR dans `docs/DECISIONS.md` ; erreurs typées (Result pattern) pour services ; aucune logique métier dans les composants ; accès base uniquement via repositories ; imports `server-only` pour tout fichier de `src/server`.
