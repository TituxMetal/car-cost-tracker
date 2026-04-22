import { Injectable } from '@nestjs/common'

import { BudgetNotFoundException } from '~/budgets/domain/exceptions'
import type { IBudgetRepository } from '~/budgets/domain/repositories'
import { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

@Injectable()
export class DeleteBudgetUseCase {
  constructor(
    private readonly budgetRepository: IBudgetRepository,
    private readonly vehicleService: VehicleService
  ) {}

  async execute(userId: string): Promise<void> {
    const vehicle = await this.vehicleService.getVehicleByUser(userId)

    if (!vehicle) {
      throw new VehicleNotFoundException()
    }

    const existing = await this.budgetRepository.findByVehicleId(vehicle.id)

    if (!existing) {
      throw new BudgetNotFoundException(vehicle.id)
    }

    await this.budgetRepository.deleteByVehicleId(vehicle.id)
  }
}
