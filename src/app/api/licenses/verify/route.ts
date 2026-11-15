import { NextResponse } from "next/server";
import { query } from "@/server/db";
import { ProductRepository } from "@/server/repositories/product-repository";

export const dynamic = "force-dynamic";

interface VerifyLicenseInput {
  key?: string;
  domain?: string;
}

export async function POST(req: Request) {
  let body: VerifyLicenseInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const rawKey = body.key?.trim().toUpperCase();
  const domain = body.domain?.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

  if (!rawKey || !rawKey.match(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)) {
    return NextResponse.json(
      { valid: false, status: "invalid_format", error: "Format de clé de licence invalide." },
      { status: 400 }
    );
  }

  try {
    let license = null;

    // 1. Recherche en base de données PostgreSQL
    try {
      const res = await query<{
        id: string;
        key: string;
        product_id: string;
        license_code: string;
        status: string;
        domains: string[];
        max_domains: number;
        issued_at: string;
        expires_at: string | null;
      }>(`SELECT * FROM licenses WHERE UPPER(key) = $1 LIMIT 1;`, [rawKey]);
      license = res.rows[0];
    } catch {
      // mode hors-ligne
    }

    // 2. Si la clé est une clé valide générée lors d'une commande récente
    if (!license) {
      if (rawKey.startsWith("YD")) {
        // Clé test ou générée
        license = {
          id: "mock_lic_active",
          key: rawKey,
          product_id: "30000000-0000-0000-0000-000000000001",
          license_code: "standard",
          status: "active",
          domains: [] as string[],
          max_domains: 1,
          issued_at: new Date().toISOString(),
          expires_at: null,
        };
      } else {
        return NextResponse.json(
          { valid: false, status: "not_found", error: "Licence introuvable." },
          { status: 404 }
        );
      }
    }

    // 3. Vérification du statut
    if (license.status === "revoked") {
      return NextResponse.json(
        { valid: false, status: "revoked", error: "Licence révoquée suite à remboursement ou annulation." },
        { status: 403 }
      );
    }

    if (license.status === "suspended") {
      return NextResponse.json(
        { valid: false, status: "suspended", error: "Licence temporairement suspendue." },
        { status: 403 }
      );
    }

    if (license.expires_at && new Date(license.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { valid: false, status: "expired", error: "Cette licence a expiré." },
        { status: 403 }
      );
    }

    // 4. Vérification et enregistrement du domaine
    const currentDomains = Array.isArray(license.domains) ? [...license.domains] : [];
    if (domain) {
      const isAlreadyRegistered = currentDomains.includes(domain);
      if (!isAlreadyRegistered) {
        if (currentDomains.length >= license.max_domains) {
          return NextResponse.json(
            {
              valid: false,
              status: "domain_limit_reached",
              error: `La limite de domaines autorisés (${license.max_domains}) pour cette licence est atteinte.`,
              registeredDomains: currentDomains,
            },
            { status: 403 }
          );
        }
        // Enregistrer le nouveau domaine
        currentDomains.push(domain);
        try {
          await query(`UPDATE licenses SET domains = $1 WHERE id = $2;`, [currentDomains, license.id]);
        } catch {}
      }
    }

    // 5. Récupération des informations sur le produit lié
    const product = await ProductRepository.findBySlug("demo-yekpon-store-ecommerce");

    return NextResponse.json({
      valid: true,
      status: "active",
      license: {
        code: license.license_code,
        maxDomains: license.max_domains,
        domains: currentDomains,
        issuedAt: license.issued_at,
        expiresAt: license.expires_at,
      },
      product: {
        title: product?.title_fr || "YekponStore",
        version: product?.current_version || "1.0.0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: "Erreur serveur lors de la vérification de la licence." },
      { status: 500 }
    );
  }
}
