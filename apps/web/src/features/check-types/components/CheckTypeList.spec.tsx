import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { CheckStatus } from '~/features/check-logs/types'
import { cleanup, fireEvent, render, screen } from '~/test-utils'

import type { CheckType } from '../types'

import { CheckTypeList } from './CheckTypeList'

const mockCheckTypes: CheckType[] = [
  {
    id: 'ct-1',
    vehicleId: 'v-1',
    name: "Niveau d'huile",
    description: "Vérifier le niveau d'huile moteur",
    intervalDays: 7,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'ct-2',
    vehicleId: 'v-1',
    name: 'Pression des pneus',
    description: null,
    intervalDays: 14,
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z'
  }
]

describe('CheckTypeList', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render a card for each check type', () => {
    const actions = mock(() => {})
    render(<CheckTypeList checkTypes={mockCheckTypes} onEdit={actions} onDelete={actions} />)

    const cards = screen.getAllByRole('article')

    expect(cards).toHaveLength(mockCheckTypes.length)
  })

  it('should render no cards when list is empty', () => {
    const actions = mock(() => {})
    render(<CheckTypeList checkTypes={[]} onEdit={actions} onDelete={actions} />)

    const cards = screen.queryAllByRole('article')

    expect(cards).toHaveLength(0)
  })

  it('should pass onEdit callback to cards', () => {
    const onEdit = mock(() => {})
    const onDelete = mock(() => {})
    render(<CheckTypeList checkTypes={mockCheckTypes} onEdit={onEdit} onDelete={onDelete} />)

    const editButtons = screen.getAllByRole('button', { name: /modifier/i })
    editButtons.forEach((button, index) => {
      fireEvent.click(button)
      expect(onEdit).toHaveBeenCalledWith(mockCheckTypes[index])
    })
  })

  it('should pass onDelete callback to cards', () => {
    const onEdit = mock(() => {})
    const onDelete = mock(() => {})
    render(<CheckTypeList checkTypes={mockCheckTypes} onEdit={onEdit} onDelete={onDelete} />)

    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i })

    deleteButtons.forEach((button, index) => {
      fireEvent.click(button)
      expect(onDelete).toHaveBeenCalledWith(mockCheckTypes[index])
    })
  })

  it('should forward statuses to cards as CheckStatusBadge', () => {
    const actions = mock(() => {})
    const statuses = new Map<string, CheckStatus>([
      ['ct-1', 'on-time'],
      ['ct-2', 'overdue']
    ])

    render(
      <CheckTypeList
        checkTypes={mockCheckTypes}
        onEdit={actions}
        onDelete={actions}
        statuses={statuses}
      />
    )

    expect(screen.getByText(/à jour/i)).toBeInTheDocument()
    expect(screen.getByText(/en retard/i)).toBeInTheDocument()
  })

  it('should not render badges when statuses is not provided', () => {
    const actions = mock(() => {})

    render(<CheckTypeList checkTypes={mockCheckTypes} onEdit={actions} onDelete={actions} />)

    expect(screen.queryByText(/à jour/i)).toBeNull()
    expect(screen.queryByText(/en retard/i)).toBeNull()
  })

  it('should forward onLog to cards', () => {
    const actions = mock(() => {})
    const onLog = mock(() => {})

    render(
      <CheckTypeList
        checkTypes={mockCheckTypes}
        onEdit={actions}
        onDelete={actions}
        onLog={onLog}
      />
    )

    const logButtons = screen.getAllByRole('button', { name: /journaliser/i })

    expect(logButtons).toHaveLength(2)
    fireEvent.click(logButtons[0])
    expect(onLog).toHaveBeenCalledWith(mockCheckTypes[0])
  })
})
