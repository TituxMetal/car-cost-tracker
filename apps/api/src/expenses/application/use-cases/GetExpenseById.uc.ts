import { Injectable } from '@nestjs/common'

import type { GetExpenseDto } from '~/expenses/application/dtos'
import { ExpenseMapper } from '~/expenses/application/mappers'
import { ExpenseNotFoundException } from '~/expenses/domain/exceptions'
import type { IExpenseRepository } from '~/expenses/domain/repositories'
import { ExpenseIdValueObject } from '~/expenses/domain/value-objects'

@Injectable()
export class GetExpenseByIdUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(id: string, vehicleId: string): Promise<GetExpenseDto> {
    const expenseId = new ExpenseIdValueObject(id)
    const entity = await this.expenseRepository.findById(expenseId)

    if (!entity || entity.vehicleId !== vehicleId) {
      throw new ExpenseNotFoundException(id)
    }

    return ExpenseMapper.toGetExpenseDto(entity)
  }
}
