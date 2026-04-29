import { useCallback } from 'react'

import type { CheckLog, CheckStatus, CheckStatusSummary } from '~/features/check-logs'
import { useCheckLogs } from '~/features/check-logs'
import type { CreateCheckLogSchema } from '~/features/check-logs/schemas'
import { useCheckTypes } from '~/features/check-types'
import { useVehicle } from '~/features/vehicles'
import type { Vehicle } from '~/features/vehicles'
import { $vehicle as $vehicleStore } from '~/features/vehicles/store'

import type { ActionItem, StatusCounts, TelltaleSummary } from '../types'
import { daysFromNow, formatDaysLabel } from '../utils'

export interface UseDashboardReturn {
  isLoading: boolean
  error: string | null
  vehicle: Vehicle | null
  hasVehicle: boolean
  hasCheckTypes: boolean
  statusCounts: StatusCounts
  actionItems: ActionItem[]
  recentLogs: CheckLog[]
  statuses: CheckStatusSummary[]
  healthScore: number
  tellTaleSummaries: TelltaleSummary[]
  fetchVehicle: () => Promise<void>
  fetchAll: (vehicleId: string) => Promise<void>
  initialize: () => Promise<void>
  logCheck: (vehicleId: string, checkTypeId: string, data: CreateCheckLogSchema) => Promise<void>
}

const computeStatusCounts = (statuses: CheckStatusSummary[]): StatusCounts => {
  const counts: StatusCounts = { onTime: 0, dueSoon: 0, overdue: 0, never: 0 }

  statuses.forEach(({ status }) => {
    if (status === 'on-time') counts.onTime += 1
    if (status === 'due-soon') counts.dueSoon += 1
    if (status === 'overdue') counts.overdue += 1
    if (status === 'never') counts.never += 1
  })

  return counts
}

const computeActionItems = (statuses: CheckStatusSummary[]): ActionItem[] =>
  statuses
    .filter(summary => summary.status === 'overdue' || summary.status === 'due-soon')
    .map(summary => ({
      ...summary,
      daysLabel: summary.nextDueAt ? formatDaysLabel(daysFromNow(summary.nextDueAt)) : ''
    }))
    .sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'overdue' ? -1 : 1
      }

      const aDays = a.nextDueAt ? daysFromNow(a.nextDueAt) : 0
      const bDays = b.nextDueAt ? daysFromNow(b.nextDueAt) : 0

      return aDays - bDays
    })

const TELLTALE_PRIORITY: Record<CheckStatus, number> = {
  overdue: 0,
  'due-soon': 1,
  never: 2,
  'on-time': 3
}

const TELLTALE_LIMIT = 6

const computeTellTaleSummaries = (statuses: CheckStatusSummary[]): TelltaleSummary[] =>
  [...statuses]
    .sort((a, b) => TELLTALE_PRIORITY[a.status] - TELLTALE_PRIORITY[b.status])
    .slice(0, TELLTALE_LIMIT)
    .map(summary => ({
      checkTypeId: summary.checkTypeId,
      name: summary.checkTypeName,
      status: summary.status
    }))

const computeHealthScore = (counts: StatusCounts, total: number): number => {
  if (total === 0) return 100

  const raw = 100 - counts.overdue * 15 - counts.dueSoon * 8 - counts.never * 3

  return Math.max(0, Math.min(100, raw))
}

export const useDashboard = (): UseDashboardReturn => {
  const {
    vehicle,
    isLoading: vehicleLoading,
    error: vehicleError,
    hasVehicle,
    fetchVehicle
  } = useVehicle()
  const {
    logs,
    statuses,
    isLoading: logsLoading,
    error: logsError,
    create: createLog,
    fetchLogs,
    fetchStatuses
  } = useCheckLogs()
  const {
    hasCheckTypes,
    isLoading: checkTypesLoading,
    error: checkTypesError,
    fetchByVehicle: fetchCheckTypes
  } = useCheckTypes()

  const fetchAll = useCallback(
    async (vehicleId: string) => {
      await Promise.all([
        fetchCheckTypes(vehicleId),
        fetchStatuses(vehicleId),
        fetchLogs(vehicleId)
      ])
    },
    [fetchCheckTypes, fetchStatuses, fetchLogs]
  )

  const initialize = useCallback(async () => {
    await fetchVehicle()
    const currentVehicle = $vehicleStore.get()
    if (currentVehicle) {
      await fetchAll(currentVehicle.id)
    }
  }, [fetchVehicle, fetchAll])

  const logCheck = useCallback(
    async (vehicleId: string, checkTypeId: string, data: CreateCheckLogSchema) => {
      await createLog(vehicleId, checkTypeId, data)
      await fetchLogs(vehicleId)
    },
    [createLog, fetchLogs]
  )

  const statusCounts = computeStatusCounts(statuses)

  return {
    isLoading: vehicleLoading || logsLoading || checkTypesLoading,
    error: vehicleError ?? logsError ?? checkTypesError,
    vehicle,
    hasVehicle,
    hasCheckTypes,
    statusCounts,
    actionItems: computeActionItems(statuses),
    recentLogs: logs,
    statuses,
    healthScore: computeHealthScore(statusCounts, statuses.length),
    tellTaleSummaries: computeTellTaleSummaries(statuses),
    fetchVehicle,
    fetchAll,
    initialize,
    logCheck
  }
}
