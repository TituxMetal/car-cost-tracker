import type { BudgetEntity } from '~/budgets/domain/entities'

import { GetBudgetDto } from '../dtos'

export class BudgetMapper {
  static toGetBudgetDto(entity: BudgetEntity): GetBudgetDto {
    const dto: GetBudgetDto = {
      id: entity.id.value,
      vehicleId: entity.vehicleId,
      amountCents: entity.amount.toCents(),
      period: entity.period,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }

    return Object.assign(new GetBudgetDto(), dto)
  }
}
