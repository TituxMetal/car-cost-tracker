import { describe, expect, it } from 'bun:test'

import { createCheckLogSchema } from './checkLog.schema'

describe('createCheckLogSchema', () => {
  it('should validate with valid completedAt and notes', () => {
    const result = createCheckLogSchema.parse({ completedAt: '2026-03-15', notes: 'Tout est OK' })

    expect(result).toEqual({ completedAt: '2026-03-15', notes: 'Tout est OK' })
  })

  it('should validate with only completedAt (notes optional)', () => {
    const result = createCheckLogSchema.parse({ completedAt: '2026-03-15' })

    expect(result).toEqual({ completedAt: '2026-03-15' })
  })

  it('should reject missing completedAt', () => {
    const invalidData = {}

    const result = createCheckLogSchema.safeParse(invalidData)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(`Le champ 'completedAt' est requis.`)
  })

  it('should reject invalid date format', () => {
    const invalidData = { completedAt: '15/06/2025' }

    const result = createCheckLogSchema.safeParse(invalidData)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      `Le champ 'completedAt' doit être une date au format YYYY-MM-DD.`
    )
  })

  it('should reject future date', () => {
    const invalidData = { completedAt: '2099-01-01' }

    const result = createCheckLogSchema.safeParse(invalidData)

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      `Le champ 'completedAt' ne peut pas être une date future.`
    )
  })

  it('should accept today as completedAt', () => {
    const today = new Date().toISOString().split('T')[0]
    const result = createCheckLogSchema.safeParse({ completedAt: today })

    expect(result.success).toBe(true)
  })

  it('should accept past date as completedAt', () => {
    const pastDate = '2020-01-01'
    const result = createCheckLogSchema.safeParse({ completedAt: pastDate })

    expect(result.success).toBe(true)
  })

  it('should reject notes longer than 500 characters', () => {
    const longNotes = 'a'.repeat(501)
    const result = createCheckLogSchema.safeParse({ completedAt: '2020-01-01', notes: longNotes })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      `Le champ 'notes' ne peut pas dépasser 500 caractères.`
    )
  })
})
