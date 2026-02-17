import { describe, expect, it } from 'bun:test'

import { UpdateCheckTypeDto } from './UpdateCheckType.dto'

describe('UpdateCheckTypeDto', () => {
  const updateDto = (overrides: Partial<UpdateCheckTypeDto> = {}): UpdateCheckTypeDto =>
    Object.assign(new UpdateCheckTypeDto(), {
      name: 'Oil Level Check',
      description: 'Check the oil level and condition.',
      intervalDays: 14,
      ...overrides
    })

  it('should create empty instance with all fields undefined', () => {
    const dto = updateDto({ name: undefined, description: undefined, intervalDays: undefined })

    expect(dto).toBeInstanceOf(UpdateCheckTypeDto)
    expect(dto.name).toBeUndefined()
    expect(dto.description).toBeUndefined()
    expect(dto.intervalDays).toBeUndefined()
  })

  it('should create instance with single property', () => {
    const dto = updateDto({
      name: 'Brake Pad Check',
      description: undefined,
      intervalDays: undefined
    })

    expect(dto).toBeInstanceOf(UpdateCheckTypeDto)
    expect(dto.name).toBe('Brake Pad Check')
    expect(dto.description).toBeUndefined()
    expect(dto.intervalDays).toBeUndefined()
  })

  it('should create instance with all properties', () => {
    const checkType = {
      name: 'Brake Pad Check',
      description: 'Check the brake pads condition.',
      intervalDays: 30
    }
    const dto = updateDto(checkType)

    expect(dto).toBeInstanceOf(UpdateCheckTypeDto)
    expect(dto.name).toBe('Brake Pad Check')
    expect(dto.description).toBe('Check the brake pads condition.')
    expect(dto.intervalDays).toBe(30)
  })

  it('should accept null description to clear the field', () => {
    const dto = updateDto({ description: null })

    expect(dto).toBeInstanceOf(UpdateCheckTypeDto)
    expect(dto.description).toBeNull()
  })

  it('should be serializable to JSON', () => {
    const checkType = {
      name: 'Brake Pad Check',
      description: 'Check the brake pads condition.',
      intervalDays: 30
    }
    const dto = updateDto(checkType)

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.name).toBe(dto.name)
    expect(parsed.description).toBe(dto.description)
    expect(parsed.intervalDays).toBe(dto.intervalDays)
  })
})
