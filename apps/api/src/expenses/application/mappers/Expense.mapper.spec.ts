import { describe, expect, it } from 'bun:test'

import { ExpenseCategory, ExpenseEntity } from '~/expenses/domain/entities'
import {
  AmountValueObject,
  ExpenseIdValueObject,
  OccurredAtValueObject
} from '~/expenses/domain/value-objects'

import { GetExpenseDto } from '../dtos'

import { ExpenseMapper } from './Expense.mapper'

describe('ExpenseMapper', () => {
  const makeEntity = (overrides?: {
    description?: string | null
    category?: ExpenseCategory
  }): ExpenseEntity =>
    new ExpenseEntity(
      new ExpenseIdValueObject('550e8400-e29b-41d4-a716-446655440000'),
      '660e8400-e29b-41d4-a716-446655440000',
      new OccurredAtValueObject('2026-03-15'),
      AmountValueObject.fromCents(8950),
      overrides?.category ?? ExpenseCategory.SERVICE,
      overrides?.description !== undefined ? overrides.description : 'Oil change',
      new Date('2026-03-15T10:00:00Z'),
      new Date('2026-03-15T10:00:00Z')
    )

  describe('toGetExpenseDto', () => {
    it('should map entity to DTO with all fields', () => {
      const entity = makeEntity()
      const dto = ExpenseMapper.toGetExpenseDto(entity)

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

    it('should map entity with null description', () => {
      const entity = makeEntity({ description: null })
      const dto = ExpenseMapper.toGetExpenseDto(entity)

      expect(dto.description).toBeNull()
    })

    it('should unwrap Amount VO to raw cents', () => {
      const entity = makeEntity()
      const dto = ExpenseMapper.toGetExpenseDto(entity)

      expect(typeof dto.amountCents).toBe('number')
      expect(dto.amountCents).toBe(8950)
    })

    it('should map each ExpenseCategory value', () => {
      const categories = [
        ExpenseCategory.SERVICE,
        ExpenseCategory.PARTS,
        ExpenseCategory.LABOR,
        ExpenseCategory.OTHER
      ]

      categories.forEach(category => {
        const entity = makeEntity({ category })
        const dto = ExpenseMapper.toGetExpenseDto(entity)

        expect(dto.category).toBe(category)
      })
    })

    it('should return a GetExpenseDto instance', () => {
      const entity = makeEntity()
      const dto = ExpenseMapper.toGetExpenseDto(entity)

      expect(dto).toBeInstanceOf(GetExpenseDto)
    })
  })
})
