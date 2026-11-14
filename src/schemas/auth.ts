import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Veuillez saisir une adresse email valide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères."),
  totpCode: z
    .string()
    .regex(/^\d{6}$/, "Le code d'authentification doit comporter 6 chiffres.")
    .optional(),
});

export const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Veuillez saisir une adresse email valide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères.")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule.")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule.")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre."),
  fullName: z
    .string()
    .trim()
    .min(2, "Le nom complet doit comporter au moins 2 caractères."),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{8,20}$/, "Format de numéro de téléphone invalide.")
    .optional(),
  country: z.string().length(2).default("BJ"),
  cgvAccepted: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions générales de vente." }),
  }),
});

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Le nom doit comporter au moins 2 caractères.")
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{8,20}$/, "Format de téléphone invalide.")
    .optional(),
  country: z.string().length(2).optional(),
  locale: z.enum(["fr", "en"]).default("fr"),
});

export const totpVerifySchema = z.object({
  code: z
    .string()
    .length(6, "Le code TOTP doit comporter exactement 6 chiffres.")
    .regex(/^\d{6}$/, "Le code ne doit contenir que des chiffres."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type TotpVerifyInput = z.infer<typeof totpVerifySchema>;
