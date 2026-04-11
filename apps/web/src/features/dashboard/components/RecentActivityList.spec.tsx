import { beforeEach, describe, expect, it } from 'bun:test'

import type { CheckLog } from '~/features/check-logs'
import { cleanup, render, screen } from '~/test-utils'

import { RecentActivityList } from './RecentActivityList'

const baseLog: CheckLog = {
  id: 'cl1',
  checkTypeId: 'ct1',
  checkTypeName: 'Vidange',
  completedAt: '2026-04-01',
  notes: 'Tout va bien',
  nextDueAt: '2026-05-01',
  createdAt: '2026-04-01T10:00:00.000Z'
}

describe('RecentActivityList', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the empty message when no logs are provided', () => {
    render(<RecentActivityList logs={[]} />)

    expect(screen.getByText('Aucun contrôle enregistré.')).toBeInTheDocument()
  })

  it('renders one entry per log with check type name and date', () => {
    render(
      <RecentActivityList
        logs={[
          baseLog,
          { ...baseLog, id: 'cl2', checkTypeName: 'Pression pneus', completedAt: '2026-03-29' }
        ]}
      />
    )

    expect(screen.getByRole('heading', { name: /Vidange/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Pression pneus/i })).toBeInTheDocument()
    expect(screen.getByText('01/04/2026')).toBeInTheDocument()
    expect(screen.getByText('29/03/2026')).toBeInTheDocument()
  })

  it('renders the notes excerpt when present', () => {
    render(<RecentActivityList logs={[baseLog]} />)

    expect(screen.getByText('Tout va bien')).toBeInTheDocument()
  })

  it('truncates notes longer than 80 characters with an ellipsis', () => {
    const longNotes = 'a'.repeat(120)
    render(<RecentActivityList logs={[{ ...baseLog, notes: longNotes }]} />)

    const expected = `${'a'.repeat(80)}…`
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it('does not render a notes paragraph when notes are null', () => {
    render(<RecentActivityList logs={[{ ...baseLog, notes: null }]} />)

    expect(screen.queryByText('Tout va bien')).not.toBeInTheDocument()
  })

  it('renders a "Voir tout" link pointing to /check-logs', () => {
    render(<RecentActivityList logs={[baseLog]} />)

    const link = screen.getByRole('link', { name: /Voir tout/i })
    expect(link).toHaveAttribute('href', '/check-logs')
  })

  it('renders inside a labelled region for accessibility', () => {
    render(<RecentActivityList logs={[baseLog]} />)

    expect(screen.getByRole('region', { name: /Activité récente/i })).toBeInTheDocument()
  })
})
