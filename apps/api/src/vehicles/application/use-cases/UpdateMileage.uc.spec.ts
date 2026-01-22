import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { UpdateMileageDto } from '~/vehicles/application/dtos'
import { FuelType, VehicleEntity } from '~/vehicles/domain/entities'
import type { IVehicleRepository } from '~/vehicles/domain/repositories'
import {
  MileageValueObject,
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '~/vehicles/domain/value-objects'

import { UpdateMileageUseCase } from './UpdateMileage.uc'

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

describe('UpdateMileageUseCase', () => {
  let useCase: UpdateMileageUseCase
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
    useCase = new UpdateMileageUseCase(mockVehicleRepository as unknown as IVehicleRepository)
  })

  describe('execute', () => {
    it('should update mileage successfully when new value is higher', async () => {
      const vehicle = createTestVehicle({ userId: 'user-456' })
      const dto: UpdateMileageDto = {
        mileage: 20000
      }

      mockVehicleRepository.existsForUser.mockResolvedValueOnce(true)
      mockVehicleRepository.findById.mockResolvedValueOnce(vehicle)
      mockVehicleRepository.update.mockImplementationOnce(async entity => entity)

      const result = await useCase.execute(vehicle.id.value, vehicle.userId, dto)

      expect(mockVehicleRepository.existsForUser).toHaveBeenCalled()
      const [passedVehicleId, passedUserId] = mockVehicleRepository.existsForUser.mock.calls[0]
      expect(passedVehicleId.value).toBe(vehicle.id.value)
      expect(passedUserId).toBe(vehicle.userId)
      expect(mockVehicleRepository.update).toHaveBeenCalled()
      expect(result.mileage).toBe(dto.mileage)
    })

    it('should throw error when new mileage is lower than current', async () => {
      const vehicle = createTestVehicle({ userId: 'user-789' })
      const dto: UpdateMileageDto = {
        mileage: 10000
      }

      mockVehicleRepository.existsForUser.mockResolvedValueOnce(true)
      mockVehicleRepository.findById.mockResolvedValueOnce(vehicle)

      await expect(useCase.execute(vehicle.id.value, vehicle.userId, dto)).rejects.toThrow(
        'New mileage cannot be lower than current mileage.'
      )
      expect(mockVehicleRepository.update).not.toHaveBeenCalled()
    })

    it('should throw VehicleNotFoundException when vehicle does not exist for user', async () => {
      const vehicleId = VehicleIdValueObject.generate().value
      const dto: UpdateMileageDto = {
        mileage: 25000
      }

      mockVehicleRepository.existsForUser.mockResolvedValueOnce(false)

      await expect(useCase.execute(vehicleId, 'user-000', dto)).rejects.toThrow(
        'Vehicle not found for the user'
      )
    })
  })
})
