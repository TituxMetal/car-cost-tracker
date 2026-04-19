import type { ExpenseEntity } from '~/expenses/domain/entities'

import { GetExpenseDto } from '../dtos'

export class ExpenseMapper {
  static toGetExpenseDto(entity: ExpenseEntity): GetExpenseDto {
    const dto: GetExpenseDto = {
      id: entity.id.value,
      vehicleId: entity.vehicleId,
      occurredAt: entity.occurredAt.value,
      amountCents: entity.amount.toCents(),
      category: entity.category,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }

    return Object.assign(new GetExpenseDto(), dto)
  }
}
