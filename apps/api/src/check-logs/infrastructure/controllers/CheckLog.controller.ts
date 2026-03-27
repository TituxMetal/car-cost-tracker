import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { Session } from '@thallesp/nestjs-better-auth'

import type { AuthSession } from '~/auth/domain/types'
import type { CreateCheckLogDto, GetCheckLogDto } from '~/check-logs/application/dtos'
import { CheckLogService } from '~/check-logs/application/services'
import { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

@Controller('vehicles/:vehicleId/check-logs')
export class CheckLogController {
  constructor(
    private readonly checkLogService: CheckLogService,
    private readonly vehicleService: VehicleService
  ) {}

  @Post()
  async create(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Body() createDto: CreateCheckLogDto
  ): Promise<GetCheckLogDto> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.checkLogService.createCheckLog(createDto, vehicleId)
  }

  @Get()
  async getByVehicle(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string
  ): Promise<GetCheckLogDto[]> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.checkLogService.listCheckLogsByVehicle(vehicleId)
  }

  @Get(':id')
  async getOne(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Param('id') id: string
  ): Promise<GetCheckLogDto> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.checkLogService.getCheckLog(id, vehicleId)
  }

  @Delete(':id')
  async delete(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Param('id') id: string
  ): Promise<void> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.checkLogService.deleteCheckLog(id, vehicleId)
  }

  private async verifyVehicleOwnership(vehicleId: string, userId: string): Promise<void> {
    const vehicle = await this.vehicleService.getVehicleByUser(userId)

    if (!vehicle || vehicle.id !== vehicleId) {
      throw new VehicleNotFoundException(vehicleId)
    }
  }
}
