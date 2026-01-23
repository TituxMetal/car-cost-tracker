import { Test } from '@nestjs/testing'
import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import {
  CreateVehicleUseCase,
  DeleteVehicleUseCase,
  GetVehicleByUserUseCase,
  UpdateMileageUseCase,
  UpdateVehicleUseCase
} from '~/vehicles/application/use-cases'

import { VehicleService } from './Vehicle.service'

describe('VehicleService', () => {
  let service: VehicleService
  let mockCreateVehicleUseCase: {
    execute: Mock<typeof CreateVehicleUseCase.prototype.execute>
  }
  let mockGetVehicleByUserUseCase: {
    execute: Mock<typeof GetVehicleByUserUseCase.prototype.execute>
  }
  let mockUpdateVehicleUseCase: {
    execute: Mock<typeof UpdateVehicleUseCase.prototype.execute>
  }
  let mockUpdateMileageUseCase: {
    execute: Mock<typeof UpdateMileageUseCase.prototype.execute>
  }
  let mockDeleteVehicleUseCase: {
    execute: Mock<typeof DeleteVehicleUseCase.prototype.execute>
  }

  beforeEach(async () => {
    mockCreateVehicleUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof CreateVehicleUseCase.prototype.execute>
    }
    mockGetVehicleByUserUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof GetVehicleByUserUseCase.prototype.execute>
    }
    mockUpdateVehicleUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof UpdateVehicleUseCase.prototype.execute>
    }
    mockUpdateMileageUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof UpdateMileageUseCase.prototype.execute>
    }
    mockDeleteVehicleUseCase = {
      execute: mock(() => {}) as unknown as Mock<typeof DeleteVehicleUseCase.prototype.execute>
    }

    const module = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: CreateVehicleUseCase,
          useValue: mockCreateVehicleUseCase
        },
        {
          provide: GetVehicleByUserUseCase,
          useValue: mockGetVehicleByUserUseCase
        },
        {
          provide: UpdateVehicleUseCase,
          useValue: mockUpdateVehicleUseCase
        },
        {
          provide: UpdateMileageUseCase,
          useValue: mockUpdateMileageUseCase
        },
        {
          provide: DeleteVehicleUseCase,
          useValue: mockDeleteVehicleUseCase
        }
      ]
    }).compile()

    service = module.get<VehicleService>(VehicleService)
  })

  describe('createVehicle', () => {
    it('should call createVehicleUseCase with correct parameters', async () => {
      const dto = { make: 'Toyota', model: 'Corolla', year: 2020 }
      const userId = 'user-123'

      await service.createVehicle(dto, userId)

      expect(mockCreateVehicleUseCase.execute).toHaveBeenCalledWith(dto, userId)
    })
  })

  describe('getVehicleByUser', () => {
    it('should call getVehicleByUserUseCase with correct parameters', async () => {
      const userId = 'user-123'

      await service.getVehicleByUser(userId)

      expect(mockGetVehicleByUserUseCase.execute).toHaveBeenCalledWith(userId)
    })

    it('should return null when no vehicle exists', async () => {
      const userId = 'user-456'

      mockGetVehicleByUserUseCase.execute.mockResolvedValueOnce(null)

      const result = await service.getVehicleByUser(userId)

      expect(result).toBeNull()
    })
  })

  describe('updateVehicle', () => {
    it('should call updateVehicleUseCase with correct parameters', async () => {
      const vehicleId = 'vehicle-123'
      const userId = 'user-123'
      const dto = { model: 'Camry' }

      await service.updateVehicle(vehicleId, userId, dto)

      expect(mockUpdateVehicleUseCase.execute).toHaveBeenCalledWith(vehicleId, userId, dto)
    })
  })

  describe('updateMileage', () => {
    it('should call updateMileageUseCase with correct parameters', async () => {
      const vehicleId = 'vehicle-123'
      const userId = 'user-123'
      const dto = { mileage: 15000 }

      await service.updateMileage(vehicleId, userId, dto)

      expect(mockUpdateMileageUseCase.execute).toHaveBeenCalledWith(vehicleId, userId, dto)
    })
  })

  describe('deleteVehicle', () => {
    it('should call deleteVehicleUseCase with correct parameters', async () => {
      const vehicleId = 'vehicle-123'
      const userId = 'user-123'

      await service.deleteVehicle(vehicleId, userId)

      expect(mockDeleteVehicleUseCase.execute).toHaveBeenCalledWith(vehicleId, userId)
    })
  })
})
