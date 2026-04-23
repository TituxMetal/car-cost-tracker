import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'

import type { Budget, UpsertBudgetInput } from '../types'

import { deleteBudget, getBudget, upsertBudget } from './budget.service'

const mockBudget: Budget = {
  id: 'b1',
  vehicleId: 'v1',
  amountCents: 25000,
  period: 'MONTHLY',
  createdAt: '2026-03-15T10:00:00Z',
  updatedAt: '2026-03-15T10:00:00Z'
}

describe('budget.service', () => {
  let getSpy: Mock<typeof api.get>
  let putSpy: Mock<typeof api.put>
  let deleteSpy: Mock<typeof api.delete>

  beforeEach(() => {
    getSpy = spyOn(api, 'get')
    putSpy = spyOn(api, 'put')
    deleteSpy = spyOn(api, 'delete')
  })

  afterEach(() => {
    getSpy.mockRestore()
    putSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  describe('getBudget', () => {
    it('returns the budget for a vehicle', async () => {
      getSpy.mockResolvedValueOnce({ success: true, data: mockBudget, status: 200 })

      const result = await getBudget('v1')

      expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/budget')
      expect(result).toEqual(mockBudget)
    })

    it('returns null when the server replies with 404', async () => {
      getSpy.mockResolvedValueOnce({
        success: false,
        message: 'Budget not found',
        status: 404
      })

      const result = await getBudget('v1')

      expect(result).toBeNull()
    })

    it('returns null when the server replies with 500 "Internal server error" (backend backlog workaround)', async () => {
      const warnSpy = spyOn(console, 'warn').mockImplementation(() => {})

      try {
        getSpy.mockResolvedValueOnce({
          success: false,
          message: 'Internal server error',
          status: 500
        })

        const result = await getBudget('v1')

        expect(result).toBeNull()
        expect(warnSpy).toHaveBeenCalled()
      } finally {
        warnSpy.mockRestore()
      }
    })

    it('throws on non-404, non-generic-500 API failure', async () => {
      getSpy.mockResolvedValueOnce({ success: false, message: 'Database down', status: 500 })

      await expect(getBudget('v1')).rejects.toThrow('Database down')
    })
  })

  describe('upsertBudget', () => {
    it('puts to the correct endpoint with the payload', async () => {
      const data: UpsertBudgetInput = { amountCents: 25000, period: 'MONTHLY' }

      putSpy.mockResolvedValueOnce({ success: true, data: mockBudget, status: 200 })

      const result = await upsertBudget('v1', data)

      expect(putSpy).toHaveBeenCalledWith('/vehicles/v1/budget', data)
      expect(result).toEqual(mockBudget)
    })

    it('throws on failed upsert', async () => {
      const data: UpsertBudgetInput = { amountCents: 25000, period: 'ANNUAL' }

      putSpy.mockResolvedValueOnce({ success: false, message: 'Upsert failed', status: 400 })

      await expect(upsertBudget('v1', data)).rejects.toThrow('Upsert failed')
    })
  })

  describe('deleteBudget', () => {
    it('calls api.delete with the correct endpoint', async () => {
      deleteSpy.mockResolvedValueOnce({ success: true, status: 204 })

      await expect(deleteBudget('v1')).resolves.toBeUndefined()
      expect(deleteSpy).toHaveBeenCalledWith('/vehicles/v1/budget')
    })

    it('throws on failed deletion', async () => {
      deleteSpy.mockResolvedValueOnce({
        success: false,
        message: 'Deletion failed',
        status: 400
      })

      await expect(deleteBudget('v1')).rejects.toThrow('Deletion failed')
    })
  })
})
