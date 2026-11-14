# 🎨 DESIGN SYSTEM, UI & UX

## 1. Direction artistique
Premium tech, « sombre élégant par défaut + clair soigné ». Profondeur (verre dépoli, lumières diffuses, grain subtil), 3D discrète mais mémorable, micro-interactions précises. Éviter l'aspect « template générique » : choisir une identité distinctive (typographie à caractère, accent de couleur marqué, formes cohérentes).

## 2. Tokens (variables CSS Tailwind 4 `@theme`)
- **Couleurs** (sémantiques, jamais de hex en dur dans les composants) : `--bg`, `--surface`, `--surface-2`, `--border`, `--text`, `--text-muted`, `--accent` (couleur signature, ex. vert-émeraude/indigo électrique), `--accent-2`, `--success`, `--warning`, `--danger`, `--info`. Deux palettes (dark/light) + contraste AA vérifié (≥ 4,5:1 texte, 3:1 UI).
- **Typo** : titres = police display expressive (ex. Space Grotesk / Sora / Clash Display), texte = Inter ou Geist, code = JetBrains Mono. `next/font` (auto-hébergées, `display: swap`, subset latin + latin-ext). Échelle fluide `clamp()` : 12/14/16/18/20/24/30/36/48/64/80.
- **Espacement** base 4 px. **Rayons** : 8/12/16/24/pill. **Ombres** et **glows** à 3 niveaux. **Z-index** : échelle documentée. **Breakpoints** : 360 · 480 · 640 · 768 · 1024 · 1280 · 1536 · 1920.
- **Mouvement** : durées 120/200/320/600 ms ; courbes `cubic-bezier(.2,.8,.2,1)` (sortie) et spring (Motion). Tout désactivé/atténué si `prefers-reduced-motion`.

## 3. Composants (documentés dans une page `/admin/ui-kit` ou Storybook)
Button (primary/secondary/ghost/danger, loading), Input/Textarea/Select/Combobox/Checkbox/Radio/Switch/Slider, Badge, Card produit (3 variantes), Tabs, Accordion, Dialog/Drawer/Sheet, Tooltip/Popover, Toast, Table (tri, filtres, pagination), Stepper, Rating, PriceTag (promo barrée), DeviceFrame, ProductGallery, CodeBlock, Breadcrumb, Pagination, Skeleton, EmptyState, Avatar, Progress, FileUploader, DatePicker, Command palette, Navbar/MegaMenu/Footer.

## 4. Principes UX (appliqués partout)
- **Hiérarchie claire** : un CTA primaire par écran ; « Commander » toujours visible sur fiche produit (sticky).
- **Réduire la friction** : checkout court, invité autorisé, autoremplissage, Mobile Money en premier pour utilisateurs du Bénin (détection pays), indicateur de progression.
- **Preuve sociale & confiance** : notes, nb de ventes, dernière MAJ, badges sécurité, garanties, logos paiement.
- **Feedback immédiat** : états de chargement optimistes, toasts, skeletons de même forme que le contenu (zéro saut de mise en page).
- **Lois UX** : Fitts (cibles ≥ 44×44 px, CTA dans la zone du pouce mobile), Hick (filtres progressifs), Miller (groupes de 5–7), Jakob (patterns e-commerce familiers), Von Restorff (CTA accentué), effet de position série.
- **Formulaires** : labels visibles, erreurs inline claires, validation à la saisie après premier blur, `autocomplete` corrects, `inputmode` (tel, email, numeric).
- **Navigation** : fil d'Ariane, retour conservant filtres/scroll, liens d'évitement (« Aller au contenu »).

## 5. Responsive (mobile-first, tous écrans)
| Largeur | Grille | Spécificités |
|---------|--------|--------------|
| 360–479 | 1 col (2 pour mini-cartes) | Tiroirs bas pour filtres, CTA sticky, 3D simplifiée/statique |
| 480–767 | 1–2 col | Cartes plus larges |
| 768–1023 | 2–3 col | Nav compacte, sidebars repliables |
| 1024–1279 | 3–4 col | Filtres latéraux |
| 1280–1919 | 4 col, conteneur max 1280–1440 | Mega-menu, hover riches |
| ≥1920 / ultrawide | conteneur centré, marges généreuses | Pas d'étirement excessif des lignes de texte (≤ 75 car.) |
- Unités fluides (`clamp`, `rem`, `dvh`), `container queries` pour les cartes, images responsives `next/image` (`sizes` corrects, AVIF/WebP), safe-areas iOS, orientation paysage gérée, zoom 200 % sans perte, aucun scroll horizontal, dimensions réservées (CLS 0).
- Tester : iPhone SE, iPhone 15 Pro Max, Android 360×800, iPad, laptop 1366, desktop 1920, ultrawide 2560.

## 6. Accessibilité (WCAG 2.2 AA)
Navigation clavier complète, focus visible fort, ordre logique, rôles/ARIA corrects (Radix), alternatives textuelles, sous-titres vidéo, contrastes, pas d'info par la couleur seule, annonces `aria-live` (panier, erreurs), cibles ≥ 24 px minimum (44 visé), animations évitables, `lang` dynamique, tests axe en CI + audit manuel lecteur d'écran.

## 7. Modes & états
Dark/light/système (sans flash au chargement), états `hover/focus/active/disabled/loading/error`, états vides illustrés, pages d'erreur utiles (« que faire maintenant »).

## 8. Contenu & ton
Français clair, chaleureux, professionnel ; microcopie rassurante (« Vous recevez vos fichiers immédiatement après le paiement »), messages d'erreur utiles, pas de jargon inutile ; formats : monnaie `1 500 000 FCFA`, dates locales.
