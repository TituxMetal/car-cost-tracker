import { useEffect } from 'react'

import type { BudgetProgressState, BudgetStatus } from '~/features/budget'
import { useBudget } from '~/features/budget'
import { formatEuros } from '~/shared/utils'

export interface BudgetPanelProps {
  vehicleId: string
}

const progressClassByState: Record<BudgetProgressState, string> = {
  ON_TRACK: 'progress-success',
  NEAR_LIMIT: 'progress-warning',
  OVERSPENT: 'progress-error'
}

const textClassByState: Record<BudgetProgressState, string> = {
  ON_TRACK: 'text-success',
  NEAR_LIMIT: 'text-warning',
  OVERSPENT: 'text-error'
}

interface BudgetSectionProps {
  kicker: string
  periodWord: string
  status: BudgetStatus
}

const BudgetSection = ({ kicker, periodWord, status }: BudgetSectionProps) => {
  const isOverspent = status.state === 'OVERSPENT'
  const remainingLabel = isOverspent ? 'Dépassement' : 'Restant'
  const remainingValue = formatEuros(Math.abs(status.remainingCents))
  const percent = Math.round(Math.min(status.progressRatio * 100, 100))

  return (
    <section aria-label={kicker}>
      <p className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
        {kicker}
      </p>
      <div className='mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1'>
        <span className='text-warning font-mono text-3xl leading-none font-semibold'>
          {formatEuros(status.spentCents)}
        </span>
        <span className='text-base-content/60 font-mono text-xs'>
          / {formatEuros(status.targetCents)}
        </span>
      </div>
      <p className={`mt-2 font-mono text-xs ${textClassByState[status.state]}`}>
        {remainingLabel} {remainingValue}
      </p>
      <progress
        className={`progress mt-3 w-full ${progressClassByState[status.state]}`}
        value={percent}
        max={100}
        aria-label={`Progression budget ${periodWord}`}
      />
      <p className='sr-only'>
        {percent}% du budget {periodWord} utilisé
      </p>
    </section>
  )
}

export const BudgetPanel = ({ vehicleId }: BudgetPanelProps) => {
  const { budget, hasBudget, monthlyStatus, annualStatus, fetchBudget } = useBudget()

  useEffect(() => {
    fetchBudget(vehicleId)
  }, [fetchBudget, vehicleId])

  if (!hasBudget || !budget) return null

  return (
    <article className='border-base-300 bg-base-200 border p-5'>
      <header className='mb-3 flex items-baseline justify-between gap-3'>
        <p className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
          Budget
        </p>
        <a
          href='/budget'
          className='font-display text-warning hover:text-warning/80 text-[10px] tracking-[0.2em] uppercase transition-colors'
        >
          Modifier →
        </a>
      </header>
      <div className='flex flex-col gap-5'>
        <BudgetSection kicker='Mensuel' periodWord='mensuel' status={monthlyStatus} />
        <div className='border-base-300/60 border-t' aria-hidden='true' />
        <BudgetSection kicker='Annuel' periodWord='annuel' status={annualStatus} />
      </div>
    </article>
  )
}
