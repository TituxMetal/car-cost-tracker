import { Injectable } from '@nestjs/common'

import type { GetExpenseDto, UpdateExpenseDto } from '~/expenses/application/dtos'
import { ExpenseMapper } from '~/expenses/application/mappers'
import { ExpenseNotFoundException } from '~/expenses/domain/exceptions'
import type { IExpenseRepository } from '~/expenses/domain/repositories'
import {
  AmountValueObject,
  ExpenseIdValueObject,
  OccurredAtValueObject
} from '~/expenses/domain/value-objects'

@Injectable()
export class UpdateExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(id: string, vehicleId: string, dto: UpdateExpenseDto): Promise<GetExpenseDto> {
    const expenseId = new ExpenseIdValueObject(id)
    const entity = await this.expenseRepository.findById(expenseId)

    if (!entity || entity.vehicleId !== vehicleId) {
      throw new ExpenseNotFoundException(id)
    }

    if (dto.occurredAt !== undefined) {
      entity.updateOccurredAt(new OccurredAtValueObject(dto.occurredAt))
    }

    if (dto.amountCents !== undefined) {
      entity.updateAmount(AmountValueObject.fromCents(dto.amountCents))
    }

    if (dto.category !== undefined) {
      entity.updateCategory(dto.category)
    }

    if (dto.description !== undefined) {
      entity.updateDescription(dto.description)
    }

    const updated = await this.expenseRepository.update(entity)

    return ExpenseMapper.toGetExpenseDto(updated)
  }
}
