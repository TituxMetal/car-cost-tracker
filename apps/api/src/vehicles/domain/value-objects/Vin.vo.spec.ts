import { describe, expect, it } from 'bun:test'

import { VinValueObject } from './Vin.vo'

describe('VinValueObject', () => {
  const validVin = 'WVWZZZ3CZWE123456'

  describe('constructor', () => {
    it('should create a valid VinValueObject with a valid VIN', () => {
      const vin = new VinValueObject(validVin)

      expect(vin.value).toBe(validVin)
    })

    it('should store VIN in uppercase', () => {
      const lowercaseVin = 'vwvzzz3czwe123456'
      const vin = new VinValueObject(lowercaseVin)

      expect(vin.value).toBe(lowercaseVin.toUpperCase())
    })

    it('should throw an error for empty string', () => {
      expect(() => new VinValueObject('')).toThrow('VIN must be a non-empty string.')
    })

    it('should throw an error for VIN with wrong length', () => {
      const errorMessage = 'VIN must be exactly 17 characters long.'

      expect(() => new VinValueObject('SHORTVIN123')).toThrow(errorMessage)
      expect(() => new VinValueObject('TOOLONGVIN1234567890')).toThrow(errorMessage)
    })

    it('should throw an error for VIN containing letter I, O or Q', () => {
      const errorMessage = 'VIN must be alphanumeric and cannot contain I, O, or Q.'

      expect(() => new VinValueObject('WVWZZZ3CZIWE12345')).toThrow(errorMessage)
      expect(() => new VinValueObject('WVWZZZ3CZOWE12345')).toThrow(errorMessage)
      expect(() => new VinValueObject('WVWZZZ3CZQWE12345')).toThrow(errorMessage)
    })

    it('should throw an error for VIN with special characters', () => {
      expect(() => new VinValueObject('WVWZZZ3CZ@WE12345')).toThrow(
        'VIN must be alphanumeric and cannot contain I, O, or Q.'
      )
    })
  })

  describe('equals', () => {
    it('should return true for equal VINs', () => {
      const vin1 = new VinValueObject(validVin)
      const vin2 = new VinValueObject(validVin)

      expect(vin1.equals(vin2)).toBe(true)
    })

    it('should return false for different VINs', () => {
      const vin1 = new VinValueObject(validVin)
      const vin2 = new VinValueObject('WVWZZZ3CZWE654321')

      expect(vin1.equals(vin2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the VIN string', () => {
      const vin = new VinValueObject(validVin)

      expect(vin.toString()).toBe(validVin)
    })
  })
})
