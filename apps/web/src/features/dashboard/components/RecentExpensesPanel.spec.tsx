import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import { $expenses, expenseActions } from '~/features/expenses/store'
import { act, cleanup, render, screen } from '~/test-utils'

import { RecentExpensesPanel } from './RecentExpensesPanel'

const todayMonthPrefix = (() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
})()

const buildExpense = (
  id: string,
  amountCents: number,
  dayOffset = 1,
  category: 'SERVICE' | 'PARTS' | 'LABOR' | 'OTHER' = 'SERVICE'
) => ({
  id,
  vehicleId: 'v1',
  occurredAt: `${todayMonthPrefix}-${String(dayOffset).padStart(2, '0')}`,
  amountCents,
  category,
  description: null,
  createdAt: '2026-04-01T00:00:00.000Z',
  updatedAt: '2026-04-01T00:00:00.000Z'
})

const renderPanel = async (vehicleId = 'v1') => {
  await act(async () => {
    render(<RecentExpensesPanel vehicleId={vehicleId} />)
  })
}

describe('RecentExpensesPanel', () => {
  let fetchExpensesSpy: ReturnType<typeof spyOn<typeof expenseActions, 'fetchExpenses'>>

  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
    $expenses.set([])
    fetchExpensesSpy = spyOn(expenseActions, 'fetchExpenses').mockResolvedValue(undefined)
  })

  afterEach(() => {
    cleanup()
    fetchExpensesSpy.mockRestore()
    $expenses.set([])
  })

  it('returns null when hasExpenses is false', () => {
    const { container } = render(<RecentExpensesPanel vehicleId='v1' />)

    expect(container.firstChild).toBeNull()
  })

  it('fetches expenses on mount with the given vehicleId', async () => {
    await renderPanel('v42')

    expect(fetchExpensesSpy).toHaveBeenCalledWith('v42')
  })

  it('renders the Dépenses récentes kicker and the spent-this-month total in font-mono', async () => {
    $expenses.set([buildExpense('e1', 8000, 5), buildExpense('e2', 4550, 4)])

    await renderPanel()

    expect(screen.getByText('Dépenses récentes')).toBeInTheDocument()
    const total = screen.getByText('125,50 €')
    expect(total).toHaveClass('font-mono')
  })

  it('renders at most 3 expense rows even when more exist', async () => {
    $expenses.set([
      buildExpense('e1', 1000, 5),
      buildExpense('e2', 2000, 4),
      buildExpense('e3', 3000, 3),
      buildExpense('e4', 4000, 2),
      buildExpense('e5', 5000, 1)
    ])

    await renderPanel()

    const rows = screen.getByTestId('recent-expenses-rows').querySelectorAll('li')
    expect(rows.length).toBe(3)
  })

  it('links to /expenses via a Voir tout action', async () => {
    $expenses.set([buildExpense('e1', 1000, 5)])

    await renderPanel()

    expect(screen.getByRole('link', { name: /voir tout/i })).toHaveAttribute('href', '/expenses')
  })

  const paletteCases: Array<{
    category: 'SERVICE' | 'PARTS' | 'LABOR' | 'OTHER'
    label: string
    expectedTokenClass: string
  }> = [
    { category: 'SERVICE', label: 'Entretien', expectedTokenClass: 'text-accent' },
    { category: 'PARTS', label: 'Pièces', expectedTokenClass: 'text-info' },
    { category: 'LABOR', label: `Main-d'œuvre`, expectedTokenClass: 'text-secondary' },
    { category: 'OTHER', label: 'Autre', expectedTokenClass: 'text-primary' }
  ]

  paletteCases.forEach(({ category, label, expectedTokenClass }) => {
    it(`renders the ${category} badge with the ${expectedTokenClass} cluster tint`, async () => {
      $expenses.set([{ ...buildExpense('palette', 1000, 5), category }])

      await renderPanel()

      expect(screen.getByText(label)).toHaveClass(expectedTokenClass)
    })
  })
})
