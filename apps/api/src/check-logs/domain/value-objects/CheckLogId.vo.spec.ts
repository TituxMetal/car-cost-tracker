import { describe, expect, it } from 'bun:test'

import { CheckLogIdValueObject } from './CheckLogId.vo'

describe('CheckLogIdValueObject', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000'

  describe('constructor', () => {
    it('should create a valid CheckLogId from a non-empty string', () => {
      const checkLogId = new CheckLogIdValueObject(validUuid)

      expect(checkLogId.value).toBe(validUuid)
    })

    it('should throw an error for an empty string', () => {
      expect(() => new CheckLogIdValueObject('')).toThrow('CheckLogId must be a non-empty string')
    })

    it('should throw an error for a whitespace-only string', () => {
      expect(() => new CheckLogIdValueObject('   ')).toThrow(
        'CheckLogId must be a non-empty string'
      )
    })

    it('should throw an error for invalid UUID format', () => {
      expect(() => new CheckLogIdValueObject('invalid-uuid')).toThrow(
        'CheckLogId must be a valid UUID'
      )
    })
  })

  describe('generate', () => {
    it('should generate a unique CheckLogId', () => {
      const id1 = CheckLogIdValueObject.generate()
      const id2 = CheckLogIdValueObject.generate()

      expect(id1).toBeInstanceOf(CheckLogIdValueObject)
      expect(id2).toBeInstanceOf(CheckLogIdValueObject)
      expect(id1.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(id2.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(id1.value).not.toBe(id2.value)
    })
  })

  describe('equals', () => {
    it('should return true for equal values', () => {
      const id1 = new CheckLogIdValueObject(validUuid)
      const id2 = new CheckLogIdValueObject(validUuid)

      expect(id1.equals(id2)).toBe(true)
    })

    it('should return false for different values', () => {
      const id1 = new CheckLogIdValueObject(validUuid)
      const id2 = new CheckLogIdValueObject('550e8400-e29b-41d4-a716-446655440001')

      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the string value', () => {
      const id = new CheckLogIdValueObject(validUuid)

      expect(id.toString()).toBe(validUuid)
    })
  })
})
