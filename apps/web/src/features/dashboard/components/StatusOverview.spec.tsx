import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { StatusOverview } from './StatusOverview'

describe('StatusOverview', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders all four status labels', () => {
    render(<StatusOverview counts={{ onTime: 0, dueSoon: 0, overdue: 0, never: 0 }} />)

    expect(screen.getByText('À jour')).toBeInTheDocument()
    expect(screen.getByText('Bientôt')).toBeInTheDocument()
    expect(screen.getByText('En retard')).toBeInTheDocument()
    expect(screen.getByText('Jamais')).toBeInTheDocument()
  })

  it('renders the provided counts next to each label', () => {
    render(<StatusOverview counts={{ onTime: 3, dueSoon: 1, overdue: 2, never: 4 }} />)

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders zero counts gracefully', () => {
    render(<StatusOverview counts={{ onTime: 0, dueSoon: 0, overdue: 0, never: 0 }} />)

    const zeros = screen.getAllByText('0')
    expect(zeros).toHaveLength(4)
  })

  it('exposes a labelled region for screen readers', () => {
    render(<StatusOverview counts={{ onTime: 1, dueSoon: 2, overdue: 3, never: 4 }} />)

    expect(screen.getByRole('region', { name: /Statut des contrôles/i })).toBeInTheDocument()
  })
})
