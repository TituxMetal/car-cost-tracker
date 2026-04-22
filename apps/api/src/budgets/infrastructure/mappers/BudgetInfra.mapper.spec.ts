import { describe, expect, it } from 'bun:test'

import { BudgetPeriod as PrismaBudgetPeriod } from '@generated'

import { BudgetEntity, BudgetPeriod } from '~/budgets/domain/entities'
import { BudgetIdValueObject } from '~/budgets/domain/value-objects'
import { AmountValueObject } from '~/shared/domain/value-objects'

import { BudgetInfrastructureMapper } from './BudgetInfra.mapper'

describe('BudgetInfrastructureMapper', () => {
  describe('toDomain', () => {
    it('should map Prisma record to BudgetEntity with all fields', () => {
      const prismaBudget = {
        id: BudgetIdValueObject.generate().value,
        vehicleId: '660e8400-e29b-41d4-a716-446655440000',
        amountCents: 20000,
        period: PrismaBudgetPeriod.MONTHLY,
        createdAt: new Date('2026-03-15T10:00:00Z'),
        updatedAt: new Date('2026-03-15T10:00:00Z')
      }

      const result = BudgetInfrastructureMapper.toDomain(prismaBudget)

      expect(result).toBeInstanceOf(BudgetEntity)
      expect(result.id).toBeInstanceOf(BudgetIdValueObject)
      expect(result.id.value).toBe(prismaBudget.id)
      expect(result.vehicleId).toBe(prismaBudget.vehicleId)
      expect(result.amount).toBeInstanceOf(AmountValueObject)
      expect(result.amount.toCents()).toBe(prismaBudget.amountCents)
      expect(result.period).toBe(BudgetPeriod.MONTHLY)
      expect(result.createdAt).toEqual(prismaBudget.createdAt)
      expect(result.updatedAt).toEqual(prismaBudget.updatedAt)
    })

    it('should map Prisma record with ANNUAL period', () => {
      const prismaBudget = {
        id: BudgetIdValueObject.generate().value,
        vehicleId: '660e8400-e29b-41d4-a716-446655440000',
        amountCents: 240000,
        period: PrismaBudgetPeriod.ANNUAL,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = BudgetInfrastructureMapper.toDomain(prismaBudget)

      expect(result.period).toBe(BudgetPeriod.ANNUAL)
      expect(result.amount.toCents()).toBe(240000)
    })
  })

  describe('toPrisma', () => {
    it('should map BudgetEntity to Prisma record with all fields', () => {
      const entity = new BudgetEntity(
        new BudgetIdValueObject('550e8400-e29b-41d4-a716-446655440000'),
        '660e8400-e29b-41d4-a716-446655440000',
        AmountValueObject.fromCents(20000),
        BudgetPeriod.MONTHLY,
        new Date('2026-03-15T10:00:00Z'),
        new Date('2026-03-15T10:00:00Z')
      )

      const result = BudgetInfrastructureMapper.toPrisma(entity)

      expect(result.id).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(result.vehicleId).toBe('660e8400-e29b-41d4-a716-446655440000')
      expect(result.amountCents).toBe(20000)
      expect(result.period).toBe(PrismaBudgetPeriod.MONTHLY)
      expect(result.createdAt).toEqual(new Date('2026-03-15T10:00:00Z'))
      expect(result.updatedAt).toEqual(new Date('2026-03-15T10:00:00Z'))
    })
  })

  describe('round-trip', () => {
    it('should preserve all fields through toDomain → toPrisma', () => {
      const prismaBudget = {
        id: BudgetIdValueObject.generate().value,
        vehicleId: '660e8400-e29b-41d4-a716-446655440000',
        amountCents: 55500,
        period: PrismaBudgetPeriod.ANNUAL,
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-02-01T00:00:00Z')
      }

      const entity = BudgetInfrastructureMapper.toDomain(prismaBudget)
      const result = BudgetInfrastructureMapper.toPrisma(entity)

      expect(result).toEqual(prismaBudget)
    })
  })
})
