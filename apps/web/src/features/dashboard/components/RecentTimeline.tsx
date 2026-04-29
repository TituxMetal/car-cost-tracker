import type { CheckLog, CheckStatus } from '~/features/check-logs'

import { daysFromNow } from '../utils'

export interface RecentTimelineProps {
  logs: CheckLog[]
}

const WINDOW_DAYS = 30

const dotShellByStatus: Record<CheckStatus, string> = {
  overdue: 'border-error',
  'due-soon': 'border-warning',
  'on-time': 'border-success',
  never: 'border-info'
}

const dotInnerByStatus: Record<CheckStatus, string> = {
  overdue: 'bg-error',
  'due-soon': 'bg-warning',
  'on-time': 'bg-success',
  never: 'bg-info'
}

const deriveDueStatus = (nextDueAtIso: string | null): CheckStatus => {
  if (!nextDueAtIso) return 'never'

  const days = daysFromNow(nextDueAtIso)

  if (Number.isNaN(days)) return 'on-time'
  if (days < 0) return 'overdue'
  if (days <= 7) return 'due-soon'

  return 'on-time'
}

export const RecentTimeline = ({ logs }: RecentTimelineProps) => {
  const visibleLogs = logs
    .map(log => ({ log, daysFromCompleted: daysFromNow(log.completedAt) }))
    .filter(
      ({ daysFromCompleted }) =>
        !Number.isNaN(daysFromCompleted) &&
        daysFromCompleted >= -WINDOW_DAYS &&
        daysFromCompleted <= WINDOW_DAYS
    )

  return (
    <section
      aria-label='Timeline 30 derniers jours'
      className='border-base-300 bg-base-200 border p-5'
    >
      <p className='font-display text-base-content/60 mb-3 text-[10px] tracking-wider uppercase'>
        Timeline · 30 derniers jours
      </p>
      <div className='relative h-10'>
        <div aria-hidden='true' className='bg-base-300 absolute top-1/2 right-0 left-0 h-px' />
        {visibleLogs.map(({ log, daysFromCompleted }) => {
          const status = deriveDueStatus(log.nextDueAt)
          const shell = dotShellByStatus[status]
          const inner = dotInnerByStatus[status]
          const left = `${((WINDOW_DAYS + daysFromCompleted) / (WINDOW_DAYS * 2)) * 100}%`

          return (
            <div
              key={log.id}
              data-testid='timeline-dot'
              className={`bg-base-100 absolute top-1/2 grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 ${shell}`}
              style={{ left }}
            >
              <div className={`size-1.5 rounded-full ${inner}`} />
            </div>
          )
        })}
      </div>
      <div className='mt-2 flex justify-between font-mono text-[10px]'>
        <span className='text-base-content/60'>J-30</span>
        <span className='text-warning'>AUJ.</span>
        <span className='text-base-content/60'>J+30</span>
      </div>
    </section>
  )
}
