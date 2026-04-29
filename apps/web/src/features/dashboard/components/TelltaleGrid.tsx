import type { CheckStatus } from '~/features/check-logs'

import type { TelltaleSummary } from '../types'

export interface TelltaleGridProps {
  summaries: TelltaleSummary[]
}

const dotClassByStatus: Record<CheckStatus, string> = {
  overdue: 'bg-error',
  'due-soon': 'bg-warning',
  never: 'bg-info',
  'on-time': 'bg-base-content/30'
}

const labelClassByStatus: Record<CheckStatus, string> = {
  overdue: 'text-error',
  'due-soon': 'text-warning',
  never: 'text-info',
  'on-time': 'text-base-content/40'
}

export const TelltaleGrid = ({ summaries }: TelltaleGridProps) => (
  <section aria-label='Voyants actifs' className='border-base-300 bg-base-200 border p-5'>
    <p className='font-display text-base-content/60 mb-3 text-[10px] tracking-wider uppercase'>
      Voyants actifs
    </p>
    {summaries.length === 0 ? (
      <p className='text-base-content/60 font-mono text-xs'>Aucun voyant actif.</p>
    ) : (
      <ul className='grid grid-cols-1 gap-2'>
        {summaries.map(summary => (
          <li
            key={summary.checkTypeId}
            className='border-base-300 bg-base-100/40 flex min-w-0 items-start gap-2 border px-3 py-2'
          >
            <span
              aria-hidden='true'
              className={`mt-1 inline-block size-2 shrink-0 rounded-full ${dotClassByStatus[summary.status]}`}
            />
            <span
              className={`font-display text-[11px] leading-tight tracking-wider break-words uppercase ${labelClassByStatus[summary.status]}`}
            >
              {summary.name}
            </span>
          </li>
        ))}
      </ul>
    )}
  </section>
)
