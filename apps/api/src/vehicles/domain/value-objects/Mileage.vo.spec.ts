import { describe, expect, it } from 'bun:test'

import { MileageValueObject } from './Mileage.vo'

describe('MileageValueObject', () => {
  describe('constructor', () => {
    it('should create a valid MileageValueObject with positive value', () => {
      const mileage = new MileageValueObject(50000)

      expect(mileage.value).toBe(50000)
    })

    it('should accept zero mileage', () => {
      const mileage = new MileageValueObject(0)

      expect(mileage.value).toBe(0)
    })

    it('should throw an error for negative mileage', () => {
      expect(() => new MileageValueObject(-1)).toThrow('Mileage must be a non-negative integer.')
    })

    it('should throw an error for non-integer value', () => {
      expect(() => new MileageValueObject(50000.5)).toThrow(
        'Mileage must be a non-negative integer.'
      )
    })

    it('should throw an error for NaN', () => {
      expect(() => new MileageValueObject(NaN)).toThrow('Mileage must be a non-negative integer.')
    })
  })

  describe('equals', () => {
    it('should return true for equal mileages', () => {
      const mileage1 = new MileageValueObject(10000)
      const mileage2 = new MileageValueObject(10000)

      expect(mileage1.equals(mileage2)).toBe(true)
    })

    it('should return false for different mileages', () => {
      const mileage1 = new MileageValueObject(10000)
      const mileage2 = new MileageValueObject(20000)

      expect(mileage1.equals(mileage2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the mileage as string', () => {
      const mileage = new MileageValueObject(15000)

      expect(mileage.toString()).toBe('15000')
    })
  })
})
