import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { authClient } from '~/lib/authClient'
import { cleanup, render, screen, userEvent, waitFor } from '~/test-utils'

import { ResetPasswordContainer } from './ResetPasswordContainer'

mock.module('~/lib/authClient', () => ({
  authClient: {
    resetPassword: mock(() => Promise.resolve({ error: null }))
  }
}))

describe('ResetPasswordContainer', () => {
  beforeEach(() => {
    cleanup()
  })

  describe('when token is missing', () => {
    it('should show invalid link cluster panel', () => {
      render(<ResetPasswordContainer token={null} />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        /réinitialisation impossible/i
      )
      expect(screen.getByText(/jeton absent/i)).toBeInTheDocument()
    })

    it('should expose the request-new-link route', () => {
      render(<ResetPasswordContainer token={null} />)

      expect(screen.getByRole('link', { name: /demander un nouveau lien/i })).toHaveAttribute(
        'href',
        '/auth/forgot-password'
      )
    })

    it('should render the system status panel even on the no-token state', () => {
      render(<ResetPasswordContainer token={null} />)

      expect(screen.getByRole('status', { name: /état système/i })).toBeInTheDocument()
    })
  })

  describe('when token is provided', () => {
    it('should render password inputs', () => {
      render(<ResetPasswordContainer token='valid-token' />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/renouveler votre accès/i)
      expect(screen.getByLabelText(/nouveau mot de passe/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirmation/i)).toBeInTheDocument()
    })

    it('should show submit button', () => {
      render(<ResetPasswordContainer token='valid-token' />)

      expect(screen.getByRole('button', { name: /^réinitialiser →$/i })).toBeInTheDocument()
    })

    it('should call resetPassword on submit', async () => {
      const user = userEvent.setup()

      void (authClient.resetPassword as unknown as ReturnType<typeof mock>).mockResolvedValue({
        error: null
      })

      render(<ResetPasswordContainer token='valid-token' />)

      await user.type(screen.getByLabelText(/nouveau mot de passe/i), 'newpassword123')

      await user.type(screen.getByLabelText(/confirmation/i), 'newpassword123')

      await user.click(screen.getByRole('button', { name: /^réinitialiser →$/i }))

      await waitFor(() => {
        expect(authClient.resetPassword).toHaveBeenCalledWith({
          token: 'valid-token',
          newPassword: 'newpassword123'
        })
      })
    })

    it('should show success message after reset', async () => {
      const user = userEvent.setup()
      void (authClient.resetPassword as unknown as ReturnType<typeof mock>).mockResolvedValue({
        error: null
      })

      render(<ResetPasswordContainer token='valid-token' />)

      await user.type(screen.getByLabelText(/nouveau mot de passe/i), 'newpassword123')
      await user.type(screen.getByLabelText(/confirmation/i), 'newpassword123')
      await user.click(screen.getByRole('button', { name: /^réinitialiser →$/i }))

      await waitFor(() => {
        expect(screen.getByText(/mot de passe mis à jour/i)).toBeInTheDocument()
      })
    })

    it('should show error message on failure', async () => {
      const user = userEvent.setup()
      void (authClient.resetPassword as unknown as ReturnType<typeof mock>).mockResolvedValue({
        error: { message: 'Jeton expiré' }
      })

      render(<ResetPasswordContainer token='valid-token' />)

      await user.type(screen.getByLabelText(/nouveau mot de passe/i), 'newpassword123')
      await user.type(screen.getByLabelText(/confirmation/i), 'newpassword123')
      await user.click(screen.getByRole('button', { name: /^réinitialiser →$/i }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/jeton expiré/i)
      })
    })
  })
})
