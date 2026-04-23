import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import type { Budget, BudgetStatus as BudgetStatusValue } from '../types'

import { BudgetStatus } from './BudgetStatus'

const mockBudget = (overrides: Partial<Budget> = {}): Budget => ({
  id: 'b1',
  vehicleId: 'v1',
  amountCents: 25000,
  period: 'MONTHLY',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  ...overrides
})

const mockStatus = (overrides: Partial<BudgetStatusValue> = {}): BudgetStatusValue => ({
  spentCents: 5000,
  targetCents: 25000,
  remainingCents: 20000,
  progressRatio: 5000 / 25000,
  state: 'ON_TRACK',
  ...overrides
})

describe('BudgetStatus', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders both "Ce mois" and "Cette année" panel headings', () => {
    render(
      <BudgetStatus
        budget={mockBudget()}
        monthlyStatus={mockStatus()}
        annualStatus={mockStatus({
          spentCents: 40000,
          targetCents: 300000,
          remainingCents: 260000
        })}
      />
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Ce mois' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Cette année' })).toBeInTheDocument()
  })

  it('formats spent, target and remaining amounts', () => {
    render(
      <BudgetStatus
        budget={mockBudget()}
        monthlyStatus={mockStatus({ spentCents: 5000, targetCents: 25000, remainingCents: 20000 })}
        annualStatus={mockStatus({
          spentCents: 40000,
          targetCents: 300000,
          remainingCents: 260000
        })}
      />
    )

    expect(screen.getAllByText(/50,00\s*€/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/250,00\s*€/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/200,00\s*€/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/400,00\s*€/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/3\s*000,00\s*€/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/2\s*600,00\s*€/).length).toBeGreaterThan(0)
  })

  it('shows "Dépassement" with the absolute overrun when overspent', () => {
    render(
      <BudgetStatus
        budget={mockBudget()}
        monthlyStatus={mockStatus({
          spentCents: 30000,
          targetCents: 25000,
          remainingCents: -5000,
          progressRatio: 30000 / 25000,
          state: 'OVERSPENT'
        })}
        annualStatus={mockStatus()}
      />
    )

    expect(screen.getByText('Dépassement')).toBeInTheDocument()
    expect(screen.getByText('Budget dépassé')).toBeInTheDocument()
  })

  it('renders the ON_TRACK state message', () => {
    render(
      <BudgetStatus
        budget={mockBudget()}
        monthlyStatus={mockStatus({ state: 'ON_TRACK' })}
        annualStatus={mockStatus({ state: 'ON_TRACK' })}
      />
    )

    expect(screen.getAllByText('Dans les clous').length).toBe(2)
  })

  it('renders the NEAR_LIMIT state message', () => {
    render(
      <BudgetStatus
        budget={mockBudget()}
        monthlyStatus={mockStatus({ state: 'NEAR_LIMIT' })}
        annualStatus={mockStatus({ state: 'ON_TRACK' })}
      />
    )

    expect(screen.getByText('Proche de la limite')).toBeInTheDocument()
  })

  it('adapts the derivation hint for a MONTHLY budget', () => {
    render(
      <BudgetStatus
        budget={mockBudget({ period: 'MONTHLY', amountCents: 25000 })}
        monthlyStatus={mockStatus()}
        annualStatus={mockStatus()}
      />
    )

    expect(screen.getByText(/dérivé de votre budget mensuel/i)).toBeInTheDocument()
  })

  it('adapts the derivation hint for an ANNUAL budget', () => {
    render(
      <BudgetStatus
        budget={mockBudget({ period: 'ANNUAL', amountCents: 300000 })}
        monthlyStatus={mockStatus()}
        annualStatus={mockStatus()}
      />
    )

    expect(screen.getByText(/dérivé de votre budget annuel/i)).toBeInTheDocument()
  })

  it('caps the progress bar value at 100 even when ratio is above 1', () => {
    render(
      <BudgetStatus
        budget={mockBudget()}
        monthlyStatus={mockStatus({
          spentCents: 50000,
          targetCents: 25000,
          remainingCents: -25000,
          progressRatio: 2,
          state: 'OVERSPENT'
        })}
        annualStatus={mockStatus()}
      />
    )

    const bars = screen.getAllByRole('progressbar')
    const cappedBar = bars.find(bar => bar.getAttribute('value') === '100')
    expect(cappedBar).toBeDefined()
  })
})
