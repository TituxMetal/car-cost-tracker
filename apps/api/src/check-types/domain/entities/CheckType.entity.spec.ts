import { describe, expect, it } from 'bun:test'

import { CHECK_TYPE_VALIDATION as checkTypeValidation } from '../validation'
import {
  CheckTypeIdValueObject,
  CheckTypeNameValueObject,
  IntervalDaysValueObject
} from '../value-objects'

import { CheckTypeEntity } from './CheckType.entity'

describe('CheckTypeEntity', () => {
  const createValidEntity = (overrides?: { description?: string | null }): CheckTypeEntity =>
    new CheckTypeEntity(
      new CheckTypeIdValueObject('550e8400-e29b-41d4-a716-446655440000'),
      'vehicle-123',
      new CheckTypeNameValueObject('Oil Level Check'),
      overrides?.description !== undefined ? overrides.description : 'Check with engine cold',
      new IntervalDaysValueObject(7),
      new Date('2026-01-01'),
      new Date('2026-01-01')
    )

  describe('constructor', () => {
    it('should create a valid entity with all fields', () => {
      const entity = createValidEntity()

      expect(entity.id.value).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(entity.vehicleId).toBe('vehicle-123')
      expect(entity.name.value).toBe('Oil Level Check')
      expect(entity.description).toBe('Check with engine cold')
      expect(entity.intervalDays.value).toBe(7)
      expect(entity.createdAt.toISOString()).toBe(new Date('2026-01-01').toISOString())
      expect(entity.updatedAt.toISOString()).toBe(new Date('2026-01-01').toISOString())
    })

    it('should create a valid entity with null description', () => {
      const entity = createValidEntity({ description: null })

      expect(entity.description).toBeNull()
    })

    it('should throw an error if description exceeds max characters', () => {
      const longDescription = 'a'.repeat(checkTypeValidation.DESCRIPTION.MAX_LENGTH + 1)

      expect(() => createValidEntity({ description: longDescription })).toThrow(
        `Description cannot exceed ${checkTypeValidation.DESCRIPTION.MAX_LENGTH} characters`
      )
    })

    it('should accept a description of exactly max characters', () => {
      const validDescription = 'a'.repeat(checkTypeValidation.DESCRIPTION.MAX_LENGTH)
      const entity = createValidEntity({ description: validDescription })

      expect(entity.description).toBe(validDescription)
    })
  })

  describe('updateDetails', () => {
    it('should update name when provided', () => {
      const entity = createValidEntity()
      const newName = new CheckTypeNameValueObject('Tire Pressure Check')

      entity.updateDetails(newName)

      expect(entity.name.value).toBe('Tire Pressure Check')
    })

    it('should update description when provided', () => {
      const entity = createValidEntity()
      const newDescription = 'Check with engine warm'

      entity.updateDetails(undefined, newDescription)

      expect(entity.description).toBe('Check with engine warm')
    })

    it('should update intervalDays when provided', () => {
      const entity = createValidEntity()
      const newInterval = new IntervalDaysValueObject(14)

      entity.updateDetails(undefined, undefined, newInterval)

      expect(entity.intervalDays.value).toBe(14)
    })

    it('should not change fields that are undefined', () => {
      const entity = createValidEntity()
      const originalName = entity.name
      const originalDescription = entity.description
      const originalInterval = entity.intervalDays

      entity.updateDetails()

      expect(entity.name).toBe(originalName)
      expect(entity.description).toBe(originalDescription)
      expect(entity.intervalDays).toBe(originalInterval)
    })

    it('should allow setting description to null', () => {
      const entity = createValidEntity()

      entity.updateDetails(undefined, null)

      expect(entity.description).toBeNull()
    })

    it('should throw if updated description exceeds max characters', () => {
      const entity = createValidEntity()
      const longDescription = 'a'.repeat(checkTypeValidation.DESCRIPTION.MAX_LENGTH + 1)

      expect(() => entity.updateDetails(undefined, longDescription)).toThrow(
        `Description cannot exceed ${checkTypeValidation.DESCRIPTION.MAX_LENGTH} characters`
      )
    })
  })
})
