-- ==============================================================================
-- YEKPON DIGIT — Script de Purge des Données DEMO (db/purge-demo.sql)
-- Supprime en toute sécurité les produits, versions et démos marqués [DEMO]
-- ==============================================================================

BEGIN;

-- 1. Suppression des fichiers et démos rattachés aux produits DEMO
DELETE FROM demos WHERE product_id IN (SELECT id FROM products WHERE title_fr LIKE '[DEMO]%');
DELETE FROM product_files WHERE product_version_id IN (
  SELECT pv.id FROM product_versions pv
  JOIN products p ON p.id = pv.product_id
  WHERE p.title_fr LIKE '[DEMO]%'
);
DELETE FROM product_versions WHERE product_id IN (SELECT id FROM products WHERE title_fr LIKE '[DEMO]%');
DELETE FROM product_licenses WHERE product_id IN (SELECT id FROM products WHERE title_fr LIKE '[DEMO]%');
DELETE FROM product_media WHERE product_id IN (SELECT id FROM products WHERE title_fr LIKE '[DEMO]%');
DELETE FROM product_categories WHERE product_id IN (SELECT id FROM products WHERE title_fr LIKE '[DEMO]%');
DELETE FROM product_tags WHERE product_id IN (SELECT id FROM products WHERE title_fr LIKE '[DEMO]%');

-- 2. Suppression des produits DEMO
DELETE FROM products WHERE title_fr LIKE '[DEMO]%';

-- 3. Suppression des profils de démonstration
DELETE FROM profiles WHERE email LIKE '%@yekpondigit.com' AND role != 'super_admin';

COMMIT;
