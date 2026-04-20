import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'

import type { ExpenseCategory } from '../types'

import { ExpensesHeader } from './ExpensesHeader'

const emptyBreakdown: Record<ExpenseCategory, number> = {
  SERVICE: 0,
  PARTS: 0,
  LABOR: 0,
  OTHER: 0
}

describe('ExpensesHeader', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the page title', () => {
    render(
      <ExpensesHeader totalCents={0} totalsByCategory={emptyBreakdown} onAddExpense={() => {}} />
    )

    expect(screen.getByRole('heading', { name: /mes dépenses/i })).toBeInTheDocument()
  })

  it('renders the formatted total amount', () => {
    render(
      <ExpensesHeader
        totalCents={21450}
        totalsByCategory={{ ...emptyBreakdown, SERVICE: 21450 }}
        onAddExpense={() => {}}
      />
    )

    expect(screen.getByLabelText('Total des dépenses: 214,50 €')).toBeInTheDocument()
  })

  it('renders zero total when no expenses', () => {
    render(
      <ExpensesHeader totalCents={0} totalsByCategory={emptyBreakdown} onAddExpense={() => {}} />
    )

    expect(screen.getByText(/0,00/)).toBeInTheDocument()
  })

  it('renders only non-zero category rows', () => {
    render(
      <ExpensesHeader
        totalCents={21450}
        totalsByCategory={{ SERVICE: 8950, PARTS: 12500, LABOR: 0, OTHER: 0 }}
        onAddExpense={() => {}}
      />
    )

    expect(screen.getByText('Entretien')).toBeInTheDocument()
    expect(screen.getByText('Pièces')).toBeInTheDocument()
    expect(screen.queryByText("Main-d'œuvre")).toBeNull()
    expect(screen.queryByText('Autre')).toBeNull()
  })

  it('renders the per-category amounts', () => {
    render(
      <ExpensesHeader
        totalCents={21450}
        totalsByCategory={{ SERVICE: 8950, PARTS: 12500, LABOR: 0, OTHER: 0 }}
        onAddExpense={() => {}}
      />
    )

    expect(screen.getByText(/89,50/)).toBeInTheDocument()
    expect(screen.getByText(/125,00/)).toBeInTheDocument()
  })

  it('hides the breakdown list entirely when all categories are zero', () => {
    render(
      <ExpensesHeader totalCents={0} totalsByCategory={emptyBreakdown} onAddExpense={() => {}} />
    )

    expect(screen.queryByRole('list', { name: /répartition/i })).toBeNull()
  })

  it('calls onAddExpense when the "Ajouter" button is clicked', () => {
    const onAddExpense = mock(() => {})

    render(
      <ExpensesHeader
        totalCents={0}
        totalsByCategory={emptyBreakdown}
        onAddExpense={onAddExpense}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /ajouter une dépense/i }))

    expect(onAddExpense).toHaveBeenCalledTimes(1)
  })
})
