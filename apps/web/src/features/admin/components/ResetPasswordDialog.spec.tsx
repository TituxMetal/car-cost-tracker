import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, fireEvent, render, screen, userEvent, waitFor } from '~/test-utils'

import { ResetPasswordDialog } from './ResetPasswordDialog'

const renderDialog = async (props: Partial<Parameters<typeof ResetPasswordDialog>[0]> = {}) => {
  const result = render(
    <ResetPasswordDialog
      username={props.username ?? 'testuser'}
      onCancel={props.onCancel ?? (() => {})}
      onSubmit={props.onSubmit ?? (async () => {})}
    />
  )

  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  return result
}

describe('ResetPasswordDialog', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
  })

  it('renders the title and out-of-band warning', async () => {
    await renderDialog({ username: 'alice' })

    expect(screen.getByText(/réinitialiser le password/i)).toBeInTheDocument()
    expect(screen.getByText(/alice/i)).toBeInTheDocument()
    expect(screen.getByText(/transmettez-le vous-même/i)).toBeInTheDocument()
  })

  it('calls onCancel when cancel clicked', async () => {
    const onCancel = mock(() => {})
    await renderDialog({ onCancel })

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('submits a valid payload via onSubmit', async () => {
    const onSubmit = mock(async () => {})
    const user = userEvent.setup()
    await renderDialog({ onSubmit })

    await user.type(screen.getByLabelText(/nouveau password/i), 'newsecret123')
    await user.click(screen.getByRole('button', { name: /enregistrer/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ password: 'newsecret123' })
    })
  })

  it('shows an inline error when onSubmit throws', async () => {
    const onSubmit = mock(async () => {
      throw new Error('Password policy failure')
    })
    const user = userEvent.setup()
    await renderDialog({ onSubmit })

    await user.type(screen.getByLabelText(/nouveau password/i), 'newsecret123')
    await user.click(screen.getByRole('button', { name: /enregistrer/i }))

    await waitFor(() => {
      expect(screen.getByText(/password policy failure/i)).toBeInTheDocument()
    })
  })
})
