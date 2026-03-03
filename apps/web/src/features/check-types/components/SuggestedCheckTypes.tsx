import { Button } from '~/components/ui'

import type { SuggestedCheckType } from '../types'

export interface SuggestedCheckTypesProps {
  suggestions: SuggestedCheckType[]
  onAdd: (suggestion: SuggestedCheckType) => void
}

export const SuggestedCheckTypes = ({ suggestions, onAdd }: SuggestedCheckTypesProps) => {
  const formatInterval = (interval: number) => `Tous les ${interval} jours`
  return (
    <section className='mx-auto my-6 flex items-center gap-4'>
      {suggestions.map(suggestion => (
        <article
          key={suggestion.name}
          className='rounded-lg border border-zinc-700 bg-zinc-800 p-4'
        >
          <h2 className='text-zinc-100'>{suggestion.name}</h2>
          <p className='text-zinc-300'>{formatInterval(suggestion.intervalDays)}</p>
          <footer className='mx-auto my-6 flex w-full max-w-lg items-center justify-center gap-2'>
            <Button onClick={() => onAdd(suggestion)}>+</Button>
          </footer>
        </article>
      ))}
    </section>
  )
}
