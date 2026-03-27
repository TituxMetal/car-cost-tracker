import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { CheckLogEntity } from '~/check-logs/domain/entities'
import type { ICheckLogRepository } from '~/check-logs/domain/repositories'
import { CheckLogIdValueObject, CompletedAtValueObject } from '~/check-logs/domain/value-objects'
import type { GetCheckTypeDto } from '~/check-types/application/dtos'
import type { CheckTypeService } from '~/check-types/application/services'

import { ListCheckLogsByVehicleUseCase } from './ListCheckLogsByVehicle.uc'

describe('ListCheckLogsByVehicleUseCase', () => {
  let useCase: ListCheckLogsByVehicleUseCase
  let mockRepository: {
    create: Mock<ICheckLogRepository['create']>
    findById: Mock<ICheckLogRepository['findById']>
    findByCheckTypeId: Mock<ICheckLogRepository['findByCheckTypeId']>
    findByVehicleId: Mock<ICheckLogRepository['findByVehicleId']>
    findMostRecentByCheckTypeIds: Mock<ICheckLogRepository['findMostRecentByCheckTypeIds']>
    delete: Mock<ICheckLogRepository['delete']>
  }
  let mockCheckTypeService: {
    getCheckTypesByVehicle: Mock<CheckTypeService['getCheckTypesByVehicle']>
  }

  const vehicleId = 'vehicle-123'
  const checkTypeId = '660e8400-e29b-41d4-a716-446655440000'

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
      getCheckTypesByVehicle: mock(() => {}) as unknown as Mock<
        CheckTypeService['getCheckTypesByVehicle']
      >
    }
    useCase = new ListCheckLogsByVehicleUseCase(
      mockRepository as unknown as ICheckLogRepository,
      mockCheckTypeService as unknown as CheckTypeService
    )
  })

  describe('execute', () => {
    it('should return logs enriched with check type names, sorted by completedAt desc', async () => {
      const checkTypes: GetCheckTypeDto[] = [
        {
          id: checkTypeId,
          vehicleId,
          name: 'Vidange',
          description: null,
          intervalDays: 7,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      const entities = [
        new CheckLogEntity(
          new CheckLogIdValueObject('aaa00000-0000-4000-8000-000000000001'),
          checkTypeId,
          new CompletedAtValueObject('2026-03-10'),
          null,
          '2026-03-17',
          new Date(),
          new Date()
        ),
        new CheckLogEntity(
          new CheckLogIdValueObject('aaa00000-0000-4000-8000-000000000002'),
          checkTypeId,
          new CompletedAtValueObject('2026-03-15'),
          'Recent',
          '2026-03-22',
          new Date(),
          new Date()
        )
      ]

      mockCheckTypeService.getCheckTypesByVehicle.mockResolvedValueOnce(checkTypes)
      mockRepository.findByVehicleId.mockResolvedValueOnce(entities)

      const result = await useCase.execute(vehicleId)

      expect(result).toHaveLength(2)
      expect(result[0].completedAt).toBe('2026-03-15')
      expect(result[1].completedAt).toBe('2026-03-10')
      expect(result[0].checkTypeName).toBe('Vidange')
    })

    it('should return empty array when no logs exist', async () => {
      mockCheckTypeService.getCheckTypesByVehicle.mockResolvedValueOnce([])
      mockRepository.findByVehicleId.mockResolvedValueOnce([])

      const result = await useCase.execute(vehicleId)

      expect(result).toEqual([])
    })
  })
})
