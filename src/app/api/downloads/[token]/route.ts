import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { DownloadService } from "@/server/downloads/service";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: "Jeton de téléchargement manquant." }, { status: 400 });
  }

  const headerList = await headers();
  const rawIp = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";

  try {
    const { presignedUrl } = await DownloadService.processDownload(token, rawIp);
    // Redirection immédiate vers l'URL signée temporaire S3
    return NextResponse.redirect(presignedUrl, { status: 302 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Échec du téléchargement sécurisé." },
      { status: 403 }
    );
  }
}
