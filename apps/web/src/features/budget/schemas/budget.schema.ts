import { z } from 'zod'

import { parseEurosToCents } from '~/shared/utils'

export const upsertBudgetSchema = z.object({
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
    .refine(cents => cents > 0, { error: 'Le montant doit être strictement positif.' })
    .refine(cents => cents <= 100000000, {
      error: 'Le montant dépasse la limite maximale autorisée.'
    }),
  period: z.enum(['MONTHLY', 'ANNUAL'], { error: 'La période doit être mensuelle ou annuelle.' })
})

export type UpsertBudgetFormValues = z.input<typeof upsertBudgetSchema>
export type UpsertBudgetParsed = z.output<typeof upsertBudgetSchema>
