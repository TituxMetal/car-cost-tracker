import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'

import type { CreateExpenseInput, Expense, UpdateExpenseInput } from '../types'

import { createExpense, deleteExpense, listExpenses, updateExpense } from './expense.service'

const mockExpense: Expense = {
  id: 'e1',
  vehicleId: 'v1',
  occurredAt: '2026-03-15',
  amountCents: 8950,
  category: 'SERVICE',
  description: 'Vidange',
  createdAt: '2026-03-15T10:00:00Z',
  updatedAt: '2026-03-15T10:00:00Z'
}

describe('expense.service', () => {
  let getSpy: Mock<typeof api.get>
  let postSpy: Mock<typeof api.post>
  let patchSpy: Mock<typeof api.patch>
  let deleteSpy: Mock<typeof api.delete>

  beforeEach(() => {
    getSpy = spyOn(api, 'get')
    postSpy = spyOn(api, 'post')
    patchSpy = spyOn(api, 'patch')
    deleteSpy = spyOn(api, 'delete')
  })

  afterEach(() => {
    getSpy.mockRestore()
    postSpy.mockRestore()
    patchSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  describe('listExpenses', () => {
    it('returns expenses for a vehicle', async () => {
      getSpy.mockResolvedValueOnce({ success: true, data: [mockExpense] })

      const result = await listExpenses('v1')

      expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/expenses')
      expect(result).toEqual([mockExpense])
    })

    it('returns an empty array when no expenses exist', async () => {
      getSpy.mockResolvedValueOnce({ success: true, data: [] })

      const result = await listExpenses('v1')

      expect(result).toEqual([])
    })

    it('throws on API failure', async () => {
      getSpy.mockResolvedValueOnce({ success: false, message: 'API error' })

      await expect(listExpenses('v1')).rejects.toThrow('API error')
    })
  })

  describe('createExpense', () => {
    it('posts to the correct endpoint with the payload', async () => {
      const data: CreateExpenseInput = {
        occurredAt: '2026-03-15',
        amountCents: 8950,
        category: 'SERVICE',
        description: 'Vidange'
      }

      postSpy.mockResolvedValueOnce({ success: true, data: mockExpense })

      const result = await createExpense('v1', data)

      expect(postSpy).toHaveBeenCalledWith('/vehicles/v1/expenses', data)
      expect(result).toEqual(mockExpense)
    })

    it('throws on failed creation', async () => {
      const data: CreateExpenseInput = {
        occurredAt: '2026-03-15',
        amountCents: 8950,
        category: 'SERVICE'
      }

      postSpy.mockResolvedValueOnce({ success: false, message: 'Creation failed' })

      await expect(createExpense('v1', data)).rejects.toThrow('Creation failed')
    })
  })

  describe('updateExpense', () => {
    it('patches the correct endpoint with the partial payload', async () => {
      const data: UpdateExpenseInput = { category: 'PARTS' }

      patchSpy.mockResolvedValueOnce({ success: true, data: { ...mockExpense, category: 'PARTS' } })

      const result = await updateExpense('v1', 'e1', data)

      expect(patchSpy).toHaveBeenCalledWith('/vehicles/v1/expenses/e1', data)
      expect(result.category).toBe('PARTS')
    })

    it('throws on failed update', async () => {
      patchSpy.mockResolvedValueOnce({ success: false, message: 'Update failed' })

      await expect(updateExpense('v1', 'e1', { amountCents: 100 })).rejects.toThrow('Update failed')
    })
  })

  describe('deleteExpense', () => {
    it('calls api.delete with the correct endpoint', async () => {
      deleteSpy.mockResolvedValueOnce({ success: true })

      await expect(deleteExpense('v1', 'e1')).resolves.toBeUndefined()
      expect(deleteSpy).toHaveBeenCalledWith('/vehicles/v1/expenses/e1')
    })

    it('throws on failed deletion', async () => {
      deleteSpy.mockResolvedValueOnce({ success: false, message: 'Deletion failed' })

      await expect(deleteExpense('v1', 'e1')).rejects.toThrow('Deletion failed')
    })
  })
})
