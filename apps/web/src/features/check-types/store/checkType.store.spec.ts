import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'
import { cleanup } from '~/test-utils'

import type { CheckType } from '../types'

import {
  $checkTypeCount,
  $checkTypes,
  $error,
  $hasCheckTypes,
  $isLoading,
  checkTypeActions
} from './checkType.store'

const mockCheckType: CheckType = {
  id: 'ct1',
  vehicleId: 'v1',
  name: 'Oil Level Check',
  description: null,
  intervalDays: 7,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01'
}

const mockCheckType2: CheckType = {
  id: 'ct2',
  vehicleId: 'v1',
  name: 'Tire Pressure Check',
  description: null,
  intervalDays: 14,
  createdAt: '2026-01-02',
  updatedAt: '2026-01-02'
}

let getSpy: Mock<typeof api.get>
let postSpy: Mock<typeof api.post>
let patchSpy: Mock<typeof api.patch>
let deleteSpy: Mock<typeof api.delete>

describe('CheckType Store', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    getSpy = spyOn(api, 'get')
    postSpy = spyOn(api, 'post')
    patchSpy = spyOn(api, 'patch')
    deleteSpy = spyOn(api, 'delete')

    // Reset store state
    $checkTypes.set([])
    $isLoading.set(false)
    $error.set(null)
  })

  afterEach(() => {
    getSpy.mockRestore()
    postSpy.mockRestore()
    patchSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  describe('State Atoms', () => {
    it('should initialize $checkTypes with empty array', () => {
      expect($checkTypes.get()).toEqual([])
    })

    it('should initialize $isLoading with false', () => {
      expect($isLoading.get()).toBe(false)
    })

    it('should initialize $error with null', () => {
      expect($error.get()).toBeNull()
    })
  })

  describe('Computed Values', () => {
    it('should return false for $hasCheckTypes when list is empty', () => {
      expect($hasCheckTypes.get()).toBe(false)
    })

    it('should return true for $hasCheckTypes when list has items', () => {
      $checkTypes.set([mockCheckType])
      expect($hasCheckTypes.get()).toBe(true)
    })

    it('should return 0 for $checkTypeCount when list is empty', () => {
      expect($checkTypeCount.get()).toBe(0)
    })

    it('should return correct count for $checkTypeCount', () => {
      $checkTypes.set([mockCheckType, mockCheckType2])

      expect($checkTypeCount.get()).toBe(2)
    })
  })

  describe('checkTypeActions', () => {
    describe('fetchByVehicle', () => {
      it('should fetch and set check types on success', async () => {
        const apiResponse = [mockCheckType, mockCheckType2]

        getSpy.mockResolvedValueOnce({ data: apiResponse, success: true })

        await checkTypeActions.fetchByVehicle('v1')

        expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/check-types')
        expect($checkTypes.get()).toEqual(apiResponse)
        expect($error.get()).toBeNull()
      })

      it('should set empty array when no check types exist', async () => {
        getSpy.mockResolvedValueOnce({ data: [], success: true })

        await checkTypeActions.fetchByVehicle('v1')

        expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/check-types')
        expect($checkTypes.get()).toEqual([])
        expect($error.get()).toBeNull()
      })

      it('should set error on failure', async () => {
        getSpy.mockResolvedValueOnce({ data: null, success: false })

        await checkTypeActions.fetchByVehicle('v1')

        expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/check-types')
        expect($checkTypes.get()).toEqual([])
        expect($error.get()).toBe('API request failed')
      })

      it('should manage loading state during fetch', async () => {
        const apiResponse = { data: [mockCheckType], success: true }

        getSpy.mockResolvedValueOnce(apiResponse)

        const fetchPromise = checkTypeActions.fetchByVehicle('v1')

        expect($isLoading.get()).toBe(true)

        await fetchPromise

        expect($isLoading.get()).toBe(false)
      })
    })

    describe('create', () => {
      it('should create check type and append to list on success', async () => {
        const newCheckType = {
          name: 'Brake Check',
          intervalDays: 30
        }
        const createdCheckType = { ...mockCheckType, ...newCheckType, id: 'ct3' }
        const apiResponse = { data: createdCheckType, success: true }

        postSpy.mockResolvedValueOnce(apiResponse)

        // Pre-populate store with existing check type
        $checkTypes.set([mockCheckType])

        const result = await checkTypeActions.create('v1', newCheckType)

        expect(postSpy).toHaveBeenCalledWith('/vehicles/v1/check-types', newCheckType)
        expect($checkTypes.get()).toEqual([mockCheckType, createdCheckType])
        expect($error.get()).toBeNull()
        expect(result).toEqual(createdCheckType)
      })

      it('should set error on creation failure', async () => {
        const newCheckType = {
          name: 'Brake Check',
          intervalDays: 30
        }
        const errorMessage = 'Failed to create check type'

        postSpy.mockRejectedValueOnce(new Error(errorMessage))

        await expect(checkTypeActions.create('v1', newCheckType)).rejects.toThrow(errorMessage)

        expect(postSpy).toHaveBeenCalledWith('/vehicles/v1/check-types', newCheckType)
        expect($error.get()).toBe(errorMessage)
      })
    })

    describe('update', () => {
      it('should update check type and replace in list on success', async () => {
        const updatedData = { name: 'Updated Oil Check', intervalDays: 10 }
        const updatedCheckType = { ...mockCheckType, ...updatedData }
        const apiResponse = { data: updatedCheckType, success: true }

        patchSpy.mockResolvedValueOnce(apiResponse)

        // Pre-populate store with existing check type
        $checkTypes.set([mockCheckType])

        const result = await checkTypeActions.update('v1', 'ct1', updatedData)

        expect(patchSpy).toHaveBeenCalledWith('/vehicles/v1/check-types/ct1', updatedData)
        expect($checkTypes.get()).toEqual([updatedCheckType])
        expect($error.get()).toBeNull()
        expect(result).toEqual(updatedCheckType)
      })

      it('should set error on update failure', async () => {
        const updatedData = { name: 'Updated Oil Check', intervalDays: 10 }
        const errorMessage = 'Failed to update check type'

        patchSpy.mockRejectedValueOnce(new Error(errorMessage))

        await expect(checkTypeActions.update('v1', 'ct1', updatedData)).rejects.toThrow(
          errorMessage
        )

        expect(patchSpy).toHaveBeenCalledWith('/vehicles/v1/check-types/ct1', updatedData)
        expect($error.get()).toBe(errorMessage)
      })
    })

    describe('remove', () => {
      it('should delete check type and remove from list on success', async () => {
        const apiResponse = { success: true }

        deleteSpy.mockResolvedValueOnce(apiResponse)

        // Pre-populate store with existing check type
        $checkTypes.set([mockCheckType])

        await checkTypeActions.remove('v1', 'ct1')

        expect(deleteSpy).toHaveBeenCalledWith('/vehicles/v1/check-types/ct1')
        expect($checkTypes.get()).toEqual([])
        expect($error.get()).toBeNull()
      })

      it('should set error on deletion failure', async () => {
        const errorMessage = 'Failed to delete check type'

        deleteSpy.mockRejectedValueOnce(new Error(errorMessage))

        await expect(checkTypeActions.remove('v1', 'ct1')).rejects.toThrow(errorMessage)

        expect(deleteSpy).toHaveBeenCalledWith('/vehicles/v1/check-types/ct1')
        expect($error.get()).toBe(errorMessage)
      })
    })

    describe('clearError', () => {
      it('should clear error state', () => {
        $error.set('Some error')

        checkTypeActions.clearError()

        expect($error.get()).toBeNull()
      })
    })
  })
})
