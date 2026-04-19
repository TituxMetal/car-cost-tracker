import { describe, expect, it } from 'bun:test'

import { ExpenseCategory } from '~/expenses/domain/entities'

import { UpdateExpenseDto } from './UpdateExpense.dto'

describe('UpdateExpenseDto', () => {
  const updateDto = (overrides: Partial<UpdateExpenseDto> = {}): UpdateExpenseDto =>
    Object.assign(new UpdateExpenseDto(), {
      occurredAt: '2026-03-15',
      amountCents: 8950,
      category: ExpenseCategory.SERVICE,
      description: 'Oil change',
      ...overrides
    })

  it('should create empty instance with all fields undefined', () => {
    const dto = updateDto({
      occurredAt: undefined,
      amountCents: undefined,
      category: undefined,
      description: undefined
    })

    expect(dto).toBeInstanceOf(UpdateExpenseDto)
    expect(dto.occurredAt).toBeUndefined()
    expect(dto.amountCents).toBeUndefined()
    expect(dto.category).toBeUndefined()
    expect(dto.description).toBeUndefined()
  })

  it('should create instance with a single property', () => {
    const dto = updateDto({
      occurredAt: undefined,
      amountCents: 12000,
      category: undefined,
      description: undefined
    })

    expect(dto).toBeInstanceOf(UpdateExpenseDto)
    expect(dto.amountCents).toBe(12000)
    expect(dto.occurredAt).toBeUndefined()
    expect(dto.category).toBeUndefined()
    expect(dto.description).toBeUndefined()
  })

  it('should create instance with all properties', () => {
    const dto = updateDto()

    expect(dto).toBeInstanceOf(UpdateExpenseDto)
    expect(dto.occurredAt).toBe('2026-03-15')
    expect(dto.amountCents).toBe(8950)
    expect(dto.category).toBe(ExpenseCategory.SERVICE)
    expect(dto.description).toBe('Oil change')
  })

  it('should accept null description to clear the field', () => {
    const dto = updateDto({ description: null })

    expect(dto).toBeInstanceOf(UpdateExpenseDto)
    expect(dto.description).toBeNull()
  })

  it('should be serializable to JSON', () => {
    const dto = updateDto()

    const json = JSON.stringify(dto)
    const parsed = JSON.parse(json)

    expect(parsed.occurredAt).toBe(dto.occurredAt)
    expect(parsed.amountCents).toBe(dto.amountCents)
    expect(parsed.category).toBe(dto.category)
    expect(parsed.description).toBe(dto.description)
  })
})
