import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { ExpenseCategory } from '~/expenses/domain/entities'

import type { CreateExpenseDto, GetExpenseDto, UpdateExpenseDto } from '../dtos'
import {
  CreateExpenseUseCase,
  DeleteExpenseUseCase,
  GetExpenseByIdUseCase,
  ListExpensesByVehicleUseCase,
  UpdateExpenseUseCase
} from '../use-cases'

import { ExpenseService } from './Expense.service'

describe('ExpenseService', () => {
  let service: ExpenseService
  let mockCreateExpenseUseCase: {
    execute: Mock<typeof CreateExpenseUseCase.prototype.execute>
  }
  let mockListExpensesByVehicleUseCase: {
    execute: Mock<typeof ListExpensesByVehicleUseCase.prototype.execute>
  }
  let mockGetExpenseByIdUseCase: {
    execute: Mock<typeof GetExpenseByIdUseCase.prototype.execute>
  }
  let mockUpdateExpenseUseCase: {
    execute: Mock<typeof UpdateExpenseUseCase.prototype.execute>
  }
  let mockDeleteExpenseUseCase: {
    execute: Mock<typeof DeleteExpenseUseCase.prototype.execute>
  }

  const vehicleId = 'vehicle-123'
  const expenseId = '550e8400-e29b-41d4-a716-446655440000'

  const sampleDto: GetExpenseDto = {
    id: expenseId,
    vehicleId,
    occurredAt: '2026-03-15',
    amountCents: 8950,
    category: ExpenseCategory.SERVICE,
    description: 'Oil change',
    createdAt: new Date('2026-03-15T10:00:00Z'),
    updatedAt: new Date('2026-03-15T10:00:00Z')
  }

  beforeEach(async () => {
    mockCreateExpenseUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof CreateExpenseUseCase.prototype.execute>
    }
    mockListExpensesByVehicleUseCase = {
      execute: mock(() => {}) as unknown as Mock<
        typeof ListExpensesByVehicleUseCase.prototype.execute
      >
    }
    mockGetExpenseByIdUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof GetExpenseByIdUseCase.prototype.execute>
    }
    mockUpdateExpenseUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof UpdateExpenseUseCase.prototype.execute>
    }
    mockDeleteExpenseUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof DeleteExpenseUseCase.prototype.execute>
    }

    const module = await Test.createTestingModule({
      providers: [
        ExpenseService,
        { provide: CreateExpenseUseCase, useValue: mockCreateExpenseUseCase },
        { provide: ListExpensesByVehicleUseCase, useValue: mockListExpensesByVehicleUseCase },
        { provide: GetExpenseByIdUseCase, useValue: mockGetExpenseByIdUseCase },
        { provide: UpdateExpenseUseCase, useValue: mockUpdateExpenseUseCase },
        { provide: DeleteExpenseUseCase, useValue: mockDeleteExpenseUseCase }
      ]
    }).compile()

    service = module.get<ExpenseService>(ExpenseService)
  })

  describe('createExpense', () => {
    it('should delegate to createExpenseUseCase with correct parameters', async () => {
      const dto: CreateExpenseDto = {
        occurredAt: '2026-03-15',
        amountCents: 8950,
        category: ExpenseCategory.SERVICE,
        description: 'Oil change'
      }
      mockCreateExpenseUseCase.execute.mockResolvedValueOnce(sampleDto)

      const result = await service.createExpense(dto, vehicleId)

      expect(mockCreateExpenseUseCase.execute).toHaveBeenCalledWith(dto, vehicleId)
      expect(result).toBe(sampleDto)
    })
  })

  describe('listExpensesByVehicle', () => {
    it('should delegate to listExpensesByVehicleUseCase with correct parameters', async () => {
      mockListExpensesByVehicleUseCase.execute.mockResolvedValueOnce([sampleDto])

      const result = await service.listExpensesByVehicle(vehicleId)

      expect(mockListExpensesByVehicleUseCase.execute).toHaveBeenCalledWith(vehicleId)
      expect(result).toEqual([sampleDto])
    })
  })

  describe('getExpenseById', () => {
    it('should delegate to getExpenseByIdUseCase with correct parameters', async () => {
      mockGetExpenseByIdUseCase.execute.mockResolvedValueOnce(sampleDto)

      const result = await service.getExpenseById(expenseId, vehicleId)

      expect(mockGetExpenseByIdUseCase.execute).toHaveBeenCalledWith(expenseId, vehicleId)
      expect(result).toBe(sampleDto)
    })
  })

  describe('updateExpense', () => {
    it('should delegate to updateExpenseUseCase with correct parameters', async () => {
      const dto: UpdateExpenseDto = { description: 'New note' }
      mockUpdateExpenseUseCase.execute.mockResolvedValueOnce(sampleDto)

      const result = await service.updateExpense(expenseId, vehicleId, dto)

      expect(mockUpdateExpenseUseCase.execute).toHaveBeenCalledWith(expenseId, vehicleId, dto)
      expect(result).toBe(sampleDto)
    })
  })

  describe('deleteExpense', () => {
    it('should delegate to deleteExpenseUseCase with correct parameters', async () => {
      mockDeleteExpenseUseCase.execute.mockResolvedValueOnce(undefined)

      await service.deleteExpense(expenseId, vehicleId)

      expect(mockDeleteExpenseUseCase.execute).toHaveBeenCalledWith(expenseId, vehicleId)
    })
  })
})
