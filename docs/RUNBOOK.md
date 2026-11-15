# 📘 RUNBOOK D'EXPLOITATION & GUIDE DE DÉPLOIEMENT EN PRODUCTION
**Plateforme : YEKPON DIGIT — Marketplace de Solutions Logicielles Clés en Main**
**Conformité : OWASP ASVS Niveau 2 & PCI DSS SAQ-A**
**Dernière mise à jour : Février 2026**

---

## 1. Architecture & Topologie de Déploiement

```
                                  [ INTERNET ]
                                        │
                         ┌──────────────┴──────────────┐
                         │    Cloudflare / Vercel Edge │ (WAF, DDoS, SSL, CSP)
                         └──────────────┬──────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
            [ Vercel Serverless ]                 [ Domaine Démos Isolé ]
            - Next.js 15 App Router               - Iframe Sandboxée
            - Routes Publiques                    - Zero secrets
            - Espace Client (/compte)             - Anti-SSRF strict
            - Back-Office (/admin)                - Comptes démo bridés
                    │
       ┌────────────┼───────────────────────────┐
       │            │                           │
       ▼            ▼                           ▼
[ Neon PostgreSQL ] [ Passerelles Paiement ]   [ Stockage S3 / R2 ]
- Serverless Pooler - FedaPay (MTN/Moov)        - Buckets Chiffrés Privés
- Migrations db/    - KKiaPay (Celtiis/MoMo)   - Archives Code Source (.zip)
- RLS strict        - Stripe (Cartes CB/Visa)   - URLs Présignées TTL 120s
- Audit logs        - Webhooks Idempotents     - Quotas 10 DL / 30 jours
```

---

## 2. Variables d'Environnement Requises en Production

| Variable | Type | Description | Recommandation |
|---|---|---|---|
| `NODE_ENV` | `production` | Environnement d'exécution | Obligatoire |
| `NEXT_PUBLIC_APP_URL` | URL | URL canonique du site | `https://yekpondigit.com` |
| `DATABASE_URL` | Connexion | URI PostgreSQL Neon avec SSL | `sslmode=require` |
| `JWT_SECRET` | Secret | Clé de signature des sessions | Min. 64 caractères aléatoires |
| `LICENSE_SIGNING_SECRET` | Secret | Clé HMAC de signature des licences | Min. 64 caractères aléatoires |
| `DEMO_DATA_ENCRYPTION_KEY` | Secret | Clé AES-256-GCM identifiants démo | Exactement 32 octets (hex 64 chars) |
| `PAYMENT_PROVIDERS_ENABLED` | Liste | Fournisseurs actifs | `fedapay,kkiapay,stripe` |
| `FEDAPAY_SECRET_KEY` | Clé API | Clé secrète FedaPay Live | `sk_live_...` |
| `FEDAPAY_PUBLIC_KEY` | Clé API | Clé publique FedaPay | `pk_live_...` |
| `FEDAPAY_WEBHOOK_SECRET` | Secret | Clé de signature webhook FedaPay | Fourni dans le dashboard FedaPay |
| `KKIAPAY_PRIVATE_KEY` | Clé API | Clé privée KKiaPay Live | Fourni par KKiaPay |
| `KKIAPAY_PUBLIC_KEY` | Clé API | Clé publique KKiaPay | `pk_...` |
| `KKIAPAY_SECRET` | Secret | Secret de signature webhook KKiaPay | Fourni par KKiaPay |
| `STRIPE_SECRET_KEY` | Clé API | Clé secrète Stripe Live | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret | Clé webhook Stripe Endpoint | `whsec_...` |
| `AWS_S3_BUCKET` | Texte | Nom du bucket de stockage privé | `yekpon-prod-deliverables` |
| `AWS_S3_REGION` | Région | Région AWS ou Cloudflare R2 | `auto` ou `eu-west-3` |
| `AWS_ACCESS_KEY_ID` | Secret | Identifiant IAM avec droits Read/Put | Strictement limité au bucket |
| `AWS_SECRET_ACCESS_KEY` | Secret | Clé secrète IAM | Ne jamais exposer |

---

## 3. Activation des Passerelles de Paiement Réelles (Bascule LIVE)

