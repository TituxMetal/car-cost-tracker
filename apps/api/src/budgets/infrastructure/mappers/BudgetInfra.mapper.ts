import type { Budget as PrismaBudget } from '@generated'

import type { BudgetPeriod } from '~/budgets/domain/entities'
import { BudgetEntity } from '~/budgets/domain/entities'
import { BudgetIdValueObject } from '~/budgets/domain/value-objects'
import { AmountValueObject } from '~/shared/domain/value-objects'

export class BudgetInfrastructureMapper {
  static toDomain(prismaBudget: PrismaBudget): BudgetEntity {
    return new BudgetEntity(
      new BudgetIdValueObject(prismaBudget.id),
      prismaBudget.vehicleId,
      AmountValueObject.fromCents(prismaBudget.amountCents),
      prismaBudget.period as BudgetPeriod,
      prismaBudget.createdAt,
      prismaBudget.updatedAt
    )
  }

  static toPrisma(entity: BudgetEntity): Omit<PrismaBudget, 'vehicle'> {
    return {
      id: entity.id.value,
      vehicleId: entity.vehicleId,
      amountCents: entity.amount.toCents(),
      period: entity.period as PrismaBudget['period'],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }
  }
}
