# 🔁 PROMPTS DE RELANCE PAR PHASE

À coller dans Antigravity à chaque étape. Remplacer `[N]` par le numéro de phase.

## Prompt standard de démarrage de phase
```
Relis docs/01-PROMPT-MAITRE.md, docs/11-SECURITE.md et les documents concernés par la PHASE [N] du fichier docs/15-PLAN-DE-LIVRAISON.md.
1) Annonce ton plan détaillé pour cette phase (fichiers, tables, écrans, tests, risques).
2) Implémente par petits commits (Conventional Commits).
3) Écris les tests.
4) Lance lint, typecheck, tests, build, audit de dépendances.
5) Vérifie visuellement aux largeurs 360, 768, 1024, 1440, 1920.
6) Déroule la checklist de la phase et le §13 de 11-SECURITE.md.
7) Rends un rapport : fait / non fait / risques / décisions / prochaines étapes. Puis STOP et attends ma validation.
Ne simule aucune fonctionnalité : si une clé ou un compte manque, isole un mode sandbox et note-le dans docs/TODO-PROPRIETAIRE.md.
```

## Prompt de correction (après revue)
```
Voici les problèmes constatés : [liste]. Pour chacun : reproduis, trouve la cause racine, corrige, ajoute un test de non-régression, mets à jour CHANGELOG. Ne modifie rien d'autre. Relance toute la suite de tests.
```

## Prompt d'audit sécurité (fin de phase 5, 6, 7 et 10)
```
Agis comme un pentester. Audite le code et l'app selon docs/11-SECURITE.md : IDOR sur commandes/licences/téléchargements, escalade de rôle, mass-assignment, webhooks forgés/rejoués/montant altéré, CSRF, XSS (Markdown), SSRF (URLs de démo), upload malveillant, énumération de comptes, brute force, fuite de secrets (git history + bundle client), CSP, RLS. Fournis un rapport par gravité avec preuves de reproduction, puis corrige tout High/Critical et ajoute des tests.
```

## Prompt performance
```
Mesure Lighthouse mobile et desktop sur accueil, boutique, fiche produit, checkout. Analyse le bundle (analyzer). Corrige jusqu'à atteindre les budgets du fichier 12 (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1, JS initial home ≤ 170 Ko gzip). Vérifie que la 3D est lazy, dégrade correctement et que reduced-motion est respecté. Donne les mesures avant/après.
```

## Prompt d'accessibilité & responsive
```
Teste toutes les pages publiques et le checkout au clavier uniquement, avec axe-core et un lecteur d'écran. Vérifie WCAG 2.2 AA, contrastes, focus, aria-live, zoom 200 %, absence de scroll horizontal et cibles tactiles aux 7 tailles de référence (iPhone SE, 15 Pro Max, Android 360×800, iPad, 1366, 1920, 2560). Corrige tout écart.
```

## Prompts ciblés utiles
- **Hero 3D** : « Implémente le hero 3D du fichier 08 avec fallback, PerformanceMonitor, reduced-motion, et prouve que le LCP reste ≤ 2,5 s. »
- **Paiement** : « Implémente l'adapter [fedapay|kkiapay|moneroo|stripe] selon docs/10, avec mode sandbox, vérification de signature, idempotence, tests de rejeu et montant altéré. »
- **Produit** : « Ajoute le produit [nom] avec ses licences, versions, fichiers privés, démo live sandboxée, vidéo et captures, via l'admin (pas en SQL direct). »
- **Mise en production** : « Déroule la checklist docs/14 §5 point par point, prouve chaque point, signale ce qui dépend de moi. »
