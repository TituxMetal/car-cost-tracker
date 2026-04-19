import { describe, expect, it } from 'bun:test'

import { ExpenseCategory } from '~/expenses/domain/entities'

import { GetExpenseDto } from './GetExpense.dto'

describe('GetExpenseDto', () => {
  const getDto = (overrides: Partial<GetExpenseDto> = {}): GetExpenseDto =>
    Object.assign(new GetExpenseDto(), {
      id: '550e8400-e29b-41d4-a716-446655440000',
      vehicleId: '660e8400-e29b-41d4-a716-446655440000',
      occurredAt: '2026-03-15',
      amountCents: 8950,
      category: ExpenseCategory.SERVICE,
      description: 'Oil change',
      createdAt: new Date('2026-03-15T10:00:00Z'),
      updatedAt: new Date('2026-03-15T10:00:00Z'),
      ...overrides
    })

  it('should create instance with all properties', () => {
    const dto = getDto()

    expect(dto).toBeInstanceOf(GetExpenseDto)
    expect(dto.id).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(dto.vehicleId).toBe('660e8400-e29b-41d4-a716-446655440000')
    expect(dto.occurredAt).toBe('2026-03-15')
    expect(dto.amountCents).toBe(8950)
    expect(dto.category).toBe(ExpenseCategory.SERVICE)
    expect(dto.description).toBe('Oil change')
    expect(dto.createdAt).toEqual(new Date('2026-03-15T10:00:00Z'))
    expect(dto.updatedAt).toEqual(new Date('2026-03-15T10:00:00Z'))
  })

  it('should handle null description', () => {
    const dto = getDto({ description: null })

    expect(dto).toBeInstanceOf(GetExpenseDto)
    expect(dto.description).toBeNull()
  })

  it('should be serializable to JSON', () => {
    const dto = getDto()

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.id).toBe(dto.id)
    expect(parsed.vehicleId).toBe(dto.vehicleId)
    expect(parsed.occurredAt).toBe(dto.occurredAt)
    expect(parsed.amountCents).toBe(dto.amountCents)
    expect(parsed.category).toBe(dto.category)
  })
})
