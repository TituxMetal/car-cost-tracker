import { atom, computed } from 'nanostores'

import { createCheckLog, deleteCheckLog, getCheckLogs, getCheckStatusSummary } from '../api'
import type { CreateCheckLogSchema } from '../schemas'
import type { CheckLog, CheckStatusSummary } from '../types'

export const $checkLogs = atom<CheckLog[]>([])
export const $checkStatuses = atom<CheckStatusSummary[]>([])
export const $isLoading = atom<boolean>(false)
export const $error = atom<string | null>(null)

export const $hasCheckLogs = computed($checkLogs, checkLogs => checkLogs.length > 0)
export const $checkLogCount = computed($checkLogs, checkLogs => checkLogs.length)

export const checkLogActions = {
  async fetchLogs(vehicleId: string) {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await getCheckLogs(vehicleId)

      $checkLogs.set(response)

      return response
    } catch (error) {
      $checkLogs.set([])
      $error.set(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      $isLoading.set(false)
    }
  },

  async fetchStatuses(vehicleId: string) {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await getCheckStatusSummary(vehicleId)

      $checkStatuses.set(response)

      return response
    } catch (error) {
      $checkStatuses.set([])
      $error.set(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      $isLoading.set(false)
    }
  },

  async create(
    vehicleId: string,
    checkTypeId: string,
    data: CreateCheckLogSchema
  ): Promise<CheckLog> {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await createCheckLog(vehicleId, { ...data, checkTypeId })

      $checkLogs.set([response, ...$checkLogs.get()])

      await checkLogActions.fetchStatuses(vehicleId)

      return response
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Unknown error')

      throw error
    } finally {
      $isLoading.set(false)
    }
  },

  async remove(vehicleId: string, id: string): Promise<void> {
    $isLoading.set(true)
    $error.set(null)

    try {
      await deleteCheckLog(vehicleId, id)

      $checkLogs.set($checkLogs.get().filter(log => log.id !== id))

      await checkLogActions.fetchStatuses(vehicleId)
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Unknown error')

      throw error
    } finally {
      $isLoading.set(false)
    }
  },

  clearError() {
    $error.set(null)
  }
}
