# 🗄️ BASE DE DONNÉES (PostgreSQL / Supabase)

Règles : UUID v4 partout, `created_at/updated_at`, soft-delete quand utile, **RLS activée sur TOUTES les tables**, montants en entiers (plus petite unité : XOF sans décimale, EUR/USD en centimes), contraintes CHECK/UNIQUE/FK, index sur colonnes filtrées.

## 1. Enums
```sql
create type product_type as enum ('website','web_app','saas','mobile_app','android_native','desktop_app','template','script_plugin','ui_kit','bot','bundle','service');
create type product_status as enum ('draft','review','published','archived');
create type order_status as enum ('pending','awaiting_payment','paid','fulfilled','failed','cancelled','refunded','partially_refunded','disputed');
create type payment_status as enum ('initiated','pending','succeeded','failed','refunded','disputed');
create type license_status as enum ('active','revoked','expired');
create type user_role as enum ('customer','support','editor','admin','super_admin','vendor');
create type demo_kind as enum ('live_iframe','video','gallery','mobile_mockup','emulator','credentials_only');
create type ticket_status as enum ('open','pending','resolved','closed');
```

## 2. Tables principales (colonnes essentielles)
```sql
-- Profils (lié à auth.users)
profiles(id uuid pk references auth.users, full_name, avatar_url, phone, country, locale default 'fr',
         role user_role default 'customer', is_blocked bool default false, created_at, updated_at)

categories(id, parent_id, name_fr, name_en, slug unique, icon, sort_order, is_active)
tags(id, name, slug unique, kind text check (kind in ('tech','sector','feature')))

products(id, vendor_id null, type product_type, slug unique, title_fr, title_en, summary_fr, summary_en,
  description_fr, description_en, status product_status default 'draft', base_price_xof int check (>=0),
  sale_price_xof int null, sale_starts_at, sale_ends_at, current_version text, last_updated_at,
  updates_months int null, support_months int default 6, requirements jsonb, includes jsonb,
  stack jsonb, platforms text[], rating_avg numeric(3,2) default 0, rating_count int default 0,
  sales_count int default 0, is_featured bool, is_new bool, seo_title, seo_description, og_image_url,
  search tsvector generated/maintained, created_at, updated_at, published_at)
product_categories(product_id, category_id, primary key(...))
product_tags(product_id, tag_id, primary key(...))
product_media(id, product_id, kind ('image','video','model3d'), url, alt_fr, alt_en, sort_order, device ('desktop','tablet','mobile'))
product_licenses(id, product_id, code ('standard','extended'), name, price_xof, includes_source bool, max_domains int, description)
product_addons(id, product_id, name, description, price_xof, kind ('install','custom','hosting','support'))
product_versions(id, product_id, version, changelog_md, released_at, is_current bool, min_requirements jsonb)
product_files(id, product_version_id, label, storage_path, size_bytes, sha256, platform, is_primary bool)   -- bucket PRIVÉ
demos(id, product_id, kind demo_kind, title, url, allowed_origin, credentials_encrypted, notes, is_active, sort_order, sandbox_flags text[])
bundles(id, slug, title, price_xof) ; bundle_items(bundle_id, product_id)
collections(id, slug, title, description) ; collection_products(collection_id, product_id, sort_order)

carts(id, user_id null, session_id null, currency, created_at, updated_at)
cart_items(id, cart_id, product_id, license_code, addon_ids uuid[], quantity int default 1 check (=1 pour licences))

coupons(id, code unique, type ('percent','fixed'), value, min_amount_xof, max_uses, used_count, per_user_limit, starts_at, ends_at, applies_to jsonb, is_active)

orders(id, number unique (ex: CL-2026-000123), user_id null, email, status order_status, currency,
  subtotal_xof, discount_xof, tax_xof, total_xof, display_currency, display_total, fx_rate,
  coupon_id null, billing jsonb, ip_hash, user_agent_hash, locale, created_at, paid_at, fulfilled_at)
order_items(id, order_id, product_id, product_title_snapshot, license_code, unit_price_xof, addon_snapshot jsonb, quantity)
payments(id, order_id, provider ('moneroo','fedapay','kkiapay','stripe'), provider_ref unique(provider,provider_ref),
  status payment_status, amount_xof, currency, method ('mtn_momo','moov','celtiis','card',...), raw_payload jsonb (sans données carte),
  failure_reason, created_at, updated_at)
webhook_events(id, provider, event_id, signature_valid bool, payload jsonb, processed_at, error, unique(provider,event_id))  -- idempotence
refunds(id, payment_id, amount_xof, reason, status, created_by, created_at)
invoices(id, order_id, number unique, pdf_path, issued_at)

licenses(id, order_item_id, user_id null, email, product_id, key unique, license_code, status license_status,
  domains text[], max_domains, issued_at, expires_at, revoked_at, revoked_reason)
license_activations(id, license_id, domain, ip_hash, activated_at)
download_logs(id, license_id, product_file_id, user_id null, ip_hash, user_agent_hash, created_at, success bool)
download_tokens(id, license_id, product_file_id, token_hash unique, expires_at, used_at)

reviews(id, product_id, user_id, order_item_id unique, rating int check (1..5), title, body, status ('pending','approved','rejected'), vendor_reply, created_at)
wishlists(user_id, product_id, created_at, pk(user_id,product_id))
custom_requests(id, user_id null, email, type, budget_range, deadline, description, attachments jsonb, status, quote_amount_xof, created_at)
tickets(id, user_id, order_id null, subject, status ticket_status, priority, created_at) ; ticket_messages(id, ticket_id, author_id, body, attachments jsonb, is_internal bool, created_at)
cms_pages(id, slug, title_fr, title_en, body_fr, body_en, is_published) ; blog_posts(...)
faqs(id, scope ('global','product'), product_id null, q_fr,a_fr,q_en,a_en,sort_order)
newsletter_subscribers(id, email unique, confirmed_at, token_hash, created_at)
notifications(id, user_id, kind, payload jsonb, read_at, created_at)
settings(key pk, value jsonb, is_public bool)               -- jamais de secrets ici
audit_logs(id, actor_id, action, entity, entity_id, diff jsonb, ip_hash, created_at)  -- append-only
fx_rates(base, quote, rate, fetched_at)
product_views(product_id, session_hash, created_at)         -- analytics léger
```

