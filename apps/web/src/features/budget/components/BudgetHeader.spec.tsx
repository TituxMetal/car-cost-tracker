import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'

import { BudgetHeader } from './BudgetHeader'

describe('BudgetHeader', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the page title', () => {
    render(<BudgetHeader hasBudget={false} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Mon budget' })).toBeInTheDocument()
  })

  it('hides the edit and delete buttons when hasBudget is false', () => {
    render(<BudgetHeader hasBudget={false} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.queryByRole('button', { name: /Modifier le budget/i })).toBeNull()
    expect(screen.queryByRole('button', { name: /^Supprimer$/i })).toBeNull()
  })

  it('shows the edit and delete buttons when hasBudget is true', () => {
    render(<BudgetHeader hasBudget={true} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.getByRole('button', { name: /Modifier le budget/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Supprimer$/i })).toBeInTheDocument()
  })

  it('calls onEdit when the edit button is clicked', () => {
    const onEdit = mock(() => {})

    render(<BudgetHeader hasBudget={true} onEdit={onEdit} onDelete={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /Modifier le budget/i }))

    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('calls onDelete when the delete button is clicked', () => {
    const onDelete = mock(() => {})

    render(<BudgetHeader hasBudget={true} onEdit={() => {}} onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /^Supprimer$/i }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
