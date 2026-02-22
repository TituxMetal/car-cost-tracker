import { useStore } from '@nanostores/react'
import { useCallback } from 'react'

import type { CreateCheckTypeSchema, UpdateCheckTypeSchema } from '../schemas'
import {
  $checkTypeCount,
  $checkTypes,
  $error,
  $hasCheckTypes,
  $isLoading,
  checkTypeActions
} from '../store'
import type { CheckType } from '../types'

export interface UseCheckTypesReturn {
  checkTypes: CheckType[]
  isLoading: boolean
  error: string | null
  hasCheckTypes: boolean
  checkTypeCount: number
  fetchByVehicle: (vehicleId: string) => Promise<void>
  create: (vehicleId: string, data: CreateCheckTypeSchema) => Promise<CheckType>
  update: (vehicleId: string, id: string, data: UpdateCheckTypeSchema) => Promise<CheckType>
  remove: (vehicleId: string, id: string) => Promise<void>
  clearError: () => void
}

export const useCheckTypes = (): UseCheckTypesReturn => {
  const fetchByVehicle = useCallback(async (vehicleId: string) => {
    await checkTypeActions.fetchByVehicle(vehicleId)
  }, [])

  return {
    checkTypes: useStore($checkTypes),
    isLoading: useStore($isLoading),
    error: useStore($error),
    hasCheckTypes: useStore($hasCheckTypes),
    checkTypeCount: useStore($checkTypeCount),
    fetchByVehicle,
    create: async (vehicleId, data) => await checkTypeActions.create(vehicleId, data),
    update: async (vehicleId, id, data) => await checkTypeActions.update(vehicleId, id, data),
    remove: async (vehicleId, id) => await checkTypeActions.remove(vehicleId, id),
    clearError: () => checkTypeActions.clearError()
  }
}
