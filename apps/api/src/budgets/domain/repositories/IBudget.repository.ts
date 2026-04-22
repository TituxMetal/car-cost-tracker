import type { BudgetEntity } from '../entities'

export interface IBudgetRepository {
  findByVehicleId(vehicleId: string): Promise<BudgetEntity | null>
  save(budget: BudgetEntity): Promise<BudgetEntity>
  deleteByVehicleId(vehicleId: string): Promise<void>
}
