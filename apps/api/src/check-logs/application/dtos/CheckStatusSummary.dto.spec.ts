import { describe, expect, it } from 'bun:test'

import { CheckStatusSummaryDto } from './CheckStatusSummary.dto'

describe('CheckStatusSummaryDto', () => {
  const getDto = (overrides: Partial<CheckStatusSummaryDto> = {}): CheckStatusSummaryDto =>
    Object.assign(new CheckStatusSummaryDto(), {
      checkTypeId: '660e8400-e29b-41d4-a716-446655440000',
      checkTypeName: 'Vidange',
      intervalDays: 7,
      lastCompletedAt: '2026-03-15',
      nextDueAt: '2026-03-22',
      status: 'on-time' as const,
      ...overrides
    })

  it('should create instance with all properties', () => {
    const dto = getDto()

    expect(dto).toBeInstanceOf(CheckStatusSummaryDto)
    expect(dto.checkTypeId).toBe('660e8400-e29b-41d4-a716-446655440000')
    expect(dto.checkTypeName).toBe('Vidange')
    expect(dto.intervalDays).toBe(7)
    expect(dto.lastCompletedAt).toBe('2026-03-15')
    expect(dto.nextDueAt).toBe('2026-03-22')
    expect(dto.status).toBe('on-time')
  })

  it('should handle never status with null dates', () => {
    const dto = getDto({ lastCompletedAt: null, nextDueAt: null, status: 'never' })

    expect(dto).toBeInstanceOf(CheckStatusSummaryDto)
    expect(dto.lastCompletedAt).toBeNull()
    expect(dto.nextDueAt).toBeNull()
    expect(dto.status).toBe('never')
  })

  it('should be serializable to JSON', () => {
    const dto = getDto()

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.checkTypeId).toBe(dto.checkTypeId)
    expect(parsed.checkTypeName).toBe(dto.checkTypeName)
    expect(parsed.status).toBe(dto.status)
    expect(parsed.lastCompletedAt).toBe(dto.lastCompletedAt)
    expect(parsed.nextDueAt).toBe(dto.nextDueAt)
  })
})
