import "server-only";
import fs from "node:fs";
import path from "node:path";
import { pool } from "./index";

export async function runMigrations() {
  console.log("🚀 Lancement de la migration du schéma initial...");
  const schemaPath = path.resolve(process.cwd(), "db/schema.sql");

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Fichier de schéma introuvable : ${schemaPath}`);
  }

  const sql = fs.readFileSync(schemaPath, "utf-8");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    console.log("⚙️ Exécution des requêtes SQL...");
    await client.query(sql);
    await client.query("COMMIT");
    console.log("✅ Migration PostgreSQL exécutée avec succès !");

    const res = await client.query<{ table_name: string }>(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    );
    console.log(`📊 Tables créées (${res.rowCount}) :`, res.rows.map((r) => r.table_name).join(", "));
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Échec de la migration du schéma :", error);
    throw error;
  } finally {
    client.release();
  }
}

// Exécution directe via CLI
if (process.argv[1]?.endsWith("migrate.ts") || process.argv[1]?.endsWith("migrate.js")) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
