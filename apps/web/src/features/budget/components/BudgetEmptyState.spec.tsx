import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'

import { BudgetEmptyState } from './BudgetEmptyState'

describe('BudgetEmptyState', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the empty-state copy', () => {
    render(<BudgetEmptyState onDefine={() => {}} />)

    expect(screen.getByText(/Aucun budget défini/i)).toBeInTheDocument()
  })

  it('renders the "Définir un budget" button', () => {
    render(<BudgetEmptyState onDefine={() => {}} />)

    expect(screen.getByRole('button', { name: 'Définir un budget' })).toBeInTheDocument()
  })

  it('calls onDefine when the button is clicked', () => {
    const onDefine = mock(() => {})

    render(<BudgetEmptyState onDefine={onDefine} />)

    fireEvent.click(screen.getByRole('button', { name: 'Définir un budget' }))

    expect(onDefine).toHaveBeenCalledTimes(1)
  })
})
