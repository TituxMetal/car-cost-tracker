import type { StatusCounts } from '../types'

export interface StatusOverviewProps {
  counts: StatusCounts
}

interface StatConfig {
  key: keyof StatusCounts
  label: string
  valueClass: string
}

const STATS: StatConfig[] = [
  { key: 'onTime', label: 'À jour', valueClass: 'text-success' },
  { key: 'dueSoon', label: 'Bientôt', valueClass: 'text-warning' },
  { key: 'overdue', label: 'En retard', valueClass: 'text-error' },
  { key: 'never', label: 'Jamais', valueClass: 'text-info' }
]

export const StatusOverview = ({ counts }: StatusOverviewProps) => (
  <section
    aria-label='Statut des contrôles'
    className='grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'
  >
    {STATS.map(({ key, label, valueClass }) => (
      <article key={key} className='card bg-base-200'>
        <div className='card-body items-center gap-1 p-4 text-center'>
          <p className='text-base-content/70 text-sm font-medium'>{label}</p>
          <p className={`text-4xl font-bold ${valueClass}`}>{counts[key]}</p>
        </div>
      </article>
    ))}
  </section>
)
