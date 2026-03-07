import { ClipboardCheck, Pencil, Trash2 } from 'lucide-react'

import { Button } from '~/components/ui'

import type { CheckType } from '../types'

export interface CheckTypeCardProps {
  checkType: CheckType
  onEdit: (checkType: CheckType) => void
  onDelete: (checkType: CheckType) => void
}

export const CheckTypeCard = ({ checkType, onEdit, onDelete }: CheckTypeCardProps) => {
  const formattedInterval = `Tous les ${checkType.intervalDays} jours`

  return (
    <article className='card card-border card-sm animate-fade-in-up border-l-primary bg-base-200 hover:shadow-primary/5 border-l-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'>
      <section className='card-body gap-3'>
        <header className='flex flex-wrap items-start gap-2'>
          <h2 className='card-title gap-2'>
            <ClipboardCheck size={18} className='text-primary/70 shrink-0' />
            {checkType.name}
          </h2>
          <span className='badge badge-neutral shrink-0'>{formattedInterval}</span>
        </header>
        {checkType.description && (
          <p className='text-base-content/60 line-clamp-2 text-sm'>{checkType.description}</p>
        )}
        <footer className='card-actions justify-end'>
          <Button variant='ghost' className='btn-sm gap-1' onClick={() => onEdit(checkType)}>
            <Pencil size={14} />
            Modifier
          </Button>
          <Button
            variant='destructive'
            className='btn-sm btn-outline gap-1'
            onClick={() => onDelete(checkType)}
          >
            <Trash2 size={14} />
            Supprimer
          </Button>
        </footer>
      </section>
    </article>
  )
}
