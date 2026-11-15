import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from "@/contexts/currency-context";
import { CartProvider } from "@/contexts/cart-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";

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
      <body className="antialiased selection:bg-sky-500/30 selection:text-sky-200 bg-slate-950 text-white min-h-screen flex flex-col justify-between">
        <CurrencyProvider>
          <CartProvider>
            <Navbar />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
            <CookieBanner />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