## 3. Index recommandés
`products(status, published_at desc)`, GIN sur `products.search` et `products.stack`, `pg_trgm` sur `title_*`, `orders(user_id, created_at desc)`, `orders(email)`, `payments(provider, provider_ref)`, `licenses(key)`, `licenses(user_id)`, `download_logs(license_id, created_at)`, `reviews(product_id,status)`.

## 4. RLS (principes obligatoires)
- `products/categories/tags/product_media/demos(public fields)/reviews(approved)/cms/faqs` : SELECT public uniquement si `status='published'` / `is_active`. **Aucune** écriture publique.
- `profiles` : un utilisateur lit/modifie **uniquement sa ligne** (hors `role`, `is_blocked` : colonnes non modifiables côté client → trigger/fonction).
- `orders/order_items/payments/licenses/download_logs/invoices` : SELECT limité au propriétaire (`user_id = auth.uid()`) ; **INSERT/UPDATE uniquement via service role côté serveur**.
- `product_files`, `demos.credentials_encrypted`, `webhook_events`, `audit_logs`, `settings(secret)` : **aucun accès client** (pas de policy SELECT publique).
- Rôles admin : vérifiés via fonction `security definer` `is_admin()` basée sur `profiles.role`, jamais sur un claim modifiable par l'utilisateur.
- Storage : bucket `public-media` (images produits) lecture publique ; bucket `product-files` **privé** sans policy client ; bucket `attachments` privé (propriétaire).
- Tests RLS automatisés : un utilisateur A ne peut lire aucune ligne de l'utilisateur B (test d'IDOR obligatoire).

## 5. Fonctions & triggers
`set_updated_at()`, `update_product_search()`, `recompute_rating(product_id)`, `next_order_number()` (séquence), `generate_license_key()` (format `XXXX-XXXX-XXXX-XXXX`, base32 sans ambiguïtés), `prevent_role_escalation()`, audit triggers sur tables sensibles.

## 6. Seed DEMO
12 produits fictifs variés (marqués `[DEMO]`) couvrant tous les types, 6 catégories, 20 tags, 3 collections, 30 avis, 2 coupons, 1 bundle. Script de purge `supabase/purge-demo.sql`.
