import type { CheckStatusSummary } from '~/features/check-logs/types'

import type { CheckType } from '../types'

import { CheckTypeCard } from './CheckTypeCard'

export interface CheckTypeListProps {
  checkTypes: CheckType[]
  onEdit: (checkType: CheckType) => void
  onDelete: (checkType: CheckType) => void
  summaries?: Map<string, CheckStatusSummary>
  onLog?: (checkType: CheckType) => void
}

export const CheckTypeList = ({
  checkTypes,
  onEdit,
  onDelete,
  summaries,
  onLog
}: CheckTypeListProps) => (
  <>
    {checkTypes.map(checkType => {
      const summary = summaries?.get(checkType.id)
      return (
        <CheckTypeCard
          key={checkType.id}
          checkType={checkType}
          onEdit={onEdit}
          onDelete={onDelete}
          status={summary?.status}
          lastCompletedAt={summary?.lastCompletedAt}
          nextDueAt={summary?.nextDueAt}
          onLog={onLog}
        />
      )
    })}
  </>
)
