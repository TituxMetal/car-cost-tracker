import { Receipt } from 'lucide-react'

export interface ExpensesEmptyStateProps {
  variant?: 'default' | 'filtered'
}

const MESSAGES = {
  default: 'Aucune dépense enregistrée — ajoutez votre première dépense !',
  filtered: 'Aucune dépense dans cette catégorie'
}

export const ExpensesEmptyState = ({ variant = 'default' }: ExpensesEmptyStateProps) => (
  <section className='flex flex-col items-center gap-3 py-16 text-center'>
    <Receipt size={48} className='text-base-content/30' />
    <p className='text-base-content/70 text-lg font-medium'>{MESSAGES[variant]}</p>
  </section>
)
