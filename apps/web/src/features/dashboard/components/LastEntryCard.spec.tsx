import { beforeEach, describe, expect, it } from 'bun:test'

import type { CheckLog } from '~/features/check-logs'
import { cleanup, render, screen } from '~/test-utils'

import { LastEntryCard } from './LastEntryCard'

const mockLog = (overrides: Partial<CheckLog> = {}): CheckLog => ({
  id: 'cl1',
  checkTypeId: 'ct1',
  checkTypeName: 'Liquide de refroidissement',
  completedAt: '2026-04-08',
  notes: 'Niveau OK, légèrement sous max. À surveiller.',
  nextDueAt: '2026-05-08',
  createdAt: '2026-04-08T10:00:00.000Z',
  ...overrides
})

describe('LastEntryCard', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the kicker label', () => {
    render(<LastEntryCard log={null} />)

    expect(screen.getByText(/dernière entrée/i)).toBeInTheDocument()
  })

  it('renders a Voir tout link pointing to /check-logs', () => {
    render(<LastEntryCard log={null} />)

    expect(screen.getByRole('link', { name: /voir tout/i })).toHaveAttribute('href', '/check-logs')
  })

  it('renders the empty fallback when log is null', () => {
    render(<LastEntryCard log={null} />)

    expect(screen.getByText('Aucune entrée pour le moment.')).toBeInTheDocument()
  })

  it('renders the formatted date, KM placeholder and check type heading when populated', () => {
    render(<LastEntryCard log={mockLog()} />)

    expect(screen.getByText('2026.04.08')).toBeInTheDocument()
    expect(screen.getByText(/— KM/)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: /Liquide de refroidissement/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/Niveau OK/)).toBeInTheDocument()
  })

  it('renders an em-dash when notes is null', () => {
    render(<LastEntryCard log={mockLog({ notes: null })} />)

    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
