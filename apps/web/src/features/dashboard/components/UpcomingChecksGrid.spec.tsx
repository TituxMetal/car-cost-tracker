import { beforeEach, describe, expect, it } from 'bun:test'

import type { CheckStatusSummary } from '~/features/check-logs'
import { cleanup, fireEvent, render, screen } from '~/test-utils'

import { UpcomingChecksGrid } from './UpcomingChecksGrid'

const summary = (overrides: Partial<CheckStatusSummary> = {}): CheckStatusSummary => ({
  checkTypeId: 'ct1',
  checkTypeName: 'Niveau d’huile moteur',
  intervalDays: 30,
  lastCompletedAt: '2026-04-01',
  nextDueAt: '2099-05-01',
  status: 'on-time',
  ...overrides
})

describe('UpcomingChecksGrid', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the kicker with the summaries count and the Journaliser CTA', () => {
    render(<UpcomingChecksGrid summaries={[summary({ checkTypeId: 'a' })]} onLog={() => {}} />)

    expect(screen.getByText(/prochains contrôles/i)).toBeInTheDocument()
    expect(screen.getByText(/1 types/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /journaliser/i })).toBeInTheDocument()
  })

  it('triggers onLog when the Journaliser CTA is clicked', () => {
    let clicked = 0

    render(
      <UpcomingChecksGrid
        summaries={[]}
        onLog={() => {
          clicked += 1
        }}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /journaliser/i }))

    expect(clicked).toBe(1)
  })

  it('renders one Gauge per summary', () => {
    render(
      <UpcomingChecksGrid
        summaries={[
          summary({ checkTypeId: 'a', checkTypeName: 'A' }),
          summary({ checkTypeId: 'b', checkTypeName: 'B' }),
          summary({ checkTypeId: 'c', checkTypeName: 'C', status: 'never', nextDueAt: null })
        ]}
        onLog={() => {}}
      />
    )

    expect(screen.getAllByRole('meter')).toHaveLength(3)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('renders no body list when summaries is empty', () => {
    render(<UpcomingChecksGrid summaries={[]} onLog={() => {}} />)

    expect(screen.queryByRole('list')).toBeNull()
  })

  it('shows JAMAIS sub label and zeroed gauge value for never status', () => {
    render(
      <UpcomingChecksGrid
        summaries={[
          summary({ status: 'never', nextDueAt: null, intervalDays: 365, checkTypeName: 'Filtre' })
        ]}
        onLog={() => {}}
      />
    )

    expect(screen.getByText('JAMAIS')).toBeInTheDocument()
    const meter = screen.getByRole('meter')
    expect(meter.getAttribute('aria-valuenow')).toBe('0')
    expect(meter.getAttribute('aria-valuemax')).toBe('365')
  })
})
