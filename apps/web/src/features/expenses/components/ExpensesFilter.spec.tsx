import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'

import { ExpensesFilter } from './ExpensesFilter'

describe('ExpensesFilter', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders "Toutes les catégories" and every category option', () => {
    render(<ExpensesFilter value={null} onChange={() => {}} />)

    expect(screen.getByRole('option', { name: 'Toutes les catégories' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Entretien' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Pièces' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: "Main-d'œuvre" })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Autre' })).toBeInTheDocument()
  })

  it('selects "ALL" when value is null', () => {
    render(<ExpensesFilter value={null} onChange={() => {}} />)

    expect(screen.getByLabelText(/filtrer par catégorie/i)).toHaveValue('ALL')
  })

  it('selects the given category when value is set', () => {
    render(<ExpensesFilter value='PARTS' onChange={() => {}} />)

    expect(screen.getByLabelText(/filtrer par catégorie/i)).toHaveValue('PARTS')
  })

  it('calls onChange with the category when a category is selected', () => {
    const onChange = mock(() => {})

    render(<ExpensesFilter value={null} onChange={onChange} />)

    fireEvent.change(screen.getByLabelText(/filtrer par catégorie/i), {
      target: { value: 'LABOR' }
    })

    expect(onChange).toHaveBeenCalledWith('LABOR')
  })

  it('calls onChange with null when "Toutes les catégories" is selected', () => {
    const onChange = mock(() => {})

    render(<ExpensesFilter value='PARTS' onChange={onChange} />)

    fireEvent.change(screen.getByLabelText(/filtrer par catégorie/i), {
      target: { value: 'ALL' }
    })

    expect(onChange).toHaveBeenCalledWith(null)
  })
})
