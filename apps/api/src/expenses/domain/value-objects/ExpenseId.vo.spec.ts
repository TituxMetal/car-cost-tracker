import { describe, expect, it } from 'bun:test'

import { ExpenseIdValueObject } from './ExpenseId.vo'

describe('ExpenseIdValueObject', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000'

  describe('constructor', () => {
    it('should create a valid ExpenseId from a non-empty string', () => {
      const expenseId = new ExpenseIdValueObject(validUuid)

      expect(expenseId.value).toBe(validUuid)
    })

    it('should throw an error for an empty string', () => {
      expect(() => new ExpenseIdValueObject('')).toThrow('ExpenseId must be a non-empty string')
    })

    it('should throw an error for a whitespace-only string', () => {
      expect(() => new ExpenseIdValueObject('   ')).toThrow('ExpenseId must be a non-empty string')
    })

    it('should throw an error for invalid UUID format', () => {
      expect(() => new ExpenseIdValueObject('invalid-uuid')).toThrow(
        'ExpenseId must be a valid UUID'
      )
    })
  })

  describe('generate', () => {
    it('should generate a unique ExpenseId', () => {
      const id1 = ExpenseIdValueObject.generate()
      const id2 = ExpenseIdValueObject.generate()

      expect(id1).toBeInstanceOf(ExpenseIdValueObject)
      expect(id2).toBeInstanceOf(ExpenseIdValueObject)
      expect(id1.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(id2.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(id1.value).not.toBe(id2.value)
    })
  })

  describe('equals', () => {
    it('should return true for equal values', () => {
      const id1 = new ExpenseIdValueObject(validUuid)
      const id2 = new ExpenseIdValueObject(validUuid)

      expect(id1.equals(id2)).toBe(true)
    })

    it('should return false for different values', () => {
      const id1 = new ExpenseIdValueObject(validUuid)
      const id2 = new ExpenseIdValueObject('550e8400-e29b-41d4-a716-446655440001')

      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the string value', () => {
      const id = new ExpenseIdValueObject(validUuid)

      expect(id.toString()).toBe(validUuid)
    })
  })
})
