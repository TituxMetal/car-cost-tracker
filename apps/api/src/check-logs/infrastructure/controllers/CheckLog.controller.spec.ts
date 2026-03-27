import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { AuthSession } from '~/auth/domain/types'
import { CreateCheckLogDto, GetCheckLogDto } from '~/check-logs/application/dtos'
import { CheckLogService } from '~/check-logs/application/services'
import { GetVehicleDto } from '~/vehicles/application/dtos'
import { VehicleService } from '~/vehicles/application/services'

import { CheckLogController } from './CheckLog.controller'

describe('CheckLogController', () => {
  let controller: CheckLogController
  let mockCheckLogService: {
    createCheckLog: Mock<typeof CheckLogService.prototype.createCheckLog>
    listCheckLogsByVehicle: Mock<typeof CheckLogService.prototype.listCheckLogsByVehicle>
    getCheckLog: Mock<typeof CheckLogService.prototype.getCheckLog>
    deleteCheckLog: Mock<typeof CheckLogService.prototype.deleteCheckLog>
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

  const createMockGetCheckLogDto = (overrides = {}): GetCheckLogDto => {
    const dto = new GetCheckLogDto()
    Object.assign(dto, {
      id: '123e4567-e89b-12d3-a456-426614174010',
      checkTypeId: '660e8400-e29b-41d4-a716-446655440000',
      checkTypeName: 'Vidange',
      completedAt: '2026-03-15',
      notes: 'All good',
      nextDueAt: '2026-03-22',
      createdAt: new Date(),
      ...overrides
    })
    return dto
  }

  beforeEach(async () => {
    mockCheckLogService = {
      createCheckLog: mock(() => {}) as unknown as Mock<
        typeof CheckLogService.prototype.createCheckLog
      >,
      listCheckLogsByVehicle: mock(() => {}) as unknown as Mock<
        typeof CheckLogService.prototype.listCheckLogsByVehicle
      >,
      getCheckLog: mock(() => {}) as unknown as Mock<typeof CheckLogService.prototype.getCheckLog>,
      deleteCheckLog: mock(() => {}) as unknown as Mock<
        typeof CheckLogService.prototype.deleteCheckLog
      >
    }

    mockVehicleService = {
      getVehicleByUser: mock(() => {}) as unknown as Mock<
        typeof VehicleService.prototype.getVehicleByUser
      >
    }

    const module = await Test.createTestingModule({
      controllers: [CheckLogController],
      providers: [
        { provide: CheckLogService, useValue: mockCheckLogService },
        { provide: VehicleService, useValue: mockVehicleService }
      ]
    }).compile()

    controller = module.get<CheckLogController>(CheckLogController)

    mockCheckLogService.createCheckLog.mockClear()
    mockCheckLogService.listCheckLogsByVehicle.mockClear()
    mockCheckLogService.getCheckLog.mockClear()
    mockCheckLogService.deleteCheckLog.mockClear()
    mockVehicleService.getVehicleByUser.mockClear()
  })

  describe('create', () => {
    it('should create a check log for the vehicle', async () => {
      const createDto = new CreateCheckLogDto()
      const expectedVehicle = createMockVehicleDto()
      const expectedCheckLog = createMockGetCheckLogDto()
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(expectedVehicle)
      mockCheckLogService.createCheckLog.mockResolvedValue(expectedCheckLog)

      const result = await controller.create(session, vehicleId, createDto)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockCheckLogService.createCheckLog).toHaveBeenCalledWith(createDto, vehicleId)
      expect(result).toEqual(expectedCheckLog)
    })
  })

  describe('getByVehicle', () => {
    it('should return all check logs for the vehicle', async () => {
      const expectedVehicle = createMockVehicleDto()
      const expectedCheckLogs = [createMockGetCheckLogDto()]
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(expectedVehicle)
      mockCheckLogService.listCheckLogsByVehicle.mockResolvedValue(expectedCheckLogs)

      const result = await controller.getByVehicle(session, vehicleId)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockCheckLogService.listCheckLogsByVehicle).toHaveBeenCalledWith(vehicleId)
      expect(result).toEqual(expectedCheckLogs)
    })
  })

  describe('getOne', () => {
    it('should return a single check log', async () => {
      const expectedVehicle = createMockVehicleDto()
      const expectedCheckLog = createMockGetCheckLogDto()
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(expectedVehicle)
      mockCheckLogService.getCheckLog.mockResolvedValue(expectedCheckLog)

      const result = await controller.getOne(session, vehicleId, expectedCheckLog.id)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockCheckLogService.getCheckLog).toHaveBeenCalledWith(expectedCheckLog.id, vehicleId)
      expect(result).toEqual(expectedCheckLog)
    })
  })

  describe('delete', () => {
    it('should delete a check log', async () => {
      const expectedVehicle = createMockVehicleDto()
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(expectedVehicle)
      mockCheckLogService.deleteCheckLog.mockResolvedValue(undefined)

      await controller.delete(session, vehicleId, 'some-id')

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockCheckLogService.deleteCheckLog).toHaveBeenCalledWith('some-id', vehicleId)
    })
  })

  describe('verifyVehicleOwnership', () => {
    it('should throw VehicleNotFoundException when user has no vehicle', async () => {
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(null)

      await expect(controller.getByVehicle(session, vehicleId)).rejects.toThrow(
        `Vehicle not found: ${vehicleId}`
      )
    })

    it('should throw VehicleNotFoundException when vehicle ID does not match', async () => {
      const session = createMockSession(userId)
      const wrongVehicle = createMockVehicleDto({ id: 'different-vehicle-id' })

      mockVehicleService.getVehicleByUser.mockResolvedValue(wrongVehicle)

      await expect(controller.getByVehicle(session, vehicleId)).rejects.toThrow(
        `Vehicle not found: ${vehicleId}`
      )
    })
  })
})
