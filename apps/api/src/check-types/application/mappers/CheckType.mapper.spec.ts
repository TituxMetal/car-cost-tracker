import { describe, expect, it } from 'bun:test'

import { CheckTypeEntity } from '~/check-types/domain/entities'
import {
  CheckTypeIdValueObject,
  CheckTypeNameValueObject,
  IntervalDaysValueObject
} from '~/check-types/domain/value-objects'

import { CheckTypeMapper } from './CheckType.mapper'

describe('CheckTypeMapper', () => {
  describe('toGetCheckTypeDto', () => {
    it('should convert entity to DTO with all fields', () => {
      const entity = new CheckTypeEntity(
        new CheckTypeIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        'vehicle-123',
        new CheckTypeNameValueObject('Oil Level Check'),
        'Check the oil level and condition.',
        new IntervalDaysValueObject(14),
        new Date('2026-01-01T00:00:00Z'),
        new Date('2026-01-02T00:00:00Z')
      )

      const dto = CheckTypeMapper.toGetCheckTypeDto(entity)

      expect(dto.id).toBe(entity.id.value)
      expect(dto.vehicleId).toBe(entity.vehicleId)
      expect(dto.name).toBe(entity.name.value)
      expect(dto.description).toBe(entity.description)
      expect(dto.intervalDays).toBe(entity.intervalDays.value)
      expect(dto.createdAt).toBe(entity.createdAt)
      expect(dto.updatedAt).toBe(entity.updatedAt)
    })

    it('should handle null description', () => {
      const entity = new CheckTypeEntity(
        new CheckTypeIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
        'vehicle-123',
        new CheckTypeNameValueObject('Tire Pressure Check'),
        null,
        new IntervalDaysValueObject(30),
        new Date('2026-01-01T00:00:00Z'),
        new Date('2026-01-02T00:00:00Z')
      )

      const dto = CheckTypeMapper.toGetCheckTypeDto(entity)

      expect(dto.id).toBe(entity.id.value)
      expect(dto.vehicleId).toBe(entity.vehicleId)
      expect(dto.name).toBe(entity.name.value)
      expect(dto.description).toBeNull()
      expect(dto.intervalDays).toBe(entity.intervalDays.value)
      expect(dto.createdAt).toBe(entity.createdAt)
      expect(dto.updatedAt).toBe(entity.updatedAt)
    })
  })
})
