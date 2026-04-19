import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { ExpenseCategory, ExpenseEntity } from '~/expenses/domain/entities'
import { ExpenseNotFoundException } from '~/expenses/domain/exceptions'
import type { IExpenseRepository } from '~/expenses/domain/repositories'
import {
  AmountValueObject,
  ExpenseIdValueObject,
  OccurredAtValueObject
} from '~/expenses/domain/value-objects'

import { DeleteExpenseUseCase } from './DeleteExpense.uc'

describe('DeleteExpenseUseCase', () => {
  let useCase: DeleteExpenseUseCase
  let mockRepository: {
    create: Mock<IExpenseRepository['create']>
    findById: Mock<IExpenseRepository['findById']>
    findByVehicleId: Mock<IExpenseRepository['findByVehicleId']>
    update: Mock<IExpenseRepository['update']>
    delete: Mock<IExpenseRepository['delete']>
  }

  const vehicleId = 'vehicle-123'
  const expenseId = '550e8400-e29b-41d4-a716-446655440000'

  const makeEntity = (overrides?: { vehicleId?: string }): ExpenseEntity =>
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
    useCase = new DeleteExpenseUseCase(mockRepository as unknown as IExpenseRepository)
  })

  describe('execute', () => {
    it('should delete an existing expense that belongs to the vehicle', async () => {
      mockRepository.findById.mockResolvedValueOnce(makeEntity())
      mockRepository.delete.mockResolvedValueOnce(undefined)

      await useCase.execute(expenseId, vehicleId)

      expect(mockRepository.delete).toHaveBeenCalledTimes(1)
    })

    it('should throw ExpenseNotFoundException when expense does not exist', async () => {
      mockRepository.findById.mockResolvedValueOnce(null)

      await expect(useCase.execute(expenseId, vehicleId)).rejects.toThrow(ExpenseNotFoundException)
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })

    it('should throw ExpenseNotFoundException when expense belongs to another vehicle', async () => {
      mockRepository.findById.mockResolvedValueOnce(makeEntity({ vehicleId: 'other-vehicle' }))

      await expect(useCase.execute(expenseId, vehicleId)).rejects.toThrow(ExpenseNotFoundException)
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })

    it('should propagate repository errors on delete', async () => {
      mockRepository.findById.mockResolvedValueOnce(makeEntity())
      mockRepository.delete.mockRejectedValueOnce(new Error('DB error'))

      await expect(useCase.execute(expenseId, vehicleId)).rejects.toThrow('DB error')
    })
  })
})
