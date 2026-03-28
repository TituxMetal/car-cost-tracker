import { beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { cleanup, renderHook } from '~/test-utils'

import { $checkLogs, $checkStatuses, $error, $isLoading, checkLogActions } from '../store'
import type { CheckLog, CheckStatusSummary } from '../types'

import { useCheckLogs } from './useCheckLogs'

const mockCheckLog: CheckLog = {
  id: 'cl1',
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  completedAt: '2026-03-15',
  notes: 'All good',
  nextDueAt: '2026-03-22',
  createdAt: '2026-03-15T10:00:00Z'
}

const mockStatusSummary: CheckStatusSummary = {
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  intervalDays: 7,
  lastCompletedAt: '2026-03-15',
  nextDueAt: '2026-03-22',
  status: 'on-time'
}

describe('useCheckLogs', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    $checkLogs.set([])
    $checkStatuses.set([])
    $isLoading.set(false)
    $error.set(null)
  })

  describe('reactive state', () => {
    it('should return logs from store', () => {
      $checkLogs.set([mockCheckLog])

      const { result } = renderHook(() => useCheckLogs())

      expect(result.current.logs).toEqual([mockCheckLog])
    })

    it('should return statuses from store', () => {
      $checkStatuses.set([mockStatusSummary])

      const { result } = renderHook(() => useCheckLogs())

      expect(result.current.statuses).toEqual([mockStatusSummary])
    })

    it('should return isLoading from store', () => {
      $isLoading.set(true)

      const { result } = renderHook(() => useCheckLogs())

      expect(result.current.isLoading).toBe(true)
    })

    it('should return error from store', () => {
      $error.set('Error message')

      const { result } = renderHook(() => useCheckLogs())

      expect(result.current.error).toBe('Error message')
    })

    it('should return hasCheckLogs as true when logs exist', () => {
      $checkLogs.set([mockCheckLog])

      const { result } = renderHook(() => useCheckLogs())

      expect(result.current.hasCheckLogs).toBe(true)
    })

    it('should return hasCheckLogs as false when no logs', () => {
      const { result } = renderHook(() => useCheckLogs())

      expect(result.current.hasCheckLogs).toBe(false)
    })

    it('should return checkLogCount from store', () => {
      $checkLogs.set([mockCheckLog, { ...mockCheckLog, id: 'cl2' }])

      const { result } = renderHook(() => useCheckLogs())

      expect(result.current.checkLogCount).toBe(2)
    })
  })

  describe('actions', () => {
    it('should call checkLogActions.fetchLogs with vehicleId', async () => {
      const spy = spyOn(checkLogActions, 'fetchLogs').mockResolvedValue(undefined)

      const { result } = renderHook(() => useCheckLogs())
      await result.current.fetchLogs('v1')

      expect(spy).toHaveBeenCalledWith('v1')
      spy.mockRestore()
    })

    it('should call checkLogActions.fetchStatuses with vehicleId', async () => {
      const spy = spyOn(checkLogActions, 'fetchStatuses').mockResolvedValue(undefined)

      const { result } = renderHook(() => useCheckLogs())
      await result.current.fetchStatuses('v1')

      expect(spy).toHaveBeenCalledWith('v1')
      spy.mockRestore()
    })

    it('should call checkLogActions.create with vehicleId, checkTypeId and data', async () => {
      const data = { completedAt: '2026-03-20', notes: 'OK' }
      const spy = spyOn(checkLogActions, 'create').mockResolvedValue(mockCheckLog)

      const { result } = renderHook(() => useCheckLogs())
      await result.current.create('v1', 'ct1', data)

      expect(spy).toHaveBeenCalledWith('v1', 'ct1', data)
      spy.mockRestore()
    })

    it('should call checkLogActions.remove with vehicleId and id', async () => {
      const spy = spyOn(checkLogActions, 'remove').mockResolvedValue(undefined)

      const { result } = renderHook(() => useCheckLogs())
      await result.current.remove('v1', 'cl1')

      expect(spy).toHaveBeenCalledWith('v1', 'cl1')
      spy.mockRestore()
    })

    it('should call checkLogActions.clearError', () => {
      const spy = spyOn(checkLogActions, 'clearError')

      const { result } = renderHook(() => useCheckLogs())
      result.current.clearError()

      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })
})
