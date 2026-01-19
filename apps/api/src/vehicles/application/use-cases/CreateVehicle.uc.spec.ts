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

import type { CreateVehicleDto } from '../dtos/CreateVehicle.dto'

import { CreateVehicleUseCase } from './CreateVehicle.uc'

describe('CreateVehicleUseCase', () => {
  let useCase: CreateVehicleUseCase
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
    useCase = new CreateVehicleUseCase(mockVehicleRepository as unknown as IVehicleRepository)
  })

  describe('execute', () => {
    it('should create a vehicle when user has no existing vehicle', async () => {
      const userId = 'user-456'
      const dto: CreateVehicleDto = {
        make: 'Tesla',
        model: 'Model 3',
        year: 2021,
        engineType: 'Electric',
        fuelType: FuelType.ELECTRIC,
        vin: '5YJ3E1EA7MF123456',
        licensePlate: 'EV1234',
        purchaseDate: '2021-06-15',
        mileage: 5000
      }

      mockVehicleRepository.findByUserId.mockReturnValueOnce(Promise.resolve([]))
      mockVehicleRepository.create.mockImplementationOnce(async entity => entity)

      const result = await useCase.execute(dto, userId)

      expect(mockVehicleRepository.findByUserId).toHaveBeenCalledWith(userId)
      expect(mockVehicleRepository.create).toHaveBeenCalled()
      expect(result).toHaveProperty('id')
      expect(result.make).toBe(dto.make)
      expect(result.model).toBe(dto.model)
      expect(result.year).toBe(dto.year)
    })

    it('should throw VehicleAlreadyExistsException when user already has a vehicle', async () => {
      const userId = 'user-456'
      const existingVehicle = new VehicleEntity(
        VehicleIdValueObject.generate(),
        userId,
        'Tesla',
        'Model 3',
        new YearValueObject(2021),
        'Electric',
        FuelType.ELECTRIC,
        new VinValueObject('5YJ3E1EA7MF123456'),
        'EV1234',
        new Date('2021-06-15'),
        new MileageValueObject(5000),
        new Date(),
        new Date()
      )

      mockVehicleRepository.findByUserId.mockReturnValueOnce(Promise.resolve([existingVehicle]))

      const dto: CreateVehicleDto = {
        make: 'Tesla',
        model: 'Model Y',
        year: 2022,
        engineType: 'Electric',
        fuelType: FuelType.ELECTRIC,
        vin: '5YJ3E1EA7MF654321',
        licensePlate: 'EV5678',
        purchaseDate: '2022-01-10',
        mileage: 3000
      }

      mockVehicleRepository.create.mockRejectedValueOnce(new Error('Should not be called'))

      await expect(useCase.execute(dto, userId)).rejects.toThrow('User already has a vehicle')
      expect(mockVehicleRepository.findByUserId).toHaveBeenCalledWith(userId)
      expect(mockVehicleRepository.create).not.toHaveBeenCalled()
    })
  })
})
