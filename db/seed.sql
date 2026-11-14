-- ==============================================================================
-- YEKPON DIGIT — Données Initiales et Démonstrations (db/seed.sql)
-- Produits marqués [DEMO] pour un nettoyage aisé via db/purge-demo.sql
-- ==============================================================================

BEGIN;

-- 1. Profils Utilisateurs (Mots de passe hachés via pgcrypto bcrypt)
-- Admin : admin@yekpondigit.com / YekponAdmin2026!
-- Client : demo.client@yekpondigit.com / ClientDemo2026!
-- Support : support@yekpondigit.com / SupportDemo2026!

INSERT INTO profiles (id, email, password_hash, full_name, phone, country, locale, role, is_blocked)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@yekpondigit.com', crypt('YekponAdmin2026!', gen_salt('bf', 12)), 'Super Administrateur YEKPON', '+22997000001', 'BJ', 'fr', 'super_admin', false),
  ('00000000-0000-0000-0000-000000000002', 'support@yekpondigit.com', crypt('SupportDemo2026!', gen_salt('bf', 12)), 'Agent Support Technique', '+22997000002', 'BJ', 'fr', 'support', false),
  ('00000000-0000-0000-0000-000000000003', 'demo.client@yekpondigit.com', crypt('ClientDemo2026!', gen_salt('bf', 12)), 'Koffi Mensah (Client Démo)', '+22997000003', 'BJ', 'fr', 'customer', false)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;

