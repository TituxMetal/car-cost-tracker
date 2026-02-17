import { Injectable } from '@nestjs/common'

import type {
  CreateCheckTypeDto,
  GetCheckTypeDto,
  UpdateCheckTypeDto
} from '~/check-types/application/dtos'
import {
  CreateCheckTypeUseCase,
  DeleteCheckTypeUseCase,
  GetCheckTypeUseCase,
  GetCheckTypesByVehicleUseCase,
  UpdateCheckTypeUseCase
} from '~/check-types/application/use-cases'

@Injectable()
export class CheckTypeService {
  constructor(
    private readonly createCheckTypeUseCase: CreateCheckTypeUseCase,
    private readonly getCheckTypesByVehicleUseCase: GetCheckTypesByVehicleUseCase,
    private readonly getCheckTypeUseCase: GetCheckTypeUseCase,
    private readonly updateCheckTypeUseCase: UpdateCheckTypeUseCase,
    private readonly deleteCheckTypeUseCase: DeleteCheckTypeUseCase
  ) {}

  async createCheckType(dto: CreateCheckTypeDto, vehicleId: string): Promise<GetCheckTypeDto> {
    return this.createCheckTypeUseCase.execute(dto, vehicleId)
  }

  async getCheckTypesByVehicle(vehicleId: string): Promise<GetCheckTypeDto[]> {
    return this.getCheckTypesByVehicleUseCase.execute(vehicleId)
  }

  async getCheckType(id: string, vehicleId: string): Promise<GetCheckTypeDto> {
    return this.getCheckTypeUseCase.execute(id, vehicleId)
  }

  async updateCheckType(
    id: string,
    vehicleId: string,
    dto: UpdateCheckTypeDto
  ): Promise<GetCheckTypeDto> {
    return this.updateCheckTypeUseCase.execute(id, vehicleId, dto)
  }

  async deleteCheckType(id: string, vehicleId: string): Promise<void> {
    return this.deleteCheckTypeUseCase.execute(id, vehicleId)
  }
}
