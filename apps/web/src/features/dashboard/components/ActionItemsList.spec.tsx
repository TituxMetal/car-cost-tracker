import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import type { ActionItem } from '../types'

import { ActionItemsList } from './ActionItemsList'

const items: ActionItem[] = [
  {
    checkTypeId: 'ct1',
    checkTypeName: 'Vidange',
    intervalDays: 30,
    lastCompletedAt: '2025-12-01',
    nextDueAt: '2026-01-01',
    status: 'overdue',
    daysLabel: '100 jours de retard'
  },
  {
    checkTypeId: 'ct2',
    checkTypeName: 'Pression pneus',
    intervalDays: 14,
    lastCompletedAt: '2026-04-01',
    nextDueAt: '2026-04-15',
    status: 'due-soon',
    daysLabel: 'dans 4 jours'
  }
]

describe('ActionItemsList', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders inside a labelled region with the cluster kicker and entry count', () => {
    render(<ActionItemsList items={items} onLog={mock(() => {})} />)

    expect(screen.getByRole('region', { name: /à traiter/i })).toBeInTheDocument()
    expect(screen.getByText(/à traiter · 2 entrées/i)).toBeInTheDocument()
  })

  it('renders one row per action item', () => {
    render(<ActionItemsList items={items} onLog={mock(() => {})} />)

    expect(screen.getByText('Vidange')).toBeInTheDocument()
    expect(screen.getByText('Pression pneus')).toBeInTheDocument()
  })

  it('hides the section on lg+ via the lg:hidden modifier', () => {
    const { container } = render(<ActionItemsList items={items} onLog={mock(() => {})} />)

    expect(container.querySelector('section')?.className).toContain('lg:hidden')
  })

  it('forwards onLog clicks with the correct checkTypeId', () => {
    const onLog = mock((_id: string) => {})

    render(<ActionItemsList items={items} onLog={onLog} />)
    screen.getByRole('button', { name: /Enregistrer le contrôle Pression pneus/i }).click()

    expect(onLog).toHaveBeenCalledWith('ct2')
  })

  it('shows the singular suffix when there is exactly one entry', () => {
    render(<ActionItemsList items={[items[0]!]} onLog={mock(() => {})} />)

    expect(screen.getByText(/à traiter · 1 entrée/i)).toBeInTheDocument()
  })
})
