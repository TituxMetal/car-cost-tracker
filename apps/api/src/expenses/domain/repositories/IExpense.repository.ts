import type { ExpenseEntity } from '../entities'
import type { ExpenseIdValueObject } from '../value-objects'

export interface IExpenseRepository {
  create(expense: ExpenseEntity): Promise<ExpenseEntity>
  findById(id: ExpenseIdValueObject): Promise<ExpenseEntity | null>
  findByVehicleId(vehicleId: string): Promise<ExpenseEntity[]>
  update(expense: ExpenseEntity): Promise<ExpenseEntity>
  delete(id: ExpenseIdValueObject): Promise<void>
}
