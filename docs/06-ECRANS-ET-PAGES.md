# 🖥️ ÉCRANS & PAGES — Liste exhaustive

Pour CHAQUE écran : états **chargement (skeleton), vide, erreur, succès**, version mobile/tablette/desktop, SEO (title/description/OG), accessibilité (focus, ARIA, clavier), traduction FR/EN.

## A. SITE PUBLIC
### A1. Accueil `/`
1. **Header** sticky translucide : logo, nav (Boutique, Catégories ▾ méga-menu, Sur mesure, Blog, Aide), recherche (⌘K), sélecteur langue/devise, panier (badge animé), compte. Mobile : burger → panneau plein écran animé + barre d'onglets basse optionnelle.
2. **Hero 3D** : titre accroche fort, sous-titre, 2 CTA (« Explorer la boutique », « Demander un projet »), scène 3D (appareils flottants smartphone/laptop/fenêtre desktop avec captures de produits, parallaxe souris/gyroscope), fond dégradé animé. Fallback image sur mobile faible/WebGL off.
3. Bandeau de confiance (nb produits, clients, téléchargements, note moyenne) avec compteurs animés.
4. Catégories (cartes 3D tilt) : Sites web, Apps web/SaaS, Apps mobiles, Android natif, Desktop/OS, Templates, Scripts/Plugins, UI kits.
5. **Produits à la une** (carrousel/bento grid) avec aperçu hover (mini-vidéo) et boutons « Démo » / « Commander ».
6. Nouveautés + Best-sellers (onglets).
7. « Comment ça marche » en 4 étapes animées au scroll (Choisir → Tester la démo → Commander → Télécharger/Installer).
8. Collections éditoriales.
9. Bloc **Sur mesure** (CTA devis).
10. Avantages (licence claire, mises à jour, support, paiement local Mobile Money, livraison instantanée).
11. Avis clients (marquee/slider).
12. FAQ (accordéon) + CTA final + newsletter.
13. **Footer** : liens, légal, réseaux, moyens de paiement, langue, mentions.

### A2. Boutique `/boutique` (+ `/categorie/[slug]`, `/techno/[slug]`, `/secteur/[slug]`)
Barre de recherche, filtres (panneau latéral desktop / tiroir bas mobile), puces de filtres actifs, tri, grille/liste, cartes produit (image 16:10, badge type, titre, résumé 2 lignes, note, ventes, prix/promo, boutons Démo & Commander, favoris), pagination/infinite scroll, compteur de résultats, état « aucun résultat » avec suggestions, bandeau SEO en bas de catégorie.

### A3. Fiche produit `/produit/[slug]`
Fil d'Ariane · Galerie/zone démo (09) · Bloc achat sticky (prix, choix licence, add-ons, coupon, boutons **Voir la démo** / **Commander** / Ajouter au panier, garanties, mises à jour, support) · Onglets : Description, Fonctionnalités, Captures, Technique & prérequis, Changelog, Avis, FAQ · Produits similaires · Barre d'achat sticky mobile (prix + Commander) · Données structurées JSON-LD `Product`.

### A4. Plein écran démo `/demo/[slug]`
Iframe plein écran sandboxée, sélecteur d'appareil (desktop/tablette/mobile), bascule de démos (front / admin), identifiants démo copiables, bouton « Commander », fermer. Bandeau : « Aperçu — certaines fonctions sont désactivées ».

### A5. Panier `/panier` — lignes, licence modifiable, add-ons, coupon, récap, upsell, CTA checkout, panier vide animé.
### A6. Checkout `/commande` — étapes : 1 Contact · 2 Facturation · 3 Paiement (Mobile Money / carte) · 4 Récap & CGV. Mobile : accordéon. Résumé commande sticky. Indicateurs de confiance.
### A7. Statut paiement `/commande/[id]/statut` — attente (polling), succès (confettis légers), échec (réessayer / autre moyen), expiré.
### A8. Confirmation `/commande/[id]/merci` — récapitulatif, licences, boutons téléchargement, facture, prochaines étapes (guide d'installation).
### A9. Sur mesure `/sur-mesure` — présentation du service, processus, formulaire multi-étapes, upload sécurisé, confirmation.
### A10. Blog `/blog`, `/blog/[slug]` · A11. Centre d'aide `/aide` (FAQ, recherche, articles, contact) · A12. Contact `/contact`.
### A13. Pages CMS : À propos, Licences, CGV, Confidentialité, Cookies, Remboursement, Mentions légales, Support.
### A14. Collections `/collections/[slug]` · Bundles `/packs/[slug]`.
### A15. 404, 500, maintenance, offline (PWA optionnelle), page « produit archivé » (redirection suggestions).
### A16. Vérificateur de licence public `/licence/verifier` (saisie clé → statut, produit, date).

