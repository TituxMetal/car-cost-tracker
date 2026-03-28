import { Calendar, FileText, Trash2 } from 'lucide-react'

import { Button } from '~/components/ui'

import type { CheckLog } from '../types'

export interface CheckLogCardProps {
  checkLog: CheckLog
  onDelete: (checkLog: CheckLog) => void
}

export const CheckLogCard = ({ checkLog, onDelete }: CheckLogCardProps) => (
  <article className='card card-border card-sm bg-base-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'>
    <section className='card-body gap-3'>
      <header className='flex flex-wrap items-start gap-2'>
        <h2 className='card-title gap-2'>
          <FileText size={18} className='text-primary/70 shrink-0' />
          {checkLog.checkTypeName}
        </h2>
      </header>
      <ul className='text-base-content/70 flex flex-col gap-1 text-sm'>
        <li className='flex items-center gap-2'>
          <Calendar size={14} className='shrink-0' />
          Effectué le {checkLog.completedAt}
        </li>
        <li className='flex items-center gap-2'>
          <Calendar size={14} className='shrink-0' />
          Prochain le {checkLog.nextDueAt}
        </li>
      </ul>
      {checkLog.notes && (
        <p className='text-base-content/60 line-clamp-2 text-sm'>{checkLog.notes}</p>
      )}
      <footer className='card-actions justify-end'>
        <Button
          variant='destructive'
          className='btn-xs btn-outline gap-1'
          onClick={() => onDelete(checkLog)}
        >
          <Trash2 size={12} />
          Supprimer
        </Button>
      </footer>
    </section>
  </article>
)
