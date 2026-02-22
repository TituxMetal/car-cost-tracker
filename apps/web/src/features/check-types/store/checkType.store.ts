import { atom, computed } from 'nanostores'

import { createCheckType, deleteCheckType, getCheckTypes, updateCheckType } from '../api'
import type { CreateCheckTypeSchema, UpdateCheckTypeSchema } from '../schemas'
import type { CheckType } from '../types'

// State atoms
export const $checkTypes = atom<CheckType[]>([])
export const $isLoading = atom<boolean>(false)
export const $error = atom<string | null>(null)

// Computed values
export const $hasCheckTypes = computed($checkTypes, checkTypes => checkTypes.length > 0)
export const $checkTypeCount = computed($checkTypes, checkTypes => checkTypes.length)

export const checkTypeActions = {
  async fetchByVehicle(vehicleId: string) {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await getCheckTypes(vehicleId)

      $checkTypes.set(response)

      return response
    } catch (error) {
      $checkTypes.set([])
      $error.set(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      $isLoading.set(false)
    }
  },
  async create(vehicleId: string, data: CreateCheckTypeSchema): Promise<CheckType> {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await createCheckType(vehicleId, data)

      $checkTypes.set([...$checkTypes.get(), response])

      return response
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Unknown error')

      throw error
    } finally {
      $isLoading.set(false)
    }
  },
  async update(vehicleId: string, id: string, data: UpdateCheckTypeSchema): Promise<CheckType> {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await updateCheckType(vehicleId, id, data)

      $checkTypes.set(
        $checkTypes.get().map(checkType => (checkType.id === id ? response : checkType))
      )

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
      await deleteCheckType(vehicleId, id)

      $checkTypes.set($checkTypes.get().filter(checkType => checkType.id !== id))
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