## B. AUTHENTIFICATION `/auth/*`
Connexion (email+mot de passe, lien magique, Google/GitHub optionnels), inscription (force du mot de passe, consentement), mot de passe oublié, réinitialisation, vérification email, 2FA TOTP (activation/saisie/codes de secours), session expirée, déconnexion partout.

## C. ESPACE CLIENT `/compte/*`
Tableau de bord · Mes commandes (liste/détail/facture PDF) · Mes téléchargements (par produit/version, empreinte SHA-256, quota restant) · Mes licences (clé, domaines, activer/désactiver domaine, certificat PDF) · Mises à jour disponibles · Favoris · Mes avis (écrire/modifier) · Mes demandes sur mesure (suivi + messagerie) · Support (tickets) · Profil · Sécurité (mot de passe, 2FA, sessions) · Préférences & notifications · Données personnelles (export/suppression).

## D. BACK-OFFICE `/admin/*` (protégé, rôle requis, 2FA obligatoire pour admin)
1. **Dashboard** : KPI (CA jour/mois, commandes, panier moyen, conversion, remboursements), courbes, top produits, derniers événements, alertes (webhook en échec, stock de licences…).
2. **Produits** : liste (filtres/recherche/actions en masse) · **Wizard création/édition (6 étapes)** : Infos → Médias → Démos → Licences & prix → Fichiers & versions → SEO & publication (aperçu, validation, publier/programmer). Duplication, archivage, historique.
3. **Versions & fichiers** : upload (multipart, antivirus/validation type et taille), SHA-256 auto, notes de version, notification d'update aux acheteurs.
4. **Démos** : gestion des liens/vidéos/captures/mockups, test de la démo (check d'URL, en-têtes frame), identifiants chiffrés.
5. **Catégories, tags, collections, bundles**.
6. **Commandes** : liste/filtres, détail (timeline, paiement, journal webhook), actions : renvoyer licence/email, marquer manuelle, rembourser (partiel/total), révoquer licence.
7. **Paiements** : transactions, rapprochement, webhooks reçus/rejoués, configuration des fournisseurs actifs.
8. **Clients** : fiche, historique, blocage, notes internes. 9. **Licences** : recherche, révocation, réémission, activations.
10. **Coupons**, 11. **Avis** (modération), 12. **Sur mesure** (kanban : Nouveau → Qualifié → Devis → Accepté → En cours → Livré), 13. **Tickets**.
14. **CMS** : pages, blog (éditeur Markdown/MDX), FAQ, bannières, menus. 15. **Emails** : modèles, tests d'envoi, journaux.
16. **Analytics** : trafic, entonnoir (vue produit → démo → panier → paiement), sources, pays.
17. **Paramètres** : marque, devises & taux, taxes, moyens de paiement, quotas de téléchargement, SEO, légal, intégrations.
18. **Utilisateurs & rôles** (super-admin), 19. **Journal d'audit**, 20. **Santé système** (jobs, file d'emails, erreurs récentes).

## E. COMPOSANTS TRANSVERSES
Command palette ⌘K · Toasts · Modales/tiroirs accessibles · Cookie banner (consentement granulaire) · Sélecteur langue/devise · Bandeau d'annonce · Notifications in-app · Skeletons · Empty states illustrés · Pages d'erreur contextualisées · Bouton retour haut · Mode clair/sombre.

## F. PARCOURS CRITIQUES À TESTER EN E2E
1. Visiteur → recherche → fiche → démo → Commander → paiement (sandbox) → livraison → téléchargement.
2. Invité qui crée un compte après achat (rattachement des commandes par email vérifié).
3. Paiement échoué → réessai → succès. 4. Coupon valide/invalide/expiré. 5. Remboursement admin → licence révoquée.
6. Demande sur mesure → devis → acompte. 7. Accès interdit à la commande d'un autre utilisateur (IDOR) → 404/403.
