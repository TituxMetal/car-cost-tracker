import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { Session } from '@thallesp/nestjs-better-auth'

import type { AuthSession } from '~/auth/domain/types'
import type {
  CreateCheckTypeDto,
  GetCheckTypeDto,
  UpdateCheckTypeDto
} from '~/check-types/application/dtos'
import { CheckTypeService } from '~/check-types/application/services'
import { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

@Controller('vehicles/:vehicleId/check-types')
export class CheckTypeController {
  constructor(
    private readonly checkTypeService: CheckTypeService,
    private readonly vehicleService: VehicleService
  ) {}

  @Post()
  async create(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Body() createDto: CreateCheckTypeDto
  ): Promise<GetCheckTypeDto> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.checkTypeService.createCheckType(createDto, vehicleId)
  }

  @Get()
  async getByVehicle(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string
  ): Promise<GetCheckTypeDto[]> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.checkTypeService.getCheckTypesByVehicle(vehicleId)
  }

  @Get(':id')
  async getOne(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Param('id') id: string
  ): Promise<GetCheckTypeDto> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.checkTypeService.getCheckType(id, vehicleId)
  }

  @Patch(':id')
  async update(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateCheckTypeDto
  ): Promise<GetCheckTypeDto> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.checkTypeService.updateCheckType(id, vehicleId, updateDto)
  }

  @Delete(':id')
  async delete(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Param('id') id: string
  ): Promise<void> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.checkTypeService.deleteCheckType(id, vehicleId)
  }

  private async verifyVehicleOwnership(vehicleId: string, userId: string): Promise<void> {
    const vehicle = await this.vehicleService.getVehicleByUser(userId)

    if (!vehicle || vehicle.id !== vehicleId) {
      throw new VehicleNotFoundException(vehicleId)
    }
  }
}
