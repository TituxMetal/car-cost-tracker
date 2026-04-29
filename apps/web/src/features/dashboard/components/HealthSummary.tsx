import type { StatusCounts } from '../types'

export interface HealthSummaryProps {
  score: number
  counts: StatusCounts
}

const SEGMENT_COUNT = 40

const colourForSegment = (index: number): string => {
  const ratio = index / SEGMENT_COUNT

  if (ratio < 0.125) return 'bg-error'
  if (ratio < 0.375) return 'bg-warning'
  if (ratio < 0.5) return 'bg-info'

  return 'bg-success'
}

export const HealthSummary = ({ score, counts }: HealthSummaryProps) => {
  const filledThreshold = score / 100

  return (
    <section aria-label='Santé globale' className='border-base-300 bg-base-200 border px-8 py-6'>
      <div className='flex flex-wrap items-start justify-between gap-6'>
        <div>
          <p className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
            Santé globale
          </p>
          <div className='mt-1 flex items-baseline gap-3'>
            <span className='text-warning font-mono text-7xl leading-none font-semibold'>
              {score}
            </span>
            <span className='text-base-content/60 font-mono text-lg'>/100</span>
          </div>
        </div>
        <dl className='mt-2 grid grid-cols-2 gap-4 font-mono md:grid-cols-4 md:gap-8'>
          <div>
            <dt className='text-base-content/60 text-[10px] tracking-wider'>EN RETARD</dt>
            <dd className='text-error mt-1 text-3xl font-semibold'>{counts.overdue}</dd>
          </div>
          <div>
            <dt className='text-base-content/60 text-[10px] tracking-wider'>BIENTÔT</dt>
            <dd className='text-warning mt-1 text-3xl font-semibold'>{counts.dueSoon}</dd>
          </div>
          <div>
            <dt className='text-base-content/60 text-[10px] tracking-wider'>À JOUR</dt>
            <dd className='text-success mt-1 text-3xl font-semibold'>{counts.onTime}</dd>
          </div>
          <div>
            <dt className='text-base-content/60 text-[10px] tracking-wider'>JAMAIS</dt>
            <dd className='text-info mt-1 text-3xl font-semibold'>{counts.never}</dd>
          </div>
        </dl>
      </div>
      <div className='mt-5 flex h-1.5 gap-px' aria-hidden='true' data-testid='health-bar'>
        {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
          const isFilled = index / SEGMENT_COUNT < filledThreshold
          const colour = isFilled ? colourForSegment(index) : 'bg-base-content/15'

          return <div key={index} className={`flex-1 ${colour}`} />
        })}
      </div>
      <p className='sr-only'>
        Score de santé : {score} sur 100. {counts.overdue} contrôle(s) en retard, {counts.dueSoon}{' '}
        bientôt dus, {counts.onTime} à jour, {counts.never} jamais effectués.
      </p>
    </section>
  )
}
