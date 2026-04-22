import { describe, expect, it } from 'bun:test'

import { AmountValueObject } from '~/shared/domain/value-objects'

import { BudgetIdValueObject } from '../value-objects'

import { BudgetEntity, BudgetPeriod } from './Budget.entity'

describe('BudgetEntity', () => {
  const createValidEntity = (overrides?: {
    amount?: AmountValueObject
    period?: BudgetPeriod
    updatedAt?: Date
  }) =>
    new BudgetEntity(
      new BudgetIdValueObject('550e8400-e29b-41d4-a716-446655440000'),
      'vehicle-123',
      overrides?.amount ?? AmountValueObject.fromCents(20000),
      overrides?.period ?? BudgetPeriod.MONTHLY,
      new Date('2026-01-01'),
      overrides?.updatedAt ?? new Date('2026-01-01')
    )

  describe('constructor', () => {
    it('should create a valid entity with all fields', () => {
      const entity = createValidEntity()

      expect(entity.id.value).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(entity.vehicleId).toBe('vehicle-123')
      expect(entity.amount.value).toBe(20000)
      expect(entity.period).toBe(BudgetPeriod.MONTHLY)
      expect(entity.createdAt.toISOString()).toBe(new Date('2026-01-01').toISOString())
      expect(entity.updatedAt.toISOString()).toBe(new Date('2026-01-01').toISOString())
    })

    it('should throw InvalidBudgetException when period is not in BUDGET_VALIDATION.PERIOD.VALUES', () => {
      expect(() =>
        createValidEntity({ period: 'INVALID_PERIOD' as unknown as BudgetPeriod })
      ).toThrow('Invalid budget period')
    })
  })

  describe('updateAmount', () => {
    it('should replace amount and refresh updatedAt', () => {
      const entity = createValidEntity({ updatedAt: new Date('2026-01-01') })
      entity.updateAmount(AmountValueObject.fromCents(50000))

      expect(entity.amount.value).toBe(50000)
      expect(entity.updatedAt.getTime()).toBeGreaterThan(new Date('2026-01-01').getTime())
    })
  })

  describe('updatePeriod', () => {
    it('should replace period and refresh updatedAt', () => {
      const entity = createValidEntity({ updatedAt: new Date('2026-01-01') })
      entity.updatePeriod(BudgetPeriod.ANNUAL)

      expect(entity.period).toBe(BudgetPeriod.ANNUAL)
      expect(entity.updatedAt.getTime()).toBeGreaterThan(new Date('2026-01-01').getTime())
    })

    it('should throw InvalidBudgetException when period is invalid', () => {
      const entity = createValidEntity({ period: BudgetPeriod.MONTHLY })

      expect(() => entity.updatePeriod('INVALID_PERIOD' as unknown as BudgetPeriod)).toThrow(
        'Invalid budget period'
      )

      expect(entity.period).toBe(BudgetPeriod.MONTHLY)
    })
  })

  describe('updateBoth', () => {
    it('should update only amount when period is omitted', () => {
      const entity = createValidEntity({
        period: BudgetPeriod.MONTHLY,
        updatedAt: new Date('2026-01-01')
      })
      entity.updateBoth({ amount: AmountValueObject.fromCents(75000) })

      expect(entity.amount.value).toBe(75000)
      expect(entity.period).toBe(BudgetPeriod.MONTHLY)
      expect(entity.updatedAt.getTime()).toBeGreaterThan(new Date('2026-01-01').getTime())
    })

    it('should update only period when amount is omitted', () => {
      const entity = createValidEntity({
        amount: AmountValueObject.fromCents(20000),
        updatedAt: new Date('2026-01-01')
      })
      entity.updateBoth({ period: BudgetPeriod.ANNUAL })

      expect(entity.amount.value).toBe(20000)
      expect(entity.period).toBe(BudgetPeriod.ANNUAL)
      expect(entity.updatedAt.getTime()).toBeGreaterThan(new Date('2026-01-01').getTime())
    })

    it('should update both when provided together and bump updatedAt once', () => {
      const entity = createValidEntity({
        amount: AmountValueObject.fromCents(20000),
        period: BudgetPeriod.MONTHLY,
        updatedAt: new Date('2026-01-01')
      })
      entity.updateBoth({ amount: AmountValueObject.fromCents(75000), period: BudgetPeriod.ANNUAL })

      expect(entity.amount.value).toBe(75000)
      expect(entity.period).toBe(BudgetPeriod.ANNUAL)
      expect(entity.updatedAt.getTime()).toBeGreaterThan(new Date('2026-01-01').getTime())
    })

    it('should throw InvalidBudgetException when period is invalid', () => {
      const entity = createValidEntity({
        amount: AmountValueObject.fromCents(20000),
        period: BudgetPeriod.MONTHLY,
        updatedAt: new Date('2026-01-01')
      })

      expect(() =>
        entity.updateBoth({ period: 'INVALID_PERIOD' as unknown as BudgetPeriod })
      ).toThrow('Invalid budget period')

      expect(entity.amount.value).toBe(20000)
      expect(entity.period).toBe(BudgetPeriod.MONTHLY)
      expect(entity.updatedAt.getTime()).toBe(new Date('2026-01-01').getTime())
    })
  })
})
