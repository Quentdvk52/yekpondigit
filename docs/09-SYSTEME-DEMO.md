# 👁️ SYSTÈME D'APERÇU DÉMO

Objectif : permettre à tout visiteur de **voir et tester** le produit avant achat, **sans risque pour la sécurité** du site ni des produits.

## 1. Types de démo (`demo_kind`)
| Type | Pour | Rendu |
|------|------|-------|
| `live_iframe` | Sites web, apps web/SaaS, templates, admin panels | Iframe vers l'instance de démo hébergée sur un **domaine séparé** |
| `video` | Tous (surtout apps natives, desktop) | Lecteur vidéo (MP4/WebM/HLS), sous-titres, vignette |
| `gallery` | Tous | Galerie captures annotées, zoom, lightbox |
| `mobile_mockup` | Apps mobiles | Cadre téléphone 3D/CSS qui affiche vidéo ou iframe responsive |
| `emulator` | Apps Android | Embed d'un service d'émulation navigateur tiers (option), sinon vidéo + captures |
| `credentials_only` | Back-offices | Affiche URL + identifiants démo (lecture seule, reset périodique) |

## 2. Isolation de sécurité (OBLIGATOIRE)
- Les démos sont hébergées sur un **autre site enregistrable** (ex. `codelib-demos.com`) ou sous-domaine dédié **sans cookies partagés** avec le site principal ; jamais sur le domaine de la boutique.
- Iframe : `sandbox="allow-scripts allow-forms allow-popups allow-same-origin"` UNIQUEMENT si la démo est sur origine distincte ; jamais `allow-top-navigation`; `referrerpolicy="no-referrer"`, `loading="lazy"`, `allow` minimal (pas de camera/micro/géoloc sauf démo qui l'exige explicitement).
- CSP du site principal : `frame-src` limité à la liste d'origines autorisées (table `demos.allowed_origin`). Les URLs de démo sont **validées** (https, domaine en liste blanche) à l'enregistrement en admin → anti-injection/redirect.
- Démos = instances **en lecture seule** avec données factices, **réinitialisées automatiquement** (cron), fonctions dangereuses désactivées (upload, emails, paiements réels), rate-limit côté démo.
- Identifiants démo chiffrés en base (`credentials_encrypted`), jamais exposés dans le HTML public ; affichés à la demande via action serveur (avec rate limit).
- Les démos **ne contiennent jamais** le code livrable complet ni de secrets ; code obfusqué/minifié si nécessaire ; filigrane « DEMO » discret.
- Détection de blocage d'embarquement (X-Frame-Options/CSP frame-ancestors de la démo) : vérification en admin, message de repli (ouvrir dans un nouvel onglet + vidéo).

## 3. Expérience utilisateur de la démo
- Onglets sur la fiche produit : **Démo live · Vidéo · Captures · Mobile · Admin demo**.
- Sélecteur d'appareil (iframe redimensionnée : 375 / 768 / 1280 / plein) avec cadre réaliste.
- Chargement lazy avec skeleton + bouton « Charger la démo » (économise bande passante, protège contre le tracking).
- Plein écran `/demo/[slug]`, bouton « Commander » persistant, timer facultatif de session.
- Mobile : ouverture en plein écran, geste pour quitter ; l'iframe ne capte pas le scroll de la page (bouton « Interagir »).
- Analytics : événements `demo_open`, `demo_device_change`, `demo_time` (anonymisés) pour mesurer la conversion.

## 4. Pipeline d'ajout d'une démo (admin)
1. Choisir type → 2. Saisir URL/uploader vidéo/captures → 3. Validation automatique (https, liste blanche, test d'embarquement, taille/format média, antivirus pour fichiers) → 4. Prévisualisation → 5. Publication.
Médias vidéo : transcodage/streaming via stockage + `<video>` (ou service vidéo) ; vignettes et sous-titres ; poster optimisé.

## 5. Hébergement des démos (guide)
Option A : projets Vercel dédiés par démo sous domaine séparé. Option B : un conteneur par démo (Fly.io/Railway) pour backends. Option C : build statique + données mock. Chaque démo : `robots noindex`, headers de sécurité, quotas.
