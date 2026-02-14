import { describe, expect, it } from 'bun:test'

import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('should return formatted date for valid date string', () => {
    const date = '2024-06-01T00:00:00.000Z'

    expect(formatDate(date)).toBe('01/06/2024')
  })

  it('should return "-" for invalid date string', () => {
    const date = 'invalid-date'

    expect(formatDate(date)).toBe('-')
  })
})
