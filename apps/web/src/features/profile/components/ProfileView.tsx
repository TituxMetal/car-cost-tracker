import { Button } from '~/components/ui'
import type { User } from '~/types'

export interface ProfileViewProps {
  user: User
  onEdit: () => void
}

export const ProfileView = ({ user, onEdit }: ProfileViewProps) => (
  <article className='card bg-base-200'>
    <section className='card-body gap-4'>
      <h2 className='card-title'>Profile Information</h2>
      <dl className='grid grid-cols-2 gap-x-8 gap-y-1' role='list'>
        <dt className='text-base-content/70 text-sm'>Email</dt>
        <dt className='text-base-content/70 text-sm'>Username</dt>
        <dd className='text-base-content mb-3 font-medium'>{user.email}</dd>
        <dd className='text-base-content mb-3 font-medium'>{user.username}</dd>

        <dt className='text-base-content/70 text-sm'>First name</dt>
        <dt className='text-base-content/70 text-sm'>Last name</dt>
        <dd className='text-base-content mb-3 font-medium'>{user.firstName ?? '-'}</dd>
        <dd className='text-base-content mb-3 font-medium'>{user.lastName ?? '-'}</dd>

        <dt className='text-base-content/70 col-span-2 text-sm'>Email Verified</dt>
        <dd className='text-base-content col-span-2 font-medium'>
          {user.emailVerified ? (
            <span className='badge badge-success badge-sm'>Yes</span>
          ) : (
            <span className='badge badge-warning badge-sm'>No</span>
          )}
        </dd>
      </dl>

      <section className='card-actions justify-end'>
        <Button onClick={onEdit}>Edit</Button>
      </section>
    </section>
  </article>
)
