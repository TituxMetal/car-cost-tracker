import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { admin } from '~/lib/authClient'
import { cleanup, render, screen, userEvent, waitFor } from '~/test-utils'
import * as navigationUtils from '~/utils/navigation'

import { UserManagement } from './UserManagement'

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  username: 'testuser',
  role: 'user',
  emailVerified: true,
  banned: false,
  banReason: null,
  banExpires: null,
  createdAt: new Date('2025-01-01')
}

mock.module('~/lib/authClient', () => ({
  admin: {
    setRole: mock(() => Promise.resolve({ error: null })),
    banUser: mock(() => Promise.resolve({ error: null })),
    unbanUser: mock(() => Promise.resolve({ error: null })),
    removeUser: mock(() => Promise.resolve({ error: null })),
    updateUser: mock(() => Promise.resolve({ error: null })),
    setUserPassword: mock(() => Promise.resolve({ error: null }))
  }
}))

mock.module('~/utils/navigation', () => ({
  redirect: mock(() => {})
}))

describe('UserManagement', () => {
  beforeEach(() => {
    cleanup()
    const mockSetRole = admin.setRole as unknown as ReturnType<typeof mock>
    const mockBanUser = admin.banUser as unknown as ReturnType<typeof mock>
    const mockUnbanUser = admin.unbanUser as unknown as ReturnType<typeof mock>
    const mockRemoveUser = admin.removeUser as unknown as ReturnType<typeof mock>
    const mockUpdateUser = admin.updateUser as unknown as ReturnType<typeof mock>
    const mockSetPassword = admin.setUserPassword as unknown as ReturnType<typeof mock>
    const mockRedirect = navigationUtils.redirect as unknown as ReturnType<typeof mock>

    mockSetRole.mockClear()
    mockBanUser.mockClear()
    mockUnbanUser.mockClear()
    mockRemoveUser.mockClear()
    mockUpdateUser.mockClear()
    mockSetPassword.mockClear()
    mockRedirect.mockClear()

    mockSetRole.mockResolvedValue({ error: null })
    mockBanUser.mockResolvedValue({ error: null })
    mockUnbanUser.mockResolvedValue({ error: null })
    mockRemoveUser.mockResolvedValue({ error: null })
    mockUpdateUser.mockResolvedValue({ error: null })
    mockSetPassword.mockResolvedValue({ error: null })
  })

  it('should display user details', () => {
    render(<UserManagement user={mockUser} />)

    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('user')).toBeInTheDocument()
    expect(screen.getByText('Verified')).toBeInTheDocument()
  })

  it('should show promote button for regular user', () => {
    render(<UserManagement user={mockUser} />)

    expect(screen.getByRole('button', { name: /promote to admin/i })).toBeInTheDocument()
  })

  it('should show demote button for admin user', () => {
    const adminUser = { ...mockUser, role: 'admin' }
    render(<UserManagement user={adminUser} />)

    expect(screen.getByRole('button', { name: /demote to user/i })).toBeInTheDocument()
  })

  it('should show ban button for non-banned user', () => {
    render(<UserManagement user={mockUser} />)

    expect(screen.getByRole('button', { name: /ban user/i })).toBeInTheDocument()
  })

  it('should show unban button for banned user', () => {
    const bannedUser = { ...mockUser, banned: true, banReason: 'Violation' }
    render(<UserManagement user={bannedUser} />)

    expect(screen.getByRole('button', { name: /unban user/i })).toBeInTheDocument()
    expect(screen.getByText('Banned')).toBeInTheDocument()
    expect(screen.getByText('Violation')).toBeInTheDocument()
  })

  it('should call setRole when promote button clicked', async () => {
    const user = userEvent.setup()
    render(<UserManagement user={mockUser} />)

    await user.click(screen.getByRole('button', { name: /promote to admin/i }))

    await waitFor(() => {
      expect(admin.setRole).toHaveBeenCalledWith({ userId: 'user-1', role: 'admin' })
    })
  })

  it('should call banUser when ban button clicked', async () => {
    const user = userEvent.setup()
    render(<UserManagement user={mockUser} />)

    await user.click(screen.getByRole('button', { name: /ban user/i }))

    await waitFor(() => {
      expect(admin.banUser).toHaveBeenCalledWith({ userId: 'user-1' })
    })
  })

  it('should call unbanUser when unban button clicked', async () => {
    const user = userEvent.setup()
    const bannedUser = { ...mockUser, banned: true }
    render(<UserManagement user={bannedUser} />)

    await user.click(screen.getByRole('button', { name: /unban user/i }))

    await waitFor(() => {
      expect(admin.unbanUser).toHaveBeenCalledWith({ userId: 'user-1' })
    })
  })

  it('should show success message after role change', async () => {
    const user = userEvent.setup()
    render(<UserManagement user={mockUser} />)

    await user.click(screen.getByRole('button', { name: /promote to admin/i }))

    await waitFor(() => {
      expect(screen.getByText(/role updated to admin/i)).toBeInTheDocument()
    })
  })

  it('should show error message when action fails', async () => {
    const mockSetRole = admin.setRole as unknown as ReturnType<typeof mock>
    mockSetRole.mockResolvedValue({ error: { message: 'Permission denied' } })

    const user = userEvent.setup()
    render(<UserManagement user={mockUser} />)

    await user.click(screen.getByRole('button', { name: /promote to admin/i }))

    await waitFor(() => {
      expect(screen.getByText(/permission denied/i)).toBeInTheDocument()
    })
  })

  it('shows "Valider l\'email" button when user is unverified', () => {
    const unverified = { ...mockUser, emailVerified: false }
    render(<UserManagement user={unverified} />)

    expect(screen.getByRole('button', { name: /valider l'email/i })).toBeInTheDocument()
  })

  it('hides "Valider l\'email" button when user is already verified', () => {
    render(<UserManagement user={mockUser} />)

    expect(screen.queryByRole('button', { name: /valider l'email/i })).not.toBeInTheDocument()
  })

  it('renders "Réinitialiser le password" button for any user', () => {
    render(<UserManagement user={mockUser} />)

    expect(screen.getByRole('button', { name: /réinitialiser le password/i })).toBeInTheDocument()
  })

  it("calls admin.updateUser with emailVerified: true when Valider l'email clicked", async () => {
    const unverified = { ...mockUser, emailVerified: false }
    const user = userEvent.setup()
    render(<UserManagement user={unverified} />)

    await user.click(screen.getByRole('button', { name: /valider l'email/i }))

    await waitFor(() => {
      expect(admin.updateUser).toHaveBeenCalledWith({
        userId: 'user-1',
        data: { emailVerified: true }
      })
    })
  })

  it('hides the Valider button and flips the badge after success', async () => {
    const unverified = { ...mockUser, emailVerified: false }
    const user = userEvent.setup()
    render(<UserManagement user={unverified} />)

    await user.click(screen.getByRole('button', { name: /valider l'email/i }))

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /valider l'email/i })).not.toBeInTheDocument()
      expect(screen.getByText('Verified')).toBeInTheDocument()
    })
  })

  it('shows an inline success message after verify', async () => {
    const unverified = { ...mockUser, emailVerified: false }
    const user = userEvent.setup()
    render(<UserManagement user={unverified} />)

    await user.click(screen.getByRole('button', { name: /valider l'email/i }))

    await waitFor(() => {
      expect(screen.getByText(/email validé/i)).toBeInTheDocument()
    })
  })

  it('shows an inline error when updateUser fails', async () => {
    const mockUpdateUser = admin.updateUser as unknown as ReturnType<typeof mock>
    mockUpdateUser.mockResolvedValueOnce({ error: { message: 'Permission denied' } })

    const unverified = { ...mockUser, emailVerified: false }
    const user = userEvent.setup()
    render(<UserManagement user={unverified} />)

    await user.click(screen.getByRole('button', { name: /valider l'email/i }))

    await waitFor(() => {
      expect(screen.getByText(/permission denied/i)).toBeInTheDocument()
    })
  })

  it('opens the reset dialog when Réinitialiser le password clicked', async () => {
    const user = userEvent.setup()
    render(<UserManagement user={mockUser} />)

    await user.click(screen.getByRole('button', { name: /réinitialiser le password/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('calls admin.setUserPassword and shows out-of-band reminder after success', async () => {
    const user = userEvent.setup()
    render(<UserManagement user={mockUser} />)

    await user.click(screen.getByRole('button', { name: /réinitialiser le password/i }))
    await user.type(screen.getByLabelText(/nouveau password/i), 'newsecret123')
    await user.click(screen.getByRole('button', { name: /enregistrer/i }))

    await waitFor(() => {
      expect(admin.setUserPassword).toHaveBeenCalledWith({
        userId: 'user-1',
        newPassword: 'newsecret123'
      })
    })

    await waitFor(() => {
      expect(screen.getByText(/transmettez-le vous-même/i)).toBeInTheDocument()
    })
  })

  it('surfaces inline error when setUserPassword fails', async () => {
    const mockSetPassword = admin.setUserPassword as unknown as ReturnType<typeof mock>
    mockSetPassword.mockResolvedValueOnce({ error: { message: 'Password policy failure' } })

    const user = userEvent.setup()
    render(<UserManagement user={mockUser} />)

    await user.click(screen.getByRole('button', { name: /réinitialiser le password/i }))
    await user.type(screen.getByLabelText(/nouveau password/i), 'newsecret123')
    await user.click(screen.getByRole('button', { name: /enregistrer/i }))

    await waitFor(() => {
      expect(screen.getByText(/password policy failure/i)).toBeInTheDocument()
    })
  })
})
