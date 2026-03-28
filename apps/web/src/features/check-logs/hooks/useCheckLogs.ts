import { useStore } from '@nanostores/react'
import { useCallback } from 'react'

import type { CreateCheckLogSchema } from '../schemas'
import {
  $checkLogCount,
  $checkLogs,
  $checkStatuses,
  $error,
  $hasCheckLogs,
  $isLoading,
  checkLogActions
} from '../store'
import type { CheckLog, CheckStatusSummary } from '../types'

export interface UseCheckLogsReturn {
  logs: CheckLog[]
  statuses: CheckStatusSummary[]
  isLoading: boolean
  error: string | null
  hasCheckLogs: boolean
  checkLogCount: number
  fetchLogs: (vehicleId: string) => Promise<void>
  fetchStatuses: (vehicleId: string) => Promise<void>
  create: (vehicleId: string, checkTypeId: string, data: CreateCheckLogSchema) => Promise<CheckLog>
  remove: (vehicleId: string, id: string) => Promise<void>
  clearError: () => void
}

export const useCheckLogs = (): UseCheckLogsReturn => {
  const fetchLogs = useCallback(async (vehicleId: string) => {
    await checkLogActions.fetchLogs(vehicleId)
  }, [])

  const fetchStatuses = useCallback(async (vehicleId: string) => {
    await checkLogActions.fetchStatuses(vehicleId)
  }, [])

  return {
    logs: useStore($checkLogs),
    statuses: useStore($checkStatuses),
    isLoading: useStore($isLoading),
    error: useStore($error),
    hasCheckLogs: useStore($hasCheckLogs),
    checkLogCount: useStore($checkLogCount),
    fetchLogs,
    fetchStatuses,
    create: async (vehicleId, checkTypeId, data) =>
      await checkLogActions.create(vehicleId, checkTypeId, data),
    remove: async (vehicleId, id) => await checkLogActions.remove(vehicleId, id),
    clearError: () => checkLogActions.clearError()
  }
}