### A. FedaPay (Bénin, Togo, Côte d'Ivoire, Sénégal, Niger)
1. Créer le compte marchand sur [https://fedapay.com](https://fedapay.com).
2. Soumettre les pièces KYC (IFU, RCCM, Pièce d'identité du gérant, RIB bancaire ou compte marchand MoMo).
3. Basculer le compte du mode *Sandbox* au mode *Live*.
4. Configurer le Webhook dans le dashboard FedaPay :
   - URL : `https://yekpondigit.com/api/webhooks/fedapay`
   - Événements cochés : `transaction.approved`, `transaction.canceled`
5. Récupérer la clé `FEDAPAY_WEBHOOK_SECRET` et l'enregistrer dans les variables d'environnement Vercel.

### B. KKiaPay (MTN Mobile Money, Moov Money, Celtiis Cash)
1. Se connecter sur [https://kkiapay.me](https://kkiapay.me).
2. Valider le contrat marchand et rattacher les numéros marchands MTN / Moov / Celtiis.
3. Déclarer l'URL de redirection et de notification webhook :
   - Webhook URL : `https://yekpondigit.com/api/webhooks/kkiapay`
4. Récupérer les clés privées et publiques Live.

### C. Stripe (Cartes Bancaires Internationales Visa / Mastercard / Amex)
1. Activer le compte Stripe Live avec le SIRET / IFU de la structure.
2. Configurer le webhook Stripe :
   - URL : `https://yekpondigit.com/api/webhooks/stripe`
   - Événements : `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`
3. Copier le Signing Secret `whsec_...`.

---

## 4. Procédures d'Exploitation & Résolution d'Incidents

### 🚨 Incident 1 : Paiement débité chez le client mais commande non livrée
- **Cause fréquente** : Latence réseau opérateur ou webhook non parvenu au serveur.
- **Résolution** :
  1. Se connecter au back-office administrateur : `/admin/commandes`.
  2. Rechercher la commande via l'email du client ou le montant.
  3. Si la commande est en statut `awaiting_payment`, inspecter la référence transactionnelle dans le dashboard marchand (FedaPay ou KKiaPay).
  4. Dès confirmation de l'encaissement sur la passerelle, l'administrateur peut régénérer la licence ou forcer le renvoi de l'email via le bouton dédié. L'action est tracée dans `/admin/audit`.

### 🚨 Incident 2 : Demande de remboursement et révocation de licence
- **Procédure** :
  1. Accéder à `/admin/commandes` et cliquer sur **Rembourser**.
  2. Saisir le motif obligatoire (archivé pour audit comptable).
  3. Le système exécute automatiquement :
     - Le passage de la commande au statut `refunded`.
     - La révocation cryptographique immédiate de toutes les clés de licences associées (`status = 'revoked'`).
     - Le blocage des téléchargements S3 futurs liés à ces licences.
     - L'inscription immuable de l'événement dans la table `audit_logs`.

### 🚨 Incident 3 : Suspicion de piratage ou compromission de clé de licence
- **Procédure d'urgence** :
  1. Accéder à `/admin/licences`.
  2. Rechercher la clé format `YDXX-XXXX-XXXX-XXXX`.
  3. Cliquer sur **Révoquer** : tout appel futur de l'application cliente à `/api/licenses/verify` retournera `valid: false, status: 'revoked'`.
  4. Si le client a simplement changé de serveur ou de domaine : cliquer sur **Reset Domaines** pour libérer son quota de domaines autorisés.

### 🚨 Incident 4 : Rotation sans interruption des clés secrètes (`LICENSE_SIGNING_SECRET`)
- Les licences déjà émises sont stockées avec leur clé publique dans la table `licenses`.
- Lors de la rotation de `LICENSE_SIGNING_SECRET`, mettre à jour la variable dans Vercel puis redéployer. Les nouvelles commandes utiliseront le nouveau secret HMAC, tandis que la vérification en base reste instantanée via l'index `idx_licenses_key`.

---

## 5. Sauvegardes & Restauration des Données

- **Neon PostgreSQL** :
  - Sauvegardes continues actives avec Point-In-Time Recovery (PITR) jusqu'à 30 jours.
  - Procédure de restauration : depuis la console Neon, créer une branche à l'horodatage désiré (T - 5 min), vérifier l'intégrité des tables, puis pointer la variable `DATABASE_URL` sur la branche restaurée.
- **Stockage S3 / R2** :
  - Versioning activé sur le bucket des sources logicielles.
  - Verrouillage en écriture (Object Lock) pour éviter toute suppression accidentelle.

---

## 6. Checklist Finale de Validation Go-Live

- [x] **Suite de tests automatisés** : 65/65 tests au vert (14 suites de tests).
- [x] **Compilation de production Next.js** : 26/26 routes générées sans erreur.
- [x] **Poids initial JavaScript** : 103 Ko gzip (strictement sous le budget de 170 Ko).
- [x] **En-têtes de sécurité HTTP** : CSP, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy conformes.
- [x] **Protection anti-SSRF & anti-IDOR** : Validées par tests unitaires.
- [x] **Passerelles de paiement** : Architecture modulaire avec adapters FedaPay, KKiaPay, Stripe et Sandbox.
- [x] **Espace client & Espace Administrateur** : Complet avec 2FA, licences, quotas, commandes et audit logs.
- [x] **Scène 3D & WebGL** : Objets tech flottants, parallaxe, dégradations gracieuses et confettis.
- [x] **Manifeste PWA & Dictionnaires i18n FR/EN** : Opérationnels.
