import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { AuthSession } from '~/auth/domain/types'
import { GetBudgetDto, UpsertBudgetDto } from '~/budgets/application/dtos'
import { BudgetService } from '~/budgets/application/services'
import { BudgetPeriod } from '~/budgets/domain/entities'
import { BudgetNotFoundException } from '~/budgets/domain/exceptions'
import { GetVehicleDto } from '~/vehicles/application/dtos'
import { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

import { BudgetController } from './Budget.controller'

describe('BudgetController', () => {
  let controller: BudgetController
  let mockBudgetService: {
    getBudgetByVehicle: Mock<typeof BudgetService.prototype.getBudgetByVehicle>
    upsertBudget: Mock<typeof BudgetService.prototype.upsertBudget>
    deleteBudget: Mock<typeof BudgetService.prototype.deleteBudget>
  }
  let mockVehicleService: {
    getVehicleByUser: Mock<typeof VehicleService.prototype.getVehicleByUser>
  }

  const vehicleId = '123e4567-e89b-12d3-a456-426614174000'
  const userId = '123e4567-e89b-12d3-a456-426614174001'
  const budgetId = '123e4567-e89b-12d3-a456-426614174010'

  const createMockSession = (uid: string): AuthSession => ({
    session: { id: 'session-id', userId: uid, expiresAt: new Date() },
    user: {
      id: uid,
      email: 'test@example.com',
      emailVerified: true,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      banned: false,
      banReason: null,
      banExpires: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  const createMockVehicleDto = (overrides = {}): GetVehicleDto => {
    const dto = new GetVehicleDto()
    Object.assign(dto, {
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
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    })
    return dto
  }

  const createMockGetBudgetDto = (overrides = {}): GetBudgetDto => {
    const dto = new GetBudgetDto()
    Object.assign(dto, {
      id: budgetId,
      vehicleId,
      amountCents: 20000,
      period: BudgetPeriod.MONTHLY,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    })
    return dto
  }

  const createUpsertDto = (overrides: Partial<UpsertBudgetDto> = {}): UpsertBudgetDto =>
    Object.assign(new UpsertBudgetDto(), {
      amountCents: 50000,
      period: BudgetPeriod.ANNUAL,
      ...overrides
    })

  beforeEach(async () => {
    mockBudgetService = {
      getBudgetByVehicle: mock(() => {}) as unknown as Mock<
        typeof BudgetService.prototype.getBudgetByVehicle
      >,
      upsertBudget: mock(() => {}) as unknown as Mock<typeof BudgetService.prototype.upsertBudget>,
      deleteBudget: mock(() => {}) as unknown as Mock<typeof BudgetService.prototype.deleteBudget>
    }

    mockVehicleService = {
      getVehicleByUser: mock(() => {}) as unknown as Mock<
        typeof VehicleService.prototype.getVehicleByUser
      >
    }

    const module = await Test.createTestingModule({
      controllers: [BudgetController],
      providers: [
        { provide: BudgetService, useValue: mockBudgetService },
        { provide: VehicleService, useValue: mockVehicleService }
      ]
    }).compile()

    controller = module.get<BudgetController>(BudgetController)
  })

  describe('get', () => {
    it('should return the budget for the authenticated user vehicle', async () => {
      const session = createMockSession(userId)
      const expected = createMockGetBudgetDto()

      mockVehicleService.getVehicleByUser.mockResolvedValue(createMockVehicleDto())
      mockBudgetService.getBudgetByVehicle.mockResolvedValue(expected)

      const result = await controller.get(session, vehicleId)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockBudgetService.getBudgetByVehicle).toHaveBeenCalledWith(userId)
      expect(result).toEqual(expected)
    })

    it('should throw VehicleNotFoundException when the user has no vehicle', async () => {
      const session = createMockSession(userId)
      mockVehicleService.getVehicleByUser.mockResolvedValue(null)

      await expect(controller.get(session, vehicleId)).rejects.toThrow(VehicleNotFoundException)
      expect(mockBudgetService.getBudgetByVehicle).not.toHaveBeenCalled()
    })

    it('should throw VehicleNotFoundException when the route vehicleId does not match', async () => {
      const session = createMockSession(userId)
      mockVehicleService.getVehicleByUser.mockResolvedValue(
        createMockVehicleDto({ id: 'different-vehicle-id' })
      )

      await expect(controller.get(session, vehicleId)).rejects.toThrow(VehicleNotFoundException)
      expect(mockBudgetService.getBudgetByVehicle).not.toHaveBeenCalled()
    })

    it('should propagate BudgetNotFoundException when the vehicle has no budget', async () => {
      const session = createMockSession(userId)
      mockVehicleService.getVehicleByUser.mockResolvedValue(createMockVehicleDto())
      mockBudgetService.getBudgetByVehicle.mockRejectedValue(new BudgetNotFoundException(vehicleId))

      await expect(controller.get(session, vehicleId)).rejects.toThrow(BudgetNotFoundException)
      expect(mockBudgetService.getBudgetByVehicle).toHaveBeenCalledWith(userId)
    })
  })

  describe('upsert', () => {
    it('should delegate create-when-absent to the service with userId + dto', async () => {
      const session = createMockSession(userId)
      const dto = createUpsertDto()
      const expected = createMockGetBudgetDto({
        amountCents: dto.amountCents,
        period: dto.period
      })

      mockVehicleService.getVehicleByUser.mockResolvedValue(createMockVehicleDto())
      mockBudgetService.upsertBudget.mockResolvedValue(expected)

      const result = await controller.upsert(session, vehicleId, dto)

      expect(mockBudgetService.upsertBudget).toHaveBeenCalledWith(userId, dto)
      expect(result).toEqual(expected)
    })

    it('should delegate replace-when-present through the same call path (idempotent)', async () => {
      const session = createMockSession(userId)
      const dto = createUpsertDto({ amountCents: 75000, period: BudgetPeriod.MONTHLY })
      const expected = createMockGetBudgetDto({
        amountCents: 75000,
        period: BudgetPeriod.MONTHLY
      })

      mockVehicleService.getVehicleByUser.mockResolvedValue(createMockVehicleDto())
      mockBudgetService.upsertBudget.mockResolvedValue(expected)

      const result = await controller.upsert(session, vehicleId, dto)

      expect(mockBudgetService.upsertBudget).toHaveBeenCalledWith(userId, dto)
      expect(result).toEqual(expected)
    })

    it('should throw VehicleNotFoundException when ownership check fails', async () => {
      const session = createMockSession(userId)
      mockVehicleService.getVehicleByUser.mockResolvedValue(null)

      await expect(controller.upsert(session, vehicleId, createUpsertDto())).rejects.toThrow(
        VehicleNotFoundException
      )
      expect(mockBudgetService.upsertBudget).not.toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('should delegate to the service and resolve void (204 contract)', async () => {
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(createMockVehicleDto())
      mockBudgetService.deleteBudget.mockResolvedValue(undefined)

      const result = await controller.delete(session, vehicleId)

      expect(mockBudgetService.deleteBudget).toHaveBeenCalledWith(userId)
      expect(result).toBeUndefined()
    })

    it('should throw VehicleNotFoundException when the user has no vehicle', async () => {
      const session = createMockSession(userId)
      mockVehicleService.getVehicleByUser.mockResolvedValue(null)

      await expect(controller.delete(session, vehicleId)).rejects.toThrow(VehicleNotFoundException)
      expect(mockBudgetService.deleteBudget).not.toHaveBeenCalled()
    })
  })

  describe('verifyVehicleOwnership (via get)', () => {
    it('should throw with the vehicleId in the message when the user has no vehicle', async () => {
      const session = createMockSession(userId)
      mockVehicleService.getVehicleByUser.mockResolvedValue(null)

      await expect(controller.get(session, vehicleId)).rejects.toThrow(
        `Vehicle not found: ${vehicleId}`
      )
    })

    it('should throw with the vehicleId in the message when vehicle IDs mismatch', async () => {
      const session = createMockSession(userId)
      mockVehicleService.getVehicleByUser.mockResolvedValue(
        createMockVehicleDto({ id: 'different-vehicle-id' })
      )

      await expect(controller.get(session, vehicleId)).rejects.toThrow(
        `Vehicle not found: ${vehicleId}`
      )
    })
  })
})
