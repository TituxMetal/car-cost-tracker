import { describe, expect, it } from 'bun:test'

import { VehicleIdValueObject } from './VehicleId.vo'

describe('VehicleIdValueObject', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000'

  describe('constructor', () => {
    it('should create a valid VehicleIdValueObject with a valid UUID', () => {
      const vehicleId = new VehicleIdValueObject(validUuid)

      expect(vehicleId.value).toBe(validUuid)
    })

    it('should throw an error for empty string', () => {
      expect(() => new VehicleIdValueObject('')).toThrow('Vehicle ID cannot be empty')
    })

    it('should throw an error for whitespace-only string', () => {
      expect(() => new VehicleIdValueObject('   ')).toThrow('Vehicle ID cannot be empty')
    })

    it('should throw an error for invalid UUID format', () => {
      expect(() => new VehicleIdValueObject('invalid-uuid')).toThrow('Invalid vehicle ID format')
    })

    it('should throw an error for null value', () => {
      expect(() => new VehicleIdValueObject(null as unknown as string)).toThrow(
        'Vehicle ID cannot be empty'
      )
    })
  })

  describe('equals', () => {
    it('should return true for equal VehicleIds', () => {
      const id1 = new VehicleIdValueObject(validUuid)
      const id2 = new VehicleIdValueObject(validUuid)

      expect(id1.equals(id2)).toBe(true)
    })

    it('should return false for different VehicleIds', () => {
      const id1 = new VehicleIdValueObject(validUuid)
      const id2 = new VehicleIdValueObject('660e8400-e29b-41d4-a716-446655440000')

      expect(id1.equals(id2)).toBe(false)
    })
  })

  describe('generate', () => {
    it('should generate a valid VehicleIdValueObject', () => {
      const vehicleId = VehicleIdValueObject.generate()

      expect(vehicleId).toBeInstanceOf(VehicleIdValueObject)
      expect(vehicleId.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )
    })
  })

  describe('toString', () => {
    it('should return the UUID string', () => {
      const vehicleId = new VehicleIdValueObject(validUuid)

      expect(vehicleId.toString()).toBe(validUuid)
    })
  })
})
