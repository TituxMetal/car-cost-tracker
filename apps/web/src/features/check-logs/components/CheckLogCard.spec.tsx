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

  it('should render the completed date in DD.MM.YYYY (mobile) and DD.MM (desktop)', () => {
    render(<CheckLogCard checkLog={mockCheckLog} onDelete={() => {}} />)

    expect(screen.getByText('15.03.2026')).toBeInTheDocument()
    expect(screen.getByText('15.03')).toBeInTheDocument()
  })

  it('should render the next due date with PROCHAIN label on mobile and DD.MM on desktop', () => {
    render(<CheckLogCard checkLog={mockCheckLog} onDelete={() => {}} />)

    expect(screen.getByText(/PROCHAIN/)).toBeInTheDocument()
    expect(screen.getByText('22.03.2026')).toBeInTheDocument()
  })

  it('should render notes when present', () => {
    render(<CheckLogCard checkLog={mockCheckLog} onDelete={() => {}} />)

    expect(screen.getByText('Tout est OK')).toBeInTheDocument()
  })

  it('should render an em-dash placeholder when notes are null', () => {
    const { container } = render(
      <CheckLogCard checkLog={mockCheckLogNoNotes} onDelete={() => {}} />
    )

    const placeholder = container.querySelector('p.font-mono')

    expect(placeholder?.textContent).toBe('—')
  })

  it('should render delete button with accessible name', () => {
    render(<CheckLogCard checkLog={mockCheckLog} onDelete={() => {}} />)

    expect(
      screen.getByRole('button', { name: /supprimer le contrôle vidange/i })
    ).toBeInTheDocument()
  })

  it('should call onDelete with check log when delete button clicked', () => {
    const onDelete = mock(() => {})
    render(<CheckLogCard checkLog={mockCheckLog} onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: /supprimer/i }))

    expect(onDelete).toHaveBeenCalledWith(mockCheckLog)
  })

  it('should apply status-driven left border (overdue when nextDueAt is in the past)', () => {
    const past = new Date()
    past.setDate(past.getDate() - 5)
    const isoPast = past.toISOString().split('T')[0]
    const overdueLog: CheckLog = { ...mockCheckLog, nextDueAt: isoPast }

    const { container } = render(<CheckLogCard checkLog={overdueLog} onDelete={() => {}} />)

    const article = container.querySelector('article')

    expect(article).toHaveClass('border-l-error')
  })

  it('should preserve article/header/h3/time/footer semantic markup', () => {
    const { container } = render(<CheckLogCard checkLog={mockCheckLog} onDelete={() => {}} />)

    expect(container.querySelector('article')).toBeInTheDocument()
    expect(container.querySelector('article > header')).toBeInTheDocument()
    expect(container.querySelector('article > footer')).toBeInTheDocument()
    expect(container.querySelector('h3')).toBeInTheDocument()
    expect(container.querySelectorAll('time').length).toBeGreaterThanOrEqual(2)
  })
})
