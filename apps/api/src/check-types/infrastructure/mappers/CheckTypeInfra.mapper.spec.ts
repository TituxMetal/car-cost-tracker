import { describe, expect, it } from 'bun:test'

import { CheckTypeEntity } from '~/check-types/domain/entities/CheckType.entity'
import {
  CheckTypeIdValueObject,
  CheckTypeNameValueObject,
  IntervalDaysValueObject
} from '~/check-types/domain/value-objects'

import { CheckTypeInfrastructureMapper } from './CheckTypeInfra.mapper'

describe('CheckTypeInfrastructureMapper', () => {
  describe('toDomain', () => {
    const validUUID = CheckTypeIdValueObject.generate()

    it('should map PrismaCheckType to CheckTypeEntity with all fields', () => {
      const prismaCheckType = {
        id: validUUID.value,
        vehicleId: 'vehicle-1',
        name: 'Oil Change',
        description: 'Change the engine oil every 5000 miles',
        intervalDays: 180,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-02T00:00:00Z')
      }

      const result = CheckTypeInfrastructureMapper.toDomain(prismaCheckType)

      expect(result).toBeInstanceOf(CheckTypeEntity)
      expect(result.id).toBeInstanceOf(CheckTypeIdValueObject)
      expect(result.id.value).toBe(prismaCheckType.id)
      expect(result.vehicleId).toBe(prismaCheckType.vehicleId)
      expect(result.name).toBeInstanceOf(CheckTypeNameValueObject)
      expect(result.name.value).toBe(prismaCheckType.name)
      expect(result.description).toBe(prismaCheckType.description)
      expect(result.intervalDays).toBeInstanceOf(IntervalDaysValueObject)
      expect(result.intervalDays.value).toBe(prismaCheckType.intervalDays)
      expect(result.createdAt).toEqual(prismaCheckType.createdAt)
      expect(result.updatedAt).toEqual(prismaCheckType.updatedAt)
    })

    it('should map PrismaCheckType to CheckTypeEntity with optional null description', () => {
      const prismaCheckType = {
        id: validUUID.value,
        vehicleId: 'vehicle-1',
        name: 'Oil Change',
        description: null,
        intervalDays: 180,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-02T00:00:00Z')
      }

      const result = CheckTypeInfrastructureMapper.toDomain(prismaCheckType)

      expect(result.description).toBeNull()
    })
  })

  describe('toPrisma', () => {
    it('should map CheckTypeEntity to Prisma data with all fields', () => {
      const entity = new CheckTypeEntity(
        CheckTypeIdValueObject.generate(),
        'vehicle-1',
        new CheckTypeNameValueObject('Oil Change'),
        'Change the engine oil every 5000 miles',
        new IntervalDaysValueObject(180),
        new Date('2026-01-01T00:00:00Z'),
        new Date('2026-01-02T00:00:00Z')
      )

      const result = CheckTypeInfrastructureMapper.toPrisma(entity)

      expect(result).toEqual({
        id: entity.id.value,
        vehicleId: entity.vehicleId,
        name: entity.name.value,
        description: entity.description ?? null,
        intervalDays: entity.intervalDays.value,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      })
    })

    it('should map CheckTypeEntity to Prisma data with optional null description', () => {
      const entity = new CheckTypeEntity(
        CheckTypeIdValueObject.generate(),
        'vehicle-1',
        new CheckTypeNameValueObject('Oil Change'),
        null,
        new IntervalDaysValueObject(180),
        new Date('2026-01-01T00:00:00Z'),
        new Date('2026-01-02T00:00:00Z')
      )

      const result = CheckTypeInfrastructureMapper.toPrisma(entity)

      expect(result.description).toBeNull()
    })
  })
})
