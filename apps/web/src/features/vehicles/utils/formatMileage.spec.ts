import { describe, expect, it } from 'bun:test'

import { formatMileage } from './formatMileage'

describe('formatMileage', () => {
  it('should return singular km for 0', () => {
    expect(formatMileage(0)).toBe('0 km')
  })

  it('should return singular km for 1', () => {
    expect(formatMileage(1)).toBe('1 km')
  })

  it('should return plural kms for values > 1', () => {
    expect(formatMileage(2)).toBe('2 kms')
  })
})
