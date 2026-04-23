import { PencilLine, Trash2 } from 'lucide-react'

import { Button } from '~/components/ui'

export interface BudgetHeaderProps {
  hasBudget: boolean
  onEdit: () => void
  onDelete: () => void
}

export const BudgetHeader = ({ hasBudget, onEdit, onDelete }: BudgetHeaderProps) => (
  <header className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
    <h1 className='text-base-content text-2xl font-bold'>Mon budget</h1>
    {hasBudget && (
      <div className='flex flex-wrap gap-2'>
        <Button variant='outline' onClick={onEdit} className='gap-2'>
          <PencilLine size={16} />
          Modifier le budget
        </Button>
        <Button variant='destructive' onClick={onDelete} className='gap-2'>
          <Trash2 size={16} />
          Supprimer
        </Button>
      </div>
    )}
  </header>
)
