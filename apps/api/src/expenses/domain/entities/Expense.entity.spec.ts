import { describe, expect, it } from 'bun:test'

import { EXPENSE_VALIDATION as expenseValidation } from '../validation'
import { AmountValueObject, ExpenseIdValueObject, OccurredAtValueObject } from '../value-objects'

import { ExpenseCategory, ExpenseEntity } from './Expense.entity'

describe('ExpenseEntity', () => {
  const createValidEntity = (overrides?: Partial<ExpenseEntity>) =>
    new ExpenseEntity(
      new ExpenseIdValueObject('550e8400-e29b-41d4-a716-446655440000'),
      'vehicle-123',
      new OccurredAtValueObject('2026-03-15'),
      AmountValueObject.fromCents(8950),
      overrides?.category ?? ExpenseCategory.SERVICE,
      overrides?.description !== undefined ? overrides.description : 'Oil change',
      new Date('2026-01-01'),
      new Date('2026-01-01')
    )

  describe('constructor', () => {
    it('should create a valid entity with all fields', () => {
      const entity = createValidEntity()

      expect(entity.id.value).toBe('550e8400-e29b-41d4-a716-446655440000')
      expect(entity.vehicleId).toBe('vehicle-123')
      expect(entity.occurredAt.value).toBe('2026-03-15')
      expect(entity.amount.value).toBe(8950)
      expect(entity.category).toBe(ExpenseCategory.SERVICE)
      expect(entity.description).toBe('Oil change')
      expect(entity.createdAt.toISOString()).toBe(new Date('2026-01-01').toISOString())
      expect(entity.updatedAt.toISOString()).toBe(new Date('2026-01-01').toISOString())
    })

    it('should accept a null description', () => {
      const entity = createValidEntity({ description: null })

      expect(entity.description).toBeNull()
    })

    it('should accept a description at exactly max length', () => {
      const validDescription = 'a'.repeat(expenseValidation.DESCRIPTION.MAX_LENGTH)
      const entity = createValidEntity({ description: validDescription })

      expect(entity.description).toBe(validDescription)
    })

    it('should throw if description exceeds max length', () => {
      const longDescription = 'a'.repeat(expenseValidation.DESCRIPTION.MAX_LENGTH + 1)

      expect(() => createValidEntity({ description: longDescription })).toThrow(
        `Description cannot exceed ${expenseValidation.DESCRIPTION.MAX_LENGTH} characters`
      )
    })

    it('should throw if category is not a valid ExpenseCategory', () => {
      const invalidCategory = 'INVALID' as unknown as ExpenseCategory

      expect(() => createValidEntity({ category: invalidCategory })).toThrow(
        `Category must be one of: ${Object.values(ExpenseCategory).join(', ')}`
      )
    })
  })

  describe('updateOccurredAt', () => {
    it('should replace the occurredAt VO', () => {
      const entity = createValidEntity()
      const newOccurredAt = new OccurredAtValueObject('2025-12-01')

      entity.updateOccurredAt(newOccurredAt)

      expect(entity.occurredAt.value).toBe('2025-12-01')
    })

    it('should refresh updatedAt', () => {
      const entity = createValidEntity()
      const oldUpdatedAt = entity.updatedAt
      const newOccurredAt = new OccurredAtValueObject('2025-12-01')

      entity.updateOccurredAt(newOccurredAt)

      expect(entity.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
    })
  })

  describe('updateAmount', () => {
    it('should replace the amount VO', () => {
      const entity = createValidEntity()
      const newAmount = AmountValueObject.fromCents(12000)

      entity.updateAmount(newAmount)

      expect(entity.amount.value).toBe(12000)
    })

    it('should refresh updatedAt', () => {
      const entity = createValidEntity()
      const oldUpdatedAt = entity.updatedAt
      const newAmount = AmountValueObject.fromCents(12000)

      entity.updateAmount(newAmount)

      expect(entity.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
    })
  })

  describe('updateCategory', () => {
    it('should replace the category', () => {
      const entity = createValidEntity()
      const newCategory = ExpenseCategory.PARTS

      entity.updateCategory(newCategory)

      expect(entity.category).toBe(ExpenseCategory.PARTS)
    })

    it('should refresh updatedAt', () => {
      const entity = createValidEntity()
      const oldUpdatedAt = entity.updatedAt
      const newCategory = ExpenseCategory.PARTS

      entity.updateCategory(newCategory)

      expect(entity.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
    })

    it('should throw if next category is not a valid ExpenseCategory', () => {
      const entity = createValidEntity()
      const invalidCategory = 'INVALID' as unknown as ExpenseCategory

      expect(() => entity.updateCategory(invalidCategory)).toThrow(
        `Category must be one of: ${Object.values(ExpenseCategory).join(', ')}`
      )
    })
  })

  describe('updateDescription', () => {
    it('should replace the description', () => {
      const entity = createValidEntity()
      const newDescription = 'New note'

      entity.updateDescription(newDescription)

      expect(entity.description).toBe(newDescription)
    })

    it('should allow setting description to null', () => {
      const entity = createValidEntity()
      const newDescription = null

      entity.updateDescription(newDescription)

      expect(entity.description).toBeNull()
    })

    it('should refresh updatedAt', () => {
      const entity = createValidEntity()
      const oldUpdatedAt = entity.updatedAt
      const newDescription = 'New note'

      entity.updateDescription(newDescription)

      expect(entity.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
    })

    it('should throw if new description exceeds max length', () => {
      const entity = createValidEntity()
      const invalidDescription = 'a'.repeat(expenseValidation.DESCRIPTION.MAX_LENGTH + 1)

      expect(() => entity.updateDescription(invalidDescription)).toThrow(
        `Description cannot exceed ${expenseValidation.DESCRIPTION.MAX_LENGTH} characters`
      )
    })
  })
})
