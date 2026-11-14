# 🔐 SÉCURITÉ — RÈGLES OBLIGATOIRES (prévalent sur tout autre document)

Cible : OWASP ASVS niveau 2 + OWASP Top 10 (2021) + OWASP API Top 10. Chaque PR vérifie cette liste.

## 1. Secrets & configuration
- Aucun secret dans le code, les logs, le client, les commits ou les captures. `.env*` dans `.gitignore`, `.env.example` sans valeurs. `gitleaks` en pre-commit + CI.
- Les clés `service_role`, paiement, signatures : **serveur uniquement** (`import 'server-only'`). Seules `NEXT_PUBLIC_*` non sensibles côté client.
- Validation Zod de l'environnement au démarrage ; rotation documentée ; secrets distincts par environnement (dev/preview/prod).

## 2. Authentification & sessions
- Supabase Auth : mots de passe ≥ 12 car. (vérif mots de passe compromis si dispo), hash géré par le fournisseur, vérification email obligatoire avant achat de licence, **2FA TOTP obligatoire** pour rôles support/admin/super-admin.
- Cookies de session `HttpOnly; Secure; SameSite=Lax`, expiration/rotation, déconnexion globale, liste des sessions.
- Protection brute-force : rate limit login/reset/OTP (par IP **et** par compte), délais progressifs, messages génériques (pas d'énumération de comptes).
- Reset password : jeton à usage unique, expiration courte, invalidation des sessions.

## 3. Contrôle d'accès (le point n°1)
- **Toute** Server Action / Route Handler vérifie : authentification → rôle → **propriété de la ressource** (anti-IDOR). Jamais de contrôle uniquement côté UI ou middleware.
- `proxy.ts` ne remplace PAS les vérifications dans chaque handler (défense en profondeur).
- RLS PostgreSQL sur toutes les tables (voir 05) ; tests automatisés d'accès croisés entre utilisateurs.
- Principe du moindre privilège : le client Supabase côté navigateur n'a que des droits de lecture publics ; écritures sensibles via serveur + service role dans des fonctions ciblées.
- Empêcher l'escalade de rôle/mass-assignment : schémas Zod en liste blanche de champs ; `role`, `is_blocked`, prix, statut jamais acceptés depuis le client.

## 4. Validation & injection
- Validation **côté serveur** de toute entrée (Zod strict, tailles max, types, énumérations). Requêtes paramétrées uniquement (jamais de SQL concaténé).
- Sortie encodée par React ; interdiction de `dangerouslySetInnerHTML` sauf contenu Markdown **assaini** (rehype-sanitize, liste blanche) ; liens externes `rel="noopener noreferrer"`.
- Anti-SSRF : toute URL fournie (démos, médias) validée (https, domaine en liste blanche, pas d'IP privées/localhost/metadata) ; pas de fetch serveur d'URL arbitraire.
- Redirections : uniquement vers chemins internes/ liste blanche (anti open redirect).
- Uploads : types MIME **et** signature binaire vérifiés, taille max, renommage aléatoire, stockage hors webroot, antivirus, jamais d'exécution, extensions dangereuses refusées pour pièces jointes publiques.

## 5. En-têtes & navigateur
Dans `proxy.ts`/`next.config.ts` : **CSP stricte avec nonce** (`default-src 'self'`; `script-src 'self' 'nonce-…' 'strict-dynamic'`; `frame-src` = origines de démos + fournisseurs de paiement; `connect-src` = Supabase, Sentry, Upstash si besoin; `img-src` avec Supabase/CDN; `object-src 'none'`; `base-uri 'self'`; `frame-ancestors 'none'` sur le site; `form-action 'self'` + fournisseurs), `Strict-Transport-Security` (preload), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal, COOP/CORP adaptés. CORS fermé par défaut (liste blanche). Cookies consent respecté pour analytics.
- **CSRF** : Server Actions Next (origine vérifiée) + jeton/en-tête pour les routes API mutantes ; `SameSite` ; vérification `Origin/Host`.

## 6. Paiement & commandes (anti-fraude)
- Prix/stock/licence **toujours recalculés serveur** ; snapshot figé dans `order_items`.
- Webhooks : **signature vérifiée** (comparaison à temps constant), horodatage anti-rejeu, table `webhook_events` unique pour **idempotence**, revérification du statut auprès du fournisseur, comparaison montant/devise/référence, traitement dans une **transaction**, ordre et doublons tolérés.
- Jamais de confiance au paramètre de retour d'URL ni aux données client.
- Aucune donnée de carte stockée (PCI SAQ-A via redirection/hosted).
- Surveillance : alertes sur échecs de webhook, écarts de montant, pics de commandes.

## 7. Fichiers payants & démos
- Bucket privé, URL signées courtes, quotas, journaux, vérification de licence active ; pas de chemins devinables ; pas de listing de bucket.
- Démos isolées sur domaine séparé (09), iframe `sandbox`, comptes démo en lecture seule.
- Pas de code source complet ni secrets dans les démos.

## 8. Rate limiting & anti-abus
Upstash Ratelimit (sliding window) sur : login, signup, reset, création commande, vérification licence, recherche, formulaire contact/sur mesure, téléchargement, avis, newsletter. Captcha invisible (Cloudflare Turnstile) sur formulaires publics et signup. Honeypot + délai minimal. Taille de body limitée. Pagination bornée (`limit ≤ 50`).

## 9. Données personnelles (RGPD/loi locale)
Minimisation, finalités claires, consentement cookies granulaire, export & suppression de compte, anonymisation IP (hash salé), durées de conservation, registre des traitements, DPA sous-traitants (Supabase, Vercel, Resend, Sentry), logs sans données sensibles (masquer emails/tokens), chiffrement au repos (fournisseur) + champs sensibles (identifiants démo) chiffrés applicativement (AES-256-GCM, clé en secret).

## 10. Dépendances & chaîne d'approvisionnement
Lockfile commité, versions figées, `npm audit`/OSV en CI (échec sur High/Critical), Renovate/Dependabot, CodeQL, vérification manuelle des **nouvelles versions de Next.js/React** (avis de sécurité RSC publiés en 2025–2026 : toujours utiliser une version patchée), pas de paquets inconnus/typosquattés, `npm ci` en CI, scripts post-install revus, SRI sur scripts tiers (éviter les scripts tiers).

## 11. Journalisation, audit & réponse aux incidents
`audit_logs` append-only (qui/quoi/quand/IP hashée) pour actions admin, remboursements, changements de rôles, accès fichiers. Logs structurés sans PII. Sentry (scrub des données). Runbook incident : détecter → contenir (révoquer clés, bloquer comptes) → analyser → corriger → notifier. Sauvegardes quotidiennes + **test de restauration** trimestriel (PITR Supabase).

## 12. Environnements & déploiement
Preview protégées (auth Vercel), séparation prod/dev (projets Supabase distincts), protection de branche `main` (PR + CI verte + revue), migrations appliquées par CI, aucune donnée de prod en dev, headers vérifiés (securityheaders/Mozilla Observatory ≥ A+ visé).

## 13. Checklist de revue sécurité (à cocher par PR/phase)
- [ ] Aucun secret/PII dans code/logs · [ ] Zod sur chaque entrée · [ ] Auth+rôle+propriété vérifiés serveur · [ ] RLS + test IDOR
- [ ] Rate limit sur endpoints sensibles · [ ] Webhook signé, idempotent, montant vérifié · [ ] CSP/headers OK · [ ] Uploads validés
- [ ] URLs externes en liste blanche · [ ] Dépendances auditées · [ ] Erreurs sans fuite d'info (pas de stack trace client) · [ ] Audit log des actions sensibles
