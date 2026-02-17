import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import {
  CreateCheckTypeUseCase,
  DeleteCheckTypeUseCase,
  GetCheckTypeUseCase,
  GetCheckTypesByVehicleUseCase,
  UpdateCheckTypeUseCase
} from '~/check-types/application/use-cases'

import { CheckTypeService } from './CheckType.service'

describe('CheckTypeService', () => {
  let service: CheckTypeService
  let mockCreateCheckTypeUseCase: {
    execute: Mock<typeof CreateCheckTypeUseCase.prototype.execute>
  }
  let mockGetCheckTypesByVehicleUseCase: {
    execute: Mock<typeof GetCheckTypesByVehicleUseCase.prototype.execute>
  }
  let mockGetCheckTypeUseCase: {
    execute: Mock<typeof GetCheckTypeUseCase.prototype.execute>
  }
  let mockUpdateCheckTypeUseCase: {
    execute: Mock<typeof UpdateCheckTypeUseCase.prototype.execute>
  }
  let mockDeleteCheckTypeUseCase: {
    execute: Mock<typeof DeleteCheckTypeUseCase.prototype.execute>
  }

  beforeEach(async () => {
    mockCreateCheckTypeUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof CreateCheckTypeUseCase.prototype.execute>
    }
    mockGetCheckTypesByVehicleUseCase = {
      execute: mock(() => {}) as unknown as Mock<
        typeof GetCheckTypesByVehicleUseCase.prototype.execute
      >
    }
    mockGetCheckTypeUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof GetCheckTypeUseCase.prototype.execute>
    }
    mockUpdateCheckTypeUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof UpdateCheckTypeUseCase.prototype.execute>
    }
    mockDeleteCheckTypeUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof DeleteCheckTypeUseCase.prototype.execute>
    }

    const module = await Test.createTestingModule({
      providers: [
        CheckTypeService,
        { provide: CreateCheckTypeUseCase, useValue: mockCreateCheckTypeUseCase },
        { provide: GetCheckTypesByVehicleUseCase, useValue: mockGetCheckTypesByVehicleUseCase },
        { provide: GetCheckTypeUseCase, useValue: mockGetCheckTypeUseCase },
        { provide: UpdateCheckTypeUseCase, useValue: mockUpdateCheckTypeUseCase },
        { provide: DeleteCheckTypeUseCase, useValue: mockDeleteCheckTypeUseCase }
      ]
    }).compile()

    service = module.get<CheckTypeService>(CheckTypeService)
  })

  describe('createCheckType', () => {
    it('should delegate to createCheckTypeUseCase with correct parameters', async () => {
      const createCheckTypeDto = {
        name: 'Oil Change',
        description: 'Change the engine oil',
        intervalDays: 60
      }
      const vehicleId = 'vehicle-123'

      await service.createCheckType(createCheckTypeDto, vehicleId)

      expect(mockCreateCheckTypeUseCase.execute).toHaveBeenCalledWith(createCheckTypeDto, vehicleId)
    })
  })

  describe('getCheckTypesByVehicle', () => {
    it('should delegate to getCheckTypesByVehicleUseCase with correct parameters', async () => {
      const vehicleId = 'vehicle-123'

      await service.getCheckTypesByVehicle(vehicleId)

      expect(mockGetCheckTypesByVehicleUseCase.execute).toHaveBeenCalledWith(vehicleId)
    })
  })

  describe('getCheckType', () => {
    it('should delegate to getCheckTypeUseCase with correct parameters', async () => {
      const id = 'check-type-123'
      const vehicleId = 'vehicle-123'

      await service.getCheckType(id, vehicleId)

      expect(mockGetCheckTypeUseCase.execute).toHaveBeenCalledWith(id, vehicleId)
    })
  })

  describe('updateCheckType', () => {
    it('should delegate to updateCheckTypeUseCase with correct parameters', async () => {
      const id = 'check-type-123'
      const vehicleId = 'vehicle-123'
      const updateCheckTypeDto = {
        name: 'Oil Change',
        description: 'Change the engine oil',
        intervalDays: 60
      }

      await service.updateCheckType(id, vehicleId, updateCheckTypeDto)

      expect(mockUpdateCheckTypeUseCase.execute).toHaveBeenCalledWith(
        id,
        vehicleId,
        updateCheckTypeDto
      )
    })
  })

  describe('deleteCheckType', () => {
    it('should delegate to deleteCheckTypeUseCase with correct parameters', async () => {
      const id = 'check-type-123'
      const vehicleId = 'vehicle-123'

      await service.deleteCheckType(id, vehicleId)

      expect(mockDeleteCheckTypeUseCase.execute).toHaveBeenCalledWith(id, vehicleId)
    })
  })
})
