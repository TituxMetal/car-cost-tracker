import { describe, expect, it } from 'bun:test'

import { daysFromNow, formatDaysLabel } from './date.utils'

describe('daysFromNow', () => {
  const reference = new Date('2026-04-11T12:00:00.000Z')

  it('returns 0 when the target date is today', () => {
    expect(daysFromNow('2026-04-11T08:00:00.000Z', reference)).toBe(0)
  })

  it('returns a positive number for future dates', () => {
    expect(daysFromNow('2026-04-12T00:00:00.000Z', reference)).toBe(1)
    expect(daysFromNow('2026-04-15T23:59:59.000Z', reference)).toBe(4)
  })

  it('returns a negative number for past dates', () => {
    expect(daysFromNow('2026-04-10T00:00:00.000Z', reference)).toBe(-1)
    expect(daysFromNow('2026-04-01T00:00:00.000Z', reference)).toBe(-10)
  })

  it('returns NaN for an invalid date string', () => {
    expect(Number.isNaN(daysFromNow('not-a-date', reference))).toBe(true)
  })
})

describe('formatDaysLabel', () => {
  it('returns "dans N jours" for values greater than 1', () => {
    expect(formatDaysLabel(2)).toBe('dans 2 jours')
    expect(formatDaysLabel(14)).toBe('dans 14 jours')
  })

  it('returns "dans 1 jour" for 1', () => {
    expect(formatDaysLabel(1)).toBe('dans 1 jour')
  })

  it('returns "aujourd\'hui" for 0', () => {
    expect(formatDaysLabel(0)).toBe("aujourd'hui")
  })

  it('returns "1 jour de retard" for -1', () => {
    expect(formatDaysLabel(-1)).toBe('1 jour de retard')
  })

  it('returns "N jours de retard" for values less than -1', () => {
    expect(formatDaysLabel(-2)).toBe('2 jours de retard')
    expect(formatDaysLabel(-30)).toBe('30 jours de retard')
  })

  it('returns an empty string when the input is NaN', () => {
    expect(formatDaysLabel(Number.NaN)).toBe('')
  })
})
