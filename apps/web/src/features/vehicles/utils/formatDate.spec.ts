import { describe, expect, it } from 'bun:test'

import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('should return formatted date for valid date string', () => {
    const date = '2024-06-01T00:00:00.000Z'

    expect(formatDate(date)).toBe('01/06/2024')
  })

  it('should return formatted date for date-only string without timezone shift', () => {
    const date = '2025-07-08'

    expect(formatDate(date)).toBe('08/07/2025')
  })

  it('should return "-" for invalid date string', () => {
    const date = 'invalid-date'

    expect(formatDate(date)).toBe('-')
  })
})
