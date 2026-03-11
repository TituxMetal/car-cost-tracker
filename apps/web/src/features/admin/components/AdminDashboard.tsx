import { useEffect, useState } from 'react'

import { admin } from '~/lib/authClient'

type UserStats = {
  total: number
  admins: number
  verified: number
  banned: number
}

export const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<UserStats>({ total: 0, admins: 0, verified: 0, banned: 0 })

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)

    const { error, data } = await admin.listUsers({ query: { limit: 100 } })

    if (error) {
      setError(error.message ?? 'Failed to load users')
      setIsLoading(false)
      return
    }

    const users = data?.users ?? []
    setStats({
      total: users.length,
      admins: users.filter(user => user.role === 'admin').length,
      verified: users.filter(user => user.emailVerified).length,
      banned: users.filter(user => user.banned).length
    })
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (isLoading) {
    return <p className='text-base-content/70'>Loading stats...</p>
  }

  if (error) {
    return <p className='text-error'>{error}</p>
  }

  return (
    <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <article className='card bg-base-200'>
        <div className='card-body'>
          <p className='text-base-content text-3xl font-bold'>{stats.total}</p>
          <p className='text-base-content/70'>Total Users</p>
        </div>
      </article>
      <article className='card bg-base-200'>
        <div className='card-body'>
          <p className='text-info text-3xl font-bold'>{stats.admins}</p>
          <p className='text-base-content/70'>Admins</p>
        </div>
      </article>
      <article className='card bg-base-200'>
        <div className='card-body'>
          <p className='text-success text-3xl font-bold'>{stats.verified}</p>
          <p className='text-base-content/70'>Verified</p>
        </div>
      </article>
      <article className='card bg-base-200'>
        <div className='card-body'>
          <p className='text-error text-3xl font-bold'>{stats.banned}</p>
          <p className='text-base-content/70'>Banned</p>
        </div>
      </article>
    </section>
  )
}
