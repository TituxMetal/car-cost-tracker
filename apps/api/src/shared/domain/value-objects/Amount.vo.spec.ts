import { describe, expect, it } from 'bun:test'

import { AmountValueObject } from './Amount.vo'

describe('AmountValueObject', () => {
  describe('fromCents', () => {
    it('should create an amount from valid integer cents', () => {
      const amount = AmountValueObject.fromCents(100)

      expect(amount.value).toBe(100)
      expect(amount.toCents()).toBe(100)
      expect(amount.toEuros()).toBe(1)
    })

    it('should create an amount at the maximum cap (100_000_000 cents)', () => {
      const amount = AmountValueObject.fromCents(100_000_000)

      expect(amount.value).toBe(100_000_000)
      expect(amount.toCents()).toBe(100_000_000)
      expect(amount.toEuros()).toBe(1_000_000)
    })

    it('should reject zero cents', () => {
      expect(() => AmountValueObject.fromCents(0)).toThrow('Amount must be strictly positive')
    })

    it('should reject negative cents', () => {
      expect(() => AmountValueObject.fromCents(-5)).toThrow('Amount must be strictly positive')
    })

    it('should reject non-integer cents', () => {
      expect(() => AmountValueObject.fromCents(3.5)).toThrow(
        'Amount must be an integer number of cents'
      )
    })

    it('should reject cents above the cap', () => {
      expect(() => AmountValueObject.fromCents(100_000_001)).toThrow(
        'Amount exceeds the maximum allowed (1 000 000 €)'
      )
    })
  })

  describe('fromEuros', () => {
    it('should convert clean euros to cents', () => {
      const amount = AmountValueObject.fromEuros(89.5)

      expect(amount.toCents()).toBe(8950)
    })

    it('should round half-up (Math.round, not Math.floor)', () => {
      const amount = AmountValueObject.fromEuros(2.995)

      expect(amount.toCents()).toBe(300)
    })

    it('should handle large amounts up to the cap', () => {
      const amount = AmountValueObject.fromEuros(1_000_000)

      expect(amount.toCents()).toBe(100_000_000)
    })

    it('should reject an amount above the cap', () => {
      expect(() => AmountValueObject.fromEuros(1_000_000.01)).toThrow(
        'Amount exceeds the maximum allowed (1 000 000 €)'
      )
    })

    it('should reject zero euros', () => {
      expect(() => AmountValueObject.fromEuros(0)).toThrow('Amount must be strictly positive')
    })
  })

  describe('toEuros', () => {
    it('should convert internal cents back to euros', () => {
      const amount = AmountValueObject.fromCents(8950)

      expect(amount.toEuros()).toBe(89.5)
    })
  })

  describe('equals', () => {
    it('should return true for same cents', () => {
      const amount1 = AmountValueObject.fromCents(100)
      const amount2 = AmountValueObject.fromCents(100)

      expect(amount1.equals(amount2)).toBe(true)
    })

    it('should return false for different cents', () => {
      const amount1 = AmountValueObject.fromCents(100)
      const amount2 = AmountValueObject.fromCents(101)

      expect(amount1.equals(amount2)).toBe(false)
    })
  })
})
