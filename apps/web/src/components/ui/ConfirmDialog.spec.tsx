import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen } from '~/test-utils'

import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('should render the title', () => {
    render(
      <ConfirmDialog
        title='Test Title'
        message='Test Message'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should render the message', () => {
    render(
      <ConfirmDialog
        title='Test Title'
        message='Test Message'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })

  it('should render confirm and cancel buttons with default labels', () => {
    render(
      <ConfirmDialog
        title='Test Title'
        message='Test Message'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Confirmer')).toBeInTheDocument()
    expect(screen.getByText('Annuler')).toBeInTheDocument()
  })

  it('should render confirm and cancel buttons with custom labels', () => {
    render(
      <ConfirmDialog
        title='Test Title'
        message='Test Message'
        confirmLabel='Yes'
        cancelLabel='No'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByText('No')).toBeInTheDocument()
  })

  it('should call onConfirm when confirm button is clicked', () => {
    const onConfirm = mock(() => {})

    render(
      <ConfirmDialog
        title='Test Title'
        message='Test Message'
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    )

    fireEvent.click(screen.getByText('Confirmer'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when cancel button is clicked', () => {
    const onCancel = mock(() => {})

    render(
      <ConfirmDialog
        title='Test Title'
        message='Test Message'
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    fireEvent.click(screen.getByText('Annuler'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when backdrop is clicked', () => {
    const onCancel = mock(() => {})

    render(
      <ConfirmDialog
        title='Test Title'
        message='Test Message'
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    const overlay = document.querySelector('.fixed.inset-0')
    fireEvent.click(overlay!)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when Escape key is pressed', () => {
    const onCancel = mock(() => {})

    render(
      <ConfirmDialog
        title='Test Title'
        message='Test Message'
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should use DaisyUI modal classes on dialog', () => {
    render(
      <ConfirmDialog
        title='Test Title'
        message='Test Message'
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('modal')
    expect(dialog).toHaveClass('modal-open')
    expect(dialog.querySelector('.modal-box')).toBeInTheDocument()
    expect(dialog.querySelector('.modal-action')).toBeInTheDocument()
  })
})
