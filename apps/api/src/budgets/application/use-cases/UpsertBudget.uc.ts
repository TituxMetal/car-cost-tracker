import { Injectable } from '@nestjs/common'

import type { GetBudgetDto, UpsertBudgetDto } from '~/budgets/application/dtos'
import { BudgetMapper } from '~/budgets/application/mappers'
import { BudgetEntity } from '~/budgets/domain/entities'
import type { IBudgetRepository } from '~/budgets/domain/repositories'
import { BudgetIdValueObject } from '~/budgets/domain/value-objects'
import { AmountValueObject } from '~/shared/domain/value-objects'
import { VehicleService } from '~/vehicles/application/services'
import { VehicleNotFoundException } from '~/vehicles/domain/exceptions'

@Injectable()
export class UpsertBudgetUseCase {
  constructor(
    private readonly budgetRepository: IBudgetRepository,
    private readonly vehicleService: VehicleService
  ) {}

  async execute(userId: string, dto: UpsertBudgetDto): Promise<GetBudgetDto> {
    const vehicle = await this.vehicleService.getVehicleByUser(userId)

    if (!vehicle) {
      throw new VehicleNotFoundException()
    }

    const amount = AmountValueObject.fromCents(dto.amountCents)
    const existing = await this.budgetRepository.findByVehicleId(vehicle.id)

    if (existing) {
      existing.updateBoth({ amount, period: dto.period })
      const saved = await this.budgetRepository.save(existing)

      return BudgetMapper.toGetBudgetDto(saved)
    }

    const created = new BudgetEntity(
      BudgetIdValueObject.generate(),
      vehicle.id,
      amount,
      dto.period,
      new Date(),
      new Date()
    )
    const saved = await this.budgetRepository.save(created)

    return BudgetMapper.toGetBudgetDto(saved)
  }
}
