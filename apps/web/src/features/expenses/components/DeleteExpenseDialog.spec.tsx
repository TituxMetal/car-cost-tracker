import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { DeleteExpenseDialog } from './DeleteExpenseDialog'

describe('DeleteExpenseDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the delete title', () => {
    render(
      <DeleteExpenseDialog
        amountCents={8950}
        occurredAt='2026-03-15'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Supprimer la dépense')).toBeInTheDocument()
  })

  it('includes the formatted amount and date in the warning message', () => {
    render(
      <DeleteExpenseDialog
        amountCents={8950}
        occurredAt='2026-03-15'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText(/89,50/)).toBeInTheDocument()
    expect(screen.getByText(/2026-03-15/)).toBeInTheDocument()
    expect(screen.getByText(/irréversible/i)).toBeInTheDocument()
  })

  it('renders Supprimer and Annuler buttons', () => {
    render(
      <DeleteExpenseDialog
        amountCents={8950}
        occurredAt='2026-03-15'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeVisible()
  })

  it('calls onConfirm when Supprimer is clicked', () => {
    const onConfirm = mock(() => {})

    render(
      <DeleteExpenseDialog
        amountCents={8950}
        occurredAt='2026-03-15'
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    )

    screen.getByRole('button', { name: 'Supprimer' }).click()

    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when Annuler is clicked', () => {
    const onCancel = mock(() => {})

    render(
      <DeleteExpenseDialog
        amountCents={8950}
        occurredAt='2026-03-15'
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    screen.getByRole('button', { name: 'Annuler' }).click()

    expect(onCancel).toHaveBeenCalled()
  })
})
