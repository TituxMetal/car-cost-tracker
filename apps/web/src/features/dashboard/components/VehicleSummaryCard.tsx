import { Car } from 'lucide-react'

import { Button } from '~/components/ui'
import type { Vehicle } from '~/features/vehicles'
import { formatMileage } from '~/features/vehicles/utils'

export interface VehicleSummaryCardProps {
  vehicle: Vehicle
}

export const VehicleSummaryCard = ({ vehicle }: VehicleSummaryCardProps) => (
  <article className='card bg-base-200'>
    <section className='card-body flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
      <div className='bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full'>
        <Car width={24} height={24} aria-hidden='true' />
      </div>
      <header className='flex-1'>
        <h2 className='text-base-content text-xl font-bold'>
          {vehicle.make} {vehicle.model}
        </h2>
        <p className='text-base-content/70 text-sm'>
          {vehicle.year} · {formatMileage(vehicle.mileage)}
        </p>
      </header>
      <Button as='a' href='/vehicle' variant='outline'>
        Détails
      </Button>
    </section>
  </article>
)
