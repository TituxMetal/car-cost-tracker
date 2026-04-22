import { describe, expect, it } from 'bun:test'
import { validate } from 'class-validator'

import { BudgetPeriod } from '~/budgets/domain/entities'
import { BUDGET_VALIDATION } from '~/budgets/domain/validation'
import { AMOUNT_VALIDATION } from '~/shared/domain/validation'

import { UpsertBudgetDto } from './UpsertBudget.dto'

describe('UpsertBudgetDto', () => {
  const createDto = (overrides: Partial<UpsertBudgetDto> = {}): UpsertBudgetDto =>
    Object.assign(new UpsertBudgetDto(), {
      amountCents: 20000,
      period: BudgetPeriod.MONTHLY,
      ...overrides
    })

  const errorsFor = async (dto: UpsertBudgetDto, property: keyof UpsertBudgetDto) => {
    const errors = await validate(dto)

    return errors.filter(error => error.property === property)
  }

  describe('happy path', () => {
    it('should pass validation with valid amountCents and period', async () => {
      const dto = createDto()

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should accept BudgetPeriod.ANNUAL', async () => {
      const dto = createDto({ period: BudgetPeriod.ANNUAL })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should accept amountCents at the maximum cap', async () => {
      const dto = createDto({ amountCents: AMOUNT_VALIDATION.MAX_CENTS })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('amountCents', () => {
    it('should reject a negative amount', async () => {
      const dto = createDto({ amountCents: -100 })

      const errors = await errorsFor(dto, 'amountCents')

      expect(errors.length).toBeGreaterThan(0)
      expect(Object.values(errors[0].constraints ?? {})).toContain(AMOUNT_VALIDATION.MIN_MESSAGE)
    })

    it('should reject zero', async () => {
      const dto = createDto({ amountCents: 0 })

      const errors = await errorsFor(dto, 'amountCents')

      expect(errors.length).toBeGreaterThan(0)
      expect(Object.values(errors[0].constraints ?? {})).toContain(AMOUNT_VALIDATION.MIN_MESSAGE)
    })

    it('should reject a non-integer amount', async () => {
      const dto = createDto({ amountCents: 12.34 })

      const errors = await errorsFor(dto, 'amountCents')

      expect(errors.length).toBeGreaterThan(0)
      expect(Object.values(errors[0].constraints ?? {})).toContain(
        AMOUNT_VALIDATION.INTEGER_MESSAGE
      )
    })

    it('should reject an amount exceeding the cap', async () => {
      const dto = createDto({ amountCents: AMOUNT_VALIDATION.MAX_CENTS + 1 })

      const errors = await errorsFor(dto, 'amountCents')

      expect(errors.length).toBeGreaterThan(0)
      expect(Object.values(errors[0].constraints ?? {})).toContain(AMOUNT_VALIDATION.MAX_MESSAGE)
    })

    it('should reject when amountCents is missing', async () => {
      const dto = createDto()
      delete (dto as Partial<UpsertBudgetDto>).amountCents

      const errors = await errorsFor(dto, 'amountCents')

      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('period', () => {
    it('should reject an invalid period value', async () => {
      const dto = createDto({ period: 'WEEKLY' as unknown as BudgetPeriod })

      const errors = await errorsFor(dto, 'period')

      expect(errors.length).toBeGreaterThan(0)
      expect(Object.values(errors[0].constraints ?? {})).toContain(BUDGET_VALIDATION.PERIOD.MESSAGE)
    })

    it('should reject when period is missing', async () => {
      const dto = createDto()
      delete (dto as Partial<UpsertBudgetDto>).period

      const errors = await errorsFor(dto, 'period')

      expect(errors.length).toBeGreaterThan(0)
    })
  })
})
