import { Injectable } from '@nestjs/common'

import type {
  CheckStatusSummaryDto,
  CreateCheckLogDto,
  GetCheckLogDto
} from '~/check-logs/application/dtos'
import {
  CreateCheckLogUseCase,
  DeleteCheckLogUseCase,
  GetCheckLogUseCase,
  GetCheckStatusSummaryUseCase,
  ListCheckLogsByVehicleUseCase
} from '~/check-logs/application/use-cases'

@Injectable()
export class CheckLogService {
  constructor(
    private readonly createCheckLogUseCase: CreateCheckLogUseCase,
    private readonly listCheckLogsByVehicleUseCase: ListCheckLogsByVehicleUseCase,
    private readonly getCheckLogUseCase: GetCheckLogUseCase,
    private readonly deleteCheckLogUseCase: DeleteCheckLogUseCase,
    private readonly getCheckStatusSummaryUseCase: GetCheckStatusSummaryUseCase
  ) {}

  async createCheckLog(dto: CreateCheckLogDto, vehicleId: string): Promise<GetCheckLogDto> {
    return this.createCheckLogUseCase.execute(dto, vehicleId)
  }

  async listCheckLogsByVehicle(vehicleId: string): Promise<GetCheckLogDto[]> {
    return this.listCheckLogsByVehicleUseCase.execute(vehicleId)
  }

  async getCheckLog(id: string, vehicleId: string): Promise<GetCheckLogDto> {
    return this.getCheckLogUseCase.execute(id, vehicleId)
  }

  async deleteCheckLog(id: string, vehicleId: string): Promise<void> {
    return this.deleteCheckLogUseCase.execute(id, vehicleId)
  }

  async getCheckStatusSummary(vehicleId: string): Promise<CheckStatusSummaryDto[]> {
    return this.getCheckStatusSummaryUseCase.execute(vehicleId)
  }
}
