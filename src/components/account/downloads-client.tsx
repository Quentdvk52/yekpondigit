"use client";

import { useState } from "react";
import {
  Download,
  FileArchive,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { requestDownloadAction } from "@/app/actions/download-actions";

interface DeliverableFile {
  id: string;
  productTitle: string;
  productSlug: string;
  version: string;
  licenseId: string;
  label: string;
  fileName: string;
  sizeFormatted: string;
  storagePath: string;
  sha256: string;
  type: "zip" | "pdf";
}

export function DownloadsClient() {
  const [files] = useState<DeliverableFile[]>([
    {
      id: "f_1",
      productTitle: "YekponStore — E-Commerce Multivendeur Clé en Main",
      productSlug: "demo-yekpon-store-ecommerce",
      version: "v1.2.0",
      licenseId: "lic_1",
      label: "Archive Source Complète (Next.js 15 + PostgreSQL + Tailwind 4)",
      fileName: "yekponstore-source-v1.2.0.zip",
      sizeFormatted: "48.2 Mo",
      storagePath: "products/demo/1/source-v1.zip",
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      type: "zip",
    },
    {
      id: "f_2",
      productTitle: "YekponStore — E-Commerce Multivendeur Clé en Main",
      productSlug: "demo-yekpon-store-ecommerce",
      version: "v1.2.0",
      licenseId: "lic_1",
      label: "Guide de Déploiement & Configuration Passerelles Mobile Money",
      fileName: "guide-installation-yekponstore.pdf",
      sizeFormatted: "3.5 Mo",
      storagePath: "products/demo/1/guide-v1.pdf",
      sha256: "a1b2c3d4e5f60123456789abcdef0123456789abcdef0123456789abcdef0123",
      type: "pdf",
    },
    {
      id: "f_3",
      productTitle: "SchoolDesk — SaaS Gestion Scolaire & Universitaire",
      productSlug: "demo-schooldesk-gestion-scolaire",
      version: "v2.0.1",
      licenseId: "lic_2",
      label: "Archive Source SaaS Multi-Campus & Docker Compose",
      fileName: "schooldesk-saas-v2.0.1.zip",
      sizeFormatted: "62.8 Mo",
      storagePath: "products/demo/2/schooldesk-v2.zip",
      sha256: "d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123456789a",
      type: "zip",
    },
  ]);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedSha, setCopiedSha] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2500);
  };

  const handleDownload = async (file: DeliverableFile) => {
    setDownloadingId(file.id);
    setDownloadError(null);

    try {
      const res = await requestDownloadAction(file.licenseId, file.id, file.storagePath);

      if (!res.success || !res.downloadUrl) {
        setDownloadError(res.error || "Impossible de générer le lien de téléchargement.");
        setDownloadingId(null);
        return;
      }

      // Déclenchement du téléchargement via redirection vers la route API signée
      window.location.href = res.downloadUrl;
    } catch {
      setDownloadError("Une erreur inattendue est survenue.");
    } finally {
      setTimeout(() => setDownloadingId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Download className="w-5 h-5 text-sky-400" />
            <span>Fichiers Livrables &amp; Codes Sources</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Téléchargement sécurisé par URLs signées privées S3 (validité 120 secondes).
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/20 border border-border/60 text-xs">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-muted-foreground">Quota ce mois : </span>
          <strong className="text-foreground font-mono">10 / 10</strong>
        </div>
      </div>

      {downloadError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{downloadError}</span>
        </div>
      )}

      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="rounded-2xl border border-border/80 bg-card p-6 shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
                  {file.type === "zip" ? (
                    <FileArchive className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">
                      {file.productTitle}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {file.version}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-foreground">{file.label}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span>{file.fileName}</span>
                    <span>•</span>
                    <span className="text-foreground font-bold">{file.sizeFormatted}</span>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                disabled={downloadingId === file.id}
                onClick={() => handleDownload(file)}
                className="gap-2 font-bold shadow-md shadow-sky-500/20 shrink-0"
              >
                {downloadingId === file.id ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Génération lien S3...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger ({file.sizeFormatted})</span>
                  </>
                )}
              </Button>
            </div>

            {/* Empreinte SHA-256 pour intégrité vérifiable */}
            <div className="rounded-xl border border-border/50 bg-muted/10 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-muted-foreground text-[11px] shrink-0">SHA-256 :</span>
                <code className="font-mono text-[11px] text-zinc-300 truncate">
                  {file.sha256}
                </code>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleCopySha(file.sha256)}
                className="h-7 px-2 text-[11px] gap-1 shrink-0 self-end sm:self-auto hover:bg-white/10"
              >
                {copiedSha === file.sha256 ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copier le hash</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
