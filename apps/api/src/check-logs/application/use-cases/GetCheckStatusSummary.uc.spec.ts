import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { CheckLogEntity } from '~/check-logs/domain/entities'
import type { ICheckLogRepository } from '~/check-logs/domain/repositories'
import { CheckLogIdValueObject, CompletedAtValueObject } from '~/check-logs/domain/value-objects'
import type { GetCheckTypeDto } from '~/check-types/application/dtos'
import type { CheckTypeService } from '~/check-types/application/services'

import { GetCheckStatusSummaryUseCase } from './GetCheckStatusSummary.uc'

describe('GetCheckStatusSummaryUseCase', () => {
  let useCase: GetCheckStatusSummaryUseCase
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
    useCase = new GetCheckStatusSummaryUseCase(
      mockRepository as unknown as ICheckLogRepository,
      mockCheckTypeService as unknown as CheckTypeService
    )
  })

  describe('execute', () => {
    it('should return status summaries for all check types', async () => {
      const checkType1: GetCheckTypeDto = {
        id: '660e8400-e29b-41d4-a716-446655440000',
        vehicleId,
        name: 'Vidange',
        description: null,
        intervalDays: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const checkType2: GetCheckTypeDto = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        vehicleId,
        name: 'Pneus',
        description: null,
        intervalDays: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const latestLog = new CheckLogEntity(
        CheckLogIdValueObject.generate(),
        checkType1.id,
        new CompletedAtValueObject('2026-03-15'),
        'All good',
        '2026-03-22',
        new Date(),
        new Date()
      )
      const latestLogsMap = new Map<string, CheckLogEntity>([[checkType1.id, latestLog]])

      mockCheckTypeService.getCheckTypesByVehicle.mockResolvedValueOnce([checkType1, checkType2])
      mockRepository.findMostRecentByCheckTypeIds.mockResolvedValueOnce(latestLogsMap)

      const result = await useCase.execute(vehicleId)

      expect(result).toHaveLength(2)
      const summary1 = result.find(s => s.checkTypeId === checkType1.id)
      const summary2 = result.find(s => s.checkTypeId === checkType2.id)
      expect(summary1).toBeDefined()
      expect(summary1?.status).toBe('overdue')
      expect(summary2).toBeDefined()
      expect(summary2?.status).toBe('never')
    })

    it('should return all "never" when no logs exist', async () => {
      const checkType1: GetCheckTypeDto = {
        id: '660e8400-e29b-41d4-a716-446655440000',
        vehicleId,
        name: 'Vidange',
        description: null,
        intervalDays: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const checkType2: GetCheckTypeDto = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        vehicleId,
        name: 'Pneus',
        description: null,
        intervalDays: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockCheckTypeService.getCheckTypesByVehicle.mockResolvedValueOnce([checkType1, checkType2])
      mockRepository.findMostRecentByCheckTypeIds.mockResolvedValueOnce(new Map())

      const result = await useCase.execute(vehicleId)

      expect(result).toHaveLength(2)
      result.forEach(summary => {
        expect(summary.status).toBe('never')
      })
    })

    it('should return empty array when vehicle has no check types', async () => {
      mockCheckTypeService.getCheckTypesByVehicle.mockResolvedValueOnce([])
      mockRepository.findMostRecentByCheckTypeIds.mockResolvedValueOnce(new Map())

      const result = await useCase.execute(vehicleId)

      expect(result).toEqual([])
    })

    it('should call findMostRecentByCheckTypeIds with correct IDs', async () => {
      const checkType1: GetCheckTypeDto = {
        id: '660e8400-e29b-41d4-a716-446655440000',
        vehicleId,
        name: 'Vidange',
        description: null,
        intervalDays: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const checkType2: GetCheckTypeDto = {
        id: '770e8400-e29b-41d4-a716-446655440000',
        vehicleId,
        name: 'Pneus',
        description: null,
        intervalDays: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockCheckTypeService.getCheckTypesByVehicle.mockResolvedValueOnce([checkType1, checkType2])
      mockRepository.findMostRecentByCheckTypeIds.mockResolvedValueOnce(new Map())

      await useCase.execute(vehicleId)

      expect(mockRepository.findMostRecentByCheckTypeIds).toHaveBeenCalledWith([
        checkType1.id,
        checkType2.id
      ])
    })
  })
})
