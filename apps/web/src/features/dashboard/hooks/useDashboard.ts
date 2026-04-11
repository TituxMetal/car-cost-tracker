import { useCallback } from 'react'

import type { CheckLog, CheckStatusSummary } from '~/features/check-logs'
import { useCheckLogs } from '~/features/check-logs'
import type { CreateCheckLogSchema } from '~/features/check-logs/schemas'
import { useCheckTypes } from '~/features/check-types'
import { useVehicle } from '~/features/vehicles'
import type { Vehicle } from '~/features/vehicles'
import { $vehicle as $vehicleStore } from '~/features/vehicles/store'

import type { ActionItem, StatusCounts } from '../types'
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
  fetchVehicle: () => Promise<void>
  fetchAll: (vehicleId: string) => Promise<void>
  initialize: () => Promise<void>
  logCheck: (vehicleId: string, checkTypeId: string, data: CreateCheckLogSchema) => Promise<void>
}

const RECENT_LOGS_LIMIT = 5

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
      await Promise.all([fetchStatuses(vehicleId), fetchLogs(vehicleId)])
    },
    [createLog, fetchStatuses, fetchLogs]
  )

  return {
    isLoading: vehicleLoading || logsLoading || checkTypesLoading,
    error: vehicleError ?? logsError ?? checkTypesError,
    vehicle,
    hasVehicle,
    hasCheckTypes,
    statusCounts: computeStatusCounts(statuses),
    actionItems: computeActionItems(statuses),
    recentLogs: logs.slice(0, RECENT_LOGS_LIMIT),
    fetchVehicle,
    fetchAll,
    initialize,
    logCheck
  }
}
