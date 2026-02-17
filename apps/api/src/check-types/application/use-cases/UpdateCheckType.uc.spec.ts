import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { CheckTypeEntity } from '~/check-types/domain/entities'
import type { ICheckTypeRepository } from '~/check-types/domain/repositories'
import {
  CheckTypeIdValueObject,
  CheckTypeNameValueObject,
  IntervalDaysValueObject
} from '~/check-types/domain/value-objects'

import type { UpdateCheckTypeDto } from '../dtos'

import { UpdateCheckTypeUseCase } from './UpdateCheckType.uc'

const makeCheckTypeEntity = (overrides?: { vehicleId?: string; name?: string }) => {
  const vehicleId = overrides?.vehicleId ?? 'vehicle-123'
  const name = overrides?.name ?? 'Oil Level'
  return new CheckTypeEntity(
    CheckTypeIdValueObject.generate(),
    vehicleId,
    new CheckTypeNameValueObject(name),
    'Check the oil level',
    new IntervalDaysValueObject(30),
    new Date(),
    new Date()
  )
}

describe('UpdateCheckTypeUseCase', () => {
  let useCase: UpdateCheckTypeUseCase
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
    useCase = new UpdateCheckTypeUseCase(mockCheckTypeRepository as unknown as ICheckTypeRepository)
  })

  describe('execute', () => {
    it('should update the check type name when provided', async () => {
      const entity = makeCheckTypeEntity()

      mockCheckTypeRepository.findById.mockResolvedValueOnce(entity)
      mockCheckTypeRepository.existsByNameAndVehicle.mockResolvedValueOnce(false)
      mockCheckTypeRepository.update.mockResolvedValueOnce(entity)

      const dto: UpdateCheckTypeDto = { name: 'New Name Here' }
      const result = await useCase.execute(entity.id.value, entity.vehicleId, dto)

      expect(mockCheckTypeRepository.existsByNameAndVehicle).toHaveBeenCalledWith(
        'New Name Here',
        entity.vehicleId
      )
      expect(mockCheckTypeRepository.update).toHaveBeenCalled()
      expect(result.name).toBe('New Name Here')
    })

    it('should update intervalDays without checking name uniqueness', async () => {
      const entity = makeCheckTypeEntity()

      mockCheckTypeRepository.findById.mockResolvedValueOnce(entity)
      mockCheckTypeRepository.update.mockResolvedValueOnce(entity)

      const dto: UpdateCheckTypeDto = { intervalDays: 60 }
      const result = await useCase.execute(entity.id.value, entity.vehicleId, dto)

      expect(mockCheckTypeRepository.existsByNameAndVehicle).not.toHaveBeenCalled()
      expect(mockCheckTypeRepository.update).toHaveBeenCalled()
      expect(result.intervalDays).toBe(60)
    })

    it('should clear description when explicitly set to null', async () => {
      const entity = makeCheckTypeEntity()

      mockCheckTypeRepository.findById.mockResolvedValueOnce(entity)
      mockCheckTypeRepository.update.mockResolvedValueOnce(entity)

      const dto: UpdateCheckTypeDto = { description: null }
      const result = await useCase.execute(entity.id.value, entity.vehicleId, dto)

      expect(mockCheckTypeRepository.update).toHaveBeenCalled()
      expect(result.description).toBeNull()
    })

    it('should throw CheckTypeNotFoundException when check type does not exist', async () => {
      const validUUID = CheckTypeIdValueObject.generate().value

      mockCheckTypeRepository.findById.mockResolvedValueOnce(null)

      const dto: UpdateCheckTypeDto = { name: 'New Name' }
      await expect(useCase.execute(validUUID, 'vehicle-id', dto)).rejects.toThrow(
        `Check type not found: ${validUUID}`
      )
    })

    it('should throw CheckTypeNotFoundException when check type belongs to a different vehicle', async () => {
      const entity = makeCheckTypeEntity({ vehicleId: 'vehicle-A' })

      mockCheckTypeRepository.findById.mockResolvedValueOnce(entity)

      const dto: UpdateCheckTypeDto = { name: 'New Name' }
      await expect(useCase.execute(entity.id.value, 'vehicle-B', dto)).rejects.toThrow(
        `Check type not found: ${entity.id.value}`
      )
    })

    it('should throw CheckTypeAlreadyExistsException when new name already exists for vehicle', async () => {
      const entity = makeCheckTypeEntity()

      mockCheckTypeRepository.findById.mockResolvedValueOnce(entity)
      mockCheckTypeRepository.existsByNameAndVehicle.mockResolvedValueOnce(true)

      const dto: UpdateCheckTypeDto = { name: 'Existing Name' }
      await expect(useCase.execute(entity.id.value, entity.vehicleId, dto)).rejects.toThrow(
        `Check type already exists: ${dto.name}`
      )
      expect(mockCheckTypeRepository.update).not.toHaveBeenCalled()
    })

    it('should skip name uniqueness check when name has not changed', async () => {
      const entity = makeCheckTypeEntity({ name: 'Oil Level' })

      mockCheckTypeRepository.findById.mockResolvedValueOnce(entity)
      mockCheckTypeRepository.update.mockResolvedValueOnce(entity)

      const dto: UpdateCheckTypeDto = { name: 'Oil Level' }
      const result = await useCase.execute(entity.id.value, entity.vehicleId, dto)

      expect(mockCheckTypeRepository.existsByNameAndVehicle).not.toHaveBeenCalled()
      expect(mockCheckTypeRepository.update).toHaveBeenCalled()
      expect(result.name).toBe('Oil Level')
    })
  })
})
