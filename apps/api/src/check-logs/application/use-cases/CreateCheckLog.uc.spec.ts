import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { ICheckLogRepository } from '~/check-logs/domain/repositories'
import type { GetCheckTypeDto } from '~/check-types/application/dtos'
import type { CheckTypeService } from '~/check-types/application/services'

import type { CreateCheckLogDto } from '../dtos'

import { CreateCheckLogUseCase } from './CreateCheckLog.uc'

describe('CreateCheckLogUseCase', () => {
  let useCase: CreateCheckLogUseCase
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
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z')
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
    useCase = new CreateCheckLogUseCase(
      mockRepository as unknown as ICheckLogRepository,
      mockCheckTypeService as unknown as CheckTypeService
    )
  })

  describe('execute', () => {
    it('should create a check log with calculated nextDueAt', async () => {
      const dto: CreateCheckLogDto = {
        checkTypeId: checkTypeDto.id,
        completedAt: '2026-03-15',
        notes: 'All good'
      }

      mockCheckTypeService.getCheckType.mockResolvedValueOnce(checkTypeDto)
      mockRepository.create.mockImplementationOnce(async entity => entity)

      const result = await useCase.execute(dto, vehicleId)

      expect(result.nextDueAt).toBe('2026-03-22')
      expect(mockCheckTypeService.getCheckType).toHaveBeenCalledWith(dto.checkTypeId, vehicleId)
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ nextDueAt: '2026-03-22' })
      )
    })

    it('should pass notes to the entity', async () => {
      const dto: CreateCheckLogDto = {
        checkTypeId: checkTypeDto.id,
        completedAt: '2026-03-15',
        notes: 'All good'
      }

      mockCheckTypeService.getCheckType.mockResolvedValueOnce(checkTypeDto)
      mockRepository.create.mockImplementationOnce(async entity => entity)

      const result = await useCase.execute(dto, vehicleId)

      expect(result.notes).toBe('All good')
    })

    it('should default notes to null when not provided', async () => {
      const dto: CreateCheckLogDto = {
        checkTypeId: checkTypeDto.id,
        completedAt: '2026-03-15'
      }

      mockCheckTypeService.getCheckType.mockResolvedValueOnce(checkTypeDto)
      mockRepository.create.mockImplementationOnce(async entity => entity)

      const result = await useCase.execute(dto, vehicleId)

      expect(mockCheckTypeService.getCheckType).toHaveBeenCalledWith(dto.checkTypeId, vehicleId)
      expect(result.notes).toBeNull()
    })

    it('should propagate error when check type not found', async () => {
      const dto: CreateCheckLogDto = {
        checkTypeId: 'non-existent-id',
        completedAt: '2026-03-15'
      }

      mockCheckTypeService.getCheckType.mockRejectedValueOnce(new Error('Check type not found'))

      await expect(useCase.execute(dto, vehicleId)).rejects.toThrow('Check type not found')
    })
  })
})
