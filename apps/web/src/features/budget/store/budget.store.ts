import { atom, computed } from 'nanostores'

import { $spentThisMonthCents, $spentThisYearCents } from '~/features/expenses/store'

import { deleteBudget, getBudget, upsertBudget } from '../api'
import type { Budget, UpsertBudgetInput } from '../types'
import { computeBudgetStatus, deriveAnnualTargetCents, deriveMonthlyTargetCents } from '../utils'

export const $budget = atom<Budget | null>(null)
export const $isLoading = atom<boolean>(false)
export const $error = atom<string | null>(null)

export const $hasBudget = computed($budget, budget => budget !== null)

export const $monthlyTargetCents = computed($budget, budget =>
  budget ? deriveMonthlyTargetCents(budget) : 0
)

export const $annualTargetCents = computed($budget, budget =>
  budget ? deriveAnnualTargetCents(budget) : 0
)

export const $monthlyStatus = computed(
  [$monthlyTargetCents, $spentThisMonthCents],
  (target, spent) => computeBudgetStatus(spent, target)
)

export const $annualStatus = computed([$annualTargetCents, $spentThisYearCents], (target, spent) =>
  computeBudgetStatus(spent, target)
)

export const budgetActions = {
  async fetchBudget(vehicleId: string): Promise<Budget | null> {
    $isLoading.set(true)
    $error.set(null)

    try {
      const budget = await getBudget(vehicleId)
      $budget.set(budget)
      return budget
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Erreur inconnue')
      return null
    } finally {
      $isLoading.set(false)
    }
  },

  async upsertBudget(vehicleId: string, input: UpsertBudgetInput): Promise<Budget> {
    $isLoading.set(true)
    $error.set(null)

    try {
      const budget = await upsertBudget(vehicleId, input)
      $budget.set(budget)
      return budget
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Erreur inconnue')
      throw error
    } finally {
      $isLoading.set(false)
    }
  },

  async deleteBudget(vehicleId: string): Promise<void> {
    $isLoading.set(true)
    $error.set(null)

    try {
      await deleteBudget(vehicleId)
      $budget.set(null)
    } catch (error) {
      $error.set(error instanceof Error ? error.message : 'Erreur inconnue')
      throw error
    } finally {
      $isLoading.set(false)
    }
  },

  clearError(): void {
    $error.set(null)
  }
}
