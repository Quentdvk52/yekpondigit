import "server-only";
import { query, pool } from "@/server/db";
import { type ProductWizardInput } from "@/schemas/product";
import { MOCK_PRODUCTS } from "./mock-data";

export interface ProductSummary {
  id: string;
  vendor_id: string | null;
  type: string;
  slug: string;
  title_fr: string;
  title_en: string;
  summary_fr: string;
  summary_en: string;
  status: string;
  base_price_xof: number;
  sale_price_xof: number | null;
  current_version: string;
  rating_avg: number;
  rating_count: number;
  sales_count: number;
  is_featured: boolean;
  is_new: boolean;
  published_at: string | null;
  categories: { id: string; name_fr: string; slug: string }[];
}

export interface ProductDetail extends ProductSummary {
  description_fr: string;
  description_en: string;
  requirements: string[];
  includes: string[];
  stack: string[];
  platforms: string[];
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  media: {
    id: string;
    kind: string;
    url: string;
    alt_fr: string | null;
    alt_en: string | null;
    device: string;
    sort_order: number;
  }[];
  licenses: {
    id: string;
    code: string;
    name: string;
    price_xof: number;
    includes_source: boolean;
    max_domains: number;
    description: string | null;
  }[];
  demos: {
    id: string;
    kind: string;
    title: string;
    url: string;
    allowed_origin: string | null;
    notes: string | null;
    is_active: boolean;
  }[];
  versions: {
    id: string;
    version: string;
    changelog_md: string | null;
    released_at: string;
    is_current: boolean;
    files: {
      id: string;
      label: string;
      storage_path: string;
      size_bytes: number;
      sha256: string;
      platform: string;
    }[];
  }[];
}

export interface ProductFilterOptions {
  status?: string;
  type?: string;
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
}

function filterMockProducts(filters: ProductFilterOptions): { products: ProductSummary[]; total: number } {
  let list = [...MOCK_PRODUCTS];
  if (filters.status) {
    list = list.filter((p) => p.status === filters.status);
  }
  if (filters.type) {
    list = list.filter((p) => p.type === filters.type);
  }
  if (filters.isFeatured !== undefined) {
    list = list.filter((p) => p.is_featured === filters.isFeatured);
  }
  if (filters.categoryId) {
    list = list.filter((p) => p.categories.some((c) => c.id === filters.categoryId));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title_fr.toLowerCase().includes(q) ||
        p.title_en.toLowerCase().includes(q) ||
        p.summary_fr.toLowerCase().includes(q)
    );
  }
  const total = list.length;
  const offset = filters.offset ?? 0;
  const limit = filters.limit ?? 20;
  return {
    products: list.slice(offset, offset + limit),
    total,
  };
}

