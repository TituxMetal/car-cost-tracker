import { describe, expect, it } from 'bun:test'

import { getTodayLocalISO } from '../utils/date.utils'

import { createExpenseSchema, updateExpenseSchema } from './expense.schema'

describe('createExpenseSchema', () => {
  describe('happy path', () => {
    it('validates a full valid payload', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '2020-01-01',
        amountInput: '89,50',
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.amountInput).toBe(8950)
      }
    })

    it('validates without the optional description', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '2020-01-01',
        amountInput: '89,50',
        category: 'SERVICE'
      })

      expect(result.success).toBe(true)
    })

    it('transforms amountInput from a comma string to cents', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '2020-01-01',
        amountInput: '89,50',
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.amountInput).toBe(8950)
      }
    })

    it('transforms amountInput from a dot string to cents', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '2020-01-01',
        amountInput: '89.50',
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.amountInput).toBe(8950)
      }
    })
  })

  describe('occurredAt', () => {
    it('rejects a missing occurredAt', () => {
      const result = createExpenseSchema.safeParse({
        // occurredAt missing
        amountInput: '89,50',
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['occurredAt'])
        expect(result.error?.issues[0].message).toMatch(/requis/)
      }
    })

    it('rejects a malformed date', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '15/06/2025', // invalid format
        amountInput: '89,50',
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['occurredAt'])
        expect(result.error?.issues[0].message).toMatch(/date/)
      }
    })

    it('rejects a date in the future', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '2099-01-01', // future date
        amountInput: '89,50',
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['occurredAt'])
        expect(result.error?.issues[0].message).toMatch(/future/)
      }
    })

    it('accepts today', () => {
      const today = getTodayLocalISO()
      const result = createExpenseSchema.safeParse({
        occurredAt: today,
        amountInput: '89,50',
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(true)
    })

    it('accepts a backdated date (years ago)', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '2020-01-01',
        amountInput: '89,50',
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(true)
    })
  })

  describe('amountInput', () => {
    it('rejects an empty string', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '2020-01-01',
        amountInput: '', // empty
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['amountInput'])
        expect(result.error?.issues[0].message).toMatch(/montant/)
      }
    })

    it('rejects zero', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '2020-01-01',
        amountInput: '0', // zero
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['amountInput'])
        expect(result.error?.issues[0].message).toMatch(/supérieur à zéro/)
      }
    })

    it('rejects amounts above the sanity cap (1 000 000 €)', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '2020-01-01',
        amountInput: '1000000,01', // just above the cap
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['amountInput'])
        expect(result.error?.issues[0].message).toMatch(/inférieur ou égal/)
      }
    })

    it('rejects non-numeric input', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '2020-01-01',
        amountInput: 'abc', // non-numeric
        category: 'SERVICE',
        description: 'Oil change'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['amountInput'])
        expect(result.error?.issues[0].message).toMatch(/Montant invalide/)
      }
    })
  })

  describe('category', () => {
    it('accepts each valid category', () => {
      const validCategories = ['SERVICE', 'PARTS', 'LABOR', 'OTHER']

      for (const category of validCategories) {
        const result = createExpenseSchema.safeParse({
          occurredAt: '2020-01-01',
          amountInput: '89,50',
          category,
          description: 'Oil change'
        })

        expect(result.success).toBe(true)
      }
    })

    it('rejects an unknown category', () => {
      const result = createExpenseSchema.safeParse({
        occurredAt: '2020-01-01',
        amountInput: '89,50',
        category: 'FOOD', // unknown category
        description: 'Lunch'
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['category'])
        expect(result.error?.issues[0].message).toMatch(/valeurs suivantes/)
      }
    })
  })

  describe('description', () => {
    it('rejects a description longer than 500 characters', () => {
      const longDescription = 'a'.repeat(501) // 501 characters
      const result = createExpenseSchema.safeParse({
        occurredAt: '2020-01-01',
        amountInput: '89,50',
        category: 'SERVICE',
        description: longDescription
      })

      expect(result.success).toBe(false)

      if (!result.success) {
        expect(result.error?.issues[0].path).toEqual(['description'])
        expect(result.error?.issues[0].message).toMatch(/500 caractères/)
      }
    })
  })
})

describe('updateExpenseSchema', () => {
  it('accepts an empty object (all fields optional)', () => {
    const result = updateExpenseSchema.safeParse({})

    expect(result.success).toBe(true)
  })

  it('accepts a partial update with a single field', () => {
    const result = updateExpenseSchema.safeParse({ category: 'PARTS' })

    expect(result.success).toBe(true)
  })

  it('still enforces field constraints when present', () => {
    const result = updateExpenseSchema.safeParse({ category: 'FOOD' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error?.issues[0].path).toEqual(['category'])
      expect(result.error?.issues[0].message).toMatch(
        /Le champ 'category' doit être l'une des valeurs suivantes : SERVICE, PARTS, LABOR, OTHER./
      )
    }
  })

  it('transforms amountInput on partial update', () => {
    const result = updateExpenseSchema.safeParse({ amountInput: '89,50' })

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.amountInput).toBe(8950)
    }
  })
})
