import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { AuthSession } from '~/auth/domain/types'
import { CheckStatusSummaryDto } from '~/check-logs/application/dtos'
import { CheckLogService } from '~/check-logs/application/services'
import { GetVehicleDto } from '~/vehicles/application/dtos'
import { VehicleService } from '~/vehicles/application/services'

import { CheckStatusController } from './CheckStatus.controller'

describe('CheckStatusController', () => {
  let controller: CheckStatusController
  let mockCheckLogService: {
    getCheckStatusSummary: Mock<typeof CheckLogService.prototype.getCheckStatusSummary>
  }
  let mockVehicleService: {
    getVehicleByUser: Mock<typeof VehicleService.prototype.getVehicleByUser>
  }

  const vehicleId = '123e4567-e89b-12d3-a456-426614174000'
  const userId = '123e4567-e89b-12d3-a456-426614174001'

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
      engineType: 'V6',
      fuelType: 'GASOLINE',
      vin: null,
      licensePlate: 'ABC123',
      purchaseDate: new Date('2025-01-01'),
      mileage: 15000,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    })
    return dto
  }

  beforeEach(async () => {
    mockCheckLogService = {
      getCheckStatusSummary: mock(() => {}) as unknown as Mock<
        typeof CheckLogService.prototype.getCheckStatusSummary
      >
    }

    mockVehicleService = {
      getVehicleByUser: mock(() => {}) as unknown as Mock<
        typeof VehicleService.prototype.getVehicleByUser
      >
    }

    const module = await Test.createTestingModule({
      controllers: [CheckStatusController],
      providers: [
        { provide: CheckLogService, useValue: mockCheckLogService },
        { provide: VehicleService, useValue: mockVehicleService }
      ]
    }).compile()

    controller = module.get<CheckStatusController>(CheckStatusController)

    mockCheckLogService.getCheckStatusSummary.mockClear()
    mockVehicleService.getVehicleByUser.mockClear()
  })

  describe('getSummary', () => {
    it('should return check status summaries for the vehicle', async () => {
      const expectedVehicle = createMockVehicleDto()
      const summaries = [
        Object.assign(new CheckStatusSummaryDto(), {
          checkTypeId: '660e8400-e29b-41d4-a716-446655440000',
          checkTypeName: 'Vidange',
          intervalDays: 7,
          lastCompletedAt: '2026-03-15',
          nextDueAt: '2026-03-22',
          status: 'on-time'
        })
      ]
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(expectedVehicle)
      mockCheckLogService.getCheckStatusSummary.mockResolvedValue(summaries)

      const result = await controller.getSummary(session, vehicleId)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockCheckLogService.getCheckStatusSummary).toHaveBeenCalledWith(vehicleId)
      expect(result).toEqual(summaries)
    })
  })

  describe('verifyVehicleOwnership', () => {
    it('should throw VehicleNotFoundException when user has no vehicle', async () => {
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(null)

      await expect(controller.getSummary(session, vehicleId)).rejects.toThrow(
        `Vehicle not found: ${vehicleId}`
      )
    })
  })
})
