import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { ExpenseCategory } from '~/expenses/domain/entities'
import type { IExpenseRepository } from '~/expenses/domain/repositories'

import type { CreateExpenseDto } from '../dtos'

import { CreateExpenseUseCase } from './CreateExpense.uc'

describe('CreateExpenseUseCase', () => {
  let useCase: CreateExpenseUseCase
  let mockRepository: {
    create: Mock<IExpenseRepository['create']>
    findById: Mock<IExpenseRepository['findById']>
    findByVehicleId: Mock<IExpenseRepository['findByVehicleId']>
    update: Mock<IExpenseRepository['update']>
    delete: Mock<IExpenseRepository['delete']>
  }

  const vehicleId = 'vehicle-123'

  beforeEach(() => {
    mockRepository = {
      create: mock(() => {}) as unknown as Mock<IExpenseRepository['create']>,
      findById: mock(() => {}) as unknown as Mock<IExpenseRepository['findById']>,
      findByVehicleId: mock(() => {}) as unknown as Mock<IExpenseRepository['findByVehicleId']>,
      update: mock(() => {}) as unknown as Mock<IExpenseRepository['update']>,
      delete: mock(() => {}) as unknown as Mock<IExpenseRepository['delete']>
    }
    useCase = new CreateExpenseUseCase(mockRepository as unknown as IExpenseRepository)
  })

  describe('execute', () => {
    it('should create an expense with all fields', async () => {
      const dto: CreateExpenseDto = {
        occurredAt: '2026-03-15',
        amountCents: 8950,
        category: ExpenseCategory.SERVICE,
        description: 'Oil change'
      }

      mockRepository.create.mockImplementationOnce(async entity => entity)

      const result = await useCase.execute(dto, vehicleId)

      expect(result.vehicleId).toBe(vehicleId)
      expect(result.occurredAt).toBe('2026-03-15')
      expect(result.amountCents).toBe(8950)
      expect(result.category).toBe(ExpenseCategory.SERVICE)
      expect(result.description).toBe('Oil change')
      expect(result.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it('should default description to null when not provided', async () => {
      const dto: CreateExpenseDto = {
        occurredAt: '2026-03-15',
        amountCents: 8950,
        category: ExpenseCategory.SERVICE
      }

      mockRepository.create.mockImplementationOnce(async entity => entity)

      const result = await useCase.execute(dto, vehicleId)

      expect(result.description).toBeNull()
    })

    it('should call repository.create exactly once', async () => {
      const dto: CreateExpenseDto = {
        occurredAt: '2026-03-15',
        amountCents: 8950,
        category: ExpenseCategory.PARTS
      }

      mockRepository.create.mockImplementationOnce(async entity => entity)

      await useCase.execute(dto, vehicleId)

      expect(mockRepository.create).toHaveBeenCalledTimes(1)
    })

    it('should propagate repository errors', async () => {
      const dto: CreateExpenseDto = {
        occurredAt: '2026-03-15',
        amountCents: 8950,
        category: ExpenseCategory.SERVICE
      }

      mockRepository.create.mockRejectedValueOnce(new Error('DB write failed'))

      await expect(useCase.execute(dto, vehicleId)).rejects.toThrow('DB write failed')
    })
  })
})
