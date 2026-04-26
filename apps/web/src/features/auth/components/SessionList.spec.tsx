import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { authClient } from '~/lib/authClient'
import { cleanup, render, screen, userEvent, waitFor } from '~/test-utils'
import * as navigationUtils from '~/utils/navigation'

import { SessionList } from './SessionList'

const mockSessions = [
  {
    id: 'session-1',
    token: 'token-1',
    expiresAt: new Date('2025-12-31'),
    createdAt: new Date('2025-01-01'),
    userAgent: 'Chrome sous Windows',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'session-2',
    token: 'token-2',
    expiresAt: new Date('2025-12-31'),
    createdAt: new Date('2025-01-02'),
    userAgent: 'Firefox sous Mac',
    ipAddress: '192.168.1.2'
  }
]

mock.module('~/lib/authClient', () => ({
  authClient: {
    listSessions: mock(() => Promise.resolve({ data: mockSessions, error: null })),
    getSession: mock(() =>
      Promise.resolve({ data: { session: { token: 'token-1' } }, error: null })
    ),
    revokeSession: mock(() => Promise.resolve({ error: null })),
    revokeOtherSessions: mock(() => Promise.resolve({ error: null })),
    revokeSessions: mock(() => Promise.resolve({ error: null }))
  }
}))

mock.module('~/utils/navigation', () => ({
  redirect: mock(() => {})
}))

describe('SessionList', () => {
  beforeEach(() => {
    cleanup()
    const mockListSessions = authClient.listSessions as unknown as ReturnType<typeof mock>
    const mockGetSession = authClient.getSession as unknown as ReturnType<typeof mock>
    const mockRevokeSession = authClient.revokeSession as unknown as ReturnType<typeof mock>
    const mockRevokeOtherSessions = authClient.revokeOtherSessions as unknown as ReturnType<
      typeof mock
    >
    const mockRevokeSessions = authClient.revokeSessions as unknown as ReturnType<typeof mock>

    mockListSessions.mockClear()
    mockGetSession.mockClear()
    mockRevokeSession.mockClear()
    mockRevokeOtherSessions.mockClear()
    mockRevokeSessions.mockClear()

    mockListSessions.mockResolvedValue({ data: mockSessions, error: null })
    mockGetSession.mockResolvedValue({ data: { session: { token: 'token-1' } }, error: null })
    mockRevokeSession.mockResolvedValue({ error: null })
    mockRevokeOtherSessions.mockResolvedValue({ error: null })
    mockRevokeSessions.mockResolvedValue({ error: null })
  })

  it('should show loading state initially', () => {
    const mockListSessions = authClient.listSessions as unknown as ReturnType<typeof mock>
    mockListSessions.mockReturnValue(new Promise(() => {}))

    render(<SessionList />)

    expect(screen.getByText(/chargement des sessions/i)).toBeInTheDocument()
  })

  it('should render the index summary with the session count after loading', async () => {
    render(<SessionList />)

    await waitFor(() => {
      expect(screen.getByText(/index sessions/i)).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  it('should render sessions after loading', async () => {
    render(<SessionList />)

    await waitFor(() => {
      expect(screen.getByText(/chrome sous windows/i)).toBeInTheDocument()
      expect(screen.getByText(/firefox sous mac/i)).toBeInTheDocument()
    })
  })

  it('should highlight current session with badge', async () => {
    render(<SessionList />)

    await waitFor(() => {
      expect(screen.getByText(/session actuelle/i)).toBeInTheDocument()
    })
  })

  it('should not show revoke button for current session', async () => {
    render(<SessionList />)

    await waitFor(() => {
      const revokeButtons = screen.getAllByRole('button', { name: /révoquer/i })
      expect(revokeButtons).toHaveLength(1)
    })
  })

  it('should show "log out other devices" button when multiple sessions', async () => {
    render(<SessionList />)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /déconnecter les autres appareils/i })
      ).toBeInTheDocument()
    })
  })

  it('should call revokeSession when revoke button clicked', async () => {
    const user = userEvent.setup()
    render(<SessionList />)

    await waitFor(() => {
      expect(screen.getByText(/firefox sous mac/i)).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /révoquer/i }))

    await waitFor(() => {
      expect(authClient.revokeSession).toHaveBeenCalledWith({ token: 'token-2' })
    })
  })

  it('should call revokeOtherSessions when log out other devices clicked', async () => {
    const user = userEvent.setup()
    render(<SessionList />)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /déconnecter les autres appareils/i })
      ).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /déconnecter les autres appareils/i }))

    await waitFor(() => {
      expect(authClient.revokeOtherSessions).toHaveBeenCalled()
    })
  })

  it('should redirect to /auth when log out everywhere clicked', async () => {
    const user = userEvent.setup()
    render(<SessionList />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /tout déconnecter/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /tout déconnecter/i }))

    await waitFor(() => {
      expect(authClient.revokeSessions).toHaveBeenCalled()
      expect(navigationUtils.redirect).toHaveBeenCalledWith('/auth')
    })
  })

  it('should show error message when loading fails', async () => {
    const mockListSessions = authClient.listSessions as unknown as ReturnType<typeof mock>
    mockListSessions.mockResolvedValue({ data: null, error: { message: 'Erreur réseau' } })

    render(<SessionList />)

    await waitFor(() => {
      expect(screen.getByText(/erreur réseau/i)).toBeInTheDocument()
    })
  })
})
