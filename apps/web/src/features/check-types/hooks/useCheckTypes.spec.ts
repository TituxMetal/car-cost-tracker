import { beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { cleanup, renderHook } from '~/test-utils'

import { $checkTypes, $error, $isLoading, checkTypeActions } from '../store'
import type { CheckType } from '../types'

import { useCheckTypes } from './useCheckTypes'

const mockCheckType: CheckType = {
  id: 'ct1',
  vehicleId: 'v1',
  name: "Niveau d'huile",
  description: null,
  intervalDays: 7,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
}

describe('useCheckTypes', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    $checkTypes.set([])
    $isLoading.set(false)
    $error.set(null)
  })

  describe('reactive state', () => {
    it('should return checkTypes from store', () => {
      $checkTypes.set([mockCheckType])

      const { result } = renderHook(() => useCheckTypes())

      expect(result.current.checkTypes).toEqual([mockCheckType])
    })

    it('should return empty array when store is empty', () => {
      $checkTypes.set([])

      const { result } = renderHook(() => useCheckTypes())

      expect(result.current.checkTypes).toEqual([])
    })

    it('should return isLoading from store', () => {
      $isLoading.set(true)

      const { result } = renderHook(() => useCheckTypes())

      expect(result.current.isLoading).toBe(true)
    })

    it('should return error from store', () => {
      $error.set('Error message')

      const { result } = renderHook(() => useCheckTypes())

      expect(result.current.error).toBe('Error message')
    })

    it('should return hasCheckTypes as true when check types exist', () => {
      $checkTypes.set([mockCheckType])

      const { result } = renderHook(() => useCheckTypes())

      expect(result.current.hasCheckTypes).toBe(true)
    })

    it('should return hasCheckTypes as false when no check types', () => {
      $checkTypes.set([])

      const { result } = renderHook(() => useCheckTypes())

      expect(result.current.hasCheckTypes).toBe(false)
    })

    it('should return checkTypeCount from store', () => {
      $checkTypes.set([mockCheckType, { ...mockCheckType, id: 'ct2' }])

      const { result } = renderHook(() => useCheckTypes())

      expect(result.current.checkTypeCount).toBe(2)
    })
  })

  describe('actions', () => {
    it('should call checkTypeActions.fetchByVehicle with vehicleId', async () => {
      const spy = spyOn(checkTypeActions, 'fetchByVehicle').mockResolvedValue(undefined)

      const { result } = renderHook(() => useCheckTypes())
      await result.current.fetchByVehicle('v1')

      expect(spy).toHaveBeenCalledWith('v1')
      spy.mockRestore()
    })

    it('should call checkTypeActions.create with vehicleId and data', async () => {
      const data = {
        name: 'Vérification des freins',
        description: "Vérifier l'état des freins",
        intervalDays: 30
      }
      const spy = spyOn(checkTypeActions, 'create').mockResolvedValue(mockCheckType)

      const { result } = renderHook(() => useCheckTypes())
      await result.current.create('v1', data)

      expect(spy).toHaveBeenCalledWith('v1', data)
      spy.mockRestore()
    })

    it('should call checkTypeActions.update with vehicleId, id and data', async () => {
      const data = { name: 'Vérification des freins - mise à jour' }
      const spy = spyOn(checkTypeActions, 'update').mockResolvedValue({ ...mockCheckType, ...data })

      const { result } = renderHook(() => useCheckTypes())
      await result.current.update('v1', 'ct1', data)

      expect(spy).toHaveBeenCalledWith('v1', 'ct1', data)
      spy.mockRestore()
    })

    it('should call checkTypeActions.remove with vehicleId and id', async () => {
      const spy = spyOn(checkTypeActions, 'remove').mockResolvedValue(undefined)

      const { result } = renderHook(() => useCheckTypes())
      await result.current.remove('v1', 'ct1')

      expect(spy).toHaveBeenCalledWith('v1', 'ct1')
      spy.mockRestore()
    })

    it('should call checkTypeActions.clearError', () => {
      const spy = spyOn(checkTypeActions, 'clearError')

      const { result } = renderHook(() => useCheckTypes())
      result.current.clearError()

      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })
})
