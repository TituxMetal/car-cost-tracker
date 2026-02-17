import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { ICheckTypeRepository } from '~/check-types/domain/repositories'

import type { CreateCheckTypeDto } from '../dtos'

import { CreateCheckTypeUseCase } from './CreateCheckType.uc'

describe('CreateCheckTypeUseCase', () => {
  let useCase: CreateCheckTypeUseCase
  let mockCheckTypeRepository: {
    create: Mock<ICheckTypeRepository['create']>
    findById: Mock<ICheckTypeRepository['findById']>
    findByVehicleId: Mock<ICheckTypeRepository['findByVehicleId']>
    update: Mock<ICheckTypeRepository['update']>
    delete: Mock<ICheckTypeRepository['delete']>
    existsByNameAndVehicle: Mock<ICheckTypeRepository['existsByNameAndVehicle']>
  }

  beforeEach(() => {
    mockCheckTypeRepository = {
      create: mock(() => {}) as unknown as Mock<ICheckTypeRepository['create']>,
      findById: mock(() => {}) as unknown as Mock<ICheckTypeRepository['findById']>,
      findByVehicleId: mock(() => {}) as unknown as Mock<ICheckTypeRepository['findByVehicleId']>,
      update: mock(() => {}) as unknown as Mock<ICheckTypeRepository['update']>,
      delete: mock(() => {}) as unknown as Mock<ICheckTypeRepository['delete']>,
      existsByNameAndVehicle: mock(() => {}) as unknown as Mock<
        ICheckTypeRepository['existsByNameAndVehicle']
      >
    }
    useCase = new CreateCheckTypeUseCase(mockCheckTypeRepository as unknown as ICheckTypeRepository)
  })

  describe('execute', () => {
    it('should create a check type when name is unique for vehicle', async () => {
      const vehicleId = 'vehicle-123'
      const dto: CreateCheckTypeDto = {
        name: 'Oil Change',
        description: 'Change engine oil',
        intervalDays: 180
      }

      mockCheckTypeRepository.existsByNameAndVehicle.mockReturnValueOnce(Promise.resolve(false))
      mockCheckTypeRepository.create.mockImplementationOnce(async entity => entity)

      const result = await useCase.execute(dto, vehicleId)

      expect(mockCheckTypeRepository.existsByNameAndVehicle).toHaveBeenCalledWith(
        dto.name,
        vehicleId
      )
      expect(mockCheckTypeRepository.create).toHaveBeenCalled()
      expect(result).toHaveProperty('id')
      expect(result.name).toBe(dto.name)
      expect(result.description).toBe('Change engine oil')
      expect(result.intervalDays).toBe(dto.intervalDays)
    })

    it('should throw CheckTypeAlreadyExistsException when name already exists for vehicle', async () => {
      const vehicleId = 'vehicle-123'
      const dto: CreateCheckTypeDto = {
        name: 'Oil Change',
        description: 'Change engine oil',
        intervalDays: 180
      }

      mockCheckTypeRepository.existsByNameAndVehicle.mockReturnValueOnce(Promise.resolve(true))

      await expect(useCase.execute(dto, vehicleId)).rejects.toThrow(
        `Check type already exists: ${dto.name}`
      )

      expect(mockCheckTypeRepository.existsByNameAndVehicle).toHaveBeenCalledWith(
        dto.name,
        vehicleId
      )
      expect(mockCheckTypeRepository.create).not.toHaveBeenCalled()
    })
  })
})
