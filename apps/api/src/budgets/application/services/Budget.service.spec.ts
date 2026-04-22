import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { BudgetPeriod } from '~/budgets/domain/entities'

import type { GetBudgetDto, UpsertBudgetDto } from '../dtos'
import type {
  DeleteBudgetUseCase,
  GetBudgetByVehicleUseCase,
  UpsertBudgetUseCase
} from '../use-cases'

import { BudgetService } from './Budget.service'

describe('BudgetService', () => {
  let service: BudgetService
  let mockGetBudgetByVehicleUseCase: {
    execute: Mock<typeof GetBudgetByVehicleUseCase.prototype.execute>
  }
  let mockUpsertBudgetUseCase: {
    execute: Mock<typeof UpsertBudgetUseCase.prototype.execute>
  }
  let mockDeleteBudgetUseCase: {
    execute: Mock<typeof DeleteBudgetUseCase.prototype.execute>
  }

  const userId = '660e8400-e29b-41d4-a716-446655440001'
  const vehicleId = '660e8400-e29b-41d4-a716-446655440000'
  const budgetId = '550e8400-e29b-41d4-a716-446655440000'

  const sampleDto: GetBudgetDto = {
    id: budgetId,
    vehicleId,
    amountCents: 20000,
    period: BudgetPeriod.MONTHLY,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01')
  }

  beforeEach(() => {
    mockGetBudgetByVehicleUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof GetBudgetByVehicleUseCase.prototype.execute>
    }
    mockUpsertBudgetUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof UpsertBudgetUseCase.prototype.execute>
    }
    mockDeleteBudgetUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof DeleteBudgetUseCase.prototype.execute>
    }
    service = new BudgetService(
      mockGetBudgetByVehicleUseCase as unknown as GetBudgetByVehicleUseCase,
      mockUpsertBudgetUseCase as unknown as UpsertBudgetUseCase,
      mockDeleteBudgetUseCase as unknown as DeleteBudgetUseCase
    )
  })

  describe('getBudgetByVehicle', () => {
    it('should delegate to GetBudgetByVehicleUseCase with userId', async () => {
      mockGetBudgetByVehicleUseCase.execute.mockResolvedValueOnce(sampleDto)

      const result = await service.getBudgetByVehicle(userId)

      expect(mockGetBudgetByVehicleUseCase.execute).toHaveBeenCalledWith(userId)
      expect(result).toBe(sampleDto)
    })
  })

  describe('upsertBudget', () => {
    it('should delegate to UpsertBudgetUseCase with userId and dto', async () => {
      const dto: UpsertBudgetDto = { amountCents: 50000, period: BudgetPeriod.ANNUAL }
      mockUpsertBudgetUseCase.execute.mockResolvedValueOnce(sampleDto)

      const result = await service.upsertBudget(userId, dto)

      expect(mockUpsertBudgetUseCase.execute).toHaveBeenCalledWith(userId, dto)
      expect(result).toBe(sampleDto)
    })
  })

  describe('deleteBudget', () => {
    it('should delegate to DeleteBudgetUseCase with userId', async () => {
      mockDeleteBudgetUseCase.execute.mockResolvedValueOnce(undefined)

      await service.deleteBudget(userId)

      expect(mockDeleteBudgetUseCase.execute).toHaveBeenCalledWith(userId)
    })
  })
})
