import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { admin } from '~/lib/authClient'
import { act, cleanup, render, screen, userEvent, waitFor } from '~/test-utils'
import * as navigationUtils from '~/utils/navigation'

import { UserList } from './UserList'

const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@example.com',
    username: 'adminuser',
    role: 'admin',
    emailVerified: true,
    banned: false,
    createdAt: new Date()
  },
  {
    id: 'user-2',
    email: 'test@example.com',
    username: 'testuser',
    role: 'user',
    emailVerified: false,
    banned: false,
    createdAt: new Date()
  },
  {
    id: 'user-3',
    email: 'banned@example.com',
    username: 'banneduser',
    role: 'user',
    emailVerified: true,
    banned: true,
    createdAt: new Date()
  }
]

mock.module('~/lib/authClient', () => ({
  admin: {
    listUsers: mock(() => Promise.resolve({ data: { users: mockUsers }, error: null })),
    createUser: mock(() => Promise.resolve({ data: { user: { id: 'user-new' } }, error: null }))
  }
}))

mock.module('~/utils/navigation', () => ({
  redirect: mock(() => {})
}))

describe('UserList', () => {
  beforeEach(() => {
    cleanup()
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    const mockCreateUser = admin.createUser as unknown as ReturnType<typeof mock>
    const mockRedirect = navigationUtils.redirect as unknown as ReturnType<typeof mock>
    mockListUsers.mockClear()
    mockCreateUser.mockClear()
    mockRedirect.mockClear()
    mockListUsers.mockResolvedValue({ data: { users: mockUsers }, error: null })
    mockCreateUser.mockResolvedValue({ data: { user: { id: 'user-new' } }, error: null })
  })

  it('should show loading state initially', async () => {
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockReturnValue(new Promise(() => {}))

    await act(async () => {
      render(<UserList />)
    })

    expect(screen.getByText(/loading users/i)).toBeInTheDocument()
  })

  it('should render users table after loading', async () => {
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('adminuser')).toBeInTheDocument()
      expect(screen.getByText('testuser')).toBeInTheDocument()
      expect(screen.getByText('banneduser')).toBeInTheDocument()
    })
  })

  it('should display role badges', async () => {
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
      expect(screen.getAllByText('user')).toHaveLength(2)
    })
  })

  it('should display status badges', async () => {
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText('Verified')).toBeInTheDocument()
      expect(screen.getByText('Unverified')).toBeInTheDocument()
      expect(screen.getByText('Banned')).toBeInTheDocument()
    })
  })

  it('should have view links for each user', async () => {
    render(<UserList />)

    await waitFor(() => {
      const viewLinks = screen.getAllByRole('link', { name: /view/i })
      expect(viewLinks).toHaveLength(3)
      expect(viewLinks[0]).toHaveAttribute('href', '/admin/users/user-1')
      expect(viewLinks[1]).toHaveAttribute('href', '/admin/users/user-2')
      expect(viewLinks[2]).toHaveAttribute('href', '/admin/users/user-3')
    })
  })

  it('should show error message when loading fails', async () => {
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockResolvedValue({ data: null, error: { message: 'Network error' } })

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  it('should show empty message when no users', async () => {
    const mockListUsers = admin.listUsers as unknown as ReturnType<typeof mock>
    mockListUsers.mockResolvedValue({ data: { users: [] }, error: null })

    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument()
    })
  })

  it('renders the page title h1', async () => {
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /manage users/i })).toBeInTheDocument()
    })
  })

  it('renders the "Ajouter un user" button', async () => {
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ajouter un user/i })).toBeInTheDocument()
    })
  })

  it('opens the create dialog when "Ajouter un user" is clicked', async () => {
    const user = userEvent.setup()
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ajouter un user/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /ajouter un user/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('calls admin.createUser with the correct payload and redirects', async () => {
    const user = userEvent.setup()
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ajouter un user/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /ajouter un user/i }))
    await user.type(screen.getByLabelText(/username/i), 'newtester')
    await user.type(screen.getByLabelText(/email/i), 'tester@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(admin.createUser).toHaveBeenCalledWith({
        email: 'tester@example.com',
        password: 'secret123',
        name: 'newtester',
        data: {
          username: 'newtester',
          firstName: null,
          lastName: null,
          emailVerified: true
        }
      })
    })

    await waitFor(() => {
      expect(navigationUtils.redirect).toHaveBeenCalledWith('/admin/users/user-new')
    })
  })

  it('surfaces inline error when createUser fails', async () => {
    const mockCreateUser = admin.createUser as unknown as ReturnType<typeof mock>
    mockCreateUser.mockResolvedValueOnce({
      data: null,
      error: { message: 'Email already in use' }
    })

    const user = userEvent.setup()
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ajouter un user/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /ajouter un user/i }))
    await user.type(screen.getByLabelText(/username/i), 'newtester')
    await user.type(screen.getByLabelText(/email/i), 'tester@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: /créer/i }))

    await waitFor(() => {
      expect(screen.getByText(/email already in use/i)).toBeInTheDocument()
    })
  })
})
