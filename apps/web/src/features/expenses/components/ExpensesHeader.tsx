import { PlusCircle, Receipt } from 'lucide-react'

import { Button } from '~/components/ui'

import type { ExpenseCategory } from '../types'
import { formatEuros } from '../utils/amount.utils'
import {
  CATEGORY_BADGE_CLASS,
  CATEGORY_LABELS,
  CATEGORY_OPTIONS
} from '../utils/expenseCategory.utils'

export interface ExpensesHeaderProps {
  totalCents: number
  totalsByCategory: Record<ExpenseCategory, number>
  onAddExpense: () => void
}

export const ExpensesHeader = ({
  totalCents,
  totalsByCategory,
  onAddExpense
}: ExpensesHeaderProps) => {
  const nonZeroCategories = CATEGORY_OPTIONS.filter(({ value }) => totalsByCategory[value] > 0)

  return (
    <section className='card bg-base-200 mb-6'>
      <div className='card-body gap-4'>
        <header className='flex flex-wrap items-center justify-between gap-3'>
          <h1 className='text-base-content flex items-center gap-2 text-2xl font-bold'>
            <Receipt size={24} className='text-primary' />
            Mes dépenses
          </h1>
          <Button onClick={onAddExpense} className='gap-2'>
            <PlusCircle size={16} />
            Ajouter une dépense
          </Button>
        </header>
        <div className='flex flex-col gap-1'>
          <p className='text-base-content/70 text-sm'>Total des dépenses</p>
          <p
            className='text-primary text-4xl font-bold'
            aria-label={`Total des dépenses: ${formatEuros(totalCents)}`}
          >
            {formatEuros(totalCents)}
          </p>
        </div>
        {nonZeroCategories.length > 0 && (
          <ul className='flex flex-wrap gap-3' aria-label='Répartition par catégorie'>
            {nonZeroCategories.map(({ value }) => (
              <li
                key={value}
                className='bg-base-300 flex items-center gap-2 rounded-md px-3 py-2 text-sm'
              >
                <span className={`badge badge-sm ${CATEGORY_BADGE_CLASS[value]}`}>
                  {CATEGORY_LABELS[value]}
                </span>
                <span className='font-semibold'>{formatEuros(totalsByCategory[value])}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
