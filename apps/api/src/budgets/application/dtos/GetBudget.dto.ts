import type { BudgetPeriod } from '~/budgets/domain/entities'

export class GetBudgetDto {
  id!: string
  vehicleId!: string
  amountCents!: number
  period!: BudgetPeriod
  createdAt!: Date
  updatedAt!: Date
}
