import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'

import {
  $budget,
  $error as $budgetError,
  $isLoading as $budgetLoading,
  budgetActions
} from '~/features/budget/store'
import { $expenses } from '~/features/expenses/store'
import { act, cleanup, render, screen, within } from '~/test-utils'

import { BudgetPanel } from './BudgetPanel'

const todayMonthPrefix = (() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
})()

const todayYearPrefix = (() => {
  const now = new Date()

  return String(now.getFullYear())
})()

const buildExpenseThisMonth = (id: string, amountCents: number, dayOffset = 1) => ({
  id,
  vehicleId: 'v1',
  occurredAt: `${todayMonthPrefix}-${String(dayOffset).padStart(2, '0')}`,
  amountCents,
  category: 'SERVICE' as const,
  description: null,
  createdAt: `${todayMonthPrefix}-${String(dayOffset).padStart(2, '0')}T00:00:00.000Z`,
  updatedAt: `${todayMonthPrefix}-${String(dayOffset).padStart(2, '0')}T00:00:00.000Z`
})

const buildExpenseEarlierThisYear = (id: string, amountCents: number) => {
  const now = new Date()
  const earlierMonth = String(((now.getMonth() + 11) % 12) + 1).padStart(2, '0')
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  const occurredAt = `${year}-${earlierMonth}-15`

  return {
    id,
    vehicleId: 'v1',
    occurredAt: occurredAt.startsWith(todayYearPrefix)
      ? occurredAt
      : `${todayYearPrefix}-${earlierMonth}-15`,
    amountCents,
    category: 'SERVICE' as const,
    description: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
}

const setBudget = (amountCents: number, period: 'MONTHLY' | 'ANNUAL' = 'MONTHLY') => {
  $budget.set({
    id: 'b1',
    vehicleId: 'v1',
    amountCents,
    period,
    createdAt: '2026-04-01T00:00:00.000Z',
    updatedAt: '2026-04-01T00:00:00.000Z'
  })
}

const setSpentThisMonth = (totalCents: number) => {
  $expenses.set(totalCents > 0 ? [buildExpenseThisMonth('e-current', totalCents)] : [])
}

const renderPanel = async (vehicleId = 'v1') => {
  await act(async () => {
    render(<BudgetPanel vehicleId={vehicleId} />)
  })
}

describe('BudgetPanel', () => {
  let fetchBudgetSpy: ReturnType<typeof spyOn<typeof budgetActions, 'fetchBudget'>>

  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
    $budget.set(null)
    $budgetLoading.set(false)
    $budgetError.set(null)
    $expenses.set([])
    fetchBudgetSpy = spyOn(budgetActions, 'fetchBudget').mockResolvedValue(null)
  })

  afterEach(() => {
    cleanup()
    fetchBudgetSpy.mockRestore()
    $budget.set(null)
    $expenses.set([])
  })

  it('returns null when hasBudget is false', () => {
    const { container } = render(<BudgetPanel vehicleId='v1' />)

    expect(container.firstChild).toBeNull()
  })

  it('fetches the budget on mount with the given vehicleId', async () => {
    await renderPanel('v42')

    expect(fetchBudgetSpy).toHaveBeenCalledWith('v42')
  })

  it('renders both Mensuel and Annuel sub-sections regardless of budget period', async () => {
    setBudget(30000, 'MONTHLY')
    setSpentThisMonth(25000)

    await renderPanel()

    expect(screen.getByText('Budget')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Mensuel' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Annuel' })).toBeInTheDocument()
  })

  it('renders the monthly spent amount in font-mono inside the Mensuel section', async () => {
    setBudget(30000, 'MONTHLY')
    setSpentThisMonth(25500)

    await renderPanel()

    const monthly = screen.getByRole('region', { name: 'Mensuel' })
    const spent = within(monthly).getByText('255,00 €')

    expect(spent).toHaveClass('font-mono')
  })

  it('renders the annual spent total separately when expenses span the year', async () => {
    setBudget(30000, 'MONTHLY')
    $expenses.set([
      buildExpenseThisMonth('current', 25000),
      buildExpenseEarlierThisYear('previous', 50000)
    ])

    await renderPanel()

    const annual = screen.getByRole('region', { name: 'Annuel' })
    expect(within(annual).getByText('750,00 €')).toBeInTheDocument()
  })

  it('renders a single Modifier link pointing to /budget at the panel header', async () => {
    setBudget(30000)
    setSpentThisMonth(0)

    await renderPanel()

    const links = screen.getAllByRole('link', { name: /modifier/i })

    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/budget')
  })

  it('applies progress-warning to the monthly progress when spending crosses NEAR_LIMIT', async () => {
    setBudget(30000)
    setSpentThisMonth(25000)

    const { container } = render(<BudgetPanel vehicleId='v1' />)
    const progress = container.querySelectorAll('progress')

    expect(progress[0]?.className).toContain('progress-warning')
  })

  it('applies progress-error and Dépassement to the monthly section when over the budget', async () => {
    setBudget(30000)
    setSpentThisMonth(35000)

    await renderPanel()

    const monthly = screen.getByRole('region', { name: 'Mensuel' })
    expect(within(monthly).getByText(/dépassement/i)).toBeInTheDocument()
    expect(monthly.querySelector('progress')?.className).toContain('progress-error')
  })

  it('includes screen-reader narrations for both monthly and annual progress', async () => {
    setBudget(30000)
    setSpentThisMonth(15000)

    await renderPanel()

    expect(screen.getByText(/du budget mensuel utilisé/i)).toBeInTheDocument()
    expect(screen.getByText(/du budget annuel utilisé/i)).toBeInTheDocument()
  })
})
