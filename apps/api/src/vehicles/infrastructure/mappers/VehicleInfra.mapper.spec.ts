import { describe, expect, it } from 'bun:test'

import { FuelType as PrismaFuelType } from '@generated'

import { FuelType, VehicleEntity } from '~/vehicles/domain/entities'
import {
  MileageValueObject,
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '~/vehicles/domain/value-objects'

import { VehicleInfrastructureMapper } from './VehicleInfra.mapper'

describe('VehicleInfrastructureMapper', () => {
  describe('toDomain', () => {
    it('should map PrismaVehicle to VehicleEntity with all fields', () => {
      const prismaVehicle = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        engineType: 'V6',
        fuelType: PrismaFuelType.GASOLINE,
        vin: '1HGCM82633A004352',
        licensePlate: 'ABC123',
        purchaseDate: new Date('2025-01-01T00:00:00Z'),
        mileage: 15000,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-02T00:00:00Z')
      }

      const result = VehicleInfrastructureMapper.toDomain(prismaVehicle)

      expect(result).toBeInstanceOf(VehicleEntity)
      expect(result.id).toBeInstanceOf(VehicleIdValueObject)
      expect(result.id.value).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(result.userId).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(result.make).toBe('Toyota')
      expect(result.model).toBe('Camry')
      expect(result.year).toBeInstanceOf(YearValueObject)
      expect(result.year.value).toBe(2020)
      expect(result.engineType).toBe('V6')
      expect(result.fuelType).toBe(FuelType.GASOLINE)
      expect(result.vin).toBeInstanceOf(VinValueObject)
      expect(result.vin?.value).toBe('1HGCM82633A004352')
      expect(result.licensePlate).toBe('ABC123')
      expect(result.purchaseDate).toEqual(new Date('2025-01-01T00:00:00Z'))
      expect(result.mileage).toBeInstanceOf(MileageValueObject)
      expect(result.mileage.value).toBe(15000)
      expect(result.createdAt).toEqual(new Date('2026-01-01T00:00:00Z'))
      expect(result.updatedAt).toEqual(new Date('2026-01-02T00:00:00Z'))
    })

    it('should map PrismaVehicle to VehicleEntity with null optional fields', () => {
      const prismaVehicle = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        engineType: 'V6',
        fuelType: null,
        vin: null,
        licensePlate: 'ABC123',
        purchaseDate: new Date('2025-01-01T00:00:00Z'),
        mileage: 15000,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-02T00:00:00Z')
      }

      const result = VehicleInfrastructureMapper.toDomain(prismaVehicle)

      expect(result).toBeInstanceOf(VehicleEntity)
      expect(result.vin).toBeNull()
      expect(result.fuelType).toBeNull()
    })
  })

  describe('toPrisma', () => {
    it('should map VehicleEntity to Prisma data with all fields', () => {
      const vehicleEntity = new VehicleEntity(
        new VehicleIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        '123e4567-e89b-12d3-a456-426614174000',
        'Toyota',
        'Camry',
        new YearValueObject(2020),
        'V6',
        FuelType.GASOLINE,
        new VinValueObject('1HGCM82633A004352'),
        'ABC123',
        new Date('2025-01-01T00:00:00Z'),
        new MileageValueObject(15000),
        new Date('2026-01-01T00:00:00Z'),
        new Date('2026-01-02T00:00:00Z')
      )

      const result = VehicleInfrastructureMapper.toPrisma(vehicleEntity)

      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        engineType: 'V6',
        fuelType: PrismaFuelType.GASOLINE,
        vin: '1HGCM82633A004352',
        licensePlate: 'ABC123',
        purchaseDate: new Date('2025-01-01T00:00:00Z'),
        mileage: 15000,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-02T00:00:00Z')
      })
    })

    it('should map VehicleEntity to Prisma data with null optional fields', () => {
      const vehicleEntity = new VehicleEntity(
        new VehicleIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        '123e4567-e89b-12d3-a456-426614174000',
        'Toyota',
        'Camry',
        new YearValueObject(2020),
        'V6',
        null,
        null,
        'ABC123',
        new Date('2025-01-01T00:00:00Z'),
        new MileageValueObject(15000),
        new Date('2026-01-01T00:00:00Z'),
        new Date('2026-01-02T00:00:00Z')
      )

      const result = VehicleInfrastructureMapper.toPrisma(vehicleEntity)

      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        engineType: 'V6',
        fuelType: null,
        vin: null,
        licensePlate: 'ABC123',
        purchaseDate: new Date('2025-01-01T00:00:00Z'),
        mileage: 15000,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-02T00:00:00Z')
      })
    })
  })
})
