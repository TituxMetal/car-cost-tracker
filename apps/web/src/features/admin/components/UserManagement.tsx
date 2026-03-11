import { useState } from 'react'

import { Button } from '~/components/ui'
import { admin } from '~/lib/authClient'
import { redirect } from '~/utils/navigation'

type UserData = {
  id: string
  email: string
  username: string
  role: string
  emailVerified: boolean
  banned: boolean
  banReason: string | null
  banExpires: Date | null
  createdAt: Date
}

type Props = {
  user: UserData
}
export const UserManagement = ({ user: initialUser }: Props) => {
  const [user, setUser] = useState(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSetRole = async (role: 'user' | 'admin') => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await admin.setRole({ userId: user.id, role })

    if (result.error) {
      setError(result.error.message ?? 'Failed to update role')
      setIsLoading(false)
      return
    }

    setUser({ ...user, role })
    setSuccess(`Role updated to ${role}`)
    setIsLoading(false)
  }

  const handleBan = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await admin.banUser({ userId: user.id })

    if (result.error) {
      setError(result.error.message ?? 'Failed to ban user')
      setIsLoading(false)
      return
    }

    setUser({ ...user, banned: true })
    setSuccess('User banned')
    setIsLoading(false)
  }

  const handleUnban = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await admin.unbanUser({ userId: user.id })

    if (result.error) {
      setError(result.error.message ?? 'Failed to unban user')
      setIsLoading(false)
      return
    }

    setUser({ ...user, banned: false })
    setSuccess('User unbanned')
    setIsLoading(false)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.username}? This cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setIsLoading(true)
    setError(null)

    const { error } = await admin.removeUser({ userId: user.id })

    if (error) {
      setError(error.message ?? 'Failed to delete user')
      setIsLoading(false)
      return
    }

    redirect('/admin/users')
  }

  return (
    <section className='flex flex-col gap-6'>
      {error && <p className='alert alert-error'>{error}</p>}
      {success && <p className='alert alert-success'>{success}</p>}

      <article className='card bg-base-200'>
        <div className='card-body gap-4'>
          <h2 className='card-title'>User Details</h2>
          <dl className='grid gap-3 sm:grid-cols-2'>
            <div>
              <dt className='text-base-content/70 text-sm'>Username</dt>
              <dd className='text-base-content'>{user.username}</dd>
            </div>
            <div>
              <dt className='text-base-content/70 text-sm'>Email</dt>
              <dd className='text-base-content'>{user.email}</dd>
            </div>
            <div>
              <dt className='text-base-content/70 text-sm'>Role</dt>
              <dd>
                <span
                  className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-neutral'}`}
                >
                  {user.role}
                </span>
              </dd>
            </div>
            <div>
              <dt className='text-base-content/70 text-sm'>Status</dt>
              <dd>
                {user.banned ? (
                  <span className='badge badge-error'>Banned</span>
                ) : user.emailVerified ? (
                  <span className='badge badge-success'>Verified</span>
                ) : (
                  <span className='badge badge-warning'>Unverified</span>
                )}
              </dd>
            </div>
            <div>
              <dt className='text-base-content/70 text-sm'>Created</dt>
              <dd className='text-base-content'>{new Date(user.createdAt).toLocaleDateString()}</dd>
            </div>
            {user.banned && user.banReason && (
              <div>
                <dt className='text-base-content/70 text-sm'>Ban Reason</dt>
                <dd className='text-base-content'>{user.banReason}</dd>
              </div>
            )}
          </dl>
        </div>
      </article>

      <article className='card bg-base-200'>
        <div className='card-body gap-4'>
          <h2 className='card-title'>Actions</h2>
          <div className='flex flex-wrap gap-3'>
            {user.role === 'user' ? (
              <Button onClick={() => handleSetRole('admin')} disabled={isLoading}>
                Promote to Admin
              </Button>
            ) : (
              <Button variant='outline' onClick={() => handleSetRole('user')} disabled={isLoading}>
                Demote to User
              </Button>
            )}

            {user.banned ? (
              <Button variant='outline' onClick={handleUnban} disabled={isLoading}>
                Unban User
              </Button>
            ) : (
              <Button variant='destructive' onClick={handleBan} disabled={isLoading}>
                Ban User
              </Button>
            )}

            <Button variant='destructive' onClick={handleDelete} disabled={isLoading}>
              Delete User
            </Button>
          </div>
        </div>
      </article>
    </section>
  )
}
