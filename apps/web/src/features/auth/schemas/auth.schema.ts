import { z } from 'zod'

// Login schema
export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { error: 'Password is required' })
    .min(8, { error: 'Password must be at least 8 characters' })
})

// Signup schema
export const signupSchema = z.object({
  name: z.string().optional(),
  username: z
    .string()
    .min(1, { error: 'Username is required' })
    .min(3, { error: 'Username must be at least 3 characters long' })
    .max(50, { error: 'Username must not exceed 50 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: 'Username can only contain letters, numbers, and underscores'
    }),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(1, { error: 'Password is required' })
    .min(8, { error: 'Password must be at least 8 characters' })
})

export const forgotPasswordSchema = z.object({
  email: z.email({ error: 'Invalid email address' })
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { error: 'Password is required' })
      .min(8, { error: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(1, { error: 'Please confirm your password' })
  })
  .refine(data => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword']
  })

// Types
export type LoginSchema = z.infer<typeof loginSchema>
export type SignupSchema = z.infer<typeof signupSchema>
export type AuthSchema = LoginSchema | SignupSchema
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
