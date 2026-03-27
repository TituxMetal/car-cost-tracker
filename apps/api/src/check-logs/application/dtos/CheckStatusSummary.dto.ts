export type CheckStatus = 'on-time' | 'due-soon' | 'overdue' | 'never'

export class CheckStatusSummaryDto {
  checkTypeId!: string
  checkTypeName!: string
  intervalDays!: number
  lastCompletedAt!: string | null
  nextDueAt!: string | null
  status!: CheckStatus
}
