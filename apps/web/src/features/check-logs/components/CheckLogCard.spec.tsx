import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'

import type { CheckLog } from '../types'

import { CheckLogCard } from './CheckLogCard'

const mockCheckLog: CheckLog = {
  id: 'cl-1',
  checkTypeId: 'ct-1',
  checkTypeName: 'Vidange',
  completedAt: '2026-03-15',
  notes: 'Tout est OK',
  nextDueAt: '2026-03-22',
  createdAt: '2026-03-15T10:00:00Z'
}

const mockCheckLogNoNotes: CheckLog = {
  ...mockCheckLog,
  id: 'cl-2',
  notes: null
}

describe('CheckLogCard', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render the check type name', () => {
    render(<CheckLogCard checkLog={mockCheckLog} onDelete={() => {}} />)

    expect(screen.getByText('Vidange')).toBeInTheDocument()
  })

  it('should render the completed date', () => {
    render(<CheckLogCard checkLog={mockCheckLog} onDelete={() => {}} />)

    expect(screen.getByText(/Effectué le 2026-03-15/)).toBeInTheDocument()
  })

  it('should render the next due date', () => {
    render(<CheckLogCard checkLog={mockCheckLog} onDelete={() => {}} />)

    expect(screen.getByText(/Prochain le 2026-03-22/)).toBeInTheDocument()
  })

  it('should render notes when present', () => {
    render(<CheckLogCard checkLog={mockCheckLog} onDelete={() => {}} />)

    expect(screen.getByText('Tout est OK')).toBeInTheDocument()
  })

  it('should not render notes when null', () => {
    render(<CheckLogCard checkLog={mockCheckLogNoNotes} onDelete={() => {}} />)

    expect(screen.queryByText('Tout est OK')).toBeNull()
  })

  it('should render delete button', () => {
    render(<CheckLogCard checkLog={mockCheckLog} onDelete={() => {}} />)

    expect(screen.getByRole('button', { name: /supprimer/i })).toBeInTheDocument()
  })

  it('should call onDelete with check log when delete button clicked', () => {
    const onDelete = mock(() => {})
    render(<CheckLogCard checkLog={mockCheckLog} onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))

    expect(onDelete).toHaveBeenCalledWith(mockCheckLog)
  })
})
