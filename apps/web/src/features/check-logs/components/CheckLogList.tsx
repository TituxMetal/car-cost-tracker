import { ClipboardList } from 'lucide-react'

import type { CheckLog } from '../types'

import { CheckLogCard } from './CheckLogCard'

export interface CheckLogListProps {
  checkLogs: CheckLog[]
  onDelete: (checkLog: CheckLog) => void
}

export const CheckLogList = ({ checkLogs, onDelete }: CheckLogListProps) => {
  if (checkLogs.length === 0) {
    return (
      <section className='flex flex-col items-center justify-center gap-4 py-12'>
        <ClipboardList size={48} className='text-base-content/30' />
        <p className='text-base-content/50 text-lg'>Aucun contrôle enregistré</p>
      </section>
    )
  }

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
      {checkLogs.map(checkLog => (
        <CheckLogCard key={checkLog.id} checkLog={checkLog} onDelete={onDelete} />
      ))}
    </section>
  )
}
