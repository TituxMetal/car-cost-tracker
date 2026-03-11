import { Button } from '~/components/ui'

import type { Vehicle } from '../types'
import { FUEL_TYPE_LABELS } from '../types'
import { formatDate, formatMileage } from '../utils'

export interface VehicleProfileProps {
  vehicle: Vehicle
  onEdit: () => void
  onDelete: () => void
}

export const VehicleProfile = ({ vehicle, onEdit, onDelete }: VehicleProfileProps) => {
  const fuelTypeLabel = vehicle.fuelType ? FUEL_TYPE_LABELS[vehicle.fuelType] : '-'

  return (
    <article className='card bg-base-200'>
      <section className='card-body gap-4'>
        <dl className='grid grid-cols-2 gap-x-8 gap-y-1' role='list'>
          <dt className='text-base-content/70 text-sm'>Marque</dt>
          <dd className='text-base-content mb-3 font-medium'>{vehicle.make}</dd>

          <dt className='text-base-content/70 text-sm'>Modèle</dt>
          <dd className='text-base-content mb-3 font-medium'>{vehicle.model}</dd>

          <dt className='text-base-content/70 text-sm'>Année</dt>
          <dd className='text-base-content mb-3 font-medium'>{vehicle.year}</dd>

          <dt className='text-base-content/70 text-sm'>Type de moteur</dt>
          <dd className='text-base-content mb-3 font-medium'>{vehicle.engineType ?? '-'}</dd>

          <dt className='text-base-content/70 text-sm'>Type de carburant</dt>
          <dd className='text-base-content mb-3 font-medium'>{fuelTypeLabel}</dd>

          <dt className='text-base-content/70 text-sm'>VIN</dt>
          <dd className='text-base-content mb-3 font-medium'>{vehicle.vin ?? '-'}</dd>

          <dt className='text-base-content/70 text-sm'>Plaque d'immatriculation</dt>
          <dd className='text-base-content mb-3 font-medium'>{vehicle.licensePlate ?? '-'}</dd>

          <dt className='text-base-content/70 text-sm'>Date d'achat</dt>
          <dd className='text-base-content mb-3 font-medium'>
            {vehicle.purchaseDate ? formatDate(vehicle.purchaseDate) : '-'}
          </dd>

          <dt className='text-base-content/70 text-sm'>Kilométrage</dt>
          <dd className='text-base-content mb-3 font-medium'>{formatMileage(vehicle.mileage)}</dd>
        </dl>

        <section className='card-actions justify-between'>
          <Button onClick={onEdit}>Modifier</Button>
          <Button onClick={onDelete} variant='destructive'>
            Supprimer
          </Button>
        </section>
      </section>
    </article>
  )
}
