import { describe, expect, it } from 'bun:test'

import { FuelType, VehicleEntity } from '~/vehicles/domain/entities'
import {
  MileageValueObject,
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '~/vehicles/domain/value-objects'

import { VehicleMapper } from './Vehicle.mapper'

describe('VehicleMapper', () => {
  const validUUID = '123e4567-e89b-12d3-a456-426614174000'

  describe('toGetVehicleDto', () => {
    it('should convert entity to DTO with all fields', () => {
      const entity = new VehicleEntity(
        new VehicleIdValueObject(validUUID),
        'user-123',
        'Toyota',
        'Corolla',
        new YearValueObject(2020),
        'V6',
        FuelType.GASOLINE,
        new VinValueObject('1HGCM82633A123456'),
        'ABC123',
        new Date('2022-01-01'),
        new MileageValueObject(15000),
        new Date(),
        new Date()
      )

      const dto = VehicleMapper.toGetVehicleDto(entity)

      expect(dto.id).toBe(entity.id.value)
      expect(dto.userId).toBe(entity.userId)
      expect(dto.make).toBe(entity.make)
      expect(dto.model).toBe(entity.model)
      expect(dto.year).toBe(entity.year.value)
      expect(dto.engineType).toBe(entity.engineType)
      expect(dto.fuelType).toEqual(entity.fuelType as FuelType)
      expect(dto.vin).toBe(entity.vin?.value ?? null)
      expect(dto.licensePlate).toBe(entity.licensePlate)
      expect(dto.purchaseDate).toBe(entity.purchaseDate)
      expect(dto.mileage).toBe(entity.mileage.value)
    })

    it('should handle null optional fields', () => {
      const entity = new VehicleEntity(
        new VehicleIdValueObject(validUUID),
        'user-123',
        'Honda',
        'Civic',
        new YearValueObject(2018),
        null,
        null,
        null,
        null,
        null,
        new MileageValueObject(0),
        new Date(),
        new Date()
      )

      const dto = VehicleMapper.toGetVehicleDto(entity)

      expect(dto.engineType).toBeNull()
      expect(dto.fuelType).toBeNull()
      expect(dto.vin).toBeNull()
      expect(dto.licensePlate).toBeNull()
      expect(dto.purchaseDate).toBeNull()
    })
  })
})
