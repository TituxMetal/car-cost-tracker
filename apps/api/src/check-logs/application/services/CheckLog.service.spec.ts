import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import {
  CreateCheckLogUseCase,
  DeleteCheckLogUseCase,
  GetCheckLogUseCase,
  GetCheckStatusSummaryUseCase,
  ListCheckLogsByVehicleUseCase
} from '~/check-logs/application/use-cases'

import { CheckLogService } from './CheckLog.service'

describe('CheckLogService', () => {
  let service: CheckLogService
  let mockCreateCheckLogUseCase: {
    execute: Mock<typeof CreateCheckLogUseCase.prototype.execute>
  }
  let mockListCheckLogsByVehicleUseCase: {
    execute: Mock<typeof ListCheckLogsByVehicleUseCase.prototype.execute>
  }
  let mockGetCheckLogUseCase: {
    execute: Mock<typeof GetCheckLogUseCase.prototype.execute>
  }
  let mockDeleteCheckLogUseCase: {
    execute: Mock<typeof DeleteCheckLogUseCase.prototype.execute>
  }
  let mockGetCheckStatusSummaryUseCase: {
    execute: Mock<typeof GetCheckStatusSummaryUseCase.prototype.execute>
  }

  beforeEach(async () => {
    mockCreateCheckLogUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof CreateCheckLogUseCase.prototype.execute>
    }
    mockListCheckLogsByVehicleUseCase = {
      execute: mock(() => {}) as unknown as Mock<
        typeof ListCheckLogsByVehicleUseCase.prototype.execute
      >
    }
    mockGetCheckLogUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof GetCheckLogUseCase.prototype.execute>
    }
    mockDeleteCheckLogUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof DeleteCheckLogUseCase.prototype.execute>
    }
    mockGetCheckStatusSummaryUseCase = {
      execute: mock(() => {}) as unknown as Mock<
        typeof GetCheckStatusSummaryUseCase.prototype.execute
      >
    }

    const module = await Test.createTestingModule({
      providers: [
        CheckLogService,
        { provide: CreateCheckLogUseCase, useValue: mockCreateCheckLogUseCase },
        { provide: ListCheckLogsByVehicleUseCase, useValue: mockListCheckLogsByVehicleUseCase },
        { provide: GetCheckLogUseCase, useValue: mockGetCheckLogUseCase },
        { provide: DeleteCheckLogUseCase, useValue: mockDeleteCheckLogUseCase },
        { provide: GetCheckStatusSummaryUseCase, useValue: mockGetCheckStatusSummaryUseCase }
      ]
    }).compile()

    service = module.get<CheckLogService>(CheckLogService)
  })

  describe('createCheckLog', () => {
    it('should delegate to createCheckLogUseCase with correct parameters', async () => {
      const dto = { checkTypeId: 'ct-123', completedAt: '2026-03-15', notes: 'OK' }
      const vehicleId = 'vehicle-123'

      await service.createCheckLog(dto, vehicleId)

      expect(mockCreateCheckLogUseCase.execute).toHaveBeenCalledWith(dto, vehicleId)
    })
  })

  describe('listCheckLogsByVehicle', () => {
    it('should delegate to listCheckLogsByVehicleUseCase with correct parameters', async () => {
      const vehicleId = 'vehicle-123'

      await service.listCheckLogsByVehicle(vehicleId)

      expect(mockListCheckLogsByVehicleUseCase.execute).toHaveBeenCalledWith(vehicleId)
    })
  })

  describe('getCheckLog', () => {
    it('should delegate to getCheckLogUseCase with correct parameters', async () => {
      const id = 'log-123'
      const vehicleId = 'vehicle-123'

      await service.getCheckLog(id, vehicleId)

      expect(mockGetCheckLogUseCase.execute).toHaveBeenCalledWith(id, vehicleId)
    })
  })

  describe('deleteCheckLog', () => {
    it('should delegate to deleteCheckLogUseCase with correct parameters', async () => {
      const id = 'log-123'
      const vehicleId = 'vehicle-123'

      await service.deleteCheckLog(id, vehicleId)

      expect(mockDeleteCheckLogUseCase.execute).toHaveBeenCalledWith(id, vehicleId)
    })
  })

  describe('getCheckStatusSummary', () => {
    it('should delegate to getCheckStatusSummaryUseCase with correct parameters', async () => {
      const vehicleId = 'vehicle-123'

      await service.getCheckStatusSummary(vehicleId)

      expect(mockGetCheckStatusSummaryUseCase.execute).toHaveBeenCalledWith(vehicleId)
    })
  })
})
