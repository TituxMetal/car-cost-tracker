import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { CheckTypeEntity } from '~/check-types/domain/entities'
import type { ICheckTypeRepository } from '~/check-types/domain/repositories'
import {
  CheckTypeIdValueObject,
  CheckTypeNameValueObject,
  IntervalDaysValueObject
} from '~/check-types/domain/value-objects'

import { DeleteCheckTypeUseCase } from './DeleteCheckType.uc'

const makeCheckTypeEntity = (overrides?: { vehicleId?: string }) => {
  const vehicleId = overrides?.vehicleId ?? 'vehicle-123'
  return new CheckTypeEntity(
    CheckTypeIdValueObject.generate(),
    vehicleId,
    new CheckTypeNameValueObject('Oil Level'),
    'Check the oil level',
    new IntervalDaysValueObject(30),
    new Date(),
    new Date()
  )
}

describe('DeleteCheckTypeUseCase', () => {
  let useCase: DeleteCheckTypeUseCase
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
    useCase = new DeleteCheckTypeUseCase(mockCheckTypeRepository as unknown as ICheckTypeRepository)
  })

  describe('execute', () => {
    it('should delete the check type when found and belongs to the vehicle', async () => {
      const entity = makeCheckTypeEntity()

      mockCheckTypeRepository.findById.mockResolvedValueOnce(entity)
      mockCheckTypeRepository.delete.mockResolvedValueOnce()

      await useCase.execute(entity.id.value, entity.vehicleId)

      expect(mockCheckTypeRepository.findById).toHaveBeenCalledWith(
        expect.objectContaining({ value: entity.id.value })
      )
      expect(mockCheckTypeRepository.delete).toHaveBeenCalledWith(
        expect.objectContaining({ value: entity.id.value })
      )
    })

    it('should throw CheckTypeNotFoundException when check type does not exist', async () => {
      const validUUID = CheckTypeIdValueObject.generate().value

      mockCheckTypeRepository.findById.mockResolvedValueOnce(null)
      await expect(useCase.execute(validUUID, 'vehicle-123')).rejects.toThrow(
        'Check type not found'
      )
      expect(mockCheckTypeRepository.delete).not.toHaveBeenCalled()
    })

    it('should throw CheckTypeNotFoundException when check type belongs to a different vehicle', async () => {
      const entity = makeCheckTypeEntity({ vehicleId: 'vehicle-A' })

      mockCheckTypeRepository.findById.mockResolvedValueOnce(entity)
      await expect(useCase.execute(entity.id.value, 'vehicle-B')).rejects.toThrow(
        'Check type not found'
      )
      expect(mockCheckTypeRepository.delete).not.toHaveBeenCalled()
    })
  })
})
