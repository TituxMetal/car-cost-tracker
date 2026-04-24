import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen, userEvent, waitFor } from '~/test-utils'

import { CreateUserDialog } from './CreateUserDialog'

const renderDialog = async (props: Partial<Parameters<typeof CreateUserDialog>[0]> = {}) => {
  const result = render(
    <CreateUserDialog
      onCancel={props.onCancel ?? (() => {})}
      onSubmit={props.onSubmit ?? (async () => {})}
    />
  )

  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  return result
}

describe('CreateUserDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the dialog title', async () => {
    await renderDialog()

    expect(screen.getByText(/ajouter un user/i)).toBeInTheDocument()
  })

  it('renders all five fields', async () => {
    await renderDialog()

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
  })

  it('calls onCancel when cancel clicked', async () => {
    const onCancel = mock(() => {})
    await renderDialog({ onCancel })

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('submits valid payload via onSubmit', async () => {
    const onSubmit = mock(async () => {})
    const user = userEvent.setup()
    await renderDialog({ onSubmit })

    await user.type(screen.getByLabelText(/username/i), 'newtester')
    await user.type(screen.getByLabelText(/email/i), 'tester@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'newtester',
        email: 'tester@example.com',
        password: 'secret123'
      })
    )
  })

  it('shows an inline server error when onSubmit throws', async () => {
    const onSubmit = mock(async () => {
      throw new Error('Email already in use')
    })
    const user = userEvent.setup()
    await renderDialog({ onSubmit })

    await user.type(screen.getByLabelText(/username/i), 'newtester')
    await user.type(screen.getByLabelText(/email/i), 'tester@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(screen.getByText(/email already in use/i)).toBeInTheDocument()
    })
  })
})
