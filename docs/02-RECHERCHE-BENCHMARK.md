# 🔎 RECHERCHE & BENCHMARK — Sites similaires et enseignements

> Synthèse issue de recherches web (nov. 2026) + bonnes pratiques de l'expert. Les chiffres de frais/plafonds sont indicatifs : à confirmer auprès des fournisseurs.

## 1. Sites de référence analysés
| Site | Modèle | Ce qu'on retient |
|------|--------|------------------|
| **CodeCanyon / ThemeForest (Envato)** | Marketplace multi-vendeurs, licences Regular/Extended, 1 licence = 1 produit final | Bouton **Live Preview** très visible ; licences claires ; vérification par code d'achat ; mise en avant des mises à jour récentes |
| **Sites d'auteurs (ex. éditeurs de scripts Laravel)** | Vente directe + lien Envato | Chaque produit a un **lien démo en ligne**, doc en ligne, support, mention « 1 licence par domaine », mises à jour à vie |
| **Marketplaces de scripts (type Digimart/Botble)** | Produits gratuits ou payants, vérification de licence | Publication produit avec versions, métadonnées, paramètres de licence |
| **Gumroad / Lemon Squeezy** | Vente de produits numériques | Checkout ultra-court, livraison immédiate par email + page de téléchargement, clés de licence |
| **Creative Tim, Tailwind UI, Flippa, Codester** | Templates/kits/projets/sites | Pages catégories riches, filtres par techno, comparatifs, bundles, « tout-accès » |

## 2. Données d'étude utiles (source : Envato, étude clients sur pages produit)
- Environ la moitié des clients arrivent directement sur une **page produit**.
- Environ 20 % la quittent immédiatement ; jusqu'à 50 % la quittent après lecture sans acheter.
- Le **live preview** est l'un des éléments les plus importants : certains clients n'achètent pas sans démo à essayer.
- Montrer que le produit est **mis à jour régulièrement** rassure ; **réduire l'encombrement** de la page améliore la conversion.
⇒ Décisions : démo en premier plan, date/version de dernière mise à jour visible, page produit épurée avec hiérarchie claire.

## 3. Modèle de licence retenu
- Standard : 1 projet final / 1 domaine, usage client non revendable.
- Étendue : usage commercial dans produit revendu (SaaS payant), plusieurs projets selon règles.
- Variante « Sources » vs « Compilé » (ex. APK seul vs code complet).
- Chaque achat génère une **clé de licence** (vérifiable par API) + **certificat PDF**.

## 4. Marché et paiement (Bénin / Afrique de l'Ouest)
- Agrégateurs locaux : **KKiaPay** (MTN MoMo, Moov Money, Celtiis Cash, cartes Visa/Mastercard), **FedaPay** (MTN, Moov, cartes ; bonne gestion API/webhooks, paiements récurrents), **CinetPay** (régional + cartes).
- Le Mobile Money domine les paiements e-commerce locaux ; cartes surtout diaspora/entreprises.
- Un seul contrat d'agrégateur couvre plusieurs opérateurs ; KYC de quelques jours à quelques semaines.
- Clients internationaux : prévoir **Stripe** (cartes) et éventuellement PayPal.
⇒ Décision : **couche d'abstraction de paiement** + routage par pays/moyen ; le propriétaire active les fournisseurs qu'il a ouverts (Moneroo/FedaPay/KKiaPay/Stripe).

## 5. Tendances techniques retenues
- Next.js 16 (App Router, Turbopack, Cache Components, `proxy.ts`), React 19.2, Tailwind 4, TypeScript.
- Combinaison courante pour sites immersifs : **GSAP + Lenis + Three.js (R3F)** avec dégradation gracieuse.
- ⚠️ **Sécurité** : des failles critiques RSC/Next.js ont été publiées en 2025–2026 → versions **patchées obligatoires**, audit à chaque mise à jour, surveillance des avis.

## 6. Avantages concurrentiels visés pour CodeLib
1. Démo **immersive** (mockup 3D d'appareil avec la démo dedans) plutôt qu'un simple lien.
2. Paiement **Mobile Money natif** (parcours local fluide) + cartes internationales.
3. **Livraison instantanée** + licence + mises à jour + support intégré.
4. **Sur mesure** : transformer un visiteur indécis en demande de devis.
5. Vitesse et accessibilité supérieures aux marketplaces classiques.
6. Fiabilité : preuves de confiance (garantie remboursement encadrée, avis vérifiés, changelog public).
