import type { CheckLog } from '~/features/check-logs'

export interface LastEntryCardProps {
  log: CheckLog | null
}

const formatLogDate = (iso: string): string => {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return iso

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

export const LastEntryCard = ({ log }: LastEntryCardProps) => (
  <article className='border-base-300 bg-base-200 border p-5'>
    <header className='mb-3 flex items-baseline justify-between gap-3'>
      <p className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
        Dernière entrée
      </p>
      <a
        href='/check-logs'
        className='font-display text-warning hover:text-warning/80 text-[10px] tracking-[0.2em] uppercase transition-colors'
      >
        Voir tout →
      </a>
    </header>
    {log === null ? (
      <p className='text-base-content/60 font-mono text-xs'>Aucune entrée pour le moment.</p>
    ) : (
      <>
        <p className='text-base-content/60 font-mono text-xs'>
          <time dateTime={log.completedAt}>{formatLogDate(log.completedAt)}</time> · — KM
        </p>
        <h3 className='font-display mt-1.5 text-base'>{log.checkTypeName}</h3>
        <p className='text-base-content/60 mt-1 font-mono text-[10px] leading-relaxed'>
          {log.notes ?? '—'}
        </p>
      </>
    )}
  </article>
)
