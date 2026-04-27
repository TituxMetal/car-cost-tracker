import { X } from 'lucide-react'

import { Button } from '~/components/ui'

import type { CheckLog, CheckStatus } from '../types'

export interface CheckLogCardProps {
  checkLog: CheckLog
  onDelete: (checkLog: CheckLog) => void
}

const deriveStatus = (nextDueAtIso: string): CheckStatus => {
  const today = new Date()

  today.setHours(0, 0, 0, 0)

  const due = new Date(nextDueAtIso)

  if (Number.isNaN(due.getTime())) return 'on-time'

  due.setHours(0, 0, 0, 0)

  const days = Math.round((due.getTime() - today.getTime()) / 86_400_000)

  if (days < 0) return 'overdue'
  if (days <= 7) return 'due-soon'

  return 'on-time'
}

const dotClassByStatus: Record<CheckStatus, string> = {
  overdue: 'bg-error',
  'due-soon': 'bg-warning',
  'on-time': 'bg-success',
  never: 'bg-base-content/40'
}

const borderClassByStatus: Record<CheckStatus, string> = {
  overdue: 'border-l-error',
  'due-soon': 'border-l-warning',
  'on-time': 'border-l-success',
  never: 'border-l-base-content/30'
}

const formatDate = (iso: string) => {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return iso

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return { dayMonth: `${day}.${month}`, full: `${day}.${month}.${year}` }
}

export const CheckLogCard = ({ checkLog, onDelete }: CheckLogCardProps) => {
  const status = deriveStatus(checkLog.nextDueAt)
  const dotClass = dotClassByStatus[status]
  const borderClass = borderClassByStatus[status]
  const completed = formatDate(checkLog.completedAt)
  const next = formatDate(checkLog.nextDueAt)
  const completedFull = typeof completed === 'string' ? completed : completed.full
  const completedShort = typeof completed === 'string' ? completed : completed.dayMonth
  const nextFull = typeof next === 'string' ? next : next.full
  const nextShort = typeof next === 'string' ? next : next.dayMonth

  return (
    <article
      className={`bg-base-200 border-base-300 border border-l-2 ${borderClass} md:hover:bg-base-300/40 p-4 transition-transform hover:-translate-y-0.5 hover:shadow-lg md:grid md:translate-y-0 md:grid-cols-[80px_1fr_120px_1fr_120px_40px] md:items-center md:gap-4 md:border-t-0 md:border-r-0 md:border-b md:border-l-2 md:p-3 md:hover:translate-y-0 md:hover:shadow-none`}
    >
      <time
        dateTime={checkLog.completedAt}
        className='text-base-content/80 hidden font-mono md:block'
      >
        {completedShort}
      </time>

      <header className='flex items-center gap-2'>
        <span aria-hidden='true' className={`inline-block h-2 w-2 rounded-full ${dotClass}`} />
        <h3 className='font-display text-sm font-semibold tracking-wide'>
          {checkLog.checkTypeName}
        </h3>
      </header>

      <span className='text-base-content/60 mt-1 hidden font-mono text-sm md:mt-0 md:block'>—</span>

      <p className='text-base-content/60 mt-2 line-clamp-1 font-mono text-xs md:mt-0'>
        {checkLog.notes ?? '—'}
      </p>

      <div className='text-base-content/70 mt-2 flex flex-col font-mono text-xs md:mt-0 md:text-sm'>
        <time dateTime={checkLog.completedAt} className='md:hidden'>
          {completedFull}
        </time>
        <span className='md:hidden'>
          PROCHAIN <time dateTime={checkLog.nextDueAt}>{nextShort}</time>
        </span>
        <time dateTime={checkLog.nextDueAt} className='hidden md:inline'>
          {nextFull}
        </time>
      </div>

      <footer className='mt-2 flex justify-end md:mt-0'>
        <Button
          variant='destructive-outline'
          className='btn-square btn-xs'
          onClick={() => onDelete(checkLog)}
          aria-label={`Supprimer le contrôle ${checkLog.checkTypeName}`}
        >
          <X size={14} />
        </Button>
      </footer>
    </article>
  )
}
