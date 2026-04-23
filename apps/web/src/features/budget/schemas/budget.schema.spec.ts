import { describe, expect, it } from 'bun:test'

import { upsertBudgetSchema } from './budget.schema'

describe('upsertBudgetSchema', () => {
  describe('happy path', () => {
    it('accepts an integer amount and maps "1000" to 100000 cents', () => {
      const result = upsertBudgetSchema.safeParse({
        amountInput: '1000',
        period: 'MONTHLY'
      })

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.amountInput).toBe(100000)
      }
    })

    it('accepts a comma-decimal amount and maps "1000,50" to 100050 cents', () => {
      const result = upsertBudgetSchema.safeParse({
        amountInput: '1000,50',
        period: 'MONTHLY'
      })

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.amountInput).toBe(100050)
      }
    })

    it('accepts a dot-decimal amount and maps "1000.50" to 100050 cents', () => {
      const result = upsertBudgetSchema.safeParse({
        amountInput: '1000.50',
        period: 'MONTHLY'
      })

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.amountInput).toBe(100050)
      }
    })

    it('accepts ANNUAL as a valid period', () => {
      const result = upsertBudgetSchema.safeParse({
        amountInput: '1000',
        period: 'ANNUAL'
      })

      expect(result.success).toBe(true)
    })
  })

  describe('amountInput', () => {
    it('rejects an empty string with a "requis" message', () => {
      const result = upsertBudgetSchema.safeParse({
        amountInput: '',
        period: 'MONTHLY'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['amountInput'])
        expect(result.error?.issues[0].message).toMatch(/requis/)
      }
    })

    it('rejects non-numeric input with a "Montant invalide" style message', () => {
      const result = upsertBudgetSchema.safeParse({
        amountInput: 'invalid',
        period: 'MONTHLY'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['amountInput'])
        expect(result.error?.issues[0].message).toMatch(/Montant invalide/)
      }
    })

    it('rejects zero with a "strictement positif" message', () => {
      const result = upsertBudgetSchema.safeParse({
        amountInput: '0',
        period: 'MONTHLY'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['amountInput'])
        expect(result.error?.issues[0].message).toMatch(/strictement positif/)
      }
    })

    it('rejects an amount above the sanity cap (1 000 000 €)', () => {
      const result = upsertBudgetSchema.safeParse({
        amountInput: '1000000,01',
        period: 'MONTHLY'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['amountInput'])
        expect(result.error?.issues[0].message).toMatch(/limite maximale autorisée/)
      }
    })
  })

  describe('period', () => {
    it('rejects an unknown period', () => {
      const result = upsertBudgetSchema.safeParse({
        amountInput: '1000',
        period: 'WEEKLY'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['period'])
        expect(result.error?.issues[0].message).toMatch(/mensuelle ou annuelle/)
      }
    })

    it('rejects a missing period', () => {
      const result = upsertBudgetSchema.safeParse({
        amountInput: '1000'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['period'])
        expect(result.error?.issues[0].message).toMatch(/mensuelle ou annuelle/)
      }
    })
  })
})
