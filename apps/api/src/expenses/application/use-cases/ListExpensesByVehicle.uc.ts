import { Injectable } from '@nestjs/common'

import type { GetExpenseDto } from '~/expenses/application/dtos'
import { ExpenseMapper } from '~/expenses/application/mappers'
import type { IExpenseRepository } from '~/expenses/domain/repositories'

@Injectable()
export class ListExpensesByVehicleUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(vehicleId: string): Promise<GetExpenseDto[]> {
    const entities = await this.expenseRepository.findByVehicleId(vehicleId)

    return entities.map(entity => ExpenseMapper.toGetExpenseDto(entity))
  }
}
