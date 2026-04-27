import type { CheckLog } from '../types'

import { CheckLogCard } from './CheckLogCard'

export interface CheckLogListProps {
  checkLogs: CheckLog[]
  onDelete: (checkLog: CheckLog) => void
}

export const CheckLogList = ({ checkLogs, onDelete }: CheckLogListProps) => {
  if (checkLogs.length === 0) {
    return (
      <section className='border-base-300 bg-base-200 border p-12 text-center'>
        <p className='font-display text-base-content/70 text-lg font-medium tracking-wide'>
          Aucun contrôle enregistré
        </p>
        <p className='text-base-content/50 mx-auto mt-2 max-w-sm font-mono text-xs'>
          Journalisez votre premier contrôle depuis le tableau de bord ou depuis un type de contrôle
        </p>
      </section>
    )
  }

  return (
    <section className='border-base-300 bg-base-200 border'>
      <header className='border-base-300 text-base-content/60 font-display hidden border-b text-[10px] tracking-wider uppercase md:grid md:grid-cols-[80px_1fr_120px_1fr_120px_40px] md:gap-4 md:px-3 md:py-2'>
        <span>DATE</span>
        <span>TYPE</span>
        <span>ODO</span>
        <span>NOTES</span>
        <span>PROCHAIN</span>
        <span aria-hidden='true' />
      </header>
      <div className='grid grid-cols-1 gap-3 p-3 md:gap-0 md:p-0'>
        {checkLogs.map(checkLog => (
          <CheckLogCard key={checkLog.id} checkLog={checkLog} onDelete={onDelete} />
        ))}
      </div>
    </section>
  )
}
