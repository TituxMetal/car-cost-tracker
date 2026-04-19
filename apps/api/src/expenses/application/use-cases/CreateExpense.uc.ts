import { Injectable } from '@nestjs/common'

import type { CreateExpenseDto, GetExpenseDto } from '~/expenses/application/dtos'
import { ExpenseMapper } from '~/expenses/application/mappers'
import { ExpenseEntity } from '~/expenses/domain/entities'
import type { IExpenseRepository } from '~/expenses/domain/repositories'
import {
  AmountValueObject,
  ExpenseIdValueObject,
  OccurredAtValueObject
} from '~/expenses/domain/value-objects'

@Injectable()
export class CreateExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(dto: CreateExpenseDto, vehicleId: string): Promise<GetExpenseDto> {
    const entity = new ExpenseEntity(
      ExpenseIdValueObject.generate(),
      vehicleId,
      new OccurredAtValueObject(dto.occurredAt),
      AmountValueObject.fromCents(dto.amountCents),
      dto.category,
      dto.description ?? null,
      new Date(),
      new Date()
    )
    const created = await this.expenseRepository.create(entity)

    return ExpenseMapper.toGetExpenseDto(created)
  }
}
