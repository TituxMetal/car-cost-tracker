import { z } from 'zod'

// Login schema
export const loginSchema = z.object({
  email: z.email({ error: 'Adresse email invalide' }),
  password: z
    .string()
    .min(1, { error: 'Mot de passe requis' })
    .min(8, { error: 'Le mot de passe doit contenir au moins 8 caractères' })
})

// Signup schema
export const signupSchema = z.object({
  username: z
    .string()
    .min(1, { error: "Nom d'utilisateur requis" })
    .min(3, { error: "Le nom d'utilisateur doit contenir au moins 3 caractères" })
    .max(50, { error: "Le nom d'utilisateur ne doit pas dépasser 50 caractères" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et tirets bas"
    }),
  email: z.email({ error: 'Adresse email invalide' }),
  password: z
    .string()
    .min(1, { error: 'Mot de passe requis' })
    .min(8, { error: 'Le mot de passe doit contenir au moins 8 caractères' })
})

export const forgotPasswordSchema = z.object({
  email: z.email({ error: 'Adresse email invalide' })
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { error: 'Mot de passe requis' })
      .min(8, { error: 'Le mot de passe doit contenir au moins 8 caractères' }),
    confirmPassword: z.string().min(1, { error: 'Veuillez confirmer votre mot de passe' })
  })
  .refine(data => data.password === data.confirmPassword, {
    error: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  })

// Types
export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
export type AuthSchema = LoginSchema | SignupSchema
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
