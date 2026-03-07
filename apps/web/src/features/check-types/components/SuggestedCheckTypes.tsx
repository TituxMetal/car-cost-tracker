import { Plus, Sparkles } from 'lucide-react'

import { Button } from '~/components/ui'

import type { SuggestedCheckType } from '../types'

export interface SuggestedCheckTypesProps {
  suggestions: SuggestedCheckType[]
  onAdd: (suggestion: SuggestedCheckType) => void
}

export const SuggestedCheckTypes = ({ suggestions, onAdd }: SuggestedCheckTypesProps) => {
  const formatInterval = (interval: number) => `Tous les ${interval} jours`
  return (
    <section className='mb-6'>
      <h2 className='text-base-content/80 mb-3 flex items-center gap-2 text-sm font-medium'>
        <Sparkles size={16} className='text-primary/70' />
        Suggestions rapides
      </h2>
      <nav className='flex flex-wrap gap-2'>
        {suggestions.map(suggestion => (
          <Button
            key={suggestion.name}
            variant='outline'
            className='btn-sm hover:border-primary/50 gap-1.5 transition-all duration-150 hover:scale-[1.02]'
            onClick={() => onAdd(suggestion)}
          >
            <span className='sr-only'>+</span>
            <Plus size={14} className='text-primary' />
            <span>{suggestion.name}</span>
            <span className='badge badge-primary badge-sm'>
              {formatInterval(suggestion.intervalDays)}
            </span>
          </Button>
        ))}
      </nav>
    </section>
  )
}
