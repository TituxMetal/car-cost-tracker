import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { CheckTypeEntity } from '~/check-types/domain/entities'
import type { ICheckTypeRepository } from '~/check-types/domain/repositories'
import {
  CheckTypeIdValueObject,
  CheckTypeNameValueObject,
  IntervalDaysValueObject
} from '~/check-types/domain/value-objects'

import { GetCheckTypeUseCase } from './GetCheckType.uc'

describe('GetCheckTypeUseCase', () => {
  let useCase: GetCheckTypeUseCase
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
    useCase = new GetCheckTypeUseCase(mockCheckTypeRepository as unknown as ICheckTypeRepository)
  })

  describe('execute', () => {
    it('should return the check type when found and belongs to the vehicle', async () => {
      const vehicleId = 'vehicle-123'
      const checkTypeEntity = new CheckTypeEntity(
        CheckTypeIdValueObject.generate(),
        vehicleId,
        new CheckTypeNameValueObject('Brake Inspection'),
        'Inspect brake pads and rotors',
        new IntervalDaysValueObject(365),
        new Date(),
        new Date()
      )

      mockCheckTypeRepository.findById.mockResolvedValue(checkTypeEntity)

      const result = await useCase.execute(checkTypeEntity.id.value, vehicleId)

      expect(result).toHaveProperty('id', checkTypeEntity.id.value)
      expect(result).toHaveProperty('name', checkTypeEntity.name.value)
      expect(result).toHaveProperty('description', checkTypeEntity.description)
      expect(result).toHaveProperty('intervalDays', checkTypeEntity.intervalDays.value)
      expect(mockCheckTypeRepository.findById).toHaveBeenCalledWith(
        expect.objectContaining({ value: checkTypeEntity.id.value })
      )
    })

    it('should throw CheckTypeNotFoundException when check type does not exist', async () => {
      const validUUID = CheckTypeIdValueObject.generate().value
      mockCheckTypeRepository.findById.mockResolvedValue(null)

      await expect(useCase.execute(validUUID, 'vehicle-123')).rejects.toThrow(
        `Check type not found: ${validUUID}`
      )
    })

    it('should throw CheckTypeNotFoundException when check type belongs to a different vehicle', async () => {
      const checkTypeEntity = new CheckTypeEntity(
        CheckTypeIdValueObject.generate(),
        'vehicle-A',
        new CheckTypeNameValueObject('Tire Rotation'),
        'Rotate tires for even wear',
        new IntervalDaysValueObject(180),
        new Date(),
        new Date()
      )

      mockCheckTypeRepository.findById.mockResolvedValue(checkTypeEntity)

      await expect(useCase.execute(checkTypeEntity.id.value, 'vehicle-B')).rejects.toThrow(
        `Check type not found: ${checkTypeEntity.id.value}`
      )
    })
  })
})
