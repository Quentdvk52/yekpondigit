# 💳 PAIEMENT, COMMANDES, LICENCES & LIVRAISON

## 1. Fournisseurs (abstraction `PaymentProvider`)
```ts
interface PaymentProvider {
  id: 'moneroo'|'fedapay'|'kkiapay'|'stripe';
  supports(ctx:{country:string; currency:string; method?:string}): boolean;
  initiate(order: OrderSnapshot): Promise<{ redirectUrl?: string; clientToken?: string; providerRef: string }>;
  verifyWebhook(req: Request): Promise<WebhookEvent>;      // signature obligatoire
  fetchStatus(providerRef: string): Promise<PaymentStatus>; // revérification serveur → serveur
  refund(providerRef: string, amount: number): Promise<RefundResult>;
}
```
- **Routage** : Bénin/UEMOA → Mobile Money (MTN MoMo, Moov Money, Celtiis Cash) via agrégateur actif (FedaPay/KKiaPay/Moneroo) ; cartes locales/diaspora → même agrégateur ou Stripe ; international → Stripe. Les fournisseurs actifs sont réglés par `PAYMENT_PROVIDERS_ENABLED` et l'admin.
- Chaque adapter a un **mode sandbox** ; tests E2E en sandbox. Aucune donnée de carte ne touche le serveur (redirection/hosted fields).
- Frais et moyens exacts : à confirmer dans les contrats ; ne pas coder de taux en dur → table `settings`.

## 2. Flux d'achat sécurisé (séquence)
1. Client clique **Commander** → ajoute au panier → checkout.
2. `POST createOrder` (Server Action) : revalide tout côté serveur (produits publiés, licence valide, add-ons, coupon, devise) → calcule totaux → crée `orders(status=awaiting_payment)` + `order_items` avec **snapshot** des prix.
3. `payments.router.initiate()` crée la transaction chez le fournisseur avec `metadata.order_id` et URL de retour/annulation (liste blanche), renvoie URL/token.
4. Le client paie chez le fournisseur.
5. **Webhook** (`/api/webhooks/{provider}`) : vérifie la signature + horodatage → enregistre dans `webhook_events` (unique `(provider,event_id)` = idempotence) → revérifie le statut via `fetchStatus()` (ne jamais faire confiance au seul payload) → compare **montant/devise/référence** avec la commande → transaction SQL : `payments=succeeded`, `orders=paid`, incrément `sales_count`, coupon `used_count`.
6. Post-paiement (job idempotent) : générer licence(s), facture PDF, email de livraison, notification admin, passage `fulfilled`.
7. Page de statut : polling du statut serveur (pas de confiance au paramètre d'URL de retour).
8. Cas limites : paiement en double, webhook en retard/dans le désordre, montant différent (→ `disputed`/revue manuelle), expiration (job qui annule `awaiting_payment` > 60 min), paiement tardif sur commande annulée (réactivation contrôlée), réessai avec autre moyen.

## 3. Licences
- Clé : `XXXX-XXXX-XXXX-XXXX` (aléatoire cryptographique, base32 sans caractères ambigus) + signature HMAC interne.
- Types : standard / étendue ; options `max_domains`, `expires_at`.
- API publique `POST /api/licenses/verify` `{key, domain?}` → `{valid, product, license, status}` (rate limit strict, pas de fuite d'info).
- Révocation automatique sur remboursement total/litige gagné ; journal d'audit.
- Certificat de licence PDF (nom client, produit, version, date, numéro).

## 4. Téléchargements sécurisés
- Fichiers dans bucket **privé** `product-files`. L'utilisateur n'obtient jamais le chemin.
- `GET /api/downloads/[token]` : vérifie session (ou token email signé pour invités), propriété de la licence, statut actif, période de mise à jour, **quota** (ex. 10 / 30 jours) → crée URL signée (TTL 60–120 s) → journalise (`download_logs`) → redirige. Limiter débit par IP/compte.
- Empreinte SHA-256 affichée ; fichiers analysés (antivirus ClamAV/service) à l'upload ; nom de fichier propre.
- Option **filigrane de licence** (fichier `LICENSE-<clé>.txt` injecté dans le zip côté serveur).
- Invités : lien magique à durée limitée envoyé par email + proposition de créer un compte.
- Mises à jour : nouvelle version publiée → email aux acheteurs éligibles, bouton « Télécharger la dernière version ».

## 5. Factures & taxes
Numérotation séquentielle sans trou (`INV-2026-000001`), PDF généré serveur, stockage privé, email ; TVA/taxes configurables par pays (désactivées par défaut, à valider avec un comptable) ; mentions légales vendeur.

## 6. Remboursements & litiges
Politique claire (page dédiée), action admin remboursement partiel/total via adapter, révocation licence liée, motifs obligatoires, audit complet ; gestion des chargebacks Stripe (webhook `charge.dispute.*` → statut `disputed`, gel licence).

## 7. Anti-fraude basique
Rate limit création de commandes/IP, vérification email (OTP) pour invités à gros montants, détection d'abus de coupons, blocage de comptes, liste noire, score simple (pays/IP/email jetable), alerte admin sur motifs suspects (plusieurs échecs, montants élevés).

## 8. Sur mesure (acompte)
Devis PDF → lien de paiement unique lié à `custom_requests` → mêmes règles webhook → statut « Accepté ».
