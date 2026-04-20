import { Calendar, PencilLine, Trash2 } from 'lucide-react'

import { Button } from '~/components/ui'

import type { Expense } from '../types'
import { formatEuros } from '../utils/amount.utils'
import { CATEGORY_BADGE_CLASS, CATEGORY_LABELS } from '../utils/expenseCategory.utils'

export interface ExpenseCardProps {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
}

export const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => (
  <article className='card card-border card-sm bg-base-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'>
    <section className='card-body gap-3'>
      <header className='flex flex-wrap items-start justify-between gap-2'>
        <h2 className='card-title gap-2 text-2xl font-bold'>{formatEuros(expense.amountCents)}</h2>
        <span className={`badge badge-sm ${CATEGORY_BADGE_CLASS[expense.category]}`}>
          {CATEGORY_LABELS[expense.category]}
        </span>
      </header>
      <ul className='text-base-content/70 flex flex-col gap-1 text-sm'>
        <li className='flex items-center gap-2'>
          <Calendar size={14} className='shrink-0' />
          Le {expense.occurredAt}
        </li>
      </ul>
      {expense.description && (
        <p className='text-base-content/60 line-clamp-2 text-sm'>{expense.description}</p>
      )}
      <footer className='card-actions justify-end'>
        <Button
          variant='ghost'
          className='btn-xs btn-outline gap-1'
          onClick={() => onEdit(expense)}
        >
          <PencilLine size={12} />
          Modifier
        </Button>
        <Button
          variant='destructive'
          className='btn-xs btn-outline gap-1'
          onClick={() => onDelete(expense)}
        >
          <Trash2 size={12} />
          Supprimer
        </Button>
      </footer>
    </section>
  </article>
)
