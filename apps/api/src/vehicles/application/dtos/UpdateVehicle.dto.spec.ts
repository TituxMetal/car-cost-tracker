import { describe, expect, it } from 'bun:test'

import { FuelType } from '~/vehicles/domain/entities'

import { UpdateVehicleDto } from './UpdateVehicle.dto'

describe('UpdateVehicleDto', () => {
  it('should create empty instance', () => {
    const dto = new UpdateVehicleDto()

    expect(dto).toBeInstanceOf(UpdateVehicleDto)
    expect(dto.make).toBeUndefined()
    expect(dto.model).toBeUndefined()
    expect(dto.year).toBeUndefined()
    expect(dto.engineType).toBeUndefined()
    expect(dto.fuelType).toBeUndefined()
    expect(dto.vin).toBeUndefined()
    expect(dto.licensePlate).toBeUndefined()
    expect(dto.purchaseDate).toBeUndefined()
    expect(dto.mileage).toBeUndefined()
  })

  it('should create instance with single property', () => {
    const dto = new UpdateVehicleDto()
    dto.make = 'Toyota'

    expect(dto).toBeInstanceOf(UpdateVehicleDto)
    expect(dto.make).toBe('Toyota')
    expect(dto.model).toBeUndefined()
    expect(dto.year).toBeUndefined()
  })

  it('should create instance with all properties', () => {
    const dto = new UpdateVehicleDto()
    dto.make = 'Honda'
    dto.model = 'Civic'
    dto.year = 2019
    dto.engineType = '2.0L'
    dto.fuelType = FuelType.GASOLINE
    dto.vin = '1HGCM82633A123456'
    dto.licensePlate = 'XYZ-789'
    dto.purchaseDate = '2019-05-20'
    dto.mileage = 30000

    expect(dto).toBeInstanceOf(UpdateVehicleDto)
    expect(dto.make).toBe('Honda')
    expect(dto.model).toBe('Civic')
    expect(dto.year).toBe(2019)
    expect(dto.engineType).toBe('2.0L')
    expect(dto.fuelType).toBe(FuelType.GASOLINE)
    expect(dto.vin).toBe('1HGCM82633A123456')
    expect(dto.licensePlate).toBe('XYZ-789')
    expect(dto.purchaseDate).toBe('2019-05-20')
    expect(dto.mileage).toBe(30000)
  })

  it('should be serializable to JSON', () => {
    const dto = new UpdateVehicleDto()
    dto.make = 'Mini'
    dto.mileage = 75000

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.make).toBe('Mini')
    expect(parsed.mileage).toBe(75000)
  })
})
