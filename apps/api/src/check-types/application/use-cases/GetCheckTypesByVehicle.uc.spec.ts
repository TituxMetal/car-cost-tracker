import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { CheckTypeEntity } from '~/check-types/domain/entities'
import type { ICheckTypeRepository } from '~/check-types/domain/repositories'
import {
  CheckTypeIdValueObject,
  CheckTypeNameValueObject,
  IntervalDaysValueObject
} from '~/check-types/domain/value-objects'

import { GetCheckTypesByVehicleUseCase } from './GetCheckTypesByVehicle.uc'

describe('GetCheckTypesByVehicleUseCase', () => {
  let useCase: GetCheckTypesByVehicleUseCase
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
    useCase = new GetCheckTypesByVehicleUseCase(
      mockCheckTypeRepository as unknown as ICheckTypeRepository
    )
  })

  describe('execute', () => {
    it('should return all check types for a vehicle', async () => {
      const vehicleId = 'vehicle-123'
      const checkTypes = [
        new CheckTypeEntity(
          new CheckTypeIdValueObject(CheckTypeIdValueObject.generate().value),
          vehicleId,
          new CheckTypeNameValueObject('Oil Change'),
          'Oil change every 6 months',
          new IntervalDaysValueObject(180),
          new Date(),
          new Date()
        ),
        new CheckTypeEntity(
          new CheckTypeIdValueObject(CheckTypeIdValueObject.generate().value),
          vehicleId,
          new CheckTypeNameValueObject('Tire Rotation'),
          null,
          new IntervalDaysValueObject(365),
          new Date(),
          new Date()
        )
      ]
      mockCheckTypeRepository.findByVehicleId.mockResolvedValue(checkTypes)

      const result = await useCase.execute(vehicleId)

      expect(result).toEqual([
        {
          id: checkTypes[0].id.value,
          vehicleId: checkTypes[0].vehicleId,
          name: checkTypes[0].name.value,
          description: checkTypes[0].description,
          intervalDays: checkTypes[0].intervalDays.value,
          createdAt: checkTypes[0].createdAt,
          updatedAt: checkTypes[0].updatedAt
        },
        {
          id: checkTypes[1].id.value,
          vehicleId: checkTypes[1].vehicleId,
          name: checkTypes[1].name.value,
          description: checkTypes[1].description,
          intervalDays: checkTypes[1].intervalDays.value,
          createdAt: checkTypes[1].createdAt,
          updatedAt: checkTypes[1].updatedAt
        }
      ])
      expect(mockCheckTypeRepository.findByVehicleId).toHaveBeenCalledWith(vehicleId)
    })

    it('should return empty array when vehicle has no check types', async () => {
      const vehicleId = 'vehicle-123'
      mockCheckTypeRepository.findByVehicleId.mockResolvedValue([])

      const result = await useCase.execute(vehicleId)

      expect(result).toEqual([])
      expect(mockCheckTypeRepository.findByVehicleId).toHaveBeenCalledWith(vehicleId)
    })
  })
})
