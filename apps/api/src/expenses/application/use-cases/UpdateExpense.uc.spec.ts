import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { ExpenseCategory, ExpenseEntity } from '~/expenses/domain/entities'
import { ExpenseNotFoundException } from '~/expenses/domain/exceptions'
import type { IExpenseRepository } from '~/expenses/domain/repositories'
import { ExpenseIdValueObject, OccurredAtValueObject } from '~/expenses/domain/value-objects'
import { AmountValueObject } from '~/shared/domain/value-objects'

import type { UpdateExpenseDto } from '../dtos'

import { UpdateExpenseUseCase } from './UpdateExpense.uc'

describe('UpdateExpenseUseCase', () => {
  let useCase: UpdateExpenseUseCase
  let mockRepository: {
    create: Mock<IExpenseRepository['create']>
    findById: Mock<IExpenseRepository['findById']>
    findByVehicleId: Mock<IExpenseRepository['findByVehicleId']>
    update: Mock<IExpenseRepository['update']>
    delete: Mock<IExpenseRepository['delete']>
  }

  const vehicleId = 'vehicle-123'
  const expenseId = '550e8400-e29b-41d4-a716-446655440000'

  const makeExistingEntity = (overrides?: { vehicleId?: string }): ExpenseEntity =>
    new ExpenseEntity(
      new ExpenseIdValueObject(expenseId),
      overrides?.vehicleId ?? vehicleId,
      new OccurredAtValueObject('2026-03-15'),
      AmountValueObject.fromCents(8950),
      ExpenseCategory.SERVICE,
      'Oil change',
      new Date('2026-03-15T10:00:00Z'),
      new Date('2026-03-15T10:00:00Z')
    )

  beforeEach(() => {
    mockRepository = {
      create: mock(() => {}) as unknown as Mock<IExpenseRepository['create']>,
      findById: mock(() => {}) as unknown as Mock<IExpenseRepository['findById']>,
      findByVehicleId: mock(() => {}) as unknown as Mock<IExpenseRepository['findByVehicleId']>,
      update: mock(() => {}) as unknown as Mock<IExpenseRepository['update']>,
      delete: mock(() => {}) as unknown as Mock<IExpenseRepository['delete']>
    }
    useCase = new UpdateExpenseUseCase(mockRepository as unknown as IExpenseRepository)
  })

  describe('execute', () => {
    it('should update only the occurredAt field when only it is provided', async () => {
      const existingEntity = makeExistingEntity()
      mockRepository.findById.mockResolvedValueOnce(existingEntity)
      mockRepository.update.mockImplementationOnce(async entity => entity)

      const dto: UpdateExpenseDto = { occurredAt: '2025-12-01' }
      const result = await useCase.execute(expenseId, vehicleId, dto)

      expect(result.occurredAt).toBe('2025-12-01')
      expect(result.amountCents).toBe(8950)
      expect(result.category).toBe(ExpenseCategory.SERVICE)
      expect(result.description).toBe('Oil change')
    })

    it('should update only the amount when only amountCents is provided', async () => {
      const existingEntity = makeExistingEntity()
      mockRepository.findById.mockResolvedValueOnce(existingEntity)
      mockRepository.update.mockImplementationOnce(async entity => entity)

      const dto: UpdateExpenseDto = { amountCents: 12000 }
      const result = await useCase.execute(expenseId, vehicleId, dto)

      expect(result.amountCents).toBe(12000)
      expect(result.occurredAt).toBe('2026-03-15')
      expect(result.category).toBe(ExpenseCategory.SERVICE)
      expect(result.description).toBe('Oil change')
    })

    it('should update only the category when only it is provided', async () => {
      const existingEntity = makeExistingEntity()
      mockRepository.findById.mockResolvedValueOnce(existingEntity)
      mockRepository.update.mockImplementationOnce(async entity => entity)

      const dto: UpdateExpenseDto = { category: ExpenseCategory.PARTS }
      const result = await useCase.execute(expenseId, vehicleId, dto)

      expect(result.category).toBe(ExpenseCategory.PARTS)
      expect(result.occurredAt).toBe('2026-03-15')
      expect(result.amountCents).toBe(8950)
      expect(result.description).toBe('Oil change')
    })

    it('should update description to a new value', async () => {
      const existingEntity = makeExistingEntity()
      mockRepository.findById.mockResolvedValueOnce(existingEntity)
      mockRepository.update.mockImplementationOnce(async entity => entity)

      const dto: UpdateExpenseDto = { description: 'Updated note' }
      const result = await useCase.execute(expenseId, vehicleId, dto)

      expect(result.description).toBe('Updated note')
      expect(result.occurredAt).toBe('2026-03-15')
      expect(result.amountCents).toBe(8950)
      expect(result.category).toBe(ExpenseCategory.SERVICE)
    })

    it('should clear description when explicitly set to null', async () => {
      const existingEntity = makeExistingEntity()
      mockRepository.findById.mockResolvedValueOnce(existingEntity)
      mockRepository.update.mockImplementationOnce(async entity => entity)

      const dto: UpdateExpenseDto = { description: null }
      const result = await useCase.execute(expenseId, vehicleId, dto)

      expect(result.description).toBeNull()
      expect(result.occurredAt).toBe('2026-03-15')
      expect(result.amountCents).toBe(8950)
      expect(result.category).toBe(ExpenseCategory.SERVICE)
    })

    it('should update multiple fields at once', async () => {
      const existingEntity = makeExistingEntity()
      mockRepository.findById.mockResolvedValueOnce(existingEntity)
      mockRepository.update.mockImplementationOnce(async entity => entity)

      const dto: UpdateExpenseDto = {
        occurredAt: '2025-12-01',
        amountCents: 12000,
        category: ExpenseCategory.PARTS,
        description: 'Updated note'
      }
      const result = await useCase.execute(expenseId, vehicleId, dto)

      expect(result.occurredAt).toBe('2025-12-01')
      expect(result.amountCents).toBe(12000)
      expect(result.category).toBe(ExpenseCategory.PARTS)
      expect(result.description).toBe('Updated note')
    })

    it('should throw ExpenseNotFoundException when entity does not exist', async () => {
      mockRepository.findById.mockResolvedValueOnce(null)

      const dto: UpdateExpenseDto = { description: 'New description' }
      await expect(useCase.execute(expenseId, vehicleId, dto)).rejects.toThrow(
        ExpenseNotFoundException
      )
    })

    it('should throw ExpenseNotFoundException when vehicleId does not match (ownership check)', async () => {
      const existingEntity = makeExistingEntity({ vehicleId: 'other-vehicle' })
      mockRepository.findById.mockResolvedValueOnce(existingEntity)

      const dto: UpdateExpenseDto = { description: 'New description' }
      await expect(useCase.execute(expenseId, vehicleId, dto)).rejects.toThrow(
        ExpenseNotFoundException
      )
    })

    it('should call repository.update exactly once on success', async () => {
      const existingEntity = makeExistingEntity()
      mockRepository.findById.mockResolvedValueOnce(existingEntity)
      mockRepository.update.mockImplementationOnce(async entity => entity)

      const dto: UpdateExpenseDto = { description: 'Updated note' }
      await useCase.execute(expenseId, vehicleId, dto)

      expect(mockRepository.update).toHaveBeenCalledTimes(1)
    })

    it('should NOT call any entity update method if DTO is empty', async () => {
      const existingEntity = makeExistingEntity()
      mockRepository.findById.mockResolvedValueOnce(existingEntity)

      let updatedEntity: ExpenseEntity | null = null
      mockRepository.update.mockImplementationOnce(async entity => {
        updatedEntity = entity
        return entity
      })

      const dto: UpdateExpenseDto = {}
      await useCase.execute(expenseId, vehicleId, dto)

      expect(updatedEntity).not.toBeNull()
      expect(updatedEntity!.occurredAt.value).toBe(existingEntity.occurredAt.value)
      expect(updatedEntity!.amount.value).toBe(existingEntity.amount.value)
      expect(updatedEntity!.category).toBe(existingEntity.category)
      expect(updatedEntity!.description).toBe(existingEntity.description)
    })
  })
})
