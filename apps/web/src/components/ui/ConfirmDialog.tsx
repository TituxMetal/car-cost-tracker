import * as Dialog from '@radix-ui/react-dialog'

import { Button } from './Button'

export interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel
}: ConfirmDialogProps) => (
  <Dialog.Root
    open={true}
    onOpenChange={open => {
      if (!open) onCancel()
    }}
  >
    <Dialog.Portal>
      <Dialog.Overlay className='bg-neutral/50 fixed inset-0' onClick={onCancel} />
      <Dialog.Content
        className='modal modal-open'
        onInteractOutside={event => event.preventDefault()}
      >
        <div className='modal-box'>
          <Dialog.Title className='text-lg font-bold'>{title}</Dialog.Title>
          <Dialog.Description className='py-4'>{message}</Dialog.Description>
          <div className='modal-action'>
            <Button variant='outline' onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant='destructive' onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)
