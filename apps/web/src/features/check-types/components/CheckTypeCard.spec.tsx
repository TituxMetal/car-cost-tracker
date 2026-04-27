import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'

import type { CheckType } from '../types'

import { CheckTypeCard } from './CheckTypeCard'

const mockCheckType: CheckType = {
  id: 'ct-1',
  vehicleId: 'v-1',
  name: `Niveau d'huile`,
  description: `Vérifier le niveau d'huile moteur`,
  intervalDays: 14,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
}

const mockCheckTypeNoDescription: CheckType = {
  ...mockCheckType,
  id: 'ct-2',
  description: null
}

describe('CheckTypeCard', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render the check type name', () => {
    const actions = mock(() => {})
    render(<CheckTypeCard checkType={mockCheckType} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText(mockCheckType.name)).toBeInTheDocument()
  })

  it('should render the description when present', () => {
    const actions = mock(() => {})
    render(<CheckTypeCard checkType={mockCheckType} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText(mockCheckType.description!)).toBeInTheDocument()
  })

  it('should not render description when null', () => {
    const actions = mock(() => {})
    render(
      <CheckTypeCard checkType={mockCheckTypeNoDescription} onEdit={actions} onDelete={actions} />
    )

    expect(screen.queryByText(mockCheckType.description!)).toBeNull()
  })

  it('should render the INTERV/DERNIER/PROCHAIN mini-table kickers', () => {
    const actions = mock(() => {})
    render(<CheckTypeCard checkType={mockCheckType} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText('INTERV.')).toBeInTheDocument()
    expect(screen.getByText('DERNIER')).toBeInTheDocument()
    expect(screen.getByText('PROCHAIN')).toBeInTheDocument()
  })

  it('should render the interval as {N}j in the INTERV cell', () => {
    const actions = mock(() => {})
    render(<CheckTypeCard checkType={mockCheckType} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText('14j')).toBeInTheDocument()
  })

  it('should render dernier as DD.MM when lastCompletedAt is provided', () => {
    const actions = mock(() => {})
    render(
      <CheckTypeCard
        checkType={mockCheckType}
        onEdit={actions}
        onDelete={actions}
        status='on-time'
        lastCompletedAt='2026-03-02T08:00:00Z'
        nextDueAt='2026-04-15T08:00:00Z'
      />
    )

    expect(screen.getByText('02.03')).toBeInTheDocument()
  })

  it('should render dernier as em-dash when lastCompletedAt is null', () => {
    const actions = mock(() => {})
    const { container } = render(
      <CheckTypeCard
        checkType={mockCheckType}
        onEdit={actions}
        onDelete={actions}
        status='never'
        lastCompletedAt={null}
        nextDueAt={null}
      />
    )

    const dashes = container.querySelectorAll('dd.font-mono')

    // intervalDays cell + 2 em-dash cells (dernier + prochain)
    expect(Array.from(dashes).filter(el => el.textContent === '—').length).toBe(2)
  })

  it('should render prochain as +Nj when overdue', () => {
    const actions = mock(() => {})
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const past = new Date(today.getTime() - 5 * 86_400_000)

    render(
      <CheckTypeCard
        checkType={mockCheckType}
        onEdit={actions}
        onDelete={actions}
        status='overdue'
        lastCompletedAt='2026-01-15T08:00:00Z'
        nextDueAt={past.toISOString()}
      />
    )

    expect(screen.getByText('+5j')).toBeInTheDocument()
  })

  it('should render prochain as J-N when on-time', () => {
    const actions = mock(() => {})
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const future = new Date(today.getTime() + 21 * 86_400_000)

    render(
      <CheckTypeCard
        checkType={mockCheckType}
        onEdit={actions}
        onDelete={actions}
        status='on-time'
        lastCompletedAt='2026-01-15T08:00:00Z'
        nextDueAt={future.toISOString()}
      />
    )

    expect(screen.getByText('J-21')).toBeInTheDocument()
  })

  it('should apply status-driven left border class', () => {
    const actions = mock(() => {})
    const { container } = render(
      <CheckTypeCard
        checkType={mockCheckType}
        onEdit={actions}
        onDelete={actions}
        status='overdue'
      />
    )

    const article = container.querySelector('article')

    expect(article).not.toBeNull()
    expect(article).toHaveClass('border-l-error')
  })

  it('should apply neutral border when status is undefined', () => {
    const actions = mock(() => {})
    const { container } = render(
      <CheckTypeCard checkType={mockCheckType} onEdit={actions} onDelete={actions} />
    )

    const article = container.querySelector('article')

    expect(article).toHaveClass('border-l-base-content/30')
  })

  it('should render edit and delete buttons', () => {
    const actions = mock(() => {})
    render(<CheckTypeCard checkType={mockCheckType} onEdit={actions} onDelete={actions} />)

    expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /supprimer/i })).toBeInTheDocument()
  })

  it('should call onEdit with check type when edit button clicked', () => {
    const onEdit = mock(() => {})
    const onDelete = mock(() => {})
    render(<CheckTypeCard checkType={mockCheckType} onEdit={onEdit} onDelete={onDelete} />)

    const editButton = screen.getByRole('button', { name: /modifier/i })
    fireEvent.click(editButton)

    expect(onEdit).toHaveBeenCalledWith(mockCheckType)
  })

  it('should call onDelete with check type when delete button clicked', () => {
    const onEdit = mock(() => {})
    const onDelete = mock(() => {})
    render(<CheckTypeCard checkType={mockCheckType} onEdit={onEdit} onDelete={onDelete} />)

    const deleteButton = screen.getByRole('button', { name: /supprimer/i })
    fireEvent.click(deleteButton)

    expect(onDelete).toHaveBeenCalledWith(mockCheckType)
  })

  it('should render CheckStatusBadge when status is provided', () => {
    const actions = mock(() => {})

    render(
      <CheckTypeCard
        checkType={mockCheckType}
        onEdit={actions}
        onDelete={actions}
        status='on-time'
      />
    )

    expect(screen.getByText(/à jour/i)).toBeInTheDocument()
  })

  it('should not render CheckStatusBadge when status is not provided', () => {
    const actions = mock(() => {})

    render(<CheckTypeCard checkType={mockCheckType} onEdit={actions} onDelete={actions} />)

    expect(screen.queryByText(/à jour/i)).toBeNull()
  })

  it('should render log button when onLog is provided', () => {
    const actions = mock(() => {})

    render(
      <CheckTypeCard
        checkType={mockCheckType}
        onEdit={actions}
        onDelete={actions}
        onLog={actions}
      />
    )

    expect(screen.getByRole('button', { name: /journaliser/i })).toBeInTheDocument()
  })

  it('should not render log button when onLog is not provided', () => {
    const actions = mock(() => {})

    render(<CheckTypeCard checkType={mockCheckType} onEdit={actions} onDelete={actions} />)

    expect(screen.queryByRole('button', { name: /journaliser/i })).toBeNull()
  })

  it('should call onLog with checkType when log button clicked', () => {
    const onLog = mock(() => {})
    const actions = mock(() => {})

    render(
      <CheckTypeCard checkType={mockCheckType} onEdit={actions} onDelete={actions} onLog={onLog} />
    )

    fireEvent.click(screen.getByRole('button', { name: /journaliser/i }))

    expect(onLog).toHaveBeenCalledWith(mockCheckType)
  })
})
