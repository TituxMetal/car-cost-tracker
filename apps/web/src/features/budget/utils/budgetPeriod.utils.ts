import type { BudgetPeriod } from '../types'

export const PERIOD_LABELS: Record<BudgetPeriod, string> = {
  MONTHLY: 'Mensuel',
  ANNUAL: 'Annuel'
}

type PeriodOption = {
  value: BudgetPeriod
  label: string
}

export const PERIOD_OPTIONS: Array<PeriodOption> = Object.entries(PERIOD_LABELS).map(
  ([value, label]) => ({
    value: value as BudgetPeriod,
    label
  })
)
