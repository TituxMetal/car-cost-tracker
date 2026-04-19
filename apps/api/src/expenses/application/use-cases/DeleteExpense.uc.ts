import { Injectable } from '@nestjs/common'

import { ExpenseNotFoundException } from '~/expenses/domain/exceptions'
import type { IExpenseRepository } from '~/expenses/domain/repositories'
import { ExpenseIdValueObject } from '~/expenses/domain/value-objects'

@Injectable()
export class DeleteExpenseUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(id: string, vehicleId: string): Promise<void> {
    const expenseId = new ExpenseIdValueObject(id)
    const entity = await this.expenseRepository.findById(expenseId)

    if (!entity || entity.vehicleId !== vehicleId) {
      throw new ExpenseNotFoundException(id)
    }

    await this.expenseRepository.delete(expenseId)
  }
}
