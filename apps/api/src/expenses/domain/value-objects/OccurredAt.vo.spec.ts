import { describe, expect, it } from 'bun:test'

import { OccurredAtValueObject } from './OccurredAt.vo'

describe('OccurredAtValueObject', () => {
  describe('constructor', () => {
    it('should create from a valid YYYY-MM-DD string', () => {
      const occurredAt = new OccurredAtValueObject('2026-03-15')

      expect(occurredAt.value).toBe('2026-03-15')
    })

    it('should accept today as a valid date', () => {
      const today = new Date().toISOString().split('T')[0]
      const occurredAt = new OccurredAtValueObject(today)

      expect(occurredAt.value).toBe(today)
    })

    it('should accept a past date (backdating allowed)', () => {
      const occurredAt = new OccurredAtValueObject('2020-01-01')

      expect(occurredAt.value).toBe('2020-01-01')
    })

    it('should accept a heavily backdated date (no lower bound)', () => {
      const occurredAt = new OccurredAtValueObject('1990-06-15')

      expect(occurredAt.value).toBe('1990-06-15')
    })

    it('should reject invalid format (DD/MM/YYYY)', () => {
      expect(() => new OccurredAtValueObject('15/06/2025')).toThrow(
        'Occurred date must be in YYYY-MM-DD format'
      )
    })

    it('should reject invalid format (missing day)', () => {
      expect(() => new OccurredAtValueObject('2025-06')).toThrow(
        'Occurred date must be in YYYY-MM-DD format'
      )
    })

    it('should reject invalid date values (month 99)', () => {
      expect(() => new OccurredAtValueObject('2025-99-01')).toThrow(
        'Occurred date must be in YYYY-MM-DD format'
      )
    })

    it('should reject a future date', () => {
      expect(() => new OccurredAtValueObject('2099-01-01')).toThrow(
        'Occurred date cannot be in the future'
      )
    })
  })

  describe('value', () => {
    it('should return the original YYYY-MM-DD string', () => {
      const occurredAt = new OccurredAtValueObject('2026-03-15')

      expect(occurredAt.value).toBe('2026-03-15')
    })
  })

  describe('toDate', () => {
    it('should return a Date at UTC midnight', () => {
      const occurredAt = new OccurredAtValueObject('2026-03-15')
      const date = occurredAt.toDate()

      expect(date.getUTCHours()).toBe(0)
      expect(date.getUTCMinutes()).toBe(0)
      expect(date.getUTCSeconds()).toBe(0)
      expect(date.getUTCFullYear()).toBe(2026)
      expect(date.getUTCMonth()).toBe(2)
      expect(date.getUTCDate()).toBe(15)
    })
  })

  describe('equals', () => {
    it('should return true for same date string', () => {
      const occurredAt1 = new OccurredAtValueObject('2026-03-15')
      const occurredAt2 = new OccurredAtValueObject('2026-03-15')

      expect(occurredAt1.equals(occurredAt2)).toBe(true)
    })

    it('should return false for different date strings', () => {
      const occurredAt1 = new OccurredAtValueObject('2026-03-15')
      const occurredAt2 = new OccurredAtValueObject('2025-12-01')

      expect(occurredAt1.equals(occurredAt2)).toBe(false)
    })
  })
})
