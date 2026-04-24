import { z } from 'zod'

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { error: 'Password is required' })
    .min(8, { error: 'Password must be at least 8 characters' })
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
