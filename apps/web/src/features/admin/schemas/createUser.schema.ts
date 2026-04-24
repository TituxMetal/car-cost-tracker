import { z } from 'zod'

export const createUserSchema = z.object({
  username: z
    .string()
    .min(1, { error: 'Username is required' })
    .min(3, { error: 'Username must be at least 3 characters long' })
    .max(50, { error: 'Username must not exceed 50 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: 'Username can only contain letters, numbers, and underscores'
    }),
  email: z.email({ error: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { error: 'Password is required' })
    .min(8, { error: 'Password must be at least 8 characters' }),
  firstName: z.string().optional(),
  lastName: z.string().optional()
})

export type CreateUserSchema = z.infer<typeof createUserSchema>
