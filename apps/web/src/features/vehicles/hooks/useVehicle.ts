import { useStore } from '@nanostores/react'
import { useCallback } from 'react'

import type { CreateVehicleSchema, UpdateMileageSchema, UpdateVehicleSchema } from '../schemas'
import {
  $error,
  $hasVehicle,
  $isLoading,
  $vehicle,
  $vehicleDisplayName,
  vehicleActions
} from '../store'
import type { Vehicle } from '../types'

export interface UseVehicleReturn {
  vehicle: Vehicle | null
  isLoading: boolean
  error: string | null
  hasVehicle: boolean
  vehicleDisplayName: string
  fetchVehicle: () => Promise<void>
  createVehicle: (data: CreateVehicleSchema) => Promise<Vehicle>
  updateVehicle: (id: string, data: UpdateVehicleSchema) => Promise<Vehicle>
  updateMileage: (id: string, data: UpdateMileageSchema) => Promise<Vehicle>
  deleteVehicle: (id: string) => Promise<void>
  clearError: () => void
}

export const useVehicle = (): UseVehicleReturn => {
  const fetchVehicle = useCallback(async () => {
    await vehicleActions.fetchVehicle()
  }, [])

  return {
    vehicle: useStore($vehicle),
    isLoading: useStore($isLoading),
    error: useStore($error),
    hasVehicle: useStore($hasVehicle),
    vehicleDisplayName: useStore($vehicleDisplayName),
    fetchVehicle,
    createVehicle: async data => await vehicleActions.create(data),
    updateVehicle: async (id, data) => await vehicleActions.update(id, data),
    updateMileage: async (id, data) => await vehicleActions.updateMileage(id, data),
    deleteVehicle: async id => {
      await vehicleActions.remove(id)
    },
    clearError: () => {
      vehicleActions.clearError()
    }
  }
}
