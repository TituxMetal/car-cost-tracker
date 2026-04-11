import type { ActionItem } from '../types'

import { ActionItemCard } from './ActionItemCard'
import { DashboardEmptyState } from './DashboardEmptyState'

export interface ActionItemsListProps {
  items: ActionItem[]
  onLog: (checkTypeId: string) => void
}

export const ActionItemsList = ({ items, onLog }: ActionItemsListProps) => {
  if (items.length === 0) {
    return <DashboardEmptyState variant='no-action-items' />
  }

  return (
    <section aria-labelledby='dashboard-action-items-title' className='flex flex-col gap-3'>
      <h2 id='dashboard-action-items-title' className='text-base-content text-xl font-bold'>
        À faire
      </h2>
      <ul className='flex flex-col gap-3'>
        {items.map(item => (
          <li key={item.checkTypeId}>
            <ActionItemCard item={item} onLog={onLog} />
          </li>
        ))}
      </ul>
    </section>
  )
}
