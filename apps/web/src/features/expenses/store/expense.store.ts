import { atom, computed } from 'nanostores'

import { createExpense, deleteExpense, listExpenses, updateExpense } from '../api'
import type { CreateExpenseInput, Expense, ExpenseCategory, UpdateExpenseInput } from '../types'

export const $expenses = atom<Expense[]>([])
export const $isLoading = atom<boolean>(false)
export const $error = atom<string | null>(null)
export const $categoryFilter = atom<ExpenseCategory | null>(null)

export const $hasExpenses = computed($expenses, expenses => expenses.length > 0)

export const $filteredExpenses = computed([$expenses, $categoryFilter], (expenses, filter) => {
  if (filter === null) return expenses

  return expenses.filter(expense => expense.category === filter)
})

export const $totalCents = computed($expenses, expenses =>
  expenses.reduce((sum, expense) => sum + expense.amountCents, 0)
)

export const $filteredTotalCents = computed($filteredExpenses, expenses =>
  expenses.reduce((sum, expense) => sum + expense.amountCents, 0)
)

export const $totalsByCategory = computed($expenses, expenses => {
  const init: Record<ExpenseCategory, number> = {
    SERVICE: 0,
    PARTS: 0,
    LABOR: 0,
    OTHER: 0
  }

  return expenses.reduce((totals, expense) => {
    totals[expense.category] += expense.amountCents
    return totals
  }, init)
})

export const expenseActions = {
  async fetchExpenses(vehicleId: string): Promise<Expense[] | undefined> {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await listExpenses(vehicleId)

      $expenses.set(response)

      return response
    } catch (error) {
      $expenses.set([])
      $error.set(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      $isLoading.set(false)
    }
  },

  async create(vehicleId: string, data: CreateExpenseInput): Promise<Expense> {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await createExpense(vehicleId, data)

      $expenses.set([response, ...$expenses.get()])

      return response
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Unknown error')
      throw error
    } finally {
      $isLoading.set(false)
    }
  },

  async update(vehicleId: string, id: string, data: UpdateExpenseInput): Promise<Expense> {
    $isLoading.set(true)
    $error.set(null)

    try {
      const response = await updateExpense(vehicleId, id, data)

      $expenses.set($expenses.get().map(exp => (exp.id === id ? response : exp)))

      return response
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Unknown error')
      throw error
    } finally {
      $isLoading.set(false)
    }
  },

  async remove(vehicleId: string, id: string): Promise<void> {
    $isLoading.set(true)
    $error.set(null)

    try {
      await deleteExpense(vehicleId, id)

      $expenses.set($expenses.get().filter(expense => expense.id !== id))
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Unknown error')
      throw error
    } finally {
      $isLoading.set(false)
    }
  },

  setCategoryFilter(category: ExpenseCategory | null) {
    $categoryFilter.set(category)
  },

  clearError() {
    $error.set(null)
  }
}
