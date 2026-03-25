import { describe, expect, it } from 'bun:test'

import { CHECK_LOG_VALIDATION } from '../validation'

import { CompletedAtValueObject } from './CompletedAt.vo'

describe('CompletedAtValueObject', () => {
  describe('constructor', () => {
    it('should create from a valid YYYY-MM-DD string', () => {
      const completedAt = new CompletedAtValueObject('2026-03-15')

      expect(completedAt.value).toBe('2026-03-15')
    })

    it('should accept today as a valid date', () => {
      const today = new Date().toISOString().split('T')[0]
      const completedAt = new CompletedAtValueObject(today)

      expect(completedAt.value).toBe(today)
    })

    it('should accept a past date', () => {
      const completedAt = new CompletedAtValueObject('2020-01-01')

      expect(completedAt.value).toBe('2020-01-01')
    })

    it('should reject invalid format (DD/MM/YYYY)', () => {
      expect(() => new CompletedAtValueObject('15/06/2025')).toThrow(
        CHECK_LOG_VALIDATION.COMPLETED_AT.MESSAGE
      )
    })

    it('should reject invalid format (missing day)', () => {
      expect(() => new CompletedAtValueObject('2025-06')).toThrow(
        CHECK_LOG_VALIDATION.COMPLETED_AT.MESSAGE
      )
    })

    it('should reject invalid date values (month 99)', () => {
      expect(() => new CompletedAtValueObject('2025-99-01')).toThrow(
        CHECK_LOG_VALIDATION.COMPLETED_AT.MESSAGE
      )
    })

    it('should reject a future date', () => {
      expect(() => new CompletedAtValueObject('2099-01-01')).toThrow(
        CHECK_LOG_VALIDATION.COMPLETED_AT.FUTURE_MESSAGE
      )
    })
  })

  describe('value', () => {
    it('should return the original YYYY-MM-DD string', () => {
      const completedAt = new CompletedAtValueObject('2026-03-15')

      expect(completedAt.value).toBe('2026-03-15')
    })
  })

  describe('toDate', () => {
    it('should return a Date at UTC midnight', () => {
      const completedAt = new CompletedAtValueObject('2026-03-15')
      const date = completedAt.toDate()

      expect(date.getUTCHours()).toBe(0)
      expect(date.getUTCMinutes()).toBe(0)
      expect(date.getUTCSeconds()).toBe(0)
      expect(date.getUTCFullYear()).toBe(2026)
      expect(date.getUTCMonth()).toBe(2) // Months are 0-indexed
      expect(date.getUTCDate()).toBe(15)
    })
  })

  describe('equals', () => {
    it('should return true for same date string', () => {
      const completedAt1 = new CompletedAtValueObject('2026-03-15')
      const completedAt2 = new CompletedAtValueObject('2026-03-15')

      expect(completedAt1.equals(completedAt2)).toBe(true)
    })

    it('should return false for different date strings', () => {
      const completedAt1 = new CompletedAtValueObject('2026-03-15')
      const completedAt2 = new CompletedAtValueObject('2025-12-01')

      expect(completedAt1.equals(completedAt2)).toBe(false)
    })
  })
})
