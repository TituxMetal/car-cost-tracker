import { Injectable } from '@nestjs/common'

import type {
  CreateVehicleDto,
  GetVehicleDto,
  UpdateMileageDto,
  UpdateVehicleDto
} from '~/vehicles/application/dtos'
import {
  CreateVehicleUseCase,
  DeleteVehicleUseCase,
  GetVehicleByUserUseCase,
  UpdateMileageUseCase,
  UpdateVehicleUseCase
} from '~/vehicles/application/use-cases'

@Injectable()
export class VehicleService {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly getVehicleByUserUseCase: GetVehicleByUserUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    private readonly updateMileageUseCase: UpdateMileageUseCase,
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase
  ) {}

  async createVehicle(dto: CreateVehicleDto, userId: string): Promise<GetVehicleDto> {
    return this.createVehicleUseCase.execute(dto, userId)
  }

  async getVehicleByUser(userId: string): Promise<GetVehicleDto | null> {
    return this.getVehicleByUserUseCase.execute(userId)
  }

  async updateVehicle(
    vehicleId: string,
    userId: string,
    dto: UpdateVehicleDto
  ): Promise<GetVehicleDto> {
    return this.updateVehicleUseCase.execute(vehicleId, userId, dto)
  }

  async updateMileage(
    vehicleId: string,
    userId: string,
    dto: UpdateMileageDto
  ): Promise<GetVehicleDto> {
    return this.updateMileageUseCase.execute(vehicleId, userId, dto)
  }

  async deleteVehicle(vehicleId: string, userId: string): Promise<void> {
    return this.deleteVehicleUseCase.execute(vehicleId, userId)
  }
}
