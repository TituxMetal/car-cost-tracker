import { describe, expect, it } from 'bun:test'

import { CreateCheckLogDto } from './CreateCheckLog.dto'

describe('CreateCheckLogDto', () => {
  const createDto = (overrides: Partial<CreateCheckLogDto> = {}): CreateCheckLogDto =>
    Object.assign(new CreateCheckLogDto(), {
      checkTypeId: '550e8400-e29b-41d4-a716-446655440000',
      completedAt: '2026-03-15',
      notes: 'All good',
      ...overrides
    })

  it('should create instance with all properties', () => {
    const dto = createDto()

    expect(dto).toBeInstanceOf(CreateCheckLogDto)
    expect(dto.checkTypeId).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(dto.completedAt).toBe('2026-03-15')
    expect(dto.notes).toBe('All good')
  })

  it('should create instance without optional notes', () => {
    const dto = createDto({ notes: undefined })

    expect(dto).toBeInstanceOf(CreateCheckLogDto)
    expect(dto.checkTypeId).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(dto.completedAt).toBe('2026-03-15')
    expect(dto.notes).toBeUndefined()
  })

  it('should be serializable to JSON', () => {
    const dto = createDto()

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.checkTypeId).toBe(dto.checkTypeId)
    expect(parsed.completedAt).toBe(dto.completedAt)
    expect(parsed.notes).toBe(dto.notes)
  })
})
