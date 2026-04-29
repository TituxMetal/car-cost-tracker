import { beforeEach, describe, expect, it } from 'bun:test'

import type { CheckLog } from '~/features/check-logs'
import { cleanup, render, screen } from '~/test-utils'

import { RecentTimeline } from './RecentTimeline'

const isoDaysAgo = (days: number): string => {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

const log = (overrides: Partial<CheckLog> = {}): CheckLog => ({
  id: 'cl1',
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  completedAt: isoDaysAgo(0),
  notes: null,
  nextDueAt: isoDaysAgo(-30),
  createdAt: '2026-04-01T10:00:00.000Z',
  ...overrides
})

describe('RecentTimeline', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the section landmark, kicker, axis labels', () => {
    render(<RecentTimeline logs={[]} />)

    expect(screen.getByRole('region', { name: /timeline 30 derniers jours/i })).toBeInTheDocument()
    expect(screen.getByText(/timeline · 30 derniers jours/i)).toBeInTheDocument()
    expect(screen.getByText('J-30')).toBeInTheDocument()
    expect(screen.getByText('AUJ.')).toBeInTheDocument()
    expect(screen.getByText('J+30')).toBeInTheDocument()
  })

  it('renders no dots when the logs array is empty', () => {
    render(<RecentTimeline logs={[]} />)

    expect(screen.queryAllByTestId('timeline-dot')).toHaveLength(0)
  })

  it('renders one dot per log inside the [-30, +30] day window', () => {
    render(
      <RecentTimeline
        logs={[
          log({ id: 'a', completedAt: isoDaysAgo(0) }),
          log({ id: 'b', completedAt: isoDaysAgo(15) }),
          log({ id: 'c', completedAt: isoDaysAgo(30) })
        ]}
      />
    )

    expect(screen.getAllByTestId('timeline-dot')).toHaveLength(3)
  })

  it('filters out logs whose completedAt falls outside the window', () => {
    render(
      <RecentTimeline
        logs={[
          log({ id: 'a', completedAt: isoDaysAgo(0) }),
          log({ id: 'b', completedAt: isoDaysAgo(45) }),
          log({ id: 'c', completedAt: isoDaysAgo(60) })
        ]}
      />
    )

    expect(screen.getAllByTestId('timeline-dot')).toHaveLength(1)
  })
})
