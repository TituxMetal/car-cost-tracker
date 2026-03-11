import { Car } from 'lucide-react'

import { Button } from '~/components/ui'

export interface VehicleEmptyStateProps {
  onCreateClick: () => void
}

export const VehicleEmptyState = ({ onCreateClick }: VehicleEmptyStateProps) => (
  <section className='flex flex-col items-center gap-3 py-16 text-center'>
    <Car size={48} className='text-base-content/30' />
    <p className='text-base-content/70 text-lg font-medium'>Aucun véhicule enregistré</p>
    <p className='text-base-content/60 max-w-sm text-sm'>
      Ajoutez votre premier véhicule pour commencer.
    </p>
    <Button onClick={onCreateClick} className='mt-4'>
      Ajouter mon véhicule
    </Button>
  </section>
)
