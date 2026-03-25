export interface CheckLog {
  id: string
  checkTypeId: string
  checkTypeName: string
  completedAt: string
  notes: string | null
  nextDueAt: string
  createdAt: string
}

export type CheckStatus = 'on-time' | 'due-soon' | 'overdue' | 'never'

export interface CheckStatusSummary {
  checkTypeId: string
  checkTypeName: string
  intervalDays: number
  lastCompletedAt: string | null
  nextDueAt: string | null
  status: CheckStatus
}

export interface CreateCheckLogInput {
  checkTypeId: string
  completedAt: string
  notes?: string
}
