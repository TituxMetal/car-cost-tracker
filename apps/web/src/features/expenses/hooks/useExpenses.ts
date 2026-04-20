import { useStore } from '@nanostores/react'
import { useCallback } from 'react'

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
} from '../store'
import type { CreateExpenseInput, Expense, ExpenseCategory, UpdateExpenseInput } from '../types'

export interface UseExpensesReturn {
  expenses: Expense[]
  filteredExpenses: Expense[]
  totalCents: number
  filteredTotalCents: number
  totalsByCategory: Record<ExpenseCategory, number>
  categoryFilter: ExpenseCategory | null
  isLoading: boolean
  error: string | null
  hasExpenses: boolean
  fetchExpenses: (vehicleId: string) => Promise<void>
  create: (vehicleId: string, data: CreateExpenseInput) => Promise<Expense>
  update: (vehicleId: string, id: string, data: UpdateExpenseInput) => Promise<Expense>
  remove: (vehicleId: string, id: string) => Promise<void>
  setCategoryFilter: (category: ExpenseCategory | null) => void
  clearError: () => void
}

export const useExpenses = (): UseExpensesReturn => {
  const fetchExpenses = useCallback(async (vehicleId: string) => {
    await expenseActions.fetchExpenses(vehicleId)
  }, [])

  return {
    expenses: useStore($expenses),
    filteredExpenses: useStore($filteredExpenses),
    totalCents: useStore($totalCents),
    filteredTotalCents: useStore($filteredTotalCents),
    totalsByCategory: useStore($totalsByCategory),
    categoryFilter: useStore($categoryFilter),
    isLoading: useStore($isLoading),
    error: useStore($error),
    hasExpenses: useStore($hasExpenses),
    fetchExpenses,
    create: async (vehicleId, data) => await expenseActions.create(vehicleId, data),
    update: async (vehicleId, id, data) => await expenseActions.update(vehicleId, id, data),
    remove: async (vehicleId, id) => await expenseActions.remove(vehicleId, id),
    setCategoryFilter: category => expenseActions.setCategoryFilter(category),
    clearError: () => expenseActions.clearError()
  }
}
