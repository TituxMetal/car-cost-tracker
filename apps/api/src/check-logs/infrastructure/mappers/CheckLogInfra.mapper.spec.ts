import { describe, expect, it } from 'bun:test'

import { CheckLogEntity } from '~/check-logs/domain/entities'
import { CheckLogIdValueObject, CompletedAtValueObject } from '~/check-logs/domain/value-objects'

import { CheckLogInfrastructureMapper } from './CheckLogInfra.mapper'

describe('CheckLogInfrastructureMapper', () => {
  describe('toDomain', () => {
    it('should map PrismaCheckLog to CheckLogEntity with all fields', () => {
      const prismaCheckLog = {
        id: CheckLogIdValueObject.generate().value,
        checkTypeId: '660e8400-e29b-41d4-a716-446655440000',
        completedAt: '2026-03-15',
        notes: 'All good',
        nextDueAt: '2026-03-22',
        createdAt: new Date('2026-03-15T10:00:00Z'),
        updatedAt: new Date('2026-03-15T10:00:00Z')
      }

      const result = CheckLogInfrastructureMapper.toDomain(prismaCheckLog)

      expect(result).toBeInstanceOf(CheckLogEntity)
      expect(result.id).toBeInstanceOf(CheckLogIdValueObject)
      expect(result.id.value).toBe(prismaCheckLog.id)
      expect(result.checkTypeId).toBe(prismaCheckLog.checkTypeId)
      expect(result.completedAt).toBeInstanceOf(CompletedAtValueObject)
      expect(result.completedAt.value).toBe(prismaCheckLog.completedAt)
      expect(result.notes).toBe(prismaCheckLog.notes)
      expect(result.nextDueAt).toBe(prismaCheckLog.nextDueAt)
      expect(result.createdAt).toEqual(prismaCheckLog.createdAt)
      expect(result.updatedAt).toEqual(prismaCheckLog.updatedAt)
    })

    it('should map PrismaCheckLog with null notes', () => {
      const prismaCheckLog = {
        id: CheckLogIdValueObject.generate().value,
        checkTypeId: '660e8400-e29b-41d4-a716-446655440000',
        completedAt: '2026-03-15',
        notes: null,
        nextDueAt: '2026-03-22',
        createdAt: new Date('2026-03-15T10:00:00Z'),
        updatedAt: new Date('2026-03-15T10:00:00Z')
      }

      const result = CheckLogInfrastructureMapper.toDomain(prismaCheckLog)

      expect(result.notes).toBeNull()
    })
  })

  describe('toPrisma', () => {
    it('should map CheckLogEntity to Prisma data with all fields', () => {
      const entity = new CheckLogEntity(
        CheckLogIdValueObject.generate(),
        '660e8400-e29b-41d4-a716-446655440000',
        new CompletedAtValueObject('2026-03-15'),
        'All good',
        '2026-03-22',
        new Date('2026-03-15T10:00:00Z'),
        new Date('2026-03-15T10:00:00Z')
      )

      const result = CheckLogInfrastructureMapper.toPrisma(entity)

      expect(result).toEqual({
        id: entity.id.value,
        checkTypeId: entity.checkTypeId,
        completedAt: entity.completedAt.value,
        notes: entity.notes,
        nextDueAt: entity.nextDueAt,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      })
    })

    it('should map CheckLogEntity with null notes', () => {
      const entity = new CheckLogEntity(
        CheckLogIdValueObject.generate(),
        '660e8400-e29b-41d4-a716-446655440000',
        new CompletedAtValueObject('2026-03-15'),
        null,
        '2026-03-22',
        new Date('2026-03-15T10:00:00Z'),
        new Date('2026-03-15T10:00:00Z')
      )

      const result = CheckLogInfrastructureMapper.toPrisma(entity)

      expect(result.notes).toBeNull()
    })
  })
})
