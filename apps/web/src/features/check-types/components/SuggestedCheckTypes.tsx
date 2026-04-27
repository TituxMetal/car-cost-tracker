import { Plus } from 'lucide-react'

import type { SuggestedCheckType } from '../types'

export interface SuggestedCheckTypesProps {
  suggestions: SuggestedCheckType[]
  onAdd: (suggestion: SuggestedCheckType) => void
}

export const SuggestedCheckTypes = ({ suggestions, onAdd }: SuggestedCheckTypesProps) => (
  <section className='mb-6'>
    <h2 className='font-display text-base-content/60 mb-3 text-xs tracking-wider uppercase'>
      // Suggestions rapides
    </h2>
    <nav className='flex flex-wrap gap-6'>
      {suggestions.map(suggestion => (
        <button
          key={suggestion.name}
          type='button'
          onClick={() => onAdd(suggestion)}
          className='border-base-300 bg-base-200 hover:border-primary hover:bg-base-300 focus-visible:border-primary inline-flex cursor-pointer items-center gap-2 border px-3 py-2 transition-colors duration-150'
        >
          <span className='sr-only'>+</span>
          <Plus size={14} className='text-primary shrink-0' aria-hidden='true' />
          <span className='font-display text-xs font-semibold tracking-wider uppercase'>
            {suggestion.name}
          </span>
          <span className='bg-primary/15 text-primary px-1.5 py-0.5 font-mono text-[10px] tracking-wider'>
            {suggestion.intervalDays}j
          </span>
        </button>
      ))}
    </nav>
  </section>
)
