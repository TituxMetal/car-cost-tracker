import { UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '~/components/ui'
import { admin } from '~/lib/authClient'
import { redirect } from '~/utils/navigation'

import type { CreateUserSchema } from '../schemas'

import { CreateUserDialog } from './CreateUserDialog'

type AdminUser = {
  id: string
  email: string
  username: string
  role: string
  emailVerified: boolean
  banned: boolean
  createdAt: Date
}

export const UserList = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)

    const result = await admin.listUsers({ query: { limit: 100 } })

    if (result.error) {
      setError(result.error.message ?? 'Failed to load users')
      setIsLoading(false)
      return
    }

    setUsers((result.data?.users as unknown as AdminUser[]) ?? [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreate = async (values: CreateUserSchema): Promise<void> => {
    const name =
      [values.firstName, values.lastName].filter(Boolean).join(' ').trim() || values.username

    const result = await admin.createUser({
      email: values.email,
      password: values.password,
      name,
      data: {
        username: values.username,
        firstName: values.firstName || null,
        lastName: values.lastName || null,
        emailVerified: true
      }
    })

    if (result.error) {
      throw new Error(result.error.message ?? 'Failed to create user')
    }

    const newUserId = result.data?.user?.id
    if (!newUserId) {
      throw new Error('Failed to retrieve new user ID')
    }

    setIsCreateOpen(false)
    redirect(`/admin/users/${newUserId}`)
  }

  const renderContent = () => {
    if (isLoading) return <p className='text-base-content/70'>Loading users...</p>
    if (error) return <p className='text-error'>{error}</p>
    if (users.length === 0) return <p className='text-base-content/70'>No users found.</p>

    return (
      <section className='overflow-x-auto'>
        <table className='table-zebra table'>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-neutral'}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.banned ? (
                    <span className='badge badge-error'>Banned</span>
                  ) : user.emailVerified ? (
                    <span className='badge badge-success'>Verified</span>
                  ) : (
                    <span className='badge badge-warning'>Unverified</span>
                  )}
                </td>
                <td>
                  <a href={`/admin/users/${user.id}`} className='link link-primary'>
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    )
  }

  return (
    <section className='flex flex-col gap-6'>
      <header className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <h1 className='text-base-content text-2xl font-bold'>Manage Users</h1>
        <Button onClick={() => setIsCreateOpen(true)} className='gap-2'>
          <UserPlus size={16} />
          Ajouter un user
        </Button>
      </header>

      {renderContent()}

      {isCreateOpen && (
        <CreateUserDialog onCancel={() => setIsCreateOpen(false)} onSubmit={handleCreate} />
      )}
    </section>
  )
}
