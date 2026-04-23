export type BudgetPeriod = 'MONTHLY' | 'ANNUAL'

export interface Budget {
  id: string
  vehicleId: string
  amountCents: number
  period: BudgetPeriod
  createdAt: string
  updatedAt: string
}

export interface UpsertBudgetInput {
  amountCents: number
  period: BudgetPeriod
}

export type BudgetProgressState = 'ON_TRACK' | 'NEAR_LIMIT' | 'OVERSPENT'

export interface BudgetStatus {
  spentCents: number
  targetCents: number
  remainingCents: number
  progressRatio: number
  state: BudgetProgressState
}
