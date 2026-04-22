import { describe, expect, it } from 'bun:test'

import { ExpenseCategory as PrismaExpenseCategory } from '@generated'

import { ExpenseCategory, ExpenseEntity } from '~/expenses/domain/entities'
import { ExpenseIdValueObject, OccurredAtValueObject } from '~/expenses/domain/value-objects'
import { AmountValueObject } from '~/shared/domain/value-objects'

import { ExpenseInfrastructureMapper } from './ExpenseInfra.mapper'

describe('ExpenseInfrastructureMapper', () => {
  describe('toDomain', () => {
    it('should map Prisma record to ExpenseEntity with all fields', () => {
      const prismaExpense = {
        id: ExpenseIdValueObject.generate().value,
        vehicleId: '660e8400-e29b-41d4-a716-446655440000',
        occurredAt: '2026-03-15',
        amountCents: 8950,
        category: PrismaExpenseCategory.SERVICE,
        description: 'Oil change',
        createdAt: new Date('2026-03-15T10:00:00Z'),
        updatedAt: new Date('2026-03-15T10:00:00Z')
      }

      const result = ExpenseInfrastructureMapper.toDomain(prismaExpense)

      expect(result).toBeInstanceOf(ExpenseEntity)
      expect(result.id).toBeInstanceOf(ExpenseIdValueObject)
      expect(result.id.value).toBe(prismaExpense.id)
      expect(result.vehicleId).toBe(prismaExpense.vehicleId)
      expect(result.occurredAt).toBeInstanceOf(OccurredAtValueObject)
      expect(result.occurredAt.value).toBe(prismaExpense.occurredAt)
      expect(result.amount).toBeInstanceOf(AmountValueObject)
      expect(result.amount.toCents()).toBe(prismaExpense.amountCents)
      expect(result.category).toBe(ExpenseCategory.SERVICE)
      expect(result.description).toBe(prismaExpense.description)
      expect(result.createdAt).toEqual(prismaExpense.createdAt)
      expect(result.updatedAt).toEqual(prismaExpense.updatedAt)
    })

    it('should map Prisma record with null description', () => {
      const prismaExpense = {
        id: ExpenseIdValueObject.generate().value,
        vehicleId: '660e8400-e29b-41d4-a716-446655440000',
        occurredAt: '2026-03-15',
        amountCents: 8950,
        category: PrismaExpenseCategory.PARTS,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = ExpenseInfrastructureMapper.toDomain(prismaExpense)

      expect(result.description).toBeNull()
      expect(result.category).toBe(ExpenseCategory.PARTS)
    })
  })

  describe('toPrisma', () => {
    it('should map ExpenseEntity to Prisma data with all fields', () => {
      const entity = new ExpenseEntity(
        ExpenseIdValueObject.generate(),
        '660e8400-e29b-41d4-a716-446655440000',
        new OccurredAtValueObject('2026-03-15'),
        AmountValueObject.fromCents(8950),
        ExpenseCategory.SERVICE,
        'Oil change',
        new Date('2026-03-15T10:00:00Z'),
        new Date('2026-03-15T10:00:00Z')
      )

      const result = ExpenseInfrastructureMapper.toPrisma(entity)

      expect(result).toEqual({
        id: entity.id.value,
        vehicleId: entity.vehicleId,
        occurredAt: entity.occurredAt.value,
        amountCents: entity.amount.toCents(),
        category: entity.category,
        description: entity.description,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      })
    })

    it('should map ExpenseEntity with null description', () => {
      const entity = new ExpenseEntity(
        ExpenseIdValueObject.generate(),
        '660e8400-e29b-41d4-a716-446655440000',
        new OccurredAtValueObject('2026-03-15'),
        AmountValueObject.fromCents(8950),
        ExpenseCategory.OTHER,
        null,
        new Date(),
        new Date()
      )

      const result = ExpenseInfrastructureMapper.toPrisma(entity)

      expect(result.description).toBeNull()
    })
  })
})
