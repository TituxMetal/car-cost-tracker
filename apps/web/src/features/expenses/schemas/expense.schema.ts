import { z } from 'zod'

import { formatEuros, parseEurosToCents } from '../utils/amount.utils'
import { getTodayLocalISO } from '../utils/date.utils'

const AMOUNT_MAX_CENTS = 100000000 // 1 million euros

export const createExpenseSchema = z.object({
  occurredAt: z
    .string({ error: `Le champ 'occurredAt' est requis.` })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      error: `Le champ 'occurredAt' doit être une date au format YYYY-MM-DD.`
    })
    .refine(dateString => !isNaN(Date.parse(dateString)), {
      error: `Le champ 'occurredAt' doit être une date valide.`
    })
    .refine(dateString => dateString <= getTodayLocalISO(), {
      error: `Le champ 'occurredAt' ne peut pas être une date future.`
    }),
  amountInput: z
    .string({ error: 'Le montant est requis.' })
    .min(1, { error: 'Le montant est requis.' })
    .transform((raw, ctx) => {
      try {
        return parseEurosToCents(raw)
      } catch {
        ctx.addIssue({ code: 'custom', message: 'Montant invalide.' })

        return z.NEVER
      }
    })
    .refine(cents => cents > 0, { error: 'Le montant doit être supérieur à zéro.' })
    .refine(cents => cents <= AMOUNT_MAX_CENTS, {
      error: `Le montant doit être inférieur ou égal à ${formatEuros(AMOUNT_MAX_CENTS)}.`
    }),
  category: z.enum(['SERVICE', 'PARTS', 'LABOR', 'OTHER'], {
    error: `Le champ 'category' doit être l'une des valeurs suivantes : SERVICE, PARTS, LABOR, OTHER.`
  }),
  description: z
    .string()
    .max(500, { error: `Le champ 'description' ne peut pas dépasser 500 caractères.` })
    .optional()
})

export const updateExpenseSchema = createExpenseSchema.partial()

export type CreateExpenseSchema = z.infer<typeof createExpenseSchema>
export type UpdateExpenseSchema = z.infer<typeof updateExpenseSchema>
export type CreateExpenseFormValues = z.input<typeof createExpenseSchema>
export type UpdateExpenseFormValues = z.input<typeof updateExpenseSchema>
