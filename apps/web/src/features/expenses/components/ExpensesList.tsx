import type { Expense } from '../types'

import { ExpenseCard } from './ExpenseCard'
import { ExpensesEmptyState } from './ExpensesEmptyState'

export interface ExpensesListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
  emptyVariant?: 'default' | 'filtered'
}

export const ExpensesList = ({
  expenses,
  onEdit,
  onDelete,
  emptyVariant = 'default'
}: ExpensesListProps) => {
  if (expenses.length === 0) return <ExpensesEmptyState variant={emptyVariant} />

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
      {expenses.map(expense => (
        <ExpenseCard key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </section>
  )
}
