import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'

import type { CheckType } from '../types'

import { CheckTypeCard } from './CheckTypeCard'

const mockCheckType: CheckType = {
  id: 'ct-1',
  vehicleId: 'v-1',
  name: `Niveau d'huile`,
  description: `Vérifier le niveau d'huile moteur`,
  intervalDays: 7,
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

  it('should render the interval in French format', () => {
    const actions = mock(() => {})
    render(<CheckTypeCard checkType={mockCheckType} onEdit={actions} onDelete={actions} />)

    expect(screen.getByText(`Tous les ${mockCheckType.intervalDays} jours`)).toBeInTheDocument()
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
