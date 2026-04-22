import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { UpsertBudgetDto } from '~/budgets/application/dtos'
import { BudgetEntity, BudgetPeriod } from '~/budgets/domain/entities'
import type { IBudgetRepository } from '~/budgets/domain/repositories'
import { BudgetIdValueObject } from '~/budgets/domain/value-objects'
import { AmountValueObject } from '~/shared/domain/value-objects'
import { GetVehicleDto } from '~/vehicles/application/dtos'
import type { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

import { UpsertBudgetUseCase } from './UpsertBudget.uc'

describe('UpsertBudgetUseCase', () => {
  let useCase: UpsertBudgetUseCase
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
  const existingBudgetId = '550e8400-e29b-41d4-a716-446655440000'

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

  const makeExistingEntity = (overrides?: {
    amountCents?: number
    period?: BudgetPeriod
  }): BudgetEntity =>
    new BudgetEntity(
      new BudgetIdValueObject(existingBudgetId),
      vehicleId,
      AmountValueObject.fromCents(overrides?.amountCents ?? 20000),
      overrides?.period ?? BudgetPeriod.MONTHLY,
      new Date('2026-01-01T00:00:00Z'),
      new Date('2026-01-01T00:00:00Z')
    )

  const makeDto = (overrides?: Partial<UpsertBudgetDto>): UpsertBudgetDto => ({
    amountCents: 50000,
    period: BudgetPeriod.ANNUAL,
    ...overrides
  })

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
    useCase = new UpsertBudgetUseCase(
      mockRepository as unknown as IBudgetRepository,
      mockVehicleService as unknown as VehicleService
    )
  })

  describe('create path (no existing budget)', () => {
    it('should generate a fresh BudgetEntity and persist it', async () => {
      const vehicleDto = makeVehicleDto()
      mockVehicleService.getVehicleByUser.mockResolvedValueOnce(vehicleDto)
      mockRepository.findByVehicleId.mockResolvedValueOnce(null)
      mockRepository.save.mockImplementationOnce(entity => Promise.resolve(entity))

      const result = await useCase.execute(userId, makeDto())

      expect(result.amountCents).toBe(50000)
      expect(result.period).toBe(BudgetPeriod.ANNUAL)
      expect(result.vehicleId).toBe(vehicleId)
      expect(result.id).not.toBe(existingBudgetId)
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          vehicleId,
          amount: expect.objectContaining({ value: 50000 }),
          period: BudgetPeriod.ANNUAL
        })
      )
    })
  })

  describe('update path (existing budget)', () => {
    it('should preserve id + createdAt, apply new amount/period, and refresh updatedAt', async () => {
      const vehicleDto = makeVehicleDto()
      const existingEntity = makeExistingEntity()
      const originalCreatedAt = existingEntity.createdAt
      const originalUpdatedAt = existingEntity.updatedAt.getTime()
      mockVehicleService.getVehicleByUser.mockResolvedValueOnce(vehicleDto)
      mockRepository.findByVehicleId.mockResolvedValueOnce(existingEntity)
      mockRepository.save.mockImplementationOnce(entity => Promise.resolve(entity))

      const result = await useCase.execute(userId, makeDto())

      expect(result.id).toBe(existingBudgetId)
      expect(result.amountCents).toBe(50000)
      expect(result.period).toBe(BudgetPeriod.ANNUAL)
      expect(result.createdAt).toEqual(originalCreatedAt)
      expect(result.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt)
    })

    it('should accept amount-only change (period unchanged)', async () => {
      const vehicleDto = makeVehicleDto()
      const existingEntity = makeExistingEntity()
      mockVehicleService.getVehicleByUser.mockResolvedValueOnce(vehicleDto)
      mockRepository.findByVehicleId.mockResolvedValueOnce(existingEntity)
      mockRepository.save.mockImplementationOnce(entity => Promise.resolve(entity))

      const result = await useCase.execute(
        userId,
        makeDto({ amountCents: 75000, period: BudgetPeriod.MONTHLY })
      )

      expect(result.id).toBe(existingBudgetId)
      expect(result.amountCents).toBe(75000)
      expect(result.period).toBe(BudgetPeriod.MONTHLY)
    })
  })

  describe('failures', () => {
    it('should throw VehicleNotFoundException when the user has no vehicle', async () => {
      mockVehicleService.getVehicleByUser.mockResolvedValueOnce(null)

      await expect(useCase.execute(userId, makeDto())).rejects.toThrow(VehicleNotFoundException)
      expect(mockRepository.findByVehicleId).not.toHaveBeenCalled()
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should propagate repository errors from save()', async () => {
      const vehicleDto = makeVehicleDto()
      mockVehicleService.getVehicleByUser.mockResolvedValueOnce(vehicleDto)
      mockRepository.findByVehicleId.mockResolvedValueOnce(null)
      const dbError = new Error('db down')
      mockRepository.save.mockRejectedValueOnce(dbError)

      await expect(useCase.execute(userId, makeDto())).rejects.toThrow(dbError)
    })

    it('should reject invalid amountCents at AmountValueObject construction', async () => {
      const vehicleDto = makeVehicleDto()
      mockVehicleService.getVehicleByUser.mockResolvedValueOnce(vehicleDto)
      mockRepository.findByVehicleId.mockResolvedValueOnce(null)

      await expect(useCase.execute(userId, makeDto({ amountCents: -1 }))).rejects.toThrow()
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should reject an invalid period on the update path', async () => {
      const vehicleDto = makeVehicleDto()
      const existingEntity = makeExistingEntity()
      mockVehicleService.getVehicleByUser.mockResolvedValueOnce(vehicleDto)
      mockRepository.findByVehicleId.mockResolvedValueOnce(existingEntity)

      await expect(
        useCase.execute(userId, makeDto({ period: 'WEEKLY' as unknown as BudgetPeriod }))
      ).rejects.toThrow('Invalid budget period')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })
  })
})
