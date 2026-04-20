import type { Mock } from 'bun:test'
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { api } from '~/lib/apiRequest'
import { cleanup } from '~/test-utils'

import type { Expense } from '../types'

import {
  $categoryFilter,
  $error,
  $expenses,
  $filteredExpenses,
  $filteredTotalCents,
  $hasExpenses,
  $isLoading,
  $totalCents,
  $totalsByCategory,
  expenseActions
} from './expense.store'

const mockExpense = (overrides: Partial<Expense> = {}): Expense => ({
  id: 'e1',
  vehicleId: 'v1',
  occurredAt: '2026-03-15',
  amountCents: 8950,
  category: 'SERVICE',
  description: null,
  createdAt: '2026-03-15T10:00:00Z',
  updatedAt: '2026-03-15T10:00:00Z',
  ...overrides
})

let getSpy: Mock<typeof api.get>
let postSpy: Mock<typeof api.post>
let patchSpy: Mock<typeof api.patch>
let deleteSpy: Mock<typeof api.delete>

describe('Expense Store', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''

    getSpy = spyOn(api, 'get')
    postSpy = spyOn(api, 'post')
    patchSpy = spyOn(api, 'patch')
    deleteSpy = spyOn(api, 'delete')

    $expenses.set([])
    $categoryFilter.set(null)
    $isLoading.set(false)
    $error.set(null)
  })

  afterEach(() => {
    getSpy.mockRestore()
    postSpy.mockRestore()
    patchSpy.mockRestore()
    deleteSpy.mockRestore()
  })

  describe('State atoms', () => {
    it('initializes $expenses to an empty array', () => {
      expect($expenses.get()).toEqual([])
    })

    it('initializes $isLoading to false', () => {
      expect($isLoading.get()).toBe(false)
    })

    it('initializes $error to null', () => {
      expect($error.get()).toBeNull()
    })

    it('initializes $categoryFilter to null', () => {
      expect($categoryFilter.get()).toBeNull()
    })
  })

  describe('$hasExpenses', () => {
    it('is false when the list is empty', () => {
      expect($hasExpenses.get()).toBe(false)
    })

    it('is true when at least one expense exists', () => {
      $expenses.set([mockExpense()])

      expect($hasExpenses.get()).toBe(true)
    })
  })

  describe('$filteredExpenses', () => {
    it('returns all expenses when $categoryFilter is null', () => {
      $expenses.set([mockExpense(), mockExpense({ category: 'PARTS' })])

      $categoryFilter.set(null)

      expect($filteredExpenses.get()).toEqual($expenses.get())
    })

    it('returns only expenses matching the active filter', () => {
      $expenses.set([mockExpense(), mockExpense({ category: 'PARTS' })])

      $categoryFilter.set('PARTS')

      expect($filteredExpenses.get()).toEqual([$expenses.get()[1]])
    })

    it('returns an empty array when the filter matches no expense', () => {
      $expenses.set([mockExpense(), mockExpense({ category: 'PARTS' })])

      $categoryFilter.set('LABOR')

      expect($filteredExpenses.get()).toEqual([])
    })
  })

  describe('$totalCents', () => {
    it('is zero with no expenses', () => {
      expect($totalCents.get()).toBe(0)
    })

    it('sums amountCents across all expenses', () => {
      $expenses.set([
        mockExpense(),
        mockExpense({ amountCents: 12000 }),
        mockExpense({ amountCents: 500 })
      ])

      expect($totalCents.get()).toBe(8950 + 12000 + 500)
    })

    it('ignores $categoryFilter (total is always lifetime)', () => {
      $expenses.set([
        mockExpense(),
        mockExpense({ amountCents: 12000 }),
        mockExpense({ amountCents: 500 })
      ])
      $categoryFilter.set('PARTS')

      expect($totalCents.get()).toBe(8950 + 12000 + 500)
    })
  })

  describe('$filteredTotalCents', () => {
    it('is zero with no expenses', () => {
      expect($filteredTotalCents.get()).toBe(0)
    })

    it('equals $totalCents when no filter is active', () => {
      $expenses.set([
        mockExpense(),
        mockExpense({ amountCents: 12000 }),
        mockExpense({ amountCents: 500 })
      ])
      $categoryFilter.set(null)

      expect($filteredTotalCents.get()).toBe($totalCents.get())
    })

    it('sums only expenses matching the active filter', () => {
      $expenses.set([
        mockExpense(),
        mockExpense({ category: 'PARTS', amountCents: 12000 }),
        mockExpense({ category: 'LABOR', amountCents: 500 })
      ])
      $categoryFilter.set('PARTS')

      expect($filteredTotalCents.get()).toBe(12000)
    })
  })

  describe('$totalsByCategory', () => {
    it('returns zero for all four categories when empty', () => {
      expect($totalsByCategory.get()).toEqual({
        SERVICE: 0,
        PARTS: 0,
        LABOR: 0,
        OTHER: 0
      })
    })

    it('sums amountCents per category', () => {
      $expenses.set([
        mockExpense(),
        mockExpense({ category: 'PARTS', amountCents: 12000 }),
        mockExpense({ category: 'LABOR', amountCents: 0 }),
        mockExpense({ category: 'OTHER', amountCents: 500 })
      ])

      expect($totalsByCategory.get()).toEqual({
        SERVICE: 8950,
        PARTS: 12000,
        LABOR: 0,
        OTHER: 500
      })
    })

    it('ignores $categoryFilter (breakdown is always lifetime)', () => {
      $expenses.set([
        mockExpense(),
        mockExpense({ category: 'PARTS', amountCents: 12000 }),
        mockExpense({ category: 'LABOR', amountCents: 0 }),
        mockExpense({ category: 'OTHER', amountCents: 500 })
      ])
      $categoryFilter.set('PARTS')

      expect($totalsByCategory.get()).toEqual({
        SERVICE: 8950,
        PARTS: 12000,
        LABOR: 0,
        OTHER: 500
      })
    })
  })

  describe('expenseActions.fetchExpenses', () => {
    it('populates $expenses on success', async () => {
      const mockData = [mockExpense(), mockExpense({ id: 'e2' })]

      getSpy.mockResolvedValueOnce({
        success: true,
        data: mockData
      })

      const response = await expenseActions.fetchExpenses('v1')

      expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/expenses')
      expect($expenses.get()).toEqual(mockData)
      expect(response).toEqual(mockData)
    })

    it('sets $error on failure and empties $expenses', async () => {
      getSpy.mockResolvedValueOnce({
        success: false,
        message: 'Failed to fetch'
      })

      const response = await expenseActions.fetchExpenses('v1')

      expect(getSpy).toHaveBeenCalledWith('/vehicles/v1/expenses')
      expect($expenses.get()).toEqual([])
      expect($error.get()).toBe('Failed to fetch')
      expect(response).toBeUndefined()
    })
  })

  describe('expenseActions.create', () => {
    it('prepends the new expense to the list', async () => {
      const existingExpense = mockExpense({ id: 'e0' })
      $expenses.set([existingExpense])

      const newExpense = mockExpense({ id: 'e1' })

      postSpy.mockResolvedValueOnce({ success: true, data: newExpense })

      const response = await expenseActions.create('v1', {
        occurredAt: '2026-03-16',
        amountCents: 5000,
        category: 'PARTS',
        description: 'Brake pads'
      })

      expect(postSpy).toHaveBeenCalledWith('/vehicles/v1/expenses', {
        occurredAt: '2026-03-16',
        amountCents: 5000,
        category: 'PARTS',
        description: 'Brake pads'
      })
      expect($expenses.get()).toEqual([newExpense, existingExpense])
      expect(response).toEqual(newExpense)
    })

    it('throws on API failure and sets $error', async () => {
      postSpy.mockResolvedValueOnce({
        success: false,
        message: 'Failed to create'
      })

      try {
        await expenseActions.create('v1', {
          occurredAt: '2026-03-16',
          amountCents: 5000,
          category: 'PARTS',
          description: 'Brake pads'
        })
        // If no error is thrown, fail the test
        expect(true).toBe(false)
      } catch (error) {
        expect(postSpy).toHaveBeenCalledWith('/vehicles/v1/expenses', {
          occurredAt: '2026-03-16',
          amountCents: 5000,
          category: 'PARTS',
          description: 'Brake pads'
        })
        expect($error.get()).toBe('Failed to create')
      }
    })
  })

  describe('expenseActions.update', () => {
    it('replaces the matching expense in the list', async () => {
      const existingExpense = mockExpense()
      $expenses.set([existingExpense])

      const updatedExpense = { ...existingExpense, amountCents: 10000 }

      patchSpy.mockResolvedValueOnce({
        success: true,
        data: updatedExpense
      })

      const response = await expenseActions.update('v1', existingExpense.id, {
        amountCents: 10000
      })

      expect(patchSpy).toHaveBeenCalledWith(`/vehicles/v1/expenses/${existingExpense.id}`, {
        amountCents: 10000
      })
      expect($expenses.get()).toEqual([updatedExpense])
      expect(response).toEqual(updatedExpense)
    })

    it('throws on API failure and sets $error', async () => {
      const existingExpense = mockExpense()
      $expenses.set([existingExpense])

      patchSpy.mockResolvedValueOnce({
        success: false,
        message: 'Failed to update'
      })

      try {
        await expenseActions.update('v1', existingExpense.id, {
          amountCents: 10000
        })
        // If no error is thrown, fail the test
        expect(true).toBe(false)
      } catch (error) {
        expect(patchSpy).toHaveBeenCalledWith(`/vehicles/v1/expenses/${existingExpense.id}`, {
          amountCents: 10000
        })
        expect($error.get()).toBe('Failed to update')
      }
    })
  })

  describe('expenseActions.remove', () => {
    it('removes the expense from the list', async () => {
      const expense1 = mockExpense()
      const expense2 = mockExpense({ id: 'e2' })
      $expenses.set([expense1, expense2])

      deleteSpy.mockResolvedValueOnce({
        success: true
      })

      await expenseActions.remove('v1', expense1.id)

      expect(deleteSpy).toHaveBeenCalledWith(`/vehicles/v1/expenses/${expense1.id}`)
      expect($expenses.get()).toEqual([expense2])
    })

    it('throws on API failure and sets $error', async () => {
      const expense1 = mockExpense()
      $expenses.set([expense1])

      deleteSpy.mockResolvedValueOnce({
        success: false,
        message: 'Failed to delete'
      })

      try {
        await expenseActions.remove('v1', expense1.id)
        // If no error is thrown, fail the test
        expect(true).toBe(false)
      } catch (error) {
        expect(deleteSpy).toHaveBeenCalledWith(`/vehicles/v1/expenses/${expense1.id}`)
        expect($error.get()).toBe('Failed to delete')
      }
    })
  })

  describe('expenseActions.setCategoryFilter', () => {
    it('updates $categoryFilter', () => {
      expenseActions.setCategoryFilter('PARTS')

      expect($categoryFilter.get()).toBe('PARTS')
    })

    it('accepts null to clear the filter', () => {
      $categoryFilter.set('SERVICE')

      expenseActions.setCategoryFilter(null)

      expect($categoryFilter.get()).toBeNull()
    })
  })

  describe('expenseActions.clearError', () => {
    it('resets $error to null', () => {
      $error.set('boom')

      expenseActions.clearError()

      expect($error.get()).toBeNull()
    })
  })
})