export const ProductRepository = {
  async list(filters: ProductFilterOptions = {}): Promise<{ products: ProductSummary[]; total: number }> {
    try {
      const conditions: string[] = [];
      const params: unknown[] = [];
      let pIdx = 1;

      if (filters.status) {
        conditions.push(`p.status = $${pIdx++}`);
        params.push(filters.status);
      }

      if (filters.type) {
        conditions.push(`p.type = $${pIdx++}`);
        params.push(filters.type);
      }

      if (filters.isFeatured !== undefined) {
        conditions.push(`p.is_featured = $${pIdx++}`);
        params.push(filters.isFeatured);
      }

      if (filters.categoryId) {
        conditions.push(`EXISTS (SELECT 1 FROM product_categories pc WHERE pc.product_id = p.id AND pc.category_id = $${pIdx++})`);
        params.push(filters.categoryId);
      }

      if (filters.search) {
        conditions.push(`(p.title_fr ILIKE $${pIdx} OR p.title_en ILIKE $${pIdx} OR p.summary_fr ILIKE $${pIdx})`);
        params.push(`%${filters.search}%`);
        pIdx++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const countSql = `SELECT count(*) FROM products p ${whereClause};`;
      const countRes = await query<{ count: string }>(countSql, params);
      const total = parseInt(countRes.rows[0]?.count ?? "0", 10);

      const limit = filters.limit ?? 20;
      const offset = filters.offset ?? 0;

      const sql = `
        SELECT
          p.id, p.vendor_id, p.type, p.slug, p.title_fr, p.title_en,
          p.summary_fr, p.summary_en, p.status, p.base_price_xof, p.sale_price_xof,
          p.current_version, p.rating_avg, p.rating_count, p.sales_count,
          p.is_featured, p.is_new, p.published_at,
          COALESCE(
            (SELECT json_agg(json_build_object('id', c.id, 'name_fr', c.name_fr, 'slug', c.slug))
             FROM product_categories pc
             JOIN categories c ON c.id = pc.category_id
             WHERE pc.product_id = p.id),
            '[]'::json
          ) AS categories
        FROM products p
        ${whereClause}
        ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
        LIMIT $${pIdx++} OFFSET $${pIdx++};
      `;
      params.push(limit, offset);

      const res = await query<ProductSummary>(sql, params);
      if (res.rows.length === 0 && total === 0) {
        return filterMockProducts(filters);
      }
      return {
        products: res.rows,
        total,
      };
    } catch {
      return filterMockProducts(filters);
    }
  },

  async findBySlug(slug: string): Promise<ProductDetail | null> {
    try {
      const res = await query<ProductSummary & {
        description_fr: string;
        description_en: string;
        requirements: string[];
        includes: string[];
        stack: string[];
        platforms: string[];
        seo_title: string | null;
        seo_description: string | null;
        og_image_url: string | null;
      }>(
        `SELECT
          p.id, p.vendor_id, p.type, p.slug, p.title_fr, p.title_en,
          p.summary_fr, p.summary_en, p.description_fr, p.description_en,
          p.status, p.base_price_xof, p.sale_price_xof, p.current_version,
          p.rating_avg, p.rating_count, p.sales_count, p.is_featured, p.is_new,
          p.published_at, p.requirements, p.includes, p.stack, p.platforms,
          p.seo_title, p.seo_description, p.og_image_url,
          COALESCE(
            (SELECT json_agg(json_build_object('id', c.id, 'name_fr', c.name_fr, 'slug', c.slug))
             FROM product_categories pc
             JOIN categories c ON c.id = pc.category_id
             WHERE pc.product_id = p.id),
            '[]'::json
          ) AS categories
         FROM products p
         WHERE p.slug = $1
         LIMIT 1;`,
        [slug]
      );

      const product = res.rows[0];
      if (!product) {
        return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
      }

      const [mediaRes, licensesRes, demosRes, versionsRes] = await Promise.all([
        query(`SELECT id, kind, url, alt_fr, alt_en, device, sort_order FROM product_media WHERE product_id = $1 ORDER BY sort_order ASC;`, [product.id]),
        query(`SELECT id, code, name, price_xof, includes_source, max_domains, description FROM product_licenses WHERE product_id = $1 ORDER BY price_xof ASC;`, [product.id]),
        query(`SELECT id, kind, title, url, allowed_origin, notes, is_active FROM demos WHERE product_id = $1 AND is_active = true ORDER BY sort_order ASC;`, [product.id]),
        query(`SELECT id, version, changelog_md, released_at, is_current FROM product_versions WHERE product_id = $1 ORDER BY released_at DESC;`, [product.id]),
      ]);

      const versionsWithFiles = await Promise.all(
        versionsRes.rows.map(async (v) => {
          const filesRes = await query(
            `SELECT id, label, storage_path, size_bytes, sha256, platform FROM product_files WHERE product_version_id = $1;`,
            [v.id]
          );
          return {
            id: v.id as string,
            version: v.version as string,
            changelog_md: v.changelog_md as string | null,
            released_at: v.released_at as string,
            is_current: v.is_current as boolean,
            files: filesRes.rows as { id: string; label: string; storage_path: string; size_bytes: number; sha256: string; platform: string }[],
          };
        })
      );

      return {
        ...product,
        media: mediaRes.rows as ProductDetail["media"],
        licenses: licensesRes.rows as ProductDetail["licenses"],
        demos: demosRes.rows as ProductDetail["demos"],
        versions: versionsWithFiles,
      };
    } catch {
      return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
    }
  },

  async create(data: ProductWizardInput, vendorId?: string): Promise<string> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Insert product
      const prodRes = await client.query<{ id: string }>(
        `INSERT INTO products (
          vendor_id, type, slug, title_fr, title_en, summary_fr, summary_en,
          description_fr, description_en, base_price_xof, sale_price_xof,
          current_version, requirements, includes, stack, platforms,
          status, is_featured, is_new, seo_title, seo_description, og_image_url,
          published_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22,
          CASE WHEN $17 = 'published' THEN NOW() ELSE NULL END
        ) RETURNING id;`,
        [
          vendorId ?? null,
          data.type,
          data.slug,
          data.title_fr,
          data.title_en,
          data.summary_fr,
          data.summary_en,
          data.description_fr,
          data.description_en,
          data.base_price_xof,
          data.sale_price_xof ?? null,
          data.version,
          JSON.stringify(data.requirements),
          JSON.stringify(data.includes),
          JSON.stringify(data.stack),
          data.platforms,
          data.status,
          data.is_featured,
          data.is_new,
          data.seo_title ?? null,
          data.seo_description ?? null,
          data.og_image_url ?? null,
        ]
      );

      const productId = prodRes.rows[0]?.id;
      if (!productId) throw new Error("Échec de création du produit.");

      // 2. Categories
      for (const catId of data.category_ids) {
        await client.query(
          `INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
          [productId, catId]
        );
      }

      // 3. Tags
      for (const tagId of data.tag_ids) {
        await client.query(
          `INSERT INTO product_tags (product_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
          [productId, tagId]
        );
      }

      // 4. Media
      for (const m of data.media) {
        await client.query(
          `INSERT INTO product_media (product_id, kind, url, alt_fr, alt_en, device, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [productId, m.kind, m.url, m.alt_fr ?? null, m.alt_en ?? null, m.device, m.sort_order]
        );
      }

      // 5. Demos
      for (const d of data.demos) {
        await client.query(
          `INSERT INTO demos (product_id, kind, title, url, allowed_origin, credentials_encrypted, notes, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
          [
            productId,
            d.kind,
            d.title,
            d.url,
            d.allowed_origin ?? null,
            d.credentials_encrypted ?? null,
            d.notes ?? null,
            d.sort_order,
            d.is_active,
          ]
        );
      }

      // 6. Licenses
      for (const lic of data.licenses) {
        await client.query(
          `INSERT INTO product_licenses (product_id, code, name, price_xof, includes_source, max_domains, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [
            productId,
            lic.code,
            lic.name,
            lic.price_xof,
            lic.includes_source,
            lic.max_domains,
            lic.description ?? null,
          ]
        );
      }

      // 7. Version & Files
      const verRes = await client.query<{ id: string }>(
        `INSERT INTO product_versions (product_id, version, changelog_md, is_current)
         VALUES ($1, $2, $3, true) RETURNING id;`,
        [productId, data.version, data.changelog_md ?? null]
      );
      const versionId = verRes.rows[0]?.id;

      if (versionId && data.files.length > 0) {
        for (const f of data.files) {
          await client.query(
            `INSERT INTO product_files (product_version_id, label, storage_path, size_bytes, sha256, platform, is_primary)
             VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [versionId, f.label, f.storage_path, f.size_bytes, f.sha256, f.platform, f.is_primary]
          );
        }
      }

      await client.query("COMMIT");
      return productId;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async delete(id: string): Promise<boolean> {
    const res = await query("DELETE FROM products WHERE id = $1 RETURNING id;", [id]);
    return (res.rowCount ?? 0) > 0;
  },
};
