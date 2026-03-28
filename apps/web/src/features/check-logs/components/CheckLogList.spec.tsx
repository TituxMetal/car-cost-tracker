import { beforeEach, describe, expect, it } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import type { CheckLog } from '../types'

import { CheckLogList } from './CheckLogList'

const mockCheckLog1: CheckLog = {
  id: 'cl-1',
  checkTypeId: 'ct-1',
  checkTypeName: 'Vidange',
  completedAt: '2026-03-15',
  notes: 'All good',
  nextDueAt: '2026-03-22',
  createdAt: '2026-03-15T10:00:00Z'
}

const mockCheckLog2: CheckLog = {
  id: 'cl-2',
  checkTypeId: 'ct-1',
  checkTypeName: 'Vidange',
  completedAt: '2026-03-10',
  notes: null,
  nextDueAt: '2026-03-17',
  createdAt: '2026-03-10T10:00:00Z'
}

describe('CheckLogList', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render a card for each check log', () => {
    render(<CheckLogList checkLogs={[mockCheckLog1, mockCheckLog2]} onDelete={() => {}} />)

    expect(screen.getAllByText('Vidange')).toHaveLength(2)
  })

  it('should render empty state when no logs', () => {
    render(<CheckLogList checkLogs={[]} onDelete={() => {}} />)

    expect(screen.getByText('Aucun contrôle enregistré')).toBeInTheDocument()
  })

  it('should not render empty state when logs exist', () => {
    render(<CheckLogList checkLogs={[mockCheckLog1]} onDelete={() => {}} />)

    expect(screen.queryByText('Aucun contrôle enregistré')).toBeNull()
  })

  it('should use grid layout', () => {
    const { container } = render(<CheckLogList checkLogs={[mockCheckLog1]} onDelete={() => {}} />)

    const grid = container.querySelector('.grid')

    expect(grid).toBeInTheDocument()
  })
})
