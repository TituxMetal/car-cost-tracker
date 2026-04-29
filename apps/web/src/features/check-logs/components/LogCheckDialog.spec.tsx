import { beforeEach, describe, expect, it, mock } from 'bun:test'

import type { CheckType } from '~/features/check-types/types'
import { cleanup, fireEvent, render, screen, waitFor } from '~/test-utils'

import { LogCheckDialog } from './LogCheckDialog'

const mockCheckType: CheckType = {
  id: 'ct-1',
  vehicleId: 'v-1',
  name: 'Vidange',
  description: null,
  intervalDays: 14,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01'
}

const renderDialog = async (props: Partial<Parameters<typeof LogCheckDialog>[0]> = {}) => {
  const result = render(
    <LogCheckDialog
      onSubmit={props.onSubmit ?? (() => {})}
      onCancel={props.onCancel ?? (() => {})}
      checkType={props.checkType ?? mockCheckType}
      checkTypes={props.checkTypes}
      status={props.status}
    />
  )

  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  return result
}

describe('LogCheckDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render the cluster header with kicker and h2', async () => {
    await renderDialog()

    expect(screen.getByText('// Nouvelle entrée')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /^Journaliser un contrôle/ })
    ).toBeInTheDocument()
  })

  it('should render the form with date and notes fields', async () => {
    await renderDialog()

    expect(screen.getByLabelText('Date du contrôle')).toBeInTheDocument()
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
  })

  it('should default completedAt to today', async () => {
    await renderDialog()

    const today = new Date().toISOString().split('T')[0]
    const dateInput = screen.getByLabelText('Date du contrôle') as HTMLInputElement

    expect(dateInput.value).toBe(today)
  })

  it('should render cancel and submit buttons', async () => {
    await renderDialog()

    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Enregistrer/i })).toBeInTheDocument()
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const onCancel = mock(() => {})

    await renderDialog({ onCancel })

    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should use DaisyUI modal classes', async () => {
    await renderDialog()

    const dialog = screen.getByRole('dialog')

    expect(dialog).toHaveClass('modal')
    expect(dialog).toHaveClass('modal-open')
    expect(dialog.querySelector('.modal-box')).toBeInTheDocument()
    expect(dialog.querySelector('.modal-action')).toBeInTheDocument()
  })

  it('should render the type panel and PROCHAIN panel when checkType is provided', async () => {
    await renderDialog({ checkType: mockCheckType, status: 'overdue' })

    expect(screen.getAllByText(/Type de contrôle/i).length).toBeGreaterThan(0)
    expect(screen.getByText('Tous les 14 jrs')).toBeInTheDocument()
    expect(screen.getByText('Prochain contrôle calculé')).toBeInTheDocument()
  })

  describe('picker mode', () => {
    const otherCheckType: CheckType = {
      ...mockCheckType,
      id: 'ct-2',
      name: 'Pression pneus',
      intervalDays: 7
    }

    it('renders a type picker when checkTypes is provided without a preselected checkType', async () => {
      const onSubmit = mock((_data: unknown, _id?: string) => {})

      render(
        <LogCheckDialog
          onSubmit={onSubmit}
          onCancel={() => {}}
          checkTypes={[mockCheckType, otherCheckType]}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      expect(screen.getByLabelText('Type de contrôle')).toBeInTheDocument()
      expect(screen.queryByLabelText('Date du contrôle')).toBeNull()
      expect(screen.getByRole('button', { name: /Enregistrer/i })).toBeDisabled()
    })

    it('reveals the form once a type is picked and submits with the picked id', async () => {
      const onSubmit = mock((_data: unknown, _id?: string) => {})

      render(
        <LogCheckDialog
          onSubmit={onSubmit}
          onCancel={() => {}}
          checkTypes={[mockCheckType, otherCheckType]}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText('Type de contrôle'), {
        target: { value: 'ct-2' }
      })

      await waitFor(() => {
        expect(screen.getByLabelText('Date du contrôle')).toBeInTheDocument()
      })
      expect(screen.getByText('Tous les 7 jrs')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Enregistrer/i })).not.toBeDisabled()
    })
  })
})
