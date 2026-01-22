import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { FuelType, VehicleEntity } from '~/vehicles/domain/entities'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'
import type { IVehicleRepository } from '~/vehicles/domain/repositories'
import {
  MileageValueObject,
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '~/vehicles/domain/value-objects'

import { DeleteVehicleUseCase } from './DeleteVehicle.uc'

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

describe('DeleteVehicleUseCase', () => {
  let useCase: DeleteVehicleUseCase
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
    useCase = new DeleteVehicleUseCase(mockVehicleRepository as unknown as IVehicleRepository)
  })

  describe('execute', () => {
    it('should delete vehicle successfully when user owns the vehicle', async () => {
      const vehicle = createTestVehicle()

      mockVehicleRepository.existsForUser.mockResolvedValueOnce(true)
      mockVehicleRepository.findById.mockResolvedValueOnce(vehicle)
      mockVehicleRepository.delete.mockResolvedValueOnce()

      await useCase.execute(vehicle.id.value, vehicle.userId)

      expect(mockVehicleRepository.existsForUser).toHaveBeenCalled()
      const [passedVehicleId, passedUserId] = mockVehicleRepository.existsForUser.mock.calls[0]
      expect(passedVehicleId.value).toBe(vehicle.id.value)
      expect(passedUserId).toBe(vehicle.userId)
      expect(mockVehicleRepository.delete).toHaveBeenCalledWith(vehicle.id)
    })

    it('should throw VehicleNotFoundException when vehicle does not exist for user', async () => {
      const vehicle = createTestVehicle()

      mockVehicleRepository.existsForUser.mockResolvedValueOnce(false)

      await expect(useCase.execute(vehicle.id.value, vehicle.userId)).rejects.toThrowError(
        VehicleNotFoundException
      )

      expect(mockVehicleRepository.existsForUser).toHaveBeenCalled()
      const [passedVehicleId, passedUserId] = mockVehicleRepository.existsForUser.mock.calls[0]
      expect(passedVehicleId.value).toBe(vehicle.id.value)
      expect(passedUserId).toBe(vehicle.userId)
      expect(mockVehicleRepository.delete).not.toHaveBeenCalled()
    })
  })
})
