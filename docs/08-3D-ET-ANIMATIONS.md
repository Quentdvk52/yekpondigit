# 🌐 3D & ANIMATIONS

## 1. Philosophie
La 3D sert la conversion et la mémorabilité, **jamais au détriment de la vitesse ni de l'accessibilité**. Chaque effet a un fallback.

## 2. Où utiliser la 3D
| Zone | Effet | Budget |
|------|-------|--------|
| Hero accueil | Scène R3F : smartphone, laptop, fenêtre desktop flottants avec textures de captures produits, lumière douce, parallaxe curseur/gyroscope, particules légères | ≤ 1,5 Mo de modèles+textures compressés, 60 fps desktop / 30 fps mobile |
| Cartes catégories | Tilt 3D CSS (transform) au survol — **pas** de WebGL par carte | CSS only |
| Fiche produit | **DeviceFrame 3D** (téléphone/laptop) affichant la démo/vidéo/captures, rotation au drag | Chargé uniquement dans l'onglet « Mockup 3D » |
| Transitions de sections | Scroll-driven (GSAP ScrollTrigger) : pin, scrub, reveal | Léger |
| Page « Sur mesure » | Petite scène abstraite (formes géométriques interactives) | optionnel |

## 3. Règles techniques 3D
- Canvas unique par page (`frameloop="demand"` quand la scène est statique), `dpr={[1, 1.75]}`, `antialias` adaptatif, **PerformanceMonitor** (drei) pour dégrader dynamiquement (dpr↓, post-traitement off).
- Modèles **glTF/GLB** compressés (Draco/Meshopt), textures **KTX2/WebP**, ≤ 100k triangles totaux, instanciation pour répétitions, pas de lumières dynamiques multiples (baked/env map HDR légère).
- Chargement : `next/dynamic` + `ssr:false`, `Suspense` avec skeleton, déclenchement via IntersectionObserver ; préchargement uniquement du hero.
- **Détection capacités** : si `!WebGL`, `navigator.deviceMemory ≤ 2`, `hardwareConcurrency ≤ 4`, `saveData`, ou `prefers-reduced-motion` → fallback (image/vidéo légère WebP/AVIF + animation CSS).
- Nettoyage : dispose geometries/materials/textures au démontage, pause hors écran (`visibilitychange`, IntersectionObserver).
- Accessibilité : canvas `aria-hidden`, contenu essentiel présent en HTML ; contrôle « Désactiver les animations 3D » dans le footer/paramètres (persisté).

## 4. Animations d'interface
- **Motion (Framer Motion)** : entrées/sorties de composants, layout animations (filtres, panier), shared layout (carte → fiche), gestes (drag carousel), `AnimatePresence`.
- **GSAP + ScrollTrigger** : séquences de scroll complexes (comment ça marche, compteurs, parallaxes). Enregistrer les plugins une fois, `useGSAP` pour cleanup, `ScrollTrigger.refresh` après chargement images, `matchMedia` pour variantes mobile/desktop.
- **Lenis** : smooth scroll **uniquement desktop/pointer fine**, désactivé si reduced-motion, compatible ancres/focus/anchors, synchronisé avec ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`), arrêt pendant modales.
- **Micro-interactions** : bouton magnétique (desktop), ripple discret, animation du panier (« vol » du produit vers l'icône), compteurs, skeleton shimmer, hover cartes (élévation + lueur suivant le curseur), toasts physiques.
- **Transitions de page** : View Transitions API (si dispo) ou fondu court Motion ; jamais bloquantes.
- Limiter à animer `transform` et `opacity` (GPU), `will-change` ponctuel, éviter animations de layout coûteuses, 60 fps vérifiés (Chrome Performance).

## 5. Budget & mesure
LCP < 2,5 s même avec hero 3D (le LCP doit être un élément HTML/texte/image rapide, pas le canvas) ; INP < 200 ms ; pas de long task > 50 ms causée par la 3D au chargement initial ; JS initial de la home ≤ 170 Ko gzip (hors chunk 3D lazy ≤ 250 Ko gzip). Lighthouse mobile ≥ 90 (perf), 100 (a11y/best practices), 95+ (SEO).

## 6. Assets
Créer/obtenir des modèles libres de droits (ou générés procéduralement : boîtes arrondies + textures) ; documenter licences dans `public/models/LICENSES.md`. Pipeline : `gltf-transform` pour optimiser (script npm `assets:optimize`).
