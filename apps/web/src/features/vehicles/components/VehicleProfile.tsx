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
    <>
      <dl className='mx-auto mt-6 grid w-full max-w-lg grid-cols-2 gap-x-8 gap-y-2' role='list'>
        <dt>Marque</dt>
        <dd>{vehicle.make}</dd>

        <dt>Modèle</dt>
        <dd>{vehicle.model}</dd>

        <dt>Année</dt>
        <dd>{vehicle.year}</dd>

        <dt>Type de moteur</dt>
        <dd>{vehicle.engineType ?? '-'}</dd>

        <dt>Type de carburant</dt>
        <dd>{fuelTypeLabel}</dd>

        <dt>VIN</dt>
        <dd>{vehicle.vin ?? '-'}</dd>

        <dt>Plaque d'immatriculation</dt>
        <dd>{vehicle.licensePlate ?? '-'}</dd>

        <dt>Date d'achat</dt>
        <dd>{vehicle.purchaseDate ? formatDate(vehicle.purchaseDate) : '-'}</dd>

        <dt>Kilométrage</dt>
        <dd>{formatMileage(vehicle.mileage)}</dd>
      </dl>

      <section className='mx-auto my-6 flex w-full max-w-lg items-center justify-between gap-2'>
        <Button onClick={onEdit}>Modifier</Button>
        <Button onClick={onDelete} variant='destructive'>
          Supprimer
        </Button>
      </section>
    </>
  )
}
