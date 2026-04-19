import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { Session } from '@thallesp/nestjs-better-auth'

import type { AuthSession } from '~/auth/domain/types'
import type { CreateExpenseDto, GetExpenseDto, UpdateExpenseDto } from '~/expenses/application/dtos'
import { ExpenseService } from '~/expenses/application/services'
import { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

@Controller('vehicles/:vehicleId/expenses')
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly vehicleService: VehicleService
  ) {}

  @Post()
  async create(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Body() createDto: CreateExpenseDto
  ): Promise<GetExpenseDto> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.expenseService.createExpense(createDto, vehicleId)
  }

  @Get()
  async getByVehicle(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string
  ): Promise<GetExpenseDto[]> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.expenseService.listExpensesByVehicle(vehicleId)
  }

  @Get(':id')
  async getOne(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Param('id') id: string
  ): Promise<GetExpenseDto> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.expenseService.getExpenseById(id, vehicleId)
  }

  @Patch(':id')
  async update(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateExpenseDto
  ): Promise<GetExpenseDto> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.expenseService.updateExpense(id, vehicleId, updateDto)
  }

  @Delete(':id')
  async delete(
    @Session() session: AuthSession,
    @Param('vehicleId') vehicleId: string,
    @Param('id') id: string
  ): Promise<void> {
    await this.verifyVehicleOwnership(vehicleId, session.user.id)

    return this.expenseService.deleteExpense(id, vehicleId)
  }

  private async verifyVehicleOwnership(vehicleId: string, userId: string): Promise<void> {
    const vehicle = await this.vehicleService.getVehicleByUser(userId)

    if (!vehicle || vehicle.id !== vehicleId) {
      throw new VehicleNotFoundException(vehicleId)
    }
  }
}
