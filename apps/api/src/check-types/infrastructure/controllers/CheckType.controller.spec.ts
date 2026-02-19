import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { AuthSession } from '~/auth/domain/types'
import {
  CreateCheckTypeDto,
  GetCheckTypeDto,
  UpdateCheckTypeDto
} from '~/check-types/application/dtos'
import { CheckTypeService } from '~/check-types/application/services'
import { GetVehicleDto } from '~/vehicles/application/dtos'
import { VehicleService } from '~/vehicles/application/services'

import { CheckTypeController } from './CheckType.controller'

describe('CheckTypeController', () => {
  let controller: CheckTypeController
  let mockCheckTypeService: {
    createCheckType: Mock<typeof CheckTypeService.prototype.createCheckType>
    getCheckTypesByVehicle: Mock<typeof CheckTypeService.prototype.getCheckTypesByVehicle>
    getCheckType: Mock<typeof CheckTypeService.prototype.getCheckType>
    updateCheckType: Mock<typeof CheckTypeService.prototype.updateCheckType>
    deleteCheckType: Mock<typeof CheckTypeService.prototype.deleteCheckType>
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

  const createMockGetCheckTypeDto = (overrides = {}): GetCheckTypeDto => {
    const dto = new GetCheckTypeDto()
    Object.assign(dto, {
      id: '123e4567-e89b-12d3-a456-426614174010',
      vehicleId,
      name: 'Oil Change',
      description: 'Change engine oil',
      intervalDays: 180,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    })
    return dto
  }

  beforeEach(async () => {
    mockCheckTypeService = {
      createCheckType: mock(() => {}) as unknown as Mock<
        typeof CheckTypeService.prototype.createCheckType
      >,
      getCheckTypesByVehicle: mock(() => {}) as unknown as Mock<
        typeof CheckTypeService.prototype.getCheckTypesByVehicle
      >,
      getCheckType: mock(() => {}) as unknown as Mock<
        typeof CheckTypeService.prototype.getCheckType
      >,
      updateCheckType: mock(() => {}) as unknown as Mock<
        typeof CheckTypeService.prototype.updateCheckType
      >,
      deleteCheckType: mock(() => {}) as unknown as Mock<
        typeof CheckTypeService.prototype.deleteCheckType
      >
    }

    mockVehicleService = {
      getVehicleByUser: mock(() => {}) as unknown as Mock<
        typeof VehicleService.prototype.getVehicleByUser
      >
    }

    const module = await Test.createTestingModule({
      controllers: [CheckTypeController],
      providers: [
        { provide: CheckTypeService, useValue: mockCheckTypeService },
        { provide: VehicleService, useValue: mockVehicleService }
      ]
    }).compile()

    controller = module.get<CheckTypeController>(CheckTypeController)

    mockCheckTypeService.createCheckType.mockClear()
    mockCheckTypeService.getCheckTypesByVehicle.mockClear()
    mockCheckTypeService.getCheckType.mockClear()
    mockCheckTypeService.updateCheckType.mockClear()
    mockCheckTypeService.deleteCheckType.mockClear()
    mockVehicleService.getVehicleByUser.mockClear()
  })

  describe('create', () => {
    it('should create a check type for the vehicle', async () => {
      const createDto = new CreateCheckTypeDto()
      const expectedVehicle = createMockVehicleDto()
      const expectedCheckType = createMockGetCheckTypeDto()
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(expectedVehicle)
      mockCheckTypeService.createCheckType.mockResolvedValue(expectedCheckType)

      const result = await controller.create(session, vehicleId, createDto)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockCheckTypeService.createCheckType).toHaveBeenCalledWith(createDto, vehicleId)
      expect(result).toEqual(expectedCheckType)
    })
  })

  describe('getByVehicle', () => {
    it('should return all check types for the vehicle', async () => {
      const expectedVehicle = createMockVehicleDto()
      const expectedCheckTypes = [createMockGetCheckTypeDto()]
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(expectedVehicle)
      mockCheckTypeService.getCheckTypesByVehicle.mockResolvedValue(expectedCheckTypes)

      const result = await controller.getByVehicle(session, vehicleId)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockCheckTypeService.getCheckTypesByVehicle).toHaveBeenCalledWith(vehicleId)
      expect(result).toEqual(expectedCheckTypes)
    })
  })

  describe('getOne', () => {
    it('should return a single check type', async () => {
      const expectedVehicle = createMockVehicleDto()
      const expectedCheckType = createMockGetCheckTypeDto()
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(expectedVehicle)
      mockCheckTypeService.getCheckType.mockResolvedValue(expectedCheckType)

      const result = await controller.getOne(session, vehicleId, expectedCheckType.id)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockCheckTypeService.getCheckType).toHaveBeenCalledWith(
        expectedCheckType.id,
        vehicleId
      )
      expect(result).toEqual(expectedCheckType)
    })
  })

  describe('update', () => {
    it('should update a check type', async () => {
      const updateDto = new UpdateCheckTypeDto()
      const expectedVehicle = createMockVehicleDto()
      const expectedCheckType = createMockGetCheckTypeDto()
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(expectedVehicle)
      mockCheckTypeService.updateCheckType.mockResolvedValue(expectedCheckType)

      const result = await controller.update(session, vehicleId, expectedCheckType.id, updateDto)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockCheckTypeService.updateCheckType).toHaveBeenCalledWith(
        expectedCheckType.id,
        vehicleId,
        updateDto
      )
      expect(result).toEqual(expectedCheckType)
    })
  })

  describe('delete', () => {
    it('should delete a check type', async () => {
      const expectedVehicle = createMockVehicleDto()
      const session = createMockSession(userId)

      mockVehicleService.getVehicleByUser.mockResolvedValue(expectedVehicle)
      mockCheckTypeService.deleteCheckType.mockResolvedValue(undefined)

      await controller.delete(session, vehicleId, 'some-id')

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(userId)
      expect(mockCheckTypeService.deleteCheckType).toHaveBeenCalledWith('some-id', vehicleId)
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
