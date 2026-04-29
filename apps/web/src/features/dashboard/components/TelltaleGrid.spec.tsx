import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import type { TelltaleSummary } from '../types'

import { TelltaleGrid } from './TelltaleGrid'

const summary = (overrides: Partial<TelltaleSummary> = {}): TelltaleSummary => ({
  checkTypeId: 'ct1',
  name: 'Huile',
  status: 'overdue',
  ...overrides
})

describe('TelltaleGrid', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the kicker label as a section landmark', () => {
    render(<TelltaleGrid summaries={[]} />)

    expect(screen.getByRole('region', { name: /voyants actifs/i })).toBeInTheDocument()
    expect(screen.getByText(/voyants actifs/i)).toBeInTheDocument()
  })

  it('renders the empty fallback when no summaries are provided', () => {
    render(<TelltaleGrid summaries={[]} />)

    expect(screen.getByText('Aucun voyant actif.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('renders one list item per summary with the corresponding label', () => {
    render(
      <TelltaleGrid
        summaries={[
          summary({ checkTypeId: 'a', name: 'Huile', status: 'overdue' }),
          summary({ checkTypeId: 'b', name: 'Pneus', status: 'due-soon' }),
          summary({ checkTypeId: 'c', name: 'Filtre Air', status: 'never' }),
          summary({ checkTypeId: 'd', name: 'Frein', status: 'on-time' })
        ]}
      />
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByText('Huile')).toBeInTheDocument()
    expect(screen.getByText('Pneus')).toBeInTheDocument()
    expect(screen.getByText('Filtre Air')).toBeInTheDocument()
    expect(screen.getByText('Frein')).toBeInTheDocument()
  })

  it('applies status-driven label colours per row', () => {
    render(
      <TelltaleGrid
        summaries={[
          summary({ checkTypeId: 'a', name: 'A', status: 'overdue' }),
          summary({ checkTypeId: 'b', name: 'B', status: 'due-soon' }),
          summary({ checkTypeId: 'c', name: 'C', status: 'never' }),
          summary({ checkTypeId: 'd', name: 'D', status: 'on-time' })
        ]}
      />
    )

    expect(screen.getByText('A')).toHaveClass('text-error')
    expect(screen.getByText('B')).toHaveClass('text-warning')
    expect(screen.getByText('C')).toHaveClass('text-info')
    expect(screen.getByText('D')).toHaveClass('text-base-content/40')
  })
})
