import { formatEuros } from '~/shared/utils'

import type { Budget, BudgetProgressState, BudgetStatus as BudgetStatusValue } from '../types'
import { deriveAnnualTargetCents, deriveMonthlyTargetCents } from '../utils'

export interface BudgetStatusProps {
  budget: Budget
  monthlyStatus: BudgetStatusValue
  annualStatus: BudgetStatusValue
}

const STATE_MESSAGE: Record<BudgetProgressState, string> = {
  ON_TRACK: 'Dans les clous',
  NEAR_LIMIT: 'Proche de la limite',
  OVERSPENT: 'Budget dépassé'
}

const STATE_PROGRESS_CLASS: Record<BudgetProgressState, string> = {
  ON_TRACK: 'progress-success',
  NEAR_LIMIT: 'progress-warning',
  OVERSPENT: 'progress-error'
}

const STATE_TEXT_CLASS: Record<BudgetProgressState, string> = {
  ON_TRACK: 'text-success',
  NEAR_LIMIT: 'text-warning',
  OVERSPENT: 'text-error'
}

interface PanelProps {
  periodLabel: string
  status: BudgetStatusValue
}

const StatusPanel = ({ periodLabel, status }: PanelProps) => {
  const isOverspent = status.state === 'OVERSPENT'
  const remainingLabel = isOverspent ? 'Dépassement' : 'Reste'
  const remainingValue = formatEuros(Math.abs(status.remainingCents))
  const progressPercent = Math.min(status.progressRatio * 100, 100)

  return (
    <article className='card bg-base-200'>
      <div className='card-body gap-3'>
        <header>
          <h2 className='text-base-content/70 text-sm font-medium tracking-wide uppercase'>
            {periodLabel}
          </h2>
        </header>
        <dl className='flex flex-col gap-1'>
          <div className='flex items-baseline justify-between gap-2'>
            <dt className='text-base-content/70 text-sm'>Dépensé</dt>
            <dd className='text-2xl font-bold'>{formatEuros(status.spentCents)}</dd>
          </div>
          <div className='flex items-baseline justify-between gap-2'>
            <dt className='text-base-content/70 text-sm'>Budget</dt>
            <dd className='font-semibold'>{formatEuros(status.targetCents)}</dd>
          </div>
          <div className='flex items-baseline justify-between gap-2'>
            <dt className='text-base-content/70 text-sm'>{remainingLabel}</dt>
            <dd className={`font-semibold ${STATE_TEXT_CLASS[status.state]}`}>{remainingValue}</dd>
          </div>
        </dl>
        <progress
          className={`progress ${STATE_PROGRESS_CLASS[status.state]} w-full`}
          value={progressPercent}
          max={100}
          aria-label={`Progression - ${periodLabel}`}
        />
        <p className={`text-sm font-medium ${STATE_TEXT_CLASS[status.state]}`}>
          {STATE_MESSAGE[status.state]}
        </p>
      </div>
    </article>
  )
}

export const BudgetStatus = ({ budget, monthlyStatus, annualStatus }: BudgetStatusProps) => {
  const monthlyTarget = deriveMonthlyTargetCents(budget)
  const annualTarget = deriveAnnualTargetCents(budget)

  const derivationHint =
    budget.period === 'ANNUAL'
      ? `Budget de ${formatEuros(monthlyTarget)} / mois dérivé de votre budget annuel de ${formatEuros(annualTarget)}`
      : `Budget de ${formatEuros(annualTarget)} / an dérivé de votre budget mensuel de ${formatEuros(monthlyTarget)}`

  return (
    <section className='flex flex-col gap-4'>
      <div className='grid gap-4 md:grid-cols-2'>
        <StatusPanel periodLabel='Ce mois' status={monthlyStatus} />
        <StatusPanel periodLabel='Cette année' status={annualStatus} />
      </div>
      <p className='text-base-content/60 text-sm italic'>{derivationHint}</p>
    </section>
  )
}
