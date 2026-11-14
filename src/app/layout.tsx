import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YEKPON DIGIT — Bibliothèque & Boutique de Logiciels Clés en Main",
  description:
    "Achetez des projets logiciels premium prêts à l'emploi : sites web, applications SaaS, applications mobiles Flutter & React Native, logiciels desktop et templates.",
  keywords: ["logiciels", "projets clés en main", "SaaS", "applications mobiles", "templates", "YEKPON DIGIT"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <div className="relative min-h-screen flex flex-col justify-between">
          {children}
        </div>
      </body>
    </html>
  );
}
