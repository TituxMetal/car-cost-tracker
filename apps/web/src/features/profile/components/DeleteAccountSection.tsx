import { useState } from 'react'

import { Button } from '~/components/ui'

import { DeleteAccountDialog } from './DeleteAccountDialog'

export const DeleteAccountSection = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className='card border-error bg-base-200 border-2'>
      <div className='card-body gap-3'>
        <h2 className='card-title text-error'>Danger Zone</h2>
        <p className='text-base-content/70'>
          Once you delete your account, there is no going back.
        </p>
        <div className='card-actions'>
          <Button variant='destructive' onClick={() => setIsOpen(true)}>
            Delete Account
          </Button>
        </div>
      </div>
      <DeleteAccountDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  )
}
