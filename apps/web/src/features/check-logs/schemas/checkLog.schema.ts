import { z } from 'zod'

export const createCheckLogSchema = z.object({
  completedAt: z
    .string({ error: `Le champ 'completedAt' est requis.` })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      error: `Le champ 'completedAt' doit être une date au format YYYY-MM-DD.`
    })
    .refine(
      dateString => {
        const today = new Date()
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
        return dateString <= todayStr
      },
      { error: `Le champ 'completedAt' ne peut pas être une date future.` }
    ),
  notes: z
    .string()
    .max(500, { error: `Le champ 'notes' ne peut pas dépasser 500 caractères.` })
    .optional()
})

export type CreateCheckLogSchema = z.infer<typeof createCheckLogSchema>
