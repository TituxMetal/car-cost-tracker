import { describe, expect, it } from 'bun:test'

import { getTodayLocalISO } from './date.utils'

describe('getTodayLocalISO', () => {
  it('returns a YYYY-MM-DD string', () => {
    expect(getTodayLocalISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('uses local time components (year, month, day) rather than UTC', () => {
    const now = new Date()
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    expect(getTodayLocalISO()).toBe(expected)
  })
})
