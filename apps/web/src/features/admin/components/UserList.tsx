import { useEffect, useState } from 'react'

import { admin } from '~/lib/authClient'

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

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)

    const result = await admin.listUsers({ query: { limit: 100 } })

    if (result.error) {
      setError(result.error.message ?? 'Failed to load users')
      setIsLoading(false)
      return
    }

    setUsers((result.data?.users as AdminUser[]) ?? [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (isLoading) {
    return <p className='text-base-content/70'>Loading users...</p>
  }

  if (error) {
    return <p className='text-error'>{error}</p>
  }

  if (users.length === 0) {
    return <p className='text-base-content/70'>No users found.</p>
  }

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
