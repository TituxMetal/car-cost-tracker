import { Controller, Get, Param } from '@nestjs/common'
import { Session } from '@thallesp/nestjs-better-auth'

import type { AuthSession } from '~/auth/domain/types'
import type { CheckStatusSummaryDto } from '~/check-logs/application/dtos'
import { CheckLogService } from '~/check-logs/application/services'
import { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

@Controller('vehicles/:vehicleId/check-status')
export class CheckStatusController {
  constructor(
    private readonly checkLogService: CheckLogService,
    private readonly vehicleService: VehicleService
  ) {}

  @Get()
  async getSummary(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string
  ): Promise<CheckStatusSummaryDto[]> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.checkLogService.getCheckStatusSummary(vehicleId)
  }

  private async verifyVehicleOwnership(vehicleId: string, userId: string): Promise<void> {
    const vehicle = await this.vehicleService.getVehicleByUser(userId)

    if (!vehicle || vehicle.id !== vehicleId) {
      throw new VehicleNotFoundException(vehicleId)
    }
  }
}
