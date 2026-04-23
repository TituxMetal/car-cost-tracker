import type { Budget, BudgetProgressState, BudgetStatus } from '../types'

export const NEAR_LIMIT_THRESHOLD = 0.8
export const OVERSPENT_THRESHOLD = 1.0

export const deriveMonthlyTargetCents = (budget: Budget): number => {
  if (budget.period === 'MONTHLY') return budget.amountCents

  return Math.round(budget.amountCents / 12)
}

export const deriveAnnualTargetCents = (budget: Budget): number => {
  if (budget.period === 'MONTHLY') return budget.amountCents * 12

  return budget.amountCents
}

export const computeProgressState = (
  spentCents: number,
  targetCents: number
): BudgetProgressState => {
  if (targetCents <= 0) return 'ON_TRACK'

  const ratio = spentCents / targetCents

  if (ratio >= OVERSPENT_THRESHOLD) return 'OVERSPENT'
  if (ratio >= NEAR_LIMIT_THRESHOLD) return 'NEAR_LIMIT'

  return 'ON_TRACK'
}

export const computeBudgetStatus = (spentCents: number, targetCents: number): BudgetStatus => {
  const remainingCents = targetCents - spentCents
  const progressRatio = targetCents > 0 ? spentCents / targetCents : 0
  const state = computeProgressState(spentCents, targetCents)

  return {
    spentCents,
    targetCents,
    remainingCents,
    progressRatio,
    state
  }
}
