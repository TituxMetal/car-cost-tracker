import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'

import type { Expense } from '../types'

import { ExpenseCard } from './ExpenseCard'

const mockExpense: Expense = {
  id: 'e-1',
  vehicleId: 'v-1',
  occurredAt: '2026-03-15',
  amountCents: 8950,
  category: 'SERVICE',
  description: 'Vidange complète',
  createdAt: '2026-03-15T10:00:00Z',
  updatedAt: '2026-03-15T10:00:00Z'
}

const mockExpenseNoDescription: Expense = {
  ...mockExpense,
  id: 'e-2',
  description: null
}

describe('ExpenseCard', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the formatted amount', () => {
    render(<ExpenseCard expense={mockExpense} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.getByText(/89,50/)).toBeInTheDocument()
  })

  it('renders the occurred date', () => {
    render(<ExpenseCard expense={mockExpense} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.getByText(/Le 2026-03-15/)).toBeInTheDocument()
  })

  it('renders the category label in French', () => {
    render(<ExpenseCard expense={mockExpense} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.getByText('Entretien')).toBeInTheDocument()
  })

  it('renders the description when present', () => {
    render(<ExpenseCard expense={mockExpense} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.getByText('Vidange complète')).toBeInTheDocument()
  })

  it('does not render the description when null', () => {
    render(<ExpenseCard expense={mockExpenseNoDescription} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.queryByText('Vidange complète')).toBeNull()
  })

  it('calls onEdit with the expense when the edit button is clicked', () => {
    const onEdit = mock(() => {})
    render(<ExpenseCard expense={mockExpense} onEdit={onEdit} onDelete={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /modifier/i }))

    expect(onEdit).toHaveBeenCalledWith(mockExpense)
  })

  it('calls onDelete with the expense when the delete button is clicked', () => {
    const onDelete = mock(() => {})
    render(<ExpenseCard expense={mockExpense} onEdit={() => {}} onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))

    expect(onDelete).toHaveBeenCalledWith(mockExpense)
  })
})
