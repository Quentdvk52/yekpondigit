import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Mentions Légales — YEKPON DIGIT",
  description: "Informations légales relatives à l'éditeur et à l'hébergement du site YEKPON DIGIT.",
};

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-8 text-zinc-300 text-sm leading-relaxed">
      <div className="space-y-2">
        <Badge variant="default">Informations Légales</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mentions Légales
        </h1>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">1. Éditeur de la Plateforme</h2>
        <p>
          Le site <strong>YEKPON DIGIT</strong> (accessible à l&apos;adresse <code>https://yekpondigit.com</code>) est édité par l&apos;entreprise <strong>YEKPON DIGIT</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-zinc-400">
          <li><strong>Siège social :</strong> Cotonou, République du Bénin</li>
          <li><strong>Email de contact :</strong> contact@yekpondigit.com</li>
          <li><strong>Directeur de la publication :</strong> Quentin D. (Fondateur & Lead Ingénieur)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">2. Hébergement & Infrastructure</h2>
        <p>
          L&apos;infrastructure applicative et les bases de données sont propulsées par :
        </p>
        <ul className="list-disc pl-5 space-y-1 text-zinc-400">
          <li><strong>Hébergement Frontend & Edge :</strong> Vercel Inc., 340 S Lemon Ave #1142 Walnut, CA 91789, USA.</li>
          <li><strong>Base de Données Serverless :</strong> Neon Inc., San Francisco, CA, USA.</li>
          <li><strong>Stockage d&apos;Objets Sécurisé :</strong> Stockage Cloud chiffré compatible S3.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">3. Propriété Intellectuelle</h2>
        <p>
          La marque YEKPON DIGIT, les éléments graphiques, logos, codes de la plateforme, interfaces utilisateur et contenus éditoriaux sont protégés par le droit de la propriété intellectuelle. Toute reproduction non autorisée constitue une contrefaçon.
        </p>
      </section>
    </div>
  );
}
