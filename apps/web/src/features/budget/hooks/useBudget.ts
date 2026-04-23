import { useStore } from '@nanostores/react'
import { useCallback } from 'react'

import {
  $annualStatus,
  $budget,
  $error,
  $hasBudget,
  $isLoading,
  $monthlyStatus,
  budgetActions
} from '../store'
import type { Budget, BudgetStatus, UpsertBudgetInput } from '../types'

export interface UseBudgetReturn {
  budget: Budget | null
  hasBudget: boolean
  isLoading: boolean
  error: string | null
  monthlyStatus: BudgetStatus
  annualStatus: BudgetStatus
  fetchBudget: (vehicleId: string) => Promise<void>
  upsertBudget: (vehicleId: string, input: UpsertBudgetInput) => Promise<Budget>
  deleteBudget: (vehicleId: string) => Promise<void>
  clearError: () => void
}

export const useBudget = (): UseBudgetReturn => {
  const fetchBudget = useCallback(async (vehicleId: string) => {
    await budgetActions.fetchBudget(vehicleId)
  }, [])

  return {
    budget: useStore($budget),
    hasBudget: useStore($hasBudget),
    isLoading: useStore($isLoading),
    error: useStore($error),
    monthlyStatus: useStore($monthlyStatus),
    annualStatus: useStore($annualStatus),
    fetchBudget,
    upsertBudget: async (vehicleId, input) => await budgetActions.upsertBudget(vehicleId, input),
    deleteBudget: async vehicleId => await budgetActions.deleteBudget(vehicleId),
    clearError: () => budgetActions.clearError()
  }
}
