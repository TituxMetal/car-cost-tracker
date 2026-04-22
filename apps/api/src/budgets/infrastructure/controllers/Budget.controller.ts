import { Body, Controller, Delete, Get, HttpCode, Param, Put } from '@nestjs/common'
import { Session } from '@thallesp/nestjs-better-auth'

import type { AuthSession } from '~/auth/domain/types'
import type { GetBudgetDto, UpsertBudgetDto } from '~/budgets/application/dtos'
import { BudgetService } from '~/budgets/application/services'
import { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

@Controller('vehicles/:vehicleId/budget')
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly vehicleService: VehicleService
  ) {}

  @Get()
  async get(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string
  ): Promise<GetBudgetDto> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.budgetService.getBudgetByVehicle(session.user.id)
  }

  @Put()
  async upsert(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpsertBudgetDto
  ): Promise<GetBudgetDto> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.budgetService.upsertBudget(session.user.id, dto)
  }

  @Delete()
  @HttpCode(204)
  async delete(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string
  ): Promise<void> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.budgetService.deleteBudget(session.user.id)
  }

  private async verifyVehicleOwnership(vehicleId: string, userId: string): Promise<void> {
    const vehicle = await this.vehicleService.getVehicleByUser(userId)

    if (!vehicle || vehicle.id !== vehicleId) {
      throw new VehicleNotFoundException(vehicleId)
    }
  }
}
