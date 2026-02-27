import type { CheckType } from '../types'

import { CheckTypeCard } from './CheckTypeCard'

export interface CheckTypeListProps {
  checkTypes: CheckType[]
  onEdit: (checkType: CheckType) => void
  onDelete: (checkType: CheckType) => void
}

export const CheckTypeList = ({ checkTypes, onEdit, onDelete }: CheckTypeListProps) => (
  <section className='grid gap-2'>
    {checkTypes.map(checkType => (
      <CheckTypeCard key={checkType.id} checkType={checkType} onEdit={onEdit} onDelete={onDelete} />
    ))}
  </section>
)
