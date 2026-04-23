import { Wallet } from 'lucide-react'

import { Button } from '~/components/ui'

export interface BudgetEmptyStateProps {
  onDefine: () => void
}

export const BudgetEmptyState = ({ onDefine }: BudgetEmptyStateProps) => (
  <section className='flex flex-col items-center gap-4 py-16 text-center'>
    <Wallet size={48} className='text-base-content/30' />
    <p className='text-base-content/70 text-lg font-medium'>
      Aucun budget défini — définissez un budget pour suivre vos dépenses.
    </p>
    <Button onClick={onDefine}>Définir un budget</Button>
  </section>
)
