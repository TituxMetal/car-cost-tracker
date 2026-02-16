import { describe, expect, it } from 'bun:test'

import { CHECK_TYPE_VALIDATION as checkTypeValidation } from '../validation'

import { IntervalDaysValueObject } from './IntervalDays.vo'

describe('IntervalDaysValueObject', () => {
  const minInterval = checkTypeValidation.INTERVAL_DAYS.MIN

  describe('constructor', () => {
    it('should create a valid interval from a positive integer', () => {
      const interval = new IntervalDaysValueObject(30)

      expect(interval.value).toBe(30)
    })

    it('should accept minimum as the minimum valid interval', () => {
      const interval = new IntervalDaysValueObject(minInterval)

      expect(interval.value).toBe(minInterval)
    })

    it('should throw an error for 0', () => {
      expect(() => new IntervalDaysValueObject(0)).toThrow(
        `IntervalDays must be an integer of at least ${minInterval}`
      )
    })

    it('should throw an error for a negative number', () => {
      expect(() => new IntervalDaysValueObject(-5)).toThrow(
        `IntervalDays must be an integer of at least ${minInterval}`
      )
    })

    it('should throw an error for a non-integer (decimal)', () => {
      expect(() => new IntervalDaysValueObject(1.5)).toThrow(
        `IntervalDays must be an integer of at least ${minInterval}`
      )
    })
  })

  describe('equals', () => {
    it('should return true for equal values', () => {
      const interval1 = new IntervalDaysValueObject(30)
      const interval2 = new IntervalDaysValueObject(30)

      expect(interval1.equals(interval2)).toBe(true)
    })

    it('should return false for different values', () => {
      const interval1 = new IntervalDaysValueObject(30)
      const interval2 = new IntervalDaysValueObject(60)

      expect(interval1.equals(interval2)).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return the string representation', () => {
      const interval = new IntervalDaysValueObject(30)

      expect(interval.toString()).toBe('30')
    })
  })
})
