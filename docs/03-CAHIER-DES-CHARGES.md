# 📋 CAHIER DES CHARGES FONCTIONNEL

## 1. Rôles
| Rôle | Droits |
|------|--------|
| Visiteur | Parcourir, rechercher, voir démos, panier invité, commander (guest checkout), contact |
| Client | + compte, historique, téléchargements, licences, factures, avis, favoris, tickets, wishlist |
| Support | Tickets, remboursements (selon permission), lecture commandes |
| Éditeur contenu | Produits (brouillons), CMS, blog |
| Admin | Tout sauf paramètres critiques |
| Super-admin | Tout + rôles, paiements, clés, sécurité, exports |
| (Phase 2) Vendeur | Soumet ses produits, voit ses ventes, retraits |

## 2. Catalogue
- Types de produit : `website`, `web_app`, `saas`, `mobile_app`, `android_native`, `desktop_app`, `template`, `script_plugin`, `ui_kit`, `bot`, `bundle`, `service`.
- Catégories hiérarchiques + tags techno (React, Next.js, Laravel, Flutter, Kotlin, Swift, Electron, Tauri, WordPress, Python…) + secteurs (e-commerce, école, santé, restauration, immobilier, fintech, ONG…).
- Attributs produit : titre, slug, résumé, description riche (Markdown), type, catégories, tags, stack, plateformes, prix (devise de base XOF), prix promo + période, licences et variantes, niveau (débutant/avancé), langues supportées, version actuelle, date mise à jour, changelog, prérequis, inclus/non inclus, documentation, vidéo, galerie, démo(s), fichiers livrables, SEO, statut (brouillon/relu/publié/archivé), mis en avant, nouveau, best-seller.
- Prix multi-devises : base XOF, affichage EUR/USD/XOF via taux mis à jour (job quotidien) ; le paiement se fait dans une devise supportée par le fournisseur.

## 3. Recherche & découverte
- Recherche plein texte tolérante aux fautes (Postgres FTS + pg_trgm), suggestions en direct (command palette ⌘K), filtres combinables (type, techno, secteur, prix, note, licence, nouveautés, avec démo), tri (pertinence, populaires, récents, prix, note), pagination/scroll infini accessible, URL partageable des filtres.
- Collections éditoriales (« Pour lancer un e-commerce », « Apps école »…), produits similaires, « souvent achetés ensemble », récemment consultés.

## 4. Fiche produit (cœur du site)
- Hero : titre, note, ventes, version, dernière MAJ, prix, **boutons « Voir la démo » et « Commander »**, badges (code source inclus, responsive, doc, support).
- Zone démo (voir 09) : onglets Démo live / Vidéo / Captures / Mobile 3D / Admin demo.
- Sections : description, fonctionnalités, ce qui est inclus, stack technique, captures par écran, prérequis & installation, changelog, FAQ produit, licences (tableau comparatif), avis vérifiés, produits liés, CTA sticky mobile.
- Options : service d'installation, hébergement/déploiement assisté, personnalisation (ajout au panier comme add-on).

## 5. Panier & commande
- Panier persistant (local invité + fusion à la connexion), codes promo, bundles, upsell licence étendue, add-ons.
- Checkout : email (guest ou compte), pays, coordonnées de facturation (optionnelles selon cas), choix du moyen de paiement, récapitulatif, acceptation CGV + licence, bouton payer.
- Statuts commande : `pending → awaiting_payment → paid → fulfilled` ; `failed`, `cancelled`, `refunded`, `partially_refunded`, `disputed`.
- Après paiement : page de confirmation, email, facture PDF, licence(s) générée(s), accès téléchargement.

## 6. Livraison & licences
- Fichiers livrables privés (zip, apk, aab, exe, dmg, appimage, liens dépôts privés, docs PDF).
- Téléchargement via URL signée courte, limite (ex. 10 téléchargements / 30 jours, configurable), journal d'accès, empreinte SHA-256 affichée.
- Clé de licence unique (format lisible), activation par domaine (option), API de vérification, révocation en cas de remboursement/fraude.
- Mises à jour : notification email à chaque nouvelle version pour les acheteurs ; période de mises à jour configurable (à vie ou 12 mois) ; support inclus X mois.
- Option livraison manuelle (ex. dépôt GitHub privé : invitation) suivie par l'admin.

## 7. Compte client
Tableau de bord, commandes, téléchargements, licences (copier, vérifier), factures, mises à jour disponibles, favoris, avis, tickets, profil, sécurité (changer mot de passe, 2FA TOTP, sessions actives), préférences, suppression/export des données (RGPD).

## 8. Avis & confiance
Avis uniquement par acheteurs vérifiés, modération, réponse du vendeur, signalement ; preuves : nombre de ventes, dates MAJ, garantie remboursement encadrée (ex. 7 jours si produit non conforme/défaut non corrigé — à valider juridiquement).

## 9. Sur mesure
Formulaire « Demander un projet » (type, budget, délai, description, pièces jointes sécurisées), suivi de la demande, messagerie, devis PDF, acompte via paiement, statut.

## 10. Support & communication
Centre d'aide (FAQ, docs), tickets avec pièces jointes, chat WhatsApp (lien), emails transactionnels, newsletter (double opt-in), notifications in-app.

## 11. Admin (modules)
Dashboard KPI (revenu, commandes, conversion, visiteurs, top produits, remboursements) · Produits (wizard 6 étapes, versions, démos, fichiers) · Commandes & paiements (détail, journal webhook, remboursement, renvoi licence) · Clients · Licences · Coupons · Avis · Sur mesure · Tickets · CMS (pages, blog, FAQ, bannières) · Paramètres (marque, devises, taxes, paiements, emails, SEO, légal) · Utilisateurs & rôles · **Journal d'audit** · Santé système · Export CSV.

## 12. Marketing & croissance
Programme d'affiliation (phase 2), codes promo, ventes flash avec compte à rebours, parrainage, bundles, pop-up de sortie légère (non intrusive), SEO programmatique (pages techno/secteur), blog, partage social avec images OG dynamiques.

## 13. Exigences non fonctionnelles
Responsive total · accessibilité WCAG 2.2 AA · i18n FR/EN (RTL prêt) · disponibilité 99,9 % visée · LCP < 2,5 s, INP < 200 ms, CLS < 0,1 · RGPD/protection des données · sauvegardes · observabilité.

## 14. Hors périmètre phase 1
Marketplace multi-vendeurs complet (schéma prêt), application mobile native de la boutique, abonnements récurrents de produits (schéma prêt).
