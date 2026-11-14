"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "", // anti-spam
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return; // bot detected

    if (!form.name || !form.email || !form.message) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simuler l'envoi sécurisé avec validation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "", honeypot: "" });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="accent">Contactez-nous</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Parlons de votre projet ou de vos questions.
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto">
          Notre équipe d&apos;ingénieurs et notre support client vous répondent rapidement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Infos de contact */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl space-y-3">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 w-fit">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Email Officiel</h3>
            <p className="text-xs text-zinc-400">Pour toute demande commerciale ou technique :</p>
            <p className="text-sm font-semibold text-sky-400">contact@yekpondigit.com</p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl space-y-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Support WhatsApp</h3>
            <p className="text-xs text-zinc-400">Disponible du lundi au samedi, de 8h à 19h (GMT+1) :</p>
            <p className="text-sm font-semibold text-emerald-400">+229 01 00 00 00</p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="md:col-span-2 p-8 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl">
          {isSuccess ? (
            <div className="p-8 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Message envoyé avec succès !</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
                Merci de nous avoir contactés. Notre équipe vous répondra par email dans les plus brefs délais.
              </p>
              <Button variant="secondary" onClick={() => setIsSuccess(false)}>
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Honeypot field for bot protection */}
              <input
                type="text"
                name="user_trap"
                value={form.honeypot}
                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nom complet"
                  required
                  placeholder="Ex : Jean Dupont"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  label="Adresse Email"
                  type="email"
                  required
                  placeholder="jean.dupont@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <Input
                label="Objet du message"
                placeholder="Ex : Question sur la démo du projet SaaS"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />

              <Textarea
                label="Votre message"
                required
                rows={5}
                placeholder="Détaillez votre question ou besoin..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              {error && <p className="text-xs font-semibold text-red-400">{error}</p>}

              <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full sm:w-auto">
                <Send className="w-4 h-4 mr-2" />
                Envoyer le message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
