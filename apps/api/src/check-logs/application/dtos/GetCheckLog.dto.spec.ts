import { describe, expect, it } from 'bun:test'

import { GetCheckLogDto } from './GetCheckLog.dto'

describe('GetCheckLogDto', () => {
  const getDto = (overrides: Partial<GetCheckLogDto> = {}): GetCheckLogDto =>
    Object.assign(new GetCheckLogDto(), {
      id: '550e8400-e29b-41d4-a716-446655440000',
      checkTypeId: '660e8400-e29b-41d4-a716-446655440000',
      checkTypeName: 'Vidange',
      completedAt: '2026-03-15',
      notes: 'All good',
      nextDueAt: '2026-03-22',
      createdAt: new Date('2026-03-15T10:00:00Z'),
      ...overrides
    })

  it('should create instance with all properties', () => {
    const dto = getDto()

    expect(dto).toBeInstanceOf(GetCheckLogDto)
    expect(dto.id).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(dto.checkTypeId).toBe('660e8400-e29b-41d4-a716-446655440000')
    expect(dto.checkTypeName).toBe('Vidange')
    expect(dto.completedAt).toBe('2026-03-15')
    expect(dto.notes).toBe('All good')
    expect(dto.nextDueAt).toBe('2026-03-22')
    expect(dto.createdAt).toEqual(new Date('2026-03-15T10:00:00Z'))
  })

  it('should handle null notes', () => {
    const dto = getDto({ notes: null })

    expect(dto).toBeInstanceOf(GetCheckLogDto)
    expect(dto.notes).toBeNull()
  })

  it('should be serializable to JSON', () => {
    const dto = getDto()

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.id).toBe(dto.id)
    expect(parsed.checkTypeName).toBe(dto.checkTypeName)
    expect(parsed.completedAt).toBe(dto.completedAt)
    expect(parsed.nextDueAt).toBe(dto.nextDueAt)
  })
})
