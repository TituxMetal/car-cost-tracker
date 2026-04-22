import { Injectable } from '@nestjs/common'

import type { GetBudgetDto, UpsertBudgetDto } from '~/budgets/application/dtos'
import {
  DeleteBudgetUseCase,
  GetBudgetByVehicleUseCase,
  UpsertBudgetUseCase
} from '~/budgets/application/use-cases'

@Injectable()
export class BudgetService {
  constructor(
    private readonly getBudgetByVehicleUseCase: GetBudgetByVehicleUseCase,
    private readonly upsertBudgetUseCase: UpsertBudgetUseCase,
    private readonly deleteBudgetUseCase: DeleteBudgetUseCase
  ) {}

  async getBudgetByVehicle(userId: string): Promise<GetBudgetDto> {
    return this.getBudgetByVehicleUseCase.execute(userId)
  }

  async upsertBudget(userId: string, dto: UpsertBudgetDto): Promise<GetBudgetDto> {
    return this.upsertBudgetUseCase.execute(userId, dto)
  }

  async deleteBudget(userId: string): Promise<void> {
    return this.deleteBudgetUseCase.execute(userId)
  }
}
