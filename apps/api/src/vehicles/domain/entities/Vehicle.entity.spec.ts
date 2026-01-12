import { describe, expect, it } from 'bun:test'

import {
  MileageValueObject,
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '../value-objects'

import { FuelType, VehicleEntity } from './Vehicle.entity'

describe('VehicleEntity', () => {
  const createValidVehicle = () =>
    new VehicleEntity(
      VehicleIdValueObject.generate(),
      'user-123',
      'Mini',
      'Cooper S Coupé',
      new YearValueObject(2020),
      '1.6L Turbo',
      FuelType.GASOLINE,
      new VinValueObject('WVWZZZ3CZWE123456'),
      'AB-123-CD',
      new Date('2020-01-15'),
      new MileageValueObject(50000),
      new Date(),
      new Date()
    )

  describe('constructor', () => {
    it('should create a valid VehicleEntity', () => {
      const vehicle = createValidVehicle()

      expect(vehicle).toBeInstanceOf(VehicleEntity)
      expect(vehicle.make).toBe('Mini')
      expect(vehicle.model).toBe('Cooper S Coupé')
      expect(vehicle.year.value).toBe(2020)
      expect(vehicle.fuelType).toBe(FuelType.GASOLINE)
      expect(vehicle.vin?.value).toBe('WVWZZZ3CZWE123456')
      expect(vehicle.licensePlate).toBe('AB-123-CD')
      expect(vehicle.purchaseDate?.toISOString()).toBe(new Date('2020-01-15').toISOString())
      expect(vehicle.mileage.value).toBe(50000)
    })

    it('should create a VehicleEntity with minimal fields', () => {
      const vehicle = new VehicleEntity(
        VehicleIdValueObject.generate(),
        'user-123',
        'Tesla',
        'Model 3',
        new YearValueObject(2021),
        null,
        null,
        null,
        null,
        null,
        new MileageValueObject(10000),
        new Date(),
        new Date()
      )

      expect(vehicle).toBeInstanceOf(VehicleEntity)
      expect(vehicle.make).toBe('Tesla')
      expect(vehicle.model).toBe('Model 3')
      expect(vehicle.year.value).toBe(2021)
      expect(vehicle.engineType).toBeNull()
      expect(vehicle.fuelType).toBeNull()
      expect(vehicle.vin).toBeNull()
      expect(vehicle.licensePlate).toBeNull()
      expect(vehicle.purchaseDate).toBeNull()
      expect(vehicle.mileage.value).toBe(10000)
    })
  })

  describe('updateMileage', () => {
    it('should update mileage to a higher value', () => {
      const vehicle = createValidVehicle()
      const newMileage = new MileageValueObject(60000)

      vehicle.updateMileage(newMileage)

      expect(vehicle.mileage.value).toBe(60000)
    })

    it('should allow updating mileage to the same value', () => {
      const vehicle = createValidVehicle()
      const sameMileage = new MileageValueObject(50000)

      vehicle.updateMileage(sameMileage)

      expect(vehicle.mileage.value).toBe(50000)
    })

    it('should throw an error if new mileage is lower than current', () => {
      const vehicle = createValidVehicle()
      const lowerMileage = new MileageValueObject(40000)

      expect(() => vehicle.updateMileage(lowerMileage)).toThrow(
        'New mileage cannot be lower than current mileage.'
      )
    })
  })

  describe('updateDetails', () => {
    it('should update make when provided', () => {
      const vehicle = createValidVehicle()

      vehicle.updateDetails('BMW')

      expect(vehicle.make).toBe('BMW')
    })

    it('should update multiple fields at once', () => {
      const vehicle = createValidVehicle()

      vehicle.updateDetails(
        'Audi',
        'A4',
        new YearValueObject(2022),
        '2.0L Turbo',
        FuelType.DIESEL,
        new VinValueObject('WAUZZZ8KXBA123456'),
        'EF-456-GH',
        new Date('2022-05-20')
      )

      expect(vehicle.make).toBe('Audi')
      expect(vehicle.model).toBe('A4')
      expect(vehicle.year.value).toBe(2022)
      expect(vehicle.engineType).toBe('2.0L Turbo')
      expect(vehicle.fuelType).toBe(FuelType.DIESEL)
      expect(vehicle.vin?.value).toBe('WAUZZZ8KXBA123456')
      expect(vehicle.licensePlate).toBe('EF-456-GH')
      expect(vehicle.purchaseDate?.toISOString()).toBe(new Date('2022-05-20').toISOString())
    })

    it('should not change fields that are not provided', () => {
      const vehicle = createValidVehicle()

      vehicle.updateDetails(undefined, 'Roadster')

      expect(vehicle.make).toBe('Mini')
      expect(vehicle.model).toBe('Roadster')
      expect(vehicle.year.value).toBe(2020)
    })

    it('should throw an error if make is empty string', () => {
      const vehicle = createValidVehicle()

      expect(() => vehicle.updateDetails('')).toThrow('Make cannot be an empty string.')
    })

    it('should throw an error if model is empty string', () => {
      const vehicle = createValidVehicle()

      expect(() => vehicle.updateDetails(undefined, '')).toThrow('Model cannot be an empty string.')
    })
  })
})
