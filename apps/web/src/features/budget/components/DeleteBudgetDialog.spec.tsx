import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { DeleteBudgetDialog } from './DeleteBudgetDialog'

describe('DeleteBudgetDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the delete title', () => {
    render(<DeleteBudgetDialog onConfirm={() => {}} onCancel={() => {}} />)

    expect(screen.getByText('Supprimer le budget')).toBeInTheDocument()
  })

  it('renders the reassurance message about redefining a budget', () => {
    render(<DeleteBudgetDialog onConfirm={() => {}} onCancel={() => {}} />)

    expect(screen.getByText(/nouveau à tout moment/i)).toBeInTheDocument()
  })

  it('renders Supprimer and Annuler buttons', () => {
    render(<DeleteBudgetDialog onConfirm={() => {}} onCancel={() => {}} />)

    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeVisible()
  })

  it('calls onConfirm when Supprimer is clicked', () => {
    const onConfirm = mock(() => {})

    render(<DeleteBudgetDialog onConfirm={onConfirm} onCancel={() => {}} />)

    screen.getByRole('button', { name: 'Supprimer' }).click()

    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when Annuler is clicked', () => {
    const onCancel = mock(() => {})

    render(<DeleteBudgetDialog onConfirm={() => {}} onCancel={onCancel} />)

    screen.getByRole('button', { name: 'Annuler' }).click()

    expect(onCancel).toHaveBeenCalled()
  })
})
