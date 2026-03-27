import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'

import type { CheckLog, CheckStatusSummary } from '../types'

import {
  createCheckLog,
  deleteCheckLog,
  getCheckLogs,
  getCheckStatusSummary
} from './checkLog.service'

const mockCheckLog: CheckLog = {
  id: 'cl1',
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  completedAt: '2026-03-15',
  notes: 'All good',
  nextDueAt: '2026-03-22',
  createdAt: '2026-03-15T10:00:00Z'
}

describe('checkLog.service', () => {
  let getSpy: Mock<typeof api.get>
  let postSpy: Mock<typeof api.post>
  let deleteSpy: Mock<typeof api.delete>

  beforeEach(() => {
    getSpy = spyOn(api, 'get')
    postSpy = spyOn(api, 'post')
    deleteSpy = spyOn(api, 'delete')
  })

  afterEach(() => {
    getSpy.mockRestore()
    postSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  describe('getCheckLogs', () => {
    it('should return check logs for a vehicle', async () => {
      getSpy.mockResolvedValueOnce({ success: true, data: [mockCheckLog] })

      const result = await getCheckLogs('v1')

      expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/check-logs')
      expect(result).toEqual([mockCheckLog])
    })

    it('should return empty array when no logs exist', async () => {
      getSpy.mockResolvedValueOnce({ success: true, data: [] })

      const result = await getCheckLogs('v1')

      expect(result).toEqual([])
    })

    it('should throw on API failure', async () => {
      getSpy.mockResolvedValueOnce({ success: false, message: 'API error' })

      await expect(getCheckLogs('v1')).rejects.toThrow('API error')
    })
  })

  describe('createCheckLog', () => {
    it('should call api.post with correct endpoint and data', async () => {
      const data = { checkTypeId: 'ct1', completedAt: '2026-03-15', notes: 'OK' }

      postSpy.mockResolvedValueOnce({ success: true, data: mockCheckLog })

      const result = await createCheckLog('v1', data)

      expect(postSpy).toHaveBeenCalledWith('/vehicles/v1/check-logs', data)
      expect(result).toEqual(mockCheckLog)
    })

    it('should throw on failed creation', async () => {
      const data = { checkTypeId: 'ct1', completedAt: '2026-03-15' }

      postSpy.mockResolvedValueOnce({ success: false, message: 'Creation failed' })

      await expect(createCheckLog('v1', data)).rejects.toThrow('Creation failed')
    })
  })

  describe('deleteCheckLog', () => {
    it('should call api.delete with correct endpoint', async () => {
      deleteSpy.mockResolvedValueOnce({ success: true })

      await expect(deleteCheckLog('v1', 'cl1')).resolves.toBeUndefined()
      expect(deleteSpy).toHaveBeenCalledWith('/vehicles/v1/check-logs/cl1')
    })

    it('should throw on failed deletion', async () => {
      deleteSpy.mockResolvedValueOnce({ success: false, message: 'Deletion failed' })

      await expect(deleteCheckLog('v1', 'cl1')).rejects.toThrow('Deletion failed')
    })
  })

  describe('getCheckStatusSummary', () => {
    it('should return status summaries for a vehicle', async () => {
      const summaries: CheckStatusSummary[] = [
        {
          checkTypeId: 'ct1',
          checkTypeName: 'Vidange',
          intervalDays: 7,
          lastCompletedAt: '2026-03-15',
          nextDueAt: '2026-03-22',
          status: 'on-time'
        }
      ]

      getSpy.mockResolvedValueOnce({ success: true, data: summaries })

      const result = await getCheckStatusSummary('v1')

      expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/check-status')
      expect(result).toEqual(summaries)
    })

    it('should throw on API failure', async () => {
      getSpy.mockResolvedValueOnce({ success: false, message: 'API error' })

      await expect(getCheckStatusSummary('v1')).rejects.toThrow('API error')
    })
  })
})
