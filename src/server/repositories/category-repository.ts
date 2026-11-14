import "server-only";
import { query } from "@/server/db";

export interface CategoryRecord {
  id: string;
  parent_id: string | null;
  name_fr: string;
  name_en: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface TagRecord {
  id: string;
  name: string;
  slug: string;
  kind: "tech" | "sector" | "feature";
  created_at: string;
}

export const CategoryRepository = {
  async listAll(activeOnly = true): Promise<CategoryRecord[]> {
    const sql = activeOnly
      ? "SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC, name_fr ASC;"
      : "SELECT * FROM categories ORDER BY sort_order ASC, name_fr ASC;";
    const res = await query<CategoryRecord>(sql);
    return res.rows;
  },

  async findBySlug(slug: string): Promise<CategoryRecord | null> {
    const res = await query<CategoryRecord>(
      "SELECT * FROM categories WHERE slug = $1 LIMIT 1;",
      [slug]
    );
    return res.rows[0] ?? null;
  },

  async listTags(kind?: "tech" | "sector" | "feature"): Promise<TagRecord[]> {
    const sql = kind
      ? "SELECT * FROM tags WHERE kind = $1 ORDER BY name ASC;"
      : "SELECT * FROM tags ORDER BY kind ASC, name ASC;";
    const params = kind ? [kind] : [];
    const res = await query<TagRecord>(sql, params);
    return res.rows;
  },
};
