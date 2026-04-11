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

  it('renders the all-clear empty state when no items are provided', () => {
    render(<ActionItemsList items={[]} onLog={mock(() => {})} />)

    expect(screen.getByText('Tous les contrôles sont à jour !')).toBeInTheDocument()
  })

  it('renders one action item per entry in the list', () => {
    render(<ActionItemsList items={items} onLog={mock(() => {})} />)

    expect(screen.getByRole('heading', { name: /Vidange/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Pression pneus/i })).toBeInTheDocument()
  })

  it('renders inside a labelled region for accessibility', () => {
    render(<ActionItemsList items={items} onLog={mock(() => {})} />)

    expect(screen.getByRole('region', { name: /À faire/i })).toBeInTheDocument()
  })

  it('forwards onLog clicks with the correct checkTypeId', () => {
    const onLog = mock((_id: string) => {})

    render(<ActionItemsList items={items} onLog={onLog} />)
    screen.getByRole('button', { name: /Enregistrer le contrôle Pression pneus/i }).click()

    expect(onLog).toHaveBeenCalledWith('ct2')
  })
})
