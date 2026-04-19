import { describe, expect, it } from 'bun:test'

import { ExpenseCategory } from '~/expenses/domain/entities'

import { CreateExpenseDto } from './CreateExpense.dto'

describe('CreateExpenseDto', () => {
  const createDto = (overrides: Partial<CreateExpenseDto> = {}): CreateExpenseDto =>
    Object.assign(new CreateExpenseDto(), {
      occurredAt: '2026-03-15',
      amountCents: 8950,
      category: ExpenseCategory.SERVICE,
      description: 'Oil change',
      ...overrides
    })

  it('should create instance with all properties', () => {
    const dto = createDto()

    expect(dto).toBeInstanceOf(CreateExpenseDto)
    expect(dto.occurredAt).toBe('2026-03-15')
    expect(dto.amountCents).toBe(8950)
    expect(dto.category).toBe(ExpenseCategory.SERVICE)
    expect(dto.description).toBe('Oil change')
  })

  it('should create instance without optional description', () => {
    const dto = createDto({ description: undefined })

    expect(dto).toBeInstanceOf(CreateExpenseDto)
    expect(dto.occurredAt).toBe('2026-03-15')
    expect(dto.amountCents).toBe(8950)
    expect(dto.category).toBe(ExpenseCategory.SERVICE)
    expect(dto.description).toBeUndefined()
  })

  it('should be serializable to JSON', () => {
    const dto = createDto()

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.occurredAt).toBe(dto.occurredAt)
    expect(parsed.amountCents).toBe(dto.amountCents)
    expect(parsed.category).toBe(dto.category)
    expect(parsed.description).toBe(dto.description)
  })
})
