import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen } from '~/test-utils'

import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render the title', () => {
    render(
      <ConfirmDialog
        title='Supprimer ?'
        message='Cette action est irréversible.'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Supprimer ?')).toBeInTheDocument()
  })

  it('should render the message', () => {
    render(
      <ConfirmDialog
        title='Supprimer ?'
        message='Cette action est irréversible.'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Cette action est irréversible.')).toBeInTheDocument()
  })

  it('should render confirm and cancel buttons with default labels', () => {
    render(
      <ConfirmDialog
        title='Supprimer ?'
        message='Cette action est irréversible.'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: /Confirmer/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument()
  })

  it('should render confirm and cancel buttons with custom labels', () => {
    render(
      <ConfirmDialog
        title='Supprimer ?'
        message='Cette action est irréversible.'
        confirmLabel='Supprimer'
        cancelLabel='Retour'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: /Supprimer/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument()
  })

  it('should call onConfirm when confirm button is clicked', () => {
    const onConfirm = mock(() => {})
    render(
      <ConfirmDialog
        title='Supprimer ?'
        message='Cette action est irréversible.'
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /Confirmer/i })
    confirmButton.click()

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when cancel button is clicked', () => {
    const onCancel = mock(() => {})
    render(
      <ConfirmDialog
        title='Supprimer ?'
        message='Cette action est irréversible.'
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /Annuler/i })
    cancelButton.click()

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when backdrop is clicked', () => {
    const onCancel = mock(() => {})
    render(
      <ConfirmDialog
        title='Supprimer ?'
        message='Cette action est irréversible.'
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    const backdrop = screen.getByRole('dialog').parentElement!
    backdrop.click()

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when Escape key is pressed', () => {
    const onCancel = mock(() => {})
    render(
      <ConfirmDialog
        title='Supprimer ?'
        message='Cette action est irréversible.'
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
