import { describe, expect, it } from 'bun:test'

import { UpdateMileageDto } from './UpdateMileage.dto'

describe('UpdateMileageDto', () => {
  it('should create instance with mileage', () => {
    const dto = new UpdateMileageDto()
    dto.mileage = 75000

    expect(dto).toBeInstanceOf(UpdateMileageDto)
    expect(dto.mileage).toBe(75000)
  })

  it('should be serializable to JSON', () => {
    const dto = new UpdateMileageDto()
    dto.mileage = 120000

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.mileage).toBe(120000)
  })
})
