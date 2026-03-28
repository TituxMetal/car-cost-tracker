import { ClipboardCheck, Pencil, Trash2 } from 'lucide-react'

import { Button } from '~/components/ui'
import { CheckStatusBadge } from '~/features/check-logs/components/CheckStatusBadge'
import type { CheckStatus } from '~/features/check-logs/types'

import type { CheckType } from '../types'

export interface CheckTypeCardProps {
  checkType: CheckType
  onEdit: (checkType: CheckType) => void
  onDelete: (checkType: CheckType) => void
  status?: CheckStatus
  onLog?: (checkType: CheckType) => void
}

export const CheckTypeCard = ({
  checkType,
  onEdit,
  onDelete,
  status,
  onLog
}: CheckTypeCardProps) => (
  <article className='card card-border card-sm animate-fade-in-up border-l-primary bg-base-200 hover:shadow-primary/5 border-l-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'>
    <section className='card-body gap-3'>
      <header>
        <h2 className='card-title gap-2'>
          <ClipboardCheck size={18} className='text-primary/70 shrink-0' />
          {checkType.name}
        </h2>
      </header>
      <div className='flex flex-wrap items-center gap-1.5'>
        <span className='text-base-content/50 text-xs'>
          Tous les {checkType.intervalDays} jours
        </span>
        {status && <CheckStatusBadge status={status} />}
      </div>
      {checkType.description && (
        <p className='text-base-content/60 line-clamp-2 text-sm'>{checkType.description}</p>
      )}
      <footer className='card-actions items-center justify-between'>
        {onLog && (
          <Button variant='outline' className='btn-sm gap-1' onClick={() => onLog(checkType)}>
            <ClipboardCheck size={14} />
            Journaliser
          </Button>
        )}
        <nav className='ml-auto flex gap-1'>
          <Button
            variant='ghost'
            className='btn-xs btn-square'
            onClick={() => onEdit(checkType)}
            aria-label={`Modifier ${checkType.name}`}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant='destructive'
            className='btn-xs btn-square btn-outline'
            onClick={() => onDelete(checkType)}
            aria-label={`Supprimer ${checkType.name}`}
          >
            <Trash2 size={14} />
          </Button>
        </nav>
      </footer>
    </section>
  </article>
)
