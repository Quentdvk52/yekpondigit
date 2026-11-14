# 🔌 API & SERVER ACTIONS — Contrats

Conventions : JSON, erreurs `{ error: { code, message, details? } }` sans fuite d'information, codes HTTP corrects, versionnage `/api/v1` pour l'API publique, rate limit en-têtes `RateLimit-*`, toutes entrées validées Zod, auth vérifiée serveur, idempotence via en-tête `Idempotency-Key` sur les mutations critiques.

## 1. Server Actions (usage interne UI)
| Action | Auth | Notes |
|--------|------|-------|
| `cart.add/update/remove/applyCoupon` | public | Revalidation prix serveur |
| `orders.create` | public/guest | Retourne `orderId` + redirect paiement ; rate limit |
| `payments.initiate(orderId, method)` | propriétaire/guest token | Vérifie statut `awaiting_payment` |
| `account.update/changePassword/enable2FA` | user | Réauthentification pour actions sensibles |
| `reviews.create` | acheteur vérifié | 1 avis / achat |
| `wishlist.toggle` | user | — |
| `customRequests.create` | public + captcha | Pièces jointes validées |
| `tickets.create/reply` | user | — |
| `newsletter.subscribe` | public + captcha | Double opt-in |
| `admin.*` (produits, versions, démos, commandes, remboursements, coupons, CMS, rôles…) | rôle + 2FA | Audit log systématique |

## 2. Route Handlers publics/semi-publics
| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/health` | GET | Santé (DB, cache) sans détails sensibles |
| `/api/search/suggest?q=` | GET | Suggestions (rate limit, q ≤ 80 car.) |
| `/api/products` | GET | Liste filtrée paginée (limit ≤ 50) |
| `/api/products/[slug]` | GET | Détail public (sans fichiers/identifiants) |
| `/api/licenses/verify` | POST | `{key, domain?}` → `{valid, status, product}` ; rate limit strict |
| `/api/downloads/[token]` | GET | Redirige vers URL signée après contrôles |
| `/api/fx` | GET | Taux de change en cache |
| `/api/webhooks/moneroo` · `/fedapay` · `/kkiapay` · `/stripe` | POST | Signature, idempotence, 200 rapide, traitement asynchrone sûr |
| `/api/cron/*` | GET | Protégé par `CRON_SECRET` : expiration commandes, rappels, taux FX, purge tokens, reset démos, emails de mise à jour |

## 3. Exemple de contrat `orders.create`
Entrée :
```json
{ "items":[{"productId":"uuid","licenseCode":"standard","addonIds":[]}],
  "email":"client@exemple.com","country":"BJ","couponCode":"BIENVENUE10",
  "locale":"fr","acceptTerms":true,"captchaToken":"..." }
```
Sortie :
```json
{ "orderId":"uuid","number":"CL-2026-000123","total":{"xof":45000,"display":"45 000 FCFA"},
  "payment":{"providers":["fedapay","kkiapay"],"defaultMethod":"mtn_momo"} }
```
Règles : jamais de prix en entrée ; `acceptTerms` obligatoire ; refus si produit non publié ; plafonds de quantité ; erreurs `INVALID_COUPON`, `PRODUCT_UNAVAILABLE`, `RATE_LIMITED`.

## 4. Webhook — squelette de traitement (identique pour chaque fournisseur)
1. Lire le corps **brut** (pas de re-sérialisation) · 2. vérifier signature + tolérance horaire · 3. insérer `webhook_events` (conflit → renvoyer 200, déjà traité) · 4. `fetchStatus()` auprès du fournisseur · 5. comparer montant/devise/ref · 6. transaction `markPaid` · 7. enqueue fulfilment · 8. 200 · En cas d'erreur transitoire : 5xx pour retry fournisseur ; erreur définitive : journaliser + alerte.

## 5. Observabilité API
Log structuré (requestId, route, durée, statut, userId haché), traces Sentry, métriques (taux d'erreur, latence p95), alertes webhooks.
