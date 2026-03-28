import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen, waitFor } from '~/test-utils'

import { LogCheckDialog } from './LogCheckDialog'

const renderDialog = async (props: Partial<Parameters<typeof LogCheckDialog>[0]> = {}) => {
  const result = render(
    <LogCheckDialog
      checkTypeName={props.checkTypeName ?? 'Vidange'}
      onSubmit={props.onSubmit ?? (() => {})}
      onCancel={props.onCancel ?? (() => {})}
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

  it('should render the dialog with check type name in title', async () => {
    await renderDialog()

    expect(screen.getByText(/Enregistrer un contrôle: Vidange/i)).toBeInTheDocument()
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
})
