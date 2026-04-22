import { describe, expect, it } from 'bun:test'

import { BudgetIdValueObject } from './BudgetId.vo'

describe('BudgetIdValueObject', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000'

  describe('constructor', () => {
    it('should create a valid BudgetId from a non-empty string', () => {
      const budgetId = new BudgetIdValueObject(validUuid)

      expect(budgetId.value).toBe(validUuid)
    })

    it('should throw an error for an empty string', () => {
      expect(() => new BudgetIdValueObject('')).toThrow('BudgetId must be a non-empty string')
    })

    it('should throw an error for a whitespace-only string', () => {
      expect(() => new BudgetIdValueObject('   ')).toThrow('BudgetId must be a non-empty string')
    })

    it('should throw an error for invalid UUID format', () => {
      expect(() => new BudgetIdValueObject('invalid-uuid')).toThrow('BudgetId must be a valid UUID')
    })
  })

  describe('generate', () => {
    it('should generate a unique BudgetId', () => {
      const id1 = BudgetIdValueObject.generate()
      const id2 = BudgetIdValueObject.generate()

      expect(id1).toBeInstanceOf(BudgetIdValueObject)
      expect(id2).toBeInstanceOf(BudgetIdValueObject)
      expect(id1.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(id2.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(id1.value).not.toBe(id2.value)
    })
  })

  describe('equals', () => {
    it('should return true for equal values', () => {
      const id1 = new BudgetIdValueObject(validUuid)
      const id2 = new BudgetIdValueObject(validUuid)

      expect(id1.equals(id2)).toBe(true)
    })

    it('should return false for different values', () => {
      const id1 = new BudgetIdValueObject(validUuid)
      const id2 = new BudgetIdValueObject('550e8400-e29b-41d4-a716-446655440001')

      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the string value', () => {
      const id = new BudgetIdValueObject(validUuid)

      expect(id.toString()).toBe(validUuid)
    })
  })
})
