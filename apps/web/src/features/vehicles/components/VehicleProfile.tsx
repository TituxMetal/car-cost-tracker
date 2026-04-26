import { Button } from '~/components/ui'

import type { Vehicle } from '../types'
import { FUEL_TYPE_LABELS } from '../types'
import { formatDate, formatMileage } from '../utils'

const STRIPE_BG =
  'bg-[repeating-linear-gradient(45deg,_transparent_0_8px,_rgba(255,255,255,0.04)_8px_16px)]'

const KICKER_CLASSES = 'text-base-content/60 font-mono text-xs tracking-widest uppercase'
const VALUE_CLASSES = 'text-base-content font-medium'
const SPEC_LIST_CLASSES = 'grid grid-cols-1 md:grid-cols-2 md:gap-x-8'
const CELL_CLASSES = 'border-base-300 border-b py-4'

export interface VehicleProfileProps {
  vehicle: Vehicle
  onEdit: () => void
  onDelete: () => void
}

const composeSubLine = (year: number, engineType: string | null): string =>
  engineType ? `— ${year} · ${engineType}` : `— ${year}`

interface SpecCellProps {
  label: string
  value: string | number
}

const SpecCell = ({ label, value }: SpecCellProps) => (
  <div className={CELL_CLASSES}>
    <dt className={KICKER_CLASSES}>{label}</dt>
    <dd className={VALUE_CLASSES}>{value}</dd>
  </div>
)

export const VehicleProfile = ({ vehicle, onEdit, onDelete }: VehicleProfileProps) => {
  const fuelTypeLabel = vehicle.fuelType ? FUEL_TYPE_LABELS[vehicle.fuelType] : '-'
  const purchaseDateLabel = vehicle.purchaseDate ? formatDate(vehicle.purchaseDate) : '-'

  return (
    <article className='border-base-300 bg-base-200 flex flex-col gap-6 border p-6'>
      <header className='flex flex-col gap-2'>
        <p className='text-base-content/60 font-mono text-xs tracking-widest uppercase'>
          Fiche véhicule
        </p>
        <h1 className='font-display text-4xl tracking-tight md:text-5xl'>
          {vehicle.make} {vehicle.model}
        </h1>
        <p className='text-primary font-mono text-sm'>
          {composeSubLine(vehicle.year, vehicle.engineType)}
        </p>
      </header>

      <div
        className={`border-base-300 bg-base-300/30 flex h-56 items-center justify-center border ${STRIPE_BG}`}
      >
        <span className='text-base-content/50 font-mono text-xs tracking-widest uppercase'>
          [ Dans les cartons ]
        </span>
      </div>

      <dl role='list' className={SPEC_LIST_CLASSES}>
        <SpecCell label='Marque' value={vehicle.make} />
        <SpecCell label='Modèle' value={vehicle.model} />
        <SpecCell label='Année' value={vehicle.year} />
        <SpecCell label='Type moteur' value={vehicle.engineType ?? '-'} />
        <SpecCell label='Carburant' value={fuelTypeLabel} />
        <SpecCell label='VIN' value={vehicle.vin ?? '-'} />
        <SpecCell label='Plaque' value={vehicle.licensePlate ?? '-'} />
        <SpecCell label="Date d'achat" value={purchaseDateLabel} />
        <SpecCell label='Kilométrage' value={formatMileage(vehicle.mileage)} />
      </dl>

      <p id='delete-vehicle-warning' className='sr-only'>
        Cette action est irréversible
      </p>

      <section className='flex flex-wrap gap-3'>
        <Button className='w-full md:w-auto' onClick={onEdit}>
          Modifier fiche
        </Button>
        <Button
          aria-describedby='delete-vehicle-warning'
          className='btn-outline w-full md:w-auto'
          onClick={onDelete}
          variant='destructive'
        >
          Supprimer
        </Button>
      </section>
    </article>
  )
}
