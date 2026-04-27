import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import type { SuggestedCheckType } from '../types'

import { SuggestedCheckTypes } from './SuggestedCheckTypes'

const suggestions: SuggestedCheckType[] = [
  { name: "Niveau d'huile", description: null, intervalDays: 7 },
  { name: 'Pression des pneus', description: null, intervalDays: 14 },
  { name: 'Liquide de refroidissement', description: null, intervalDays: 30 }
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
    expect(screen.getByText('Liquide de refroidissement')).toBeInTheDocument()
  })

  it('should display interval value in days for each suggestion', () => {
    render(<SuggestedCheckTypes suggestions={suggestions} onAdd={mock(() => {})} />)

    expect(screen.getByText('7j')).toBeInTheDocument()
    expect(screen.getByText('14j')).toBeInTheDocument()
    expect(screen.getByText('30j')).toBeInTheDocument()
  })

  it('should render the interval as a small mono badge', () => {
    const { container } = render(
      <SuggestedCheckTypes suggestions={suggestions} onAdd={mock(() => {})} />
    )

    const badges = container.querySelectorAll('span.font-mono')

    expect(badges.length).toBeGreaterThanOrEqual(suggestions.length)
    expect(badges[0].textContent).toMatch(/^\d+j$/)
  })

  it('should render the section header', () => {
    render(<SuggestedCheckTypes suggestions={suggestions} onAdd={mock(() => {})} />)

    expect(screen.getByText('// Suggestions rapides')).toBeInTheDocument()
  })

  it('should call onAdd with the correct suggestion when add button is clicked', () => {
    const onAdd = mock(() => {})

    render(<SuggestedCheckTypes suggestions={suggestions} onAdd={onAdd} />)
    const addButton = screen.getByRole('button', { name: /Niveau d'huile/ })
    addButton.click()

    expect(onAdd).toHaveBeenCalledWith(suggestions[0])
  })
})
