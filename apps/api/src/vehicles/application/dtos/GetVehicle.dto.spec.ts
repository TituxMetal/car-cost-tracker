import { describe, expect, it } from 'bun:test'

import { FuelType } from '~/vehicles/domain/entities'

import { GetVehicleDto } from './GetVehicle.dto'

describe('GetVehicleDto', () => {
  it('should create instance with all properties', () => {
    const dto = new GetVehicleDto()
    dto.id = 'vehicle-123'
    dto.userId = 'user-456'
    dto.make = 'Toyota'
    dto.model = 'Corolla'
    dto.year = 2020
    dto.engineType = 'V4'
    dto.fuelType = FuelType.GASOLINE
    dto.vin = '1HGCM82633A123456'
    dto.licensePlate = 'ABC-1234'
    dto.purchaseDate = new Date('2020-05-15')
    dto.mileage = 15000
    dto.createdAt = new Date('2020-05-16')
    dto.updatedAt = new Date('2023-06-01')

    expect(dto.id).toBe('vehicle-123')
    expect(dto.userId).toBe('user-456')
    expect(dto.make).toBe('Toyota')
    expect(dto.model).toBe('Corolla')
    expect(dto.year).toBe(2020)
    expect(dto.engineType).toBe('V4')
    expect(dto.fuelType).toBe(FuelType.GASOLINE)
    expect(dto.vin).toBe('1HGCM82633A123456')
    expect(dto.licensePlate).toBe('ABC-1234')
    expect(dto.purchaseDate).toEqual(new Date('2020-05-15'))
    expect(dto.mileage).toBe(15000)
    expect(dto.createdAt).toEqual(new Date('2020-05-16'))
    expect(dto.updatedAt).toEqual(new Date('2023-06-01'))
  })

  it('should be serializable to JSON', () => {
    const dto = new GetVehicleDto()
    dto.id = 'vehicle-123'
    dto.userId = 'user-456'
    dto.make = 'Toyota'
    dto.model = 'Corolla'
    dto.year = 2020

    const jsonString = JSON.stringify(dto)
    const parsed = JSON.parse(jsonString)

    expect(parsed.id).toBe('vehicle-123')
    expect(parsed.userId).toBe('user-456')
    expect(parsed.make).toBe('Toyota')
    expect(parsed.model).toBe('Corolla')
    expect(parsed.year).toBe(2020)
  })
})
