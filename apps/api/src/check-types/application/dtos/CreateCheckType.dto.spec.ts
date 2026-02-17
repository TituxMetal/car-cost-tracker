import { describe, expect, it } from 'bun:test'

import { CreateCheckTypeDto } from './CreateCheckType.dto'

describe('CreateCheckTypeDto', () => {
  const createDto = (overrides: Partial<CreateCheckTypeDto> = {}): CreateCheckTypeDto =>
    Object.assign(new CreateCheckTypeDto(), {
      name: 'Oil Level Check',
      description: 'Check the oil level and condition.',
      intervalDays: 14,
      ...overrides
    })

  it('should create instance with required properties', () => {
    const dto = createDto()

    expect(dto).toBeInstanceOf(CreateCheckTypeDto)
    expect(dto.name).toBe('Oil Level Check')
    expect(dto.intervalDays).toBe(14)
  })

  it('should create instance with all properties including description', () => {
    const dto = createDto({ description: 'Check the oil level and condition.' })

    expect(dto).toBeInstanceOf(CreateCheckTypeDto)
    expect(dto.name).toBe('Oil Level Check')
    expect(dto.description).toBe('Check the oil level and condition.')
    expect(dto.intervalDays).toBe(14)
  })

  it('should have undefined description by default', () => {
    const dto = createDto({ description: undefined })

    expect(dto).toBeInstanceOf(CreateCheckTypeDto)
    expect(dto.name).toBe('Oil Level Check')
    expect(dto.description).toBeUndefined()
    expect(dto.intervalDays).toBe(14)
  })

  it('should be serializable to JSON', () => {
    const checkType = {
      name: 'Tire Pressure Check',
      description: 'Check the tire pressure and condition.',
      intervalDays: 30
    }
    const dto = createDto(checkType)

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.name).toBe(checkType.name)
    expect(parsed.description).toBe(checkType.description)
    expect(parsed.intervalDays).toBe(checkType.intervalDays)
  })
})
