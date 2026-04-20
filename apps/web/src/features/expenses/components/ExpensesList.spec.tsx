import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import type { Expense } from '../types'

import { ExpensesList } from './ExpensesList'

const mockExpense1: Expense = {
  id: 'e-1',
  vehicleId: 'v-1',
  occurredAt: '2026-03-15',
  amountCents: 8950,
  category: 'SERVICE',
  description: 'Vidange',
  createdAt: '2026-03-15T10:00:00Z',
  updatedAt: '2026-03-15T10:00:00Z'
}

const mockExpense2: Expense = {
  id: 'e-2',
  vehicleId: 'v-1',
  occurredAt: '2026-03-10',
  amountCents: 12000,
  category: 'PARTS',
  description: null,
  createdAt: '2026-03-10T10:00:00Z',
  updatedAt: '2026-03-10T10:00:00Z'
}

describe('ExpensesList', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders a card for each expense', () => {
    render(
      <ExpensesList expenses={[mockExpense1, mockExpense2]} onEdit={() => {}} onDelete={() => {}} />
    )

    expect(screen.getByText(/89,50/)).toBeInTheDocument()
    expect(screen.getByText(/120,00/)).toBeInTheDocument()
  })

  it('renders the default empty state when no expenses', () => {
    render(<ExpensesList expenses={[]} onEdit={() => {}} onDelete={() => {}} />)

    expect(screen.getByText(/ajoutez votre première dépense/i)).toBeInTheDocument()
  })

  it('renders the filtered empty state when filter yields no results', () => {
    render(
      <ExpensesList expenses={[]} onEdit={() => {}} onDelete={() => {}} emptyVariant='filtered' />
    )

    expect(screen.getByText('Aucune dépense dans cette catégorie')).toBeInTheDocument()
  })

  it('uses a grid layout when expenses are present', () => {
    const { container } = render(
      <ExpensesList expenses={[mockExpense1]} onEdit={() => {}} onDelete={() => {}} />
    )

    expect(container.querySelector('.grid')).toBeInTheDocument()
  })
})
