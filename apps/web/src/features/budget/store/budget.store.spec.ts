import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, setSystemTime, spyOn } from 'bun:test'

import { $expenses } from '~/features/expenses/store'
import type { Expense } from '~/features/expenses/types'
import { api } from '~/lib/apiRequest'

import type { Budget } from '../types'

import {
  $annualStatus,
  $annualTargetCents,
  $budget,
  $error,
  $hasBudget,
  $isLoading,
  $monthlyStatus,
  $monthlyTargetCents,
  budgetActions
} from './budget.store'

const mockBudget = (overrides: Partial<Budget> = {}): Budget => ({
  id: 'b1',
  vehicleId: 'v1',
  amountCents: 25000,
  period: 'MONTHLY',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides
})

const mockExpense = (overrides: Partial<Expense> = {}): Expense => ({
  id: 'e1',
  vehicleId: 'v1',
  occurredAt: '2026-04-15',
  amountCents: 5000,
  category: 'SERVICE',
  description: null,
  createdAt: '2026-04-15T10:00:00Z',
  updatedAt: '2026-04-15T10:00:00Z',
  ...overrides
})

describe('Budget Store', () => {
  let getSpy: Mock<typeof api.get>
  let putSpy: Mock<typeof api.put>
  let deleteSpy: Mock<typeof api.delete>

  beforeEach(() => {
    getSpy = spyOn(api, 'get')
    putSpy = spyOn(api, 'put')
    deleteSpy = spyOn(api, 'delete')

    $budget.set(null)
    $isLoading.set(false)
    $error.set(null)
    $expenses.set([])
  })

  afterEach(() => {
    getSpy.mockRestore()
    putSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  describe('state atoms', () => {
    it('initializes $budget to null', () => {
      expect($budget.get()).toBeNull()
    })

    it('initializes $isLoading to false', () => {
      expect($isLoading.get()).toBe(false)
    })

    it('initializes $error to null', () => {
      expect($error.get()).toBeNull()
    })
  })

  describe('$hasBudget', () => {
    it('is false when $budget is null', () => {
      expect($hasBudget.get()).toBe(false)
    })

    it('is true when $budget holds a value', () => {
      $budget.set(mockBudget())

      expect($hasBudget.get()).toBe(true)
    })
  })

  describe('$monthlyTargetCents', () => {
    it('is 0 when $budget is null', () => {
      expect($monthlyTargetCents.get()).toBe(0)
    })

    it('returns amountCents as-is for a MONTHLY budget', () => {
      $budget.set(mockBudget({ period: 'MONTHLY', amountCents: 25000 }))

      expect($monthlyTargetCents.get()).toBe(25000)
    })

    it('divides by 12 for an ANNUAL budget', () => {
      $budget.set(mockBudget({ period: 'ANNUAL', amountCents: 120000 }))

      expect($monthlyTargetCents.get()).toBe(10000)
    })
  })

  describe('$annualTargetCents', () => {
    it('is 0 when $budget is null', () => {
      expect($annualTargetCents.get()).toBe(0)
    })

    it('returns amountCents as-is for an ANNUAL budget', () => {
      $budget.set(mockBudget({ period: 'ANNUAL', amountCents: 120000 }))

      expect($annualTargetCents.get()).toBe(120000)
    })

    it('multiplies by 12 for a MONTHLY budget', () => {
      $budget.set(mockBudget({ period: 'MONTHLY', amountCents: 10000 }))

      expect($annualTargetCents.get()).toBe(120000)
    })
  })

  describe('$monthlyStatus', () => {
    beforeEach(() => {
      setSystemTime(new Date('2026-04-15T12:00:00'))
    })

    afterEach(() => {
      setSystemTime()
    })

    it('integrates $spentThisMonthCents against the monthly target', () => {
      $budget.set(mockBudget({ period: 'MONTHLY', amountCents: 10000 }))
      $expenses.set([
        mockExpense({ occurredAt: '2026-04-01', amountCents: 3000 }),
        mockExpense({ occurredAt: '2026-04-10', amountCents: 5000 }),
        mockExpense({ occurredAt: '2026-03-01', amountCents: 9999 })
      ])

      const status = $monthlyStatus.get()

      expect(status.spentCents).toBe(8000)
      expect(status.targetCents).toBe(10000)
      expect(status.remainingCents).toBe(2000)
      expect(status.state).toBe('NEAR_LIMIT')
    })

    it('returns ON_TRACK with zero target when no budget is set', () => {
      $expenses.set([mockExpense({ occurredAt: '2026-04-10', amountCents: 5000 })])

      const status = $monthlyStatus.get()

      expect(status.targetCents).toBe(0)
      expect(status.state).toBe('ON_TRACK')
    })
  })

  describe('$annualStatus', () => {
    beforeEach(() => {
      setSystemTime(new Date('2026-04-15T12:00:00'))
    })

    afterEach(() => {
      setSystemTime()
    })

    it('integrates $spentThisYearCents against the annual target', () => {
      $budget.set(mockBudget({ period: 'ANNUAL', amountCents: 120000 }))
      $expenses.set([
        mockExpense({ occurredAt: '2026-04-10', amountCents: 30000 }),
        mockExpense({ occurredAt: '2026-02-01', amountCents: 20000 }),
        mockExpense({ occurredAt: '2025-12-01', amountCents: 99999 })
      ])

      const status = $annualStatus.get()

      expect(status.spentCents).toBe(50000)
      expect(status.targetCents).toBe(120000)
      expect(status.state).toBe('ON_TRACK')
    })
  })

  describe('budgetActions.fetchBudget', () => {
    it('populates $budget on success', async () => {
      const budget = mockBudget()
      getSpy.mockResolvedValueOnce({ success: true, data: budget, status: 200 })

      const result = await budgetActions.fetchBudget('v1')

      expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/budget')
      expect($budget.get()).toEqual(budget)
      expect(result).toEqual(budget)
      expect($error.get()).toBeNull()
    })

    it('leaves $budget null and $error null when API returns 404', async () => {
      getSpy.mockResolvedValueOnce({
        success: false,
        message: 'Budget not found',
        status: 404
      })

      const result = await budgetActions.fetchBudget('v1')

      expect(result).toBeNull()
      expect($budget.get()).toBeNull()
      expect($error.get()).toBeNull()
    })

    it('sets $error on non-404 failure', async () => {
      getSpy.mockResolvedValueOnce({ success: false, message: 'Server error', status: 500 })

      const result = await budgetActions.fetchBudget('v1')

      expect(result).toBeNull()
      expect($error.get()).toBe('Server error')
    })
  })

  describe('budgetActions.upsertBudget', () => {
    it('sets $budget with the returned DTO', async () => {
      const budget = mockBudget({ amountCents: 40000 })
      putSpy.mockResolvedValueOnce({ success: true, data: budget, status: 200 })

      const result = await budgetActions.upsertBudget('v1', {
        amountCents: 40000,
        period: 'MONTHLY'
      })

      expect(putSpy).toHaveBeenCalledWith('/vehicles/v1/budget', {
        amountCents: 40000,
        period: 'MONTHLY'
      })
      expect($budget.get()).toEqual(budget)
      expect(result).toEqual(budget)
    })

    it('rethrows on failure and sets $error', async () => {
      putSpy.mockResolvedValueOnce({ success: false, message: 'Validation failed', status: 400 })

      await expect(
        budgetActions.upsertBudget('v1', { amountCents: 40000, period: 'MONTHLY' })
      ).rejects.toThrow('Validation failed')

      expect($error.get()).toBe('Validation failed')
    })
  })

  describe('budgetActions.deleteBudget', () => {
    it('resets $budget to null on success', async () => {
      $budget.set(mockBudget())
      deleteSpy.mockResolvedValueOnce({ success: true, status: 204 })

      await budgetActions.deleteBudget('v1')

      expect(deleteSpy).toHaveBeenCalledWith('/vehicles/v1/budget')
      expect($budget.get()).toBeNull()
    })

    it('rethrows on failure and sets $error', async () => {
      deleteSpy.mockResolvedValueOnce({ success: false, message: 'Deletion failed', status: 400 })

      await expect(budgetActions.deleteBudget('v1')).rejects.toThrow('Deletion failed')

      expect($error.get()).toBe('Deletion failed')
    })
  })

  describe('budgetActions.clearError', () => {
    it('resets $error to null', () => {
      $error.set('boom')

      budgetActions.clearError()

      expect($error.get()).toBeNull()
    })
  })
})
