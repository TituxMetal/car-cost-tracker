import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { authClient } from '~/lib/authClient'
import { cleanup, render, screen, userEvent, waitFor } from '~/test-utils'

import { ForgotPasswordContainer } from './ForgotPasswordContainer'

mock.module('~/lib/authClient', () => ({
  authClient: {
    requestPasswordReset: mock(() => Promise.resolve({ error: null }))
  }
}))

describe('ForgotPasswordContainer', () => {
  beforeEach(() => {
    cleanup()
    mock.restore()
  })

  it('should render the cluster heading and the email field', () => {
    render(<ForgotPasswordContainer />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/récupération du compte/i)
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /envoyer le lien/i })).toBeInTheDocument()
  })

  it('should expose the back-to-login link', () => {
    render(<ForgotPasswordContainer />)

    expect(screen.getByRole('link', { name: /retour à la connexion/i })).toHaveAttribute(
      'href',
      '/auth?mode=login'
    )
  })

  it('should render the system status panel', () => {
    render(<ForgotPasswordContainer />)

    expect(screen.getByRole('status', { name: /état système/i })).toBeInTheDocument()
  })

  it('should call requestPasswordReset on submit', async () => {
    const user = userEvent.setup()
    void (authClient.requestPasswordReset as ReturnType<typeof mock>).mockResolvedValue({
      error: null
    })

    render(<ForgotPasswordContainer />)

    await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /envoyer le lien/i }))

    await waitFor(() => {
      expect(authClient.requestPasswordReset).toHaveBeenCalledWith({
        email: 'test@example.com',
        redirectTo: '/auth/reset-password'
      })
    })
  })

  it('should show success message after submission', async () => {
    const user = userEvent.setup()
    void (authClient.requestPasswordReset as ReturnType<typeof mock>).mockResolvedValue({
      error: null
    })

    render(<ForgotPasswordContainer />)

    await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /envoyer le lien/i }))

    await waitFor(() => {
      expect(screen.getByText(/lien envoyé/i)).toBeInTheDocument()
    })
  })

  it('should show error message on failure', async () => {
    const user = userEvent.setup()
    void (authClient.requestPasswordReset as ReturnType<typeof mock>).mockResolvedValue({
      error: { message: 'Erreur réseau' }
    })

    render(<ForgotPasswordContainer />)

    await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /envoyer le lien/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/erreur réseau/i)
    })
  })
})
