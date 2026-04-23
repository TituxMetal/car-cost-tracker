import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen, waitFor } from '~/test-utils'

import type { Budget } from '../types'

import { BudgetFormDialog } from './BudgetFormDialog'

const mockBudget: Budget = {
  id: 'b-1',
  vehicleId: 'v-1',
  amountCents: 25000,
  period: 'MONTHLY',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z'
}

const renderDialog = async (props: Partial<Parameters<typeof BudgetFormDialog>[0]> = {}) => {
  const result = render(
    <BudgetFormDialog
      mode={props.mode ?? 'create'}
      budget={props.budget}
      onSubmit={props.onSubmit ?? (() => {})}
      onCancel={props.onCancel ?? (() => {})}
    />
  )

  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  return result
}

describe('BudgetFormDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the create title in create mode', async () => {
    await renderDialog({ mode: 'create' })

    expect(screen.getByText('Définir un budget')).toBeInTheDocument()
  })

  it('renders the edit title in edit mode', async () => {
    await renderDialog({ mode: 'edit', budget: mockBudget })

    expect(screen.getByText('Modifier le budget')).toBeInTheDocument()
  })

  it('renders the two form fields', async () => {
    await renderDialog()

    expect(screen.getByLabelText('Montant (€)')).toBeInTheDocument()
    expect(screen.getByLabelText('Période')).toBeInTheDocument()
  })

  it('pre-fills the fields from budget in edit mode', async () => {
    await renderDialog({ mode: 'edit', budget: mockBudget })

    expect(screen.getByLabelText('Montant (€)')).toHaveValue('250,00')
    expect(screen.getByLabelText('Période')).toHaveValue('MONTHLY')
  })

  it('labels the submit button "Enregistrer" in create mode', async () => {
    await renderDialog({ mode: 'create' })

    expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeInTheDocument()
  })

  it('labels the submit button "Mettre à jour" in edit mode', async () => {
    await renderDialog({ mode: 'edit', budget: mockBudget })

    expect(screen.getByRole('button', { name: 'Mettre à jour' })).toBeInTheDocument()
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancel = mock(() => {})

    await renderDialog({ onCancel })

    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
