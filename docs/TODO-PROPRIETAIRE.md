# 📋 ACTIONS & VALIDATIONS REQUISES PAR LE PROPRIÉTAIRE — YEKPON DIGIT

Ce document répertorie toutes les décisions, ouvertures de comptes et clés d'API nécessaires au déploiement en production.
En attendant la fourniture de ces éléments, la plateforme fonctionne en mode **Sandbox / Mock sécurisé** afin de permettre un développement et des tests intégraux.

---

## 1. 💳 Paiements & Passerelles (Mobile Money + Cartes)
- [ ] **FedaPay** : Ouvrir compte marchand, compléter le KYC (Bénin / UEMOA), récupérer `FEDAPAY_SECRET_KEY`, `FEDAPAY_WEBHOOK_SECRET` (mode sandbox d'abord, puis live).
- [ ] **KKiaPay** : Ouvrir compte, récupérer `KKIAPAY_PUBLIC_KEY`, `KKIAPAY_PRIVATE_KEY`, `KKIAPAY_SECRET`.
- [ ] **Moneroo** (Optionnel / Agrégateur alternatif) : Récupérer `MONEROO_SECRET_KEY`, `MONEROO_WEBHOOK_SECRET`.
- [ ] **Stripe** (Paiement international par carte) : Ouvrir compte Stripe, récupérer `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
- [ ] **Validation des frais & devises** : Valider les taux de conversion et frais marchands répercutés (ou absorbés) sur les ventes en XOF (FCFA), EUR et USD.

---

## 2. 🌐 Domaines & DNS (Isolation de Sécurité des Démos)
- [ ] **Domaine principal** : Réserver et configurer le domaine de la plateforme (ex: `yekpondigit.com`).
- [ ] **Domaine isolé pour les démos** : Réserver un domaine dédié **séparé** (ex: `yekpondigit-demos.com` ou sous-domaine isolé sans cookies partagés `demos.yekpondigit.com`) pour héberger les iframes de démo interactives sans aucun risque de fuite de session/cookies (OWASP ASVS / Règle 09).

---

## 3. 🗄️ Base de Données, Stockage & Authentification
- [x] **Base de données Neon PostgreSQL** : Fournie dans le document de connexion (`postgresql://neondb_owner:***@ep-late-waterfall-bdam03wf-pooler.c-8.us-east-2.aws.neon.tech/neondb`).
- [x] **Stockage d'objets S3 (Neon / AWS S3)** : Fourni dans le document de connexion (`AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, région `us-east-2`).
- [ ] **Stratégie d'authentification** : Confirmer l'utilisation de Neon Auth (JWKS) ou d'un module d'authentification NextAuth/Auth.js avec session HttpOnly sécurisée et support 2FA TOTP pour les administrateurs.
- [ ] **Upstash Redis** : Créer une base Redis serverless gratuite sur [console.upstash.com](https://console.upstash.com) pour le rate limiting distribué (protection brute-force, webhooks, téléchargements).

---

## 4. 📧 Emails Transactionnels & Notifications
- [ ] **Resend** : Créer un compte sur [resend.com](https://resend.com), valider le domaine d'envoi (`contact@yekpondigit.com` ou `noreply@...`), obtenir `RESEND_API_KEY`.
- [ ] **Numéro WhatsApp Business** : Fournir le numéro de contact WhatsApp officiel pour le widget de support direct.

---

## 5. ⚖️ Légal & Conformité Juridique
- [ ] **Conditions Générales de Vente (CGV)** : Faire relire par un juriste (notamment clauses d'exclusion de rétractation pour contenu numérique téléchargeable immédiatement).
- [ ] **Politique de Remboursement** : Valider la fenêtre de réclamation (ex: 7 jours sous conditions de non-conformité avérée).
- [ ] **Licences logicielles** : Valider les termes de la Licence Standard (usage pour 1 projet/domaine) et de la Licence Étendue (usage multi-projets / redistribution SaaS).
- [ ] **Mentions Légales & Registre de Commerce (RCCM / IFU)** : Fournir les identifiants officiels de l'entreprise YEKPON DIGIT au Bénin.

---

## 6. 🚀 Déploiement & Monitoring
- [ ] **Vercel** : Lier le projet GitHub `https://github.com/Quentdvk52/yekpondigit.git` à un projet Vercel.
- [ ] **Sentry** : Créer un projet Sentry Next.js pour la remontée d'erreurs en production et renseigner `SENTRY_DSN`.