-- 2. Catégories Principales
INSERT INTO categories (id, name_fr, name_en, slug, icon, sort_order, is_active)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Sites Web Clés en Main', 'Turnkey Websites', 'sites-web', 'Globe', 1, true),
  ('10000000-0000-0000-0000-000000000002', 'Applications Web & SaaS', 'Web Apps & SaaS', 'saas-web', 'Layers', 2, true),
  ('10000000-0000-0000-0000-000000000003', 'Applications Mobiles & Android', 'Mobile & Android Apps', 'mobile-apps', 'Smartphone', 3, true),
  ('10000000-0000-0000-0000-000000000004', 'Logiciels Desktop & Systèmes', 'Desktop & System Apps', 'desktop-apps', 'Laptop', 4, true),
  ('10000000-0000-0000-0000-000000000005', 'Templates & Kits UI', 'Templates & UI Kits', 'templates-ui', 'Palette', 5, true),
  ('10000000-0000-0000-0000-000000000006', 'Scripts, Bots & Plugins', 'Scripts, Bots & Plugins', 'scripts-bots', 'Terminal', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. Tags Thématiques (Technologies, Secteurs, Fonctionnalités)
INSERT INTO tags (id, name, slug, kind)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Next.js 15', 'nextjs', 'tech'),
  ('20000000-0000-0000-0000-000000000002', 'React 19', 'react', 'tech'),
  ('20000000-0000-0000-0000-000000000003', 'TypeScript', 'typescript', 'tech'),
  ('20000000-0000-0000-0000-000000000004', 'Flutter', 'flutter', 'tech'),
  ('20000000-0000-0000-0000-000000000005', 'Kotlin Natif', 'kotlin', 'tech'),
  ('20000000-0000-0000-0000-000000000006', 'Python', 'python', 'tech'),
  ('20000000-0000-0000-0000-000000000007', 'Laravel 11', 'laravel', 'tech'),
  ('20000000-0000-0000-0000-000000000008', 'Tailwind CSS 4', 'tailwindcss', 'tech'),
  ('20000000-0000-0000-0000-000000000009', 'PostgreSQL / Neon', 'postgresql', 'tech'),
  ('20000000-0000-0000-0000-000000000010', 'Tauri Desktop', 'tauri', 'tech'),
  ('20000000-0000-0000-0000-000000000011', 'Mobile Money (Bénin & UEMOA)', 'mobile-money', 'feature'),
  ('20000000-0000-0000-0000-000000000012', 'Paiement Cartes Bancaires', 'carte-bancaire', 'feature'),
  ('20000000-0000-0000-0000-000000000013', 'E-Commerce & Vente en ligne', 'ecommerce', 'sector'),
  ('20000000-0000-0000-0000-000000000014', 'Éducation & Gestion Scolaire', 'education', 'sector'),
  ('20000000-0000-0000-0000-000000000015', 'Fintech & Microfinance', 'fintech', 'sector'),
  ('20000000-0000-0000-0000-000000000016', 'Santé & Cliniques', 'sante', 'sector'),
  ('20000000-0000-0000-0000-000000000017', 'Restauration & Hôtellerie', 'restauration', 'sector'),
  ('20000000-0000-0000-0000-000000000018', 'Intelligence Artificielle', 'ia-ml', 'feature'),
  ('20000000-0000-0000-0000-000000000019', 'Gestion de Stock & Caisse POS', 'pos-stock', 'feature'),
  ('20000000-0000-0000-0000-000000000020', 'Multi-tenant SaaS', 'saas-multi-tenant', 'feature')
ON CONFLICT (slug) DO NOTHING;

-- 4. 12 Produits DEMO Représentatifs
INSERT INTO products (
  id, vendor_id, type, slug, title_fr, title_en,
  summary_fr, summary_en, description_fr, description_en,
  status, base_price_xof, sale_price_xof, current_version,
  updates_months, support_months, requirements, includes, stack, platforms,
  rating_avg, rating_count, sales_count, is_featured, is_new, published_at
) VALUES
(
  '30000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'website',
  'demo-yekpon-store-ecommerce',
  '[DEMO] YekponStore — E-Commerce Multivendeur Clé en Main',
  '[DEMO] YekponStore — Turnkey Multi-Vendor E-Commerce',
  'Solution e-commerce ultra rapide avec intégration MTN MoMo, Moov Money et cartes bancaires.',
  'Blazing fast multi-vendor e-commerce with integrated African Mobile Money and credit cards.',
  '## Présentation de YekponStore\n\nPlateforme complète prête à l''emploi incluant boutique front-office réactive, dashboard vendeur et back-office administrateur complet.',
  '## About YekponStore\n\nComplete turnkey platform including responsive storefront, vendor dashboard, and full administration back-office.',
  'published', 150000, 125000, '1.2.0', 12, 6,
  '["Node.js 20+", "PostgreSQL 15+", "Compte FedaPay ou KKiaPay"]'::jsonb,
  '["Code source TypeScript complet", "Schéma PostgreSQL", "Documentation d''installation PDF", "Support 6 mois inclus"]'::jsonb,
  '["Next.js 15", "React 19", "Tailwind CSS 4", "PostgreSQL", "FedaPay SDK"]'::jsonb,
  ARRAY['web', 'responsive'],
  4.92, 28, 142, true, false, NOW()
),
(
  '30000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'saas',
  'demo-schooldesk-gestion-scolaire',
  '[DEMO] SchoolDesk — SaaS Gestion Scolaire & Universitaire',
  '[DEMO] SchoolDesk — School & University Management SaaS',
  'Gestion intégrale des inscriptions, notes, bulletins, emploi du temps et paiements de scolarité.',
  'Comprehensive SaaS for admissions, grading, report cards, timetables, and tuition fee collection.',
  '## Présentation de SchoolDesk\n\nSolution multi-établissements conçue pour les écoles primaires, collèges, lycées et universités.',
  '## About SchoolDesk\n\nMulti-tenant solution designed for schools, colleges, and university campuses.',
  'published', 350000, 290000, '2.0.1', 12, 12,
  '["Docker", "PostgreSQL 16", "Serveur VPS 4 Go RAM"]'::jsonb,
  '["Code source complet", "Migrations SQL", "Docker Compose", "Guide de déploiement"]'::jsonb,
  '["Next.js 15", "TypeScript", "PostgreSQL", "Radix UI", "KKiaPay"]'::jsonb,
  ARRAY['web', 'mobile-ready'],
  4.88, 34, 87, true, true, NOW()
),
(
  '30000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'mobile_app',
  'demo-agropay-mobile-finance',
  '[DEMO] AgroPay Mobile — App Flutter Microfinance & Collecte',
  '[DEMO] AgroPay Mobile — Flutter Microfinance App',
  'Application mobile pour agents collecteurs de tontines, coopératives agricoles et microfinance.',
  'Mobile app for agricultural cooperatives, tontine collectors, and rural microfinance institutions.',
  '## Présentation d''AgroPay Mobile\n\nFonctionne hors-ligne avec synchronisation automatique et impression de reçus Bluetooth.',
  '## About AgroPay Mobile\n\nWorks offline with automatic sync and Bluetooth receipt thermal printing.',
  'published', 220000, null, '1.1.0', 12, 6,
  '["Flutter 3.24+", "Android Studio", "Xcode (pour build iOS)"]'::jsonb,
  '["Code Flutter complet", "Backend API Node.js", "Maquettes Figma", "APK démo"]'::jsonb,
  '["Flutter", "Dart", "SQLite", "Node.js", "Express"]'::jsonb,
  ARRAY['android', 'ios'],
  4.95, 19, 63, true, false, NOW()
),
(
  '30000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'android_native',
  'demo-cinetix-android-streaming',
  '[DEMO] Cinetix Android — Streaming Vidéo & Billetterie Natif',
  '[DEMO] Cinetix Android — Native Video Streaming & Ticketing',
  'Application Android native haute performance en Kotlin avec lecteur ExoPlayer et DRM.',
  'High performance native Android app in Kotlin with ExoPlayer streaming and ticketing.',
  '## Présentation de Cinetix Android\n\nArchitecture MVVM propre, Jetpack Compose et gestion avancée du cache vidéo.',
  '## About Cinetix Android\n\nClean MVVM architecture, Jetpack Compose, and advanced video streaming caching.',
  'published', 180000, 150000, '1.0.4', 12, 6,
  '["Android Studio Hedgehog+", "JDK 17", "SDK Android 34"]'::jsonb,
  '["Projet Android Studio complet", "AAB/APK signés démo", "Documentation architecture"]'::jsonb,
  '["Kotlin", "Jetpack Compose", "ExoPlayer", "Coroutines", "Flow"]'::jsonb,
  ARRAY['android'],
  4.80, 15, 41, false, false, NOW()
),
(
  '30000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  'desktop_app',
  'demo-stockmaster-desktop-pos',
  '[DEMO] StockMaster Desktop — Gestion de Stock & Caisse Hors-Ligne',
  '[DEMO] StockMaster Desktop — Offline Inventory & POS Software',
  'Logiciel de caisse rapide et ultra léger pour boutiques, pharmacies et quincailleries.',
  'Fast and lightweight POS & inventory software for shops, pharmacies, and hardware stores.',
  '## Présentation de StockMaster Desktop\n\nConçu avec Tauri & Rust, il consomme moins de 50 Mo de RAM et fonctionne sans aucune connexion Internet.',
  '## About StockMaster Desktop\n\nBuilt with Tauri & Rust, consumes less than 50MB of RAM and runs completely offline.',
  'published', 175000, null, '1.3.0', 12, 6,
  '["Windows 10/11 ou Linux Ubuntu", "Imprimante thermique ESC/POS (optionnelle)"]'::jsonb,
  '["Installeur Windows .exe", "Package Linux .deb", "Code source Tauri / React"]'::jsonb,
  '["Tauri", "Rust", "React 19", "SQLite", "Tailwind CSS"]'::jsonb,
  ARRAY['windows', 'linux'],
  4.96, 22, 94, true, false, NOW()
),
(
  '30000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000001',
  'ui_kit',
  'demo-novaui-pro-design-system',
  '[DEMO] NovaUI Pro — Design System & Kit Composants Tailwind 4',
  '[DEMO] NovaUI Pro — Design System & Tailwind 4 UI Kit',
  'Plus de 120 composants React / Tailwind CSS 4 haut de gamme, accessibles et animés.',
  'Over 120 premium, accessible, and animated React / Tailwind CSS 4 components.',
  '## Présentation de NovaUI Pro\n\nBibliothèque prête à copier-coller avec variables CSS fluides et support complet du mode sombre.',
  '## About NovaUI Pro\n\nReady-to-use component library with fluid CSS variables and complete dark mode support.',
  'published', 45000, 35000, '1.0.0', 12, 6,
  '["Node.js 18+", "Tailwind CSS 4", "React 18 ou 19"]'::jsonb,
  '["Fichier Figma Pro", "Dépôt des composants TSX", "Storybook interactif"]'::jsonb,
  '["React 19", "Tailwind CSS 4", "Radix UI", "Lucide Icons", "Framer Motion"]'::jsonb,
  ARRAY['web', 'figma'],
  4.85, 45, 230, false, true, NOW()
),
(
  '30000000-0000-0000-0000-000000000007',
  '00000000-0000-0000-0000-000000000001',
  'bot',
  'demo-omnibot-whatsapp-ia',
  '[DEMO] OmniBot WhatsApp — Bot IA Support & Vente Automatisée',
  '[DEMO] OmniBot WhatsApp — AI Bot for Support & Automated Sales',
  'Agent conversationnel intelligent connecté à WhatsApp Cloud API et aux modèles LLM.',
  'Intelligent conversational agent connected to WhatsApp Cloud API and LLM models.',
  '## Présentation d''OmniBot WhatsApp\n\nRépond instantanément à vos clients, prend des commandes et envoie des rappels de paiement automatiques.',
  '## About OmniBot WhatsApp\n\nInstantly answers customers, takes orders, and dispatches automated payment reminders.',
  'published', 95000, 75000, '2.1.0', 12, 6,
  '["Python 3.11+", "Compte Meta Cloud API", "Clé OpenAI ou Claude"]'::jsonb,
  '["Scripts Python", "Serveur FastAPI", "Tutoriel de configuration Meta", "Docker file"]'::jsonb,
  '["Python", "FastAPI", "Meta Cloud API", "OpenAI / Anthropic", "Redis"]'::jsonb,
  ARRAY['backend', 'cloud'],
  4.77, 18, 52, false, false, NOW()
),
(
  '30000000-0000-0000-0000-000000000008',
  '00000000-0000-0000-0000-000000000001',
  'web_app',
  'demo-medicoconnect-clinique-sante',
  '[DEMO] MedicoConnect — Dossier Médical & Téléconsultation Web App',
  '[DEMO] MedicoConnect — Medical Records & Telehealth Web App',
  'Plateforme moderne pour cabinets médicaux, cliniques et laboratoires d''analyses.',
  'Modern application for medical practices, private clinics, and diagnostics laboratories.',
  '## Présentation de MedicoConnect\n\nPlanning de consultations, ordonnances électroniques sécurisées et dossier patient complet.',
  '## About MedicoConnect\n\nAppointment scheduling, secured e-prescriptions, and full digital health record system.',
  'published', 280000, 240000, '1.5.0', 12, 12,
  '["Serveur Linux / VPS", "PHP 8.2+", "MySQL ou PostgreSQL"]'::jsonb,
  '["Code source Laravel & Vue.js", "Guide de conformité RGPD santé", "Support 12 mois"]'::jsonb,
  '["Laravel 11", "Vue 3", "PostgreSQL", "Tailwind CSS", "Inertia.js"]'::jsonb,
  ARRAY['web', 'tablet-ready'],
  4.90, 14, 38, true, false, NOW()
),
(
  '30000000-0000-0000-0000-000000000009',
  '00000000-0000-0000-0000-000000000001',
  'template',
  'demo-restoqr-menu-commande-table',
  '[DEMO] RestoQR — Menu Numérique QR Code & Commande Table PWA',
  '[DEMO] RestoQR — Digital QR Menu & Table Ordering PWA',
  'Menu interactif sur smartphone sans téléchargement avec paiement direct par table.',
  'Interactive smartphone digital menu with direct at-table Mobile Money payment.',
  '## Présentation de RestoQR\n\nPermet aux restaurants d''accélérer le service, d''éviter les impressions papier et de booster les ventes additionnelles.',
  '## About RestoQR\n\nAllows restaurants to accelerate table turnover, reduce printing costs, and boost upsells.',
  'published', 65000, 50000, '1.0.2', 12, 6,
  '["Hébergement Web standard ou Vercel", "Navigateur moderne"]'::jsonb,
  '["Template Next.js complet", "Panneau de gestion des plats", "Fiches QR codes prêtes à imprimer"]'::jsonb,
  '["Next.js 15", "Tailwind CSS 4", "Supabase", "PWA"]'::jsonb,
  ARRAY['mobile-web', 'pwa'],
  4.82, 31, 115, false, false, NOW()
),
(
  '30000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'script_plugin',
  'demo-paymomo-plugin-gateway-benin',
  '[DEMO] PayMoMo Gateway — SDK & Module de Paiement Bénin/UEMOA',
  '[DEMO] PayMoMo Gateway — Benin/WAEMU Mobile Money Payment SDK',
  'Module universel prêt à brancher pour FedaPay, KKiaPay et Moneroo en quelques lignes de code.',
  'Universal ready-to-plug SDK for FedaPay, KKiaPay, and Moneroo in a few lines of code.',
  '## Présentation de PayMoMo Gateway\n\nPrend en charge la vérification cryptographique des webhooks, l''idempotence et les redirections sécurisées.',
  '## About PayMoMo Gateway\n\nHandles cryptographic webhook verification, database idempotency, and secure redirects.',
  'published', 35000, null, '2.0.0', 12, 6,
  '["Node.js ou PHP ou Python"]'::jsonb,
  '["Packages NPM & Composer", "Exemples de code complets", "Tests automatisés"]'::jsonb,
  '["TypeScript", "PHP", "Python", "Webhooks HMAC"]'::jsonb,
  ARRAY['backend', 'npm'],
  4.98, 52, 310, true, false, NOW()
),
(
  '30000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000001',
  'bundle',
  'demo-pack-startup-complete-suite',
  '[DEMO] Pack Mega Startup — SaaS + Mobile + UI Kit + CRM',
  '[DEMO] Mega Startup Pack — SaaS + Mobile + UI Kit + CRM',
  'L''arsenal complet pour lancer une startup technologique africaine en moins de 7 jours.',
  'The complete technical bundle to launch a tech startup in Africa in under 7 days.',
  '## Présentation du Pack Mega Startup\n\nRegroupe notre SaaS de gestion, l''application mobile Flutter et le Design System NovaUI Pro avec une remise exceptionnelle de 45 %.',
  '## About Mega Startup Pack\n\nCombines our Management SaaS, Flutter mobile app, and NovaUI Pro Design System with a 45% discount.',
  'published', 550000, 390000, '1.0.0', 12, 12,
  '["Serveur Cloud ou VPS", "Compte développeur Apple & Google"]'::jsonb,
  '["4 projets logiciels complets", "Tous les codes sources", "Accès aux mises à jour à vie", "Support prioritaire 12 mois"]'::jsonb,
  '["Next.js", "Flutter", "Tailwind 4", "PostgreSQL", "Tauri"]'::jsonb,
  ARRAY['web', 'mobile', 'desktop'],
  5.00, 11, 29, true, true, NOW()
),
(
  '30000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000001',
  'service',
  'demo-service-installation-sur-mesure',
  '[DEMO] Service d''Installation & Déploiement Cloud sur Mesure',
  '[DEMO] Turnkey Cloud Deployment & Custom Setup Service',
  'Nos ingénieurs déploient, configurent et sécurisent votre projet sur vos serveurs sous 48h.',
  'Our senior engineers deploy, configure, and secure your project on your cloud servers within 48h.',
  '## Présentation du Service Clé en Main\n\nConfiguration DNS, certificats SSL, base de données managée, passerelles de paiement réelles et sauvegarde automatique.',
  '## About Turnkey Setup Service\n\nDNS configuration, SSL certificates, managed database, live payment gateways, and automated backups.',
  'published', 80000, null, '1.0.0', 1, 1,
  '["Accès VPS / Cloud (AWS, DigitalOcean, Hetzner, Vercel)"]'::jsonb,
  '["Déploiement complet en production", "Certificat SSL & domaine", "Vérification des webhooks marchands"]'::jsonb,
  '["DevOps", "Docker", "Nginx", "PostgreSQL", "CI/CD"]'::jsonb,
  ARRAY['devops', 'cloud'],
  4.94, 38, 160, false, false, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title_fr = EXCLUDED.title_fr,
  base_price_xof = EXCLUDED.base_price_xof,
  sale_price_xof = EXCLUDED.sale_price_xof,
  status = EXCLUDED.status;

-- 5. Association Catégories & Tags pour les Produits
INSERT INTO product_categories (product_id, category_id) VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003'),
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003'),
  ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004'),
  ('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000005'),
  ('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000006'),
  ('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000005'),
  ('30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000006'),
  ('30000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- 6. Licences pour chaque Produit (Standard & Étendue)
INSERT INTO product_licenses (product_id, code, name, price_xof, includes_source, max_domains, description)
SELECT
  p.id,
  'standard',
  'Licence Standard (1 Domaine / Projet)',
  p.base_price_xof,
  true,
  1,
  'Utilisation pour un seul site ou une seule application en production. Support et mises à jour inclus.'
FROM products p
ON CONFLICT (product_id, code) DO NOTHING;

INSERT INTO product_licenses (product_id, code, name, price_xof, includes_source, max_domains, description)
SELECT
  p.id,
  'extended',
  'Licence Étendue (Usage Illimité / SaaS Commercial)',
  CAST(p.base_price_xof * 2.5 AS INT),
  true,
  999,
  'Déploiements illimités, intégration dans un produit SaaS commercial et revente autorisée sans revente directe du code source.'
FROM products p
ON CONFLICT (product_id, code) DO NOTHING;

-- 7. Versions & Fichiers Livrables de Démonstration
INSERT INTO product_versions (product_id, version, changelog_md, is_current)
SELECT
  p.id,
  p.current_version,
  '### Version Initiale\n- Lancement officiel de la solution avec documentation complète et support.',
  true
FROM products p
ON CONFLICT (product_id, version) DO NOTHING;

INSERT INTO product_files (product_version_id, label, storage_path, size_bytes, sha256, platform, is_primary)
SELECT
  pv.id,
  'Archive Source Complète (.zip)',
  'products/demo/' || pv.product_id || '/source-v1.zip',
  48291040, -- ~48 Mo
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  'all',
  true
FROM product_versions pv
ON CONFLICT DO NOTHING;

-- 8. Démos Interactives
INSERT INTO demos (product_id, kind, title, url, allowed_origin, notes, is_active, sort_order)
VALUES
  ('30000000-0000-0000-0000-000000000001', 'live_iframe', 'Boutique Démo Interactive', 'https://demo-ecommerce.yekpondigit.com', 'https://demo-ecommerce.yekpondigit.com', 'Tester le parcours panier et la simulation Mobile Money', true, 1),
  ('30000000-0000-0000-0000-000000000002', 'live_iframe', 'SchoolDesk Espace Démo Enseignant/Élève', 'https://demo-schooldesk.yekpondigit.com', 'https://demo-schooldesk.yekpondigit.com', 'Identifiants démo : demo@schooldesk.com / demo1234', true, 1),
  ('30000000-0000-0000-0000-000000000003', 'mobile_mockup', 'Simulation Démo Mobile Flutter', 'https://demo-agropay.yekpondigit.com', 'https://demo-agropay.yekpondigit.com', 'Aperçu dans mockup smartphone interactif', true, 1),
  ('30000000-0000-0000-0000-000000000005', 'video', 'Vidéo de Démonstration Caisse & POS', 'https://assets.yekpondigit.com/videos/stockmaster-demo.mp4', null, 'Démonstration de vente au scanner code-barres et impression ticket', true, 1)
ON CONFLICT DO NOTHING;

-- 9. Paramètres Système Globaux
INSERT INTO settings (key, value, is_public)
VALUES
  ('site_settings', '{"site_name": "YEKPON DIGIT", "support_email": "contact@yekpondigit.com", "phone": "+229 97 00 00 00", "currency": "XOF", "vat_rate": 0}'::jsonb, true),
  ('payment_settings', '{"sandbox_mode": true, "fedapay_enabled": true, "kkiapay_enabled": true, "stripe_enabled": true, "moneroo_enabled": false}'::jsonb, false),
  ('download_policy', '{"max_downloads_per_month": 10, "token_ttl_seconds": 120}'::jsonb, false)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

COMMIT;
