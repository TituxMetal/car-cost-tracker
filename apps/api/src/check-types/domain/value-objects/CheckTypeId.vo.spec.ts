import { describe, expect, it } from 'bun:test'

import { CheckTypeIdValueObject } from './CheckTypeId.vo'

describe('CheckTypeIdValueObject', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000'

  describe('constructor', () => {
    it('should create a valid CheckTypeId from a non-empty string', () => {
      const checkTypeId = new CheckTypeIdValueObject(validUuid)

      expect(checkTypeId.value).toBe(validUuid)
    })

    it('should throw an error for an empty string', () => {
      expect(() => new CheckTypeIdValueObject('')).toThrow('CheckTypeId must be a non-empty string')
    })

    it('should throw an error for a whitespace-only string', () => {
      expect(() => new CheckTypeIdValueObject('   ')).toThrow(
        'CheckTypeId must be a non-empty string'
      )
    })
  })

  describe('generate', () => {
    it('should generate a unique CheckTypeId', () => {
      const id1 = CheckTypeIdValueObject.generate()
      const id2 = CheckTypeIdValueObject.generate()

      expect(id1).toBeInstanceOf(CheckTypeIdValueObject)
      expect(id2).toBeInstanceOf(CheckTypeIdValueObject)
      expect(id1.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(id2.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(id1.value).not.toBe(id2.value)
    })
  })

  describe('equals', () => {
    it('should return true for equal values', () => {
      const id1 = new CheckTypeIdValueObject(validUuid)
      const id2 = new CheckTypeIdValueObject(validUuid)

      expect(id1.equals(id2)).toBe(true)
    })

    it('should return false for different values', () => {
      const id1 = new CheckTypeIdValueObject(validUuid)
      const id2 = new CheckTypeIdValueObject('550e8400-e29b-41d4-a716-446655440001')

      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the string value', () => {
      const id = new CheckTypeIdValueObject(validUuid)

      expect(id.toString()).toBe(validUuid)
    })
  })
})
