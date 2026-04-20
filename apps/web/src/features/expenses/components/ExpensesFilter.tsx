import { Select } from '~/components/ui'

import type { ExpenseCategory } from '../types'
import { CATEGORY_OPTIONS } from '../utils/expenseCategory.utils'

const ALL_VALUE = 'ALL'

export interface ExpensesFilterProps {
  value: ExpenseCategory | null
  onChange: (category: ExpenseCategory | null) => void
}

export const ExpensesFilter = ({ value, onChange }: ExpensesFilterProps) => (
  <Select
    label='Filtrer par catégorie'
    fullWidth={false}
    value={value ?? ALL_VALUE}
    onChange={event => {
      const next = event.target.value
      onChange(next === ALL_VALUE ? null : (next as ExpenseCategory))
    }}
    options={[{ value: ALL_VALUE, label: 'Toutes les catégories' }, ...CATEGORY_OPTIONS]}
  />
)
