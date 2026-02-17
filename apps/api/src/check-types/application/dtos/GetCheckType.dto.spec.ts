import { describe, expect, it } from 'bun:test'

import { GetCheckTypeDto } from './GetCheckType.dto'

describe('GetCheckTypeDto', () => {
  const getDto = (overrides: Partial<GetCheckTypeDto> = {}): GetCheckTypeDto =>
    Object.assign(new GetCheckTypeDto(), {
      id: '123',
      vehicleId: '456',
      name: 'Oil Level Check',
      description: 'Check the oil level and condition.',
      intervalDays: 14,
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-02T00:00:00Z'),
      ...overrides
    })

  it('should create instance with all properties', () => {
    const dto = getDto()

    expect(dto).toBeInstanceOf(GetCheckTypeDto)
    expect(dto.id).toBe('123')
    expect(dto.vehicleId).toBe('456')
    expect(dto.name).toBe('Oil Level Check')
    expect(dto.description).toBe('Check the oil level and condition.')
    expect(dto.intervalDays).toBe(14)
    expect(dto.createdAt).toEqual(new Date('2026-01-01T00:00:00Z'))
    expect(dto.updatedAt).toEqual(new Date('2026-01-02T00:00:00Z'))
  })

  it('should handle null description', () => {
    const dto = getDto({ description: null })

    expect(dto).toBeInstanceOf(GetCheckTypeDto)
    expect(dto.description).toBeNull()
  })

  it('should be serializable to JSON', () => {
    const dto = getDto()
    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.id).toBe(dto.id)
    expect(parsed.vehicleId).toBe(dto.vehicleId)
    expect(parsed.name).toBe(dto.name)
    expect(parsed.description).toBe(dto.description)
    expect(parsed.intervalDays).toBe(dto.intervalDays)
    expect(new Date(parsed.createdAt)).toEqual(dto.createdAt)
    expect(new Date(parsed.updatedAt)).toEqual(dto.updatedAt)
  })
})
