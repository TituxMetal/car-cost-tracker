import { describe, expect, it } from 'bun:test'

import { FuelType } from '~/vehicles/domain/entities'

import { CreateVehicleDto } from './CreateVehicle.dto'

/**
 * Test Data Builder
 * Creates instances of CreateVehicleDto with default or overridden values.
 */
const createDto = (overrides: Partial<CreateVehicleDto> = {}): CreateVehicleDto =>
  Object.assign(new CreateVehicleDto(), {
    make: 'Mini',
    model: 'Cooper S',
    year: 2020,
    ...overrides
  })

describe('CreateVehicleDto', () => {
  it('should create instance with required properties', () => {
    const dto = createDto()

    expect(dto).toBeInstanceOf(CreateVehicleDto)
    expect(dto.make).toBe('Mini')
    expect(dto.model).toBe('Cooper S')
    expect(dto.year).toBe(2020)
  })

  it('should create instance with all properties', () => {
    const dto = createDto({
      engineType: '1.6L Turbo',
      fuelType: FuelType.GASOLINE,
      vin: 'WVWZZZ3CZWE123456',
      licensePlate: 'AB-123-CD',
      purchaseDate: '2020-01-15',
      mileage: 50000
    })

    expect(dto).toBeInstanceOf(CreateVehicleDto)
    expect(dto.make).toBe('Mini')
    expect(dto.model).toBe('Cooper S')
    expect(dto.year).toBe(2020)
    expect(dto.engineType).toBe('1.6L Turbo')
    expect(dto.fuelType).toBe(FuelType.GASOLINE)
    expect(dto.vin).toBe('WVWZZZ3CZWE123456')
    expect(dto.licensePlate).toBe('AB-123-CD')
    expect(dto.purchaseDate).toBe('2020-01-15')
    expect(dto.mileage).toBe(50000)
  })

  it('should have undefined optional properties by default', () => {
    const dto = createDto()

    expect(dto.engineType).toBeUndefined()
    expect(dto.fuelType).toBeUndefined()
    expect(dto.vin).toBeUndefined()
    expect(dto.licensePlate).toBeUndefined()
    expect(dto.purchaseDate).toBeUndefined()
    expect(dto.mileage).toBeUndefined()
  })

  it('should accept valid FuelType enum values', () => {
    const dto = createDto({ fuelType: FuelType.DIESEL })

    expect(dto.fuelType).toBe(FuelType.DIESEL)
  })

  it('should be serializable to JSON', () => {
    const vehicle = {
      engineType: '1.6L Turbo',
      fuelType: FuelType.GASOLINE,
      vin: 'WVWZZZ3CZWE123456',
      licensePlate: 'AB-123-CD',
      purchaseDate: '2020-01-15',
      mileage: 50000
    }
    const dto = createDto(vehicle)

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.make).toBe('Mini')
    expect(parsed.model).toBe('Cooper S')
    expect(parsed.year).toBe(2020)
    expect(parsed.engineType).toBe(vehicle.engineType)
    expect(parsed.fuelType).toBe(vehicle.fuelType)
    expect(parsed.vin).toBe(vehicle.vin)
    expect(parsed.licensePlate).toBe(vehicle.licensePlate)
    expect(parsed.purchaseDate).toBe(vehicle.purchaseDate)
    expect(parsed.mileage).toBe(vehicle.mileage)
  })
})
