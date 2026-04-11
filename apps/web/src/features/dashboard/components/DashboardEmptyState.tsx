import { Car, CheckCircle2, ClipboardList } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

import { Button } from '~/components/ui'

export type DashboardEmptyStateVariant = 'no-vehicle' | 'no-check-types' | 'no-action-items'

export interface DashboardEmptyStateProps {
  variant: DashboardEmptyStateVariant
}

interface VariantConfig {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
  cta: { href: string; label: string } | null
}

const VARIANTS: Record<DashboardEmptyStateVariant, VariantConfig> = {
  'no-vehicle': {
    Icon: Car,
    title: 'Aucun véhicule enregistré',
    description: 'Ajoutez votre premier véhicule pour commencer à suivre son entretien.',
    cta: { href: '/vehicle', label: 'Ajouter un véhicule' }
  },
  'no-check-types': {
    Icon: ClipboardList,
    title: 'Aucun type de contrôle défini',
    description: "Créez vos premiers types de contrôle pour suivre l'entretien de votre véhicule.",
    cta: { href: '/check-types', label: 'Créer un type de contrôle' }
  },
  'no-action-items': {
    Icon: CheckCircle2,
    title: 'Tous les contrôles sont à jour !',
    description: 'Aucune action requise pour le moment.',
    cta: null
  }
}

export const DashboardEmptyState = ({ variant }: DashboardEmptyStateProps) => {
  const { Icon, title, description, cta } = VARIANTS[variant]

  return (
    <section className='flex flex-col items-center gap-3 py-12 text-center'>
      <Icon width={48} height={48} className='text-base-content/30' aria-hidden='true' />
      <h2 className='text-base-content text-lg font-medium'>{title}</h2>
      <p className='text-base-content/60 max-w-sm text-sm'>{description}</p>
      {cta && (
        <Button as='a' href={cta.href} className='mt-4'>
          {cta.label}
        </Button>
      )}
    </section>
  )
}
