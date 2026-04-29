import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import type { ActionItem } from '../types'

import { ActionItemCard } from './ActionItemCard'

const isoDaysAhead = (days: number): string => {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

const overdueItem: ActionItem = {
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  intervalDays: 30,
  lastCompletedAt: '2025-12-01',
  nextDueAt: isoDaysAhead(-32),
  status: 'overdue',
  daysLabel: '32 jours de retard'
}

const dueSoonItem: ActionItem = {
  checkTypeId: 'ct2',
  checkTypeName: 'Pression pneus',
  intervalDays: 14,
  lastCompletedAt: '2026-04-01',
  nextDueAt: isoDaysAhead(2),
  status: 'due-soon',
  daysLabel: 'dans 2 jours'
}

describe('ActionItemCard', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the check type name and status label', () => {
    render(<ActionItemCard item={overdueItem} onLog={mock(() => {})} />)

    expect(screen.getByText('Vidange')).toBeInTheDocument()
    expect(screen.getByText('En retard')).toBeInTheDocument()
  })

  it('exposes an aria-label that includes the check type name', () => {
    render(<ActionItemCard item={overdueItem} onLog={mock(() => {})} />)

    expect(
      screen.getByRole('button', { name: /Enregistrer le contrôle Vidange/i })
    ).toBeInTheDocument()
  })

  it('calls onLog with the checkTypeId when the row is clicked', () => {
    const onLog = mock((_id: string) => {})

    render(<ActionItemCard item={dueSoonItem} onLog={onLog} />)
    screen.getByRole('button', { name: /Enregistrer le contrôle Pression pneus/i }).click()

    expect(onLog).toHaveBeenCalledWith('ct2')
  })

  it('shows a +N glyph for overdue items', () => {
    render(<ActionItemCard item={overdueItem} onLog={mock(() => {})} />)

    expect(screen.getByText('+32')).toBeInTheDocument()
  })

  it('shows the remaining-days glyph for due-soon items', () => {
    render(<ActionItemCard item={dueSoonItem} onLog={mock(() => {})} />)

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('uses the destructive accent for overdue items', () => {
    const { container } = render(<ActionItemCard item={overdueItem} onLog={mock(() => {})} />)

    expect(container.querySelector('button')?.className).toContain('border-l-error')
  })

  it('uses the warning accent for due-soon items', () => {
    const { container } = render(<ActionItemCard item={dueSoonItem} onLog={mock(() => {})} />)

    expect(container.querySelector('button')?.className).toContain('border-l-warning')
  })
})
