import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'

export interface DialogShellProps {
  title: string
  onClose: () => void
  children: ReactNode
  description?: string
}

export const DialogShell = ({ title, onClose, children, description }: DialogShellProps) => (
  <Dialog.Root
    open={true}
    onOpenChange={open => {
      if (!open) onClose()
    }}
  >
    <Dialog.Portal>
      <Dialog.Overlay className='bg-neutral/50 fixed inset-0' onClick={onClose} />
      <Dialog.Content
        className='modal modal-open'
        onInteractOutside={event => event.preventDefault()}
        {...(!description && { 'aria-describedby': undefined })}
      >
        <div className='modal-box border-base-300 bg-base-200 border max-sm:h-screen max-sm:w-screen max-sm:max-w-full max-sm:rounded-none'>
          <Dialog.Title className='font-display mb-4 text-lg font-bold tracking-wide uppercase'>
            {title}
          </Dialog.Title>
          {description && <Dialog.Description className='py-4'>{description}</Dialog.Description>}
          {children}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)
