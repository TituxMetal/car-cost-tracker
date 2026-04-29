import { ChevronRight } from 'lucide-react'

import type { CheckStatus } from '~/features/check-logs'

import type { ActionItem } from '../types'
import { daysFromNow } from '../utils'

export interface ActionItemCardProps {
  item: ActionItem
  onLog: (checkTypeId: string) => void
}

const borderColourByStatus: Record<CheckStatus, string> = {
  overdue: 'border-l-error',
  'due-soon': 'border-l-warning',
  'on-time': 'border-l-success',
  never: 'border-l-info'
}

const accentColourByStatus: Record<CheckStatus, string> = {
  overdue: 'border-error text-error',
  'due-soon': 'border-warning text-warning',
  'on-time': 'border-success text-success',
  never: 'border-info text-info'
}

const labelColourByStatus: Record<CheckStatus, string> = {
  overdue: 'text-error',
  'due-soon': 'text-warning',
  'on-time': 'text-success',
  never: 'text-info'
}

const statusLabelByStatus: Record<CheckStatus, string> = {
  overdue: 'En retard',
  'due-soon': 'Bientôt',
  'on-time': 'À jour',
  never: 'Jamais'
}

const buildDaysGlyph = (item: ActionItem): string => {
  if (!item.nextDueAt) return ''

  const days = daysFromNow(item.nextDueAt)

  if (Number.isNaN(days)) return ''
  if (item.status === 'overdue') return `+${Math.abs(days)}`

  return String(Math.max(0, days))
}

export const ActionItemCard = ({ item, onLog }: ActionItemCardProps) => {
  const borderClass = borderColourByStatus[item.status]
  const accentClass = accentColourByStatus[item.status]
  const labelClass = labelColourByStatus[item.status]
  const daysGlyph = buildDaysGlyph(item)
  const statusLabel = statusLabelByStatus[item.status]

  return (
    <li>
      <button
        type='button'
        onClick={() => onLog(item.checkTypeId)}
        aria-label={`Enregistrer le contrôle ${item.checkTypeName}`}
        className={`border-base-300 bg-base-100/50 hover:bg-base-200 flex w-full cursor-pointer items-center gap-3 border border-l-2 ${borderClass} px-3 py-2 text-left transition-colors`}
      >
        <span
          aria-hidden='true'
          className={`grid size-9 shrink-0 place-items-center rounded-full border font-mono text-xs ${accentClass}`}
        >
          {daysGlyph}
        </span>
        <span className='flex-1'>
          <span className='font-display block text-sm'>{item.checkTypeName}</span>
          <span
            className={`mt-0.5 block font-mono text-[10px] tracking-wider uppercase ${labelClass}`}
          >
            {statusLabel}
          </span>
        </span>
        <ChevronRight size={16} className='text-base-content/40' />
      </button>
    </li>
  )
}
