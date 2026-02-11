import { Button } from '~/components/ui'

export interface VehicleEmptyStateProps {
  onCreateClick: () => void
}

export const VehicleEmptyState = ({ onCreateClick }: VehicleEmptyStateProps) => (
  <section className='mx-auto mt-10 max-w-md text-center'>
    <h2 className='mb-4 text-2xl font-semibold'>Aucun véhicule enregistré</h2>
    <p className='mb-6'>Ajoutez votre premier véhicule pour commencer.</p>
    <Button onClick={onCreateClick}>Ajouter mon véhicule</Button>
  </section>
)
