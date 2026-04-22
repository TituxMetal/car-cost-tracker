import { Injectable } from '@nestjs/common'

import type { GetBudgetDto } from '~/budgets/application/dtos'
import { BudgetMapper } from '~/budgets/application/mappers'
import { BudgetNotFoundException } from '~/budgets/domain/exceptions'
import type { IBudgetRepository } from '~/budgets/domain/repositories'
import { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

@Injectable()
export class GetBudgetByVehicleUseCase {
  constructor(
    private readonly budgetRepository: IBudgetRepository,
    private readonly vehicleService: VehicleService
  ) {}

  async execute(userId: string): Promise<GetBudgetDto> {
    const vehicle = await this.vehicleService.getVehicleByUser(userId)

    if (!vehicle) {
      throw new VehicleNotFoundException()
    }

    const entity = await this.budgetRepository.findByVehicleId(vehicle.id)

    if (!entity) {
      throw new BudgetNotFoundException(vehicle.id)
    }

    return BudgetMapper.toGetBudgetDto(entity)
  }
}
