import { describe, expect, it } from 'bun:test'

import { formatMileage } from './formatMileage'

describe('formatMileage', () => {
  it('should return invariant km for 0', () => {
    expect(formatMileage(0)).toBe('0 km')
  })

  it('should return invariant km for 1', () => {
    expect(formatMileage(1)).toBe('1 km')
  })

  it('should return invariant km for values > 1', () => {
    expect(formatMileage(2)).toBe('2 km')
  })
})
