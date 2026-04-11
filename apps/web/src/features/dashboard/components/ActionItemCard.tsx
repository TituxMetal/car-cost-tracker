import { Button } from '~/components/ui'
import { CheckStatusBadge } from '~/features/check-logs'

import type { ActionItem } from '../types'

export interface ActionItemCardProps {
  item: ActionItem
  onLog: (checkTypeId: string) => void
}

export const ActionItemCard = ({ item, onLog }: ActionItemCardProps) => {
  const isOverdue = item.status === 'overdue'
  const accentClass = isOverdue ? 'border-l-4 border-error' : 'border-l-4 border-warning'

  return (
    <article className={`card bg-base-200 ${accentClass}`}>
      <section className='card-body flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center'>
        <header className='flex-1'>
          <h3 className='text-base-content font-medium'>{item.checkTypeName}</h3>
          <p className='mt-1 flex flex-wrap items-center gap-2'>
            <CheckStatusBadge status={item.status} />
            {item.daysLabel && (
              <span className='text-base-content/70 text-sm'>{item.daysLabel}</span>
            )}
          </p>
        </header>
        <Button
          onClick={() => onLog(item.checkTypeId)}
          variant={isOverdue ? 'default' : 'outline'}
          aria-label={`Enregistrer le contrôle ${item.checkTypeName}`}
        >
          Enregistrer
        </Button>
      </section>
    </article>
  )
}
