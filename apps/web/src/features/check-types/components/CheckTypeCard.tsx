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
    <article className='rounded-lg border border-zinc-700 bg-zinc-800 p-4'>
      <h2 className='text-zinc-100'>{checkType.name}</h2>
      {checkType.description && <p className='text-zinc-300'>{checkType.description}</p>}
      <p className='text-zinc-300'>{formattedInterval}</p>
      <footer className='mx-auto my-6 flex w-full max-w-lg items-center justify-between gap-2'>
        <Button onClick={() => onEdit(checkType)}>Modifier</Button>
        <Button variant='destructive' onClick={() => onDelete(checkType)}>
          Supprimer
        </Button>
      </footer>
    </article>
  )
}
