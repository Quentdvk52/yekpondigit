# ⚡ PERFORMANCE, SEO & I18N

## 1. Budgets (échec CI si dépassés — Lighthouse CI + bundle analyzer)
LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1 · TTFB ≤ 600 ms (edge/cache) · JS initial home ≤ 170 Ko gzip · page produit ≤ 200 Ko gzip · image LCP ≤ 120 Ko · Lighthouse mobile Perf ≥ 90, A11y 100, BP 100, SEO ≥ 95.

## 2. Rendu & cache
- Catalogue/fiche : rendu statique/ISR + `revalidateTag` à chaque modification admin ; panier/checkout/compte : dynamique ; `Cache-Control` adaptés ; CDN Vercel ; `generateStaticParams` pour top produits.
- Streaming + Suspense, Server Components par défaut, `'use client'` minimal (îlots interactifs), pas de gros state global.
- Requêtes SQL : index, pas de N+1, `select` ciblé, pagination keyset, vue/matérialisation pour listes populaires ; cache Redis pour compteurs/FX.
- Réduction du JS : imports dynamiques (3D, éditeur riche, charts admin), `optimizePackageImports`, pas de librairies lourdes (moment, lodash entier), tree-shaking, analyse du bundle à chaque PR.

## 3. Médias
`next/image` (AVIF/WebP, `sizes`, `priority` seulement LCP, placeholders blur), dimensions réservées, vidéo `preload="none"` + poster, lazy partout sauf above-the-fold, polices `next/font` subset, icônes SVG sprite/tree-shaken, modèles 3D compressés (08).

## 4. Réseau
HTTP/2-3, compression Brotli, `preconnect` (Supabase, CDN), `dns-prefetch` paiement, prefetch de liens au survol/viewport (Next Link), service worker/PWA optionnel (cache statique, page offline).

## 5. SEO technique
`metadata` par page (title ≤ 60, description ≤ 160), URLs propres + canonical, `sitemap.ts` dynamique (produits, catégories, blog, FR/EN), `robots.ts` (bloquer `/admin`, `/compte`, `/demo` non pertinents, `/api`), `hreflang` fr/en, Open Graph + Twitter cards dynamiques (`opengraph-image.tsx` avec titre/capture produit), JSON-LD : `Organization`, `WebSite` (SearchAction), `Product` (+ `Offer`, `AggregateRating`), `BreadcrumbList`, `FAQPage`, `Article`. Pages 404 correctes (codes HTTP réels), redirections 301 pour slugs modifiés.
- **SEO programmatique** : pages `/techno/[slug]`, `/secteur/[slug]`, `/categorie/[slug]` avec contenu unique (intro éditoriale + FAQ), maillage interne, fil d'Ariane.
- Contenu : blog (guides « comment lancer… », comparatifs), pages produit riches (≥ 300 mots uniques).

## 6. i18n
`next-intl`, routes `/fr` (défaut) `/en`, détection de langue + cookie, tous les textes dans `messages/{fr,en}.json` (aucun texte en dur), formats Intl (monnaie, dates, nombres), contenu produit bilingue (champs `_fr/_en`), RTL prêt (propriétés logiques CSS `margin-inline`).

## 7. Mesure
Vercel Speed Insights, Web Vitals (RUM) vers analytics, Lighthouse CI sur PR, alertes sur régressions, tableau de bord perf dans l'admin (santé système).
