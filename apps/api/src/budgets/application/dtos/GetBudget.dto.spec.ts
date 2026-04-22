import { describe, expect, it } from 'bun:test'

import { BudgetPeriod } from '~/budgets/domain/entities'

import { GetBudgetDto } from './GetBudget.dto'

describe('GetBudgetDto', () => {
  const getDto = (overrides: Partial<GetBudgetDto> = {}): GetBudgetDto =>
    Object.assign(new GetBudgetDto(), {
      id: '550e8400-e29b-41d4-a716-446655440000',
      vehicleId: '660e8400-e29b-41d4-a716-446655440000',
      amountCents: 20000,
      period: BudgetPeriod.MONTHLY,
      createdAt: new Date('2026-03-15T10:00:00Z'),
      updatedAt: new Date('2026-03-15T10:00:00Z'),
      ...overrides
    })

  it('should create instance with all properties', () => {
    const dto = getDto()

    expect(dto).toBeInstanceOf(GetBudgetDto)
    expect(dto.id).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(dto.vehicleId).toBe('660e8400-e29b-41d4-a716-446655440000')
    expect(dto.amountCents).toBe(20000)
    expect(dto.period).toBe(BudgetPeriod.MONTHLY)
    expect(dto.createdAt).toEqual(new Date('2026-03-15T10:00:00Z'))
    expect(dto.updatedAt).toEqual(new Date('2026-03-15T10:00:00Z'))
  })

  it('should accept BudgetPeriod.ANNUAL', () => {
    const dto = getDto({ period: BudgetPeriod.ANNUAL })

    expect(dto).toBeInstanceOf(GetBudgetDto)
    expect(dto.period).toBe(BudgetPeriod.ANNUAL)
  })

  it('should be serializable to JSON', () => {
    const dto = getDto()

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.id).toBe(dto.id)
    expect(parsed.vehicleId).toBe(dto.vehicleId)
    expect(parsed.amountCents).toBe(dto.amountCents)
    expect(parsed.period).toBe(dto.period)
  })
})
