import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { UpdateVehicleDto } from '~/vehicles/application/dtos'
import { FuelType, VehicleEntity } from '~/vehicles/domain/entities'
import type { IVehicleRepository } from '~/vehicles/domain/repositories'
import {
  MileageValueObject,
  VehicleIdValueObject,
  VinValueObject,
  YearValueObject
} from '~/vehicles/domain/value-objects'

import { UpdateVehicleUseCase } from './UpdateVehicle.uc'

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

describe('UpdateVehicleUseCase', () => {
  let useCase: UpdateVehicleUseCase
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
    useCase = new UpdateVehicleUseCase(mockVehicleRepository as unknown as IVehicleRepository)
  })

  describe('execute', () => {
    it('should update vehicle successfully when user owns the vehicle', async () => {
      const vehicle = createTestVehicle({ userId: 'user-456' })
      const dto: UpdateVehicleDto = {
        make: 'Honda',
        model: 'Civic',
        year: 2022,
        engineType: 'I4',
        fuelType: FuelType.GASOLINE,
        mileage: 20000
      }

      mockVehicleRepository.existsForUser.mockResolvedValueOnce(true)
      mockVehicleRepository.findById.mockResolvedValueOnce(vehicle)
      mockVehicleRepository.update.mockImplementationOnce(async entity => entity)

      const result = await useCase.execute(vehicle.id.value, 'user-456', dto)

      expect(mockVehicleRepository.existsForUser).toHaveBeenCalled()
      const [passedVehicleId, passedUserId] = mockVehicleRepository.existsForUser.mock.calls[0]
      expect(passedVehicleId.value).toBe(vehicle.id.value)
      expect(passedUserId).toBe('user-456')
      expect(result.make).toBe(dto.make!)
      expect(result.model).toBe(dto.model!)
      expect(result.year).toBe(dto.year!)
      expect(result.engineType).toBe(dto.engineType!)
      expect(result.fuelType).toBe(dto.fuelType!)
    })

    it('should update partial vehicle fields', async () => {
      const vehicle = createTestVehicle({
        make: 'Ford',
        model: 'Focus',
        year: new YearValueObject(2018)
      })
      const dto: UpdateVehicleDto = {
        make: 'Chevrolet'
      }

      mockVehicleRepository.existsForUser.mockResolvedValueOnce(true)
      mockVehicleRepository.findById.mockResolvedValueOnce(vehicle)
      mockVehicleRepository.update.mockImplementationOnce(async entity => entity)

      const result = await useCase.execute(vehicle.id.value, 'user-789', dto)

      expect(mockVehicleRepository.existsForUser).toHaveBeenCalled()
      const [passedVehicleId, passedUserId] = mockVehicleRepository.existsForUser.mock.calls[0]
      expect(passedVehicleId.value).toBe(vehicle.id.value)
      expect(passedUserId).toBe('user-789')
      expect(result.make).toBe(dto.make!)
      expect(result.model).toBe('Focus') // unchanged
      expect(result.year).toBe(2018) // unchanged
    })

    it('should throw VehicleNotFoundException when vehicle does not exist', async () => {
      const vehicleId = VehicleIdValueObject.generate().value
      const dto: UpdateVehicleDto = {
        make: 'Nissan'
      }

      mockVehicleRepository.existsForUser.mockResolvedValueOnce(false)

      await expect(useCase.execute(vehicleId, 'user-000', dto)).rejects.toThrow(
        'Vehicle not found for the user'
      )
    })

    it('should throw VehicleNotFoundException when user does not own the vehicle', async () => {
      const vehicle = createTestVehicle({ userId: 'user-111' })
      const dto: UpdateVehicleDto = {
        make: 'Mazda'
      }

      mockVehicleRepository.existsForUser.mockResolvedValueOnce(false)

      await expect(useCase.execute(vehicle.id.value, 'user-222', dto)).rejects.toThrow(
        'Vehicle not found for the user'
      )
    })
  })
})
