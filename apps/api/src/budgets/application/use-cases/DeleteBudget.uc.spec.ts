import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { BudgetEntity, BudgetPeriod } from '~/budgets/domain/entities'
import { BudgetNotFoundException } from '~/budgets/domain/exceptions'
import type { IBudgetRepository } from '~/budgets/domain/repositories'
import { BudgetIdValueObject } from '~/budgets/domain/value-objects'
import { AmountValueObject } from '~/shared/domain/value-objects'
import { GetVehicleDto } from '~/vehicles/application/dtos'
import type { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

import { DeleteBudgetUseCase } from './DeleteBudget.uc'

describe('DeleteBudgetUseCase', () => {
  let useCase: DeleteBudgetUseCase
  let mockRepository: {
    findByVehicleId: Mock<IBudgetRepository['findByVehicleId']>
    save: Mock<IBudgetRepository['save']>
    deleteByVehicleId: Mock<IBudgetRepository['deleteByVehicleId']>
  }
  let mockVehicleService: {
    getVehicleByUser: Mock<typeof VehicleService.prototype.getVehicleByUser>
  }

  const userId = '660e8400-e29b-41d4-a716-446655440001'
  const vehicleId = '660e8400-e29b-41d4-a716-446655440000'
  const budgetId = '550e8400-e29b-41d4-a716-446655440000'

  const makeVehicleDto = (): GetVehicleDto =>
    Object.assign(new GetVehicleDto(), {
      id: vehicleId,
      userId,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      engineType: null,
      fuelType: null,
      vin: null,
      licensePlate: null,
      purchaseDate: null,
      mileage: 0,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01')
    })

  const makeBudgetEntity = (): BudgetEntity =>
    new BudgetEntity(
      new BudgetIdValueObject(budgetId),
      vehicleId,
      AmountValueObject.fromCents(20000),
      BudgetPeriod.MONTHLY,
      new Date('2026-01-01'),
      new Date('2026-01-01')
    )

  beforeEach(() => {
    mockRepository = {
      findByVehicleId: mock(() => {}) as unknown as Mock<IBudgetRepository['findByVehicleId']>,
      save: mock(() => {}) as unknown as Mock<IBudgetRepository['save']>,
      deleteByVehicleId: mock(() => {}) as unknown as Mock<IBudgetRepository['deleteByVehicleId']>
    }
    mockVehicleService = {
      getVehicleByUser: mock(() => {}) as unknown as Mock<
        typeof VehicleService.prototype.getVehicleByUser
      >
    }
    useCase = new DeleteBudgetUseCase(
      mockRepository as unknown as IBudgetRepository,
      mockVehicleService as unknown as VehicleService
    )
  })

  describe('execute', () => {
    it('should delete the budget when vehicle and budget exist', async () => {
      mockVehicleService.getVehicleByUser.mockResolvedValueOnce(makeVehicleDto())
      mockRepository.findByVehicleId.mockResolvedValueOnce(makeBudgetEntity())
      mockRepository.deleteByVehicleId.mockResolvedValueOnce(undefined)

      await useCase.execute(userId)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockRepository.deleteByVehicleId).toHaveBeenCalledWith(vehicleId)
    })

    it('should throw VehicleNotFoundException when the user has no vehicle', async () => {
      mockVehicleService.getVehicleByUser.mockResolvedValueOnce(null)

      await expect(useCase.execute(userId)).rejects.toThrow(VehicleNotFoundException)
      expect(mockRepository.findByVehicleId).not.toHaveBeenCalled()
      expect(mockRepository.deleteByVehicleId).not.toHaveBeenCalled()
    })

    it('should throw BudgetNotFoundException when the vehicle has no budget', async () => {
      mockVehicleService.getVehicleByUser.mockResolvedValueOnce(makeVehicleDto())
      mockRepository.findByVehicleId.mockResolvedValueOnce(null)

      await expect(useCase.execute(userId)).rejects.toThrow(BudgetNotFoundException)
      expect(mockRepository.deleteByVehicleId).not.toHaveBeenCalled()
    })

    it('should propagate repository errors on deleteByVehicleId', async () => {
      mockVehicleService.getVehicleByUser.mockResolvedValueOnce(makeVehicleDto())
      mockRepository.findByVehicleId.mockResolvedValueOnce(makeBudgetEntity())
      mockRepository.deleteByVehicleId.mockRejectedValueOnce(new Error('DB error'))

      await expect(useCase.execute(userId)).rejects.toThrow('DB error')
    })
  })
})
