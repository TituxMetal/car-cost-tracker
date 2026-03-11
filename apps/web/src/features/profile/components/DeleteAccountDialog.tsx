import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'

import { Button, Input } from '~/components/ui'
import { authClient } from '~/lib/authClient'
import { redirect } from '~/utils/navigation'

interface DeleteAccountDialogProps {
  isOpen: boolean
  onClose: () => void
}

export const DeleteAccountDialog = ({ isOpen, onClose }: DeleteAccountDialogProps) => {
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const isConfirmed = confirmText === 'DELETE'

  useEffect(() => {
    if (isOpen) {
      setConfirmText('')
      setIsDeleting(false)
      setError(null)
    }
  }, [isOpen])

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    const { error } = await authClient.deleteUser()

    if (error) {
      setError(error.message ?? 'Failed to delete account')
      setIsDeleting(false)
      return
    }

    redirect('/')
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={open => {
        if (!open) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className='bg-neutral/50 fixed inset-0' onClick={onClose} />
        <Dialog.Content
          className='modal modal-open'
          onInteractOutside={event => event.preventDefault()}
        >
          <div className='modal-box'>
            <Dialog.Title className='text-error text-lg font-bold'>Delete Account</Dialog.Title>
            <Dialog.Description className='text-base-content/70 py-4'>
              This action is <strong>permanent</strong> and cannot be undone. All your data will be
              deleted.
            </Dialog.Description>

            <p className='text-base-content/70'>
              Type <strong className='text-error'>DELETE</strong> to confirm:
            </p>

            <Input
              type='text'
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder='Type DELETE to confirm'
              className='mt-2'
            />

            {error && <p className='text-error mt-2'>{error}</p>}

            <div className='modal-action'>
              <Button variant='outline' onClick={onClose} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={handleDelete}
                disabled={!isConfirmed || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
