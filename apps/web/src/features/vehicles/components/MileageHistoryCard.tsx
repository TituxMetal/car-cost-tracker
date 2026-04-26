import { useMileageHistory } from '../hooks'
import { formatDate, formatMileage } from '../utils'

const VISIBLE_LIMIT = 10

export interface MileageHistoryCardProps {
  vehicleId: string
}

export const MileageHistoryCard = ({ vehicleId }: MileageHistoryCardProps) => {
  const { entries } = useMileageHistory(vehicleId)
  const visible = entries.slice(0, VISIBLE_LIMIT)

  return (
    <article className='border-base-300 bg-base-200 border'>
      <header className='border-base-300 border-b p-4'>
        <p className='text-base-content/60 font-mono text-xs tracking-widest uppercase'>
          Historique compteur
        </p>
      </header>
      {visible.length === 0 ? (
        <p className='text-base-content/60 p-4 font-mono text-sm'>
          Aucune mise à jour enregistrée pour le moment.
        </p>
      ) : (
        <ul className='divide-base-300 divide-y'>
          {visible.map(entry => (
            <li
              className='grid grid-cols-[1fr_1fr_auto] items-center gap-4 p-4'
              key={`${entry.recordedAt}-${entry.mileage}`}
            >
              <time dateTime={entry.recordedAt} className='text-base-content/80 font-mono text-sm'>
                {formatDate(entry.recordedAt)}
              </time>
              <span className='text-primary font-mono text-sm'>{formatMileage(entry.mileage)}</span>
              <span className='text-success font-mono text-sm'>+ {entry.delta}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
