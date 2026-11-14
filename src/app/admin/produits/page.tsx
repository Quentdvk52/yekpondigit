import Link from "next/link";
import { Plus, Package, Layers, ExternalLink, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductRepository } from "@/server/repositories/product-repository";
import { requireAdmin } from "@/server/auth/rbac";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProduitsPage() {
  await requireAdmin();
  const { products, total } = await ProductRepository.list({ limit: 100 });

  const publishedCount = products.filter((p) => p.status === "published").length;
  const draftCount = products.filter((p) => p.status === "draft").length;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Layers className="h-4 w-4" />
            Administration
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mt-1">
            Gestion du Catalogue Produits
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez vos solutions logicielles, versions, licences et démos interactives.
          </p>
        </div>

        <Link href="/admin/produits/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau Produit
          </Button>
        </Link>
      </div>

      {/* Cartes de KPI */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="text-xs font-medium text-muted-foreground">Total Produits</div>
          <div className="mt-2 text-2xl font-bold">{total}</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="text-xs font-medium text-emerald-400">En Ligne (Publiés)</div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">{publishedCount}</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="text-xs font-medium text-amber-400">Brouillons</div>
          <div className="mt-2 text-2xl font-bold text-amber-400">{draftCount}</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="text-xs font-medium text-primary">Ventes Cumulées</div>
          <div className="mt-2 text-2xl font-bold text-primary">
            {products.reduce((acc, p) => acc + p.sales_count, 0)}
          </div>
        </div>
      </div>

      {/* Tableau des Produits */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Prix de Base</th>
                <th className="px-6 py-4">Version</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Ventes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <Package className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                    Aucun produit trouvé dans le catalogue.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{p.title_fr}</div>
                      <div className="text-xs text-muted-foreground font-mono">{p.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize">
                        {p.type.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium">
                      {formatPrice(p.base_price_xof, "XOF")}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      v{p.current_version}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={p.status === "published" ? "success" : "warning"}
                        className={
                          p.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }
                      >
                        {p.status === "published" ? "Publié" : "Brouillon"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {p.sales_count}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/produit/${p.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Aperçu public">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
