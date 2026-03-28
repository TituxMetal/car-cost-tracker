import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'
import { cleanup } from '~/test-utils'

import type { CheckLog, CheckStatusSummary } from '../types'

import {
  $checkLogCount,
  $checkLogs,
  $checkStatuses,
  $error,
  $hasCheckLogs,
  $isLoading,
  checkLogActions
} from './checkLog.store'

const mockCheckLog: CheckLog = {
  id: 'cl1',
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  completedAt: '2026-03-15',
  notes: 'All good',
  nextDueAt: '2026-03-22',
  createdAt: '2026-03-15T10:00:00Z'
}

const mockCheckLog2: CheckLog = {
  id: 'cl2',
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  completedAt: '2026-03-10',
  notes: null,
  nextDueAt: '2026-03-17',
  createdAt: '2026-03-10T10:00:00Z'
}

const mockStatusSummary: CheckStatusSummary = {
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  intervalDays: 7,
  lastCompletedAt: '2026-03-15',
  nextDueAt: '2026-03-22',
  status: 'on-time'
}

let getSpy: Mock<typeof api.get>
let postSpy: Mock<typeof api.post>
let deleteSpy: Mock<typeof api.delete>

describe('CheckLog Store', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    getSpy = spyOn(api, 'get')
    postSpy = spyOn(api, 'post')
    deleteSpy = spyOn(api, 'delete')

    $checkLogs.set([])
    $checkStatuses.set([])
    $isLoading.set(false)
    $error.set(null)
  })

  afterEach(() => {
    getSpy.mockRestore()
    postSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  describe('State Atoms', () => {
    it('should initialize $checkLogs with empty array', () => {
      expect($checkLogs.get()).toEqual([])
    })

    it('should initialize $checkStatuses with empty array', () => {
      expect($checkStatuses.get()).toEqual([])
    })

    it('should initialize $isLoading with false', () => {
      expect($isLoading.get()).toBe(false)
    })

    it('should initialize $error with null', () => {
      expect($error.get()).toBe(null)
    })
  })

  describe('Computed Values', () => {
    it('should return false for $hasCheckLogs when empty', () => {
      expect($hasCheckLogs.get()).toBe(false)
    })

    it('should return true for $hasCheckLogs when has items', () => {
      $checkLogs.set([mockCheckLog])

      expect($hasCheckLogs.get()).toBe(true)
    })

    it('should return correct $checkLogCount', () => {
      expect($checkLogCount.get()).toBe(0)

      $checkLogs.set([mockCheckLog, mockCheckLog2])

      expect($checkLogCount.get()).toBe(2)
    })
  })

  describe('checkLogActions', () => {
    describe('fetchLogs', () => {
      it('should fetch and set check logs on success', async () => {
        const apiResponse = [mockCheckLog, mockCheckLog2]

        getSpy.mockResolvedValueOnce({ data: apiResponse, success: true })

        await checkLogActions.fetchLogs('vehicle123')

        expect(getSpy).toHaveBeenCalledWith('/vehicles/vehicle123/check-logs')
        expect($checkLogs.get()).toEqual(apiResponse)
      })

      it('should set error on failure', async () => {
        const errorMessage = 'Failed to fetch logs'

        getSpy.mockRejectedValueOnce(new Error(errorMessage))

        await checkLogActions.fetchLogs('vehicle123')

        expect(getSpy).toHaveBeenCalledWith('/vehicles/vehicle123/check-logs')
        expect($error.get()).toBe(errorMessage)
      })

      it('should manage loading state during fetch', async () => {
        const apiResponse = { data: [mockCheckLog], success: true }

        getSpy.mockResolvedValueOnce(apiResponse)

        const fetchPromise = checkLogActions.fetchLogs('vehicle123')

        expect($isLoading.get()).toBe(true)

        await fetchPromise

        expect($isLoading.get()).toBe(false)
      })
    })

    describe('fetchStatuses', () => {
      it('should fetch and set check statuses on success', async () => {
        const apiResponse = [mockStatusSummary]

        getSpy.mockResolvedValueOnce({ data: apiResponse, success: true })

        await checkLogActions.fetchStatuses('vehicle123')

        expect(getSpy).toHaveBeenCalledWith('/vehicles/vehicle123/check-status')
        expect($checkStatuses.get()).toEqual(apiResponse)
      })

      it('should set error on failure', async () => {
        const errorMessage = 'Failed to fetch statuses'

        getSpy.mockRejectedValueOnce(new Error(errorMessage))

        await checkLogActions.fetchStatuses('vehicle123')

        expect(getSpy).toHaveBeenCalledWith('/vehicles/vehicle123/check-status')
        expect($error.get()).toBe(errorMessage)
      })
    })

    describe('create', () => {
      it('should create check log, append to list, and refresh statuses', async () => {
        const newCheckLog = {
          completedAt: '2026-03-20',
          notes: 'New log'
        }
        const createdCheckLog = {
          ...mockCheckLog,
          ...newCheckLog,
          checkTypeId: 'ct1',
          id: 'cl3',
          nextDueAt: '2026-03-27',
          createdAt: '2026-03-20T10:00:00Z'
        }
        const statusSummary = {
          ...mockStatusSummary,
          lastCompletedAt: '2026-03-20',
          nextDueAt: '2026-03-27',
          status: 'on-time' as const
        }

        postSpy.mockResolvedValueOnce({ data: createdCheckLog, success: true })
        getSpy.mockResolvedValueOnce({ data: [statusSummary], success: true })

        await checkLogActions.create('vehicle123', 'ct1', newCheckLog)

        expect(postSpy).toHaveBeenCalledWith('/vehicles/vehicle123/check-logs', {
          ...newCheckLog,
          checkTypeId: 'ct1'
        })
        expect(getSpy).toHaveBeenCalledWith('/vehicles/vehicle123/check-status')
        expect($checkLogs.get()).toContainEqual(createdCheckLog)
        expect($checkStatuses.get()).toContainEqual(statusSummary)
      })

      it('should set error on creation failure', async () => {
        const newCheckLog = {
          completedAt: '2026-03-20',
          notes: 'New log'
        }
        const errorMessage = 'Failed to create log'

        postSpy.mockRejectedValueOnce(new Error(errorMessage))

        await expect(checkLogActions.create('vehicle123', 'ct1', newCheckLog)).rejects.toThrow(
          errorMessage
        )

        expect(postSpy).toHaveBeenCalledWith('/vehicles/vehicle123/check-logs', {
          ...newCheckLog,
          checkTypeId: 'ct1'
        })
        expect($error.get()).toBe(errorMessage)
      })
    })

    describe('remove', () => {
      it('should delete check log, remove from list, and refresh statuses', async () => {
        $checkLogs.set([mockCheckLog, mockCheckLog2])

        deleteSpy.mockResolvedValueOnce({ success: true })
        getSpy.mockResolvedValueOnce({ data: [mockStatusSummary], success: true })

        await checkLogActions.remove('vehicle123', 'cl1')

        expect(deleteSpy).toHaveBeenCalledWith('/vehicles/vehicle123/check-logs/cl1')
        expect(getSpy).toHaveBeenCalledWith('/vehicles/vehicle123/check-status')
        expect($checkLogs.get()).not.toContainEqual(mockCheckLog)
        expect($checkStatuses.get()).toContainEqual(mockStatusSummary)
      })

      it('should set error on deletion failure', async () => {
        $checkLogs.set([mockCheckLog, mockCheckLog2])
        const errorMessage = 'Failed to delete log'

        deleteSpy.mockRejectedValueOnce(new Error(errorMessage))

        await expect(checkLogActions.remove('vehicle123', 'cl1')).rejects.toThrow(errorMessage)

        expect(deleteSpy).toHaveBeenCalledWith('/vehicles/vehicle123/check-logs/cl1')
        expect($error.get()).toBe(errorMessage)
      })
    })

    describe('clearError', () => {
      it('should clear error state', () => {
        $error.set('Some error')

        checkLogActions.clearError()

        expect($error.get()).toBe(null)
      })
    })
  })
})
