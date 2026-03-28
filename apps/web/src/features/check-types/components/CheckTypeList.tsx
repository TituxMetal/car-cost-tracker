import type { CheckStatus } from '~/features/check-logs/types'

import type { CheckType } from '../types'

import { CheckTypeCard } from './CheckTypeCard'

export interface CheckTypeListProps {
  checkTypes: CheckType[]
  onEdit: (checkType: CheckType) => void
  onDelete: (checkType: CheckType) => void
  statuses?: Map<string, CheckStatus>
  onLog?: (checkType: CheckType) => void
}

export const CheckTypeList = ({
  checkTypes,
  onEdit,
  onDelete,
  statuses,
  onLog
}: CheckTypeListProps) => (
  <section className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
    {checkTypes.map(checkType => (
      <CheckTypeCard
        key={checkType.id}
        checkType={checkType}
        onEdit={onEdit}
        onDelete={onDelete}
        status={statuses?.get(checkType.id)}
        onLog={onLog}
      />
    ))}
  </section>
)
