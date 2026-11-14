-- ==============================================================================
-- YEKPON DIGIT — Schéma Initial PostgreSQL (Neon / Supabase Compatible)
-- Conforme aux spécifications 05-BASE-DE-DONNEES.md & 11-SECURITE.md
-- ==============================================================================

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Énumérations
DO $$ BEGIN
  CREATE TYPE product_type AS ENUM (
    'website', 'web_app', 'saas', 'mobile_app', 'android_native',
    'desktop_app', 'template', 'script_plugin', 'ui_kit', 'bot', 'bundle', 'service'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('draft', 'review', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending', 'awaiting_payment', 'paid', 'fulfilled',
    'failed', 'cancelled', 'refunded', 'partially_refunded', 'disputed'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'initiated', 'pending', 'succeeded', 'failed', 'refunded', 'disputed'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE license_status AS ENUM ('active', 'revoked', 'expired');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'support', 'editor', 'admin', 'super_admin', 'vendor');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE demo_kind AS ENUM (
    'live_iframe', 'video', 'gallery', 'mobile_mockup', 'emulator', 'credentials_only'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('open', 'pending', 'resolved', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Fonction utilitaire updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  country TEXT DEFAULT 'BJ',
  locale TEXT DEFAULT 'fr',
  role user_role DEFAULT 'customer' NOT NULL,
  is_blocked BOOLEAN DEFAULT false NOT NULL,
  two_factor_secret TEXT,
  two_factor_enabled BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Catégories & Tags
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  kind TEXT CHECK (kind IN ('tech', 'sector', 'feature')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Produits
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type product_type NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary_fr TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  status product_status DEFAULT 'draft' NOT NULL,
  base_price_xof INT CHECK (base_price_xof >= 0) NOT NULL,
  sale_price_xof INT CHECK (sale_price_xof IS NULL OR sale_price_xof >= 0),
  sale_starts_at TIMESTAMPTZ,
  sale_ends_at TIMESTAMPTZ,
  current_version TEXT DEFAULT '1.0.0' NOT NULL,
  last_updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updates_months INT DEFAULT 12,
  support_months INT DEFAULT 6,
  requirements JSONB DEFAULT '[]'::jsonb NOT NULL,
  includes JSONB DEFAULT '[]'::jsonb NOT NULL,
  stack JSONB DEFAULT '[]'::jsonb NOT NULL,
  platforms TEXT[] DEFAULT '{}'::text[] NOT NULL,
  rating_avg NUMERIC(3, 2) DEFAULT 0.00 NOT NULL,
  rating_count INT DEFAULT 0 NOT NULL,
  sales_count INT DEFAULT 0 NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_new BOOLEAN DEFAULT true NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  og_image_url TEXT,
  search TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  published_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE IF NOT EXISTS product_tags (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE TABLE IF NOT EXISTS product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  kind TEXT CHECK (kind IN ('image', 'video', 'model3d')) NOT NULL,
  url TEXT NOT NULL,
  alt_fr TEXT,
  alt_en TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  device TEXT CHECK (device IN ('desktop', 'tablet', 'mobile')) DEFAULT 'desktop' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS product_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  code TEXT CHECK (code IN ('standard', 'extended')) NOT NULL,
  name TEXT NOT NULL,
  price_xof INT CHECK (price_xof >= 0) NOT NULL,
  includes_source BOOLEAN DEFAULT true NOT NULL,
  max_domains INT DEFAULT 1 NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (product_id, code)
);

CREATE TABLE IF NOT EXISTS product_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  version TEXT NOT NULL,
  changelog_md TEXT,
  released_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_current BOOLEAN DEFAULT true NOT NULL,
  min_requirements JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (product_id, version)
);

CREATE TABLE IF NOT EXISTS product_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_version_id UUID REFERENCES product_versions(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  sha256 TEXT NOT NULL,
  platform TEXT DEFAULT 'all' NOT NULL,
  is_primary BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS demos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  kind demo_kind NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  allowed_origin TEXT,
  credentials_encrypted TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  sandbox_flags TEXT[] DEFAULT '{"allow-scripts", "allow-forms", "allow-same-origin"}'::text[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Commandes & Paiements
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1000;

CREATE OR REPLACE FUNCTION next_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'YD-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT UNIQUE NOT NULL DEFAULT next_order_number(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status order_status DEFAULT 'pending' NOT NULL,
  currency TEXT DEFAULT 'XOF' NOT NULL,
  subtotal_xof INT NOT NULL,
  discount_xof INT DEFAULT 0 NOT NULL,
  tax_xof INT DEFAULT 0 NOT NULL,
  total_xof INT NOT NULL,
  display_currency TEXT DEFAULT 'XOF' NOT NULL,
  display_total NUMERIC(12, 2) NOT NULL,
  fx_rate NUMERIC(10, 4) DEFAULT 1.0000 NOT NULL,
  coupon_code TEXT,
  billing JSONB DEFAULT '{}'::jsonb NOT NULL,
  ip_hash TEXT,
  user_agent_hash TEXT,
  locale TEXT DEFAULT 'fr' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  paid_at TIMESTAMPTZ,
  fulfilled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
  product_title_snapshot TEXT NOT NULL,
  license_code TEXT NOT NULL,
  unit_price_xof INT NOT NULL,
  addon_snapshot JSONB DEFAULT '[]'::jsonb NOT NULL,
  quantity INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  provider_ref TEXT NOT NULL,
  status payment_status DEFAULT 'initiated' NOT NULL,
  amount_xof INT NOT NULL,
  currency TEXT NOT NULL,
  method TEXT,
  raw_payload JSONB DEFAULT '{}'::jsonb NOT NULL,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (provider, provider_ref)
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  signature_valid BOOLEAN DEFAULT false NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (provider, event_id)
);

-- 7. Licences & Téléchargements
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  license_code TEXT NOT NULL,
  status license_status DEFAULT 'active' NOT NULL,
  domains TEXT[] DEFAULT '{}'::text[] NOT NULL,
  max_domains INT DEFAULT 1 NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT
);

CREATE TABLE IF NOT EXISTS download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES licenses(id) ON DELETE CASCADE NOT NULL,
  product_file_id UUID REFERENCES product_files(id) ON DELETE RESTRICT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_hash TEXT,
  user_agent_hash TEXT,
  success BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS download_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES licenses(id) ON DELETE CASCADE NOT NULL,
  product_file_id UUID REFERENCES product_files(id) ON DELETE CASCADE NOT NULL,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Audit Logs (Append-Only)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  diff JSONB DEFAULT '{}'::jsonb NOT NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Paramètres Système
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index critiques de performance
CREATE INDEX IF NOT EXISTS idx_products_status_pub ON products(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(key);
CREATE INDEX IF NOT EXISTS idx_licenses_user ON licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_license ON download_logs(license_id, created_at DESC);
