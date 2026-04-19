import { Injectable } from '@nestjs/common'

import type { CreateExpenseDto, GetExpenseDto, UpdateExpenseDto } from '~/expenses/application/dtos'
import {
  CreateExpenseUseCase,
  DeleteExpenseUseCase,
  GetExpenseByIdUseCase,
  ListExpensesByVehicleUseCase,
  UpdateExpenseUseCase
} from '~/expenses/application/use-cases'

@Injectable()
export class ExpenseService {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly listExpensesByVehicleUseCase: ListExpensesByVehicleUseCase,
    private readonly getExpenseByIdUseCase: GetExpenseByIdUseCase,
    private readonly updateExpenseUseCase: UpdateExpenseUseCase,
    private readonly deleteExpenseUseCase: DeleteExpenseUseCase
  ) {}

  async createExpense(dto: CreateExpenseDto, vehicleId: string): Promise<GetExpenseDto> {
    return this.createExpenseUseCase.execute(dto, vehicleId)
  }

  async listExpensesByVehicle(vehicleId: string): Promise<GetExpenseDto[]> {
    return this.listExpensesByVehicleUseCase.execute(vehicleId)
  }

  async getExpenseById(id: string, vehicleId: string): Promise<GetExpenseDto> {
    return this.getExpenseByIdUseCase.execute(id, vehicleId)
  }

  async updateExpense(
    id: string,
    vehicleId: string,
    dto: UpdateExpenseDto
  ): Promise<GetExpenseDto> {
    return this.updateExpenseUseCase.execute(id, vehicleId, dto)
  }

  async deleteExpense(id: string, vehicleId: string): Promise<void> {
    return this.deleteExpenseUseCase.execute(id, vehicleId)
  }
}
