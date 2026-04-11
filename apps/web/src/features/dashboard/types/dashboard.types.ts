import type { CheckStatusSummary } from '~/features/check-logs'

export interface StatusCounts {
  onTime: number
  dueSoon: number
  overdue: number
  never: number
}

export interface ActionItem extends CheckStatusSummary {
  daysLabel: string
}
