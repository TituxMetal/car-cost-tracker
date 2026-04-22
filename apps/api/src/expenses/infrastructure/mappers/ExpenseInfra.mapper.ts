import type { Expense as PrismaExpense } from '@generated'

import type { ExpenseCategory } from '~/expenses/domain/entities'
import { ExpenseEntity } from '~/expenses/domain/entities'
import { ExpenseIdValueObject, OccurredAtValueObject } from '~/expenses/domain/value-objects'
import { AmountValueObject } from '~/shared/domain/value-objects'

export class ExpenseInfrastructureMapper {
  static toDomain(prismaExpense: PrismaExpense): ExpenseEntity {
    return new ExpenseEntity(
      new ExpenseIdValueObject(prismaExpense.id),
      prismaExpense.vehicleId,
      new OccurredAtValueObject(prismaExpense.occurredAt),
      AmountValueObject.fromCents(prismaExpense.amountCents),
      prismaExpense.category as ExpenseCategory,
      prismaExpense.description ?? null,
      prismaExpense.createdAt,
      prismaExpense.updatedAt
    )
  }

  static toPrisma(entity: ExpenseEntity): Omit<PrismaExpense, 'vehicle'> {
    return {
      id: entity.id.value,
      vehicleId: entity.vehicleId,
      occurredAt: entity.occurredAt.value,
      amountCents: entity.amount.toCents(),
      category: entity.category as PrismaExpense['category'],
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }
  }
}
