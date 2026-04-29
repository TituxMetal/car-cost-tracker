import { Car, ListChecks } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

import { Button } from '~/components/ui'

export type DashboardEmptyStateVariant = 'no-vehicle' | 'no-check-types'

export interface DashboardEmptyStateProps {
  variant: DashboardEmptyStateVariant
}

interface VariantConfig {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
  cta: { href: string; label: string }
}

const VARIANTS: Record<DashboardEmptyStateVariant, VariantConfig> = {
  'no-vehicle': {
    Icon: Car,
    title: 'Aucun véhicule enregistré',
    description: 'Ajoutez votre premier véhicule pour commencer à suivre son entretien.',
    cta: { href: '/vehicle', label: 'Ajouter un véhicule' }
  },
  'no-check-types': {
    Icon: ListChecks,
    title: 'Aucun type de contrôle défini',
    description: "Créez vos premiers types de contrôle pour suivre l'entretien de votre véhicule.",
    cta: { href: '/check-types', label: 'Créer un type de contrôle' }
  }
}

export const DashboardEmptyState = ({ variant }: DashboardEmptyStateProps) => {
  const { Icon, title, description, cta } = VARIANTS[variant]

  return (
    <section className='border-base-300 bg-base-200 flex flex-col items-center gap-4 border p-8 text-center'>
      <Icon width={48} height={48} className='text-base-content/40' aria-hidden='true' />
      <h2 className='font-display text-lg tracking-wide'>{title}</h2>
      <p className='text-base-content/60 max-w-sm font-mono text-xs'>{description}</p>
      <Button as='a' variant='warning' className='btn-outline mt-2' href={cta.href}>
        {cta.label}
      </Button>
    </section>
  )
}
