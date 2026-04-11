import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import type { ActionItem } from '../types'

import { ActionItemCard } from './ActionItemCard'

const overdueItem: ActionItem = {
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  intervalDays: 30,
  lastCompletedAt: '2025-12-01',
  nextDueAt: '2026-01-01',
  status: 'overdue',
  daysLabel: '100 jours de retard'
}

const dueSoonItem: ActionItem = {
  checkTypeId: 'ct2',
  checkTypeName: 'Pression pneus',
  intervalDays: 14,
  lastCompletedAt: '2026-04-01',
  nextDueAt: '2026-04-15',
  status: 'due-soon',
  daysLabel: 'dans 4 jours'
}

describe('ActionItemCard', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the check type name as a heading', () => {
    render(<ActionItemCard item={overdueItem} onLog={mock(() => {})} />)

    expect(screen.getByRole('heading', { name: /Vidange/i })).toBeInTheDocument()
  })

  it('renders the status badge label', () => {
    render(<ActionItemCard item={overdueItem} onLog={mock(() => {})} />)

    expect(screen.getByText('En retard')).toBeInTheDocument()
  })

  it('renders the days label next to the badge', () => {
    render(<ActionItemCard item={overdueItem} onLog={mock(() => {})} />)

    expect(screen.getByText('100 jours de retard')).toBeInTheDocument()
  })

  it('exposes an aria-label that includes the check type name', () => {
    render(<ActionItemCard item={overdueItem} onLog={mock(() => {})} />)

    expect(
      screen.getByRole('button', { name: /Enregistrer le contrôle Vidange/i })
    ).toBeInTheDocument()
  })

  it('calls onLog with the checkTypeId when the button is clicked', () => {
    const onLog = mock((_id: string) => {})

    render(<ActionItemCard item={dueSoonItem} onLog={onLog} />)
    screen.getByRole('button', { name: /Enregistrer le contrôle Pression pneus/i }).click()

    expect(onLog).toHaveBeenCalledWith('ct2')
  })

  it('uses the destructive accent for overdue items', () => {
    const { container } = render(<ActionItemCard item={overdueItem} onLog={mock(() => {})} />)

    expect(container.querySelector('article')?.className).toContain('border-error')
  })

  it('uses the warning accent for due-soon items', () => {
    const { container } = render(<ActionItemCard item={dueSoonItem} onLog={mock(() => {})} />)

    expect(container.querySelector('article')?.className).toContain('border-warning')
  })
})
