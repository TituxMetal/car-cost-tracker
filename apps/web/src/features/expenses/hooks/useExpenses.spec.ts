import { beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { cleanup, renderHook } from '~/test-utils'

import { $categoryFilter, $error, $expenses, $isLoading, expenseActions } from '../store'
import type { Expense } from '../types'

import { useExpenses } from './useExpenses'

const mockExpense: Expense = {
  id: 'e1',
  vehicleId: 'v1',
  occurredAt: '2026-03-15',
  amountCents: 8950,
  category: 'SERVICE',
  description: null,
  createdAt: '2026-03-15T10:00:00Z',
  updatedAt: '2026-03-15T10:00:00Z'
}

describe('useExpenses', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    $expenses.set([])
    $categoryFilter.set(null)
    $isLoading.set(false)
    $error.set(null)
  })

  describe('reactive state', () => {
    it('returns expenses from the store', () => {
      $expenses.set([mockExpense])

      const { result } = renderHook(() => useExpenses())

      expect(result.current.expenses).toEqual([mockExpense])
    })

    it('returns filteredExpenses from the store', () => {
      $expenses.set([mockExpense, { ...mockExpense, id: 'e2', category: 'PARTS' }])
      $categoryFilter.set('PARTS')

      const { result } = renderHook(() => useExpenses())

      expect(result.current.filteredExpenses).toHaveLength(1)
      expect(result.current.filteredExpenses[0].category).toBe('PARTS')
    })

    it('returns totalCents and totalsByCategory', () => {
      $expenses.set([
        mockExpense,
        { ...mockExpense, id: 'e2', amountCents: 2000, category: 'PARTS' }
      ])

      const { result } = renderHook(() => useExpenses())

      expect(result.current.totalCents).toBe(10950)
      expect(result.current.totalsByCategory.SERVICE).toBe(8950)
      expect(result.current.totalsByCategory.PARTS).toBe(2000)
    })

    it('returns categoryFilter from the store', () => {
      $categoryFilter.set('LABOR')

      const { result } = renderHook(() => useExpenses())

      expect(result.current.categoryFilter).toBe('LABOR')
    })

    it('returns isLoading, error and hasExpenses', () => {
      $expenses.set([mockExpense])
      $isLoading.set(true)
      $error.set('boom')

      const { result } = renderHook(() => useExpenses())

      expect(result.current.isLoading).toBe(true)
      expect(result.current.error).toBe('boom')
      expect(result.current.hasExpenses).toBe(true)
    })
  })

  describe('actions', () => {
    it('calls expenseActions.fetchExpenses with vehicleId', async () => {
      const spy = spyOn(expenseActions, 'fetchExpenses').mockResolvedValue(undefined)

      const { result } = renderHook(() => useExpenses())
      await result.current.fetchExpenses('v1')

      expect(spy).toHaveBeenCalledWith('v1')
      spy.mockRestore()
    })

    it('calls expenseActions.create with vehicleId and data', async () => {
      const spy = spyOn(expenseActions, 'create').mockResolvedValue(mockExpense)
      const data = {
        occurredAt: '2026-03-15',
        amountCents: 8950,
        category: 'SERVICE' as const
      }

      const { result } = renderHook(() => useExpenses())
      await result.current.create('v1', data)

      expect(spy).toHaveBeenCalledWith('v1', data)
      spy.mockRestore()
    })

    it('calls expenseActions.update with vehicleId, id and data', async () => {
      const spy = spyOn(expenseActions, 'update').mockResolvedValue(mockExpense)

      const { result } = renderHook(() => useExpenses())
      await result.current.update('v1', 'e1', { category: 'PARTS' })

      expect(spy).toHaveBeenCalledWith('v1', 'e1', { category: 'PARTS' })
      spy.mockRestore()
    })

    it('calls expenseActions.remove with vehicleId and id', async () => {
      const spy = spyOn(expenseActions, 'remove').mockResolvedValue(undefined)

      const { result } = renderHook(() => useExpenses())
      await result.current.remove('v1', 'e1')

      expect(spy).toHaveBeenCalledWith('v1', 'e1')
      spy.mockRestore()
    })

    it('calls expenseActions.setCategoryFilter with category', () => {
      const spy = spyOn(expenseActions, 'setCategoryFilter')

      const { result } = renderHook(() => useExpenses())
      result.current.setCategoryFilter('OTHER')

      expect(spy).toHaveBeenCalledWith('OTHER')
      spy.mockRestore()
    })

    it('calls expenseActions.clearError', () => {
      const spy = spyOn(expenseActions, 'clearError')

      const { result } = renderHook(() => useExpenses())
      result.current.clearError()

      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })
})
