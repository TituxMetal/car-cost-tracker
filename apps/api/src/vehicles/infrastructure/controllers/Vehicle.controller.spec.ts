import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { AuthSession } from '~/auth/domain/types'
import {
  CreateVehicleDto,
  GetVehicleDto,
  UpdateMileageDto,
  UpdateVehicleDto
} from '~/vehicles/application/dtos'
import { VehicleService } from '~/vehicles/application/services'
import { FuelType } from '~/vehicles/domain/entities'
import { VehicleIdValueObject } from '~/vehicles/domain/value-objects'

import { VehicleController } from './Vehicle.controller'

describe('VehicleController', () => {
  let controller: VehicleController
  let mockVehicleService: {
    createVehicle: Mock<typeof VehicleService.prototype.createVehicle>
    getVehicleByUser: Mock<typeof VehicleService.prototype.getVehicleByUser>
    updateVehicle: Mock<typeof VehicleService.prototype.updateVehicle>
    updateMileage: Mock<typeof VehicleService.prototype.updateMileage>
    deleteVehicle: Mock<typeof VehicleService.prototype.deleteVehicle>
  }

  const createMockSession = (userId: string): AuthSession => ({
    session: { id: 'session-id', userId, expiresAt: new Date() },
    user: {
      id: userId,
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

  const createMockGetVehicleDto = (overrides = {}): GetVehicleDto => {
    const dto = new GetVehicleDto()
    Object.assign(dto, {
      id: '123e4567-e89b-12d3-a456-426614174000',
      userId: '123e4567-e89b-12d3-a456-426614174001',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      engineType: 'V6',
      fuelType: FuelType.GASOLINE,
      vin: '1HGCM82633A004352',
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
    mockVehicleService = {
      createVehicle: mock(() => {}) as unknown as Mock<
        typeof VehicleService.prototype.createVehicle
      >,
      getVehicleByUser: mock(() => {}) as unknown as Mock<
        typeof VehicleService.prototype.getVehicleByUser
      >,
      updateVehicle: mock(() => {}) as unknown as Mock<
        typeof VehicleService.prototype.updateVehicle
      >,
      updateMileage: mock(() => {}) as unknown as Mock<
        typeof VehicleService.prototype.updateMileage
      >,
      deleteVehicle: mock(() => {}) as unknown as Mock<
        typeof VehicleService.prototype.deleteVehicle
      >
    }

    const module = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: mockVehicleService
        }
      ]
    }).compile()

    controller = module.get<VehicleController>(VehicleController)

    // Clear all mocks
    mockVehicleService.createVehicle.mockClear()
    mockVehicleService.getVehicleByUser.mockClear()
    mockVehicleService.updateVehicle.mockClear()
    mockVehicleService.updateMileage.mockClear()
    mockVehicleService.deleteVehicle.mockClear()
  })

  describe('create', () => {
    it('should create a vehicle for the authenticated user', async () => {
      const dto = new CreateVehicleDto()
      Object.assign(dto, {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        engineType: 'V6',
        fuelType: FuelType.GASOLINE,
        vin: '1HGCM82633A004352',
        licensePlate: 'ABC123',
        purchaseDate: new Date('2025-01-01'),
        mileage: 15000
      })
      const session = createMockSession('123e4567-e89b-12d3-a456-426614174001')
      const expectedDto = createMockGetVehicleDto({
        userId: session.user.id,
        make: dto.make,
        model: dto.model,
        year: dto.year,
        engineType: dto.engineType,
        fuelType: dto.fuelType,
        vin: dto.vin,
        licensePlate: dto.licensePlate,
        purchaseDate: dto.purchaseDate,
        mileage: dto.mileage
      })

      mockVehicleService.createVehicle.mockResolvedValue(expectedDto)

      const result = await controller.create(session, dto)

      expect(mockVehicleService.createVehicle).toHaveBeenCalledWith(dto, session.user.id)
      expect(result).toEqual(expectedDto)
    })
  })

  describe('getMyVehicle', () => {
    it('should return the user vehicle', async () => {
      const session = createMockSession('123e4567-e89b-12d3-a456-426614174001')
      const expectedDto = createMockGetVehicleDto({ userId: session.user.id })

      mockVehicleService.getVehicleByUser.mockResolvedValue(expectedDto)

      const result = await controller.getMyVehicle(session)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(session.user.id)
      expect(result).toEqual(expectedDto)
    })

    it('should return null when user has no vehicle', async () => {
      const session = createMockSession('123e4567-e89b-12d3-a456-426614174001')

      mockVehicleService.getVehicleByUser.mockResolvedValue(null)

      const result = await controller.getMyVehicle(session)

      expect(mockVehicleService.getVehicleByUser).toHaveBeenCalledWith(session.user.id)
      expect(result).toBeNull()
    })
  })

  describe('update', () => {
    it('should update vehicle details', async () => {
      const dto = new UpdateVehicleDto()
      Object.assign(dto, {
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        engineType: 'I4',
        fuelType: FuelType.GASOLINE,
        vin: '2HGCM82633A004353',
        licensePlate: 'XYZ789',
        purchaseDate: new Date('2025-06-01')
      })
      const session = createMockSession('123e4567-e89b-12d3-a456-426614174001')
      const vehicleId = '123e4567-e89b-12d3-a456-426614174000'
      const expectedDto = createMockGetVehicleDto({
        id: vehicleId,
        userId: session.user.id,
        make: dto.make,
        model: dto.model,
        year: dto.year,
        engineType: dto.engineType,
        fuelType: dto.fuelType,
        vin: dto.vin,
        licensePlate: dto.licensePlate,
        purchaseDate: dto.purchaseDate
      })

      mockVehicleService.updateVehicle.mockResolvedValue(expectedDto)

      const result = await controller.update(session, vehicleId, dto)

      expect(mockVehicleService.updateVehicle).toHaveBeenCalledWith(vehicleId, session.user.id, dto)
      expect(result).toEqual(expectedDto)
    })
  })

  describe('updateMileage', () => {
    it('should update vehicle mileage', async () => {
      const dto = new UpdateMileageDto()
      Object.assign(dto, { mileage: 20000 })
      const session = createMockSession('123e4567-e89b-12d3-a456-426614174001')
      const vehicleId = '123e4567-e89b-12d3-a456-426614174000'
      const expectedDto = createMockGetVehicleDto({
        id: vehicleId,
        userId: session.user.id,
        mileage: dto.mileage
      })

      mockVehicleService.updateMileage.mockResolvedValue(expectedDto)

      const result = await controller.updateMileage(session, vehicleId, dto)

      expect(mockVehicleService.updateMileage).toHaveBeenCalledWith(vehicleId, session.user.id, dto)
      expect(result).toEqual(expectedDto)
    })
  })

  describe('delete', () => {
    it('should delete the vehicle', async () => {
      const session = createMockSession('123e4567-e89b-12d3-a456-426614174001')
      const vehicleId = new VehicleIdValueObject('123e4567-e89b-12d3-a456-426614174000')

      mockVehicleService.deleteVehicle.mockResolvedValue()

      await controller.delete(session, vehicleId.value)

      expect(mockVehicleService.deleteVehicle).toHaveBeenCalledWith(
        vehicleId.value,
        session.user.id
      )
    })
  })
})
