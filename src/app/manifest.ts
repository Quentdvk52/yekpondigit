import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YEKPON DIGIT — Logiciels Clés en Main",
    short_name: "YEKPON DIGIT",
    description:
      "La 1ère bibliothèque de solutions logicielles clés en main d'Afrique. SaaS, Apps mobiles, code source complet avec paiement Mobile Money.",
    start_url: "/",
    display: "standalone",
    background_color: "#090d16",
    theme_color: "#090d16",
    orientation: "portrait",
    categories: ["business", "developer", "finance", "productivity"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
