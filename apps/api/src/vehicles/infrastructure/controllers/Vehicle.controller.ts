import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { Session } from '@thallesp/nestjs-better-auth'

import type { AuthSession } from '~/auth/domain/types'
import type {
  CreateVehicleDto,
  GetVehicleDto,
  UpdateMileageDto,
  UpdateVehicleDto
} from '~/vehicles/application/dtos'
import { VehicleService } from '~/vehicles/application/services'

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async create(
    @Session() session: AuthSession,
    @Body() createDto: CreateVehicleDto
  ): Promise<GetVehicleDto> {
    const newVehicle = await this.vehicleService.createVehicle(createDto, session.user.id)

    return newVehicle
  }

  @Get('me')
  async getMyVehicle(@Session() session: AuthSession): Promise<GetVehicleDto | null> {
    const vehicle = await this.vehicleService.getVehicleByUser(session.user.id)

    return vehicle
  }

  @Patch(':id')
  async update(
    @Session() session: AuthSession,
    @Param('id') vehicleId: string,
    @Body() updateDto: UpdateVehicleDto
  ): Promise<GetVehicleDto> {
    const updatedVehicle = await this.vehicleService.updateVehicle(
      vehicleId,
      session.user.id,
      updateDto
    )

    return updatedVehicle
  }

  @Patch(':id/mileage')
  async updateMileage(
    @Session() session: AuthSession,
    @Param('id') vehicleId: string,
    @Body() updateMileageDto: UpdateMileageDto
  ): Promise<GetVehicleDto> {
    const updatedVehicle = await this.vehicleService.updateMileage(
      vehicleId,
      session.user.id,
      updateMileageDto
    )

    return updatedVehicle
  }

  @Delete(':id')
  async delete(@Session() session: AuthSession, @Param('id') vehicleId: string): Promise<void> {
    await this.vehicleService.deleteVehicle(vehicleId, session.user.id)
  }
}
