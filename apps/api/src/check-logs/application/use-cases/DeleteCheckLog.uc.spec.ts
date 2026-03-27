import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { CheckLogEntity } from '~/check-logs/domain/entities'
import type { ICheckLogRepository } from '~/check-logs/domain/repositories'
import { CheckLogIdValueObject, CompletedAtValueObject } from '~/check-logs/domain/value-objects'
import type { GetCheckTypeDto } from '~/check-types/application/dtos'
import type { CheckTypeService } from '~/check-types/application/services'

import { DeleteCheckLogUseCase } from './DeleteCheckLog.uc'

const makeEntity = () =>
  new CheckLogEntity(
    CheckLogIdValueObject.generate(),
    '660e8400-e29b-41d4-a716-446655440000',
    new CompletedAtValueObject('2026-03-15'),
    'All good',
    '2026-03-22',
    new Date(),
    new Date()
  )

describe('DeleteCheckLogUseCase', () => {
  let useCase: DeleteCheckLogUseCase
  let mockRepository: {
    create: Mock<ICheckLogRepository['create']>
    findById: Mock<ICheckLogRepository['findById']>
    findByCheckTypeId: Mock<ICheckLogRepository['findByCheckTypeId']>
    findByVehicleId: Mock<ICheckLogRepository['findByVehicleId']>
    findMostRecentByCheckTypeIds: Mock<ICheckLogRepository['findMostRecentByCheckTypeIds']>
    delete: Mock<ICheckLogRepository['delete']>
  }
  let mockCheckTypeService: {
    getCheckType: Mock<CheckTypeService['getCheckType']>
  }

  const vehicleId = 'vehicle-123'
  const checkTypeDto: GetCheckTypeDto = {
    id: '660e8400-e29b-41d4-a716-446655440000',
    vehicleId,
    name: 'Vidange',
    description: null,
    intervalDays: 7,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(() => {
    mockRepository = {
      create: mock(() => {}) as unknown as Mock<ICheckLogRepository['create']>,
      findById: mock(() => {}) as unknown as Mock<ICheckLogRepository['findById']>,
      findByCheckTypeId: mock(() => {}) as unknown as Mock<
        ICheckLogRepository['findByCheckTypeId']
      >,
      findByVehicleId: mock(() => {}) as unknown as Mock<ICheckLogRepository['findByVehicleId']>,
      findMostRecentByCheckTypeIds: mock(() => {}) as unknown as Mock<
        ICheckLogRepository['findMostRecentByCheckTypeIds']
      >,
      delete: mock(() => {}) as unknown as Mock<ICheckLogRepository['delete']>
    }
    mockCheckTypeService = {
      getCheckType: mock(() => {}) as unknown as Mock<CheckTypeService['getCheckType']>
    }
    useCase = new DeleteCheckLogUseCase(
      mockRepository as unknown as ICheckLogRepository,
      mockCheckTypeService as unknown as CheckTypeService
    )
  })

  describe('execute', () => {
    it('should delete the check log when found and ownership valid', async () => {
      const entity = makeEntity()

      mockRepository.findById.mockResolvedValueOnce(entity)
      mockCheckTypeService.getCheckType.mockResolvedValueOnce(checkTypeDto)
      mockRepository.delete.mockResolvedValueOnce(undefined)

      await useCase.execute(entity.id.value, vehicleId)

      expect(mockRepository.findById).toHaveBeenCalledWith(
        expect.objectContaining({ value: entity.id.value })
      )
      expect(mockCheckTypeService.getCheckType).toHaveBeenCalledWith(entity.checkTypeId, vehicleId)
      expect(mockRepository.delete).toHaveBeenCalledWith(
        expect.objectContaining({ value: entity.id.value })
      )
    })

    it('should throw CheckLogNotFoundException when not found', async () => {
      const validUUID = CheckLogIdValueObject.generate().value

      mockRepository.findById.mockResolvedValueOnce(null)

      await expect(useCase.execute(validUUID, vehicleId)).rejects.toThrow(
        `Check log not found: ${validUUID}`
      )
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })

    it('should propagate error when check type ownership fails', async () => {
      const entity = makeEntity()

      mockRepository.findById.mockResolvedValueOnce(entity)
      mockCheckTypeService.getCheckType.mockRejectedValueOnce(new Error('Check type not found'))

      await expect(useCase.execute(entity.id.value, 'wrong-vehicle')).rejects.toThrow(
        'Check type not found'
      )
      expect(mockRepository.delete).not.toHaveBeenCalled()
    })
  })
})
