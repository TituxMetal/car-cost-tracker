import { describe, expect, it } from 'bun:test'

import { CHECK_TYPE_VALIDATION as checkTypeValidation } from '../validation'

import { CheckTypeNameValueObject } from './CheckTypeName.vo'

describe('CheckTypeNameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid name from a non-empty string', () => {
      const name = new CheckTypeNameValueObject('Oil Level Check')

      expect(name.value).toBe('Oil Level Check')
    })

    it('should trim whitespace from the value', () => {
      const name = new CheckTypeNameValueObject('  Tire Pressure Check  ')

      expect(name.value).toBe('Tire Pressure Check')
    })

    it('should throw an error for an empty string', () => {
      expect(() => new CheckTypeNameValueObject('')).toThrow(
        'CheckTypeName must be a non-empty string'
      )
    })

    it('should throw an error for a whitespace-only string', () => {
      expect(() => new CheckTypeNameValueObject('     ')).toThrow(
        'CheckTypeName must be a non-empty string'
      )
    })

    it('should throw an error for a name shorter than minimum length', () => {
      const shortName = 'a'.repeat(checkTypeValidation.NAME.MIN_LENGTH - 1)

      expect(() => new CheckTypeNameValueObject(shortName)).toThrow(
        `CheckTypeName must be at least ${checkTypeValidation.NAME.MIN_LENGTH} characters long`
      )
    })

    it('should throw an error for a name exceeding maximum length', () => {
      const longName = 'a'.repeat(checkTypeValidation.NAME.MAX_LENGTH + 1)

      expect(() => new CheckTypeNameValueObject(longName)).toThrow(
        `CheckTypeName must not exceed ${checkTypeValidation.NAME.MAX_LENGTH} characters`
      )
    })

    it('should accept a name of exactly maximum length', () => {
      const exactName = 'a'.repeat(checkTypeValidation.NAME.MAX_LENGTH)

      const name = new CheckTypeNameValueObject(exactName)

      expect(name.value).toBe(exactName)
    })
  })

  describe('equals', () => {
    it('should return true for equal values', () => {
      const name1 = new CheckTypeNameValueObject('Brake Check')
      const name2 = new CheckTypeNameValueObject('Brake Check')

      expect(name1.equals(name2)).toBe(true)
    })

    it('should return false for different values', () => {
      const name1 = new CheckTypeNameValueObject('Brake Check')
      const name2 = new CheckTypeNameValueObject('Oil Level Check')

      expect(name1.equals(name2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the string value', () => {
      const name = new CheckTypeNameValueObject('Brake Check')

      expect(name.toString()).toBe('Brake Check')
    })
  })
})
