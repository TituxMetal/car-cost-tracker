import type { ActionItem } from '../types'

import { ActionItemCard } from './ActionItemCard'

export interface ActionItemsListProps {
  items: ActionItem[]
  onLog: (checkTypeId: string) => void
}

export const ActionItemsList = ({ items, onLog }: ActionItemsListProps) => (
  <section aria-label='À traiter' className='border-base-300 bg-base-200 border p-4 lg:hidden'>
    <p className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
      À traiter · {items.length} entrée{items.length > 1 ? 's' : ''}
    </p>
    <ul className='mt-3 space-y-2'>
      {items.map(item => (
        <ActionItemCard key={item.checkTypeId} item={item} onLog={onLog} />
      ))}
    </ul>
  </section>
)
