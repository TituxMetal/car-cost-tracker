import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen, waitFor } from '~/test-utils'

import type { Expense } from '../types'
import { getTodayLocalISO } from '../utils/date.utils'

import { ExpenseFormDialog } from './ExpenseFormDialog'

const mockExpense: Expense = {
  id: 'e-1',
  vehicleId: 'v-1',
  occurredAt: '2026-03-15',
  amountCents: 8950,
  category: 'PARTS',
  description: 'Plaquettes avant',
  createdAt: '2026-03-15T10:00:00Z',
  updatedAt: '2026-03-15T10:00:00Z'
}

const renderDialog = async (props: Partial<Parameters<typeof ExpenseFormDialog>[0]> = {}) => {
  const result = render(
    <ExpenseFormDialog
      mode={props.mode ?? 'create'}
      expense={props.expense}
      onSubmit={props.onSubmit ?? (() => {})}
      onCancel={props.onCancel ?? (() => {})}
    />
  )

  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  return result
}

describe('ExpenseFormDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the create title in create mode', async () => {
    await renderDialog({ mode: 'create' })

    expect(screen.getByText('Ajouter une dépense')).toBeInTheDocument()
  })

  it('renders the edit title in edit mode', async () => {
    await renderDialog({ mode: 'edit', expense: mockExpense })

    expect(screen.getByText('Modifier la dépense')).toBeInTheDocument()
  })

  it('renders the four form fields', async () => {
    await renderDialog()

    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Montant (€)')).toBeInTheDocument()
    expect(screen.getByLabelText('Catégorie')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
  })

  it('defaults occurredAt to today in create mode', async () => {
    await renderDialog({ mode: 'create' })

    const today = getTodayLocalISO()

    expect(screen.getByLabelText('Date')).toHaveValue(today)
  })

  it('pre-fills fields from the expense in edit mode', async () => {
    await renderDialog({ mode: 'edit', expense: mockExpense })

    expect(screen.getByLabelText('Date')).toHaveValue('2026-03-15')
    expect(screen.getByLabelText('Montant (€)')).toHaveValue('89,50')
    expect(screen.getByLabelText('Catégorie')).toHaveValue('PARTS')
    expect(screen.getByLabelText('Description')).toHaveValue('Plaquettes avant')
  })

  it('renders cancel and submit buttons', async () => {
    await renderDialog()

    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Enregistrer/i })).toBeInTheDocument()
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancel = mock(() => {})

    await renderDialog({ onCancel })

    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('uses DaisyUI modal classes', async () => {
    await renderDialog()

    const dialog = screen.getByRole('dialog')

    expect(dialog).toHaveClass('modal')
    expect(dialog).toHaveClass('modal-open')
    expect(dialog.querySelector('.modal-box')).toBeInTheDocument()
    expect(dialog.querySelector('.modal-action')).toBeInTheDocument()
  })
})
