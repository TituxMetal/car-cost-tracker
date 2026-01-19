import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { FuelType, VehicleEntity } from '~/vehicles/domain/entities'
import type { IVehicleRepository } from '~/vehicles/domain/repositories'
import {
  MileageValueObject,
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '~/vehicles/domain/value-objects'

import { GetVehicleByUserUseCase } from './GetVehicleByUser.uc'

const createTestVehicle = (overrides?: Partial<VehicleEntity>): VehicleEntity =>
  Object.assign(
    new VehicleEntity(
      new VehicleIdValueObject(VehicleIdValueObject.generate().value),
      'user-123',
      'Toyota',
      'Corolla',
      new YearValueObject(2020),
      'V6',
      FuelType.GASOLINE,
      new VinValueObject('1HGCM82633A123456'),
      'ABC123',
      new Date('2022-01-01'),
      new MileageValueObject(15000),
      new Date(),
      new Date()
    ),
    overrides
  )

describe('GetVehicleByUserUseCase', () => {
  let useCase: GetVehicleByUserUseCase
  let mockVehicleRepository: {
    create: Mock<IVehicleRepository['create']>
    findById: Mock<IVehicleRepository['findById']>
    findByUserId: Mock<IVehicleRepository['findByUserId']>
    update: Mock<IVehicleRepository['update']>
    delete: Mock<IVehicleRepository['delete']>
    existsForUser: Mock<IVehicleRepository['existsForUser']>
  }

  beforeEach(() => {
    mockVehicleRepository = {
      create: mock(() => {}) as unknown as Mock<IVehicleRepository['create']>,
      findById: mock(() => {}) as unknown as Mock<IVehicleRepository['findById']>,
      findByUserId: mock(() => {}) as unknown as Mock<IVehicleRepository['findByUserId']>,
      update: mock(() => {}) as unknown as Mock<IVehicleRepository['update']>,
      delete: mock(() => {}) as unknown as Mock<IVehicleRepository['delete']>,
      existsForUser: mock(() => {}) as unknown as Mock<IVehicleRepository['existsForUser']>
    }
    useCase = new GetVehicleByUserUseCase(mockVehicleRepository as unknown as IVehicleRepository)
  })

  describe('execute', () => {
    it('should return the vehicle DTO when user has a vehicle', async () => {
      const userId = 'user-123'
      const vehicleEntity = createTestVehicle({ userId })

      mockVehicleRepository.findByUserId.mockResolvedValueOnce([vehicleEntity])

      const result = await useCase.execute(userId)

      expect(result).toBeDefined()
      expect(result?.userId).toBe(userId)
      expect(mockVehicleRepository.findByUserId).toHaveBeenCalledWith(userId)
    })

    it('should return null when user has no vehicle', async () => {
      const userId = 'user-456'

      mockVehicleRepository.findByUserId.mockResolvedValueOnce([])

      const result = await useCase.execute(userId)

      expect(result).toBeNull()
      expect(mockVehicleRepository.findByUserId).toHaveBeenCalledWith(userId)
    })
  })
})
