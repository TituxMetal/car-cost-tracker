import { useStore } from '@nanostores/react'
import { useEffect } from 'react'

import { useExpenses } from '~/features/expenses'
import { $spentThisMonthCents } from '~/features/expenses/store'
import {
  CATEGORY_LABELS,
  CATEGORY_TINT_BASE,
  CATEGORY_TINT_CLASS
} from '~/features/expenses/utils/expenseCategory.utils'
import { formatEuros } from '~/shared/utils'

export interface RecentExpensesPanelProps {
  vehicleId: string
}

const RECENT_LIMIT = 3

export const RecentExpensesPanel = ({ vehicleId }: RecentExpensesPanelProps) => {
  const { expenses, hasExpenses, fetchExpenses } = useExpenses()
  const spentThisMonthCents = useStore($spentThisMonthCents)

  useEffect(() => {
    fetchExpenses(vehicleId)
  }, [fetchExpenses, vehicleId])

  if (!hasExpenses) return null

  const recentExpenses = expenses.slice(0, RECENT_LIMIT)

  return (
    <article className='border-base-300 bg-base-200 border p-5' data-testid='recent-expenses-panel'>
      <header className='mb-3 flex items-baseline justify-between gap-3'>
        <p className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
          Dépenses récentes
        </p>
        <a
          href='/expenses'
          className='font-display text-warning hover:text-warning/80 text-[10px] tracking-[0.2em] uppercase transition-colors'
        >
          Voir tout →
        </a>
      </header>
      <div className='flex flex-wrap items-baseline gap-x-2 gap-y-1'>
        <span className='text-warning font-mono text-3xl leading-none font-semibold'>
          {formatEuros(spentThisMonthCents)}
        </span>
        <span className='text-base-content/60 font-mono text-xs'>ce mois-ci</span>
      </div>
      <ul className='mt-4 flex flex-col gap-2' data-testid='recent-expenses-rows'>
        {recentExpenses.map(expense => (
          <li
            key={expense.id}
            className='border-base-300/60 flex items-baseline justify-between gap-3 border-t pt-2 first:border-t-0 first:pt-0'
          >
            <div className='flex min-w-0 items-baseline gap-3'>
              <span className='text-base-content/60 font-mono text-xs whitespace-nowrap'>
                {expense.occurredAt}
              </span>
              <span className={`${CATEGORY_TINT_BASE} ${CATEGORY_TINT_CLASS[expense.category]}`}>
                {CATEGORY_LABELS[expense.category]}
              </span>
            </div>
            <span className='text-base-content font-mono text-sm font-semibold whitespace-nowrap'>
              {formatEuros(expense.amountCents)}
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}
