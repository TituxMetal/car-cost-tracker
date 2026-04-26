import { Car } from 'lucide-react'

import { Button } from '~/components/ui'

export interface VehicleEmptyStateProps {
  onCreateClick: () => void
}

export const VehicleEmptyState = ({ onCreateClick }: VehicleEmptyStateProps) => (
  <section className='flex flex-col items-center gap-3 py-12 text-center'>
    <p className='text-base-content/60 font-mono text-xs tracking-widest uppercase'>
      Créer votre fiche
    </p>
    <Car aria-hidden='true' className='text-base-content/40' size={48} />
    <p className='text-base-content text-lg font-medium'>Aucun véhicule enregistré</p>
    <p className='text-base-content/60 max-w-sm font-mono text-sm'>
      Ajoutez votre premier véhicule pour commencer.
    </p>
    <Button className='mt-4 w-full md:w-auto' onClick={onCreateClick}>
      Ajouter mon véhicule
    </Button>
  </section>
)
