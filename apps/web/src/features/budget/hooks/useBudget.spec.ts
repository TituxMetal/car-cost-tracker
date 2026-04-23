import { beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { $expenses } from '~/features/expenses/store'
import { cleanup, renderHook } from '~/test-utils'

import { $budget, $error, $isLoading, budgetActions } from '../store'
import type { Budget } from '../types'

import { useBudget } from './useBudget'

const mockBudget: Budget = {
  id: 'b1',
  vehicleId: 'v1',
  amountCents: 25000,
  period: 'MONTHLY',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z'
}

describe('useBudget', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    $budget.set(null)
    $isLoading.set(false)
    $error.set(null)
    $expenses.set([])
  })

  describe('reactive state', () => {
    it('returns budget from the store', () => {
      $budget.set(mockBudget)

      const { result } = renderHook(() => useBudget())

      expect(result.current.budget).toEqual(mockBudget)
    })

    it('returns hasBudget derived from $budget', () => {
      $budget.set(mockBudget)

      const { result } = renderHook(() => useBudget())

      expect(result.current.hasBudget).toBe(true)
    })

    it('returns isLoading and error from the store', () => {
      $isLoading.set(true)
      $error.set('boom')

      const { result } = renderHook(() => useBudget())

      expect(result.current.isLoading).toBe(true)
      expect(result.current.error).toBe('boom')
    })

    it('returns monthlyStatus and annualStatus with a shape matching BudgetStatus', () => {
      $budget.set(mockBudget)

      const { result } = renderHook(() => useBudget())

      expect(result.current.monthlyStatus).toMatchObject({
        spentCents: expect.any(Number),
        targetCents: expect.any(Number),
        remainingCents: expect.any(Number),
        progressRatio: expect.any(Number),
        state: expect.any(String)
      })
      expect(result.current.annualStatus).toMatchObject({
        spentCents: expect.any(Number),
        targetCents: expect.any(Number),
        remainingCents: expect.any(Number),
        progressRatio: expect.any(Number),
        state: expect.any(String)
      })
    })
  })

  describe('actions', () => {
    it('keeps fetchBudget stable across renders (useCallback)', () => {
      const { result, rerender } = renderHook(() => useBudget())

      const firstFetch = result.current.fetchBudget
      rerender()

      expect(result.current.fetchBudget).toBe(firstFetch)
    })

    it('calls budgetActions.fetchBudget with vehicleId', async () => {
      const spy = spyOn(budgetActions, 'fetchBudget').mockResolvedValue(null)

      const { result } = renderHook(() => useBudget())
      await result.current.fetchBudget('v1')

      expect(spy).toHaveBeenCalledWith('v1')
      spy.mockRestore()
    })

    it('calls budgetActions.upsertBudget with vehicleId and input', async () => {
      const spy = spyOn(budgetActions, 'upsertBudget').mockResolvedValue(mockBudget)

      const { result } = renderHook(() => useBudget())
      await result.current.upsertBudget('v1', { amountCents: 25000, period: 'MONTHLY' })

      expect(spy).toHaveBeenCalledWith('v1', { amountCents: 25000, period: 'MONTHLY' })
      spy.mockRestore()
    })

    it('calls budgetActions.deleteBudget with vehicleId', async () => {
      const spy = spyOn(budgetActions, 'deleteBudget').mockResolvedValue(undefined)

      const { result } = renderHook(() => useBudget())
      await result.current.deleteBudget('v1')

      expect(spy).toHaveBeenCalledWith('v1')
      spy.mockRestore()
    })

    it('calls budgetActions.clearError', () => {
      const spy = spyOn(budgetActions, 'clearError')

      const { result } = renderHook(() => useBudget())
      result.current.clearError()

      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })
})
