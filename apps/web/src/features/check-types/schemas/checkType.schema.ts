import { z } from 'zod'

export const createCheckTypeSchema = z.object({
  name: z
    .string({ error: 'Le nom est requis.' })
    .min(5, { error: 'Le nom doit comporter au moins 5 caractères.' })
    .max(100, { error: 'Le nom doit comporter au maximum 100 caractères.' }),
  intervalDays: z
    .number({ error: `L'intervalle en jours est requis.` })
    .int({ error: `L'intervalle en jours doit être un entier.` })
    .min(1, { error: `L'intervalle en jours doit être au moins de 1.` }),
  description: z
    .string()
    .max(500, { error: 'La description doit comporter au maximum 500 caractères.' })
    .nullable()
    .optional()
})

export const updateCheckTypeSchema = createCheckTypeSchema.partial()

export type CreateCheckTypeSchema = z.infer<typeof createCheckTypeSchema>
export type UpdateCheckTypeSchema = z.infer<typeof updateCheckTypeSchema>
