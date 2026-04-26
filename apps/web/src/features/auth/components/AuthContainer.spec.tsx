import type { Mock } from 'bun:test'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { cleanup, render, screen, userEvent, waitFor } from '~/test-utils'

import { useAuth } from '../hooks/useAuth'

import { AuthContainer } from './AuthContainer'

mock.module('../hooks/useAuth', () => ({
  useAuth: mock(() => {})
}))

const mockUseAuth = {
  login: mock(() => {}) as unknown as Mock<(data: unknown) => Promise<void>>,
  register: mock(() => {}) as unknown as Mock<(data: unknown) => Promise<void>>,
  logout: mock(() => {}) as unknown as Mock<() => Promise<void>>,
  refresh: mock(() => {}) as unknown as Mock<() => Promise<void>>,
  clearError: mock(() => {}),
  silentRefresh: mock(() => {}) as unknown as Mock<() => Promise<void>>,
  isLoading: false,
  user: null,
  isAuthenticated: false,
  error: null,
  hasError: false,
  updateProfile: mock(() => {}) as unknown as Mock<(data: unknown) => Promise<void>>
}

describe('AuthContainer', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
    mock.restore()
    const mockUseAuthFn = useAuth as ReturnType<typeof mock>
    mockUseAuthFn.mockReturnValue(mockUseAuth)
  })

  describe('Login Mode', () => {
    it('should render login surface by default', () => {
      render(<AuthContainer />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/connexion/i)
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /mettre le contact/i })).toBeInTheDocument()
      expect(screen.getByText(/créer votre dashboard/i)).toBeInTheDocument()
    })

    it('should render login surface when mode is explicitly set to login', () => {
      render(<AuthContainer mode='login' />)

      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /mettre le contact/i })).toBeInTheDocument()
    })

    it('should call login with form data when login form is submitted', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='login' />)

      await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /mettre le contact/i }))

      await waitFor(() => {
        expect(mockUseAuth.login).toHaveBeenCalledWith(
          {
            email: 'test@example.com',
            password: 'password123'
          },
          undefined
        )
      })
    })

    it('should call login with redirectPath when provided', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='login' redirectPath='/dashboard' />)

      await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /mettre le contact/i }))

      await waitFor(() => {
        expect(mockUseAuth.login).toHaveBeenCalledWith(
          {
            email: 'test@example.com',
            password: 'password123'
          },
          '/dashboard'
        )
      })
    })

    it('should show error message when login fails', async () => {
      const user = userEvent.setup()
      mockUseAuth.login.mockRejectedValueOnce(new Error('Identifiants invalides'))
      render(<AuthContainer mode='login' />)

      await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'wrongpassword')
      await user.click(screen.getByRole('button', { name: /mettre le contact/i }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/identifiants invalides/i)
      })
    })

    it('should show loading state during login', () => {
      const mockUseAuthFn = useAuth as ReturnType<typeof mock>
      mockUseAuthFn.mockReturnValue({
        ...mockUseAuth,
        isLoading: true
      })

      render(<AuthContainer mode='login' />)

      expect(screen.getByRole('button', { name: /connexion…/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /connexion…/i })).toBeDisabled()
    })

    it('should link "Créer votre dashboard" to signup', () => {
      render(<AuthContainer mode='login' />)

      const link = screen.getByRole('link', { name: /créer votre dashboard/i })
      expect(link).toHaveAttribute('href', expect.stringContaining('signup'))
    })

    it('should expose forgot password link', () => {
      render(<AuthContainer mode='login' />)

      expect(screen.getByRole('link', { name: /mot de passe oublié/i })).toHaveAttribute(
        'href',
        '/auth/forgot-password'
      )
    })

    it('should render the system status panel', () => {
      render(<AuthContainer mode='login' />)

      const panel = screen.getByRole('status', { name: /état système/i })
      expect(panel).toBeInTheDocument()
      expect(panel).toHaveTextContent(/api en ligne/i)
      expect(panel).toHaveTextContent(/better auth/i)
      expect(panel).toHaveTextContent(/prisma/i)
    })
  })

  describe('Signup Mode', () => {
    it('should render signup surface when mode is set to signup', () => {
      render(<AuthContainer mode='signup' />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/inscription/i)
      expect(screen.getByLabelText(/utilisateur/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /créer le dashboard/i })).toBeInTheDocument()
    })

    it('should call register with form data when signup form is submitted', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='signup' />)

      await user.type(screen.getByLabelText(/utilisateur/i), 'testuser')
      await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /créer le dashboard/i }))

      await waitFor(() => {
        expect(mockUseAuth.register).toHaveBeenCalledWith(
          {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
          },
          undefined
        )
      })
    })

    it('should call register with redirectPath when provided', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='signup' redirectPath='/welcome' />)

      await user.type(screen.getByLabelText(/utilisateur/i), 'testuser')
      await user.type(screen.getByLabelText(/e-mail/i), 'test@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /créer le dashboard/i }))

      await waitFor(() => {
        expect(mockUseAuth.register).toHaveBeenCalledWith(
          {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
          },
          '/welcome'
        )
      })
    })

    it('should show error message when registration fails', async () => {
      const user = userEvent.setup()
      mockUseAuth.register.mockRejectedValueOnce(new Error('Email déjà utilisé'))
      render(<AuthContainer mode='signup' />)

      await user.type(screen.getByLabelText(/utilisateur/i), 'testuser')
      await user.type(screen.getByLabelText(/e-mail/i), 'existing@example.com')
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
      await user.click(screen.getByRole('button', { name: /créer le dashboard/i }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/email déjà utilisé/i)
      })
    })

    it('should show loading state during registration', () => {
      const mockUseAuthFn = useAuth as ReturnType<typeof mock>
      mockUseAuthFn.mockReturnValue({
        ...mockUseAuth,
        isLoading: true
      })

      render(<AuthContainer mode='signup' />)

      expect(screen.getByRole('button', { name: /création…/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /création…/i })).toBeDisabled()
    })

    it('should link back to login from signup mode', () => {
      render(<AuthContainer mode='signup' />)

      const link = screen.getByRole('link', { name: /^connexion$/i })
      expect(link).toHaveAttribute('href', expect.stringContaining('login'))
    })

    it('should also render the system status panel in signup mode', () => {
      render(<AuthContainer mode='signup' />)

      expect(screen.getByRole('status', { name: /état système/i })).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should disable submit button when login form has validation errors', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='login' />)

      await user.click(screen.getByRole('button', { name: /mettre le contact/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /mettre le contact/i })).toBeDisabled()
      })
    })

    it('should disable submit button when signup form has validation errors', async () => {
      const user = userEvent.setup()
      render(<AuthContainer mode='signup' />)

      await user.click(screen.getByRole('button', { name: /créer le dashboard/i }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /créer le dashboard/i })).toBeDisabled()
      })
    })
  })
})
