import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { authClient } from '~/lib/authClient'
import { cleanup, render, screen, userEvent, waitFor } from '~/test-utils'

import { VerificationPendingContainer } from './VerificationPendingContainer'

mock.module('~/lib/authClient', () => ({
  authClient: {
    sendVerificationEmail: mock(() => Promise.resolve({ error: null }))
  }
}))

describe('VerificationPendingContainer', () => {
  beforeEach(() => {
    cleanup()
    mock.restore()
  })

  it('should render the cluster heading and email notice', () => {
    render(<VerificationPendingContainer email='test@example.com' />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/vérifiez votre email/i)
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('should show generic placeholder when email is null', () => {
    render(<VerificationPendingContainer email={null} />)

    const placeholder = screen.getByText('votre email')
    expect(placeholder.tagName).toBe('STRONG')
  })

  it('should not show resend button when email is null', () => {
    render(<VerificationPendingContainer email={null} />)

    expect(screen.queryByRole('button', { name: /renvoyer le lien/i })).not.toBeInTheDocument()
  })

  it('should show resend button when email is provided', () => {
    render(<VerificationPendingContainer email='test@example.com' />)

    expect(screen.getByRole('button', { name: /renvoyer le lien/i })).toBeInTheDocument()
  })

  it('should expose the back-to-login link', () => {
    render(<VerificationPendingContainer email='test@example.com' />)

    expect(screen.getByRole('link', { name: /retour à la connexion/i })).toHaveAttribute(
      'href',
      '/auth?mode=login'
    )
  })

  it('should render the system status panel', () => {
    render(<VerificationPendingContainer email='test@example.com' />)

    expect(screen.getByRole('status', { name: /état système/i })).toBeInTheDocument()
  })

  describe('resend functionality', () => {
    it('should call sendVerificationEmail when resend button is clicked', async () => {
      const user = userEvent.setup()
      const mockSendVerification = authClient.sendVerificationEmail as ReturnType<typeof mock>
      mockSendVerification.mockResolvedValue({ error: null })

      render(<VerificationPendingContainer email='test@example.com' />)

      await user.click(screen.getByRole('button', { name: /renvoyer le lien/i }))

      await waitFor(() => {
        expect(authClient.sendVerificationEmail).toHaveBeenCalledWith({ email: 'test@example.com' })
      })
    })

    it('should show success message after resend succeeds', async () => {
      const user = userEvent.setup()
      const mockSendVerification = authClient.sendVerificationEmail as ReturnType<typeof mock>
      mockSendVerification.mockResolvedValue({ error: null })

      render(<VerificationPendingContainer email='test@example.com' />)

      await user.click(screen.getByRole('button', { name: /renvoyer le lien/i }))

      await waitFor(() => {
        expect(screen.getByText(/lien renvoyé/i)).toBeInTheDocument()
      })
    })

    it('should show error message when resend fails', async () => {
      const user = userEvent.setup()
      const mockSendVerification = authClient.sendVerificationEmail as ReturnType<typeof mock>
      mockSendVerification.mockResolvedValue({ error: { message: 'Trop de demandes' } })

      render(<VerificationPendingContainer email='test@example.com' />)

      await user.click(screen.getByRole('button', { name: /renvoyer le lien/i }))

      await waitFor(() => {
        expect(screen.getByText(/trop de demandes/i)).toBeInTheDocument()
      })
    })

    it('should show loading state while resending', async () => {
      const user = userEvent.setup()
      const mockSendVerification = authClient.sendVerificationEmail as ReturnType<typeof mock>
      mockSendVerification.mockReturnValue(new Promise(() => {}))

      render(<VerificationPendingContainer email='test@example.com' />)

      await user.click(screen.getByRole('button', { name: /renvoyer le lien/i }))

      expect(screen.getByRole('button', { name: /^envoi…$/i })).toBeDisabled()
    })
  })
})
