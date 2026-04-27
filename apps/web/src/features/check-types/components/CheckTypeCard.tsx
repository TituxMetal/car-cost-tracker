import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '~/components/ui'
import { CheckStatusBadge } from '~/features/check-logs/components/CheckStatusBadge'
import type { CheckStatus } from '~/features/check-logs/types'

import type { CheckType } from '../types'

export interface CheckTypeCardProps {
  checkType: CheckType
  onEdit: (checkType: CheckType) => void
  onDelete: (checkType: CheckType) => void
  status?: CheckStatus
  lastCompletedAt?: string | null
  nextDueAt?: string | null
  onLog?: (checkType: CheckType) => void
}

const borderByStatus: Record<CheckStatus | 'unknown', string> = {
  overdue: 'border-l-error',
  'due-soon': 'border-l-warning',
  'on-time': 'border-l-success',
  never: 'border-l-base-content/30',
  unknown: 'border-l-base-content/30'
}

const valueColorByStatus: Record<CheckStatus | 'unknown', string> = {
  overdue: 'text-error',
  'due-soon': 'text-warning',
  'on-time': 'text-success',
  never: 'text-base-content/60',
  unknown: 'text-base-content/60'
}

const formatDayMonth = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}`
}

const computeProchain = (
  status: CheckStatus | undefined,
  nextDueAt: string | null | undefined
): string => {
  if (!status || status === 'never' || !nextDueAt) return '—'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(nextDueAt)
  if (Number.isNaN(due.getTime())) return '—'
  due.setHours(0, 0, 0, 0)
  const days = Math.round((due.getTime() - today.getTime()) / 86_400_000)
  if (days < 0) return `+${Math.abs(days)}j`
  return `J-${days}`
}

export const CheckTypeCard = ({
  checkType,
  onEdit,
  onDelete,
  status,
  lastCompletedAt,
  nextDueAt,
  onLog
}: CheckTypeCardProps) => {
  const key = status ?? 'unknown'
  const borderClass = borderByStatus[key]
  const valueClass = valueColorByStatus[key]
  const dernier = lastCompletedAt ? formatDayMonth(lastCompletedAt) : '—'
  const prochain = computeProchain(status, nextDueAt)

  return (
    <article
      className={`bg-base-200 border-base-300 hover:border-base-content/40 animate-fade-in-up border border-l-2 ${borderClass} p-5 transition-colors duration-150`}
    >
      <header className='flex items-start justify-between gap-3'>
        <h3 className='font-display text-base font-semibold tracking-wide'>{checkType.name}</h3>
        {status && <CheckStatusBadge status={status} />}
      </header>

      {checkType.description && (
        <p className='text-base-content/70 mt-2 line-clamp-2 text-sm'>{checkType.description}</p>
      )}

      <dl className='border-base-300 mt-3 grid grid-cols-3 gap-3 border-t pt-3'>
        <div>
          <dt className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
            INTERV.
          </dt>
          <dd className='text-base-content/80 mt-0.5 font-mono'>{checkType.intervalDays}j</dd>
        </div>
        <div>
          <dt className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
            DERNIER
          </dt>
          <dd className={`mt-0.5 font-mono ${valueClass}`}>{dernier}</dd>
        </div>
        <div>
          <dt className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
            PROCHAIN
          </dt>
          <dd className={`mt-0.5 font-mono ${valueClass}`}>{prochain}</dd>
        </div>
      </dl>

      <footer className='mt-4 flex gap-2'>
        {onLog && (
          <Button
            variant='outline'
            className='btn-sm btn-primary flex-1'
            onClick={() => onLog(checkType)}
          >
            Journaliser
          </Button>
        )}
        <Button
          variant='outline'
          className='btn-sm btn-square btn-primary'
          onClick={() => onEdit(checkType)}
          aria-label={`Modifier ${checkType.name}`}
        >
          <Pencil size={14} />
        </Button>
        <Button
          variant='destructive-outline'
          className='btn-sm btn-square'
          onClick={() => onDelete(checkType)}
          aria-label={`Supprimer ${checkType.name}`}
        >
          <Trash2 size={14} />
        </Button>
      </footer>
    </article>
  )
}
