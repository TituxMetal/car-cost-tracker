import { describe, expect, it } from 'bun:test'

import { BudgetEntity, BudgetPeriod } from '~/budgets/domain/entities'
import { BudgetIdValueObject } from '~/budgets/domain/value-objects'
import { AmountValueObject } from '~/shared/domain/value-objects'

import { GetBudgetDto } from '../dtos'

import { BudgetMapper } from './Budget.mapper'

describe('BudgetMapper', () => {
  const makeEntity = (overrides?: { amountCents?: number; period?: BudgetPeriod }): BudgetEntity =>
    new BudgetEntity(
      new BudgetIdValueObject('550e8400-e29b-41d4-a716-446655440000'),
      '660e8400-e29b-41d4-a716-446655440000',
      AmountValueObject.fromCents(overrides?.amountCents ?? 20000),
      overrides?.period ?? BudgetPeriod.MONTHLY,
      new Date('2026-03-15T10:00:00Z'),
      new Date('2026-03-15T10:00:00Z')
    )

  describe('toGetBudgetDto', () => {
    it('should map entity to DTO with all fields', () => {
      const entity = makeEntity()
      const dto = BudgetMapper.toGetBudgetDto(entity)

      expect(dto).toBeInstanceOf(GetBudgetDto)
      expect(dto.id).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(dto.vehicleId).toBe('660e8400-e29b-41d4-a716-446655440000')
      expect(dto.amountCents).toBe(20000)
      expect(dto.period).toBe(BudgetPeriod.MONTHLY)
      expect(dto.createdAt).toEqual(new Date('2026-03-15T10:00:00Z'))
      expect(dto.updatedAt).toEqual(new Date('2026-03-15T10:00:00Z'))
    })

    it('should unwrap Amount VO to raw cents', () => {
      const entity = makeEntity({ amountCents: 12345 })
      const dto = BudgetMapper.toGetBudgetDto(entity)

      expect(typeof dto.amountCents).toBe('number')
      expect(Number.isInteger(dto.amountCents)).toBe(true)
      expect(dto.amountCents).toBe(12345)
    })

    it('should map each BudgetPeriod value', () => {
      const periods = [BudgetPeriod.MONTHLY, BudgetPeriod.ANNUAL]

      periods.forEach(period => {
        const entity = makeEntity({ period })
        const dto = BudgetMapper.toGetBudgetDto(entity)

        expect(dto.period).toBe(period)
      })
    })

    it('should return a GetBudgetDto instance', () => {
      const entity = makeEntity()
      const dto = BudgetMapper.toGetBudgetDto(entity)

      expect(dto).toBeInstanceOf(GetBudgetDto)
    })
  })
})
