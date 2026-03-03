import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import type { SuggestedCheckType } from '../types'

import { SuggestedCheckTypes } from './SuggestedCheckTypes'

const suggestions: SuggestedCheckType[] = [
  { name: "Niveau d'huile", description: null, intervalDays: 7 },
  { name: 'Pression des pneus', description: null, intervalDays: 14 },
  { name: 'Niveau de liquide de refroidissement', description: null, intervalDays: 30 }
]

describe('SuggestedCheckTypes', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render all suggestion names', () => {
    render(<SuggestedCheckTypes suggestions={suggestions} onAdd={mock(() => {})} />)

    expect(screen.getByText("Niveau d'huile")).toBeInTheDocument()
    expect(screen.getByText('Pression des pneus')).toBeInTheDocument()
    expect(screen.getByText('Niveau de liquide de refroidissement')).toBeInTheDocument()
  })

  it('should display interval in days for each suggestion', () => {
    render(<SuggestedCheckTypes suggestions={suggestions} onAdd={mock(() => {})} />)

    expect(screen.getByText('Tous les 7 jours')).toBeInTheDocument()
    expect(screen.getByText('Tous les 14 jours')).toBeInTheDocument()
    expect(screen.getByText('Tous les 30 jours')).toBeInTheDocument()
  })

  it('should call onAdd with the correct suggestion when add button is clicked', () => {
    const onAdd = mock(() => {})

    render(<SuggestedCheckTypes suggestions={suggestions} onAdd={onAdd} />)
    const addButton = screen.getAllByRole('button', { name: '+' })[0]
    addButton.click()

    expect(onAdd).toHaveBeenCalledWith(suggestions[0])
  })
})
