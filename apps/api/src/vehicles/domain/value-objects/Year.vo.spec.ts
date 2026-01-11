import { describe, expect, it } from 'bun:test'

import { YearValueObject } from './Year.vo'

describe('YearValueObject', () => {
  describe('constructor', () => {
    it('should create a valid YearValueObject with a valid year', () => {
      // TODO(human): Test with 2020
      const year = new YearValueObject(2020)

      expect(year.value).toBe(2020)
    })

    it('should accept minimum year (1900)', () => {
      const year = new YearValueObject(1900)

      expect(year.value).toBe(1900)
    })

    it('should accept maximum year (2030)', () => {
      const year = new YearValueObject(2030)

      expect(year.value).toBe(2030)
    })

    it('should throw an error for year below minimum', () => {
      expect(() => new YearValueObject(1899)).toThrow('Year must be between 1900 and 2030.')
    })

    it('should throw an error for year above maximum', () => {
      expect(() => new YearValueObject(2031)).toThrow('Year must be between 1900 and 2030.')
    })

    it('should throw an error for non-integer value', () => {
      expect(() => new YearValueObject(2020.5)).toThrow('Year must be an integer.')
    })

    it('should throw an error for NaN', () => {
      expect(() => new YearValueObject(NaN)).toThrow('Year must be an integer.')
    })
  })

  describe('equals', () => {
    it('should return true for equal years', () => {
      const year1 = new YearValueObject(2020)
      const year2 = new YearValueObject(2020)

      expect(year1.equals(year2)).toBe(true)
    })

    it('should return false for different years', () => {
      const year1 = new YearValueObject(2020)
      const year2 = new YearValueObject(2021)

      expect(year1.equals(year2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the year as string', () => {
      const year = new YearValueObject(2020)

      expect(year.toString()).toBe('2020')
    })
  })
})
