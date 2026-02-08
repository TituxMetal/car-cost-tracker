import { atom, computed } from 'nanostores'

import { createVehicle, deleteVehicle, getMyVehicle, updateMileage, updateVehicle } from '../api'
import type { CreateVehicleSchema, UpdateMileageSchema, UpdateVehicleSchema } from '../schemas'
import type { Vehicle } from '../types'

// State atoms
export const $vehicle = atom<Vehicle | null>(null)
export const $isLoading = atom<boolean>(false)
export const $error = atom<string | null>(null)

// Computed values
export const $hasVehicle = computed($vehicle, vehicle => !!vehicle)
export const $vehicleDisplayName = computed($vehicle, vehicle =>
  vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.year})` : ''
)

export const vehicleActions = {
  async fetchVehicle() {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await getMyVehicle()

      $vehicle.set(response)

      return response
    } catch (error) {
      $vehicle.set(null)
      $error.set(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      $isLoading.set(false)
    }
  },
  async create(data: CreateVehicleSchema): Promise<Vehicle> {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await createVehicle(data)

      $vehicle.set(response)

      return response
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Unknown error')

      throw error
    } finally {
      $isLoading.set(false)
    }
  },
  async update(id: string, data: UpdateVehicleSchema): Promise<Vehicle> {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await updateVehicle(id, data)

      $vehicle.set(response)

      return response
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Unknown error')

      throw error
    } finally {
      $isLoading.set(false)
    }
  },
  async updateMileage(id: string, data: UpdateMileageSchema): Promise<Vehicle> {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await updateMileage(id, data)

      $vehicle.set(response)

      return response
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Unknown error')

      throw error
    } finally {
      $isLoading.set(false)
    }
  },
  async remove(id: string): Promise<void> {
    $isLoading.set(true)
    $error.set(null)

    try {
      await deleteVehicle(id)

      $vehicle.set(null)
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Unknown error')

      throw error
    } finally {
      $isLoading.set(false)
    }
  },
  setInitialVehicle(vehicle: Vehicle | null) {
    $vehicle.set(vehicle)
    $error.set(null)
  },
  clearError() {
    $error.set(null)
  }
}
