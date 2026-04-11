import type { CheckLog } from '~/features/check-logs'
import { formatDate } from '~/features/vehicles/utils'

export interface RecentActivityListProps {
  logs: CheckLog[]
}

const NOTES_MAX_LENGTH = 80

const truncateNotes = (notes: string | null): string | null => {
  if (!notes) return null
  if (notes.length <= NOTES_MAX_LENGTH) return notes

  return `${notes.slice(0, NOTES_MAX_LENGTH).trimEnd()}…`
}

export const RecentActivityList = ({ logs }: RecentActivityListProps) => {
  if (logs.length === 0) {
    return (
      <section aria-labelledby='dashboard-recent-activity-title' className='flex flex-col gap-3'>
        <h2 id='dashboard-recent-activity-title' className='text-base-content text-xl font-bold'>
          Activité récente
        </h2>
        <p className='text-base-content/60 text-sm'>Aucun contrôle enregistré.</p>
      </section>
    )
  }

  return (
    <section aria-labelledby='dashboard-recent-activity-title' className='flex flex-col gap-3'>
      <h2 id='dashboard-recent-activity-title' className='text-base-content text-xl font-bold'>
        Activité récente
      </h2>
      <ul className='flex flex-col gap-2'>
        {logs.map(log => {
          const truncated = truncateNotes(log.notes)

          return (
            <li key={log.id} className='card bg-base-200'>
              <article className='card-body gap-1 p-4'>
                <header className='flex flex-wrap items-baseline justify-between gap-2'>
                  <h3 className='text-base-content font-medium'>{log.checkTypeName}</h3>
                  <time className='text-base-content/70 text-sm' dateTime={log.completedAt}>
                    {formatDate(log.completedAt)}
                  </time>
                </header>
                {truncated && <p className='text-base-content/70 text-sm'>{truncated}</p>}
              </article>
            </li>
          )
        })}
      </ul>
      <a href='/check-logs' className='link link-primary self-end text-sm font-medium'>
        Voir tout
      </a>
    </section>
  )
}
