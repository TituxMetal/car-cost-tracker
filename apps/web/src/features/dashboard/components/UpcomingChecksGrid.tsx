import { Gauge } from '~/components/ui'
import type { CheckStatus, CheckStatusSummary } from '~/features/check-logs'

import { daysFromNow } from '../utils'

export interface UpcomingChecksGridProps {
  summaries: CheckStatusSummary[]
  onLog: () => void
}

const subLabelColourByStatus: Record<CheckStatus, string> = {
  overdue: 'text-error',
  'due-soon': 'text-warning',
  'on-time': 'text-success',
  never: 'text-info'
}

const buildSubLabel = (status: CheckStatus, daysRemaining: number): string => {
  if (status === 'never') return 'JAMAIS'
  if (daysRemaining < 0) return `+${Math.abs(daysRemaining)}j`

  return `J-${daysRemaining}`
}

export const UpcomingChecksGrid = ({ summaries, onLog }: UpcomingChecksGridProps) => (
  <section aria-label='Prochains contrôles' className='border-base-300 bg-base-200 border p-7'>
    <header className='mb-6 flex items-baseline justify-between'>
      <p className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
        Prochains contrôles{' '}
        <span className='text-base-content/40'>// {summaries.length} types</span>
      </p>
      <button
        type='button'
        onClick={onLog}
        className='font-display text-warning hover:text-warning/80 cursor-pointer text-[10px] tracking-[0.2em] uppercase transition-colors'
      >
        Journaliser →
      </button>
    </header>
    {summaries.length === 0 ? null : (
      <ul className='grid grid-cols-2 gap-4 gap-y-7 md:grid-cols-3 lg:grid-cols-4'>
        {summaries.map(summary => {
          const rawDays = summary.nextDueAt ? daysFromNow(summary.nextDueAt) : 0
          const daysRemaining = summary.status === 'never' ? 0 : rawDays
          const value = summary.status === 'never' ? 0 : Math.max(0, daysRemaining)
          const subLabel = buildSubLabel(summary.status, daysRemaining)
          const subColour = subLabelColourByStatus[summary.status]

          return (
            <li key={summary.checkTypeId} className='flex flex-col items-center text-center'>
              <Gauge
                size={130}
                value={value}
                max={summary.intervalDays}
                status={summary.status}
                label={summary.checkTypeName}
                centerLabel={
                  <span className='flex items-baseline gap-1'>
                    <span>{value}</span>
                    <span className='text-base-content/60 text-[10px] tracking-wider uppercase'>
                      /{summary.intervalDays} jrs
                    </span>
                  </span>
                }
              />
              <p className={`mt-1 font-mono text-[11px] ${subColour}`}>{subLabel}</p>
            </li>
          )
        })}
      </ul>
    )}
  </section>
)
