import { Button } from '~/components/ui'
import type { Vehicle } from '~/features/vehicles'
import { useMileageHistory } from '~/features/vehicles'

export interface VehicleActivePanelProps {
  vehicle: Vehicle
  onUpdateMileage?: () => void
}

const formatOdo = (mileage: number): string => mileage.toLocaleString('fr-FR')

const formatRecordedAt = (iso: string): string => {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

export const VehicleActivePanel = ({ vehicle, onUpdateMileage }: VehicleActivePanelProps) => {
  const { entries } = useMileageHistory(vehicle.id)
  const lastEntry = entries[0] ?? null
  const hasDelta = lastEntry !== null && lastEntry.delta > 0

  return (
    <article className='border-base-300 bg-base-200 border p-6'>
      <p className='font-display text-base-content/60 text-[10px] tracking-wider uppercase'>
        Véhicule actif
      </p>
      <h2 className='font-display mt-1 text-2xl font-semibold tracking-wide'>
        {vehicle.make} {vehicle.model}
      </h2>
      <p className='text-base-content/60 mt-1 font-mono text-xs'>
        {vehicle.year} · {vehicle.engineType ?? '—'}
      </p>
      <dl className='border-base-300 mt-5 grid grid-cols-2 gap-x-4 border-y py-4'>
        <div>
          <dt className='text-base-content/60 font-mono text-[10px] tracking-wider uppercase'>
            ODO
          </dt>
          <dd className='text-warning mt-0.5 font-mono text-3xl font-semibold'>
            {formatOdo(vehicle.mileage)}
          </dd>
          <dd className='text-base-content/60 mt-0.5 font-mono text-[10px] tracking-wider'>KM</dd>
        </div>
        <div>
          <dt className='text-base-content/60 font-mono text-[10px] tracking-wider uppercase'>
            + Depuis
          </dt>
          <dd className='text-success mt-0.5 font-mono text-3xl font-semibold'>
            {hasDelta ? `+${lastEntry.delta}` : '—'}
          </dd>
          <dd className='text-base-content/60 mt-0.5 font-mono text-[10px] tracking-wider'>
            {hasDelta ? formatRecordedAt(lastEntry.recordedAt) : ''}
          </dd>
        </div>
      </dl>
      {onUpdateMileage && (
        <Button
          variant='warning'
          className='btn-outline mt-4 w-full text-xs tracking-wider'
          onClick={onUpdateMileage}
        >
          + Mettre à jour kilométrage
        </Button>
      )}
    </article>
  )
}
