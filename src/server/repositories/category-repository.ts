import "server-only";
import { query } from "@/server/db";
import { MOCK_CATEGORIES, MOCK_TAGS } from "./mock-data";

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
    try {
      const sql = activeOnly
        ? "SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC, name_fr ASC;"
        : "SELECT * FROM categories ORDER BY sort_order ASC, name_fr ASC;";
      const res = await query<CategoryRecord>(sql);
      if (res.rows.length > 0) return res.rows;
      return activeOnly ? MOCK_CATEGORIES.filter((c) => c.is_active) : MOCK_CATEGORIES;
    } catch {
      return activeOnly ? MOCK_CATEGORIES.filter((c) => c.is_active) : MOCK_CATEGORIES;
    }
  },

  async findBySlug(slug: string): Promise<CategoryRecord | null> {
    try {
      const res = await query<CategoryRecord>(
        "SELECT * FROM categories WHERE slug = $1 LIMIT 1;",
        [slug]
      );
      if (res.rows[0]) return res.rows[0];
      return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
    } catch {
      return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
    }
  },

  async listTags(kind?: "tech" | "sector" | "feature"): Promise<TagRecord[]> {
    try {
      const sql = kind
        ? "SELECT * FROM tags WHERE kind = $1 ORDER BY name ASC;"
        : "SELECT * FROM tags ORDER BY kind ASC, name ASC;";
      const params = kind ? [kind] : [];
      const res = await query<TagRecord>(sql, params);
      if (res.rows.length > 0) return res.rows;
      return kind ? MOCK_TAGS.filter((t) => t.kind === kind) : MOCK_TAGS;
    } catch {
      return kind ? MOCK_TAGS.filter((t) => t.kind === kind) : MOCK_TAGS;
    }
  },
};
