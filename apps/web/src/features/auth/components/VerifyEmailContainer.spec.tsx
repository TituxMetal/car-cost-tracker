import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { authClient } from '~/lib/authClient'
import { cleanup, render, screen, waitFor } from '~/test-utils'

import { VerifyEmailContainer } from './VerifyEmailContainer'

mock.module('~/lib/authClient', () => ({
  authClient: {
    verifyEmail: mock(() => Promise.resolve({ error: null }))
  }
}))

describe('VerifyEmailContainer', () => {
  beforeEach(() => {
    cleanup()
    mock.restore()
  })

  describe('when token is null', () => {
    it('should render the no-token cluster panel', () => {
      render(<VerifyEmailContainer token={null} />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/lien introuvable/i)
      expect(screen.getByText(/jeton absent/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /aller à la connexion/i })).toHaveAttribute(
        'href',
        '/auth?mode=login'
      )
    })

    it('should render the system status panel', () => {
      render(<VerifyEmailContainer token={null} />)

      expect(screen.getByRole('status', { name: /état système/i })).toBeInTheDocument()
    })
  })

  describe('when token is provided', () => {
    it('should show verifying message initially', () => {
      const mockVerifyEmail = authClient.verifyEmail as ReturnType<typeof mock>
      mockVerifyEmail.mockReturnValue(new Promise(() => {}))

      render(<VerifyEmailContainer token='valid-token' />)

      expect(screen.getByText(/validation du jeton/i)).toBeInTheDocument()
    })

    it('should show success message when verification succeeds', async () => {
      const mockVerifyEmail = authClient.verifyEmail as ReturnType<typeof mock>
      mockVerifyEmail.mockResolvedValue({ error: null })

      render(<VerifyEmailContainer token='valid-token' />)

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/email vérifié/i)
      })

      expect(screen.getByRole('link', { name: /aller à la connexion/i })).toHaveAttribute(
        'href',
        '/auth?mode=login'
      )
    })

    it('should show error message when verification fails', async () => {
      const mockVerifyEmail = authClient.verifyEmail as ReturnType<typeof mock>
      mockVerifyEmail.mockResolvedValue({ error: { message: 'Jeton expiré' } })

      render(<VerifyEmailContainer token='expired-token' />)

      await waitFor(() => {
        expect(screen.getByText(/vérification échouée/i)).toBeInTheDocument()
        expect(screen.getByText(/jeton expiré/i)).toBeInTheDocument()
      })

      expect(screen.getByRole('link', { name: /demander un nouveau lien/i })).toHaveAttribute(
        'href',
        '/auth/verification-pending'
      )
    })

    it('should show default error message when no message provided', async () => {
      const mockVerifyEmail = authClient.verifyEmail as ReturnType<typeof mock>
      mockVerifyEmail.mockResolvedValue({ error: {} })

      render(<VerifyEmailContainer token='bad-token' />)

      await waitFor(() => {
        expect(screen.getByText(/le lien a peut-être expiré/i)).toBeInTheDocument()
      })
    })

    it('should call verifyEmail with correct token', async () => {
      const mockVerifyEmail = authClient.verifyEmail as ReturnType<typeof mock>
      mockVerifyEmail.mockResolvedValue({ error: null })

      render(<VerifyEmailContainer token='my-token-123' />)

      await waitFor(() => {
        expect(authClient.verifyEmail).toHaveBeenCalledWith({ query: { token: 'my-token-123' } })
      })
    })
  })
})
